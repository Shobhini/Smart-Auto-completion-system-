import { create } from 'zustand';
import WordEmbeddingModel from '../models/WordEmbeddingModel';

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.frequency = 0;
        this.lastUsed = null;
        this.contextWords = new Map(); // Track words that appear together
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.recentWords = new Set(); // Track recently used words
        this.maxRecentWords = 10; // Maximum number of recent words to track
        this.embeddingModel = new WordEmbeddingModel();
    }

    insert(word) {
        let node = this.root;
        for (let char of word.toLowerCase()) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.frequency++;
        node.lastUsed = Date.now();
        
        // Update recent words
        this.updateRecentWords(word);
        
        // Update context for the last used word
        if (this.lastUsedWord) {
            this.updateContext(this.lastUsedWord, word);
            // Train the embedding model
            this.embeddingModel.train(word, [this.lastUsedWord]);
        }
        this.lastUsedWord = word;
    }

    updateRecentWords(word) {
        this.recentWords.add(word);
        if (this.recentWords.size > this.maxRecentWords) {
            const oldestWord = Array.from(this.recentWords)[0];
            this.recentWords.delete(oldestWord);
        }
    }

    updateContext(word1, word2) {
        let node = this.findNode(word1);
        if (node) {
            const currentCount = node.contextWords.get(word2) || 0;
            node.contextWords.set(word2, currentCount + 1);
        }
    }

    findNode(word) {
        let node = this.root;
        for (let char of word.toLowerCase()) {
            if (!node.children[char]) return null;
            node = node.children[char];
        }
        return node.isEndOfWord ? node : null;
    }

    delete(word) {
        return this._delete(this.root, word.toLowerCase(), 0);
    }

    _delete(node, word, depth) {
        if (!node) return false;

        if (depth === word.length) {
            if (!node.isEndOfWord) return false;
            
            node.isEndOfWord = false;
            node.frequency = 0;
            node.lastUsed = null;
            node.contextWords.clear();
            
            return Object.keys(node.children).length === 0;
        }

        const char = word[depth];
        if (!node.children[char]) return false;

        const shouldDeleteChild = this._delete(node.children[char], word, depth + 1);

        if (shouldDeleteChild) {
            delete node.children[char];
            return Object.keys(node.children).length === 0;
        }

        return false;
    }

    getSuggestions(prefix) {
        let suggestions = [];
        let node = this.root;

        // Find the node for the prefix
        for (let char of prefix.toLowerCase()) {
            if (!node.children[char]) {
                return suggestions;
            }
            node = node.children[char];
        }

        // Collect all possible suggestions
        const collectWords = (node, word) => {
            if (node.isEndOfWord) {
                suggestions.push({
                    word: word,
                    frequency: node.frequency,
                    lastUsed: node.lastUsed,
                    contextScore: this.getContextScore(word),
                    isRecent: this.recentWords.has(word),
                    embeddingScore: this.getEmbeddingScore(word)
                });
            }
            for (let char in node.children) {
                collectWords(node.children[char], word + char);
            }
        };

        collectWords(node, prefix.toLowerCase());
        
        // Sort suggestions based on multiple factors
        return suggestions
            .sort((a, b) => {
                // Calculate weighted scores
                const scoreA = this.calculateScore(a);
                const scoreB = this.calculateScore(b);
                return scoreB - scoreA;
            })
            .map(item => item.word);
    }

    calculateScore(suggestion) {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        // Base score from frequency
        let score = suggestion.frequency * 10;
        
        // Recency bonus (words used in the last 24 hours)
        if (suggestion.lastUsed && (now - suggestion.lastUsed) < oneDay) {
            score += 5;
        }
        
        // Recent words bonus
        if (suggestion.isRecent) {
            score += 15;
        }
        
        // Context bonus
        score += suggestion.contextScore * 8;
        
        // Add embedding-based score
        score += suggestion.embeddingScore * 12;
        
        return score;
    }

    getContextScore(word) {
        if (!this.lastUsedWord) return 0;
        
        const lastNode = this.findNode(this.lastUsedWord);
        if (!lastNode) return 0;
        
        return lastNode.contextWords.get(word) || 0;
    }

    getEmbeddingScore(word) {
        if (!this.lastUsedWord) return 0;
        return this.embeddingModel.getSimilarity(word, this.lastUsedWord);
    }

    // Get similar words based on embeddings
    getSimilarWords(word, topN = 5) {
        return this.embeddingModel.getMostSimilar(word, topN);
    }

    // Save model state
    saveModel() {
        return {
            recentWords: Array.from(this.recentWords),
            embeddingModel: this.embeddingModel.save()
        };
    }

    // Load model state
    loadModel(state) {
        this.recentWords = new Set(state.recentWords);
        this.embeddingModel.load(state.embeddingModel);
    }
}

const useTrieStore = create((set, get) => ({
    trie: new Trie(),
    words: [],
    suggestions: [],
    searchValue: '',
    error: null,
    similarWords: [],

    initializeWords: (words) => {
        const trie = get().trie;
        
        // Load search history if available
        try {
            const searchHistory = localStorage.getItem('searchHistory');
            if (searchHistory) {
                const historyWords = searchHistory.split('\n').filter(word => word.trim());
                // Insert history words into Trie
                historyWords.forEach(word => {
                    trie.insert(word);
                });
                // Load into embedding model
                trie.embeddingModel.loadFromTextFile(historyWords.join(' '));
            }
        } catch (error) {
            console.warn('Failed to load search history:', error);
        }

        // Initialize with provided words
        words.forEach(word => {
            const frequency = Math.floor(Math.random() * 5) + 1;
            for (let i = 0; i < frequency; i++) {
                trie.insert(word);
            }
        });
        set({ words: [...words] });
    },

    setSearchValue: (value) => {
        const trie = get().trie;
        const suggestions = value ? trie.getSuggestions(value) : [];
        
        // Save to search history
        if (value) {
            try {
                const searchHistory = localStorage.getItem('searchHistory') || '';
                const newHistory = searchHistory + '\n' + value;
                localStorage.setItem('searchHistory', newHistory);
            } catch (error) {
                console.warn('Failed to save search history:', error);
            }
        }
        
        set({ 
            searchValue: value,
            suggestions,
            error: null
        });
    },

    addWord: (word) => {
        try {
            const trie = get().trie;
            trie.insert(word);
            const similarWords = trie.getSimilarWords(word);
            set(state => ({ 
                words: [...state.words, word],
                suggestions: [],
                similarWords,
                error: null
            }));
        } catch (error) {
            set({ error: 'Failed to add word' });
        }
    },

    removeWord: (word) => {
        try {
            const trie = get().trie;
            trie.delete(word);
            set(state => ({ 
                words: state.words.filter(w => w !== word),
                searchValue: state.searchValue === word ? '' : state.searchValue,
                suggestions: state.searchValue === word ? [] : state.suggestions,
                error: null
            }));
        } catch (error) {
            set({ error: 'Failed to remove word' });
        }
    },

    getSimilarWords: (word) => {
        const trie = get().trie;
        const similarWords = trie.getSimilarWords(word);
        set({ similarWords });
    }
}));

export default useTrieStore; 
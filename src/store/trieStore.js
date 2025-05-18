import { create } from 'zustand';

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.frequency = 0;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
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

        for (let char of prefix.toLowerCase()) {
            if (!node.children[char]) {
                return suggestions;
            }
            node = node.children[char];
        }

        const collectWords = (node, word) => {
            if (node.isEndOfWord) {
                suggestions.push({
                    word: word,
                    frequency: node.frequency
                });
            }
            for (let char in node.children) {
                collectWords(node.children[char], word + char);
            }
        };

        collectWords(node, prefix.toLowerCase());
        
        return suggestions
            .sort((a, b) => b.frequency - a.frequency)
            .map(item => item.word);
    }
}

const useTrieStore = create((set, get) => ({
    trie: new Trie(),
    words: [],
    suggestions: [],
    searchValue: '',
    error: null,

    initializeWords: (words) => {
        const trie = get().trie;
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
            set(state => ({ 
                words: [...state.words, word],
                suggestions: [],
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
    }
}));

export default useTrieStore; 
class WordEmbeddingModel {
    constructor(vectorSize = 50) {
        this.vectorSize = vectorSize;
        this.wordVectors = new Map();
        this.learningRate = 0.01;
        this.windowSize = 2;
        this.minFrequency = 1; // Minimum frequency for a word to be included
        this.wordFrequencies = new Map(); // Track word frequencies
    }

    // Initialize or get vector for a word
    getVector(word) {
        if (!this.wordVectors.has(word)) {
            // Initialize with random values between -1 and 1
            const vector = Array.from({ length: this.vectorSize }, 
                () => Math.random() * 2 - 1);
            this.wordVectors.set(word, vector);
        }
        return this.wordVectors.get(word);
    }

    // Update vectors based on context
    train(word, context) {
        const wordVector = this.getVector(word);
        
        // Update based on each context word
        context.forEach(contextWord => {
            const contextVector = this.getVector(contextWord);
            
            // Calculate word frequency weights
            const wordFreq = this.wordFrequencies.get(word) || 1;
            const contextFreq = this.wordFrequencies.get(contextWord) || 1;
            const weight = Math.sqrt(wordFreq * contextFreq);
            
            // Weighted gradient descent update
            for (let i = 0; i < this.vectorSize; i++) {
                const gradient = wordVector[i] - contextVector[i];
                const weightedGradient = gradient * weight;
                
                wordVector[i] -= this.learningRate * weightedGradient;
                contextVector[i] += this.learningRate * weightedGradient;
            }
        });
    }

    // Get similarity between two words
    getSimilarity(word1, word2) {
        const vec1 = this.getVector(word1);
        const vec2 = this.getVector(word2);
        
        // Cosine similarity
        const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
        const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
        
        return dotProduct / (magnitude1 * magnitude2);
    }

    // Get most similar words
    getMostSimilar(word, topN = 5) {
        const similarities = [];
        for (const [otherWord, _] of this.wordVectors) {
            if (otherWord !== word) {
                similarities.push({
                    word: otherWord,
                    similarity: this.getSimilarity(word, otherWord)
                });
            }
        }
        
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topN);
    }

    // Save model state
    save() {
        return {
            vectorSize: this.vectorSize,
            wordVectors: Array.from(this.wordVectors.entries())
        };
    }

    // Load model state
    load(state) {
        this.vectorSize = state.vectorSize;
        this.wordVectors = new Map(state.wordVectors);
    }

    // Load and train from a dataset
    loadAndTrainFromDataset(dataset, options = {}) {
        const {
            minFrequency = 1,
            windowSize = 2,
            epochs = 1
        } = options;

        this.minFrequency = minFrequency;
        this.windowSize = windowSize;

        // First pass: count frequencies
        dataset.forEach(word => {
            const count = this.wordFrequencies.get(word) || 0;
            this.wordFrequencies.set(word, count + 1);
        });

        // Filter words by frequency
        const validWords = dataset.filter(word => 
            this.wordFrequencies.get(word) >= this.minFrequency
        );

        // Train for specified number of epochs
        for (let epoch = 0; epoch < epochs; epoch++) {
            for (let i = 0; i < validWords.length; i++) {
                const word = validWords[i];
                const context = this.getContext(validWords, i);
                this.train(word, context);
            }
        }
    }

    // Get context words for a given word
    getContext(words, index) {
        const context = [];
        const start = Math.max(0, index - this.windowSize);
        const end = Math.min(words.length, index + this.windowSize + 1);

        for (let i = start; i < end; i++) {
            if (i !== index) {
                context.push(words[i]);
            }
        }
        return context;
    }

    // Load from search history or other text file
    loadFromTextFile(text) {
        const words = text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 0);
        
        this.loadAndTrainFromDataset(words, {
            minFrequency: 1,
            windowSize: 2,
            epochs: 2
        });
    }
}

export default WordEmbeddingModel; 
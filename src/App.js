import React, { useEffect } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import SearchBar from './components/SearchBar';
import WordList from './components/WordList';
import useTrieStore from './store/trieStore';

const sampleWords = [
    // Programming terms
    'algorithm', 'binary', 'compiler', 'database', 'encryption', 'function',
    'graphics', 'hash', 'interface', 'javascript', 'kernel', 'library',
    'memory', 'network', 'object', 'program', 'query', 'recursion',
    'server', 'thread', 'variable', 'web', 'xml', 'yaml', 'zip',
    
    // Common words
    'apple', 'application', 'banana', 'ball', 'cat', 'car', 'dog', 'door',
    'elephant', 'flower', 'garden', 'house', 'internet', 'jacket',
    'keyboard', 'laptop', 'monitor', 'notebook', 'orange', 'pencil',
    'question', 'rainbow', 'sunshine', 'tree', 'umbrella', 'violin',
    'water', 'xylophone', 'yellow', 'zebra',
    
    // Technical terms
    'api', 'backend', 'cache', 'debug', 'encrypt', 'firewall',
    'gateway', 'host', 'index', 'json', 'key', 'load',
    'microservice', 'node', 'optimize', 'protocol', 'queue',
    'rest', 'security', 'token', 'url', 'version', 'webhook'
];

function App() {
    const { initializeWords, error } = useTrieStore();

    useEffect(() => {
        initializeWords(sampleWords);
    }, [initializeWords]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                my: 4, 
                p: 3, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3
            }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Autocomplete with Trie
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <SearchBar />
                <WordList />
            </Box>
        </Container>
    );
}

export default App; 
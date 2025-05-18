import React, { useEffect, useState } from 'react';
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
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        initializeWords(sampleWords);
        
        // Preload the background image
        const img = new Image();
        img.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80";
        img.onload = () => setImageLoaded(true);
    }, [initializeWords]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: imageLoaded 
                    ? 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80")'
                    : 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                transition: 'background-image 0.3s ease-in-out'
            }}
        >
            <Container maxWidth="sm">
                <Box sx={{ 
                    my: 4, 
                    p: 4, 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease-in-out'
                }}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom 
                        align="center"
                        sx={{
                            color: '#1a237e',
                            fontWeight: 'bold',
                            mb: 4
                        }}
                    >
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
        </Box>
    );
}

export default App; 
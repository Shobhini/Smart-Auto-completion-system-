import React from 'react';
import { Box, TextField, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import useTrieStore from '../store/trieStore';

function SearchBar() {
    const { searchValue, suggestions, setSearchValue, addWord } = useTrieStore();

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchValue(suggestion);
        addWord(suggestion);
    };

    const handleClear = () => {
        setSearchValue('');
    };

    return (
        <Box sx={{ position: 'relative', mb: 2 }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type to search..."
                    value={searchValue}
                    onChange={handleInputChange}
                    sx={{ mb: 1 }}
                />
                {searchValue && (
                    <IconButton
                        onClick={handleClear}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'text.secondary'
                        }}
                    >
                        <ClearIcon />
                    </IconButton>
                )}
            </Box>
            
            {suggestions.length > 0 && searchValue && (
                <Paper 
                    elevation={3}
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        maxHeight: 200,
                        overflow: 'auto',
                        zIndex: 1000,
                        mt: -1,
                        bgcolor: 'background.paper',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '4px',
                            '&:hover': {
                                background: '#555',
                            },
                        },
                    }}
                >
                    <List>
                        {suggestions.map((suggestion, index) => (
                            <ListItem
                                key={index}
                                button
                                onClick={() => handleSuggestionClick(suggestion)}
                                sx={{
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        transform: 'translateX(8px)',
                                        '& .MuiListItemText-primary': {
                                            color: '#1976d2',
                                            fontWeight: 500,
                                        },
                                    },
                                    '&:active': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                    },
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': {
                                        borderBottom: 'none',
                                    },
                                }}
                            >
                                <ListItemText 
                                    primary={suggestion}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            transition: 'all 0.2s ease-in-out',
                                        },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

export default SearchBar; 
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
            
            {suggestions.length > 0 && (
                <Paper 
                    elevation={3}
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        maxHeight: 200,
                        overflow: 'auto',
                        zIndex: 1000,
                        mt: -1
                    }}
                >
                    <List>
                        {suggestions.map((suggestion, index) => (
                            <ListItem
                                key={index}
                                button
                                onClick={() => handleSuggestionClick(suggestion)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    }
                                }}
                            >
                                <ListItemText primary={suggestion} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

export default SearchBar; 
import React from 'react';
import { Box, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useTrieStore from '../store/trieStore';

function WordList() {
    const { words, removeWord } = useTrieStore();

    return (
        <Paper 
            elevation={2}
            sx={{
                maxHeight: 300,
                overflow: 'auto',
                mt: 2,
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
                {words.map((word, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '& .MuiListItemText-primary': {
                                    color: '#1976d2',
                                    fontWeight: 500,
                                },
                                '& .MuiIconButton-root': {
                                    color: '#d32f2f',
                                    transform: 'scale(1.1)',
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
                            primary={word}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    transition: 'all 0.2s ease-in-out',
                                },
                            }}
                        />
                        <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => removeWord(word)}
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default WordList; 
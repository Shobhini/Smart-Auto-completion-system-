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
                mt: 2
            }}
        >
            <List>
                {words.map((word, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={() => removeWord(word)}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child': {
                                borderBottom: 'none'
                            }
                        }}
                    >
                        <ListItemText primary={word} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default WordList; 
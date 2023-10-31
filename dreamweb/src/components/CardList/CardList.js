import React from 'react';
import { Grid, Box } from '@mui/material';

import Card from '../Card/Card.js';

const CardList = ({ data }) => {
    console.log({data});
    return (
        <Box p={1}> {/* This adds padding around the grid */}
            <Grid container spacing={1} justifyContent="center">
                {
                    data.map((entry, i) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card 
                                    userId={entry.user.id}
                                    userName={entry.user.discord_nickname}
                                    userAvatar={entry.user.discord_avatar}
                                    prompt={entry.dream.prompt}
                                    negativePrompt={entry.dream.negative_prompt}
                                    imagination={entry.dream.imagination}
                                    style={entry.dream.style}
                                    imageUrl={entry.dream.image_url}
                                    timestamp={entry.dream.timestamp}
                                />
                            </Grid>
                        ); 
                    })
                }
            </Grid>
        </Box>
    );
}

export default CardList;
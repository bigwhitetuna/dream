import React from 'react';
import Card from './Card.js';

const CardList = ({ data }) => {
    console.log({data});
    return (
        <div className='card-container flex flex-wrap justify-center'>
            {
                data.map((entry, i) => {
                    return (
                        <Card 
                            key={i} 
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
                    ); 
                })
            }
        </div>
    );
}

export default CardList;

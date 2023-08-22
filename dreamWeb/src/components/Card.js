import React, { useState } from 'react';
import './Card.css'; // Let's assume you have a CSS file named Card.css.

const Card = ({                             
  userId,
  userName,
  userAvatar,
  prompt,
  negativePrompt,
  imagination,
  style,
  imageUrl,
  timestamp }) => {

    const [isFavorited, setIsFavorited] = useState(false);

    const toggleFavorite = () => {
      setIsFavorited(!isFavorited);
      // NOTE: eventually, this will be a call to the database to update the user's favorites
    }

    // format timestamp for display
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }

    // render the component
    return (
        <div className='card tc dib br3 pa3 ma2 bw2 shadow-5 w-100 w-33-l'>
            <img src={imageUrl} alt={prompt} className='card-image w-100 h-100 db center br3 br--top' loading="lazy"/>
            <div className='card-details'>
              <img src={userAvatar} alt="User Avatar" className='user-avatar'/>
              <p className='username'><strong>{userName}</strong></p>
              <p><strong>Prompt:</strong> {prompt}</p>
              {negativePrompt && <p><strong>Negative Prompt:</strong> {negativePrompt}</p>}
              {imagination && <p><strong>Imagination:</strong> {imagination}</p>}
              {style && <p><strong>Imagination:</strong> {style}</p>}
              <p className='date-display'><strong>{formatDate(timestamp)}</strong></p>
              {isFavorited && (
                <span className='favorited' onClick={toggleFavorite}>
                  ★
                </span>
              )}
              {!isFavorited && (
                <span className='favorite-icon' onClick={toggleFavorite}>
                  ☆
                </span>
              )}
            </div>
        </div>  
    );
}

export default Card;
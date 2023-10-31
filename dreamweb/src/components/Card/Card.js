import React, { useState } from 'react';
import CardMUI from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const Card = ({                             
  userId,
  userName,
  userAvatar,
  prompt,
  negativePrompt,
  imagination,
  style,
  imageUrl,
  timestamp,
  }) => {

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
      <CardMUI sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia 
              component="img"
              image={imageUrl}
              alt={prompt}
              title={prompt}
              sx={{ transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.1)' } }}
          />
          <CardContent sx={{
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              background: 'rgba(0,0,0,0.8)', color: 'white', opacity: 0,
              transition: 'opacity 0.3s',
              '&:hover': { opacity: 1 }
          }}>
              <Avatar src={userAvatar} alt="User Avatar" sx={{ width: 60, height: 60, mb: 1 }} />
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {userName}
              </Typography>
              <Typography variant="body2" component="div">
                  <strong>Prompt:</strong> {prompt}
              </Typography>
              {negativePrompt && (
                  <Typography variant="body2" component="div">
                      <strong>Negative Prompt:</strong> {negativePrompt}
                  </Typography>
              )}
              {imagination && (
                  <Typography variant="body2" component="div">
                      <strong>Imagination:</strong> {imagination}
                  </Typography>
              )}
              {style && (
                  <Typography variant="body2" component="div">
                      <strong>Style:</strong> {style}
                  </Typography>
              )}
              <Typography variant="body2" component="div" sx={{ mt: 3 }}>
                  <strong>{formatDate(timestamp)}</strong>
              </Typography>
              <IconButton color="primary" onClick={toggleFavorite}>
                  {isFavorited ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
          </CardContent>
      </CardMUI>
  );
}

export default Card;
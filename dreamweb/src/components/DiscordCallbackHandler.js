import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DiscordCallbackHandler = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log("Got code:", code);
      axios.get(`http://127.0.0.1:8000/auth/callback?code=${code}`)
        .then(response => {
          if (response.data.status === 'success') {
            setUser(response.data.userData); // assume that your backend sends back the user data
            navigate('/grid');
          } else {
            navigate('/unauthorized');
          }
        })
        .catch(error => {
          console.error("Error in Discord OAuth callback:", error);
        });
    }
  }, [navigate, setUser]);

  return null;
}

export default DiscordCallbackHandler;
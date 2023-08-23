import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ValidateSession = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/validatesession', { withCredentials: true })
      .then(response => {
        if (response.data.valid) {
          const userData = response.data.userData;
          console.log("User data:", userData)
          setUser(userData);
          navigate('/'); // Navigate to a route accessible only when authenticated
        } else {
          navigate('/login'); // Navigate to the login page if not authenticated
        }
      })
      .catch(error => {
        console.error("Error during session validation:", error);
        navigate('/error'); // Navigate to an error page
      });
  }, [setUser, navigate]);

  return null; // This component does not render anything
};

export default ValidateSession;

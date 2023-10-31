import React, { Component } from 'react';
import { loginUrl } from '../api';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

class DiscordLoginButton extends Component {
    state = {
        discordUrl: '',
        isLoading: true // Use this to prevent button click before URL is fetched
    }

    componentDidMount() {
        loginUrl()
        .then(response => {
            console.log("Discord OAuth URL fetched", response.data.url)
            this.setState({ discordUrl: response.data.url, isLoading: false });
        })
        .catch(error => {
            console.error("Error fetching the Discord OAuth URL", error);
            this.setState({ isLoading: false });
        });
    }

    handleLoginClick = () => {
        const { user } = this.props;
        console.log("Login button clicked. Current user state:", user ? user : "No user logged in")
        // TODO: Add logic to handle if the user is already logged in, or wants to log out
        if (user) {
            // Logic to log out the user. 
            // If you have a logout endpoint in your backend, 
            // call it here to destroy the session. 
            // After that, reset the user state.
            this.props.setUser(null);
        } else {
            // TODO: update to use Navigate from react-router-dom
            window.location.href = this.state.discordUrl;
        }
    }

    render() {
        const { user } = this.props;
    
        if (this.state.isLoading) {
            return <p>Loading...</p>; // or you can use MUI's CircularProgress for a spinner
        }
    
        return (
            <Button 
                variant="contained" 
                color="primary" 
                onClick={this.handleLoginClick}
                sx={{
                    backgroundColor: '#333333', // Dark gray
                    color: 'white', // Text color
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: '#1a1a1a', // Even darker gray
                    }
                }}
            >
                {user ? (
                    <Avatar src={user.iconURL} alt="Discord Icon" />
                ) : (
                    "Login with Discord"
                )}
            </Button>
        );
    }    
}

export default DiscordLoginButton;
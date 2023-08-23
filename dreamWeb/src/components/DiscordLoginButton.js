import React, { Component } from 'react';
import { loginUrl } from './api';
import './DiscordLoginButton.css';

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
            return <p>Loading...</p>; // or you can render a spinner
        }

        return (
            <button className='discord-login-btn' onClick={this.handleLoginClick}>
                {user ? (
                    <img src={user.iconURL} alt="Discord Icon" className="discord-icon" />
                ) : (
                    "Login with Discord"
                )}
            </button>
        );
    }
}

export default DiscordLoginButton;
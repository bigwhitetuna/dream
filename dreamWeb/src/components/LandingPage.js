import React from 'react';
import { Navigate } from 'react-router-dom';
import DiscordLoginButton from './DiscordLoginButton';

function LandingPage({ user, setUser }) {
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="landing-container">
            <h1>Welcome to PoontangValley</h1>
            <p>Please log in to continue</p>
            <DiscordLoginButton user={user} setUser={setUser} />
        </div>
    );
}

export default LandingPage;

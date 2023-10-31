import React from 'react';
import SearchBox from '../SearchBox/SearchBox';
import DiscordLoginButton from '../DiscordLoginButton/DiscordLoginButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Header = ({ onSearchChange, user, setUser }) => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6">
                    DreamBot
                </Typography>
                {user && (
                    <div className="navigation-tab">
                        {/* Navigation content */}
                    </div>
                )}
                <SearchBox searchChange={onSearchChange} />
                <Box flexGrow={1} />
                <DiscordLoginButton />
            </Toolbar>
        </AppBar>
    );
}


export default Header;
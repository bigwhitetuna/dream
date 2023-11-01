import React from 'react';
import SearchBox from '../SearchBox/SearchBox';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import DiscordLoginButton from '../DiscordLoginButton/DiscordLoginButton';
import UserSelectDropdown from '../UserSelectDropdown/UserSelectDropdown';

const Header = ({ searchChange, user, setUser, uniqueUsers, selectedUser, handleUserChange }) => {

    // Handles for switching between navigation tabs
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#683b74' }}>
            <Toolbar>
                <Typography variant="h6">
                    DreamBot
                </Typography>
                <Tabs value={value} onChange={handleChange} aria-label='navigation tabs' sx={{ ml: 2 }}>
                    <Tab label="Images" />
                    {/* <Tab label="Stats" /> */}
                    {/* <Tab label="Contact" /> */}
                </Tabs>
                <Box flexGrow={1} />
                <UserSelectDropdown 
                            users={uniqueUsers} 
                            selectedUser={selectedUser} 
                            handleUserChange={handleUserChange} 
                        />
                <SearchBox searchChange={searchChange} />
                {/* TODO: Re-enable this when implementing 0Auth */}
                {/* <DiscordLoginButton /> */}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
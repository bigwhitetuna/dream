import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, OutlinedInput } from '@mui/material';

const UserSelectDropdown = ({ users, selectedUser, handleUserChange }) => {
    return (
        <FormControl 
            fullWidth 
            variant="outlined" 
            sx={{
                margin: '10px 0', // Adjust vertical space
                width: ['100%', null, '25%'] // Adjust width for responsive design
            }}
        >
            <InputLabel 
                id="user-select-label"
                sx={{ color: 'white' }}
            >
                Filter by User
            </InputLabel>
            <Select
                labelId="user-select-label"
                id="user-select"
                value={selectedUser}
                onChange={handleUserChange}
                label="Filter by User"
                sx={{
                    backgroundColor: 'rgba(68, 68, 68, 0.8)', // Dark gray background
                    color: 'white', // White text
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // White outline
                    },
                }}
                input={<OutlinedInput />}
            >
                <MenuItem value="">
                    <em>All Users</em>
                </MenuItem>
                {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                        {user.name || user.discord_nickname}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default UserSelectDropdown;

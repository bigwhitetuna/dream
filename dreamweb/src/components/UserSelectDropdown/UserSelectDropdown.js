import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, OutlinedInput } from '@mui/material';

const UserSelectDropdown = ({ users, selectedUser, handleUserChange }) => {
    return (
        <FormControl 
            fullWidth 
            variant="outlined" 
            sx={{
                margin: '10px 0',
                width: ['100%', null, '25%'],
                '.MuiOutlinedInput-root': {
                    height: '30px', // Example height, adjust as needed
                    backgroundColor: 'transparent', // Transparent background when not focused
                    '&:hover': {
                        backgroundColor: 'rgba(68, 68, 68, 0.4)', // Lighter gray on hover
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'rgba(68, 68, 68, 0.8)', // Dark gray when focused
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // White outline
                    },
                    '& .MuiSelect-select': {
                        color: 'white', // White text color
                    },
                },
            }}
        >
            <InputLabel 
                id="user-select-label"
                sx={{ 
                    color: 'white',
                    lineHeight: '30px',// Match this to the height of your Select component
                    top: '50%',// This centers the label vertically
                    transform: 'translate(0, -50%)', // Adjust this if necessary to center the label
                    paddingLeft: '5px', // Adjust this if necessary to align the label text
                    }}
            >
                Filter by User
            </InputLabel>
            <Select
                labelId="user-select-label"
                id="user-select"
                value={selectedUser}
                onChange={handleUserChange}
                label="Filter by User"
                input={<OutlinedInput />}
            >
                <MenuItem value="">
                    <em>All Users</em>
                </MenuItem>
                {users.map(user => (
                    <MenuItem 
                        key={user.id} 
                        value={user.id} 
                        sx={{ 
                            color: 'white', 
                            backgroundColor: 'rgba(68, 68, 68, 0.8)',
                            '&:hover': {
                                backgroundColor: 'rgba(68, 68, 68)', // Darker gray on hover
                                color: 'black', // Black text color on hover
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(68, 68, 68)', // Dark gray for selected item
                                color: 'black', // Black text color for selected item
                                '&:hover': {
                                    backgroundColor: 'rgba(68, 68, 68)', // Maintain dark gray on hover for selected item
                                },
                            },
                        }}
                    >
                        {user.name || user.discord_nickname}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default UserSelectDropdown;
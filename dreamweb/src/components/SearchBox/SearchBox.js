import TextField from '@mui/material/TextField';

const SearchBox = ({ searchChange }) => {
    return (
        <TextField 
            variant="outlined"
            placeholder="search prompts"
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    searchChange(event);
                }
            }}
            sx={{ 
                maxWidth: '300px', 
                ml: 2,
                mr: 2,
                '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: 'white', // Outline color when focused
                    },
                },
                '& .MuiInputBase-input': {
                    color: 'white', // Text color
                    fontWeight: 'bold', // Text weight
                },
            }}
        />
    );
}

export default SearchBox;
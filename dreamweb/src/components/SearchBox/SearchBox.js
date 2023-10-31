import TextField from '@mui/material/TextField';

const SearchBox = ({ searchChange }) => {
    return (
        <TextField 
            variant="outlined"
            placeholder="search prompts"
            onChange={searchChange}
            sx={{ maxWidth: '300px', ml: 2 }}
        />
    );
}

export default SearchBox;
import React from 'react';

const SearchBox = ({ searchChange }) => {
    return (
        <div className='pa2'>
            <input
                className='pa2 w-100 ba b--green bg-lightest-blue' 
                type='search' 
                placeholder='search prompts'
                onChange={searchChange}
            />
        </div>
    )
}

export default SearchBox
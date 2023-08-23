import React from 'react';
import SearchBox from './SearchBox';
import DiscordLoginButton from './DiscordLoginButton';
import './Header.css';

const Header = ({ onSearchChange, user, setUser }) => {
    return (
        <div className='header-container flex justify-between items-center pa3'>
            <h1 className='f1 ma0'>DreamBot</h1>
            {user && (
                <div className="navigation-tab">
                    {/* Navigation content */}
                </div>
            )}
            <div className='search-container'>
                <SearchBox searchChange={onSearchChange}/>
            </div>
            <DiscordLoginButton />
        </div>
    );
}

export default Header;
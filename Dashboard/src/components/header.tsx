import React from 'react';


function Header() {
    return (
        <div className="search-container">
            <input 
                type="text" 
                className="search-input" 
                placeholder="Search" 
            />
            <div className="header-controls">
                <button>
                    <span>👤</span>
                </button>
            </div>
        </div>
    );
}

export default Header;
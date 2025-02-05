import React from 'react';
import { useNavigate } from 'react-router-dom';


function Header() {
    const navigate = useNavigate();
    
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userRole");
    localStorage.removeItem("registeredUsers");
    navigate("/login");
  };

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
      <button 
        onClick={handleLogout}
      >
        Cerrar Sesión
      </button>

            </div>
        </div>
    );
}

export default Header;
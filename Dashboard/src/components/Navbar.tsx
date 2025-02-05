import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      setUserInfo(user);
      setShowWarning(user.role === 'user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userRole");
    localStorage.removeItem("registeredUsers");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        {userInfo && (
          <div className="user-welcome">
            <span>👋 Bienvenido,</span>
            <span className="user-name">{userInfo.name}</span>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </button>
        {showWarning && (
          <div className="role-warning">
            <span>⚠️ Tu rol aún no ha sido asignado. Contacta al administrador.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar; 
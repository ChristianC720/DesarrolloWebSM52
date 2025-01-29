import { useState, useEffect } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState("");
  const [specialCharError, setSpecialCharError] = useState("");

  const navigate = useNavigate();

  //Aca verificamos que no se puedan usar caracteres especiales con este parametro//
  const validateInput = (input: string): boolean => {
    const regex = /^[a-zA-Z0-9@.]*$/; // Permite solo letras, números, @ y .
    return regex.test(input);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setEmail(value);
      setSpecialCharError("");
    } else {
      setSpecialCharError("No se permiten caracteres especiales, intente de nuevo.");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setPassword(value);
      setSpecialCharError("");
    } else {
      setSpecialCharError("No se permiten caracteres especiales, intente de nuevo.");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setName(value);
      setSpecialCharError("");
    } else {
      setSpecialCharError("No se permiten caracteres especiales, intente de nuevo.");
    }
  };

  const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setApellido(value);
      setSpecialCharError("");
    } else {
      setSpecialCharError("No se permiten caracteres especiales, intente de nuevo.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const isAdmin = decodedToken.role === 1;
        navigate(isAdmin ? "/dashboard" : "/perfil");
      } catch (error) {
        console.error("Error decodificando el token:", error);
        localStorage.removeItem("access_token");
      }
    }
  }, [navigate]);

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError("");
    setSpecialCharError("");
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        password: password,
      });

      localStorage.setItem("access_token", response.data.access_token);

      const decodedToken: any = jwtDecode(response.data.access_token);
      const isAdmin = decodedToken.role === 1;

      if (isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/perfil");
      }

      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError("Correo o contraseña incorrectos");
    }
  };

  const handleRegister = async () => {
    const userData = {
      name: name,
      apellido: apellido,
      email: email,
      password: password,
    };

    try {
      await axios.post('http://localhost:3000/auth', userData);
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="login-container">
      <div className={`panel ${isLogin ? "login" : "register"}`}>
        {isLogin ? (
          <div className="login-section">
            <div className="form">
              <div className="titulo">Iniciar Sesión</div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
              {specialCharError && <p className="error">{specialCharError}</p>}
              <button className="btn-login" onClick={handleLogin}>INICIAR SESIÓN</button>
              {error && <p className="error">{error}</p>}
            </div>
            <div className="welcome">
              <div className="titulo">¡Bienvenido!</div>
              <p>Ingresa tu usuario y contraseña para poder iniciar sesión</p>
              <button onClick={toggleView} className="btn-secondary">
                REGÍSTRATE
              </button>
            </div>
          </div>
        ) : (
          <div className="register-section">
            <div className="welcome">
              <div className="titulo">¡Regístrate!</div>
              <p>Cree una cuenta utilizando un correo electrónico y una contraseña</p>
              <button onClick={toggleView} className="btn-secondary">
                INICIA SESIÓN
              </button>
            </div>
            <div className="form">
              <div className="titulo">Crear cuenta</div>
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={handleNameChange}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={handleApellidoChange}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
              {specialCharError && <p className="error">{specialCharError}</p>}
              <button className="btn-register" onClick={handleRegister}>Registrate</button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
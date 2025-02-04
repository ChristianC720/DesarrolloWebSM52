import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from '../services/userService';
import QRCode from 'qrcode.react';
import "../styles/login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    setter(e.target.value);
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError("");
    // Clear form fields
    setEmail("");
    setPassword("");
    setName("");
    setApellido("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        console.log('Attempting login with:', email); // Debug log
        const user = await userService.findUserByEmail(email);
        
        if (!user) {
          setError("Usuario no encontrado");
          return;
        }

        console.log('Found user:', user); // Debug log
        const isValidPassword = await userService.verifyPassword(password, user.password);
        console.log('Password validation result:', isValidPassword); // Debug log

        if (!isValidPassword) {
          setError("Contraseña incorrecta");
          return;
        }

        setCurrentUser(user);
        const qrUrl = userService.getTwoFactorQRCodeUrl(email, user.twoFactorSecret);
        setQrCodeUrl(qrUrl);
        setShowTwoFactor(true);
      } else {
        handleRegister();
      }
    } catch (error: any) {
      console.error('Login error:', error); // Debug log
      setError(error.message || "Error en la autenticación");
    }
  };

  const handleTwoFactorSubmit = async () => {
    try {
      if (twoFactorCode.length !== 6) {
        setError("El código debe tener 6 dígitos");
        return;
      }

      const isValid = userService.verifyTwoFactorToken(
        twoFactorCode, 
        currentUser.twoFactorSecret,
        currentUser.id
      );
      
      if (!isValid) {
        setError("Código 2FA inválido");
        setTwoFactorCode('');
        return;
      }

      // Update user verification status if first time
      if (!currentUser.verified) {
        await userService.updateUserVerification(currentUser.id);
      }

      // Create session
      localStorage.setItem("user", JSON.stringify({
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
        name: currentUser.name
      }));

      navigate(currentUser.role === 1 ? "/dashboard" : "/perfil");

    } catch (error: any) {
      console.error('Error en verificación 2FA:', error);
      setError(error.message || "Error en verificación 2FA");
      setTwoFactorCode('');
    }
  };

  const handleRegister = async () => {
    try {
      if (!email || !password || !name || !apellido) {
        setError("Por favor complete todos los campos");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Formato de email inválido");
        return;
      }

      // Validate password strength
      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres");
        return;
      }

      await userService.createUser({
        name,
        apellido,
        email,
        password,
        role: 2 // Default role for new users
      });

      setIsLogin(true);
      setError("Registro exitoso. Por favor inicie sesión.");
      
      // Clear form
      setEmail("");
      setPassword("");
      setName("");
      setApellido("");

    } catch (error: any) {
      console.error('Error al registrar:', error);
      setError(error.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="login-container">
      {!showTwoFactor ? (
        <div className={`panel ${isLogin ? "login" : "register"}`}>
          {isLogin ? (
            <div className="login-section">
              <div className="form">
                <div className="titulo">Iniciar Sesión</div>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                />
                <button className="btn-login" onClick={handleSubmit}>
                  INICIAR SESIÓN
                </button>
                {error && <p className="error">{error}</p>}
              </div>
              <div className="welcome">
                <div className="titulo">¡Bienvenido!</div>
                <p>¿No tienes una cuenta?</p>
                <button onClick={toggleView} className="btn-secondary">
                  REGÍSTRATE
                </button>
              </div>
            </div>
          ) : (
            <div className="register-section">
              <div className="welcome">
                <div className="titulo">¡Regístrate!</div>
                <p>¿Ya tienes una cuenta?</p>
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
                  onChange={(e) => handleInputChange(e, setName)}
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => handleInputChange(e, setApellido)}
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                />
                <button className="btn-register" onClick={handleRegister}>
                  REGISTRARSE
                </button>
                {error && <p className="error">{error}</p>}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="panel">
          <div className="form">
            <div className="titulo">Verificación en dos pasos</div>
            {!currentUser?.verified && (
              <div className="qr-section">
                <p>Escanea este código QR con tu aplicación de autenticación:</p>
                <QRCode value={qrCodeUrl} size={200} />
              </div>
            )}
            <input
              type="text"
              placeholder="Ingresa el código de 6 dígitos"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              maxLength={6}
            />
            <button className="btn-login" onClick={handleTwoFactorSubmit}>
              Verificar
            </button>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
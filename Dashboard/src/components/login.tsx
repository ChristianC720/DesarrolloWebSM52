import { useState, useEffect } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import MFAQuestions from "./MFAQuestions";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface NewUser extends UserInfo {
  apellido: string;
  password: string;
}

interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_SECURITY_QUESTIONS = [
  {
    id: "q1",
    question: "¿Cuál es el nombre de tu primera mascota?"
  },
  {
    id: "q2",
    question: "¿En qué ciudad naciste?"
  }
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState("");
  const [specialCharError, setSpecialCharError] = useState("");
  const [showMFA, setShowMFA] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([]);
  const [showRegisterMFA, setShowRegisterMFA] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const navigate = useNavigate();

  const validateInput = (input: string): boolean => {
    const regex = /^[a-zA-Z0-9@.]*$/;
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
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user: UserInfo = JSON.parse(userInfo);
      navigate(user.role === 'admin' ? "/dashboard" : "/perfil");
    }
  }, [navigate]);

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError("");
    setSpecialCharError("");
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/users.json');
      const users = await response.json();
      
      let user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        const storedUsers = localStorage.getItem('registeredUsers');
        const registeredUsers: NewUser[] = storedUsers ? JSON.parse(storedUsers) : [];
        user = registeredUsers.find(u => u.email === email && u.password === password);
      }
      
      if (!user) {
        setError("Correo o contraseña incorrectos");
        return;
      }

      if (user.securityQuestions && user.securityQuestions.length > 0) {
        setCurrentUser(user);
        setSecurityQuestions(user.securityQuestions);
        setShowMFA(true);
      } else {
        completeLogin(user);
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError("Error al iniciar sesión");
    }
  };

  const completeLogin = (user: any) => {
    const userInfo: UserInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("userRole", user.role);

    switch(user.role) {
      case 'admin':
        navigate("/dashboard");
        break;
      case 'analyst':
        navigate("/dashboard2");
        break;
      case 'developer':
        navigate("/dashboard3");
        break;
      case 'designer':
        navigate("/dashboard4");
        break;
      default:
        navigate("/perfil");
    }
  };

  const handleMFAVerify = async (answers: Record<string, string>) => {
    if (!currentUser?.securityQuestions) return false;
    
    return currentUser.securityQuestions.every((q: SecurityQuestion) => 
      answers[q.id]?.toLowerCase() === q.answer.toLowerCase()
    );
  };

  const handleMFASuccess = () => {
    completeLogin(currentUser);
  };

  const handleMFAFailure = () => {
    setCurrentUser(null);
    setSecurityQuestions([]);
  };

  const handleMFABack = () => {
    setShowMFA(false);
    setCurrentUser(null);
    setSecurityQuestions([]);
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('/users.json');
      const existingUsers = await response.json();
      
      if (existingUsers.some((user: any) => user.email === email)) {
        setError('Este correo electrónico ya está registrado');
        return;
      }

      const storedUsers = localStorage.getItem('registeredUsers');
      const registeredUsers: NewUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      if (registeredUsers.some(user => user.email === email)) {
        setError('Este correo electrónico ya está registrado');
        return;
      }

      const newUser = {
        id: existingUsers.length + registeredUsers.length + 1,
        name,
        apellido,
        email,
        password,
        role: "user"
      };

      setPendingUser(newUser);
      setShowRegisterMFA(true);

    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  const handleRegisterMFAVerify = async (answers: Record<string, string>) => {
    if (!pendingUser) return false;
    
    const storedUsers = localStorage.getItem('registeredUsers');
    const registeredUsers: NewUser[] = storedUsers ? JSON.parse(storedUsers) : [];

    const userWithSecurityQuestions = {
      ...pendingUser,
      securityQuestions: DEFAULT_SECURITY_QUESTIONS.map(q => ({
        ...q,
        answer: answers[q.id]
      }))
    };

    registeredUsers.push(userWithSecurityQuestions);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    return true;
  };

  const handleRegisterMFASuccess = () => {
    setShowRegisterMFA(false);
    setPendingUser(null);
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setName('');
    setApellido('');
    setError('Usuario registrado exitosamente. Por favor inicie sesión.');
  };

  const handleRegisterMFAFailure = () => {
    setPendingUser(null);
    setError('Error al registrar las preguntas de seguridad');
  };

  const handleRegisterMFABack = () => {
    setShowRegisterMFA(false);
    setPendingUser(null);
  };

  return (
    <div className="login-container">
      <div className={`panel ${isLogin ? "login" : "register"}`}>
        {showMFA ? (
          <MFAQuestions
            questions={securityQuestions.map(q => ({ id: q.id, question: q.question }))}
            onVerify={handleMFAVerify}
            onSuccess={handleMFASuccess}
            onFailure={handleMFAFailure}
            onBack={handleMFABack}
          />
        ) : showRegisterMFA ? (
          <MFAQuestions
            questions={DEFAULT_SECURITY_QUESTIONS}
            onVerify={handleRegisterMFAVerify}
            onSuccess={handleRegisterMFASuccess}
            onFailure={handleRegisterMFAFailure}
            onBack={handleRegisterMFABack}
          />
        ) : (
          isLogin ? (
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
          )
        )}
      </div>
    </div>
  );
};

export default Login;
import { useState, useEffect } from "react"
import "../styles/login.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import MFAQuestions from "./MFAQuestions"

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [apellido, setApellido] = useState("")
  const [error, setError] = useState("")
  const [specialCharError, setSpecialCharError] = useState("")
  const [showMFA, setShowMFA] = useState(false)
  const [mfaToken, setMfaToken] = useState("")

  const navigate = useNavigate()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApellido(e.target.value)
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token)
        const isAdmin = decodedToken.role === 1
        navigate(isAdmin ? "/dashboard" : "/perfil")
      } catch (error) {
        console.error("Error decodificando el token:", error)
        localStorage.removeItem("access_token")
      }
    }
  }, [navigate])

  const toggleView = () => {
    setIsLogin(!isLogin)
    setError("")
    setSpecialCharError("")
    setShowMFA(false)
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: password,
      })

      if (response.data.requireMFA) {
        setShowMFA(true)
        setMfaToken(response.data.mfaToken)
      } else {
        handleSuccessfulLogin(response.data.access_token)
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Correo o contraseña incorrectos")
    }
  }

  const handleSuccessfulLogin = (token: string) => {
    localStorage.setItem("access_token", token)
    const decodedToken: any = jwtDecode(token)
    const isAdmin = decodedToken.role === 1
    navigate(isAdmin ? "/dashboard" : "/perfil")
    window.dispatchEvent(new Event("storage"))
  }

  const handleMFAVerify = async (answers: Record<string, string>) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/verify-mfa", {
        mfaToken: mfaToken,
        answers: answers,
      })
      handleSuccessfulLogin(response.data.access_token)
      return true
    } catch (error) {
      console.error("Error al verificar MFA:", error)
      setError("Verificación MFA fallida")
      return false
    }
  }

  const handleMFASuccess = () => {
    // Manejado en handleMFAVerify
  }

  const handleMFAFailure = () => {
    setError("Verificación MFA fallida. Por favor, inténtelo de nuevo.")
  }

  const handleBackToLogin = () => {
    setShowMFA(false)
    setError("")
    setMfaToken("")
  }

  const handleRegister = async () => {
    const userData = {
      name: name,
      apellido: apellido,
      email: email,
      password: password,
    }

    try {
      await axios.post("http://localhost:3000/auth", userData)
      navigate("/login")
    } catch (error) {
      console.error("Error al registrar:", error.response ? error.response.data : error.message)
    }
  }

  return (
    <div className="login-container">
      <div className={`panel ${isLogin ? "login" : "register"}`}>
        {isLogin ? (
          <div className="login-section">
            <div className="form">
              {!showMFA ? (
                <>
                  <div className="titulo">Iniciar Sesión</div>
                  <input type="email" placeholder="Correo electrónico" value={email} onChange={handleEmailChange} />
                  <input type="password" placeholder="Contraseña" value={password} onChange={handlePasswordChange} />
                  {specialCharError && <p className="error">{specialCharError}</p>}
                  <button className="btn-login" onClick={handleLogin}>
                    INICIAR SESIÓN
                  </button>
                  {error && <p className="error">{error}</p>}
                </>
              ) : (
                <MFAQuestions
                  onVerify={handleMFAVerify}
                  onSuccess={handleMFASuccess}
                  onFailure={handleMFAFailure}
                  onBack={handleBackToLogin}
                  questions={[
                    { id: "q1", question: "¿Cuál es el nombre de tu primera mascota?" },
                    { id: "q2", question: "¿En qué ciudad naciste?" },
                  ]}
                />
              )}
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
              <input type="text" placeholder="Nombre" value={name} onChange={handleNameChange} />
              <input type="text" placeholder="Apellido" value={apellido} onChange={handleApellidoChange} />
              <input type="email" placeholder="Correo electrónico" value={email} onChange={handleEmailChange} />
              <input type="password" placeholder="Contraseña" value={password} onChange={handlePasswordChange} />
              {specialCharError && <p className="error">{specialCharError}</p>}
              <button className="btn-register" onClick={handleRegister}>
                Registrate
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login


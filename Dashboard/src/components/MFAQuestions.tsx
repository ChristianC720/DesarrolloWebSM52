import type React from "react"
import { useState } from "react"

interface SecurityQuestion {
  id: string
  question: string
}

interface MFAQuestionsProps {
  questions: SecurityQuestion[]
  onVerify: (answers: Record<string, string>) => Promise<boolean>
  onSuccess: () => void
  onFailure: () => void
  onBack: () => void
}

const MFAQuestions: React.FC<MFAQuestionsProps> = ({ questions, onVerify, onSuccess, onFailure, onBack }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const isVerified = await onVerify(answers)
      if (isVerified) {
        onSuccess()
      } else {
        setError("Las respuestas son incorrectas. Por favor, inténtalo de nuevo.")
        onFailure()
      }
    } catch (error) {
      setError("Ocurrió un error durante la verificación. Por favor, inténtalo de nuevo.")
      onFailure()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mfa-form">
      <div className="titulo">Verificación de seguridad</div>
      {questions.map((q) => (
        <div key={q.id} className="mfa-question">
          <label htmlFor={q.id}>{q.question}</label>
          <input
            id={q.id}
            type="text"
            value={answers[q.id] || ""}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
            required
          />
        </div>
      ))}
      {error && <p className="error">{error}</p>}
      <div className="mfa-buttons">
        <button type="submit" className="btn-login">
          Verificar
        </button>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Volver
        </button>
      </div>
    </form>
  )
}

export default MFAQuestions


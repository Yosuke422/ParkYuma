import RegisterForm from '@/components/auth/RegisterForm'

export default function Register() {
  return (
    <div className="container">
      <div className="auth-container">
        <h1 className="auth-title">Créer un compte administrateur</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
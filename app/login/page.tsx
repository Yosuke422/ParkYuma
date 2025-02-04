import LoginForm from '@/components/auth/LoginForm'

export default function Login() {
  return (
    <div className="container">
      <div className="auth-container">
        <h1 className="auth-title">Connexion</h1>
        <LoginForm />
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        router.push('/activites')
        router.refresh()
      }
    } catch (error) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <p className="text-center mt-4">
        Pas encore de compte ?{' '}
        <Link href="/signup" className="text-primary hover:underline">
          S'inscrire
        </Link>
      </p>
    </form>
  )
} 
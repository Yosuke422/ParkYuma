'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      prenom: formData.get('prenom'),
      nom: formData.get('nom')
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        })

        if (result?.error) {
          setError('Erreur lors de la connexion')
        } else {
          router.push('/activites')
          router.refresh()
        }
      } else {
        const error = await res.json()
        setError(error.error || 'Une erreur est survenue')
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
        <label htmlFor="prenom" className="form-label">Prénom</label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="nom" className="form-label">Nom</label>
        <input
          type="text"
          id="nom"
          name="nom"
          required
          className="form-input"
        />
      </div>

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
          minLength={6}
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
      >
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  )
} 
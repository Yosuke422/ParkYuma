'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActiviteWithType } from '@/types'

interface ActiviteFormProps {
  activite?: ActiviteWithType
  types: { id: number; nom: string }[]
}

export default function ActiviteForm({ activite, types }: ActiviteFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      nom: formData.get('nom'),
      description: formData.get('description'),
      typeId: parseInt(formData.get('typeId') as string),
      placesDisponibles: parseInt(formData.get('placesDisponibles') as string),
      datetimeDebut: formData.get('datetimeDebut'),
      duree: parseInt(formData.get('duree') as string)
    }

    try {
      const res = await fetch(
        activite ? `/api/activites/${activite.id}` : '/api/activites',
        {
          method: activite ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (res.ok) {
        router.push('/admin/activites')
        router.refresh()
      } else {
        const error = await res.json()
        setError(error.message || 'Une erreur est survenue')
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
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="nom" className="form-label">
          Nom de l'activité
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          defaultValue={activite?.nom}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={activite?.description}
          required
          className="form-input"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="typeId" className="form-label">
          Type d'activité
        </label>
        <select
          id="typeId"
          name="typeId"
          defaultValue={activite?.typeId}
          required
          className="form-input"
        >
          <option value="">Sélectionnez un type</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="placesDisponibles" className="form-label">
          Places disponibles
        </label>
        <input
          type="number"
          id="placesDisponibles"
          name="placesDisponibles"
          defaultValue={activite?.placesDisponibles}
          required
          min="1"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="datetimeDebut" className="form-label">
          Date et heure de début
        </label>
        <input
          type="datetime-local"
          id="datetimeDebut"
          name="datetimeDebut"
          defaultValue={activite?.datetimeDebut 
            ? new Date(activite.datetimeDebut).toISOString().slice(0, 16)
            : undefined}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="duree" className="form-label">
          Durée (en minutes)
        </label>
        <input
          type="number"
          id="duree"
          name="duree"
          defaultValue={activite?.duree}
          required
          min="1"
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
      >
        {loading ? 'Enregistrement...' : (activite ? 'Modifier' : 'Créer')}
      </button>
    </form>
  )
} 
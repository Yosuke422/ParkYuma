'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import toast from 'react-hot-toast'
import { ActiviteWithType } from '@/types'

interface ActiviteClientProps {
  activite: ActiviteWithType
  isAdmin: boolean
  onModifier?: (id: number) => void
  onSupprimer?: (id: number) => void
}

export default function ActiviteClient({ 
  activite, 
  isAdmin,
  onModifier,
  onSupprimer 
}: ActiviteClientProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

const handleReserver = async () => {
  console.log("Réserver button clicked");
  try {
    setLoading(true)
    setError('')
    
    const res = await fetch(`/api/activites/${activite.id}/reserver`, {
      method: 'POST'
    })

    if (res.ok) {
      toast.success('Réservation effectuée avec succès !')
      router.refresh()
    } else {
      const data = await res.json()
      toast.error(data.error || 'Erreur lors de la réservation')
      setError(data.error || 'Erreur lors de la réservation')
    }
  } catch (error) {
    toast.error('Erreur lors de la réservation')
    setError('Erreur lors de la réservation')
  } finally {
    setLoading(false)
  }
}


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="card animate-fade-in">
      <div className="card-content">
        <h3 className="card-title">{activite.nom}</h3>
        <span className="badge">{activite.type.nom}</span>
        <p className="card-description">{activite.description}</p>
        
        <div className="card-details">
          <div className="detail-item">
            <CalendarDays className="icon" />
            <span>{formatDate(activite.datetimeDebut)}</span>
          </div>
          <div className="detail-item">
            <span>{activite.duree} minutes</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="card-actions">
          {!isAdmin ? (
            <button 
              onClick={handleReserver}
              disabled={activite.placesDisponibles === 0 || loading}
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            >
              {loading ? 'Réservation...' : activite.placesDisponibles === 0 ? 'Complet' : 'Réserver'}
            </button>
          ) : (
            <>
              <button onClick={() => onModifier?.(activite.id)} className="btn btn-secondary">
                Modifier
              </button>
              <button onClick={() => onSupprimer?.(activite.id)} className="btn btn-danger">
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

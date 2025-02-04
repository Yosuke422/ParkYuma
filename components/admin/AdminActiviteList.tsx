'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActiviteWithType } from '@/types'

interface AdminActiviteListProps {
  activites: ActiviteWithType[]
}

export default function AdminActiviteList({ activites: initialActivites }: AdminActiviteListProps) {
  const [activites, setActivites] = useState<ActiviteWithType[]>(initialActivites)
  const router = useRouter()

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      return
    }

    try {
      const res = await fetch(`/api/activites/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setActivites(activites.filter(a => a.id !== id))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className="admin-list">
      {activites.map((activite) => (
        <div key={activite.id} className="admin-list-item">
          <div className="item-content">
            <h3 className="item-title">{activite.nom}</h3>
            <span className="item-badge">{activite.type.nom}</span>
            
            <div className="item-details">
              <p className="item-description">{activite.description}</p>
              <div className="item-info">
                <span>Places: {activite.placesDisponibles}</span>
                <span>Date: {new Date(activite.datetimeDebut).toLocaleString()}</span>
                <span>Durée: {activite.duree} min</span>
              </div>
            </div>
          </div>

          <div className="item-actions">
            <button 
              onClick={() => router.push(`/admin/activites/${activite.id}/edit`)}
              className="btn btn-secondary"
            >
              Modifier
            </button>
            <button 
              onClick={() => handleDelete(activite.id)}
              className="btn btn-danger"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}

      {activites.length === 0 && (
        <div className="empty-state">
          <p>Aucune activité n'a été créée</p>
        </div>
      )}
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActiviteWithType } from '@/types'
import toast from 'react-hot-toast'

interface AdminActiviteListProps {
  activites: ActiviteWithType[]
}

export default function AdminActiviteList({ activites: initialActivites }: AdminActiviteListProps) {
  const [activites, setActivites] = useState<ActiviteWithType[]>(initialActivites)
  const router = useRouter()

  const [selectedActivite, setSelectedActivite] = useState<ActiviteWithType | null>(null)
  const [editFormData, setEditFormData] = useState({
    nom: '',
    description: '',
    placesDisponibles: 0,
    datetimeDebut: '',
    duree: 0
  })
  const [editLoading, setEditLoading] = useState(false)

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

  const openEditModal = (activite: ActiviteWithType) => {
    setSelectedActivite(activite)
    setEditFormData({
      nom: activite.nom,
      description: activite.description,
      placesDisponibles: activite.placesDisponibles,
      datetimeDebut: activite.datetimeDebut,
      duree: activite.duree
    })
  }

  const closeEditModal = () => {
    setSelectedActivite(null)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedActivite) return
    setEditLoading(true)

    try {
      const res = await fetch(`/api/activites/${selectedActivite.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      })
      if (res.ok) {
        toast.success('Activité mise à jour')
        const updatedActivite = await res.json()
        setActivites(activites.map(a => a.id === updatedActivite.id ? updatedActivite : a))
        closeEditModal()
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div className="admin-list">
      {activites.map((activite) => (
        <div key={activite.id} className="admin-list-item card">
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
              onClick={() => openEditModal(activite)}
              className="icon-button icon-button-edit"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button 
              onClick={() => handleDelete(activite.id)}
              className="icon-button icon-button-delete"
              title="Supprimer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {activites.length === 0 && (
        <div className="empty-state">
          <p>Aucune activité n'a été créée</p>
        </div>
      )}

      {selectedActivite && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeEditModal}>
              &times;
            </button>
            <h2 className="modal-title">Modifier l'activité</h2>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="edit-nom">Nom</label>
                <input
                  type="text"
                  id="edit-nom"
                  value={editFormData.nom}
                  onChange={e => setEditFormData({...editFormData, nom: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                  className="form-input"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="edit-places">Places disponibles</label>
                <input
                  type="number"
                  id="edit-places"
                  value={editFormData.placesDisponibles}
                  onChange={e => setEditFormData({...editFormData, placesDisponibles: Number(e.target.value)})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-datetime">Date & Heure</label>
                <input
                  type="datetime-local"
                  id="edit-datetime"
                  value={editFormData.datetimeDebut}
                  onChange={e => setEditFormData({...editFormData, datetimeDebut: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-duree">Durée (minutes)</label>
                <input
                  type="number"
                  id="edit-duree"
                  value={editFormData.duree}
                  onChange={e => setEditFormData({...editFormData, duree: Number(e.target.value)})}
                  className="form-input"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? 'Mise à jour...' : 'Enregistrer'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

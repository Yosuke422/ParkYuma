'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiEdit, FiTrash2 } from 'react-icons/fi'

export default function MonCompte() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [userData, setUserData] = useState({
    prenom: '',
    nom: '',
    email: ''
  })

  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: ''
  })
  
  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user')
      if (res.ok) {
        const data = await res.json()
        setUserData(data)
        setFormData(prev => ({
          ...prev,
          prenom: data.prenom,
          nom: data.nom,
          email: data.email
        }))
      } else {
        toast.error('Erreur lors du chargement des informations utilisateur')
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des informations utilisateur')
    }
  }

  
  useEffect(() => {
    if (session) {
      fetchUserData()
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        await update(formData)
        toast.success('Profil mis à jour')
        setShowModal(false)
        
        fetchUserData()
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) return
    try {
      const res = await fetch('/api/user', { method: 'DELETE' })
      if (res.ok) {
        toast.success('Compte supprimé')
        
        signOut({ redirect: true, callbackUrl: '/' })
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon compte</h1>
      
      <div className="relative bg-white shadow rounded-lg p-6 mb-6 dark:bg-[var(--background-card)]">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="icon-button icon-button-edit"
            title="Modifier mon compte"
          >
            <FiEdit className="w-6 h-6" />
          </button>
          <button
            onClick={handleDelete}
            className="icon-button icon-button-delete"
            title="Supprimer mon compte"
          >
            <FiTrash2 className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <div className="space-y-3 text-lg">
          <p><span className="font-semibold">Nom:</span> {userData.nom}</p>
          <p><span className="font-semibold">Prénom:</span> {userData.prenom}</p>
          <p><span className="font-semibold">Email:</span> {userData.email}</p>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2 className="modal-title">Modifier mes informations</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  value={formData.prenom}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, prenom: e.target.value }))
                  }
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input
                  type="text"
                  id="nom"
                  value={formData.nom}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, nom: e.target.value }))
                  }
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                  className="form-input"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Mise à jour...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
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

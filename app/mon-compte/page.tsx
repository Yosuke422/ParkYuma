'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function MonCompte() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    prenom: session?.user?.prenom || '',
    nom: session?.user?.nom || '',
    email: session?.user?.email || ''
  })

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
      const res = await fetch('/api/user/delete', { method: 'DELETE' })
      if (res.ok) {
        router.push('/')
        toast.success('Compte supprimé')
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
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <p><span className="font-medium">Nom:</span> {session?.user?.nom}</p>
        <p><span className="font-medium">Prénom:</span> {session?.user?.prenom}</p>
        <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          Modifier mon compte
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-danger"
        >
          Supprimer mon compte
        </button>
      </div>

      {/* Modal for updating account info */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Modifier mes informations</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  value={formData.prenom}
                  onChange={e => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
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
                  onChange={e => setFormData(prev => ({ ...prev, nom: e.target.value }))}
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
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
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

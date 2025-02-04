'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ReservationWithActivite } from '@/types'
import { cancelReservation } from '@/app/actions/reservations'

export default function MonCompte() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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

  const handleCancelReservation = async (reservationId: number) => {
    const result = await cancelReservation(reservationId)
    if (result.success) {
      toast.success('Réservation annulée')
      router.refresh()
    } else {
      toast.error('Erreur lors de l\'annulation')
    }
  }

  const reservations = session?.user?.reservations || []

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon compte</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <p><span className="font-medium">Nom:</span> {session?.user?.nom}</p>
        <p><span className="font-medium">Prénom:</span> {session?.user?.prenom}</p>
        <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mes réservations</h2>
          <Link 
            href="/activites" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Réserver une activité
          </Link>
        </div>

        <div className="space-y-4">
          {reservations.length > 0 ? (
            reservations.map((reservation: ReservationWithActivite) => (
              <div 
                key={reservation.id} 
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{reservation.activite.nom}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(reservation.activite.datetimeDebut).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Durée: {reservation.activite.duree} minutes
                  </p>
                </div>
                {reservation.etat ? (
                  <button 
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Annuler
                  </button>
                ) : (
                  <span className="text-red-500">Annulée</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Aucune réservation pour le moment</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4 mt-6">
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

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger"
          >
            Supprimer mon compte
          </button>
        </div>
      </form>
    </div>
  )
}


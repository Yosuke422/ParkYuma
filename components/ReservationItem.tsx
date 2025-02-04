'use client'

import { useState } from 'react'
import { ReservationWithActivite } from '@/types'

interface ReservationItemProps {
  reservation: ReservationWithActivite
  onCancel: (id: number) => Promise<void>
}

export default function ReservationItem({ reservation, onCancel }: ReservationItemProps) {
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }

    setLoading(true)
    try {
      await onCancel(reservation.id)
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border p-4 rounded-lg flex justify-between items-center">
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
          onClick={handleCancel}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          {loading ? 'Annulation...' : 'Annuler'}
        </button>
      ) : (
        <span className="text-red-500">Annulée</span>
      )}
    </div>
  )
} 
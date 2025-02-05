"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Activite {
  nom: string
  description: string
  datetimeDebut: string
  duree: number
  type?: {
    nom: string
  }
}

interface Reservation {
  id: number
  etat: boolean
  activite: Activite
}

export default function MesActivites() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<boolean>(false)
  const [reservations, setReservations] = useState<Reservation[]>([])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/user/reservations', { method: 'GET' })
      if (res.ok) {
        const data = await res.json()
        setReservations(data.reservations)
      } else {
        toast.error('Erreur lors du chargement de vos activités réservées')
      }
    } catch (error) {
      toast.error('Erreur lors du chargement de vos activités réservées')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    
    if (session) {
      fetchReservations()
    }
  }, [session])

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mes activités réservées</h1>
        <p>Vous devez être connecté pour voir vos activités réservées.</p>
        <Link href="/login" className="btn btn-primary mt-4">
          Connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mes activités réservées</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loading-spinner"></div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p>Aucune activité réservée pour le moment.</p>
          <Link href="/activites" className="btn btn-primary mt-4">
            Réserver une activité
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="card">
              <div className="card-content relative">
                <div className="shine"></div>
                <h2 className="card-title">{reservation.activite.nom}</h2>
                <span className="badge">
                  {reservation.activite.type?.nom || 'Activité'}
                </span>
                <p className="card-description mt-2">
                  {reservation.activite.description}
                </p>
                <div className="card-details mt-4">
                  <div className="detail-item">
                    <span className="icon">📅</span>
                    <span>
                      {new Date(
                        reservation.activite.datetimeDebut
                      ).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">⏰</span>
                    <span>{reservation.activite.duree} minutes</span>
                  </div>
                </div>
                {reservation.etat ? (
                  <span className="text-success mt-2 inline-block">Réservée</span>
                ) : (
                  <span className="text-error mt-2 inline-block">Annulée</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

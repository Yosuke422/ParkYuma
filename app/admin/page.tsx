
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import DashboardOverview from '@/components/DashboardOverview'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const [activites, typesActivites, reservations, users] = await Promise.all([
    prisma.activite.count(),
    prisma.typeActivite.count(),
    prisma.reservation.count(),
    prisma.user.count()
  ])

  const recentReservationsRaw = await prisma.reservation.findMany({
    orderBy: { dateReservation: 'desc' },
    take: 5,
    include: {
      activite: { select: { nom: true } },
      user: { select: { prenom: true, nom: true } }
    }
  })
  const recentReservations = recentReservationsRaw.map(reservation => ({
    ...reservation,
    dateReservation: reservation.dateReservation.toISOString()
  }))

  return (
    <div className="container mx-auto p-4">
      <h1 className="dashboard-title mb-6">Tableau de bord administrateur</h1>
      
      <div className="stats-grid mb-8">
        <div className="stat-card stat-activities">
          <h3 className="stat-label">Activités</h3>
          <p className="stat-value">{activites}</p>
        </div>
        <div className="stat-card stat-types">
          <h3 className="stat-label">Types d'activités</h3>
          <p className="stat-value">{typesActivites}</p>
        </div>
        <div className="stat-card stat-reservations">
          <h3 className="stat-label">Réservations</h3>
          <p className="stat-value">{reservations}</p>
        </div>
        <div className="stat-card stat-users">
          <h3 className="stat-label">Utilisateurs</h3>
          <p className="stat-value">{users}</p>
        </div>
      </div>

      <DashboardOverview
        activites={activites}
        typesActivites={typesActivites}
        reservations={reservations}
        users={users}
        recentReservations={recentReservations}
      />

      <div className="nav-grid mt-8">
        <Link 
          href="/admin/activites" 
          className="nav-card"
        >
          <h3 className="nav-title">Gestion des activités</h3>
          <p className="nav-description">Ajouter, modifier ou supprimer des activités</p>
        </Link> 
        <Link 
          href="/admin/utilisateurs" 
          className="nav-card"
        >
          <h3 className="nav-title">Utilisateurs</h3>
          <p className="nav-description">Gérer les comptes utilisateurs</p>
        </Link>
      </div>
    </div>
  )
}

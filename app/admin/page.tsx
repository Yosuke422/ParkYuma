import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Activités</h3>
          <p className="text-3xl font-bold">{activites}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Types d'activités</h3>
          <p className="text-3xl font-bold">{typesActivites}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Réservations</h3>
          <p className="text-3xl font-bold">{reservations}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Utilisateurs</h3>
          <p className="text-3xl font-bold">{users}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/admin/activites" 
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Gestion des activités</h3>
          <p className="text-gray-600">Ajouter, modifier ou supprimer des activités</p>
        </Link>
        
        <Link 
          href="/admin/types" 
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Types d'activités</h3>
          <p className="text-gray-600">Gérer les catégories d'activités</p>
        </Link>
        
        <Link 
          href="/admin/reservations" 
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Réservations</h3>
          <p className="text-gray-600">Voir et gérer toutes les réservations</p>
        </Link>
        
        <Link 
          href="/admin/users" 
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Utilisateurs</h3>
          <p className="text-gray-600">Gérer les comptes utilisateurs</p>
        </Link>
      </div>
    </div>
  )
} 
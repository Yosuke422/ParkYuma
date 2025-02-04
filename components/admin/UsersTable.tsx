'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { User, Shield, ShieldOff } from 'lucide-react'

type UserWithCount = {
  id: number
  email: string
  nom: string
  prenom: string
  role: string
  createdAt: Date
  _count: {
    reservations: number
  }
}

export default function UsersTable({ users }: { users: UserWithCount[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<number | null>(null)

  const handleRoleToggle = async (userId: number, currentRole: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir ${currentRole === 'ADMIN' ? 'révoquer' : 'donner'} les droits d'administrateur ?`)) {
      return
    }

    setLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
        })
      })

      if (res.ok) {
        toast.success('Rôle mis à jour avec succès')
        router.refresh()
      } else {
        toast.error('Erreur lors de la mise à jour du rôle')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilisateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rôle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Réservations
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium">{user.prenom} {user.nom}</div>
                    <div className="text-sm text-gray-500">
                      Inscrit le {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user._count.reservations}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleRoleToggle(user.id, user.role)}
                  disabled={loading === user.id}
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                    user.role === 'ADMIN'
                      ? 'text-red-700 bg-red-100 hover:bg-red-200'
                      : 'text-green-700 bg-green-100 hover:bg-green-200'
                  }`}
                >
                  {loading === user.id ? (
                    'Chargement...'
                  ) : (
                    <>
                      {user.role === 'ADMIN' ? (
                        <>
                          <ShieldOff className="h-4 w-4 mr-2" />
                          Révoquer admin
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Rendre admin
                        </>
                      )}
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 
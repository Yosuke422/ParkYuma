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
    if (
      !confirm(
        `Êtes-vous sûr de vouloir ${currentRole === 'ADMIN' ? 'révoquer' : 'donner'} les droits d'administrateur ?`
      )
    ) {
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
    <div className="overflow-x-auto admin-list">
      <table className="min-w-full">
        <thead className="table-header">
          <tr>
            <th className="table-th">Utilisateur</th>
            <th className="table-th">Email</th>
            <th className="table-th">Rôle</th>
            <th className="table-th">Réservations</th>
            <th className="table-th text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="table-row">
              <td className="table-td">
                <div className="flex items-center">
                  <User className="icon mr-2" />
                  <div>
                    <div className="font-medium">{user.prenom} {user.nom}</div>
                    <div className="text-sm text-gray-500">
                      Inscrit le {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>
              <td className="table-td">{user.email}</td>
              <td className="table-td">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'ADMIN'
                      ? 'role-admin'
                      : 'role-user'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="table-td text-sm text-gray-500">
                {user._count.reservations}
              </td>
              <td className="table-td text-right">
                <button
                  onClick={() => handleRoleToggle(user.id, user.role)}
                  disabled={loading === user.id}
                  className="action-button"
                >
                  {loading === user.id ? (
                    'Chargement...'
                  ) : (
                    <>
                      {user.role === 'ADMIN' ? (
                        <>
                          <ShieldOff className="action-icon" />
                          <span className="action-label">Révoquer</span>
                        </>
                      ) : (
                        <>
                          <Shield className="action-icon" />
                          <span className="action-label">Donner</span>
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
      {users.length === 0 && (
        <div className="empty-state">
          <p>Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import UsersTable from '@/components/admin/UsersTable'
import prisma from '@/lib/prisma'

export default async function AdminUsers() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      role: true,
      createdAt: true,
      _count: {
        select: { reservations: true }
      }
    }
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
      <UsersTable users={users} />
    </div>
  )
} 
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import AdminActiviteList from '@/components/admin/AdminActiviteList'

export default async function AdminActivites() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const activites = await prisma.activite.findMany({
    include: {
      type: true,
      reservations: true
    }
  })

  return (
    <div className="admin-page">
      <div className="container">
        <header className="page-header">
          <div className="header-content">
            <h1 className="page-title">Gestion des activités</h1>
            <Link href="/admin/activites/new" className="btn btn-primary">
              Nouvelle activité
            </Link>
          </div>
        </header>

        <div className="admin-content">
          <AdminActiviteList activites={activites} />
        </div>
      </div>
    </div>
  )
} 
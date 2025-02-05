import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import ActiviteForm from '@/components/admin/ActiviteForm'

export default async function EditActivite({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    redirect('/')
  }

  const [activite, types] = await Promise.all([
    prisma.activite.findUnique({
      where: { id: parseInt(params.id) },
      include: { type: true }
    }),
    prisma.typeActivite.findMany()
  ])

  if (!activite) {
    redirect('/admin/activites')
  }

  return (
    <div className="admin-page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">Modifier l'activité</h1>
        </header>
        <div className="form-container">
          <ActiviteForm activite={{ ...activite, datetimeDebut: activite.datetimeDebut.toISOString() }} types={types} />
        </div>
      </div>
    </div>
  )
} 
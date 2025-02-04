import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import ActiviteForm from '@/components/admin/ActiviteForm'

export default async function NewActivite() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    redirect('/')
  }

  const types = await prisma.typeActivite.findMany()

  return (
    <div className="admin-page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">Nouvelle activité</h1>
        </header>
        <div className="form-container">
          <ActiviteForm types={types} />
        </div>
      </div>
    </div>
  )
} 
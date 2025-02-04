import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import ActiviteClient from '@/components/ActiviteClient'
import RechercheActivites from '@/components/activites/RechercheActivites'
import { ActiviteWithType } from '@/types'

export default async function Activites() {
  const session = await getServerSession(authOptions)
  const activites = await prisma.activite.findMany({
    include: {
      type: true,
    },
    orderBy: {
      datetimeDebut: 'asc'
    }
  })

  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Découvrez nos activités</h1>
          <p>Réservez vos places pour nos activités exclusives</p>
        </div>
      </section>

      <section className="container activities-container">
        <div className="activities-grid">
          {activites.map((activite: ActiviteWithType) => (
            <ActiviteClient 
              key={activite.id}
              activite={activite}
              isAdmin={session?.user?.role === 'ADMIN'}
            />
          ))}
        </div>

        {activites.length === 0 && (
          <div className="empty-state">
            <p>Aucune activité n'est disponible pour le moment</p>
          </div>
        )}
      </section>
    </main>
  )
} 
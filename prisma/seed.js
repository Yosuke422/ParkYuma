import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    // Créer l'admin par défaut
    const adminPassword = await hash('admin123', 10)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: adminPassword,
        nom: 'Admin',
        prenom: 'Super',
        role: 'ADMIN'
      }
    })

    console.log('Admin créé:', admin)

    // Reste du seed...
    await prisma.typeActivite.deleteMany()
    const types = [
      { nom: 'Sport' },
      { nom: 'Culture' },
      { nom: 'Loisirs' },
      { nom: 'Bien-être' }
    ]

    for (const type of types) {
      await prisma.typeActivite.create({
        data: type
      })
    }

    console.log('Types d\'activités créés avec succès')
  } catch (error) {
    console.error('Erreur lors du seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
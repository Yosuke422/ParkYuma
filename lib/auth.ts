import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Credentials manquants')
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email.toLowerCase()
            }
          })

          if (!user) {
            console.log('Utilisateur non trouvé')
            return null
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log('Mot de passe invalide')
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            role: user.role
          }
        } catch (error) {
          console.error('Erreur d\'authentification:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.nom = user.nom
        token.prenom = user.prenom
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role as string
        session.user.nom = token.nom as string
        session.user.prenom = token.prenom as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  },
  debug: process.env.NODE_ENV === 'development'
} 
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { compare } from 'bcrypt'
import { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt', 
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        console.log('Tentative de connexion:', credentials)
        if (!credentials?.email || !credentials?.password) {
          console.log('Email ou mot de passe manquant')
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })
        console.log('Utilisateur trouvé:', user)
        if (!user) {
          console.log('Utilisateur non trouvé')
          return null
        }
        const isPasswordValid = await compare(credentials.password, user.password)
        console.log('Mot de passe valide:', isPasswordValid)
        if (!isPasswordValid) {
          console.log('Mot de passe invalide')
          return null
        }
        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          role: user.role,
          prenom: user.prenom,
          nom: user.nom
        }
      }
    })
  ],
  debug: true,
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback:', { token, user })
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
        token.prenom = user.prenom
        token.nom = user.nom
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token })
      if (session?.user) {
        
        session.user.id = token.id
        session.user.email = token.email
        session.user.role = token.role
        session.user.prenom = token.prenom
        session.user.nom = token.nom
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

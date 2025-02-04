import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page non trouvée</p>
        <Link href="/" className="btn btn-primary">
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
} 
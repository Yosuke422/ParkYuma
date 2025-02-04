'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="main-nav">
      <div className="container nav-container">
        <Link href="/" className="nav-logo">
          Activités
        </Link>

        <div className="nav-links">
          <Link 
            href="/activites" 
            className={`nav-link ${pathname === '/activites' ? 'active' : ''}`}
          >
            Nos activités
          </Link>

          {session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link 
                  href="/admin/activites" 
                  className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
                >
                  Administration
                </Link>
              )}
              
              <Link 
                href="/mon-compte" 
                className={`nav-link ${pathname === '/mon-compte' ? 'active' : ''}`}
              >
                Mon compte
              </Link>
              
              <button onClick={() => signOut()} className="nav-button">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-button">
                Connexion
              </Link>
              <Link href="/register" className="nav-button nav-button-primary">
                Inscription
              </Link>
            </>
          )}

          {session?.user?.role === 'ADMIN' && (
            <>
              <Link 
                href="/admin/activites" 
                className={`nav-link ${pathname.startsWith('/admin/activites') ? 'active' : ''}`}
              >
                Gestion activités
              </Link>
              <Link 
                href="/admin/utilisateurs" 
                className={`nav-link ${pathname.startsWith('/admin/utilisateurs') ? 'active' : ''}`}
              >
                Gestion utilisateurs
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
} 
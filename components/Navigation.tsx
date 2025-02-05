"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="main-nav">
      <div className="container nav-container">
        <Link href="/" className="nav-logo">
          Activités
        </Link>

        <div className="nav-links">
          {session?.user?.role === "ADMIN" ? (
            <>
              <Link
                href="/admin"
                className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
              >
                Tableau de bord
              </Link>
              <Link
                href="/admin/activites"
                className={`nav-link ${
                  pathname.startsWith("/admin/activites") ? "active" : ""
                }`}
              >
                Gestion activités
              </Link>
              <Link
                href="/admin/utilisateurs"
                className={`nav-link ${
                  pathname.startsWith("/admin/utilisateurs") ? "active" : ""
                }`}
              >
                Gestion utilisateurs
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/activites"
                className={`nav-link ${
                  pathname === "/activites" ? "active" : ""
                }`}
              >
                Les activités
              </Link>
              <Link
                href="/mes-activites"
                className={`nav-link ${
                  pathname === "/mes-activites" ? "active" : ""
                }`}
              >
                Mes activités
              </Link>
            </>
          )}
          {session ? (
            <>
              <Link
                href="/mon-compte"
                className={`nav-link ${
                  pathname === "/mon-compte" ? "active" : ""
                }`}
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
              <Link href="/signup" className="nav-button nav-button-primary">
                Inscription
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

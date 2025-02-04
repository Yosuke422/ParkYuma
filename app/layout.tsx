import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import Providers from '@/components/Providers'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Toaster from '@/components/Toaster'

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Activités - Réservation",
  description: "Réservez vos activités en ligne",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="fr">
      <body className={geist.className}>
        <Providers session={session}>
          <Navigation />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

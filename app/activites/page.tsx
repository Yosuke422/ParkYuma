import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ActiviteClient from "@/components/ActiviteClient";
import SearchBar from "@/components/SearchBar";
import prisma from "@/lib/prisma";
import { ActiviteWithType } from "@/types";
import { getServerSession } from "next-auth";

interface ActivitesPageProps {
  searchParams: {
    query?: string
  };
}

export default async function Activites({ searchParams }: ActivitesPageProps)  {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : null
  const filter = searchParams.query || "";

  const activites = await prisma.activite
    .findMany({
      where: {
        nom: {
          contains: filter,
          mode: "insensitive", 
        },
      },
      include: {
        type: true,
        reservations: userId
        ? {
            where: { userId }, 
        }
        : false,
    },
      orderBy: {
        datetimeDebut: "asc",
      },
    })
    .then((activites) =>
      activites.map((activite) => ({
        ...activite,
        datetimeDebut: activite.datetimeDebut.toISOString(),
      }))
    )

    const activitesWithReservedFlag = activites.map((activite) => ({
      ...activite,
      datetimeDebut: activite.datetimeDebut.toString(),
      isReserved: activite.reservations && activite.reservations.length > 0,
    }));

  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Découvrez nos activités</h1>
          <p>Réservez vos places pour nos activités exclusives</p>
        </div>
      </section>
      <section className="container">
        <SearchBar initialQuery={filter} />
      </section>
      <section className="container activities-container">
        <div className="activities-grid">
          {activitesWithReservedFlag.map((activite: ActiviteWithType) => (
            <ActiviteClient
              key={activite.id}
              activite={activite}
              isAdmin={session?.user?.role === "ADMIN"}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

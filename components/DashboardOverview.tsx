'use client'

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Title,
  Tooltip
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface DashboardOverviewProps {
  activites: number
  typesActivites: number
  reservations: number
  users: number
  recentReservations: {
    id: number
    dateReservation: string
    activite: { nom: string }
    user?: { prenom: string; nom: string }
  }[]
}

export default function DashboardOverview({ activites, typesActivites, reservations, users, recentReservations }: DashboardOverviewProps) {
  const chartData = {
    labels: ['Activités', 'Types', 'Réservations', 'Utilisateurs'],
    datasets: [
      {
        label: 'Total',
        data: [activites, typesActivites, reservations, users],
        backgroundColor: [
          'rgba(6, 95, 70, 0.7)',    
          'rgba(6, 95, 70, 0.5)',    
          'rgba(220, 38, 38, 0.7)',  
          'rgba(234, 179, 8, 0.7)'   
        ],
        borderColor: [
          'rgba(6, 95, 70, 1)',
          'rgba(6, 95, 70, 1)',
          'rgba(220, 38, 38, 1)',
          'rgba(234, 179, 8, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      title: {
        display: true,
        text: 'Vue d’ensemble des Statistiques'
      }
    }
  }

  return (
    <div className="dashboard-overview grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="chart-container p-4 bg-white rounded-lg shadow">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
      
      <div className="recent-reservations widget-panel p-4 bg-white rounded-lg shadow">
        <h2 className="widget-title text-xl font-semibold mb-4">Réservations récentes</h2>
        <table className="recent-table w-full">
          <thead>
            <tr>
              <th className="recent-th px-4 py-2 text-left text-sm font-medium text-gray-600">Activité</th>
              <th className="recent-th px-4 py-2 text-left text-sm font-medium text-gray-600">Utilisateur</th>
              <th className="recent-th px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentReservations.length > 0 ? (
              recentReservations.map(reservation => (
                <tr key={reservation.id} className="recent-row border-b border-gray-200">
                  <td className="recent-td px-4 py-2 text-sm text-gray-700">{reservation.activite.nom}</td>
                  <td className="recent-td px-4 py-2 text-sm text-gray-700">
                    {reservation.user?.prenom} {reservation.user?.nom}
                  </td>
                  <td className="recent-td px-4 py-2 text-sm text-gray-700">
                    {new Date(reservation.dateReservation).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-2 text-gray-500">
                  Aucune réservation récente
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

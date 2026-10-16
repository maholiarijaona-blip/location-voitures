import { useEffect, useState } from 'react'
import { Car, CarFront, KeyRound, Users, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import { dashboardApi } from '../../api/resources'
import Card from '../../components/Card'
import Loader from '../../components/Loader'
import Badge from '../../components/Badge'
import { formatDate, formatMoney } from '../../utils/formatters'

const TONES = { en_cours: 'warning', terminee: 'success', annulee: 'neutral' }

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi
      .stats()
      .then((res) => setStats(res.data))
      .catch((err) => toast.error(err.friendlyMessage))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Chargement..." />
  if (!stats) return <p className="text-neutral-400">Statistiques indisponibles pour le moment.</p>

  const estAdmin = stats.role === 'admin'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Tableau de bord</h1>
        <p className="text-sm text-neutral-400">
          {estAdmin ? "Vue d'ensemble de l'agence" : 'Résumé de votre activité'}
        </p>
      </div>

      {estAdmin ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Voitures" value={stats.total_voitures} icon={Car} />
          <Card title="Voitures disponibles" value={stats.voitures_disponibles} icon={CarFront} />
          <Card title="Clients" value={stats.total_clients} icon={Users} />
          <Card title="Locations en cours" value={stats.locations_en_cours} icon={KeyRound} />
          <Card title="Revenus du mois" value={formatMoney(stats.revenus_ce_mois)} icon={Wallet} />
          <Card title="Revenus totaux" value={formatMoney(stats.revenus_total)} icon={Wallet} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Mes locations" value={stats.mes_locations} icon={KeyRound} />
          <Card title="En cours" value={stats.locations_en_cours} icon={CarFront} />
          <Card title="Total payé" value={formatMoney(stats.total_paye)} icon={Wallet} />
          <Card title="Reste à payer" value={formatMoney(stats.reste_a_payer)} icon={Wallet} />
        </div>
      )}

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Dernières locations</h2>
        {stats.dernieres_locations.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucune location enregistrée.</p>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {stats.dernieres_locations.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-white">
                    {estAdmin ? `${l.client_nom} - ${l.voiture_label}` : l.voiture_label}
                  </p>
                  <p className="text-neutral-400">
                    Du {formatDate(l.date_debut)} au {formatDate(l.date_fin)} · {formatMoney(l.prix_total)}
                  </p>
                </div>
                <Badge tone={TONES[l.statut]}>{l.statut_label}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

import CrudPage from '../CrudPage'
import { paiementsApi, locationsApi } from '../../api/resources'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatMoney } from '../../utils/formatters'

const MODES = [
  { value: 'especes', label: 'Espèces' },
  { value: 'carte', label: 'Carte bancaire' },
  { value: 'mobile_money', label: 'Mobile money' },
  { value: 'virement', label: 'Virement' },
]

const columns = [
  { key: 'location_label', label: 'Location' },
  { key: 'client_nom', label: 'Client' },
  { key: 'montant', label: 'Montant', sortable: true, render: (r) => formatMoney(r.montant) },
  { key: 'mode_label', label: 'Mode' },
  { key: 'date_paiement', label: 'Date', sortable: true, render: (r) => formatDate(r.date_paiement) },
]

const fields = [
  {
    name: 'location',
    label: 'Location',
    as: 'select',
    required: true,
    full: true,
    optionsFrom: {
      api: locationsApi,
      map: (l) => ({ value: l.id, label: `#${l.id} - ${l.client_nom} - ${l.voiture_label} - reste ${formatMoney(l.reste_a_payer)}` }),
    },
  },
  { name: 'montant', label: 'Montant (Ar)', type: 'number', step: '0.01', required: true },
  { name: 'mode', label: 'Mode de paiement', as: 'select', options: MODES, required: true },
  { name: 'date_paiement', label: 'Date du paiement', type: 'date', required: true },
]

const today = () => new Date().toISOString().slice(0, 10)

const exportColumns = [
  { key: 'location_label', label: 'Location' },
  { key: 'client_nom', label: 'Client' },
  { key: 'montant', label: 'Montant', value: (r) => formatMoney(r.montant) },
  { key: 'mode_label', label: 'Mode' },
  { key: 'date_paiement', label: 'Date', value: (r) => formatDate(r.date_paiement) },
]

export default function PaiementsPage() {
  const { isAdmin } = useAuth()
  return (
    <CrudPage
      title={isAdmin ? "Paiements" : "Mes paiements"}
      subtitle={isAdmin ? "Suivez les paiements des locations" : "Historique de vos paiements"}
      singular="Paiement"
      api={paiementsApi}
      columns={isAdmin ? columns : columns.filter((c) => c.key !== 'client_nom')}
      fields={fields}
      emptyForm={{ location: '', montant: '', mode: 'especes', date_paiement: today() }}
      itemLabel={(r) => `Paiement #${r.id}`}
      defaultSort="date_paiement"
      searchPlaceholder="Rechercher (client, immatriculation)..."
      exportColumns={exportColumns}
      canCreate={isAdmin}
      canEdit={isAdmin}
      canDelete={isAdmin}
    />
  )
}

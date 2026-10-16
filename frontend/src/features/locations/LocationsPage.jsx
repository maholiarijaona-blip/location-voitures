import { CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import CrudPage from '../CrudPage'
import Badge from '../../components/Badge'
import { locationsApi, clientsApi, voituresApi } from '../../api/resources'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatMoney } from '../../utils/formatters'

const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
const minDebut = () => today()
const minRetour = (form) => (form.date_debut && form.date_debut > today() ? form.date_debut : today())
const minFin = (form) => (form.date_debut && form.date_debut > today() ? form.date_debut : today())

const STATUTS = [
  { value: 'en_cours', label: 'En cours' },
  { value: 'terminee', label: 'Terminée' },
  { value: 'annulee', label: 'Annulée' },
]

const TONES = { en_cours: 'warning', terminee: 'success', annulee: 'neutral' }

const columns = [
  { key: 'client_nom', label: 'Client' },
  { key: 'voiture_label', label: 'Voiture' },
  { key: 'date_debut', label: 'Début', sortable: true, render: (r) => formatDate(r.date_debut) },
  { key: 'date_fin', label: 'Fin', sortable: true, render: (r) => formatDate(r.date_fin) },
  { key: 'nb_jours', label: 'Jours' },
  { key: 'prix_total', label: 'Total', sortable: true, render: (r) => formatMoney(r.prix_total) },
  { key: 'reste_a_payer', label: 'Reste à payer', render: (r) => formatMoney(r.reste_a_payer) },
  { key: 'statut', label: 'Statut', sortable: true, render: (r) => <Badge tone={TONES[r.statut]}>{r.statut_label}</Badge> },
]

const adminFields = [
  {
    name: 'client',
    label: 'Client',
    as: 'select',
    required: true,
    optionsFrom: { api: clientsApi, map: (c) => ({ value: c.id, label: c.nom_complet }) },
  },
  {
    name: 'voiture',
    label: 'Voiture',
    as: 'select',
    required: true,
    optionsFrom: {
      api: voituresApi,
      map: (v) => ({ value: v.id, label: `${v.marque} ${v.modele} - ${v.immatriculation}` }),
    },
  },
  { name: 'date_debut', label: 'Date de début', type: 'date', required: true, min: minDebut, minMessage: 'La date de début ne peut pas être dans le passé' },
  { name: 'date_fin', label: 'Date de fin', type: 'date', required: true, min: minFin, minMessage: 'La date de fin ne peut pas être dans le passé ni avant la date de début' },
  { name: 'date_retour', label: 'Date de retour', type: 'date', nullable: true, min: minRetour, minMessage: 'La date de retour ne peut pas être dans le passé ni avant la date de début' },
  { name: 'statut', label: 'Statut', as: 'select', options: STATUTS, required: true },
]

const clientFields = [
  {
    name: 'voiture',
    label: 'Voiture',
    as: 'select',
    required: true,
    full: true,
    optionsFrom: {
      api: voituresApi,
      map: (v) => ({ value: v.id, label: `${v.marque} ${v.modele} - ${formatMoney(v.prix_jour)} / jour${v.statut === 'maintenance' ? ' (en maintenance)' : ''}` }),
    },
  },
  { name: 'date_debut', label: 'Date de début', type: 'date', required: true, min: minDebut, minMessage: 'La date de début ne peut pas être dans le passé' },
  { name: 'date_fin', label: 'Date de fin', type: 'date', required: true, min: minFin, minMessage: 'La date de fin ne peut pas être dans le passé ni avant la date de début' },
]

const adminEmpty = {
  client: '', voiture: '', date_debut: '', date_fin: '', date_retour: '', statut: 'en_cours',
}

const clientEmpty = { voiture: '', date_debut: '', date_fin: '' }

const exportColumns = [
  { key: 'client_nom', label: 'Client' },
  { key: 'voiture_label', label: 'Voiture' },
  { key: 'date_debut', label: 'Début', value: (r) => formatDate(r.date_debut) },
  { key: 'date_fin', label: 'Fin', value: (r) => formatDate(r.date_fin) },
  { key: 'prix_total', label: 'Total', value: (r) => formatMoney(r.prix_total) },
  { key: 'statut_label', label: 'Statut' },
]

export default function LocationsPage() {
  const { isAdmin } = useAuth()
  const rowActions = (row, refetch) =>
    row.statut === 'en_cours' && (
      <button
        onClick={async () => {
          try {
            await locationsApi.terminer(row.id)
            toast.success('Location terminée, voiture à nouveau disponible')
            refetch()
          } catch (err) {
            toast.error(err.friendlyMessage)
          }
        }}
        className="focus-ring rounded-md p-1.5 text-neutral-300 hover:bg-neutral-800"
        aria-label="Terminer la location"
        title="Terminer la location"
      >
        <CheckCircle size={16} />
      </button>
    )

  return (
    <CrudPage
      title={isAdmin ? "Locations" : "Mes locations"}
      subtitle={isAdmin ? "Suivez les locations de véhicules" : "Réservez une voiture et suivez vos locations"}
      singular="Location"
      api={locationsApi}
      columns={isAdmin ? columns : columns.filter((c) => c.key !== 'client_nom')}
      fields={isAdmin ? adminFields : clientFields}
      emptyForm={isAdmin ? adminEmpty : clientEmpty}
      itemLabel={(r) => `Location #${r.id} - ${r.client_nom}`}
      defaultSort="date_debut"
      searchPlaceholder="Rechercher (client, voiture, immatriculation)..."
      rowActions={isAdmin ? rowActions : undefined}
      exportColumns={exportColumns}
      canEdit={isAdmin}
      canDelete={isAdmin}
    />
  )
}

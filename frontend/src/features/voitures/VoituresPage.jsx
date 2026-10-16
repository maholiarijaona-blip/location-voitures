import CrudPage from '../CrudPage'
import Badge from '../../components/Badge'
import { voituresApi } from '../../api/resources'
import { useAuth } from '../../context/AuthContext'
import { formatMoney } from '../../utils/formatters'

const STATUTS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'louee', label: 'Louée' },
  { value: 'maintenance', label: 'En maintenance' },
]

const TONES = { disponible: 'success', louee: 'warning', maintenance: 'neutral' }

const columns = [
  { key: 'marque', label: 'Marque', sortable: true },
  { key: 'modele', label: 'Modèle', sortable: true },
  { key: 'immatriculation', label: 'Immatriculation' },
  { key: 'annee', label: 'Année', sortable: true },
  { key: 'couleur', label: 'Couleur' },
  { key: 'prix_jour', label: 'Prix / jour', sortable: true, render: (r) => formatMoney(r.prix_jour) },
  { key: 'statut', label: 'Statut', sortable: true, render: (r) => <Badge tone={TONES[r.statut]}>{r.statut_label}</Badge> },
]

const fields = [
  { name: 'marque', label: 'Marque', required: true },
  { name: 'modele', label: 'Modèle', required: true },
  { name: 'immatriculation', label: 'Immatriculation', required: true },
  { name: 'annee', label: 'Année', type: 'number', required: true },
  { name: 'couleur', label: 'Couleur' },
  { name: 'prix_jour', label: 'Prix par jour (Ar)', type: 'number', step: '0.01', required: true },
  { name: 'statut', label: 'Statut', as: 'select', options: STATUTS, required: true },
]

const emptyForm = {
  marque: '', modele: '', immatriculation: '', annee: '', couleur: '', prix_jour: '', statut: 'disponible',
}

const exportColumns = [
  { key: 'marque', label: 'Marque' },
  { key: 'modele', label: 'Modèle' },
  { key: 'immatriculation', label: 'Immatriculation' },
  { key: 'annee', label: 'Année' },
  { key: 'prix_jour', label: 'Prix / jour', value: (r) => formatMoney(r.prix_jour) },
  { key: 'statut_label', label: 'Statut' },
]

export default function VoituresPage() {
  const { isAdmin } = useAuth()
  return (
    <CrudPage
      title="Voitures"
      subtitle={isAdmin ? "Gérez le parc de véhicules" : "Les véhicules de l'agence"}
      singular="Voiture"
      api={voituresApi}
      columns={columns}
      fields={fields}
      emptyForm={emptyForm}
      itemLabel={(r) => `${r.marque} ${r.modele} ${r.immatriculation}`}
      defaultSort="marque"
      searchPlaceholder="Rechercher une voiture (marque, modèle, immatriculation)..."
      exportColumns={exportColumns}
      canCreate={isAdmin}
      canEdit={isAdmin}
      canDelete={isAdmin}
    />
  )
}

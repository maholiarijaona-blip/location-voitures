import CrudPage from '../CrudPage'
import { clientsApi } from '../../api/resources'

const columns = [
  { key: 'nom', label: 'Nom', sortable: true },
  { key: 'prenom', label: 'Prénom', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'numero_permis', label: 'N° de permis' },
]

const fields = [
  { name: 'nom', label: 'Nom', required: true },
  { name: 'prenom', label: 'Prénom', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'telephone', label: 'Téléphone', required: true },
  { name: 'numero_permis', label: 'Numéro de permis', required: true },
  { name: 'adresse', label: 'Adresse', as: 'textarea', full: true },
]

const emptyForm = { nom: '', prenom: '', email: '', telephone: '', numero_permis: '', adresse: '' }

export default function ClientsPage() {
  return (
    <CrudPage
      title="Clients"
      subtitle="Gérez les clients de l'agence"
      singular="Client"
      api={clientsApi}
      columns={columns}
      fields={fields}
      emptyForm={emptyForm}
      itemLabel={(r) => `${r.prenom} ${r.nom}`}
      defaultSort="nom"
      searchPlaceholder="Rechercher un client (nom, email, téléphone, permis)..."
      exportColumns={columns}
    />
  )
}

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CarFront, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import FormInput from '../../components/FormInput'
import Button from '../../components/Button'

const EMPTY = {
  nom: '', prenom: '', email: '', telephone: '', numero_permis: '', password: '', password2: '',
}

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value })
  const erreur = (name) => (Array.isArray(errors[name]) ? errors[name][0] : errors[name])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const manquants = {}
    Object.keys(EMPTY).forEach((k) => {
      if (!form[k].trim()) manquants[k] = 'Ce champ est requis'
    })
    setErrors(manquants)
    if (Object.keys(manquants).length) return
    setLoading(true)
    try {
      await register(form)
      toast.success('Compte créé avec succès')
      navigate('/', { replace: true })
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') setErrors(data)
      toast.error(err.friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-950 p-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          <CarFront size={32} className="text-white" />
          <h1 className="text-lg font-semibold text-white">Créer un compte client</h1>
          <p className="text-sm text-neutral-400">Renseignez vos informations pour réserver une voiture</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Nom" name="nom" value={form.nom} error={erreur('nom')} onChange={set('nom')} />
            <FormInput label="Prénom" name="prenom" value={form.prenom} error={erreur('prenom')} onChange={set('prenom')} />
          </div>
          <FormInput label="Email" name="email" type="email" value={form.email} error={erreur('email')} onChange={set('email')} />
          <FormInput label="Téléphone" name="telephone" value={form.telephone} error={erreur('telephone')} onChange={set('telephone')} />
          <FormInput label="Numéro de permis" name="numero_permis" value={form.numero_permis} error={erreur('numero_permis')} onChange={set('numero_permis')} />
          <FormInput label="Mot de passe" name="password" type="password" value={form.password} error={erreur('password')} onChange={set('password')} />
          <FormInput label="Confirmer le mot de passe" name="password2" type="password" value={form.password2} error={erreur('password2')} onChange={set('password2')} />
          <Button type="submit" icon={UserPlus} loading={loading} className="w-full">
            Créer mon compte
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-neutral-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-white underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

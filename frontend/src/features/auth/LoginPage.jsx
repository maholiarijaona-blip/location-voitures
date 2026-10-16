import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CarFront, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import FormInput from '../../components/FormInput'
import Button from '../../components/Button'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-950 p-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          <CarFront size={32} className="text-white" />
          <h1 className="text-lg font-semibold text-white">Location de voitures</h1>
          <p className="text-sm text-neutral-400">Connectez-vous à votre compte</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email ou nom d'utilisateur"
            name="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <FormInput
            label="Mot de passe"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" icon={LogIn} loading={loading} className="w-full">
            Se connecter
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-neutral-400">
          Vous êtes client ?{' '}
          <Link to="/inscription" className="font-medium text-white underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}

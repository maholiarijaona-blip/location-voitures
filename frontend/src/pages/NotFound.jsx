import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-6xl font-bold text-neutral-700">404</p>
      <p className="text-neutral-300">Cette page n'existe pas.</p>
      <Link to="/" className="focus-ring rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200">
        Retour au tableau de bord
      </Link>
    </div>
  )
}

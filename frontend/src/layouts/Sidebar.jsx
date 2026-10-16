import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Car, CarFront, Users, KeyRound, Wallet, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LIENS_ADMIN = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/voitures', label: 'Voitures', icon: Car },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/locations', label: 'Locations', icon: KeyRound },
  { to: '/paiements', label: 'Paiements', icon: Wallet },
]

const LIENS_CLIENT = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/voitures', label: 'Voitures', icon: Car },
  { to: '/locations', label: 'Mes locations', icon: KeyRound },
  { to: '/paiements', label: 'Mes paiements', icon: Wallet },
]

export default function Sidebar({ open, onNavigate }) {
  const { user, isAdmin, logout } = useAuth()
  const liens = isAdmin ? LIENS_ADMIN : LIENS_CLIENT

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-neutral-800 bg-black transition-transform lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-neutral-800 px-5">
        <CarFront size={22} className="text-white" />
        <span className="font-semibold text-white">Location de voitures</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {liens.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-neutral-800 p-3">
        <p className="truncate text-sm font-medium text-white">{user?.nom_complet}</p>
        <p className="mb-2 text-xs text-neutral-400">{isAdmin ? 'Administrateur' : 'Client'}</p>
        <button
          onClick={logout}
          className="focus-ring flex w-full items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-sm text-white hover:bg-neutral-900"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}

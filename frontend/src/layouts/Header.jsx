import { Menu } from 'lucide-react'

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-neutral-800 bg-black px-4 lg:hidden">
      <button onClick={onMenuClick} className="focus-ring rounded-md p-2 text-white" aria-label="Ouvrir le menu">
        <Menu size={20} />
      </button>
    </header>
  )
}

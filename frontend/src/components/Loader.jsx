import { Loader2 } from 'lucide-react'

export default function Loader({ label = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-neutral-400">
      <Loader2 className="animate-spin" size={28} />
      <span className="text-sm">{label}</span>
    </div>
  )
}

import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-white text-black hover:bg-neutral-200',
  secondary: 'border border-neutral-700 text-white hover:bg-neutral-900',
  danger: 'border border-white text-white hover:bg-neutral-900',
  ghost: 'text-neutral-300 hover:bg-neutral-900',
}

export default function Button({ children, variant = 'primary', icon: Icon, loading = false, className = '', ...props }) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

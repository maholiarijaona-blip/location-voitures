const TONES = {
  success: 'bg-white text-black',
  warning: 'border border-neutral-500 text-neutral-200',
  danger: 'bg-white text-black',
  neutral: 'bg-neutral-800 text-neutral-300',
}

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  )
}

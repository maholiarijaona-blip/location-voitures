export default function Card({ title, value, icon: Icon, subtitle }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg border border-neutral-800 p-3 text-white">
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function FormInput({ label, name, type = 'text', as = 'input', options = [], error, hint, required = false, className = '', ...props }) {
  const base =
    'focus-ring w-full rounded-lg border border-neutral-700 bg-black px-3 py-2 text-sm text-white placeholder:text-neutral-500'

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-neutral-200">
          {label}
        </label>
      )}
      {as === 'select' ? (
        <select id={name} name={name} className={base} {...props}>
          <option value="">-- Sélectionner --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea id={name} name={name} rows={3} className={base} {...props} />
      ) : (
        <input id={name} name={name} type={type} className={base} {...props} />
      )}
      {hint && !error && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-neutral-300">{error}</p>}
    </div>
  )
}

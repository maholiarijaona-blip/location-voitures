import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import FormInput from '../components/FormInput'
import Button from '../components/Button'

function buildForm(fields, emptyForm, initialData) {
  if (!initialData) return emptyForm
  const form = {}
  fields.forEach((f) => {
    form[f.name] = initialData[f.name] ?? ''
  })
  return form
}

const resolveMin = (f, form) => (typeof f.min === 'function' ? f.min(form) : f.min)

function dateError(f, form, initialData) {
  if (f.type !== 'date' || !f.min || !form[f.name]) return null
  const min = resolveMin(f, form)
  // Un champ inchangé d'une ancienne location n'est pas contrôlé
  const modifie = !initialData || String(initialData[f.name] ?? '') !== String(form[f.name])
  if (min && modifie && form[f.name] < min) return f.minMessage || `${f.label} est invalide`
  return null
}

export default function CrudForm({ open, onClose, onSubmit, initialData, loading, fields, emptyForm, title }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [options, setOptions] = useState({})

  useEffect(() => {
    if (!open) return
    setForm(buildForm(fields, emptyForm, initialData))
    setErrors({})
    fields
      .filter((f) => f.optionsFrom)
      .forEach((f) => {
        f.optionsFrom.api
          .list({ page_size: 100, ...(f.optionsFrom.params || {}) })
          .then((res) => {
            const items = res.data.results ?? res.data ?? []
            setOptions((o) => ({ ...o, [f.name]: items.map(f.optionsFrom.map) }))
          })
          .catch(() => setOptions((o) => ({ ...o, [f.name]: [] })))
      })
  }, [open, initialData])

  const handleChange = (name, value) => {
    const next = { ...form, [name]: value }
    setForm(next)
    setErrors((prev) => {
      const errs = { ...prev, [name]: undefined }
      // revalide toutes les dates (la date de fin dépend de la date de début)
      fields.forEach((f) => {
        if (f.type === 'date' && f.min) errs[f.name] = dateError(f, next, initialData) || undefined
      })
      return errs
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    fields.forEach((f) => {
      if (f.required && !String(form[f.name] ?? '').trim()) errs[f.name] = `${f.label} est requis`
      else {
        const msg = dateError(f, form, initialData)
        if (msg) errs[f.name] = msg
      }
    })
    setErrors(errs)
    if (Object.keys(errs).length) return
    const payload = {}
    fields.forEach((f) => {
      payload[f.name] = form[f.name] === '' && f.nullable ? null : form[f.name]
    })
    onSubmit(payload)
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <FormInput
              key={f.name}
              label={f.label}
              name={f.name}
              type={f.type || 'text'}
              as={f.as || 'input'}
              options={f.options || options[f.name] || []}
              required={f.required}
              step={f.step}
              min={resolveMin(f, form)}
              hint={f.type === 'date' && f.min && resolveMin(f, form) ? `À partir du ${resolveMin(f, form).split('-').reverse().join('/')}` : undefined}
              error={errors[f.name]}
              className={f.full ? 'sm:col-span-2' : ''}
              value={form[f.name] ?? ''}
              onChange={(e) => handleChange(f.name, e.target.value)}
            />
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
          <Button type="submit" loading={loading}>{initialData ? 'Enregistrer' : 'Ajouter'}</Button>
        </div>
      </form>
    </Modal>
  )
}

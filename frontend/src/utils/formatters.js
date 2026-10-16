export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const [y, m, d] = String(dateStr).slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '-'
  return `${Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar`
}

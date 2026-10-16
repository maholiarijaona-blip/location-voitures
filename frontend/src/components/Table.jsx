import { ArrowUpDown, Search } from 'lucide-react'
import Loader from './Loader'

export default function Table({
  columns, data, loading, sortKey, onSort, search, onSearchChange,
  searchPlaceholder = 'Rechercher...', emptyLabel = 'Aucune donnée trouvée',
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      {onSearchChange && (
        <div className="border-b border-neutral-800 p-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="focus-ring w-full rounded-lg border border-neutral-700 bg-black py-2 pl-9 pr-3 text-sm text-white placeholder:text-neutral-500"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-800 text-neutral-400">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">
                  {col.sortable ? (
                    <button onClick={() => onSort?.(col.key)} className="focus-ring inline-flex items-center gap-1 hover:text-white">
                      {col.label}
                      <ArrowUpDown size={12} className={sortKey === col.key ? 'opacity-100' : 'opacity-30'} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {loading ? (
              <tr><td colSpan={columns.length}><Loader /></td></tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-neutral-500">{emptyLabel}</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-900">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-3 text-neutral-100">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

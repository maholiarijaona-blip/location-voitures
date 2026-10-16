import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, FileDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import Table from '../components/Table'
import Button from '../components/Button'
import Pagination from '../components/Pagination'
import ConfirmModal from '../components/ConfirmModal'
import CrudForm from './CrudForm'
import { exportToPDF } from '../utils/exportUtils'

const PAGE_SIZE = 10

export default function CrudPage({
  title,
  subtitle,
  singular,
  api,
  columns,
  fields,
  emptyForm,
  itemLabel,
  defaultSort,
  searchPlaceholder,
  rowActions,
  exportColumns,
  canCreate = true,
  canEdit = true,
  canDelete = true,
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState(defaultSort)
  const [sortDir, setSortDir] = useState('asc')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)

  const debouncedSearch = useDebounce(search)

  const params = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      page,
      page_size: PAGE_SIZE,
      ordering: `${sortDir === 'desc' ? '-' : ''}${sortKey}`,
    }),
    [debouncedSearch, page, sortKey, sortDir]
  )

  const { data, count, loading, refetch } = useFetch(api.list, params, [
    debouncedSearch,
    page,
    sortKey,
    sortDir,
  ])

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (payload) => {
    setSaving(true)
    try {
      if (editing) {
        await api.update(editing.id, payload)
        toast.success(`${singular} modifié avec succès`)
      } else {
        await api.create(payload)
        toast.success(`${singular} ajouté avec succès`)
      }
      closeForm()
      refetch()
    } catch (err) {
      toast.error(err.friendlyMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.remove(toDelete.id)
      toast.success(`${singular} supprimé`)
      setToDelete(null)
      refetch()
    } catch (err) {
      toast.error(err.friendlyMessage)
      setToDelete(null)
    } finally {
      setSaving(false)
    }
  }

  const withActions = canEdit || canDelete || rowActions
  const allColumns = withActions
    ? [
        ...columns,
        {
          key: 'actions',
          label: 'Actions',
          render: (row) => (
            <div className="flex items-center gap-1">
              {rowActions && rowActions(row, refetch)}
              {canEdit && (
                <button
                  onClick={() => {
                    setEditing(row)
                    setFormOpen(true)
                  }}
                  className="focus-ring rounded-md p-1.5 text-neutral-300 hover:bg-neutral-800"
                  aria-label="Modifier"
                >
                  <Pencil size={16} />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => setToDelete(row)}
                  className="focus-ring rounded-md p-1.5 text-neutral-300 hover:bg-neutral-800"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ),
        },
      ]
    : columns

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-neutral-400">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          {exportColumns && (
            <Button variant="secondary" icon={FileDown} onClick={() => exportToPDF(title, exportColumns, data)}>
              Exporter en PDF
            </Button>
          )}
          {canCreate && (
            <Button
              icon={Plus}
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
            >
              Ajouter
            </Button>
          )}
        </div>
      </div>

      <Table
        columns={allColumns}
        data={data}
        loading={loading}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        searchPlaceholder={searchPlaceholder}
        emptyLabel="Aucun résultat"
      />
      <Pagination page={page} pageSize={PAGE_SIZE} count={count} onPageChange={setPage} />

      <CrudForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        initialData={editing}
        loading={saving}
        fields={fields}
        emptyForm={emptyForm}
        title={editing ? `Modifier : ${singular}` : `Ajouter : ${singular}`}
      />
      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={saving}
        message={toDelete && `Supprimer « ${itemLabel(toDelete)} » ? Cette action est irréversible.`}
      />
    </div>
  )
}

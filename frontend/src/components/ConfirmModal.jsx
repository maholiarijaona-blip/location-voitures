import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmModal({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirmer la suppression'} size="sm">
      <div className="flex gap-3">
        <div className="h-fit flex-shrink-0 rounded-full border border-neutral-700 p-2">
          <AlertTriangle className="text-white" size={22} />
        </div>
        <p className="text-sm text-neutral-200">
          {message || 'Cette action est irréversible. Voulez-vous vraiment continuer ?'}
        </p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Annuler</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>Supprimer</Button>
      </div>
    </Modal>
  )
}

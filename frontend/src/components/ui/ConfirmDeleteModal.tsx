import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDeleteModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  description?: string
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
  title = 'Delete item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
}: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600 mb-6">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>Delete</Button>
      </div>
    </Modal>
  )
}

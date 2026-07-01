import React from 'react'
import { 
  Dialog, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '../ui/dialog'
import { Button } from '../ui/button'

interface AddDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  onSubmit?: () => void
  submitButtonText?: string
  isSubmitting?: boolean
}

export const AddDialog: React.FC<AddDialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitButtonText = "Add",
  isSubmitting = false
}) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit()
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && (
          <DialogDescription>
            {description}
          </DialogDescription>
        )}
      </DialogHeader>

      <div className="py-2">
        {children || (
          <p className="text-sm text-muted-foreground">
            Form content will appear here!
          </p>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
export default AddDialog

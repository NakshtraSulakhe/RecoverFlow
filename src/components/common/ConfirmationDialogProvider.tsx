import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material'

interface ConfirmationOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info'
  onConfirm: () => Promise<void> | void
  onCancel?: () => void
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined)

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext)
  if (context === undefined) {
    throw new Error('useConfirmation must be used within a ConfirmationDialogProvider')
  }
  return context
}

interface ConfirmationDialogProviderProps {
  children: ReactNode
}

export const ConfirmationDialogProvider: React.FC<ConfirmationDialogProviderProps> = ({ children }) => {
  const [dialog, setDialog] = useState<ConfirmationOptions | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        ...options,
        onConfirm: async () => {
          setIsLoading(true)
          try {
            await options.onConfirm()
            resolve(true)
          } catch (error) {
            resolve(false)
          } finally {
            setIsLoading(false)
            setDialog(null)
          }
        },
        onCancel: () => {
          options.onCancel?.()
          resolve(false)
          setDialog(null)
        },
      })
    })
  }

  const handleClose = () => {
    if (!isLoading) {
      dialog?.onCancel?.()
      setDialog(null)
    }
  }

  const handleConfirm = async () => {
    if (dialog) {
      await dialog.onConfirm()
    }
  }

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <Dialog
          open={true}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle>{dialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialog.message}</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} disabled={isLoading}>
              {dialog.cancelText || 'Cancel'}
            </Button>
            <Button
              onClick={handleConfirm}
              color={dialog.confirmColor || 'primary'}
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {dialog.confirmText || 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ConfirmationContext.Provider>
  )
}

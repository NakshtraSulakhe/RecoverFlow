import React, { useEffect } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { removeNotification } from '../../redux/slices/uiSlice'

export const ToastProvider: React.FC = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector((state) => (state as any).ui.notifications)

  const handleClose = (id: string) => {
    dispatch(removeNotification(id))
  }

  useEffect(() => {
    notifications.forEach((notification: any) => {
      if (notification.autoHide !== false) {
        const duration = notification.duration || 5000
        const timer = setTimeout(() => {
          handleClose(notification.id)
        }, duration)

        return () => clearTimeout(timer)
      }
    })
  }, [notifications])

  return (
    <>
      {notifications.map((notification: any) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHide === false ? null : notification.duration || 5000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 2 }}
        >
          <Alert
            severity={notification.type as AlertColor}
            onClose={() => handleClose(notification.id)}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}

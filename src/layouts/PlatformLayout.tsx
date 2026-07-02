import React from 'react'
import { BaseLayout } from './BaseLayout'
import { Outlet } from 'react-router-dom'

export default function PlatformLayout() {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  )
}

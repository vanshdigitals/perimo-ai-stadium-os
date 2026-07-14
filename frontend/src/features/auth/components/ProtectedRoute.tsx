/**
 * ProtectedRoute — guards /admin/* routes.
 * Replace `authService.isAuthenticated()` with Firebase `useAuthState` for production.
 */
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '@/features/auth/services/authService'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation()

  if (!authService.isAuthenticated()) {
    return <Navigate to="/auth/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

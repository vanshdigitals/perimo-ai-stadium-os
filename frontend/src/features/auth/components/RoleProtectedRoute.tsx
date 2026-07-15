import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '@/features/auth/services/authService'
import type { SessionUser } from '@/features/auth/services/authService'

interface RoleProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: Array<SessionUser['role']>
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation()
  
  if (!authService.isAuthenticated()) {
    // Determine the login route based on the first allowed role, or default to admin
    const primaryRole = allowedRoles[0]
    let loginRoute = '/auth/admin/login'
    if (primaryRole === 'fan') loginRoute = '/auth/fan/login'
    else if (primaryRole === 'staff') loginRoute = '/auth/staff/login'
    else if (primaryRole === 'volunteer') loginRoute = '/auth/volunteer/login'

    return <Navigate to={loginRoute} state={{ from: location }} replace />
  }

  const user = authService.getCurrentUser()
  
  if (!user || !allowedRoles.includes(user.role)) {
    // If the user is logged in but doesn't have the right role, 
    // redirect them to their home portal.
    const roleMap: Record<string, string> = {
      'fan': '/fan',
      'staff': '/staff',
      'volunteer': '/volunteer',
      'admin': '/admin'
    }
    const fallbackRoute = user ? roleMap[user.role] : '/'
    return <Navigate to={fallbackRoute || '/'} replace />
  }

  return <>{children}</>
}

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/utils'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Server component wrapper for protected routes
export async function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}

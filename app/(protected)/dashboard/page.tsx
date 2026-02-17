'use client'

import { useAuth } from '@/hooks/use-auth'
import CollectorDashboard from '@/components/dashboards/collector-dashboard'
import BrandDashboard from '@/components/dashboards/brand-dashboard'

export default function DashboardPage() {
  const { user, userRole } = useAuth()

  if (!user) return null

  return userRole === 'BRAND' ? (
    <BrandDashboard userId={user.id} userName={user.name} />
  ) : (
    <CollectorDashboard userId={user.id} userName={user.name} />
  )
}

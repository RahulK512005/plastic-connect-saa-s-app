import { useAuth } from '@/hooks/use-auth'
import CollectorDashboard from '@/components/dashboards/collector-dashboard'
import BrandDashboard from '@/components/dashboards/brand-dashboard'
import { getUser } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'

async function getDashboardData(userId: string, userRole: string) {
  const supabase = await createClient()

  if (userRole === 'COLLECTOR') {
    const [listings, bids, transactions] = await Promise.all([
      supabase
        .from('listings')
        .select('id, material_type, weight_kg, asking_price, status')
        .eq('collector_id', userId),
      supabase
        .from('bids')
        .select('*, listings(material_type, weight_kg)')
        .eq('status', 'ACCEPTED'),
      supabase
        .from('transactions')
        .select('*')
        .eq('collector_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    return {
      listings: listings.data || [],
      totalListings: listings.data?.length || 0,
      soldMaterial: transactions.data?.reduce((sum, t) => sum + (t.weight_kg || 0), 0) || 0,
      revenue: transactions.data?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0,
    }
  } else {
    const [bids, transactions] = await Promise.all([
      supabase
        .from('bids')
        .select('*, listings(material_type, weight_kg)')
        .eq('brand_id', userId),
      supabase
        .from('transactions')
        .select('*')
        .eq('brand_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    return {
      activeBids: bids.data?.filter((b) => b.status === 'PENDING').length || 0,
      acceptedBids: bids.data?.filter((b) => b.status === 'ACCEPTED').length || 0,
      purchasedMaterial: transactions.data?.reduce((sum, t) => sum + (t.weight_kg || 0), 0) || 0,
      totalSpend: transactions.data?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0,
    }
  }
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    return null
  }

  const supabase = await createClient()
  
  // Fetch user profile with error handling
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // If profile doesn't exist yet, create it (shouldn't happen but safety fallback)
  if (error && error.code === 'PGRST116') {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        name: user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: user.user_metadata?.role || 'COLLECTOR',
      })
      .select('role')
      .single()

    const dashboardData = await getDashboardData(user.id, newProfile?.role || 'COLLECTOR')
    return (
      <div>
        {newProfile?.role === 'COLLECTOR' ? (
          <CollectorDashboard data={dashboardData as any} />
        ) : (
          <BrandDashboard data={dashboardData as any} />
        )}
      </div>
    )
  }

  const userRole = profile?.role || user.user_metadata?.role || 'COLLECTOR'
  const dashboardData = await getDashboardData(user.id, userRole)

  return (
    <div>
      {userRole === 'COLLECTOR' ? (
        <CollectorDashboard data={dashboardData as any} />
      ) : (
        <BrandDashboard data={dashboardData as any} />
      )}
    </div>
  )
}

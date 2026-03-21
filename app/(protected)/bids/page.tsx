import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/app/actions/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getUserBids(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('bids')
    .select(`
      id,
      price_per_kg,
      total_cost,
      status,
      created_at,
      listings(id, material_type, weight_kg, asking_price)
    `)
    .eq('brand_id', userId)
    .order('created_at', { ascending: false })

  return data || []
}

async function getUserListingBids(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('bids')
    .select(`
      id,
      price_per_kg,
      total_cost,
      status,
      created_at,
      listings(id, material_type, weight_kg)
    `)
    .in('listing_id', (
      await supabase
        .from('listings')
        .select('id')
        .eq('collector_id', userId)
    ).data?.map((l: any) => l.id) || [])
    .order('created_at', { ascending: false })

  return data || []
}

export default async function BidsPage() {
  const user = await getUser()

  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isBrand = profile?.role === 'BRAND'
  const bids = isBrand ? await getUserBids(user.id) : await getUserListingBids(user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {isBrand ? 'My Bids' : 'Bids Received'}
        </h1>
        <p className="text-slate-600 mt-2">
          {isBrand
            ? 'Track your bids across the marketplace'
            : 'Manage bids on your listings'}
        </p>
      </div>

      {/* Bids Table */}
      <Card className="border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {bids.length} {bids.length === 1 ? 'Bid' : 'Bids'}
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Material
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Weight
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bids.length > 0 ? (
                bids.map((bid: any) => (
                  <tr key={bid.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {bid.listings?.material_type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {bid.listings?.weight_kg} kg
                    </td>
                    <td className="px-6 py-4 text-green-600 font-bold">
                      ${bid.price_per_kg.toFixed(2)}/kg
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          bid.status === 'PENDING'
                            ? 'bg-yellow-50 text-yellow-700'
                            : bid.status === 'ACCEPTED'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-slate-50 text-slate-700'
                        }`}
                      >
                        {bid.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(bid.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/listings/${bid.listings?.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-600">No bids yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

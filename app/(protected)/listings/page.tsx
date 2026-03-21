import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/app/actions/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, Edit, Trash2 } from 'lucide-react'

async function getUserListings(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('collector_id', userId)
    .order('created_at', { ascending: false })

  return data || []
}

export default async function MyListingsPage() {
  const user = await getUser()

  if (!user) return null

  const listings = await getUserListings(user.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-700'
      case 'SOLD':
        return 'bg-blue-50 text-blue-700'
      case 'CANCELLED':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-slate-50 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
          <p className="text-slate-600 mt-2">Manage your plastic waste listings</p>
        </div>
        <Link href="/listings/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            + New Listing
          </Button>
        </Link>
      </div>

      {/* Listings */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <Card key={listing.id} className="p-6 border border-slate-200 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {listing.material_type}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{listing.weight_kg} kg</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-600">Grade</p>
                    <p className="font-semibold text-slate-900">{listing.grade}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Price</p>
                    <p className="font-semibold text-green-600">
                      ${listing.asking_price.toFixed(2)}/kg
                    </p>
                  </div>
                </div>

                {listing.highest_bid_amount && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">Highest Bid</p>
                    <p className="text-lg font-bold text-blue-700">
                      ${listing.highest_bid_amount.toFixed(2)}/kg
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Link href={`/listings/${listing.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border border-slate-200">
          <p className="text-slate-600 mb-4">No listings yet</p>
          <p className="text-slate-500 mb-6">Start selling your plastic waste on the marketplace</p>
          <Link href="/listings/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Create First Listing
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

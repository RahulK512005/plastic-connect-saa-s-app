import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/app/actions/auth'
import { Card } from '@/components/ui/card'
import { Package, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react'

async function getLogistics(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('logistics')
    .select(`
      id,
      transaction_id,
      status,
      tracking_number,
      carrier,
      current_location,
      estimated_delivery,
      updated_at,
      transactions(material_type, weight_kg, collector_id, brand_id)
    `)
    .or(`transactions.collector_id.eq.${userId},transactions.brand_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  return data || []
}

const statusSteps = ['PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'PROCESSING', 'DELIVERED']

export default async function LogisticsPage() {
  const user = await getUser()

  if (!user) return null

  const logistics = await getLogistics(user.id)

  const getStatusIcon = (status: string) => {
    if (status === 'DELIVERED') return CheckCircle
    if (status === 'IN_TRANSIT') return Package
    return Clock
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'IN_TRANSIT':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'PROCESSING':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'PICKUP_SCHEDULED':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Logistics Tracking</h1>
        <p className="text-slate-600 mt-2">Track your shipments in real-time</p>
      </div>

      {/* Shipments */}
      {logistics.length > 0 ? (
        <div className="space-y-4">
          {logistics.map((logistics_item: any) => {
            const currentStep = statusSteps.indexOf(logistics_item.status)
            const StatusIcon = getStatusIcon(logistics_item.status)

            return (
              <Card key={logistics_item.id} className="p-6 border border-slate-200">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-600">
                        {logistics_item.transactions.material_type} •{' '}
                        {logistics_item.transactions.weight_kg} kg
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900 mt-1">
                        Tracking #{logistics_item.tracking_number || 'N/A'}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-lg border ${getStatusColor(logistics_item.status)}`}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div>
                    <div className="relative">
                      {/* Progress Bar */}
                      <div className="flex gap-2 mb-4">
                        {statusSteps.map((step, idx) => (
                          <div
                            key={step}
                            className={`flex-1 h-2 rounded-full ${
                              idx <= currentStep
                                ? 'bg-green-600'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Step Labels */}
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Pickup</span>
                        <span>In Transit</span>
                        <span>Processing</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600">Carrier</p>
                      <p className="font-semibold text-slate-900">{logistics_item.carrier || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Current Location</p>
                      <p className="font-semibold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {logistics_item.current_location || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Est. Delivery</p>
                      <p className="font-semibold text-slate-900">
                        {logistics_item.estimated_delivery
                          ? new Date(logistics_item.estimated_delivery).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Last Updated</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(logistics_item.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center border border-slate-200">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-slate-300" />
          </div>
          <p className="text-slate-600 mb-2">No active shipments</p>
          <p className="text-slate-500">Your shipments will appear here once transactions are initiated</p>
        </Card>
      )}
    </div>
  )
}

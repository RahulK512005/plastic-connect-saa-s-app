'use client'

import { Card } from '@/components/ui/card'
import { Package, MapPin, CheckCircle, Clock, Truck } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { dbGetTransactionsByUser } from '@/lib/mock-db'

const mockShipments = [
  {
    id: 'ship-001',
    materialType: 'PET',
    weightKg: 500,
    status: 'IN_TRANSIT',
    trackingNumber: 'IND-2025-87432',
    carrier: 'BlueDart Express',
    currentLocation: 'Nashik, Maharashtra',
    estimatedDelivery: '2026-02-20',
  },
  {
    id: 'ship-002',
    materialType: 'HDPE',
    weightKg: 300,
    status: 'DELIVERED',
    trackingNumber: 'IND-2025-65291',
    carrier: 'DTDC Logistics',
    currentLocation: 'Delhi, NCR',
    estimatedDelivery: '2026-01-15',
  },
]

const statusSteps = ['PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'PROCESSING', 'DELIVERED']

export default function LogisticsPage() {
  const { user } = useAuth()
  if (!user) return null

  const getStatusIcon = (status: string) => {
    if (status === 'DELIVERED') return CheckCircle
    if (status === 'IN_TRANSIT') return Truck
    return Clock
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'IN_TRANSIT':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'PROCESSING':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Logistics Tracking</h1>
        <p className="text-slate-600 mt-2">Track your shipments in real-time</p>
      </div>

      {mockShipments.length > 0 ? (
        <div className="space-y-4">
          {mockShipments.map((shipment) => {
            const currentStep = statusSteps.indexOf(shipment.status)
            const StatusIcon = getStatusIcon(shipment.status)

            return (
              <Card key={shipment.id} className="p-6 border border-slate-200 bg-white">
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {shipment.materialType} &middot; {shipment.weightKg} kg
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900 mt-1">
                        Tracking #{shipment.trackingNumber}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-lg border ${getStatusColor(shipment.status)}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex gap-2 mb-3">
                      {statusSteps.map((step, idx) => (
                        <div
                          key={step}
                          className={`flex-1 h-2 rounded-full ${
                            idx <= currentStep ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Pickup</span>
                      <span>In Transit</span>
                      <span>Processing</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Carrier</p>
                      <p className="text-sm font-semibold text-slate-900">{shipment.carrier}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Current Location</p>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {shipment.currentLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Est. Delivery</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(shipment.estimatedDelivery).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-14 text-center border border-slate-200 bg-white">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-slate-100">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
          </div>
          <p className="text-slate-600 mb-2">No active shipments</p>
          <p className="text-sm text-slate-500">
            Your shipments will appear here once transactions are initiated
          </p>
        </Card>
      )}
    </div>
  )
}

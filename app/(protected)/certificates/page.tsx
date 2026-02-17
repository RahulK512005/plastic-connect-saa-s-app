'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Eye, Award, FileCheck } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { dbGetTransactionsByUser, formatINR } from '@/lib/mock-db'

export default function CertificatesPage() {
  const { user, userRole } = useAuth()
  if (!user) return null

  // Only brands should see certificates
  const transactions = dbGetTransactionsByUser(user.id).filter(
    (t) => t.status === 'COMPLETED' && t.brandId === user.id
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Compliance Certificates</h1>
        <p className="text-slate-600 mt-2">Download and view your compliance certificates for completed transactions</p>
      </div>

      {/* Certificates Grid */}
      {transactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transactions.map((tx) => (
            <Card key={tx.id} className="p-6 border border-slate-200 bg-white hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-green-100">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{tx.materialType}</p>
                      <p className="text-xs text-slate-500">Certificate #{tx.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Weight</p>
                    <p className="font-semibold text-slate-900">{tx.weightKg} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Amount</p>
                    <p className="font-semibold text-green-600">{formatINR(tx.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Seller</p>
                    <p className="font-semibold text-slate-900">{tx.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-14 text-center border border-slate-200 bg-white">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-slate-100">
              <FileCheck className="w-10 h-10 text-slate-300" />
            </div>
          </div>
          <p className="text-slate-600 mb-2">No certificates yet</p>
          <p className="text-slate-500 text-sm">
            Certificates will be generated when transactions are completed
          </p>
        </Card>
      )}
    </div>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { dbGetTransactionsByUser, formatINR } from '@/lib/mock-db'

export default function TransactionsPage() {
  const { user } = useAuth()
  if (!user) return null

  const transactions = dbGetTransactionsByUser(user.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700'
      case 'PAYMENT_PENDING': return 'bg-orange-50 text-orange-700'
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700'
      case 'COMPLETED': return 'bg-green-50 text-green-700'
      default: return 'bg-slate-50 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        <p className="text-slate-600 mt-2">View all your completed and pending transactions</p>
      </div>

      <Card className="border border-slate-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Material</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Weight</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price/kg</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Counterparty</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-900 font-medium">{tx.materialType}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{tx.weightKg} kg</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{formatINR(tx.pricePerKg)}</td>
                    <td className="px-5 py-4 text-sm font-bold text-green-600">{formatINR(tx.totalAmount)}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {tx.collectorId === user.id ? tx.buyerName : tx.sellerName}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <p className="text-slate-500">No transactions yet</p>
                    <p className="text-sm text-slate-400 mt-1">Transactions will appear here after purchases are made</p>
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

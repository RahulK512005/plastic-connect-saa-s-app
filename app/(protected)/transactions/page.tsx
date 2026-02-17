import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/app/actions/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getTransactions(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .or(`collector_id.eq.${userId},brand_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  return data || []
}

export default async function TransactionsPage() {
  const user = await getUser()

  if (!user) return null

  const transactions = await getTransactions(user.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700'
      case 'PAYMENT_PENDING':
        return 'bg-orange-50 text-orange-700'
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700'
      case 'COMPLETED':
        return 'bg-green-50 text-green-700'
      default:
        return 'bg-slate-50 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        <p className="text-slate-600 mt-2">View all your completed and pending transactions</p>
      </div>

      {/* Transactions Table */}
      <Card className="border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
          </h2>
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
                  Amount
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
              {transactions.length > 0 ? (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {tx.material_type}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {tx.weight_kg} kg
                    </td>
                    <td className="px-6 py-4 text-green-600 font-bold">
                      ${tx.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                      {tx.certificate_url && (
                        <a href={tx.certificate_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            Certificate
                          </Button>
                        </a>
                      )}
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-600">No transactions yet</p>
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

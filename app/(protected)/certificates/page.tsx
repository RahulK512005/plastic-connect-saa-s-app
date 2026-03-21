import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/app/actions/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Eye } from 'lucide-react'

async function getCertificates(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('transactions')
    .select(`
      id,
      material_type,
      weight_kg,
      total_amount,
      certificate_url,
      created_at,
      profiles:collector_id(name)
    `)
    .eq('brand_id', userId)
    .not('certificate_url', 'is', null)
    .order('created_at', { ascending: false })

  return data || []
}

export default async function CertificatesPage() {
  const user = await getUser()

  if (!user) return null

  const certificates = await getCertificates(user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Compliance Certificates</h1>
        <p className="text-slate-600 mt-2">Download and view your compliance certificates</p>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert: any) => (
            <Card key={cert.id} className="p-6 border border-slate-200">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Material Type</p>
                  <p className="text-lg font-semibold text-slate-900">{cert.material_type}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Weight</p>
                    <p className="font-semibold text-slate-900">{cert.weight_kg} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Amount</p>
                    <p className="font-semibold text-green-600">${cert.total_amount.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Date</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(cert.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(cert.certificate_url)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = cert.certificate_url
                      a.download = `certificate-${cert.id}.pdf`
                      a.click()
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border border-slate-200">
          <p className="text-slate-600 mb-4">No certificates yet</p>
          <p className="text-slate-500">Certificates will be generated when transactions are completed</p>
        </Card>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, ListPlus } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/use-auth'
import { dbCreateListing, formatPricePerKg } from '@/lib/mock-db'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const materialTypes = ['PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Mixed']

function deriveGrade(purity: number): 'A' | 'B' | 'C' {
  if (purity >= 90) return 'A'
  if (purity >= 75) return 'B'
  return 'C'
}

export default function CreateListingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    materialType: '',
    weight: '',
    location: '',
    askingPrice: '',
    description: '',
    purityPercent: '',
    contaminationPercent: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      const purity = parseFloat(formData.purityPercent) || 80
      const contamination = parseFloat(formData.contaminationPercent) || (100 - purity)
      const grade = deriveGrade(purity)

      const listing = dbCreateListing({
        collectorId: user.id,
        collectorName: user.name,
        materialType: formData.materialType as any,
        weightKg: parseFloat(formData.weight),
        purityPercent: purity,
        contaminationPercent: contamination,
        grade,
        pricePerKg: parseFloat(formData.askingPrice),
        location: formData.location,
        description: formData.description,
        imageUrl: '/placeholder.svg',
      })

      router.push(`/listings/${listing.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing')
      setLoading(false)
    }
  }

  const estimatedGrade = formData.purityPercent
    ? deriveGrade(parseFloat(formData.purityPercent))
    : null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create New Listing</h1>
        <p className="text-slate-600 mt-2">Add your plastic waste to the marketplace</p>
      </div>

      <Card className="p-6 border border-slate-200 bg-white">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="font-medium text-slate-700">Material Type *</Label>
            <Select
              value={formData.materialType}
              onValueChange={(v) => setFormData({ ...formData, materialType: v })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-medium text-slate-700">Weight (kg) *</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g., 500"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium text-slate-700">Price per kg *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  {'\u20B9'}
                </span>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.askingPrice}
                  onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                  placeholder="e.g., 42"
                  required
                  className="pl-8 h-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-medium text-slate-700">Purity (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.purityPercent}
                onChange={(e) => setFormData({ ...formData, purityPercent: e.target.value })}
                placeholder="e.g., 92"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium text-slate-700">Contamination (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.contaminationPercent}
                onChange={(e) => setFormData({ ...formData, contaminationPercent: e.target.value })}
                placeholder="e.g., 8"
                className="h-10"
              />
            </div>
          </div>

          {estimatedGrade && (
            <div className={`p-3 rounded-lg text-sm font-medium ${
              estimatedGrade === 'A' ? 'bg-green-50 text-green-700' :
              estimatedGrade === 'B' ? 'bg-amber-50 text-amber-700' :
              'bg-red-50 text-red-700'
            }`}>
              Estimated Grade: {estimatedGrade} ({parseFloat(formData.purityPercent)}% purity)
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-medium text-slate-700">Location *</Label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Mumbai, Maharashtra"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-slate-700">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your plastic waste material..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.materialType || !formData.weight || !formData.location || !formData.askingPrice}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Creating...
              </>
            ) : (
              <>
                <ListPlus className="w-4 h-4 mr-2" />
                Create Listing
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}

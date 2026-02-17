'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import PricingRecommendation from '@/components/pricing/pricing-recommendation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const materialTypes = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other']

export default function CreateListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    materialType: '',
    weight: '',
    location: '',
    askingPrice: '',
    description: '',
    purityScore: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_type: formData.materialType,
          weight_kg: parseFloat(formData.weight),
          location: formData.location,
          asking_price: parseFloat(formData.askingPrice),
          description: formData.description,
          purity_score: formData.purityScore ? parseFloat(formData.purityScore) : null,
          grade: formData.purityScore
            ? parseFloat(formData.purityScore) >= 95
              ? 'A'
              : parseFloat(formData.purityScore) >= 85
                ? 'B'
                : 'C'
            : 'B',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create listing')
      }

      const { id } = await response.json()
      router.push(`/listings/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create New Listing</h1>
        <p className="text-slate-600 mt-2">Add your plastic waste to the marketplace</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-8 border border-slate-200">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
          {/* Material Type */}
          <div className="space-y-2">
            <Label className="font-medium text-slate-900">Material Type *</Label>
            <Select
              value={formData.materialType}
              onValueChange={(v) => setFormData({ ...formData, materialType: v })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label className="font-medium text-slate-900">Weight (kg) *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="Enter weight in kilograms"
              required
              className="h-10"
            />
          </div>

          {/* Purity Score */}
          <div className="space-y-2">
            <Label className="font-medium text-slate-900">Purity Score (%) - Optional</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.purityScore}
              onChange={(e) => setFormData({ ...formData, purityScore: e.target.value })}
              placeholder="e.g., 95.5"
              className="h-10"
            />
            <p className="text-xs text-slate-500">Will auto-assign grade based on purity</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="font-medium text-slate-900">Location *</Label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State"
              required
              className="h-10"
            />
          </div>

          {/* Asking Price */}
          <div className="space-y-2">
            <Label className="font-medium text-slate-900">Asking Price (per kg) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-medium">
                $
              </span>
              <Input
                type="number"
                step="0.01"
                value={formData.askingPrice}
                onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                placeholder="0.00"
                required
                className="pl-8 h-10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-medium text-slate-900">Description</Label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your plastic waste..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || !formData.materialType || !formData.weight || !formData.location || !formData.askingPrice}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg h-10"
          >
            {loading ? 'Creating Listing...' : 'Create Listing'}
          </Button>
            </form>
          </Card>
        </div>

        {/* Pricing Recommendation */}
        {formData.materialType && formData.weight && formData.location && (
          <div>
            <PricingRecommendation
              materialType={formData.materialType}
              weight={parseFloat(formData.weight) || 0}
              purityScore={formData.purityScore ? parseFloat(formData.purityScore) : undefined}
              grade={
                formData.purityScore
                  ? parseFloat(formData.purityScore) >= 95
                    ? 'A'
                    : parseFloat(formData.purityScore) >= 85
                      ? 'B'
                      : 'C'
                  : 'B'
              }
              location={formData.location}
            />
          </div>
        )}
      </div>
    </div>
  )
}

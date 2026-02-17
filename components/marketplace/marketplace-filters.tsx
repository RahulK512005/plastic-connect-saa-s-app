'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Filter, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const materialTypes = [
  'PET',
  'HDPE',
  'PVC',
  'LDPE',
  'PP',
  'PS',
  'Other',
]

const grades = ['A', 'B', 'C']

export default function MarketplaceFilters() {
  const [filters, setFilters] = useState({
    materialType: '',
    grade: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  })

  const [showFilters, setShowFilters] = useState(true)

  const handleReset = () => {
    setFilters({
      materialType: '',
      grade: '',
      minPrice: '',
      maxPrice: '',
      location: '',
    })
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <Card className="p-6 border border-slate-200 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-green-600 hover:text-green-700 font-medium"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Material Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Material Type</Label>
          <Select value={filters.materialType} onValueChange={(v) => setFilters({ ...filters, materialType: v })}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All materials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All materials</SelectItem>
              {materialTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grade */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Grade</Label>
          <Select value={filters.grade} onValueChange={(v) => setFilters({ ...filters, grade: v })}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All grades</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  Grade {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Price Range (per kg)</Label>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="h-9"
            />
            <Input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="h-9"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Location</Label>
          <Input
            type="text"
            placeholder="City or region"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="h-9"
          />
        </div>

        {/* Apply Button */}
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg h-10">
          Apply Filters
        </Button>
      </div>
    </Card>
  )
}

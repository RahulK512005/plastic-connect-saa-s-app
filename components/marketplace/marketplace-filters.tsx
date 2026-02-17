'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const materialTypes = ['PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Mixed']
const grades = ['A', 'B', 'C']

interface MarketplaceFiltersProps {
  filters: {
    materialType: string
    grade: string
    minPrice: string
    maxPrice: string
    location: string
  }
  onFilterChange: (filters: any) => void
}

export default function MarketplaceFilters({ filters, onFilterChange }: MarketplaceFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      materialType: '',
      grade: '',
      minPrice: '',
      maxPrice: '',
      location: '',
    })
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <Card className="p-5 border border-slate-200 sticky top-24 bg-white">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button onClick={handleReset} className="text-xs text-green-600 hover:text-green-700 font-medium">
            Reset
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Material Type */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-700">Material Type</Label>
          <Select
            value={filters.materialType || 'all'}
            onValueChange={(v) => onFilterChange({ ...filters, materialType: v === 'all' ? '' : v })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All materials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All materials</SelectItem>
              {materialTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grade */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-700">Grade</Label>
          <Select
            value={filters.grade || 'all'}
            onValueChange={(v) => onFilterChange({ ...filters, grade: v === 'all' ? '' : v })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-700">{'Price Range (\u20B9/kg)'}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
              className="h-9 text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-700">Location</Label>
          <Input
            type="text"
            placeholder="City or state"
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            className="h-9 text-sm"
          />
        </div>

        {hasActiveFilters && (
          <Button onClick={handleReset} variant="outline" className="w-full h-9 text-sm">
            Clear All Filters
          </Button>
        )}
      </div>
    </Card>
  )
}

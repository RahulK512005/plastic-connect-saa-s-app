'use client'

import { useState, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Camera,
  Upload,
  ImageIcon,
  Microscope,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  RotateCcw,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { dbSaveGradingResult, dbGetGradingResultsByUser, type AIGradingResult } from '@/lib/mock-db'

const materialTypes = ['PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Mixed']

function simulateAIGrading(purity: number, contamination: number): { grade: 'A' | 'B' | 'C'; confidence: number } {
  // AI grading simulation based on purity and contamination
  const score = purity - contamination * 0.5
  let grade: 'A' | 'B' | 'C'
  let confidence: number

  if (score >= 88) {
    grade = 'A'
    confidence = 85 + Math.random() * 12
  } else if (score >= 75) {
    grade = 'B'
    confidence = 78 + Math.random() * 15
  } else {
    grade = 'C'
    confidence = 72 + Math.random() * 18
  }

  return { grade, confidence: Math.round(confidence * 10) / 10 }
}

export default function UploadMaterialPage() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AIGradingResult | null>(null)

  const [formData, setFormData] = useState({
    materialType: '',
    purityPercent: '',
    contaminationPercent: '',
    weightKg: '',
  })

  // Previous results
  const previousResults = user ? dbGetGradingResultsByUser(user.id) : []

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setCameraActive(false)
      stopCamera()
    }
    reader.readAsDataURL(file)
  }

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setCameraActive(true)
        setImagePreview(null)
      }
    } catch (err) {
      alert('Unable to access camera. Please use file upload instead.')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }, [])

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      setImagePreview(dataUrl)
      stopCamera()
    }
  }, [stopCamera])

  // Remove image
  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Run AI grading
  const handleAnalyze = () => {
    if (!user) return
    if (!formData.materialType || !formData.purityPercent || !formData.contaminationPercent || !formData.weightKg) {
      alert('Please fill in all fields before analyzing.')
      return
    }

    setAnalyzing(true)
    setResult(null)

    // Simulate AI processing delay
    setTimeout(() => {
      const purity = parseFloat(formData.purityPercent)
      const contamination = parseFloat(formData.contaminationPercent)
      const weight = parseFloat(formData.weightKg)

      const aiResult = simulateAIGrading(purity, contamination)

      const savedResult = dbSaveGradingResult({
        userId: user.id,
        materialType: formData.materialType,
        purityPercent: purity,
        contaminationPercent: contamination,
        weightKg: weight,
        grade: aiResult.grade,
        confidence: aiResult.confidence,
        verified: true,
        imageUrl: imagePreview || undefined,
      })

      setResult(savedResult)
      setAnalyzing(false)
    }, 2000)
  }

  // Reset form
  const handleReset = () => {
    setFormData({ materialType: '', purityPercent: '', contaminationPercent: '', weightKg: '' })
    setImagePreview(null)
    setResult(null)
    stopCamera()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const gradeConfig = {
    A: { color: 'bg-green-100 text-green-700 border-green-300', label: 'Grade A - Premium', icon: CheckCircle2, barColor: 'bg-green-500' },
    B: { color: 'bg-amber-100 text-amber-700 border-amber-300', label: 'Grade B - Standard', icon: AlertTriangle, barColor: 'bg-amber-500' },
    C: { color: 'bg-red-100 text-red-700 border-red-300', label: 'Grade C - Low Quality', icon: XCircle, barColor: 'bg-red-500' },
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Upload Material</h1>
        <p className="text-slate-600 mt-2">
          Capture or upload an image, enter material details, and get AI-powered quality grading.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Image Capture */}
        <Card className="p-6 border border-slate-200 bg-white">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Material Image</h2>

          {/* Camera / Preview Area */}
          <div className="relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden mb-4 border border-slate-200">
            {cameraActive ? (
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            ) : imagePreview ? (
              <>
                <img src={imagePreview} alt="Material preview" className="w-full h-full object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No image captured</p>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Controls */}
          <div className="flex gap-3">
            {cameraActive ? (
              <>
                <Button onClick={capturePhoto} className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
                <Button onClick={stopCamera} variant="outline" className="h-10">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={startCamera} variant="outline" className="flex-1 h-10">
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1 h-10">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Card>

        {/* Right Column - Manual Input */}
        <Card className="p-6 border border-slate-200 bg-white">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Material Details</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Material Type *</Label>
              <Select
                value={formData.materialType}
                onValueChange={(v) => setFormData({ ...formData, materialType: v })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Purity (%) *</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.purityPercent}
                onChange={(e) => setFormData({ ...formData, purityPercent: e.target.value })}
                placeholder="e.g., 92.5"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Contamination (%) *</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.contaminationPercent}
                onChange={(e) => setFormData({ ...formData, contaminationPercent: e.target.value })}
                placeholder="e.g., 7.5"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Weight (kg) *</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                placeholder="e.g., 500"
                className="h-10"
              />
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !formData.materialType || !formData.purityPercent || !formData.contaminationPercent || !formData.weightKg}
              className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium text-base"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Microscope className="w-4 h-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>

            {result && (
              <Button onClick={handleReset} variant="outline" className="w-full h-10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Grade Another Sample
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* AI Grading Result */}
      {analyzing && (
        <Card className="p-8 border border-slate-200 bg-white">
          <div className="flex flex-col items-center text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-600 border-t-transparent mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">Analyzing Material...</h3>
            <p className="text-sm text-slate-500 mt-1">AI is grading your plastic waste sample</p>
          </div>
        </Card>
      )}

      {result && !analyzing && (
        <Card className="border border-slate-200 bg-white overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900">AI Grading Result</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left - Image + Details */}
              <div className="space-y-4">
                {result.imageUrl && (
                  <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img src={result.imageUrl} alt="Analyzed material" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-medium">Material</p>
                    <p className="text-sm font-semibold text-slate-900">{result.materialType}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-medium">Weight</p>
                    <p className="text-sm font-semibold text-slate-900">{result.weightKg} kg</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-medium">Purity</p>
                    <p className="text-sm font-semibold text-slate-900">{result.purityPercent}%</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-medium">Contamination</p>
                    <p className="text-sm font-semibold text-slate-900">{result.contaminationPercent}%</p>
                  </div>
                </div>
              </div>

              {/* Right - Grade + Confidence */}
              <div className="space-y-5">
                {/* Grade Badge */}
                <div className={`p-5 rounded-xl border-2 text-center ${gradeConfig[result.grade].color}`}>
                  {(() => {
                    const GradeIcon = gradeConfig[result.grade].icon
                    return <GradeIcon className="w-10 h-10 mx-auto mb-2" />
                  })()}
                  <p className="text-2xl font-bold">{gradeConfig[result.grade].label}</p>
                </div>

                {/* Confidence Meter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">AI Confidence</p>
                    <p className="text-sm font-bold text-slate-900">{result.confidence}%</p>
                  </div>
                  <Progress value={result.confidence} className="h-3" />
                </div>

                {/* Verification Status */}
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Verified</p>
                    <p className="text-xs text-green-600">AI grading complete</p>
                  </div>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-slate-500">
                  Graded on {new Date(result.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Previous Results */}
      {previousResults.length > 0 && (
        <Card className="border border-slate-200 bg-white overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Previous Grading Results</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {previousResults
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Badge className={`${
                      r.grade === 'A' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      r.grade === 'B' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                      'bg-red-100 text-red-700 hover:bg-red-100'
                    } text-xs font-bold`}>
                      {r.grade}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{r.materialType} - {r.weightKg} kg</p>
                      <p className="text-xs text-slate-500">Purity: {r.purityPercent}% | Confidence: {r.confidence}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf, ArrowRight, CheckCircle, TrendingUp, Shield, Microscope, Recycle, Users, BarChart3 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    )
  }

  if (user) return null

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xl font-bold text-slate-900">PlasticConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-8">
          <Recycle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">AI-Powered Plastic Recycling Marketplace</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 text-balance leading-tight">
          Connect Plastic Waste Collectors with Recyclers and Brands
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
          Trade smarter with AI-powered grading, secure transactions and a seamless marketplace built for the recycling ecosystem.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 text-base">
              Start Trading <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-slate-300">
              View Marketplace
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Why PlasticConnect?</h2>
        <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">Everything you need to buy, sell, and grade plastic waste efficiently.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Microscope,
              title: 'AI Grading',
              description: 'Upload material images and get instant AI-powered quality grades with confidence scores.',
            },
            {
              icon: Shield,
              title: 'Secure Transactions',
              description: 'Built-in escrow protection, encrypted payments, and buyer/seller fund guarantees for peace of mind.',
            },
            {
              icon: TrendingUp,
              title: 'Live Marketplace',
              description: 'Real-time listings with bidding, filters by material type, grade, and location.',
            },
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* For Collectors */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">For Collectors</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">Upload your plastic waste, get AI-powered grading, and sell to verified brands at fair market prices.</p>
            <ul className="space-y-4">
              {[
                'Upload material with camera capture or file upload',
                'Get instant AI quality grading (A / B / C)',
                'List on the marketplace with transparent pricing',
                'Receive bids from verified recycling brands',
                'Track all your transactions in one place',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 h-80 flex items-center justify-center border border-green-200">
            <div className="text-center">
              <Recycle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-green-700 font-medium">Collector Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Brands */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-8 h-80 flex items-center justify-center border border-teal-200">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-teal-400 mx-auto mb-4" />
              <p className="text-teal-700 font-medium">Brand Marketplace</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">For Recycling Brands</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">Browse verified plastic waste listings, place competitive bids, and manage your supply chain.</p>
            <ul className="space-y-4">
              {[
                'Browse verified plastic waste listings',
                'Filter by material type, grade, and location',
                'Place competitive bids in real-time',
                'Manage multiple transactions seamlessly',
                'Access compliance documentation',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Users', value: '1,234', icon: Users },
              { label: 'Listings', value: '5,678', icon: Recycle },
              { label: 'Transactions', value: '\u20B921.5L', icon: TrendingUp },
              { label: 'Material Traded', value: '450 T', icon: BarChart3 },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label}>
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-lg bg-green-50">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
          Join the growing network of collectors and brands trading plastic waste responsibly across India.
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 text-base">
            Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-1.5 rounded-md bg-green-100">
              <Leaf className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-semibold text-slate-900">PlasticConnect</span>
          </div>
          <p className="text-sm">&copy; 2026 PlasticConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf, ArrowRight, CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react'

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-green-50">
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
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
          AI-Powered Plastic Recycling Marketplace
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto text-balance">
          Connect plastic waste collectors with recycling brands. Trade smarter, report greener,
          scale faster.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Start Trading <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline">
              View Marketplace
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why PlasticConnect?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'Real-Time Bidding',
              description: 'Live bidding system with instant notifications and price updates',
            },
            {
              icon: Shield,
              title: 'Secure Transactions',
              description: 'Encrypted payments with escrow protection and compliance certificates',
            },
            {
              icon: TrendingUp,
              title: 'AI Pricing',
              description: 'Smart price recommendations based on market trends and historical data',
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
                <p className="text-slate-600">{feature.description}</p>
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
            <ul className="space-y-4">
              {[
                'List your plastic waste in minutes',
                'Receive real-time bids from verified buyers',
                'Get fair market prices with AI recommendations',
                'Track shipments end-to-end',
                'Generate compliance certificates',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 h-96 flex items-center justify-center border border-green-200">
            <p className="text-green-700 text-center font-medium">Collectors Dashboard Preview</p>
          </div>
        </div>
      </section>

      {/* For Brands */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-96 flex items-center justify-center border border-blue-200">
            <p className="text-blue-700 text-center font-medium">Brands Marketplace Preview</p>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">For Recycling Brands</h2>
            <ul className="space-y-4">
              {[
                'Browse verified plastic waste listings',
                'Place competitive bids in real-time',
                'Manage multiple transactions seamlessly',
                'Track logistics and deliveries',
                'Access compliance documentation',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Users', value: '1,234' },
              { label: 'Listings', value: '5,678' },
              { label: 'Transactions', value: '$2.1M' },
              { label: 'Material Traded', value: '450T' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-green-600 mb-2">{stat.value}</p>
                <p className="text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-slate-600 mb-8">
          Join thousands of collectors and brands trading plastic responsibly
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600">
          <p>&copy; 2024 PlasticConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

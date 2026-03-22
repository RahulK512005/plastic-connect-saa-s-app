'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  TrendingUp,
  Package,
  Award,
  Map,
  Settings,
  Leaf,
  ListPlus,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppSidebar() {
  const pathname = usePathname()
  const { userRole } = useAuth()

  const collectorMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: ListPlus, label: 'Create Listing', href: '/listings/create' },
    { icon: TrendingUp, label: 'My Listings', href: '/listings' },
    { icon: ShoppingCart, label: 'My Bids', href: '/bids' },
    { icon: DollarSign, label: 'Transactions', href: '/transactions' },
    { icon: Award, label: 'Certificates', href: '/certificates' },
    { icon: Map, label: 'Logistics', href: '/logistics' },
  ]

  const brandMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: ShoppingCart, label: 'Marketplace', href: '/marketplace' },
    { icon: TrendingUp, label: 'My Bids', href: '/bids' },
    { icon: DollarSign, label: 'Transactions', href: '/transactions' },
    { icon: Award, label: 'Certificates', href: '/certificates' },
    { icon: Map, label: 'Logistics', href: '/logistics' },
  ]

  const menuItems = userRole === 'COLLECTOR' ? collectorMenuItems : brandMenuItems

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-green-100">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-lg font-bold text-slate-900">PlasticConnect</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 h-10 rounded-lg transition-all',
                  isActive
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-slate-200">
        <Link href="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
        </Link>
      </div>
    </aside>
  )
}

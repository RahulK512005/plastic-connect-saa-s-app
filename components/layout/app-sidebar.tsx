'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Settings,
  Leaf,
  Upload,
  ListPlus,
  DollarSign,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface AppSidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()
  const { userRole } = useAuth()

  const collectorMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: ShoppingCart, label: 'Marketplace', href: '/marketplace' },
    { icon: Upload, label: 'Upload Material', href: '/upload' },
    { icon: ListPlus, label: 'My Listings', href: '/listings' },
    { icon: DollarSign, label: 'Transactions', href: '/transactions' },
  ]

  const brandMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: ShoppingCart, label: 'Marketplace', href: '/marketplace' },
    { icon: TrendingUp, label: 'My Bids', href: '/bids' },
    { icon: DollarSign, label: 'Transactions', href: '/transactions' },
    { icon: Award, label: 'Certificates', href: '/certificates' },
  ]

  const menuItems = userRole === 'BRAND' ? brandMenuItems : collectorMenuItems

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavClick}>
          <div className="p-2 rounded-lg bg-green-100">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-lg font-bold text-slate-900">PlasticConnect</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} onClick={onNavClick}>
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
        <Link href="/settings" onClick={onNavClick}>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 h-10 rounded-lg',
              pathname === '/settings'
                ? 'bg-green-50 text-green-700 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
        </Link>
      </div>
    </>
  )
}

export default function AppSidebar({ mobileOpen = false, onMobileClose }: AppSidebarProps) {
  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar — Sheet drawer */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <SheetContent side="left" className="p-0 w-64 flex flex-col bg-white">
          <SidebarContent onNavClick={onMobileClose} />
        </SheetContent>
      </Sheet>
    </>
  )
}

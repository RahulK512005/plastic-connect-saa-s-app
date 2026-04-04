'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bell, LogOut, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface AppHeaderProps {
  onMenuClick?: () => void
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user, userRole, signOut } = useAuth()
  const router = useRouter()

  const displayName = user?.name || user?.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = () => {
    signOut()
    router.push('/auth/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Hamburger — only visible on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Badge variant="outline" className="text-xs font-medium border-green-200 text-green-700 bg-green-50">
            {userRole === 'BRAND' ? 'Brand' : 'Collector'}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2 gap-2">
                <Avatar className="h-7 w-7 bg-green-100">
                  <AvatarFallback className="text-green-700 text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-slate-900">
                  {displayName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

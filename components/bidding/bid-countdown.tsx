'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface BidCountdownProps {
  endTime: string | Date
  onExpire?: () => void
}

export default function BidCountdown({ endTime, onExpire }: BidCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(endTime).getTime()
      const now = new Date().getTime()
      const difference = endDate - now

      if (difference <= 0) {
        setIsExpired(true)
        onExpire?.()
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime, onExpire])

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
        <Clock className="w-5 h-5 text-red-600" />
        <span className="text-sm font-semibold text-red-700">Auction Ended</span>
      </div>
    )
  }

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg">
        <Clock className="w-5 h-5 text-slate-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-600">Loading...</span>
      </div>
    )
  }

  const isUrgent =
    timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 5

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${
        isUrgent
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-blue-50 border-blue-200 text-blue-700'
      }`}
    >
      <Clock className="w-5 h-5" />
      <span className="text-sm">
        {timeLeft.days > 0 ? (
          <>
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </>
        ) : timeLeft.hours > 0 ? (
          <>
            {timeLeft.hours}h {timeLeft.minutes}m
          </>
        ) : (
          <>
            {timeLeft.minutes}m {timeLeft.seconds}s
          </>
        )}
      </span>
    </div>
  )
}

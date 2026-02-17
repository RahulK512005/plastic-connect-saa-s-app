'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  dbGetCurrentSession,
  dbSetSession,
  dbClearSession,
  dbGetUserByEmail,
  dbCreateUser,
  dbInit,
  type User,
} from '@/lib/mock-db'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    dbInit()
    const session = dbGetCurrentSession()
    if (session) {
      setUser(session)
      setUserRole(session.role)
    }
    setLoading(false)
  }, [])

  const signUp = useCallback(
    (data: { name: string; email: string; password: string; role: 'COLLECTOR' | 'BRAND' }) => {
      try {
        const newUser = dbCreateUser(data)
        dbSetSession(newUser)
        setUser(newUser)
        setUserRole(newUser.role)
        return { success: true, user: newUser }
      } catch (err: any) {
        return { success: false, error: err.message }
      }
    },
    []
  )

  const signIn = useCallback((email: string, password: string) => {
    const foundUser = dbGetUserByEmail(email)
    if (!foundUser) {
      return { success: false, error: 'Account not found. Please sign up.' }
    }
    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }
    dbSetSession(foundUser)
    setUser(foundUser)
    setUserRole(foundUser.role)
    return { success: true, user: foundUser }
  }, [])

  const signOut = useCallback(() => {
    dbClearSession()
    setUser(null)
    setUserRole(null)
  }, [])

  return { user, loading, userRole, signUp, signIn, signOut }
}

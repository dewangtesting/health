'use client'

import { useState, useEffect, useCallback } from 'react'
import { dashboardAPI } from '@/lib/api'
import { mockDashboardStats } from '@/lib/mockData'

interface DashboardStats {
  totalPatients: number
  totalDoctors: number
  totalAppointments: number
  totalMedicines: number
  todayAppointments: number
  pendingAppointments: number
  completedAppointments: number
  recentActivities: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

interface UseDashboard {
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

export const useDashboard = (): UseDashboard => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try API first, fallback to mock data
      try {
        const response = await dashboardAPI.getStats()
        setStats(response)
      } catch (apiError) {
        console.warn('API unavailable, using mock dashboard stats')
        // Use mock data as fallback
        setStats(mockDashboardStats)
      }
      
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err)
      setError(err.message || 'Failed to fetch dashboard statistics')
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshStats = async () => {
    await fetchStats()
  }

  // Fetch stats when component mounts
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refreshStats
  }
}

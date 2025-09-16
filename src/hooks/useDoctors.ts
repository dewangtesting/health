'use client'

import { useState, useEffect, useCallback } from 'react'
import { doctorsAPI } from '@/lib/api'
import { mockDoctors } from '@/lib/mockData'

interface Doctor {
  id: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  specialization: string
  licenseNumber: string
  experience?: number
  qualification?: string
  department?: string
  consultationFee?: number
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

interface DoctorsResponse {
  doctors: Doctor[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UseDoctors {
  doctors: Doctor[]
  loading: boolean
  error: string | null
  total: number
  currentPage: number
  totalPages: number
  fetchDoctors: (filters?: any) => Promise<void>
  createDoctor: (doctorData: any) => Promise<void>
  updateDoctor: (id: string, doctorData: any) => Promise<void>
  deleteDoctor: (id: string) => Promise<void>
  searchDoctors: (query: string) => Promise<void>
  filterBySpecialization: (specialization: string) => Promise<void>
  setPage: (page: number) => void
}

export const useDoctors = (initialFilters = {}): UseDoctors => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState(initialFilters)

  const fetchDoctors = useCallback(async (newFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      // Try API first, fallback to mock data
      try {
        const queryFilters = { ...filters, ...newFilters, page: currentPage, limit: 10 }
        const response: DoctorsResponse = await doctorsAPI.getAll(queryFilters)
        
        setDoctors(response.doctors || [])
        setTotal(response.total || 0)
        setTotalPages(response.totalPages || 1)
        setFilters(prev => ({ ...prev, ...newFilters }))
      } catch (apiError) {
        console.warn('API unavailable, using mock doctors data')
        // Use mock data as fallback
        setDoctors(mockDoctors)
        setTotal(mockDoctors.length)
        setTotalPages(Math.ceil(mockDoctors.length / 10))
        setFilters(prev => ({ ...prev, ...newFilters }))
      }
      
    } catch (err: any) {
      console.error('Error fetching doctors:', err)
      setError(err.message || 'Failed to fetch doctors')
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage])

  const createDoctor = async (doctorData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      await doctorsAPI.create(doctorData)
      await fetchDoctors() // Refresh the list
      
    } catch (err: any) {
      console.error('Error creating doctor:', err)
      setError(err.message || 'Failed to create doctor')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateDoctor = async (id: string, doctorData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      await doctorsAPI.update(id, doctorData)
      await fetchDoctors() // Refresh the list
      
    } catch (err: any) {
      console.error('Error updating doctor:', err)
      setError(err.message || 'Failed to update doctor')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteDoctor = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await doctorsAPI.delete(id)
      await fetchDoctors() // Refresh the list
      
    } catch (err: any) {
      console.error('Error deleting doctor:', err)
      setError(err.message || 'Failed to delete doctor')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchDoctors = async (query: string) => {
    await fetchDoctors({ search: query })
  }

  const filterBySpecialization = async (specialization: string) => {
    await fetchDoctors({ specialization })
  }

  const setPage = (page: number) => {
    setCurrentPage(page)
  }

  // Fetch doctors when component mounts or page changes
  useEffect(() => {
    fetchDoctors()
  }, [currentPage, fetchDoctors])

  return {
    doctors,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctors,
    filterBySpecialization,
    setPage
  }
}

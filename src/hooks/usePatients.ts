'use client'

import { useState, useEffect } from 'react'
import { patientsAPI } from '@/lib/api'
import { mockPatients } from '@/lib/mockData'

interface Patient {
  id: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  dateOfBirth: string
  gender: string
  address?: string
  emergencyContact?: string
  medicalHistory?: string
  allergies?: string
  bloodType?: string
  createdAt: string
  updatedAt: string
}

interface PatientsResponse {
  patients: Patient[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UsePatients {
  patients: Patient[]
  loading: boolean
  error: string | null
  total: number
  currentPage: number
  totalPages: number
  fetchPatients: (filters?: any) => Promise<void>
  createPatient: (patientData: any) => Promise<void>
  updatePatient: (id: string, patientData: any) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  searchPatients: (query: string) => Promise<void>
  setPage: (page: number) => void
}

export const usePatients = (initialFilters = {}): UsePatients => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState(initialFilters)

  const fetchPatients = async (newFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      // Try API first, fallback to mock data
      try {
        const queryFilters = { ...filters, ...newFilters, page: currentPage, limit: 10 }
        const response: PatientsResponse = await patientsAPI.getAll(queryFilters)
        
        setPatients(response.patients || [])
        setTotal(response.total || 0)
        setTotalPages(response.totalPages || 1)
        setFilters(prev => ({ ...prev, ...newFilters }))
      } catch (apiError) {
        console.warn('API unavailable, using mock patients data')
        // Use mock data as fallback
        setPatients(mockPatients)
        setTotal(mockPatients.length)
        setTotalPages(Math.ceil(mockPatients.length / 10))
        setFilters(prev => ({ ...prev, ...newFilters }))
      }
      
    } catch (err: any) {
      console.error('Error fetching patients:', err)
      setError(err.message || 'Failed to fetch patients')
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const createPatient = async (patientData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      await patientsAPI.create(patientData)
      await fetchPatients() // Refresh the list
      
    } catch (err: any) {
      console.error('Error creating patient:', err)
      setError(err.message || 'Failed to create patient')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePatient = async (id: string, patientData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      await patientsAPI.update(id, patientData)
      await fetchPatients() // Refresh the list
      
    } catch (err: any) {
      console.error('Error updating patient:', err)
      setError(err.message || 'Failed to update patient')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePatient = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await patientsAPI.delete(id)
      await fetchPatients() // Refresh the list
      
    } catch (err: any) {
      console.error('Error deleting patient:', err)
      setError(err.message || 'Failed to delete patient')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchPatients = async (query: string) => {
    await fetchPatients({ search: query })
  }

  const setPage = (page: number) => {
    setCurrentPage(page)
  }

  // Fetch patients when component mounts or page changes
  useEffect(() => {
    fetchPatients()
  }, [currentPage])

  return {
    patients,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    setPage
  }
}

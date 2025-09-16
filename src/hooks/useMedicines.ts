'use client'

import { useState, useEffect } from 'react'
import { medicinesAPI } from '@/lib/api'
import { mockMedicines } from '@/lib/mockData'

interface Medicine {
  id: string
  name: string
  genericName: string
  category?: string
  manufacturer: string
  dosageForm?: string
  dosage?: string
  form?: string
  strength?: string
  price: number
  stockQuantity?: number
  stock?: number
  expiryDate: string
  batchNumber?: string
  description?: string
  sideEffects?: string
  contraindications?: string
  createdAt: string
  updatedAt: string
}

interface MedicinesResponse {
  medicines: Medicine[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UseMedicines {
  medicines: Medicine[]
  loading: boolean
  error: string | null
  total: number
  currentPage: number
  totalPages: number
  fetchMedicines: (filters?: any) => Promise<void>
  createMedicine: (medicineData: any) => Promise<void>
  updateMedicine: (id: string, medicineData: any) => Promise<void>
  deleteMedicine: (id: string) => Promise<void>
  searchMedicines: (query: string) => Promise<void>
  filterByStock: (stockLevel: 'all' | 'low' | 'out') => Promise<void>
  setPage: (page: number) => void
  getStockStatus: (quantity: number) => string
}

export const useMedicines = (initialFilters = {}): UseMedicines => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState(initialFilters)

  const fetchMedicines = async (newFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      // Try API first, fallback to mock data
      try {
        const queryFilters = { ...filters, ...newFilters, page: currentPage, limit: 10 }
        const response: MedicinesResponse = await medicinesAPI.getAll(queryFilters)
        
        setMedicines(response.medicines || [])
        setTotal(response.total || 0)
        setTotalPages(response.totalPages || 1)
        setFilters(prev => ({ ...prev, ...newFilters }))
      } catch (apiError) {
        console.warn('API unavailable, using mock medicines data')
        // Use mock data as fallback
        setMedicines(mockMedicines)
        setTotal(mockMedicines.length)
        setTotalPages(Math.ceil(mockMedicines.length / 10))
        setFilters(prev => ({ ...prev, ...newFilters }))
      }
      
    } catch (err: any) {
      console.error('Error fetching medicines:', err)
      setError(err.message || 'Failed to fetch medicines')
      setMedicines([])
    } finally {
      setLoading(false)
    }
  }

  const createMedicine = async (medicineData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      await medicinesAPI.create(medicineData)
      await fetchMedicines() // Refresh the list
      
    } catch (err: any) {
      console.error('Error creating medicine:', err)
      setError(err.message || 'Failed to create medicine')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMedicine = async (id: string, medicineData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      await medicinesAPI.update(id, medicineData)
      await fetchMedicines() // Refresh the list
      
    } catch (err: any) {
      console.error('Error updating medicine:', err)
      setError(err.message || 'Failed to update medicine')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMedicine = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await medicinesAPI.delete(id)
      await fetchMedicines() // Refresh the list
      
    } catch (err: any) {
      console.error('Error deleting medicine:', err)
      setError(err.message || 'Failed to delete medicine')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchMedicines = async (query: string) => {
    await fetchMedicines({ search: query })
  }

  const filterByStock = async (stockLevel: 'all' | 'low' | 'out') => {
    const stockFilters: any = {}
    
    if (stockLevel === 'low') {
      stockFilters.stockLevel = 'low'
    } else if (stockLevel === 'out') {
      stockFilters.stockLevel = 'out'
    }
    
    await fetchMedicines(stockFilters)
  }

  const getStockStatus = (quantity: number): string => {
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= 10) return 'Low Stock'
    return 'In Stock'
  }

  const setPage = (page: number) => {
    setCurrentPage(page)
  }

  // Fetch medicines when component mounts or page changes
  useEffect(() => {
    fetchMedicines()
  }, [currentPage])

  return {
    medicines,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    fetchMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicines,
    filterByStock,
    setPage,
    getStockStatus
  }
}

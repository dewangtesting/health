'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { medicinesAPI } from '@/lib/api'

interface Medicine {
  id: string
  name: string
  genericName: string
  manufacturer: string
  category: string
  dosageForm: string
  strength: string
  price: number
  stockQuantity: number
  minStockLevel: number
  expiryDate: string
  batchNumber: string
  description: string
  sideEffects: string
  requiresPrescription: boolean
  isControlledSubstance: boolean
  createdAt: string
  updatedAt: string
}

export default function ViewMedicine() {
  const router = useRouter()
  const params = useParams()
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchMedicine(params.id as string)
    }
  }, [params.id])

  const fetchMedicine = async (id: string) => {
    try {
      setLoading(true)
      const response = await medicinesAPI.getById(id)
      setMedicine(response.medicine)
    } catch (error: any) {
      console.error('Error fetching medicine:', error)
      setError(error.response?.data?.message || 'Failed to fetch medicine details')
      toast.error('Failed to load medicine details')
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity === 0) return { status: 'Out of Stock', class: 'bg-danger' }
    if (quantity <= minLevel) return { status: 'Low Stock', class: 'bg-warning' }
    return { status: 'In Stock', class: 'bg-success' }
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
        <div id="ihealth-layout" className="theme-tradewind">
          <Sidebar />
          <div className="main px-lg-4 px-md-4">
            <Header />
            <div className="body d-flex py-lg-3 py-md-2">
              <div className="container-xxl">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div>Loading medicine details...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !medicine) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
        <div id="ihealth-layout" className="theme-tradewind">
          <Sidebar />
          <div className="main px-lg-4 px-md-4">
            <Header />
            <div className="body d-flex py-lg-3 py-md-2">
              <div className="container-xxl">
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-danger">
                      <i className="icofont-warning-alt me-2"></i>
                      {error || 'Medicine not found'}
                    </div>
                    <Link href="/pharmacy/medicines" className="btn btn-primary">
                      <i className="icofont-arrow-left me-2"></i>Back to Medicines
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const stockStatus = getStockStatus(medicine.stockQuantity, medicine.minStockLevel)

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
      <div id="ihealth-layout" className="theme-tradewind">
        <Sidebar />
        
        <div className="main px-lg-4 px-md-4">
          <Header />
          
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              <div className="row align-items-center">
                <div className="border-0 mb-4">
                  <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                    <h3 className="fw-bold mb-0">Medicine Details</h3>
                    <div className="col-auto d-flex w-sm-100 gap-2">
                      <Link 
                        href={`/pharmacy/medicines/${medicine.id}/edit`}
                        className="btn btn-primary"
                      >
                        <i className="icofont-edit me-2"></i>Edit Medicine
                      </Link>
                      <Link 
                        href="/pharmacy/medicines"
                        className="btn btn-secondary"
                      >
                        <i className="icofont-arrow-left me-2"></i>Back to List
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row clearfix g-3">
                <div className="col-lg-8 col-md-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Medicine Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="form-label text-muted">Medicine Name</label>
                          <div className="fw-bold">{medicine.name}</div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-muted">Generic Name</label>
                          <div>{medicine.genericName || 'N/A'}</div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-muted">Category</label>
                          <div>
                            <span className="badge bg-info">{medicine.category}</span>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-muted">Manufacturer</label>
                          <div>{medicine.manufacturer || 'N/A'}</div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-muted">Strength</label>
                          <div className="fw-bold text-primary">{medicine.strength}</div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-muted">Dosage Form</label>
                          <div>{medicine.dosageForm || 'N/A'}</div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-muted">Price per Unit</label>
                          <div className="fw-bold text-success">${medicine.price.toFixed(2)}</div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-muted">Batch Number</label>
                          <div>{medicine.batchNumber || 'N/A'}</div>
                        </div>
                        <div className="col-12">
                          <label className="form-label text-muted">Description</label>
                          <div className="border rounded p-3 bg-light">
                            {medicine.description || 'No description available'}
                          </div>
                        </div>
                        <div className="col-12">
                          <label className="form-label text-muted">Side Effects</label>
                          <div className="border rounded p-3 bg-light">
                            {medicine.sideEffects || 'No side effects listed'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-4 col-md-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Stock Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label text-muted">Current Stock</label>
                        <div className="d-flex align-items-center">
                          <span className="fw-bold fs-4 me-2">{medicine.stockQuantity}</span>
                          <span className={`badge ${stockStatus.class}`}>{stockStatus.status}</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted">Minimum Stock Level</label>
                        <div>{medicine.minStockLevel}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted">Expiry Date</label>
                        <div>
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                          {isExpired(medicine.expiryDate) && (
                            <div className="text-danger small mt-1">
                              <i className="icofont-warning-alt"></i> Expired
                            </div>
                          )}
                          {isExpiringSoon(medicine.expiryDate) && !isExpired(medicine.expiryDate) && (
                            <div className="text-warning small mt-1">
                              <i className="icofont-clock-time"></i> Expiring Soon
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {medicine.stockQuantity <= medicine.minStockLevel && (
                        <div className="alert alert-warning">
                          <i className="icofont-warning me-2"></i>
                          <strong>Low Stock Alert</strong><br />
                          Stock is below minimum level
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Prescription Requirements</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <i className={`icofont-${medicine.requiresPrescription ? 'check' : 'close'} me-2 ${medicine.requiresPrescription ? 'text-success' : 'text-muted'}`}></i>
                        Requires Prescription
                      </div>
                      <div>
                        <i className={`icofont-${medicine.isControlledSubstance ? 'check' : 'close'} me-2 ${medicine.isControlledSubstance ? 'text-warning' : 'text-muted'}`}></i>
                        Controlled Substance
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Record Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <label className="form-label text-muted small">Created</label>
                        <div className="small">{new Date(medicine.createdAt).toLocaleString()}</div>
                      </div>
                      <div>
                        <label className="form-label text-muted small">Last Updated</label>
                        <div className="small">{new Date(medicine.updatedAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

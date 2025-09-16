'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { medicinesAPI } from '@/lib/api'

interface MedicineFormData {
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
}

export default function AddMedicine() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    dosageForm: '',
    strength: '',
    price: 0,
    stockQuantity: 0,
    minStockLevel: 10,
    expiryDate: '',
    batchNumber: '',
    description: '',
    sideEffects: '',
    requiresPrescription: false,
    isControlledSubstance: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.strength || !formData.price || !formData.stockQuantity || !formData.expiryDate) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      await medicinesAPI.create(formData)
      toast.success('Medicine added successfully!')
      router.push('/pharmacy/medicines')
    } catch (error: any) {
      console.error('Error adding medicine:', error)
      toast.error(error.response?.data?.message || 'Failed to add medicine')
    } finally {
      setLoading(false)
    }
  }
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
                    <h3 className="fw-bold mb-0">Add Medicine</h3>
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
                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          <div className="col-sm-6">
                            <label className="form-label">Medicine Name *</label>
                            <input 
                              type="text" 
                              name="name"
                              className="form-control" 
                              placeholder="Enter medicine name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Generic Name</label>
                            <input 
                              type="text" 
                              name="genericName"
                              className="form-control" 
                              placeholder="Generic name"
                              value={formData.genericName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Category *</label>
                            <select 
                              name="category"
                              className="form-select"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select Category</option>
                              <option value="Antibiotics">Antibiotics</option>
                              <option value="Pain Relief">Pain Relief</option>
                              <option value="Vitamins">Vitamins</option>
                              <option value="Heart Medicine">Heart Medicine</option>
                              <option value="Diabetes">Diabetes</option>
                              <option value="Blood Pressure">Blood Pressure</option>
                              <option value="Respiratory">Respiratory</option>
                              <option value="Gastrointestinal">Gastrointestinal</option>
                              <option value="Neurological">Neurological</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Manufacturer</label>
                            <input 
                              type="text" 
                              name="manufacturer"
                              className="form-control" 
                              placeholder="Manufacturer name"
                              value={formData.manufacturer}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Strength *</label>
                            <input 
                              type="text" 
                              name="strength"
                              className="form-control" 
                              placeholder="e.g., 500mg"
                              value={formData.strength}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Dosage Form</label>
                            <select 
                              name="dosageForm"
                              className="form-select"
                              value={formData.dosageForm}
                              onChange={handleInputChange}
                            >
                              <option value="">Select Form</option>
                              <option value="TABLET">Tablet</option>
                              <option value="CAPSULE">Capsule</option>
                              <option value="SYRUP">Syrup</option>
                              <option value="INJECTION">Injection</option>
                              <option value="CREAM">Cream</option>
                              <option value="DROPS">Drops</option>
                              <option value="INHALER">Inhaler</option>
                            </select>
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Price per Unit *</label>
                            <input 
                              type="number" 
                              name="price"
                              className="form-control" 
                              placeholder="Price" 
                              step="0.01"
                              min="0"
                              value={formData.price}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Stock Quantity *</label>
                            <input 
                              type="number" 
                              name="stockQuantity"
                              className="form-control" 
                              placeholder="Available quantity"
                              min="0"
                              value={formData.stockQuantity}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Expiry Date *</label>
                            <input 
                              type="date" 
                              name="expiryDate"
                              className="form-control"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Batch Number</label>
                            <input 
                              type="text" 
                              name="batchNumber"
                              className="form-control" 
                              placeholder="Batch number"
                              value={formData.batchNumber}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Description</label>
                            <textarea 
                              name="description"
                              className="form-control" 
                              rows={3} 
                              placeholder="Medicine description and usage instructions"
                              value={formData.description}
                              onChange={handleInputChange}
                            ></textarea>
                          </div>
                          <div className="col-12">
                            <label className="form-label">Side Effects</label>
                            <textarea 
                              name="sideEffects"
                              className="form-control" 
                              rows={2} 
                              placeholder="Known side effects"
                              value={formData.sideEffects}
                              onChange={handleInputChange}
                            ></textarea>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button 
                            type="submit" 
                            className="btn btn-primary me-2"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                Adding...
                              </>
                            ) : (
                              <>
                                <i className="icofont-check-circled me-2"></i>Add Medicine
                              </>
                            )}
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => router.push('/pharmacy/medicines')}
                          >
                            <i className="icofont-close-circled me-2"></i>Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-4 col-md-12">
                  <div className="card">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Stock Alert</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Minimum Stock Level</label>
                        <input 
                          type="number" 
                          name="minStockLevel"
                          className="form-control" 
                          placeholder="Alert when stock below"
                          min="0"
                          value={formData.minStockLevel}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="alert alert-warning">
                        <i className="icofont-warning me-2"></i>
                        <strong>Stock Alert</strong><br />
                        Set minimum stock level to receive alerts when inventory is low
                      </div>
                    </div>
                  </div>
                  
                  <div className="card mt-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Prescription Requirements</h6>
                    </div>
                    <div className="card-body">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="requiresPrescription"
                          id="prescriptionRequired"
                          checked={formData.requiresPrescription}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="prescriptionRequired">
                          Requires Prescription
                        </label>
                      </div>
                      <div className="form-check mt-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="isControlledSubstance"
                          id="controlledSubstance"
                          checked={formData.isControlledSubstance}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="controlledSubstance">
                          Controlled Substance
                        </label>
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

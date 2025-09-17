'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useMedicines } from '@/hooks/useMedicines'

export default function Medicines() {
  const { 
    medicines, 
    loading, 
    error, 
    total, 
    currentPage, 
    totalPages, 
    deleteMedicine, 
    searchMedicines, 
    filterByStock,
    getStockStatus,
    setPage 
  } = useMedicines()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStockFilter, setSelectedStockFilter] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchMedicines(searchQuery)
  }

  const handleStockFilter = async (stockLevel: 'all' | 'low' | 'out') => {
    setSelectedStockFilter(stockLevel)
    await filterByStock(stockLevel)
  }

  const handleDelete = async (medicineId: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      try {
        setDeleteLoading(medicineId)
        await deleteMedicine(medicineId)
      } catch (error) {
        console.error('Error deleting medicine:', error)
      } finally {
        setDeleteLoading(null)
      }
    }
  }

  const getStockBadgeClass = (quantity?: number) => {
    const q = quantity ?? 0
    if (q === 0) return 'bg-danger'
    if (q <= 10) return 'bg-warning'
    return 'bg-success'
  }

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    return expiry < today
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        <div className="body d-flex py-lg-3 py-md-2">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="border-0 mb-4">
                <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                  <h3 className="fw-bold mb-0">Medicine List ({total})</h3>
                  <div className="col-auto d-flex w-sm-100 gap-2">
                    <form onSubmit={handleSearch} className="d-flex">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button type="submit" className="btn btn-outline-primary">
                        <i className="icofont-search"></i>
                      </button>
                    </form>
                    <select 
                      className="form-select"
                      value={selectedStockFilter}
                      onChange={(e) => handleStockFilter(e.target.value as 'all' | 'low' | 'out')}
                    >
                      <option value="">All Stock</option>
                      <option value="low">Low Stock</option>
                      <option value="out">Out of Stock</option>
                    </select>
                    <Link href="/pharmacy/add" className="btn btn-primary">
                      <i className="icofont-plus-circle me-2"></i>Add Medicine
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-danger">
                    <i className="icofont-warning-alt me-2"></i>
                    {error}
                  </div>
                </div>
              </div>
            )}

            <div className="row clearfix g-3">
              <div className="col-sm-12">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0" style={{width: '100%'}}>
                        <thead>
                          <tr>
                            <th>Medicine</th>
                            <th>Generic Name</th>
                            <th>Manufacturer</th>
                            <th>Form & Strength</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Expiry</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={9} className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                <div className="mt-2">Loading medicines...</div>
                              </td>
                            </tr>
                          ) : medicines.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="text-center py-4">
                                <i className="icofont-pills display-4 text-muted"></i>
                                <div className="mt-2">No medicines found</div>
                              </td>
                            </tr>
                          ) : (
                            medicines.map((medicine) => (
                              <tr key={medicine.id}>
                                <td>
                                  <div>
                                    <h6 className="mb-0">{medicine.name}</h6>
                                    <span className="text-muted">ID: #{medicine.id}</span>
                                  </div>
                                </td>
                                <td>{medicine.genericName}</td>
                                <td>{medicine.manufacturer}</td>
                                <td>{medicine.dosageForm} - {medicine.strength}</td>
                                <td>${medicine.price.toFixed(2)}</td>
                                <td>
                                  <span className={`badge ${getStockBadgeClass(medicine.stockQuantity)}`}>
                                    {medicine.stockQuantity ?? 0}
                                  </span>
                                </td>
                                <td>
                                  <div>
                                    {new Date(medicine.expiryDate).toLocaleDateString()}
                                    {isExpired(medicine.expiryDate) && (
                                      <div className="text-danger small">
                                        <i className="icofont-warning-alt"></i> Expired
                                      </div>
                                    )}
                                    {isExpiringSoon(medicine.expiryDate) && !isExpired(medicine.expiryDate) && (
                                      <div className="text-warning small">
                                        <i className="icofont-clock-time"></i> Expiring Soon
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${getStockBadgeClass(medicine.stockQuantity)}`}>
                                    {getStockStatus(medicine.stockQuantity ?? 0)}
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <Link 
                                      href={`/pharmacy/medicines/${medicine.id}`}
                                      className="btn btn-outline-secondary btn-sm"
                                      title="View Details"
                                    >
                                      <i className="icofont-eye-alt"></i>
                                    </Link>
                                    <Link 
                                      href={`/pharmacy/medicines/${medicine.id}/edit`}
                                      className="btn btn-outline-secondary btn-sm"
                                      title="Edit Medicine"
                                    >
                                      <i className="icofont-edit"></i>
                                    </Link>
                                    <button 
                                      type="button" 
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDelete(medicine.id)}
                                      disabled={deleteLoading === medicine.id}
                                      title="Delete Medicine"
                                    >
                                      {deleteLoading === medicine.id ? (
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                      ) : (
                                        <i className="icofont-ui-delete"></i>
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="row">
                <div className="col-12">
                  <nav aria-label="Medicine pagination">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

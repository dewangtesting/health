'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { usePatients } from '@/hooks/usePatients'

export default function Patients() {
  const { 
    patients, 
    loading, 
    error, 
    total, 
    currentPage, 
    totalPages, 
    deletePatient, 
    searchPatients, 
    setPage 
  } = usePatients()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchPatients(searchQuery)
  }

  const handleDelete = async (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        setDeleteLoading(patientId)
        await deletePatient(patientId)
      } catch (error) {
        console.error('Error deleting patient:', error)
      } finally {
        setDeleteLoading(null)
      }
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'STAFF']}>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        <div className="body d-flex py-lg-3 py-md-2">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="border-0 mb-4">
                <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                  <h3 className="fw-bold mb-0">Patient List ({total})</h3>
                  <div className="col-auto d-flex w-sm-100 gap-2">
                    <form onSubmit={handleSearch} className="d-flex">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button type="submit" className="btn btn-outline-primary">
                        <i className="icofont-search"></i>
                      </button>
                    </form>
                    <Link href="/patients/add" className="btn btn-primary">
                      <i className="icofont-plus-circle me-2"></i>Add Patient
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
                            <th>Patient</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Last Visit</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                <div className="mt-2">Loading patients...</div>
                              </td>
                            </tr>
                          ) : patients.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-4">
                                <i className="icofont-users-alt-4 display-4 text-muted"></i>
                                <div className="mt-2">No patients found</div>
                              </td>
                            </tr>
                          ) : (
                            patients.map((patient) => (
                              <tr key={patient.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                      {patient.user.firstName.charAt(0)}{patient.user.lastName.charAt(0)}
                                    </div>
                                    <div className="ms-2">
                                      <h6 className="mb-0">{patient.user.firstName} {patient.user.lastName}</h6>
                                      <span className="text-muted">ID: #{patient.id}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>{calculateAge(patient.dateOfBirth)}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.user.phone || 'N/A'}</td>
                                <td>{new Date(patient.updatedAt).toLocaleDateString()}</td>
                                <td>
                                  <span className="badge bg-success">
                                    Active
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <Link 
                                      href={`/patients/view/${patient.id}`}
                                      className="btn btn-outline-secondary btn-sm"
                                      title="View Patient"
                                    >
                                      <i className="icofont-eye-alt"></i>
                                    </Link>
                                    <Link 
                                      href={`/patients/edit/${patient.id}`}
                                      className="btn btn-outline-secondary btn-sm"
                                      title="Edit Patient"
                                    >
                                      <i className="icofont-edit"></i>
                                    </Link>
                                    <button 
                                      type="button" 
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDelete(patient.id)}
                                      disabled={deleteLoading === patient.id}
                                      title="Delete Patient"
                                    >
                                      {deleteLoading === patient.id ? (
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
                  <nav aria-label="Patient pagination">
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

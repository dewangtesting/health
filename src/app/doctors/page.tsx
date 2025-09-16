'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useDoctors } from '@/hooks/useDoctors'
import { useAuth } from '@/contexts/AuthContext'

export default function Doctors() {
  const { user } = useAuth()
  const { 
    doctors, 
    loading, 
    error, 
    total, 
    currentPage, 
    totalPages, 
    deleteDoctor, 
    searchDoctors, 
    filterBySpecialization,
    setPage 
  } = useDoctors()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchDoctors(searchQuery)
  }

  const handleSpecializationFilter = async (specialization: string) => {
    setSelectedSpecialization(specialization)
    if (specialization === '') {
      await filterBySpecialization('')
    } else {
      await filterBySpecialization(specialization)
    }
  }

  const handleDelete = async (doctorId: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      try {
        setDeleteLoading(doctorId)
        await deleteDoctor(doctorId)
      } catch (error) {
        console.error('Error deleting doctor:', error)
      } finally {
        setDeleteLoading(null)
      }
    }
  }

  const specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine']

  // Generate avatar image URL based on doctor's name
  const getAvatarUrl = (firstName: string, lastName: string) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff&size=150`
  }

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN'

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        <div className="body d-flex py-3">
          <div className="container-xxl">
            {!isAdmin ? (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-warning text-center">
                    <i className="icofont-warning-alt me-2"></i>
                    Access Denied: Only administrators can view and manage the doctor list.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row align-items-center">
                  <div className="border-0 mb-4">
                    <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                      <h3 className="fw-bold mb-0">Doctor List</h3>
                      <div className="col-auto d-flex w-sm-100 gap-2">
                        <form onSubmit={handleSearch} className="d-flex">
                          <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search doctors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <button type="submit" className="btn btn-outline-primary">
                            <i className="icofont-search"></i>
                          </button>
                        </form>
                        <select 
                          className="form-select"
                          value={selectedSpecialization}
                          onChange={(e) => handleSpecializationFilter(e.target.value)}
                        >
                          <option value="">All Specializations</option>
                          {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                        <Link href="/doctors/add" className="btn btn-primary">
                          <i className="icofont-plus-circle me-2"></i>Add Doctor
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

                <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 row-cols-xl-4 row-cols-xxl-4 row-deck py-1 pb-4">
              {loading ? (
                <div className="col-12">
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-2">Loading doctors...</div>
                  </div>
                </div>
              ) : doctors.length === 0 ? (
                <div className="col-12">
                  <div className="text-center py-4">
                    <i className="icofont-doctor display-4 text-muted"></i>
                    <div className="mt-2">No doctors found</div>
                  </div>
                </div>
              ) : (
                doctors.map((doctor) => (
                  <div key={doctor.id} className="col">
                    <div className="card teacher-card">
                      <div className="card-body d-flex flex-column">
                        <div className="profile-av mx-auto text-center w220">
                          <img 
                            src={getAvatarUrl(doctor.user.firstName, doctor.user.lastName)} 
                            alt={`Dr. ${doctor.user.firstName} ${doctor.user.lastName}`} 
                            className="avatar xl rounded-circle img-thumbnail shadow-sm"
                          />
                          <div className="about-info d-flex align-items-center mt-3 justify-content-center">
                            <div className="followers rounded-circle me-3">
                              <a href="#" onClick={(e) => e.preventDefault()}>
                                <i className="bi bi-facebook fs-5 text-primary"></i>
                              </a>
                            </div>
                            <div className="own-video rounded-circle me-3">
                              <a href="#" onClick={(e) => e.preventDefault()}>
                                <i className="bi bi-instagram fs-5 text-danger"></i>
                              </a>
                            </div>
                            <div className="star rounded-circle">
                              <a href="#" onClick={(e) => e.preventDefault()}>
                                <i className="bi bi-linkedin fs-5 text-primary"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="teacher-info w-100 text-center mt-3">
                          <h6 className="mb-2 mt-2 fw-bold d-block fs-6">
                            Dr. {doctor.user.firstName} {doctor.user.lastName}
                          </h6>
                          <span className="light-info-bg py-2 px-2 rounded-1 d-inline-block fw-bold small-11 mb-2 mt-1">
                            {doctor.specialization}
                          </span>
                          <div className="d-flex justify-content-center gap-1 mt-2">
                            <Link 
                              href={`/doctors/profile/${doctor.id}`} 
                              className="btn btn-primary btn-sm"
                            >
                              Profile
                            </Link>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary btn-sm"
                              title="Edit Doctor"
                            >
                              <i className="icofont-edit"></i>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(doctor.id)}
                              disabled={deleteLoading === doctor.id}
                              title="Delete Doctor"
                            >
                              {deleteLoading === doctor.id ? (
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                              ) : (
                                <i className="icofont-ui-delete"></i>
                              )}
                            </button>
                          </div>
                          <div className="mt-2">
                            <small className="text-muted d-block">
                              {doctor.experience ? `${doctor.experience} years experience` : 'Experience not specified'}
                            </small>
                            <small className="text-muted d-block">
                              {doctor.user.phone || 'Phone not provided'}
                            </small>
                            <span className={`badge mt-1 ${doctor.isAvailable ? 'bg-success' : 'bg-warning'}`}>
                              {doctor.isAvailable ? 'Available' : 'Busy'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="row">
                    <div className="col-12">
                      <nav aria-label="Doctor pagination">
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
              </>
            )}
            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

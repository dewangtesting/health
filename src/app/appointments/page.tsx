'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAppointments } from '@/hooks/useAppointments'
import { formatDateIST, formatTimeIST, getTodayIST, utcToIST } from '@/utils/timezone'

export default function Appointments() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    patientSearch: '',
    createdDate: ''
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const { 
    appointments, 
    loading, 
    error, 
    pagination, 
    cancelAppointment,
    refetch 
  } = useAppointments(filters)

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      patientSearch: '',
      createdDate: ''
    })
  }

  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id)
      } catch (error) {
        console.error('Failed to cancel appointment:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Convert to IST and format
      return formatDateIST(date, { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A'
    try {
      // Parse time and format in IST
      const [hours, minutes] = timeString.split(':')
      const today = new Date()
      const timeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes))
      return formatTimeIST(timeDate, { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } catch {
      return timeString
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'bg-success'
      case 'SCHEDULED': return 'bg-primary'
      case 'IN_PROGRESS': return 'bg-info'
      case 'COMPLETED': return 'bg-success'
      case 'CANCELLED': return 'bg-danger'
      case 'NO_SHOW': return 'bg-warning'
      default: return 'bg-secondary'
    }
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
                  <h3 className="fw-bold mb-0">Appointments</h3>
                  <div className="col-auto d-flex w-sm-100 gap-2">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                      <i className="icofont-filter me-2"></i>
                      {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => window.location.href = '/appointments/book'}
                    >
                      <i className="icofont-plus-circle me-2"></i>Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simplified Filters */}
            {showAdvancedFilters && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Filter Appointments</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        {/* Patient Search */}
                        <div className="col-md-4">
                          <label className="form-label">Search Patient Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter patient name..."
                            value={filters.patientSearch}
                            onChange={(e) => handleFilterChange('patientSearch', e.target.value)}
                          />
                        </div>

                        {/* Created Date */}
                        <div className="col-md-4">
                          <label className="form-label">Created Date (IST)</label>
                          <input
                            type="date"
                            className="form-control"
                            value={filters.createdDate}
                            max={getTodayIST()}
                            onChange={(e) => handleFilterChange('createdDate', e.target.value)}
                          />
                          <small className="form-text text-muted">All dates are in Indian Standard Time</small>
                        </div>

                        {/* Action Buttons */}
                        <div className="col-md-4 d-flex align-items-end">
                          <div className="btn-group w-100">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={clearFilters}
                            >
                              <i className="icofont-refresh me-1"></i>Clear
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Active Filters Display */}
                      <div className="row mt-3">
                        <div className="col-12">
                          <div className="d-flex flex-wrap gap-2">
                            {filters.patientSearch && (
                              <span className="badge bg-primary">
                                Patient: {filters.patientSearch}
                                <button
                                  type="button"
                                  className="btn-close btn-close-white ms-1"
                                  style={{ fontSize: '0.6rem' }}
                                  onClick={() => handleFilterChange('patientSearch', '')}
                                ></button>
                              </span>
                            )}
                            {filters.createdDate && (
                              <span className="badge bg-info">
                                Created (IST): {filters.createdDate}
                                <button
                                  type="button"
                                  className="btn-close btn-close-white ms-1"
                                  style={{ fontSize: '0.6rem' }}
                                  onClick={() => handleFilterChange('createdDate', '')}
                                ></button>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            <div className="row clearfix g-3">
              <div className="col-sm-12">
                <div className="card mb-3">
                  <div className="card-body">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading appointments...</p>
                      </div>
                    ) : error ? (
                      <div className="alert alert-danger" role="alert">
                        <i className="icofont-warning-alt me-2"></i>
                        {error}
                        <button 
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => refetch()}
                        >
                          Retry
                        </button>
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="icofont-calendar text-muted" style={{fontSize: '3rem'}}></i>
                        <p className="text-muted mt-2">No appointments found</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0" style={{width: '100%'}}>
                          <thead>
                            <tr>
                              <th>Patient</th>
                              <th>Doctor</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.map((appointment) => (
                              <tr key={appointment.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img 
                                      className="avatar rounded-circle" 
                                      src="/assets/images/xs/avatar1.jpg" 
                                      alt="Patient Avatar" 
                                    />
                                    <div className="ms-2">
                                      <h6 className="mb-0">
                                        {appointment.firstName && appointment.lastName ? 
                                          `${appointment.firstName} ${appointment.lastName}` :
                                          (appointment.patient ? 
                                            `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` :
                                            'N/A'
                                          )
                                        }
                                      </h6>
                                      <span className="text-muted">ID: #{appointment.id.slice(-6)}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  Dr. {`${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`}
                                  <br />
                                  <small className="text-muted">{appointment.doctor.specialization}</small>
                                </td>
                                <td>{formatDate(appointment.date)}</td>
                                <td>{formatTime(appointment.time)}</td>
                                <td>
                                  <span className="badge bg-light text-dark">
                                    {appointment.type.replace('_', ' ')}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                                    {appointment.status.replace('_', ' ')}
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <button 
                                      type="button" 
                                      className="btn btn-outline-secondary btn-sm"
                                      title="View Details"
                                      onClick={() => window.location.href = `/appointments/${appointment.id}`}
                                    >
                                      <i className="icofont-eye-alt"></i>
                                    </button>
                                    <button 
                                      type="button" 
                                      className="btn btn-outline-secondary btn-sm"
                                      title="Edit Appointment"
                                      onClick={() => window.location.href = `/appointments/${appointment.id}/edit`}
                                    >
                                      <i className="icofont-edit"></i>
                                    </button>
                                    <button 
                                      type="button" 
                                      className="btn btn-outline-danger btn-sm"
                                      title="Cancel Appointment"
                                      onClick={() => handleCancelAppointment(appointment.id)}
                                      disabled={appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED'}
                                    >
                                      <i className="icofont-ui-delete"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && appointments.length > 0 && pagination.pages > 1 && (
                      <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                          <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => setFilters(prev => ({ ...prev, page: pagination.page - 1 }))}
                              disabled={pagination.page === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${pagination.page === page ? 'active' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => setFilters(prev => ({ ...prev, page }))}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => setFilters(prev => ({ ...prev, page: pagination.page + 1 }))}
                              disabled={pagination.page === pagination.pages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
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

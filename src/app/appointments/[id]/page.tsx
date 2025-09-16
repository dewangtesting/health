'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { appointmentsAPI, doctorsAPI } from '@/lib/api'

interface Doctor {
  id: string
  specialization: string
  user: {
    firstName: string
    lastName: string
  }
}

interface Appointment {
  id: string
  firstName: string
  lastName: string
  doctorId: string
  date: string
  time: string
  duration: number
  type: string
  status: string
  notes: string
  symptoms: string
  doctor?: Doctor
}

export default function ViewAppointment() {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string
  
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadAppointment = useCallback(async () => {
    try {
      setLoading(true)
      setMessage('')
      
      const response = await appointmentsAPI.getById(appointmentId)
      if (response.appointment) {
        setAppointment(response.appointment)
      } else {
        setMessage('Appointment not found')
      }
    } catch (error: any) {
      console.error('Error loading appointment:', error)
      setMessage('Failed to load appointment details')
    } finally {
      setLoading(false)
    }
  }, [appointmentId])

  useEffect(() => {
    if (appointmentId) {
      loadAppointment()
    }
  }, [appointmentId, loadAppointment])

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED': return 'bg-primary'
      case 'CONFIRMED': return 'bg-success'
      case 'COMPLETED': return 'bg-info'
      case 'CANCELLED': return 'bg-danger'
      case 'NO_SHOW': return 'bg-warning'
      default: return 'bg-secondary'
    }
  }

  const getTypeBadgeClass = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'CONSULTATION': return 'bg-primary'
      case 'FOLLOW_UP': return 'bg-success'
      case 'CHECK_UP': return 'bg-info'
      case 'EMERGENCY': return 'bg-danger'
      case 'SURGERY': return 'bg-warning'
      default: return 'bg-secondary'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'STAFF']}>
        <Sidebar />
        <div className="main px-lg-4 px-md-4">
          <Header />
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status"></div>
                  <p>Loading appointment details...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
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
                  <h3 className="fw-bold mb-0">View Appointment</h3>
                  <div className="btn-group" role="group">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => router.push('/appointments')}
                    >
                      <i className="icofont-arrow-left me-2"></i>Back to List
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => router.push(`/appointments/${appointmentId}/edit`)}
                    >
                      <i className="icofont-edit me-2"></i>Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-danger mb-3">
                    <i className="icofont-warning-alt me-2"></i>
                    {message}
                  </div>
                </div>
              </div>
            )}

            {appointment && (
              <div className="row clearfix g-3">
                <div className="col-lg-8 col-md-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Appointment Details</h6>
                      <div className="d-flex gap-2">
                        <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <span className={`badge ${getTypeBadgeClass(appointment.type)}`}>
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="form-label fw-bold">First Name</label>
                          <div className="form-control-plaintext border rounded p-2 bg-light">
                            {appointment.firstName || 'N/A'}
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label fw-bold">Last Name</label>
                          <div className="form-control-plaintext border rounded p-2 bg-light">
                            {appointment.lastName || 'N/A'}
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label fw-bold">Doctor</label>
                          <div className="form-control-plaintext border rounded p-2 bg-light">
                            {appointment.doctor ? 
                              `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName} - ${appointment.doctor.specialization}` 
                              : 'N/A'
                            }
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label fw-bold">Appointment Date</label>
                          <div className="form-control-plaintext border rounded p-2 bg-light">
                            {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label fw-bold">Appointment Time</label>
                          <div className="form-control-plaintext border rounded p-2 bg-light">
                            {appointment.time || 'N/A'}
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label fw-bold">Duration</label>
                          <div className="form-control-plaintext border rounded p-2 bg-light">
                            {appointment.duration} minutes
                          </div>
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Notes</label>
                          <div className="form-control-plaintext border rounded p-2 bg-light" style={{ minHeight: '80px' }}>
                            {appointment.notes || 'No notes provided'}
                          </div>
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Symptoms</label>
                          <div className="form-control-plaintext border rounded p-2 bg-light" style={{ minHeight: '60px' }}>
                            {appointment.symptoms || 'No symptoms recorded'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-4 col-md-12">
                  <div className="card">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Quick Actions</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-primary"
                          onClick={() => router.push(`/appointments/${appointmentId}/edit`)}
                        >
                          <i className="icofont-edit me-2"></i>Edit Appointment
                        </button>
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => router.push('/appointments')}
                        >
                          <i className="icofont-list me-2"></i>All Appointments
                        </button>
                        <button 
                          className="btn btn-outline-success"
                          onClick={() => router.push('/appointments/book')}
                        >
                          <i className="icofont-plus me-2"></i>Book New
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

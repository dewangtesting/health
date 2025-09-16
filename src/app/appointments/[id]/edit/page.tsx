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

export default function EditAppointment() {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string
  
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    doctorId: '',
    date: '',
    time: '',
    duration: 30,
    type: 'CONSULTATION',
    status: 'SCHEDULED',
    notes: '',
    symptoms: ''
  })

  const loadAppointmentAndDoctors = useCallback(async () => {
    try {
      setLoadingData(true)
      setMessage('')
      
      const [appointmentResponse, doctorsResponse] = await Promise.all([
        appointmentsAPI.getById(appointmentId),
        doctorsAPI.getAll().catch(() => ({ doctors: [] }))
      ])
      
      if (appointmentResponse.appointment) {
        const appointment = appointmentResponse.appointment
        setFormData({
          firstName: appointment.firstName || '',
          lastName: appointment.lastName || '',
          doctorId: appointment.doctorId || '',
          date: appointment.date ? appointment.date.split('T')[0] : '',
          time: appointment.time || '',
          duration: appointment.duration || 30,
          type: appointment.type || 'CONSULTATION',
          status: appointment.status || 'SCHEDULED',
          notes: appointment.notes || '',
          symptoms: appointment.symptoms || ''
        })
      } else {
        setMessage('Appointment not found')
      }
      
      setDoctors(doctorsResponse.doctors || [])
      
    } catch (error: any) {
      console.error('Error loading data:', error)
      setMessage('Failed to load appointment details')
    } finally {
      setLoadingData(false)
    }
  }, [appointmentId])

  useEffect(() => {
    if (appointmentId) {
      loadAppointmentAndDoctors()
    }
  }, [appointmentId, loadAppointmentAndDoctors])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.doctorId || !formData.date) {
      setMessage('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setMessage('')
      
      const appointmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        status: formData.status,
        notes: formData.notes,
        symptoms: formData.symptoms
      }

      await appointmentsAPI.update(appointmentId, appointmentData)
      setMessage('Appointment updated successfully!')
      
      // Redirect after success
      setTimeout(() => {
        router.push(`/appointments/${appointmentId}`)
      }, 2000)
      
    } catch (error: any) {
      console.error('Appointment update error:', error)
      setMessage(error.message || 'Failed to update appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
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
                  <h3 className="fw-bold mb-0">Edit Appointment</h3>
                  <div className="btn-group" role="group">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => router.push(`/appointments/${appointmentId}`)}
                    >
                      <i className="icofont-arrow-left me-2"></i>Back to View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix g-3">
              <div className="col-lg-8 col-md-12">
                <div className="card mb-3">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Appointment Details</h6>
                  </div>
                  <div className="card-body">
                    {message && (
                      <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-3`}>
                        <i className={`icofont-${message.includes('successfully') ? 'check-circled' : 'warning-alt'} me-2`}></i>
                        {message}
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="form-label">First Name *</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Last Name *</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Doctor *</label>
                          <select 
                            className="form-select"
                            name="doctorId"
                            value={formData.doctorId}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                              <option key={doctor.id} value={doctor.id}>
                                Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialization}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Status</label>
                          <select 
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                          >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_SHOW">No Show</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Appointment Date *</label>
                          <input 
                            type="date" 
                            className="form-control"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Appointment Time</label>
                          <input 
                            type="time" 
                            className="form-control"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Duration (minutes)</label>
                          <select 
                            className="form-select"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                          >
                            <option value={30}>30</option>
                            <option value={45}>45</option>
                            <option value={60}>60</option>
                            <option value={90}>90</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Appointment Type</label>
                          <select 
                            className="form-select"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                          >
                            <option value="CONSULTATION">Consultation</option>
                            <option value="FOLLOW_UP">Follow-up</option>
                            <option value="CHECK_UP">Check-up</option>
                            <option value="EMERGENCY">Emergency</option>
                            <option value="SURGERY">Surgery</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Notes</label>
                          <textarea 
                            className="form-control" 
                            rows={3} 
                            placeholder="Additional notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Symptoms</label>
                          <textarea 
                            className="form-control" 
                            rows={2} 
                            placeholder="Patient symptoms (if any)"
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleInputChange}
                          />
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
                              Updating...
                            </>
                          ) : (
                            <>
                              <i className="icofont-check-circled me-2"></i>Update Appointment
                            </>
                          )}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => router.push(`/appointments/${appointmentId}`)}
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
                    <h6 className="mb-0 fw-bold">Quick Actions</h6>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => router.push(`/appointments/${appointmentId}`)}
                      >
                        <i className="icofont-eye me-2"></i>View Details
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

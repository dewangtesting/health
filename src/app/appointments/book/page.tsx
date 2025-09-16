'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAppointments } from '@/hooks/useAppointments'
import { doctorsAPI, patientsAPI } from '@/lib/api'

interface Doctor {
  id: string
  specialization: string
  user: {
    firstName: string
    lastName: string
  }
}

interface Patient {
  id: string
  user: {
    firstName: string
    lastName: string
  }
}

export default function BookAppointment() {
  const router = useRouter()
  const { createAppointment, getAvailableSlots } = useAppointments()
  
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    doctorId: '',
    date: '',
    time: '',
    duration: 30,
    type: 'CONSULTATION',
    notes: '',
    symptoms: ''
  })

  // Load doctors and patients on component mount
  useEffect(() => {
    loadDoctorsAndPatients()
  }, [])

  // Load available slots when doctor and date change
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      loadAvailableSlots()
    } else {
      setAvailableSlots([])
    }
  }, [formData.doctorId, formData.date])

  const loadDoctorsAndPatients = async () => {
    try {
      setLoadingData(true)
      setMessage('')
      
      const [doctorsResponse, patientsResponse] = await Promise.all([
        doctorsAPI.getAll().catch(() => ({ doctors: [] })),
        patientsAPI.getAll().catch(() => ({ patients: [] }))
      ])
      
      setDoctors(doctorsResponse.doctors || [])
      setPatients(patientsResponse.patients || [])
      
      // If no data from API, show fallback message
      if ((!doctorsResponse.doctors || doctorsResponse.doctors.length === 0) && 
          (!patientsResponse.patients || patientsResponse.patients.length === 0)) {
        setMessage('Unable to load doctors and patients. Please ensure the backend server is running.')
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
      setMessage('Failed to load doctors and patients. Using offline mode.')
    } finally {
      setLoadingData(false)
    }
  }

  const loadAvailableSlots = async () => {
    if (!formData.doctorId || !formData.date) return
    
    try {
      setLoadingSlots(true)
      const slots = await getAvailableSlots(formData.doctorId, formData.date)
      setAvailableSlots(slots || [])
    } catch (error) {
      console.error('Error loading slots:', error)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

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
        notes: formData.notes,
        symptoms: formData.symptoms
      }

      console.log('Sending appointment data:', appointmentData)
      const response = await createAppointment(appointmentData)
      console.log('Appointment creation response:', response)
      
      // Check if a new patient was created
      let successMessage = 'Appointment booked successfully!'
      if (response?.patientCreated) {
        successMessage = 'Appointment booked successfully! A new patient record has been created.'
      }
      
      setMessage(successMessage)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          doctorId: '',
          date: '',
          time: '',
          duration: 30,
          type: 'CONSULTATION',
          notes: '',
          symptoms: ''
        })
        setMessage('')
        router.push('/appointments')
      }, 3000)
      
    } catch (error: any) {
      console.error('Appointment creation error:', error)
      setMessage(error.message || 'Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
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
                  <h3 className="fw-bold mb-0">Book Appointment</h3>
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
                        <div className="col-12">
                          <div className="alert alert-info">
                            <i className="icofont-info-circle me-2"></i>
                            <strong>Patient Information:</strong> Enter the patient's name below. If this is a new patient, a patient record will be automatically created.
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Patient First Name *</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter patient's first name"
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Patient Last Name *</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter patient's last name"
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Doctor *</label>
                          {loadingData ? (
                            <div className="form-control d-flex align-items-center">
                              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                              Loading doctors...
                            </div>
                          ) : (
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
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Appointment Date *</label>
                          <input 
                            type="date" 
                            className="form-control"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Appointment Time</label>
                          {loadingSlots ? (
                            <div className="form-control d-flex align-items-center">
                              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                              Loading available slots...
                            </div>
                          ) : availableSlots.length > 0 ? (
                            <select 
                              className="form-select"
                              name="time"
                              value={formData.time}
                              onChange={handleInputChange}
                            >
                              <option value="">Select Available Time</option>
                              {availableSlots.map(slot => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                          ) : formData.doctorId && formData.date ? (
                            <div className="form-control text-muted">
                              No available slots for selected date
                            </div>
                          ) : (
                            <input 
                              type="time" 
                              className="form-control"
                              name="time"
                              value={formData.time}
                              onChange={handleInputChange}
                            />
                          )}
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
                              Booking...
                            </>
                          ) : (
                            <>
                              <i className="icofont-check-circled me-2"></i>Book Appointment
                            </>
                          )}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => router.push('/appointments')}
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
                    <h6 className="mb-0 fw-bold">Today's Schedule</h6>
                  </div>
                  <div className="card-body">
                    <div className="timeline-item d-flex pb-3">
                      <div className="timeline-marker">
                        <div className="timeline-marker-dot bg-primary"></div>
                      </div>
                      <div className="timeline-content ms-3">
                        <h6 className="mb-1">09:00 AM</h6>
                        <p className="mb-0 text-muted">Dr. Sarah Wilson</p>
                        <small>Available</small>
                      </div>
                    </div>
                    <div className="timeline-item d-flex pb-3">
                      <div className="timeline-marker">
                        <div className="timeline-marker-dot bg-warning"></div>
                      </div>
                      <div className="timeline-content ms-3">
                        <h6 className="mb-1">10:30 AM</h6>
                        <p className="mb-0 text-muted">Dr. Michael Brown</p>
                        <small>Busy</small>
                      </div>
                    </div>
                    <div className="timeline-item d-flex pb-3">
                      <div className="timeline-marker">
                        <div className="timeline-marker-dot bg-success"></div>
                      </div>
                      <div className="timeline-content ms-3">
                        <h6 className="mb-1">02:00 PM</h6>
                        <p className="mb-0 text-muted">Dr. Lisa Anderson</p>
                        <small>Available</small>
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

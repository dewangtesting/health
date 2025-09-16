'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import PatientPreview from '@/components/PatientPreview'
import PatientLetterhead from '@/components/PatientLetterhead'
import { patientsAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface Patient {
  id: string
  dateOfBirth: string
  gender: string
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  medicalHistory?: string
  allergies?: string
  bloodGroup?: string
  admitDate?: string
  admitTime?: string
  notes?: string
  bloodPressure?: string
  weight?: string
  sugarStatus?: string
  sugarLevel?: string
  diabetes?: string
  problem?: string
  diagnosis?: string
  treatmentPlan?: string
  doctorNotes?: string
  labReports?: string
  pastMedicationHistory?: string
  currentMedication?: string
  paymentOption?: string
  hasInsurance?: string
  insuranceNumber?: string
  wardNumber?: string
  doctorId?: string
  advanceAmount?: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
}

export default function ViewPatient() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'form' | 'preview' | 'letterhead'>('preview')

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await patientsAPI.getById(params.id as string)
        setPatient(response.patient)
      } catch (error) {
        console.error('Error fetching patient:', error)
        toast.error('Failed to load patient details')
        router.push('/patients')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPatient()
    }
  }, [params.id, router])

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

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'STAFF']}>
        <Sidebar />
        <div className="main px-lg-4 px-md-4">
          <Header />
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">Loading patient details...</div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'STAFF']}>
        <Sidebar />
        <div className="main px-lg-4 px-md-4">
          <Header />
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              <div className="text-center py-5">
                <i className="icofont-warning-alt display-4 text-danger"></i>
                <div className="mt-2">Patient not found</div>
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
                  <h3 className="fw-bold mb-0">Patient Details</h3>
                  <div className="col-auto d-flex w-sm-100 gap-2">
                    <div className="d-flex gap-2 mb-3">
                      <button
                        type="button"
                        className={`btn ${viewMode === 'form' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setViewMode('form')}
                      >
                        <i className="icofont-edit me-2"></i>Form View
                      </button>
                      <button
                        type="button"
                        className={`btn ${viewMode === 'preview' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setViewMode('preview')}
                      >
                        <i className="icofont-eye me-2"></i>Preview
                      </button>
                      <button
                        type="button"
                        className={`btn ${viewMode === 'letterhead' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setViewMode('letterhead')}
                      >
                        <i className="icofont-doctor me-2"></i>Medical Report
                      </button>
                      {viewMode === 'letterhead' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                              import('../../../../utils/printUtils').then(({ printMedicalReport }) => {
                                printMedicalReport(`${patient.user.firstName} ${patient.user.lastName}`);
                              });
                            }}
                          >
                            <i className="icofont-print me-2"></i>Print Report
                          </button>
                          <button
                            type="button"
                            className="btn btn-info"
                            onClick={() => {
                              import('../../../../utils/printUtils').then(({ openPrintPreview }) => {
                                openPrintPreview(`${patient.user.firstName} ${patient.user.lastName}`);
                              });
                            }}
                          >
                            <i className="icofont-eye me-2"></i>Print Preview
                          </button>
                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => {
                              import('../../../../utils/printUtils').then(({ exportToPDF }) => {
                                exportToPDF(`${patient.user.firstName} ${patient.user.lastName}`);
                              });
                            }}
                          >
                            <i className="icofont-file-pdf me-2"></i>Export PDF
                          </button>
                        </>
                      )}
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => router.push('/patients')}
                    >
                      <i className="icofont-arrow-left me-2"></i>Back to List
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => router.push(`/patients/edit/${patient.id}`)}
                    >
                      <i className="icofont-edit me-2"></i>Edit Patient
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {viewMode === 'preview' ? (
                  <PatientPreview patient={patient} />
                ) : viewMode === 'letterhead' ? (
                  <PatientLetterhead patient={patient} />
                ) : (
                <form>
                  {/* Patient Basic Information */}
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Patient Basic Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                          <label className="form-label">First Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.user.firstName || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.user.lastName || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.user.phone || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address</label>
                          <input 
                            type="email" 
                            className="form-control"
                            value={patient.user.email || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date of Birth</label>
                          <input 
                            type="date" 
                            className="form-control"
                            value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Age</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={`${calculateAge(patient.dateOfBirth)} years`}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Gender</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.gender || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Admit Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            value={patient.admitDate ? new Date(patient.admitDate).toISOString().split('T')[0] : ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Admit Time</label>
                          <input 
                            type="time" 
                            className="form-control"
                            value={patient.admitTime || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Emergency Contact Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.emergencyContactName || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Emergency Contact Phone</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.emergencyContactPhone || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Address</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.address || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Notes</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.notes || ''}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Medical Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                          <label className="form-label">Blood Pressure</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.bloodPressure || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Weight</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.weight || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Sugar Status</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.sugarStatus || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Sugar Level</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.sugarLevel || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Diabetes</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.diabetes || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Blood Group</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.bloodGroup || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Problem Description</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.problem || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Diagnosis</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.diagnosis || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Treatment Plan</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.treatmentPlan || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Doctor's Notes</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.doctorNotes || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Lab Reports</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.labReports || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Past Medication History</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.pastMedicationHistory || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Current Medication</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.currentMedication || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Medical History</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.medicalHistory || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Allergies</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            value={patient.allergies || ''}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Information */}
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Registration Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                          <label className="form-label">Payment Option</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.paymentOption || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Insurance</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.hasInsurance || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Insurance Number</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.insuranceNumber || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Ward Number</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.wardNumber || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Doctor ID</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.doctorId || ''}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Advance Amount</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={patient.advanceAmount || ''}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

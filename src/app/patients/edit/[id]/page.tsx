'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { patientsAPI } from '@/lib/api'

// Schema without validation - all fields optional
const patientSchema = z.object({
  // Basic Information
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  admitDate: z.string().optional(),
  admitTime: z.string().optional(),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  notes: z.string().optional(),
  
  // Medical Information
  bloodPressure: z.string().optional(),
  weight: z.string().optional(),
  sugarStatus: z.string().optional(),
  sugarLevel: z.string().optional(),
  diabetes: z.string().optional(),
  problem: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  doctorNotes: z.string().optional(),
  labReports: z.string().optional(),
  pastMedicationHistory: z.string().optional(),
  currentMedication: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  bloodGroup: z.string().optional(),
  
  // Registration Information
  paymentOption: z.string().optional(),
  hasInsurance: z.string().optional(),
  insuranceNumber: z.string().optional(),
  wardNumber: z.string().optional(),
  doctorId: z.string().optional(),
  advanceAmount: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

export default function EditPatient() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    setValue
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema)
  })

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await patientsAPI.getById(params.id as string)
        const patient = response.patient
        
        // Set form values
        setValue('firstName', patient.user.firstName || '')
        setValue('lastName', patient.user.lastName || '')
        setValue('phone', patient.user.phone || '')
        setValue('email', patient.user.email || '')
        setValue('dateOfBirth', patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '')
        setValue('gender', patient.gender || '')
        setValue('admitDate', patient.admitDate ? new Date(patient.admitDate).toISOString().split('T')[0] : '')
        setValue('admitTime', patient.admitTime || '')
        setValue('address', patient.address || '')
        setValue('emergencyContactName', patient.emergencyContactName || '')
        setValue('emergencyContactPhone', patient.emergencyContactPhone || '')
        setValue('notes', patient.notes || '')
        setValue('bloodPressure', patient.bloodPressure || '')
        setValue('weight', patient.weight || '')
        setValue('sugarStatus', patient.sugarStatus || '')
        setValue('sugarLevel', patient.sugarLevel || '')
        setValue('diabetes', patient.diabetes || '')
        setValue('problem', patient.problem || '')
        setValue('diagnosis', patient.diagnosis || '')
        setValue('treatmentPlan', patient.treatmentPlan || '')
        setValue('doctorNotes', patient.doctorNotes || '')
        setValue('labReports', patient.labReports || '')
        setValue('pastMedicationHistory', patient.pastMedicationHistory || '')
        setValue('currentMedication', patient.currentMedication || '')
        setValue('medicalHistory', patient.medicalHistory || '')
        setValue('allergies', patient.allergies || '')
        setValue('bloodGroup', patient.bloodGroup || '')
        setValue('paymentOption', patient.paymentOption || '')
        setValue('hasInsurance', patient.hasInsurance || '')
        setValue('insuranceNumber', patient.insuranceNumber || '')
        setValue('wardNumber', patient.wardNumber || '')
        setValue('doctorId', patient.doctorId || '')
        setValue('advanceAmount', patient.advanceAmount || '')
        
      } catch (error) {
        console.error('Error fetching patient:', error)
        toast.error('Failed to load patient details')
        router.push('/patients')
      } finally {
        setInitialLoading(false)
      }
    }

    if (params.id) {
      fetchPatient()
    }
  }, [params.id, router, setValue])

  const onSubmit = async (data: PatientFormData) => {
    try {
      setLoading(true)
      await patientsAPI.update(params.id as string, data)
      toast.success('Patient updated successfully!')
      router.push('/patients')
    } catch (error) {
      console.error('Error updating patient:', error)
      toast.error('Failed to update patient')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
  }

  if (initialLoading) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
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

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        <div className="body d-flex py-lg-3 py-md-2">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="border-0 mb-4">
                <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                  <h3 className="fw-bold mb-0">Edit Patient</h3>
                  <div className="col-auto d-flex w-sm-100 gap-2">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => router.push('/patients')}
                    >
                      <i className="icofont-arrow-left me-2"></i>Back to List
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix g-3">
              <div className="col-sm-12">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Patients Basic Information */}
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Patients Basic Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                          <label className="form-label">First Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('firstName')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('lastName')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('phone')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address</label>
                          <input 
                            type="email" 
                            className="form-control"
                            {...register('email')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date of Birth</label>
                          <input 
                            type="date" 
                            className="form-control"
                            {...register('dateOfBirth')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Gender</label>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="radio" 
                                  value="MALE" 
                                  {...register('gender')}
                                  id="male"
                                />
                                <label className="form-check-label" htmlFor="male">
                                  Male
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="radio" 
                                  value="FEMALE" 
                                  {...register('gender')}
                                  id="female"
                                />
                                <label className="form-check-label" htmlFor="female">
                                  Female
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Admit Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            {...register('admitDate')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Admit Time</label>
                          <input 
                            type="time" 
                            className="form-control"
                            {...register('admitTime')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Emergency Contact Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('emergencyContactName')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Emergency Contact Phone</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('emergencyContactPhone')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Address</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            {...register('address')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Notes</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            {...register('notes')}
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
                            placeholder="e.g., 120/80"
                            {...register('bloodPressure')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Weight</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="e.g., 70 kg"
                            {...register('weight')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Sugar Status</label>
                          <select className="form-select" {...register('sugarStatus')}>
                            <option value="">Select Status</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Sugar Level</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="e.g., 100 mg/dL"
                            {...register('sugarLevel')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Diabetes</label>
                          <select className="form-select" {...register('diabetes')}>
                            <option value="">Select Type</option>
                            <option value="None">None</option>
                            <option value="Type 1">Type 1</option>
                            <option value="Type 2">Type 2</option>
                            <option value="Gestational">Gestational</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Blood Group</label>
                          <select className="form-select" {...register('bloodGroup')}>
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Problem Description</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Describe the patient's current health problems..."
                            {...register('problem')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Diagnosis</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Medical diagnosis..."
                            {...register('diagnosis')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Treatment Plan</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Recommended treatment plan..."
                            {...register('treatmentPlan')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Doctor&apos;s Notes</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Additional notes from the doctor..."
                            {...register('doctorNotes')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Lab Reports</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Lab test results and reports..."
                            {...register('labReports')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Past Medication History</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Previous medications and treatments..."
                            {...register('pastMedicationHistory')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Current Medication</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Current medications and dosages..."
                            {...register('currentMedication')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Medical History</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Patient's medical history..."
                            {...register('medicalHistory')}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Allergies</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            placeholder="Known allergies and reactions..."
                            {...register('allergies')}
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
                          <select className="form-select" {...register('paymentOption')}>
                            <option value="">Select Payment Method</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Cash">Cash</option>
                            <option value="Insurance">Insurance</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Insurance</label>
                          <select className="form-select" {...register('hasInsurance')}>
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Insurance Number</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Insurance policy number"
                            {...register('insuranceNumber')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Ward Number</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Ward/Room number"
                            {...register('wardNumber')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Doctor ID</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Assigned doctor ID"
                            {...register('doctorId')}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Advance Amount</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Advance payment amount"
                            {...register('advanceAmount')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="card">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-sm-12 text-end">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary me-2"
                            onClick={handleReset}
                            disabled={loading}
                          >
                            Reset
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                <i className="icofont-check-circled me-2"></i>
                                Update Patient
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

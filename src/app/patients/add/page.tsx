'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
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
  
  // Registration Information
  paymentOption: z.string().optional(),
  hasInsurance: z.string().optional(),
  insuranceNumber: z.string().optional(),
  wardNumber: z.string().optional(),
  doctorId: z.string().optional(),
  advanceAmount: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

export default function AddPatient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema)
  })

  const onSubmit = async (data: PatientFormData) => {
    try {
      setLoading(true)
      await patientsAPI.create(data)
      toast.success('Patient added successfully!')
      reset()
      router.push('/patients')
    } catch (error: any) {
      console.error('Error adding patient:', error)
      toast.error(error.response?.data?.message || 'Failed to add patient')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
      <div id="ihealth-layout" className="theme-tradewind">
        <Sidebar />
        
        <div className="main px-lg-4 px-md-4">
          <Header />
          
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              <div className="row align-items-center">
                <div className="border-0 mb-4">
                  <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                    <h3 className="fw-bold mb-0">Add Patients</h3>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                  <div className="col-sm-12">
                    {/* Basic Information */}
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
                              rows={2}
                              {...register('address')}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Add Note</label>
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
                              placeholder="e.g., 120/80 mmHg"
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
                            <label className="form-label">Sugar</label>
                            <div className="row">
                              <div className="col-md-6">
                                <select 
                                  className="form-select"
                                  {...register('sugarStatus')}
                                >
                                  <option value="">Select</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="Sugar level"
                                  {...register('sugarLevel')}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Diabetes</label>
                            <select 
                              className="form-select"
                              {...register('diabetes')}
                            >
                              <option value="">Select</option>
                              <option value="type1">Type 1</option>
                              <option value="type2">Type 2</option>
                              <option value="gestational">Gestational</option>
                              <option value="none">None</option>
                            </select>
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Problem</label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Describe the patient's main problem or complaint"
                              {...register('problem')}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Diagnosis</label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Medical diagnosis"
                              {...register('diagnosis')}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Treatment Plan</label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Detailed treatment plan"
                              {...register('treatmentPlan')}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Doctor's Notes</label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Additional notes from the doctor"
                              {...register('doctorNotes')}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Lab Reports</label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Lab test results and reports"
                              {...register('labReports')}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Past Medication History</label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Previous medications and treatments"
                              {...register('pastMedicationHistory')}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Current Medication</label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Current medications and dosages"
                              {...register('currentMedication')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Registration Information */}
                    <div className="card">
                      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                        <h6 className="mb-0 fw-bold">Registration Information</h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3 align-items-center">
                          <div className="col-md-6">
                            <label className="form-label">Select Payment Option</label>
                            <select 
                              className="form-select"
                              {...register('paymentOption')}
                            >
                              <option value="">Payment Option</option>
                              <option value="credit">Credit Card</option>
                              <option value="debit">Debit Card</option>
                              <option value="cash">Cash Money</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Insurance Information</label>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-check">
                                  <input 
                                    className="form-check-input" 
                                    type="radio" 
                                    value="yes" 
                                    {...register('hasInsurance')}
                                    id="hasInsurance"
                                  />
                                  <label className="form-check-label" htmlFor="hasInsurance">
                                    Yes I have Insurance
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-check">
                                  <input 
                                    className="form-check-input" 
                                    type="radio" 
                                    value="no" 
                                    {...register('hasInsurance')}
                                    id="noInsurance"
                                  />
                                  <label className="form-check-label" htmlFor="noInsurance">
                                    No I haven't Insurance
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Insurance Number</label>
                            <input 
                              type="text" 
                              className="form-control"
                              {...register('insuranceNumber')}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Ward Number</label>
                            <input 
                              type="text" 
                              className="form-control"
                              {...register('wardNumber')}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Select Doctor</label>
                            <select 
                              className="form-select"
                              {...register('doctorId')}
                            >
                              <option value="">Select Doctor</option>
                              <option value="1">Dr. Vanessa Miller</option>
                              <option value="2">Dr. Rebecca Hunter</option>
                              <option value="3">Dr. Matt Clark</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Advance Amount</label>
                            <input 
                              type="text" 
                              className="form-control"
                              {...register('advanceAmount')}
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
                                Adding...
                              </>
                            ) : (
                              <>
                                <i className="icofont-check-circled me-2"></i>
                                Submit
                              </>
                            )}
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => reset()}
                          >
                            <i className="icofont-refresh me-2"></i>
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

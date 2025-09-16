'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { doctorsAPI } from '@/lib/api'

// Schema without validation - all fields optional
const doctorSchema = z.object({
  // Personal Information
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  
  // Professional Information
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.number().optional(),
  consultationFee: z.number().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  medicalDegree: z.string().optional(),
  boardCertification: z.string().optional(),
  fellowships: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  
  // Contact Information
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  
  // Emergency Contact Information
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  
  // Additional Information
  biography: z.string().optional(),
  languages: z.array(z.string()).optional(),
  awards: z.string().optional(),
  publications: z.string().optional(),
  
  // Professional Details
  hospitalAffiliations: z.string().optional(),
  insuranceAccepted: z.array(z.string()).optional(),
  joiningDate: z.string().optional(),
  
  // Availability Information
  availableDays: z.array(z.string()).optional(),
  availableStartTime: z.string().optional(),
  availableEndTime: z.string().optional(),
})

type DoctorFormData = z.infer<typeof doctorSchema>

export default function EditDoctor() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [doctor, setDoctor] = useState<any>(null)

  const doctorId = params.id as string

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema)
  })

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setFetchLoading(true)
        const response = await doctorsAPI.getById(doctorId)
        const doctorData = response.doctor || response.data || response
        
        if (doctorData) {
          setDoctor(doctorData)
          
          // Pre-populate form fields
          const formData = {
            firstName: doctorData.user?.firstName || '',
            lastName: doctorData.user?.lastName || '',
            email: doctorData.user?.email || '',
            phone: doctorData.user?.phone || '',
            dateOfBirth: doctorData.dateOfBirth ? doctorData.dateOfBirth.split('T')[0] : '',
            bloodGroup: doctorData.bloodGroup || '',
            licenseNumber: doctorData.licenseNumber || '',
            specialization: doctorData.specialization || '',
            qualification: doctorData.qualification || '',
            experience: doctorData.experience || 0,
            consultationFee: doctorData.consultationFee || 0,
            department: doctorData.department || '',
            designation: doctorData.designation || '',
            medicalDegree: doctorData.medicalDegree || '',
            boardCertification: doctorData.boardCertification || '',
            fellowships: doctorData.fellowships || '',
            licenseExpiryDate: doctorData.licenseExpiryDate ? doctorData.licenseExpiryDate.split('T')[0] : '',
            address: doctorData.address || '',
            city: doctorData.city || '',
            state: doctorData.state || '',
            zipCode: doctorData.zipCode || '',
            country: doctorData.country || '',
            emergencyContactName: doctorData.emergencyContactName || '',
            emergencyContactPhone: doctorData.emergencyContactPhone || '',
            emergencyContactRelationship: doctorData.emergencyContactRelationship || '',
            biography: doctorData.biography || '',
            languages: doctorData.languages ? JSON.parse(doctorData.languages) : [],
            awards: doctorData.awards || '',
            publications: doctorData.publications || '',
            hospitalAffiliations: doctorData.hospitalAffiliations || '',
            insuranceAccepted: doctorData.insuranceAccepted ? JSON.parse(doctorData.insuranceAccepted) : [],
            joiningDate: doctorData.joiningDate ? doctorData.joiningDate.split('T')[0] : '',
            availableDays: doctorData.availableDays ? JSON.parse(doctorData.availableDays) : [],
            availableStartTime: doctorData.availableStartTime || '',
            availableEndTime: doctorData.availableEndTime || '',
          }
          
          reset(formData)
        }
      } catch (error: any) {
        console.error('Error fetching doctor:', error)
        toast.error('Failed to load doctor details')
      } finally {
        setFetchLoading(false)
      }
    }

    if (doctorId) {
      fetchDoctor()
    }
  }, [doctorId, reset])

  const specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Psychiatry', 'General Medicine', 'Gynecology', 'Oncology', 'Radiology',
    'Emergency Medicine', 'Anesthesiology', 'Pathology', 'Surgery', 'Internal Medicine'
  ]

  const departments = [
    'Emergency Department', 'Intensive Care Unit', 'Cardiology Department',
    'Neurology Department', 'Pediatrics Department', 'Surgery Department',
    'Radiology Department', 'Laboratory', 'Pharmacy', 'Outpatient Department'
  ]

  const designations = [
    'Chief Medical Officer', 'Department Head', 'Senior Consultant', 'Consultant',
    'Assistant Professor', 'Associate Professor', 'Professor', 'Resident Doctor',
    'Junior Doctor', 'Specialist'
  ]

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Arabic', 'Hindi'
  ]

  const insuranceProviders = [
    'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth', 'Humana',
    'Kaiser Permanente', 'Anthem', 'Medicare', 'Medicaid', 'Tricare'
  ]

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const relationships = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Colleague', 'Other']
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const onSubmit = async (data: DoctorFormData) => {
    try {
      setLoading(true)
      
      const updateData = {
        ...data,
        experience: data.experience || 0,
        consultationFee: data.consultationFee || 0,
        languages: data.languages || [],
        insuranceAccepted: data.insuranceAccepted || [],
        availableDays: data.availableDays || [],
        joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
        licenseExpiryDate: data.licenseExpiryDate ? new Date(data.licenseExpiryDate).toISOString() : undefined
      }

      await doctorsAPI.update(doctorId, updateData)
      
      toast.success('Doctor updated successfully!')
      router.push(`/doctors/profile/${doctorId}`)
      
    } catch (error: any) {
      console.error('Error updating doctor:', error)
      toast.error(error.response?.data?.message || 'Failed to update doctor')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/doctors/profile/${doctorId}`)
  }

  if (fetchLoading) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
        <Sidebar />
        <div className="main px-lg-4 px-md-4">
          <Header />
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
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
                  <h3 className="fw-bold mb-0">Edit Doctor</h3>
                  <div className="d-flex gap-2">
                    <Link href={`/doctors/profile/${doctorId}`} className="btn btn-outline-secondary">
                      <i className="icofont-arrow-left me-2"></i>Back to Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row clearfix g-3">
                {/* Personal Information */}
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Personal Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="form-label">First Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('firstName')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Last Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('lastName')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Email</label>
                          <input 
                            type="email" 
                            className="form-control"
                            {...register('email')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Phone</label>
                          <input 
                            type="tel" 
                            className="form-control"
                            {...register('phone')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Date of Birth</label>
                          <input 
                            type="date" 
                            className="form-control"
                            {...register('dateOfBirth')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Blood Group</label>
                          <select className="form-select" {...register('bloodGroup')}>
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map(group => (
                              <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Professional Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="form-label">License Number</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('licenseNumber')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Specialization</label>
                          <select 
                            className="form-select"
                            {...register('specialization')}
                          >
                            <option value="">Select Specialization</option>
                            {specializations.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Qualification</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('qualification')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Experience (Years)</label>
                          <input 
                            type="number" 
                            className="form-control"
                            {...register('experience', { valueAsNumber: true })}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Consultation Fee ($)</label>
                          <input 
                            type="number" 
                            className="form-control"
                            {...register('consultationFee', { valueAsNumber: true })}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Department</label>
                          <select className="form-select" {...register('department')}>
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Designation</label>
                          <select className="form-select" {...register('designation')}>
                            <option value="">Select Designation</option>
                            {designations.map(desig => (
                              <option key={desig} value={desig}>{desig}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Medical Degree</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('medicalDegree')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Board Certification</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('boardCertification')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Fellowships</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('fellowships')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">License Expiry Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            {...register('licenseExpiryDate')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Contact Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Address</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('address')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">City</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('city')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">State</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('state')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">ZIP Code</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('zipCode')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Country</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('country')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Emergency Contact Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="form-label">Emergency Contact Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            {...register('emergencyContactName')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Emergency Contact Phone</label>
                          <input 
                            type="tel" 
                            className="form-control"
                            {...register('emergencyContactPhone')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Relationship</label>
                          <select className="form-select" {...register('emergencyContactRelationship')}>
                            <option value="">Select Relationship</option>
                            {relationships.map(rel => (
                              <option key={rel} value={rel}>{rel}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Additional Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Biography</label>
                          <textarea 
                            className="form-control" 
                            rows={4}
                            {...register('biography')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Awards</label>
                          <textarea 
                            className="form-control" 
                            rows={3}
                            {...register('awards')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Publications</label>
                          <textarea 
                            className="form-control" 
                            rows={3}
                            {...register('publications')}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Hospital Affiliations</label>
                          <textarea 
                            className="form-control" 
                            rows={3}
                            {...register('hospitalAffiliations')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Joining Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            {...register('joiningDate')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Availability Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="form-label">Available Start Time</label>
                          <input 
                            type="time" 
                            className="form-control"
                            {...register('availableStartTime')}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Available End Time</label>
                          <input 
                            type="time" 
                            className="form-control"
                            {...register('availableEndTime')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="icofont-check-circled me-2"></i>
                          Update Doctor
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <i className="icofont-close-circled me-2"></i>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

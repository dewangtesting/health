'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { doctorsAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

// Validation schema
const doctorSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  
  // Professional Information
  licenseNumber: z.string().min(5, 'License number is required'),
  specialization: z.string().min(1, 'Please select a specialization'),
  qualification: z.string().optional(),
  experience: z.number().min(0, 'Experience must be 0 or greater').optional(),
  consultationFee: z.number().min(0, 'Fee must be 0 or greater').optional(),
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
  
  // Document Information
  profilePicture: z.any().optional(),
  additionalDocs: z.any().optional(),
  
  // Availability Information
  availableDays: z.array(z.string()).optional(),
  availableStartTime: z.string().optional(),
  availableEndTime: z.string().optional(),
})

type DoctorFormData = z.infer<typeof doctorSchema>

export default function AddDoctor() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema)
  })

  const specializations = [
    'Cardiology',
    'Neurology', 
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Psychiatry',
    'General Medicine',
    'Gynecology',
    'Oncology',
    'Radiology',
    'Emergency Medicine',
    'Anesthesiology',
    'Pathology',
    'Surgery',
    'Internal Medicine'
  ]

  const departments = [
    'Emergency Department',
    'Intensive Care Unit',
    'Cardiology Department',
    'Neurology Department',
    'Pediatrics Department',
    'Surgery Department',
    'Radiology Department',
    'Laboratory',
    'Pharmacy',
    'Outpatient Department'
  ]

  const designations = [
    'Chief Medical Officer',
    'Department Head',
    'Senior Consultant',
    'Consultant',
    'Assistant Professor',
    'Associate Professor',
    'Professor',
    'Resident Doctor',
    'Junior Doctor',
    'Specialist'
  ]

  const commonLanguages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Arabic',
    'Hindi'
  ]

  const insuranceProviders = [
    'Blue Cross Blue Shield',
    'Aetna',
    'Cigna',
    'UnitedHealth',
    'Humana',
    'Kaiser Permanente',
    'Anthem',
    'Medicare',
    'Medicaid',
    'Tricare'
  ]

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const relationships = [
    'Spouse',
    'Parent',
    'Child',
    'Sibling',
    'Friend',
    'Colleague',
    'Other'
  ]

  const weekDays = [
    'Monday',
    'Tuesday', 
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]


  const onSubmit = async (data: DoctorFormData) => {
    try {
      setLoading(true)
      
      // Prepare doctor data (exclude file fields)
      const { profilePicture, additionalDocs, ...formData } = data;
      const doctorData = {
        ...formData,
        experience: formData.experience || 0,
        consultationFee: formData.consultationFee || 0,
        languages: formData.languages || [],
        insuranceAccepted: formData.insuranceAccepted || [],
        availableDays: formData.availableDays || [],
        joiningDate: formData.joiningDate ? new Date(formData.joiningDate).toISOString() : undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        licenseExpiryDate: formData.licenseExpiryDate ? new Date(formData.licenseExpiryDate).toISOString() : undefined
      }

      // Submit to API
      await doctorsAPI.create(doctorData)
      
      toast.success('Doctor added successfully!')
      reset()
      
      // Redirect to doctors list
      router.push('/doctors')
      
    } catch (error: any) {
      console.error('Error adding doctor:', error)
      toast.error(error.response?.data?.message || 'Failed to add doctor')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    router.push('/doctors')
  }

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN'

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        <div className="body d-flex py-lg-3 py-md-2">
          <div className="container-xxl">
            {!isAdmin ? (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-warning text-center">
                    <i className="icofont-warning-alt me-2"></i>
                    Access Denied: Only administrators can add new doctors to the system.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row align-items-center">
                  <div className="border-0 mb-4">
                    <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                      <h3 className="fw-bold mb-0">Add Doctor</h3>
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
                          <label className="form-label">First Name *</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            placeholder="Enter first name"
                            {...register('firstName')}
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback">{errors.firstName.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Last Name *</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            placeholder="Enter last name"
                            {...register('lastName')}
                          />
                          {errors.lastName && (
                            <div className="invalid-feedback">{errors.lastName.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Email *</label>
                          <input 
                            type="email" 
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="doctor@hospital.com"
                            {...register('email')}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">{errors.email.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Phone *</label>
                          <input 
                            type="tel" 
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            placeholder="+1 234-567-8900"
                            {...register('phone')}
                          />
                          {errors.phone && (
                            <div className="invalid-feedback">{errors.phone.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Date of Birth</label>
                          <input 
                            type="date" 
                            className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                            {...register('dateOfBirth')}
                          />
                          {errors.dateOfBirth && (
                            <div className="invalid-feedback">{errors.dateOfBirth.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Blood Group</label>
                          <select 
                            className={`form-select ${errors.bloodGroup ? 'is-invalid' : ''}`}
                            {...register('bloodGroup')}
                          >
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map(group => (
                              <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                          {errors.bloodGroup && (
                            <div className="invalid-feedback">{errors.bloodGroup.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Joining Date</label>
                          <input 
                            type="date" 
                            className={`form-control ${errors.joiningDate ? 'is-invalid' : ''}`}
                            {...register('joiningDate')}
                          />
                          {errors.joiningDate && (
                            <div className="invalid-feedback">{errors.joiningDate.message}</div>
                          )}
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
                          <label className="form-label">License Number *</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.licenseNumber ? 'is-invalid' : ''}`}
                            placeholder="Medical license number"
                            {...register('licenseNumber')}
                          />
                          {errors.licenseNumber && (
                            <div className="invalid-feedback">{errors.licenseNumber.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Specialization *</label>
                          <select 
                            className={`form-select ${errors.specialization ? 'is-invalid' : ''}`}
                            {...register('specialization')}
                          >
                            <option value="">Select Specialization</option>
                            {specializations.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                          {errors.specialization && (
                            <div className="invalid-feedback">{errors.specialization.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Department</label>
                          <select 
                            className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                            {...register('department')}
                          >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                          {errors.department && (
                            <div className="invalid-feedback">{errors.department.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Designation</label>
                          <select 
                            className={`form-select ${errors.designation ? 'is-invalid' : ''}`}
                            {...register('designation')}
                          >
                            <option value="">Select Designation</option>
                            {designations.map(desig => (
                              <option key={desig} value={desig}>{desig}</option>
                            ))}
                          </select>
                          {errors.designation && (
                            <div className="invalid-feedback">{errors.designation.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Medical Degree</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.medicalDegree ? 'is-invalid' : ''}`}
                            placeholder="e.g., MD, MBBS, DO"
                            {...register('medicalDegree')}
                          />
                          {errors.medicalDegree && (
                            <div className="invalid-feedback">{errors.medicalDegree.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Experience (Years)</label>
                          <input 
                            type="number" 
                            className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                            placeholder="Years of experience"
                            {...register('experience', { valueAsNumber: true })}
                          />
                          {errors.experience && (
                            <div className="invalid-feedback">{errors.experience.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Consultation Fee ($)</label>
                          <input 
                            type="number" 
                            className={`form-control ${errors.consultationFee ? 'is-invalid' : ''}`}
                            placeholder="Fee amount"
                            step="0.01"
                            {...register('consultationFee', { valueAsNumber: true })}
                          />
                          {errors.consultationFee && (
                            <div className="invalid-feedback">{errors.consultationFee.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Board Certification</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.boardCertification ? 'is-invalid' : ''}`}
                            placeholder="Board certification details"
                            {...register('boardCertification')}
                          />
                          {errors.boardCertification && (
                            <div className="invalid-feedback">{errors.boardCertification.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">License Expiry Date</label>
                          <input 
                            type="date" 
                            className={`form-control ${errors.licenseExpiryDate ? 'is-invalid' : ''}`}
                            {...register('licenseExpiryDate')}
                          />
                          {errors.licenseExpiryDate && (
                            <div className="invalid-feedback">{errors.licenseExpiryDate.message}</div>
                          )}
                        </div>
                        <div className="col-12">
                          <label className="form-label">Qualification</label>
                          <textarea 
                            className={`form-control ${errors.qualification ? 'is-invalid' : ''}`}
                            rows={3} 
                            placeholder="Educational qualifications and certifications"
                            {...register('qualification')}
                          ></textarea>
                          {errors.qualification && (
                            <div className="invalid-feedback">{errors.qualification.message}</div>
                          )}
                        </div>
                        <div className="col-12">
                          <label className="form-label">Fellowships</label>
                          <textarea 
                            className={`form-control ${errors.fellowships ? 'is-invalid' : ''}`}
                            rows={2} 
                            placeholder="Fellowship details and specializations"
                            {...register('fellowships')}
                          ></textarea>
                          {errors.fellowships && (
                            <div className="invalid-feedback">{errors.fellowships.message}</div>
                          )}
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
                          <textarea 
                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                            rows={2} 
                            placeholder="Street address"
                            {...register('address')}
                          ></textarea>
                          {errors.address && (
                            <div className="invalid-feedback">{errors.address.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">City</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                            placeholder="City"
                            {...register('city')}
                          />
                          {errors.city && (
                            <div className="invalid-feedback">{errors.city.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">State</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                            placeholder="State"
                            {...register('state')}
                          />
                          {errors.state && (
                            <div className="invalid-feedback">{errors.state.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">ZIP Code</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                            placeholder="ZIP Code"
                            {...register('zipCode')}
                          />
                          {errors.zipCode && (
                            <div className="invalid-feedback">{errors.zipCode.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Country</label>
                          <input 
                            type="text" 
                            className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                            placeholder="Country"
                            defaultValue="USA"
                            {...register('country')}
                          />
                          {errors.country && (
                            <div className="invalid-feedback">{errors.country.message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Information */}
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
                            className={`form-control ${errors.emergencyContactName ? 'is-invalid' : ''}`}
                            placeholder="Full name of emergency contact"
                            {...register('emergencyContactName')}
                          />
                          {errors.emergencyContactName && (
                            <div className="invalid-feedback">{errors.emergencyContactName.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Emergency Contact Phone</label>
                          <input 
                            type="tel" 
                            className={`form-control ${errors.emergencyContactPhone ? 'is-invalid' : ''}`}
                            placeholder="+1 234-567-8900"
                            {...register('emergencyContactPhone')}
                          />
                          {errors.emergencyContactPhone && (
                            <div className="invalid-feedback">{errors.emergencyContactPhone.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Relationship</label>
                          <select 
                            className={`form-select ${errors.emergencyContactRelationship ? 'is-invalid' : ''}`}
                            {...register('emergencyContactRelationship')}
                          >
                            <option value="">Select Relationship</option>
                            {relationships.map(rel => (
                              <option key={rel} value={rel}>{rel}</option>
                            ))}
                          </select>
                          {errors.emergencyContactRelationship && (
                            <div className="invalid-feedback">{errors.emergencyContactRelationship.message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Information */}
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Availability Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Available Days</label>
                          <div className="row">
                            {weekDays.map(day => (
                              <div key={day} className="col-sm-3 col-6">
                                <div className="form-check">
                                  <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value={day}
                                    id={`day-${day}`}
                                    {...register('availableDays')}
                                  />
                                  <label className="form-check-label" htmlFor={`day-${day}`}>
                                    {day}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Available Start Time</label>
                          <input 
                            type="time" 
                            className={`form-control ${errors.availableStartTime ? 'is-invalid' : ''}`}
                            {...register('availableStartTime')}
                          />
                          {errors.availableStartTime && (
                            <div className="invalid-feedback">{errors.availableStartTime.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Available End Time</label>
                          <input 
                            type="time" 
                            className={`form-control ${errors.availableEndTime ? 'is-invalid' : ''}`}
                            {...register('availableEndTime')}
                          />
                          {errors.availableEndTime && (
                            <div className="invalid-feedback">{errors.availableEndTime.message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Information */}
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Document Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Profile Picture</label>
                          <input 
                            type="file" 
                            className={`form-control ${errors.profilePicture ? 'is-invalid' : ''}`}
                            accept="image/*"
                            {...register('profilePicture')}
                          />
                          {errors.profilePicture && (
                            <div className="invalid-feedback">{errors.profilePicture.message?.toString()}</div>
                          )}
                          <div className="form-text">Upload a professional profile picture (JPG, PNG, GIF)</div>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Additional Documents</label>
                          <input 
                            type="file" 
                            className={`form-control ${errors.additionalDocs ? 'is-invalid' : ''}`}
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            {...register('additionalDocs')}
                          />
                          {errors.additionalDocs && (
                            <div className="invalid-feedback">{errors.additionalDocs.message?.toString()}</div>
                          )}
                          <div className="form-text">Upload licenses, certificates, CV, etc. (PDF, DOC, DOCX, JPG, PNG)</div>
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
                            className={`form-control ${errors.biography ? 'is-invalid' : ''}`}
                            rows={4} 
                            placeholder="Professional biography and background"
                            {...register('biography')}
                          ></textarea>
                          {errors.biography && (
                            <div className="invalid-feedback">{errors.biography.message}</div>
                          )}
                        </div>
                        <div className="col-12">
                          <label className="form-label">Awards & Recognition</label>
                          <textarea 
                            className={`form-control ${errors.awards ? 'is-invalid' : ''}`}
                            rows={3} 
                            placeholder="Awards, honors, and recognition received"
                            {...register('awards')}
                          ></textarea>
                          {errors.awards && (
                            <div className="invalid-feedback">{errors.awards.message}</div>
                          )}
                        </div>
                        <div className="col-12">
                          <label className="form-label">Publications</label>
                          <textarea 
                            className={`form-control ${errors.publications ? 'is-invalid' : ''}`}
                            rows={3} 
                            placeholder="Research publications and papers"
                            {...register('publications')}
                          ></textarea>
                          {errors.publications && (
                            <div className="invalid-feedback">{errors.publications.message}</div>
                          )}
                        </div>
                        <div className="col-12">
                          <label className="form-label">Hospital Affiliations</label>
                          <textarea 
                            className={`form-control ${errors.hospitalAffiliations ? 'is-invalid' : ''}`}
                            rows={2} 
                            placeholder="Hospital and clinic affiliations"
                            {...register('hospitalAffiliations')}
                          ></textarea>
                          {errors.hospitalAffiliations && (
                            <div className="invalid-feedback">{errors.hospitalAffiliations.message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
                      Adding Doctor...
                    </>
                  ) : (
                    <>
                      <i className="icofont-check-circled me-2"></i>Add Doctor
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <i className="icofont-close-circled me-2"></i>Cancel
                </button>
              </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

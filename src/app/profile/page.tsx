'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { doctorsAPI } from '@/lib/api'

// Validation schema for doctor profile
const doctorProfileSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  
  // Password fields
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirmPassword: z.string().optional(),
  
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
  languages: z.string().optional(),
  awards: z.string().optional(),
  publications: z.string().optional(),
  researchInterests: z.string().optional(),
  
  // Availability Information
  availableDays: z.array(z.string()).optional(),
  availableStartTime: z.string().optional(),
  availableEndTime: z.string().optional(),
}).refine((data) => {
  // Password validation: if newPassword is provided, currentPassword must also be provided
  if (data.newPassword && !data.currentPassword) {
    return false
  }
  // Password confirmation: if newPassword is provided, confirmPassword must match
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false
  }
  return true
}, {
  message: "Password validation failed",
  path: ["confirmPassword"]
})

type DoctorProfileData = z.infer<typeof doctorProfileSchema>

export default function DoctorProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [doctorData, setDoctorData] = useState<any>(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<DoctorProfileData>({
    resolver: zodResolver(doctorProfileSchema)
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

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Fetch current doctor's profile data
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!user || user.role !== 'DOCTOR') return

      try {
        setFetchLoading(true)
        // Try to fetch doctor profile by user ID
        const response = await doctorsAPI.getAll()
        const currentDoctor = response.doctors.find((doc: any) => doc.user.id === user.id)
        
        if (currentDoctor) {
          setDoctorData(currentDoctor)
          // Populate form with existing data
          setValue('firstName', currentDoctor.user.firstName)
          setValue('lastName', currentDoctor.user.lastName)
          setValue('email', currentDoctor.user.email)
          setValue('phone', currentDoctor.user.phone || '')
          setValue('dateOfBirth', currentDoctor.user.dateOfBirth || '')
          setValue('bloodGroup', currentDoctor.user.bloodGroup || '')
          setValue('licenseNumber', currentDoctor.licenseNumber || '')
          setValue('specialization', currentDoctor.specialization || '')
          setValue('qualification', currentDoctor.qualification || '')
          setValue('experience', currentDoctor.experience || 0)
          setValue('consultationFee', currentDoctor.consultationFee || 0)
          setValue('department', currentDoctor.department || '')
          setValue('designation', currentDoctor.designation || '')
          setValue('medicalDegree', currentDoctor.medicalDegree || '')
          setValue('boardCertification', currentDoctor.boardCertification || '')
          setValue('fellowships', currentDoctor.fellowships || '')
          setValue('licenseExpiryDate', currentDoctor.licenseExpiryDate || '')
          setValue('address', currentDoctor.user.address || '')
          setValue('city', currentDoctor.user.city || '')
          setValue('state', currentDoctor.user.state || '')
          setValue('zipCode', currentDoctor.user.zipCode || '')
          setValue('country', currentDoctor.user.country || '')
          setValue('emergencyContactName', currentDoctor.user.emergencyContactName || '')
          setValue('emergencyContactPhone', currentDoctor.user.emergencyContactPhone || '')
          setValue('emergencyContactRelationship', currentDoctor.user.emergencyContactRelationship || '')
          setValue('biography', currentDoctor.biography || '')
          setValue('languages', currentDoctor.languages || '')
          setValue('awards', currentDoctor.awards || '')
          setValue('publications', currentDoctor.publications || '')
          setValue('researchInterests', currentDoctor.researchInterests || '')
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setFetchLoading(false)
      }
    }

    fetchDoctorProfile()
  }, [user, setValue])

  const onSubmit = async (data: DoctorProfileData) => {
    if (!doctorData) return

    try {
      setLoading(true)
      
      // Prepare update data
      const updateData = {
        ...data,
        experience: data.experience ? Number(data.experience) : undefined,
        consultationFee: data.consultationFee ? Number(data.consultationFee) : undefined,
      }

      // Remove password fields from the main update if they're empty
      if (!data.newPassword) {
        delete updateData.currentPassword
        delete updateData.newPassword
        delete updateData.confirmPassword
      }
      
      // Update doctor profile
      await doctorsAPI.update(doctorData.id, updateData)

      toast.success('Profile updated successfully!')
      setIsEditing(false)
      
      // Clear password fields
      setValue('currentPassword', '')
      setValue('newPassword', '')
      setValue('confirmPassword', '')
      
      // Refresh data
      window.location.reload()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  // Generate avatar image URL based on doctor's name
  const getAvatarUrl = (firstName: string, lastName: string) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff&size=150`
  }

  // Check if user is doctor
  const isDoctor = user?.role === 'DOCTOR'

  if (fetchLoading) {
    return (
      <ProtectedRoute allowedRoles={['DOCTOR']}>
        <Sidebar />
        <div className="main px-lg-4 px-md-4">
          <Header />
          <div className="body d-flex py-3">
            <div className="container-xxl">
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">Loading profile...</div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        <div className="body d-flex py-lg-3 py-md-2">
          <div className="container-xxl">
            {!isDoctor ? (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-warning text-center">
                    <i className="icofont-warning-alt me-2"></i>
                    Access Denied: Only doctors can view and edit their profile.
                  </div>
                </div>
              </div>
            ) : !doctorData ? (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-info text-center">
                    <i className="icofont-info-circle me-2"></i>
                    Doctor profile not found. Please contact administrator.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row align-items-center">
                  <div className="border-0 mb-4">
                    <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                      <h3 className="fw-bold mb-0">My Profile</h3>
                      <div className="col-auto d-flex gap-2">
                        {!isEditing ? (
                          <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={() => setIsEditing(true)}
                          >
                            <i className="icofont-edit me-2"></i>Edit Profile
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleCancel}
                          >
                            <i className="icofont-close-circled me-2"></i>Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!isEditing ? (
                  // View Mode
                  <div className="row clearfix g-3">
                    {/* Profile Header */}
                    <div className="col-12">
                      <div className="card mb-3">
                        <div className="card-body text-center">
                          <img 
                            src={getAvatarUrl(doctorData.user.firstName, doctorData.user.lastName)} 
                            alt={`Dr. ${doctorData.user.firstName} ${doctorData.user.lastName}`} 
                            className="avatar xl rounded-circle img-thumbnail shadow-sm mb-3"
                          />
                          <h4 className="mb-1">Dr. {doctorData.user.firstName} {doctorData.user.lastName}</h4>
                          <p className="text-muted mb-2">{doctorData.specialization}</p>
                          <p className="text-muted">{doctorData.designation || 'Doctor'}</p>
                          <span className={`badge ${doctorData.isAvailable ? 'bg-success' : 'bg-warning'}`}>
                            {doctorData.isAvailable ? 'Available' : 'Busy'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                          <h6 className="mb-0 fw-bold">Personal Information</h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <strong>Email:</strong> {doctorData.user.email}
                            </div>
                            <div className="col-12">
                              <strong>Phone:</strong> {doctorData.user.phone || 'Not provided'}
                            </div>
                            <div className="col-12">
                              <strong>Date of Birth:</strong> {doctorData.user.dateOfBirth || 'Not provided'}
                            </div>
                            <div className="col-12">
                              <strong>Blood Group:</strong> {doctorData.user.bloodGroup || 'Not provided'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                          <h6 className="mb-0 fw-bold">Professional Information</h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <strong>License Number:</strong> {doctorData.licenseNumber || 'Not provided'}
                            </div>
                            <div className="col-12">
                              <strong>Experience:</strong> {doctorData.experience ? `${doctorData.experience} years` : 'Not specified'}
                            </div>
                            <div className="col-12">
                              <strong>Consultation Fee:</strong> {doctorData.consultationFee ? `$${doctorData.consultationFee}` : 'Not specified'}
                            </div>
                            <div className="col-12">
                              <strong>Department:</strong> {doctorData.department || 'Not specified'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Biography */}
                    {doctorData.biography && (
                      <div className="col-12">
                        <div className="card mb-3">
                          <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                            <h6 className="mb-0 fw-bold">Biography</h6>
                          </div>
                          <div className="card-body">
                            <p>{doctorData.biography}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Edit Mode
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
                                  placeholder="Enter email address"
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
                                  placeholder="Enter phone number"
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
                                  className="form-control"
                                  {...register('dateOfBirth')}
                                />
                              </div>
                              <div className="col-sm-6">
                                <label className="form-label">Blood Group</label>
                                <select className="form-select" {...register('bloodGroup')}>
                                  <option value="">Select blood group</option>
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
                                <label className="form-label">License Number *</label>
                                <input 
                                  type="text" 
                                  className={`form-control ${errors.licenseNumber ? 'is-invalid' : ''}`}
                                  placeholder="Enter license number"
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
                                  <option value="">Select specialization</option>
                                  {specializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                  ))}
                                </select>
                                {errors.specialization && (
                                  <div className="invalid-feedback">{errors.specialization.message}</div>
                                )}
                              </div>
                              <div className="col-sm-6">
                                <label className="form-label">Experience (Years)</label>
                                <input 
                                  type="number" 
                                  className="form-control"
                                  placeholder="Enter years of experience"
                                  min="0"
                                  {...register('experience', { valueAsNumber: true })}
                                />
                              </div>
                              <div className="col-sm-6">
                                <label className="form-label">Consultation Fee ($)</label>
                                <input 
                                  type="number" 
                                  className="form-control"
                                  placeholder="Enter consultation fee"
                                  min="0"
                                  step="0.01"
                                  {...register('consultationFee', { valueAsNumber: true })}
                                />
                              </div>
                              <div className="col-sm-6">
                                <label className="form-label">Department</label>
                                <input 
                                  type="text" 
                                  className="form-control"
                                  placeholder="Enter department"
                                  {...register('department')}
                                />
                              </div>
                              <div className="col-sm-6">
                                <label className="form-label">Designation</label>
                                <input 
                                  type="text" 
                                  className="form-control"
                                  placeholder="Enter designation"
                                  {...register('designation')}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Password Change */}
                      <div className="col-12">
                        <div className="card mb-3">
                          <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                            <h6 className="mb-0 fw-bold">Change Password</h6>
                          </div>
                          <div className="card-body">
                            <div className="row g-3">
                              <div className="col-12">
                                <label className="form-label">Current Password</label>
                                <input 
                                  type="password" 
                                  className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                  placeholder="Enter current password"
                                  {...register('currentPassword')}
                                />
                                {errors.currentPassword && (
                                  <div className="invalid-feedback">{errors.currentPassword.message}</div>
                                )}
                              </div>
                              <div className="col-sm-6">
                                <label className="form-label">New Password</label>
                                <input 
                                  type="password" 
                                  className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                  placeholder="Enter new password"
                                  {...register('newPassword')}
                                />
                                {errors.newPassword && (
                                  <div className="invalid-feedback">{errors.newPassword.message}</div>
                                )}
                              </div>
                              <div className="col-sm-6">
                                <label className="form-label">Confirm New Password</label>
                                <input 
                                  type="password" 
                                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                  placeholder="Confirm new password"
                                  {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                  <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                                )}
                              </div>
                              <div className="col-12">
                                <small className="text-muted">
                                  <i className="icofont-info-circle me-1"></i>
                                  Leave password fields empty if you don't want to change your password.
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Biography */}
                      <div className="col-12">
                        <div className="card mb-3">
                          <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                            <h6 className="mb-0 fw-bold">Biography</h6>
                          </div>
                          <div className="card-body">
                            <textarea 
                              className="form-control"
                              rows={4}
                              placeholder="Enter your biography..."
                              {...register('biography')}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit Buttons */}
                      <div className="col-12">
                        <div className="d-flex gap-2">
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
                                <i className="icofont-check-circled me-2"></i>Update Profile
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
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

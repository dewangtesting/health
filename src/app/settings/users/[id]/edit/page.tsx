'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { usersAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  isActive: boolean
  password: string
  confirmPassword: string
}

export default function UserEditPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'PATIENT',
    isActive: true,
    password: '',
    confirmPassword: ''
  })

  const userId = params.id as string

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await usersAPI.getById(userId)
        const userData = response.user
        setUser(userData)
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'PATIENT',
          isActive: userData.isActive,
          password: '',
          confirmPassword: ''
        })
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Failed to fetch user details')
        router.push('/settings/users')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if passwords match when password is provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    try {
      setSaving(true)
      // Only include password in update if it's provided
      const updateData: any = { ...formData }
      if (!formData.password) {
        const { password, confirmPassword, ...dataWithoutPassword } = updateData
        await usersAPI.update(userId, dataWithoutPassword)
      } else {
        const { confirmPassword, ...dataWithPassword } = updateData
        await usersAPI.update(userId, dataWithPassword)
      }
      
      toast.success('User updated successfully')
      router.push(`/settings/users/${userId}`)
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <div id="ihealth-layout" className="theme-tradewind">
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
        </div>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <div id="ihealth-layout" className="theme-tradewind">
          <Sidebar />
          <div className="main px-lg-4 px-md-4">
            <Header />
            <div className="body d-flex py-lg-3 py-md-2">
              <div className="container-xxl">
                <div className="text-center">
                  <h3>User not found</h3>
                  <Link href="/settings/users" className="btn btn-primary">
                    Back to Users
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div id="ihealth-layout" className="theme-tradewind">
        <Sidebar />
        
        <div className="main px-lg-4 px-md-4">
          <Header />
          
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              <div className="row align-items-center">
                <div className="border-0 mb-4">
                  <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                    <h3 className="fw-bold mb-0">Edit User</h3>
                    <div className="btn-group">
                      <Link
                        href={`/settings/users/${userId}`}
                        className="btn btn-outline-secondary"
                      >
                        <i className="icofont-arrow-left me-2"></i>Cancel
                      </Link>
                      <Link
                        href="/settings/users"
                        className="btn btn-outline-primary"
                      >
                        <i className="icofont-list me-2"></i>Back to Users
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row clearfix g-3">
                <div className="col-lg-8 col-md-12">
                  <div className="card mb-3">
                    <div className="card-header py-3">
                      <h6 className="mb-0 fw-bold">User Information</h6>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          <div className="col-sm-6">
                            <label className="form-label">First Name</label>
                            <input 
                              type="text" 
                              name="firstName"
                              className="form-control" 
                              placeholder="First name"
                              value={formData.firstName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Last Name</label>
                            <input 
                              type="text" 
                              name="lastName"
                              className="form-control" 
                              placeholder="Last name"
                              value={formData.lastName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Email Address</label>
                            <input 
                              type="email" 
                              name="email"
                              className="form-control" 
                              placeholder="Email address"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Phone Number</label>
                            <input 
                              type="tel" 
                              name="phone"
                              className="form-control" 
                              placeholder="Phone number"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Role</label>
                            <select 
                              name="role"
                              className="form-select"
                              value={formData.role}
                              onChange={handleInputChange}
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="DOCTOR">Doctor</option>
                              <option value="STAFF">Staff</option>
                              <option value="PATIENT">Patient</option>
                            </select>
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Status</label>
                            <div className="form-check form-switch mt-2">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label">
                                {formData.isActive ? 'Active' : 'Inactive'}
                              </label>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">New Password</label>
                            <input 
                              type="password" 
                              name="password"
                              className="form-control" 
                              placeholder="Leave blank to keep current password"
                              value={formData.password}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label">Confirm Password</label>
                            <input 
                              type="password" 
                              name="confirmPassword"
                              className="form-control" 
                              placeholder="Confirm new password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <button 
                            type="submit" 
                            className="btn btn-primary me-2"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Updating...
                              </>
                            ) : (
                              <>
                                <i className="icofont-check me-2"></i>
                                Update User
                              </>
                            )}
                          </button>
                          <Link
                            href={`/settings/users/${userId}`}
                            className="btn btn-outline-secondary"
                          >
                            Cancel
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-12">
                  <div className="card mb-3">
                    <div className="card-header py-3">
                      <h6 className="mb-0 fw-bold">Current User Info</h6>
                    </div>
                    <div className="card-body text-center">
                      <div className="avatar xl rounded-circle mx-auto mb-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.firstName} className="avatar xl rounded-circle" />
                        ) : (
                          <div className="avatar xl rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                            <span style={{ fontSize: '2rem' }}>
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h6 className="mb-1">{user.firstName} {user.lastName}</h6>
                      <p className="text-muted mb-2">{user.email}</p>
                      <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : user.role === 'DOCTOR' ? 'bg-primary' : user.role === 'STAFF' ? 'bg-warning' : 'bg-info'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header py-3">
                      <h6 className="mb-0 fw-bold">Account Details</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <small className="text-muted">User ID:</small>
                        <p className="mb-0 font-monospace small">{user.id}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Created:</small>
                        <p className="mb-0 small">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="mb-0">
                        <small className="text-muted">Last Updated:</small>
                        <p className="mb-0 small">{new Date(user.updatedAt).toLocaleDateString()}</p>
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

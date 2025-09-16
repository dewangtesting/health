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

export default function UserViewPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const userId = params.id as string

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await usersAPI.getById(userId)
        setUser(response.user)
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

  const handleToggleStatus = async () => {
    if (!user) return
    
    try {
      await usersAPI.toggleStatus(user.id)
      toast.success('User status updated successfully')
      setUser({ ...user, isActive: !user.isActive })
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-danger'
      case 'DOCTOR': return 'bg-primary'
      case 'STAFF': return 'bg-warning'
      case 'PATIENT': return 'bg-info'
      default: return 'bg-secondary'
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
                    <h3 className="fw-bold mb-0">User Details</h3>
                    <div className="btn-group">
                      <Link
                        href="/settings/users"
                        className="btn btn-outline-secondary"
                      >
                        <i className="icofont-arrow-left me-2"></i>Back to Users
                      </Link>
                      <Link
                        href={`/settings/users/${user.id}/edit`}
                        className="btn btn-primary"
                      >
                        <i className="icofont-edit me-2"></i>Edit User
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row clearfix g-3">
                <div className="col-lg-4 col-md-12">
                  <div className="card mb-3">
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
                      <h5 className="mb-1">{user.firstName} {user.lastName}</h5>
                      <p className="text-muted mb-3">{user.email}</p>
                      
                      <div className="mb-3">
                        <span className={`badge ${getRoleBadgeClass(user.role)} me-2`}>
                          {user.role}
                        </span>
                        <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <button
                        className={`btn ${user.isActive ? 'btn-warning' : 'btn-success'} w-100`}
                        onClick={handleToggleStatus}
                      >
                        <i className={`icofont-${user.isActive ? 'ban' : 'check'} me-2`}></i>
                        {user.isActive ? 'Deactivate User' : 'Activate User'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 col-md-12">
                  <div className="card mb-3">
                    <div className="card-header py-3">
                      <h6 className="mb-0 fw-bold">Personal Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">First Name</label>
                          <p className="mb-0 fw-bold">{user.firstName || '-'}</p>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">Last Name</label>
                          <p className="mb-0 fw-bold">{user.lastName || '-'}</p>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">Email Address</label>
                          <p className="mb-0 fw-bold">{user.email}</p>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">Phone Number</label>
                          <p className="mb-0 fw-bold">{user.phone || '-'}</p>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">Role</label>
                          <p className="mb-0">
                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                              {user.role}
                            </span>
                          </p>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">Status</label>
                          <p className="mb-0">
                            <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </p>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">Password</label>
                          <p className="mb-0 fw-bold">••••••••</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-header py-3">
                      <h6 className="mb-0 fw-bold">Account Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">User ID</label>
                          <p className="mb-0 fw-bold font-monospace">{user.id}</p>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">Account Created</label>
                          <p className="mb-0 fw-bold">{new Date(user.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <label className="form-label text-muted">Last Updated</label>
                          <p className="mb-0 fw-bold">{new Date(user.updatedAt).toLocaleString()}</p>
                        </div>
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

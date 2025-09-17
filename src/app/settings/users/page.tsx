'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: roleFilter
      }
      
      const response = await usersAPI.getAll(params)
      setUsers(response.users)
      setTotalPages(response.pagination.pages)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleToggleStatus = async (userId: string) => {
    try {
      await usersAPI.toggleStatus(userId)
      toast.success('User status updated successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
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
                    <h3 className="fw-bold mb-0">User Management</h3>
                  </div>
                </div>
              </div>

              <div className="row clearfix g-3">
                <div className="col-sm-12">
                  <div className="card mb-3">
                    <div className="card-body">
                      {/* Search and Filter */}
                      <div className="row mb-3">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <form onSubmit={handleSearch}>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              <button className="btn btn-outline-secondary" type="submit">
                                <i className="icofont-search"></i>
                              </button>
                            </div>
                          </form>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                          <select
                            className="form-select"
                            value={roleFilter}
                            onChange={(e) => {
                              setRoleFilter(e.target.value)
                              setCurrentPage(1)
                            }}
                          >
                            <option value="">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="STAFF">Staff</option>
                            <option value="PATIENT">Patient</option>
                          </select>
                        </div>
                      </div>

                      {/* Users Table */}
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0" style={{ minWidth: '1000px' }}>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Phone</th>
                              <th>Status</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={7} className="text-center py-4">
                                  <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </td>
                              </tr>
                            ) : users.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="text-center py-4">
                                  No users found
                                </td>
                              </tr>
                            ) : (
                              users.map((user) => (
                                <tr key={user.id}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="avatar rounded-circle me-3">
                                        {user.avatar ? (
                                          <Image src={user.avatar} alt={user.firstName} className="avatar rounded-circle" width={48} height={48} />
                                        ) : (
                                          <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{user.email}</td>
                                  <td>
                                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                      {user.role}
                                    </span>
                                  </td>
                                  <td>{user.phone || '-'}</td>
                                  <td>
                                    <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                      {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <div className="btn-group" role="group">
                                      <Link
                                        href={`/settings/users/${user.id}`}
                                        className="btn btn-outline-secondary btn-sm"
                                        title="View User"
                                      >
                                        👁️
                                      </Link>
                                      <Link
                                        href={`/settings/users/${user.id}/edit`}
                                        className="btn btn-outline-primary btn-sm"
                                        title="Edit User"
                                      >
                                        ✏️
                                      </Link>
                                      <button
                                        className={`btn btn-outline-${user.isActive ? 'warning' : 'success'} btn-sm`}
                                        onClick={() => handleToggleStatus(user.id)}
                                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                      >
                                        <i className={`icofont-${user.isActive ? 'ban' : 'check'}`}></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                          <nav>
                            <ul className="pagination">
                              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => setCurrentPage(currentPage - 1)}
                                  disabled={currentPage === 1}
                                >
                                  Previous
                                </button>
                              </li>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              ))}
                              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => setCurrentPage(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                >
                                  Next
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      )}
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

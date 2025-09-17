'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

const notifications = [
  {
    id: 1,
    user: 'Chloe Walker',
    message: 'Added Appointment 2021-06-19',
    badge: 'Book',
    badgeType: 'success',
    time: '2MIN',
    avatar: '/assets/images/xs/avatar1.jpg'
  },
  {
    id: 2,
    user: 'Alan Hill',
    message: 'Lab sample collection',
    time: '13MIN',
    avatar: null,
    initials: 'AH'
  },
  {
    id: 3,
    user: 'Melanie Oliver',
    message: 'Invoice Create Patient Room A-803',
    time: '1HR',
    avatar: '/assets/images/xs/avatar3.jpg'
  },
  {
    id: 4,
    user: 'Boris Hart',
    message: 'Medicine Order to Medical',
    time: '13MIN',
    avatar: '/assets/images/xs/avatar5.jpg'
  },
  {
    id: 5,
    user: 'Alan Lambert',
    message: 'Leave Apply',
    time: '1HR',
    avatar: '/assets/images/xs/avatar6.jpg'
  },
  {
    id: 6,
    user: 'Zoe Wright',
    message: 'Patient Food Order Room A-809',
    time: '1DAY',
    avatar: '/assets/images/xs/avatar7.jpg'
  }
]

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <div className="header">
      <nav className="navbar py-4">
        <div className="container-xxl">
          {/* Right side items */}
          <div className="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">
            {/* Notifications */}
            <div className="dropdown notifications">
              <a
                className="nav-link dropdown-toggle pulse"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="icofont-alarm fs-5"></i>
                <span className="pulse-ring"></span>
              </a>
              <div
                id="NotificationsDiv"
                className={`dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-sm-end px-0 py-0 ${
                  showNotifications ? 'show' : ''
                }`}
              >
                <div className="card border-0 w280">
                  <div className="card-header border-0 p-3">
                    <h5 className="mb-0 font-weight-light d-flex justify-content-between">
                      <span>Notifications</span>
                      <span className="badge text-white">06</span>
                    </h5>
                  </div>
                  <div className="tab-content card-body">
                    <div className="tab-pane fade show active">
                      <ul className="list-unstyled list mb-0">
                        {notifications.map((notification) => (
                          <li key={notification.id} className="py-2 mb-1 border-bottom">
                            <a href="#" className="d-flex">
                              {notification.avatar ? (
                                <Image
                                  className="avatar rounded-circle"
                                  src={notification.avatar}
                                  alt={notification.user}
                                  width={40}
                                  height={40}
                                />
                              ) : (
                                <div className="avatar rounded-circle no-thumbnail">
                                  {notification.initials}
                                </div>
                              )}
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">{notification.user}</span>
                                  <small>{notification.time}</small>
                                </p>
                                <span className="">
                                  {notification.message}
                                  {notification.badge && (
                                    <span className={`badge bg-${notification.badgeType} ms-1`}>
                                      {notification.badge}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <a className="card-footer text-center border-top-0" href="#">
                    View all notifications
                  </a>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="setting ms-2">
              <a href="#" data-bs-toggle="modal" data-bs-target="#Settingmodal">
                <i className="icofont-gear-alt fs-5"></i>
              </a>
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown user-profile ms-2 ms-sm-3 d-flex align-items-center">
              <div className="u-info me-2">
                <p className="mb-0 text-end line-height-sm">
                  <span className="font-weight-bold">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </span>
                </p>
                <small>{user?.role || 'Profile'}</small>
              </div>
              <a
                className="nav-link dropdown-toggle pulse p-0"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Image
                  className="avatar lg rounded-circle img-thumbnail"
                  src="/assets/images/profile_av.png"
                  alt="profile"
                  width={40}
                  height={40}
                />
              </a>
              <div
                className={`dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0 ${
                  showProfile ? 'show' : ''
                }`}
              >
                <div className="card border-0 w280">
                  <div className="card-body pb-0">
                    <div className="d-flex py-1">
                      <Image
                        className="avatar rounded-circle"
                        src="/assets/images/profile_av.png"
                        alt="profile"
                        width={50}
                        height={50}
                      />
                      <div className="flex-fill ms-3">
                        <p className="mb-0">
                          <span className="font-weight-bold">
                            {user ? `${user.firstName} ${user.lastName}` : 'User'}
                          </span>
                        </p>
                        <small className="">{user?.email || 'user@hospital.com'}</small>
                      </div>
                    </div>
                    <div>
                      <hr className="dropdown-divider border-dark" />
                    </div>
                  </div>
                  <div className="list-group m-2">
                    <a href="/settings/profile" className="list-group-item list-group-item-action border-0">
                      <i className="icofont-ui-user-group fs-6 me-3"></i>Profile & account
                    </a>
                    <a href="/settings" className="list-group-item list-group-item-action border-0">
                      <i className="icofont-gear-alt fs-6 me-3"></i>Settings
                    </a>
                    <a href="/help" className="list-group-item list-group-item-action border-0">
                      <i className="icofont-question-circle fs-6 me-3"></i>Help
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="list-group-item list-group-item-action border-0 w-100 text-start"
                      style={{ background: 'none', border: 'none' }}
                    >
                      <i className="icofont-logout fs-6 me-3"></i>Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="navbar-toggler p-0 border-0 menu-toggle order-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainHeader"
            onClick={() => {
              if (typeof window !== 'undefined') {
                const sidebar = document.querySelector('.sidebar') as HTMLElement | null
                if (sidebar) {
                  sidebar.classList.toggle('show')
                }
              }
            }}
          >
            <span className="fa fa-bars"></span>
          </button>

          {/* Search bar */}
          <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0">
            <div className="input-group flex-nowrap input-group-lg">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                aria-label="search"
                aria-describedby="addon-wrapping"
              />
              <button type="button" className="input-group-text" id="addon-wrapping">
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

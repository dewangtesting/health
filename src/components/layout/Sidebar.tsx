'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'icofont-ui-home',
    active: true
  },
  {
    title: 'Appointment',
    icon: 'icofont-calendar',
    submenu: [
      { title: 'All Appointments', href: '/appointments' },
      { title: 'Book Appointment', href: '/appointments/book' },
      { title: 'Calendar', href: '/appointments/calendar' }
    ]
  },
  {
    title: 'Doctor',
    icon: 'icofont-doctor',
    submenu: [
      { title: 'All Doctors', href: '/doctors' },
      { title: 'Add Doctor', href: '/doctors/add' },
      { title: 'Doctor Schedule', href: '/doctors/schedule' }
    ]
  },
  {
    title: 'Patient',
    icon: 'icofont-patient-bed',
    submenu: [
      { title: 'Patient List', href: '/patients' },
      { title: 'Add Patient', href: '/patients/add' }
    ]
  },
  {
    title: 'Pharmacy',
    icon: 'icofont-pills',
    submenu: [
      { title: 'Medicine List', href: '/pharmacy/medicines' },
      { title: 'Add Medicine', href: '/pharmacy/add' }
    ]
  },
  {
    title: 'Settings',
    icon: 'icofont-gear-alt',
    submenu: [
      { title: 'Users', href: '/settings/users' }
    ]
  }
]

export default function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  // Filter menu items based on user role
  const getFilteredMenuItems = () => {
    if (!user) return menuItems

    return menuItems.map(item => {
      // Only admin can see Doctor management menu
      if (item.title === 'Doctor' && user.role !== 'ADMIN') {
        return null
      }
      
      // Customize Settings submenu based on user role
      if (item.title === 'Settings') {
        if (user.role === 'DOCTOR') {
          // For doctors: only show View Profile, remove Users
          return {
            ...item,
            submenu: [
              { title: 'View Profile', href: '/profile' }
            ]
          }
        }
        // For other roles: keep original submenu
        return item
      }
      
      return item
    }).filter((item): item is NonNullable<typeof item> => item !== null)
  }

  const filteredMenuItems = getFilteredMenuItems()

  useEffect(() => {
    // Auto-expand menu if current page is in submenu
    filteredMenuItems.forEach(item => {
      if (item.submenu) {
        const hasActiveSubItem = item.submenu.some(subItem => pathname === subItem.href)
        if (hasActiveSubItem && !openMenus.includes(item.title)) {
          setOpenMenus(prev => [...prev, item.title])
        }
      }
    })
  }, [pathname, filteredMenuItems, openMenus])

  const toggleSubmenu = (menuTitle: string) => {
    setOpenMenus(prev => 
      prev.includes(menuTitle) 
        ? prev.filter(title => title !== menuTitle)
        : [...prev, menuTitle]
    )
  }

  return (
    <div className="sidebar px-4 py-4 py-md-5 me-0">
      <div className="d-flex flex-column h-100">
        <Link href="/dashboard" className="mb-0 brand-icon">
          <span className="logo-icon">
            <i className="icofont-heart-beat fs-2"></i>
          </span>
          <span className="logo-text">I-Health</span>
        </Link>

        <ul className="menu-list flex-grow-1 mt-3">
          {filteredMenuItems.map((item, index) => (
            <li key={index} className={item.submenu ? 'collapsed' : ''}>
              {item.submenu ? (
                <>
                  <a
                    className="m-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleSubmenu(item.title)
                    }}
                  >
                    <i className={`${item.icon} fs-5`}></i>
                    <span>{item.title}</span>
                    <span className={cn(
                      "arrow ms-auto text-end fs-5",
                      openMenus.includes(item.title) 
                        ? "icofont-rounded-up" 
                        : "icofont-rounded-down"
                    )}></span>
                  </a>
                  <ul className={cn(
                    "sub-menu",
                    openMenus.includes(item.title) ? "collapse show" : "collapse"
                  )} id={`menu-${item.title}`}>
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subItem.href}
                          className={cn(
                            'ms-link',
                            pathname === subItem.href && 'active'
                          )}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    'm-link',
                    pathname === item.href && 'active'
                  )}
                >
                  <i className={`${item.icon} fs-5`}></i>
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

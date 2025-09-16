'use client'

// Mock authentication for testing when backend is not available
export const mockAuth = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock user data based on email
    const mockUsers: Record<string, any> = {
      'admin@ihealth.com': {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@ihealth.com',
        role: 'ADMIN'
      },
      'dr.wilson@ihealth.com': {
        id: '2', 
        firstName: 'Dr. Sarah',
        lastName: 'Wilson',
        email: 'dr.wilson@ihealth.com',
        role: 'DOCTOR'
      },
      'john.doe@email.com': {
        id: '3',
        firstName: 'John',
        lastName: 'Doe', 
        email: 'john.doe@email.com',
        role: 'PATIENT'
      }
    }

    const mockPasswords: Record<string, string> = {
      'admin@ihealth.com': 'admin123',
      'dr.wilson@ihealth.com': 'doctor123',
      'john.doe@email.com': 'patient123'
    }

    if (mockUsers[email] && mockPasswords[email] === password) {
      return {
        token: `mock-jwt-token-${Date.now()}`,
        user: mockUsers[email]
      }
    } else {
      throw new Error('Invalid credentials')
    }
  }
}

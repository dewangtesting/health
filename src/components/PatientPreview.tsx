'use client'

import { useState } from 'react'

interface Patient {
  id: string
  dateOfBirth: string
  gender: string
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  medicalHistory?: string
  allergies?: string
  bloodGroup?: string
  admitDate?: string
  admitTime?: string
  notes?: string
  bloodPressure?: string
  weight?: string
  sugarStatus?: string
  sugarLevel?: string
  diabetes?: string
  problem?: string
  diagnosis?: string
  treatmentPlan?: string
  doctorNotes?: string
  labReports?: string
  pastMedicationHistory?: string
  currentMedication?: string
  paymentOption?: string
  hasInsurance?: string
  insuranceNumber?: string
  wardNumber?: string
  doctorId?: string
  advanceAmount?: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
}

interface PatientPreviewProps {
  patient: Patient
}

export default function PatientPreview({ patient }: PatientPreviewProps) {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const PreviewSection = ({ title, children, icon }: { title: string, children: React.ReactNode, icon: string }) => (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light py-3">
        <h5 className="mb-0 fw-bold text-primary">
          <i className={`${icon} me-2`}></i>
          {title}
        </h5>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )

  const PreviewField = ({ label, value, className = "col-md-6" }: { label: string, value: string | undefined, className?: string }) => {
    if (!value) return null
    
    return (
      <div className={className}>
        <div className="mb-3">
          <label className="form-label text-muted small fw-semibold">{label}</label>
          <div className="preview-value p-2 bg-light rounded border-start border-primary border-3">
            {value}
          </div>
        </div>
      </div>
    )
  }

  const PreviewTextArea = ({ label, value }: { label: string, value: string | undefined }) => {
    if (!value) return null
    
    return (
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label text-muted small fw-semibold">{label}</label>
          <div className="preview-value p-3 bg-light rounded border-start border-primary border-3" style={{ whiteSpace: 'pre-wrap' }}>
            {value}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="patient-preview">
      <style jsx>{`
        .preview-value {
          min-height: 38px;
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .patient-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          padding: 2rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }
        .patient-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: translate(30px, -30px);
        }
        .patient-avatar {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .vital-stats {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .vital-item {
          text-align: center;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .vital-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #495057;
        }
        .vital-label {
          font-size: 0.85rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      {/* Patient Header */}
      <div className="patient-header">
        <div className="row align-items-center">
          <div className="col-auto">
            <div className="patient-avatar">
              {patient.user.firstName.charAt(0)}{patient.user.lastName.charAt(0)}
            </div>
          </div>
          <div className="col">
            <h2 className="mb-1">{patient.user.firstName} {patient.user.lastName}</h2>
            <p className="mb-1 opacity-75">
              <i className="icofont-ui-user me-2"></i>
              Patient ID: {patient.id}
            </p>
            <p className="mb-0 opacity-75">
              <i className="icofont-ui-calendar me-2"></i>
              {calculateAge(patient.dateOfBirth)} years old • {patient.gender}
            </p>
          </div>
          <div className="col-auto">
            <div className="text-end">
              <div className="badge bg-light text-dark fs-6 px-3 py-2">
                {patient.bloodGroup || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vital Statistics */}
      <div className="vital-stats">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="vital-item">
              <div className="vital-value text-danger">{patient.bloodPressure || 'N/A'}</div>
              <div className="vital-label">Blood Pressure</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="vital-item">
              <div className="vital-value text-info">{patient.weight || 'N/A'}</div>
              <div className="vital-label">Weight</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="vital-item">
              <div className="vital-value text-warning">{patient.sugarLevel || 'N/A'}</div>
              <div className="vital-label">Sugar Level</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="vital-item">
              <div className="vital-value text-success">{patient.wardNumber || 'N/A'}</div>
              <div className="vital-label">Ward Number</div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <PreviewSection title="Personal Information" icon="icofont-ui-user">
        <div className="row">
          <PreviewField label="Full Name" value={`${patient.user.firstName} ${patient.user.lastName}`} />
          <PreviewField label="Email Address" value={patient.user.email} />
          <PreviewField label="Phone Number" value={patient.user.phone} />
          <PreviewField label="Date of Birth" value={patient.dateOfBirth ? formatDate(patient.dateOfBirth) : undefined} />
          <PreviewField label="Age" value={`${calculateAge(patient.dateOfBirth)} years`} />
          <PreviewField label="Gender" value={patient.gender} />
          <PreviewTextArea label="Address" value={patient.address} />
        </div>
      </PreviewSection>

      {/* Emergency Contact */}
      {(patient.emergencyContactName || patient.emergencyContactPhone) && (
        <PreviewSection title="Emergency Contact" icon="icofont-phone">
          <div className="row">
            <PreviewField label="Contact Name" value={patient.emergencyContactName} />
            <PreviewField label="Contact Phone" value={patient.emergencyContactPhone} />
          </div>
        </PreviewSection>
      )}

      {/* Medical Information */}
      <PreviewSection title="Medical Information" icon="icofont-heart-beat">
        <div className="row">
          <PreviewField label="Blood Group" value={patient.bloodGroup} />
          <PreviewField label="Blood Pressure" value={patient.bloodPressure} />
          <PreviewField label="Weight" value={patient.weight} />
          <PreviewField label="Sugar Status" value={patient.sugarStatus} />
          <PreviewField label="Sugar Level" value={patient.sugarLevel} />
          <PreviewField label="Diabetes Type" value={patient.diabetes} />
          <PreviewTextArea label="Medical History" value={patient.medicalHistory} />
          <PreviewTextArea label="Known Allergies" value={patient.allergies} />
        </div>
      </PreviewSection>

      {/* Current Medical Status */}
      <PreviewSection title="Current Medical Status" icon="icofont-stethoscope">
        <div className="row">
          <PreviewTextArea label="Current Problem" value={patient.problem} />
          <PreviewTextArea label="Diagnosis" value={patient.diagnosis} />
          <PreviewTextArea label="Treatment Plan" value={patient.treatmentPlan} />
          <PreviewTextArea label="Doctor's Notes" value={patient.doctorNotes} />
        </div>
      </PreviewSection>

      {/* Lab Reports */}
      {patient.labReports && (
        <PreviewSection title="Laboratory Reports" icon="icofont-test-tube">
          <PreviewTextArea label="Recent Lab Results" value={patient.labReports} />
        </PreviewSection>
      )}

      {/* Medication Information */}
      <PreviewSection title="Medication Information" icon="icofont-pills">
        <div className="row">
          <PreviewTextArea label="Current Medications" value={patient.currentMedication} />
          <PreviewTextArea label="Past Medication History" value={patient.pastMedicationHistory} />
        </div>
      </PreviewSection>

      {/* Admission Details */}
      <PreviewSection title="Admission Details" icon="icofont-hospital">
        <div className="row">
          <PreviewField label="Admit Date" value={patient.admitDate ? formatDate(patient.admitDate) : undefined} />
          <PreviewField label="Admit Time" value={patient.admitTime ? formatTime(patient.admitTime) : undefined} />
          <PreviewField label="Ward Number" value={patient.wardNumber} />
          <PreviewField label="Assigned Doctor ID" value={patient.doctorId} />
          <PreviewTextArea label="Admission Notes" value={patient.notes} />
        </div>
      </PreviewSection>

      {/* Payment & Insurance */}
      <PreviewSection title="Payment & Insurance Information" icon="icofont-credit-card">
        <div className="row">
          <PreviewField label="Payment Method" value={patient.paymentOption} />
          <PreviewField label="Insurance Status" value={patient.hasInsurance === 'yes' ? 'Insured' : 'Not Insured'} />
          <PreviewField label="Insurance Number" value={patient.insuranceNumber} />
          <PreviewField label="Advance Amount" value={patient.advanceAmount ? `₹${patient.advanceAmount}` : undefined} />
        </div>
      </PreviewSection>
    </div>
  )
}

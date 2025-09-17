'use client'

import { useState, useEffect } from 'react'

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

interface PatientLetterheadProps {
  patient: Patient
}

export default function PatientLetterhead({ patient }: PatientLetterheadProps) {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }))
  }, [])

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
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="letterhead-container">
      <style jsx>{`
        .letterhead-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .letterhead-header {
          position: relative;
          padding: 30px 0;
          margin-bottom: 40px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 10px;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
        }
        
        .left-symbol {
          font-size: 48px;
          color: #4a90a4;
        }
        
        .center-content {
          flex: 1;
          text-align: center;
          margin: 0 30px;
        }
        
        .doctor-name {
          font-size: 32px;
          font-weight: bold;
          color: #4a90a4;
          margin-bottom: 5px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .doctor-title {
          font-size: 14px;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .right-symbols {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .symbol-icon {
          font-size: 36px;
          color: #4a90a4;
        }
        
        .ecg-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #4a90a4;
        }
        
        .ecg-line::after {
          content: '';
          position: absolute;
          left: 50%;
          top: -8px;
          transform: translateX(-50%);
          width: 100px;
          height: 16px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 16'%3E%3Cpath d='M0,8 L20,8 L25,2 L30,14 L35,8 L40,8 L45,4 L50,12 L55,8 L100,8' stroke='%234a90a4' stroke-width='2' fill='none'/%3E%3C/svg%3E") center/contain no-repeat;
        }
        
        .footer-info {
          background: linear-gradient(135deg, #4a90a4 0%, #357a8a 100%);
          color: white;
          padding: 20px 30px;
          margin-top: 50px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-left {
          flex: 1;
        }
        
        .footer-right {
          text-align: right;
          opacity: 0.8;
        }
        
        .report-title {
          text-align: center;
          font-size: 22px;
          font-weight: bold;
          color: #4a90a4;
          margin: 30px 0;
          text-decoration: underline;
        }
        
        .patient-info-header {
          background: #f8f9fa;
          padding: 20px;
          border-left: 4px solid #0d6efd;
          margin-bottom: 25px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 10px;
        }
        
        .info-label {
          font-weight: 600;
          width: 150px;
          color: #6c757d;
          font-size: 14px;
        }
        
        .info-value {
          flex: 1;
          color: #333;
        }
        
        .section-header {
          font-size: 16px;
          font-weight: 600;
          color: #0d6efd;
          border-bottom: 2px solid #0d6efd;
          padding-bottom: 8px;
          margin: 25px 0 15px 0;
          text-transform: none;
          display: flex;
          align-items: center;
        }
        
        .section-header i {
          margin-right: 8px;
          font-size: 18px;
        }
        
        .medical-content {
          margin-bottom: 20px;
          text-align: justify;
          line-height: 1.7;
        }
        
        .vital-signs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        .vital-item {
          border: 2px solid #4a90a4;
          padding: 15px;
          text-align: center;
          border-radius: 8px;
          background: #f8f9fa;
        }
        
        .vital-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .vital-value {
          font-size: 18px;
          font-weight: bold;
          color: #4a90a4;
          margin-top: 5px;
        }
        
        .signature-section {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }
        
        .signature-box {
          text-align: center;
          min-width: 200px;
        }
        
        .signature-line {
          border-top: 2px solid #4a90a4;
          margin-bottom: 10px;
          height: 60px;
        }
        
        .signature-doctor-name {
          font-weight: bold;
          color: #4a90a4;
          font-size: 16px;
        }
        
        @media print {
          .letterhead-container {
            box-shadow: none;
            margin: 0;
            padding: 15mm;
            max-width: none;
            width: 100%;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .letterhead-header {
            margin-bottom: 20px;
            padding: 20px 0;
          }
          
          .doctor-name {
            font-size: 24px;
          }
          
          .doctor-title {
            font-size: 12px;
          }
          
          .report-title {
            font-size: 18px;
            margin: 20px 0;
          }
          
          .section-header {
            font-size: 14px;
            margin: 20px 0 10px 0;
            page-break-after: avoid;
          }
          
          .patient-info-header {
            margin-bottom: 15px;
            padding: 15px;
            page-break-inside: avoid;
          }
          
          .vital-signs {
            page-break-inside: avoid;
          }
          
          .medical-content {
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          
          .signature-section {
            margin-top: 30px;
            page-break-inside: avoid;
          }
          
          .footer-info {
            margin-top: 20px;
            page-break-inside: avoid;
          }
          
          /* Hide elements that shouldn't print */
          .no-print {
            display: none !important;
          }
          
          /* Ensure proper page breaks */
          .page-break-before {
            page-break-before: always;
          }
          
          .page-break-after {
            page-break-after: always;
          }
          
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Doctor's Letterhead - Based on provided design */}
      <div className="letterhead-header">
        <div className="header-content">
          <div className="left-symbol">
            ⚕️
          </div>
          <div className="center-content">
            <div className="doctor-name">Dr. Michael Doughlas</div>
            <div className="doctor-title">Consultant General Medicine</div>
          </div>
          <div className="right-symbols">
            <div className="symbol-icon">🫀</div>
            <div className="symbol-icon">✚</div>
          </div>
        </div>
        <div className="ecg-line"></div>
      </div>

      {/* Report Title */}
      <div className="report-title">MEDICAL REPORT</div>

      {/* Date and Reference */}
      <div style={{ textAlign: 'right', marginBottom: '20px', fontSize: '12px' }}>
        <div><strong>Date:</strong> {currentDate}</div>
        <div><strong>Patient ID:</strong> {patient.id}</div>
        <div><strong>Report No:</strong> MR/{new Date().getFullYear()}/{patient.id.slice(-6)}</div>
      </div>

      {/* Patient Information Header */}
      <div className="patient-info-header">
        <div className="info-row">
          <div className="info-label">Patient Name:</div>
          <div className="info-value">{patient.user.firstName} {patient.user.lastName}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Age/Gender:</div>
          <div className="info-value">{calculateAge(patient.dateOfBirth)} Years / {patient.gender}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Date of Birth:</div>
          <div className="info-value">{formatDate(patient.dateOfBirth)}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Contact:</div>
          <div className="info-value">{patient.user.phone} | {patient.user.email}</div>
        </div>
        {patient.address && (
          <div className="info-row">
            <div className="info-label">Address:</div>
            <div className="info-value">{patient.address}</div>
          </div>
        )}
        {patient.wardNumber && (
          <div className="info-row">
            <div className="info-label">Ward Number:</div>
            <div className="info-value">{patient.wardNumber}</div>
          </div>
        )}
      </div>

      {/* Vital Signs */}
      {(patient.bloodPressure || patient.weight) && (
        <>
          <div className="section-header">
            <i className="icofont-heart-beat"></i>
            Vital Signs & Basic Parameters
          </div>
          <div className="vital-signs">
            {patient.bloodPressure && (
              <div className="vital-item">
                <div className="vital-label">Blood Pressure</div>
                <div className="vital-value">{patient.bloodPressure}</div>
              </div>
            )}
            {patient.weight && (
              <div className="vital-item">
                <div className="vital-label">Weight</div>
                <div className="vital-value">{patient.weight}</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Chief Complaint */}
      {patient.problem && (
        <>
          <div className="section-header">
            <i className="icofont-ui-note"></i>
            Chief Complaint
          </div>
          <div className="medical-content">{patient.problem}</div>
        </>
      )}

      {/* Medical History */}
      {patient.medicalHistory && (
        <>
          <div className="section-header">
            <i className="icofont-medical-sign"></i>
            Medical History
          </div>
          <div className="medical-content">{patient.medicalHistory}</div>
        </>
      )}

      {/* Current Diagnosis */}
      {patient.diagnosis && (
        <>
          <div className="section-header">
            <i className="icofont-stethoscope"></i>
            Clinical Examination & Diagnosis
          </div>
          <div className="medical-content">{patient.diagnosis}</div>
        </>
      )}

      {/* Laboratory Investigations */}
      {patient.labReports && (
        <>
          <div className="section-header">
            <i className="icofont-laboratory"></i>
            Laboratory Investigations
          </div>
          <div className="medical-content" style={{ whiteSpace: 'pre-line' }}>{patient.labReports}</div>
        </>
      )}

      {/* Treatment Plan */}
      {patient.treatmentPlan && (
        <>
          <div className="section-header">
            <i className="icofont-pills"></i>
            Treatment Plan & Recommendations
          </div>
          <div className="medical-content" style={{ whiteSpace: 'pre-line' }}>{patient.treatmentPlan}</div>
        </>
      )}

      {/* Current Medications */}
      {patient.currentMedication && (
        <>
          <div className="section-header">
            <i className="icofont-prescription"></i>
            Current Medications
          </div>
          <div className="medical-content" style={{ whiteSpace: 'pre-line' }}>{patient.currentMedication}</div>
        </>
      )}

      {/* Allergies */}
      {patient.allergies && (
        <>
          <div className="section-header">
            <i className="icofont-warning"></i>
            Known Allergies
          </div>
          <div className="medical-content" style={{ color: '#d63384', fontWeight: 'bold' }}>
            ⚠️ {patient.allergies}
          </div>
        </>
      )}

      {/* Doctor's Notes */}
      {patient.notes && (
        <>
          <div className="section-header">
            <i className="icofont-doctor"></i>
            Doctor&apos;s Notes & Observations
          </div>
          <div className="medical-content">{patient.notes}</div>
        </>
      )}

      {/* General Instructions */}
      <div className="section-header">
        <i className="icofont-ui-check"></i>
        General Instructions
      </div>
      <div className="medical-content">
        <ul style={{ paddingLeft: '20px' }}>
          <li>Regular follow-up as advised by the treating physician</li>
          <li>Continue prescribed medications as per schedule</li>
          <li>Report any adverse reactions or worsening symptoms immediately</li>
          <li>Maintain proper diet and lifestyle modifications as recommended</li>
          {patient.admitDate && <li>Next appointment scheduled for follow-up review</li>}
        </ul>
      </div>

      {/* Emergency Contact */}
      {(patient.emergencyContactName || patient.emergencyContactPhone) && (
        <>
          <div className="section-header">
            <i className="icofont-phone"></i>
            Emergency Contact
          </div>
          <div className="medical-content">
            <strong>Contact Person:</strong> {patient.emergencyContactName}<br/>
            <strong>Phone Number:</strong> {patient.emergencyContactPhone}
          </div>
        </>
      )}

      {/* Signature Section */}
      <div className="signature-section">
        <div className="signature-box">
          <div className="signature-line"></div>
          <div className="signature-doctor-name">Dr. Michael Doughlas</div>
          <div style={{ fontSize: '12px', color: '#666' }}>MBBS, MD (General Medicine)</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Reg. No: MCI/12345</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
          <div><strong>Date of Issue:</strong> {currentDate}</div>
          <div><strong>Valid Until:</strong> {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</div>
        </div>
      </div>

      {/* Footer - Matching the letterhead design */}
      <div className="footer-info">
        <div className="footer-content">
          <div className="footer-left">
            <div><strong>2065 Edsel Road, City Of Commerce, California CA 90040</strong></div>
            <div>541-846-3417</div>
            <div>m.doughlas@doctorsoffice.com</div>
            <div>doctorsoffice.com</div>
          </div>
          <div className="footer-right">
            <div>CONFIDENTIAL MEDICAL DOCUMENT</div>
          </div>
        </div>
      </div>
    </div>
  )
}

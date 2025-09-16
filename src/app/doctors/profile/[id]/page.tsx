'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { doctorsAPI } from '@/lib/api';

interface Doctor {
  id: string;
  licenseNumber: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  dateOfBirth?: string;
  bloodGroup?: string;
  department?: string;
  designation?: string;
  medicalDegree?: string;
  boardCertification?: string;
  fellowships?: string;
  licenseExpiryDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  biography?: string;
  languages?: string;
  awards?: string;
  publications?: string;
  hospitalAffiliations?: string;
  insuranceAccepted?: string;
  joiningDate?: string;
  availableDays?: string;
  availableStartTime?: string;
  availableEndTime?: string;
  isAvailable: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export default function DoctorProfile() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const doctorId = params.id as string;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        console.log('Fetching doctor with ID:', doctorId);
        const response = await doctorsAPI.getById(doctorId);
        console.log('API Response:', response);
        
        // Handle both possible response structures
        const doctorData = response.doctor || response.data || response;
        console.log('Doctor data:', doctorData);
        
        if (!doctorData) {
          throw new Error('No doctor data received from API');
        }
        
        setDoctor(doctorData);
      } catch (err: any) {
        console.error('Doctor fetch error:', err);
        console.error('Error response:', err.response);
        setError(err.response?.data?.message || err.message || 'Failed to fetch doctor details');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const getAvatarUrl = (firstName: string, lastName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=0d6efd&color=fff&size=200`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const parseJsonField = (field?: string) => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="container-xxl">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container-xxl">
        <div className="alert alert-danger" role="alert">
          {error || 'Doctor not found'}
        </div>
        <Link href="/doctors" className="btn btn-primary">
          Back to Doctors
        </Link>
      </div>
    );
  }

  const languages = parseJsonField(doctor.languages);
  const availableDays = parseJsonField(doctor.availableDays);
  const insuranceAccepted = parseJsonField(doctor.insuranceAccepted);

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        <div className="body d-flex py-lg-3 py-md-2">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="border-0 mb-4">
                <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                  <h3 className="fw-bold mb-0">Doctor Profile</h3>
                  <div className="d-flex gap-2">
                    <Link href="/doctors" className="btn btn-outline-primary">
                      <i className="icofont-arrow-left me-2"></i>Back to Doctors
                    </Link>
                    <Link 
                      href={`/doctors/edit/${doctor.id}`} 
                      className="btn btn-primary"
                    >
                      <i className="icofont-edit me-2"></i>Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Profile Card */}
            <div className="row g-3">
              <div className="col-xl-12 col-lg-12 col-md-12">
                <div className="card teacher-card mb-3">
                  <div className="card-body d-flex teacher-fulldeatil">
                    <div className="profile-teacher pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                      <a href="#">
                        <img 
                          src={getAvatarUrl(doctor.user.firstName, doctor.user.lastName)} 
                          alt={`Dr. ${doctor.user.firstName} ${doctor.user.lastName}`}
                          className="avatar xl rounded-circle img-thumbnail shadow-sm"
                        />
                      </a>
                      <div className="about-info d-flex align-items-center mt-3 justify-content-center flex-column">
                        <span className="text-muted small">Doctor ID: {doctor.licenseNumber}</span>
                        <span className={`badge mt-2 ${doctor.isAvailable ? 'bg-success' : 'bg-warning'}`}>
                          {doctor.isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>
                    <div className="teacher-info border-start ps-xl-4 ps-md-4 ps-sm-4 ps-4 w-100">
                      <h6 className="mb-0 mt-2 fw-bold d-block fs-6">
                        Dr. {doctor.user.firstName} {doctor.user.lastName}
                      </h6>
                      <span className="py-1 fw-bold small-11 mb-0 mt-1 text-muted">
                        {doctor.specialization}
                        {doctor.city && doctor.state && `, ${doctor.city}, ${doctor.state}`}
                      </span>
                      {doctor.biography && (
                        <p className="mt-2">{doctor.biography}</p>
                      )}
                      <div className="row g-2 pt-2">
                        <div className="col-xl-6">
                          <div className="d-flex align-items-center">
                            <i className="icofont-ui-touch-phone"></i>
                            <span className="ms-2">{doctor.user.phone || 'Not provided'}</span>
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="d-flex align-items-center">
                            <i className="icofont-email"></i>
                            <span className="ms-2">{doctor.user.email}</span>
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="d-flex align-items-center">
                            <i className="icofont-birthday-cake"></i>
                            <span className="ms-2">{formatDate(doctor.dateOfBirth)}</span>
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="d-flex align-items-center">
                            <i className="icofont-address-book"></i>
                            <span className="ms-2">
                              {doctor.address ? 
                                `${doctor.address}${doctor.city ? `, ${doctor.city}` : ''}${doctor.state ? `, ${doctor.state}` : ''}` 
                                : 'Address not provided'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="row g-3 mb-3">
              <div className="col-xl-6">
                <div className="card">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Professional Information</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Qualification:</span>
                          <span className="fw-bold">{doctor.qualification || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Experience:</span>
                          <span className="fw-bold">
                            {doctor.experience ? `${doctor.experience} years` : 'Not specified'}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Department:</span>
                          <span className="fw-bold">{doctor.department || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Designation:</span>
                          <span className="fw-bold">{doctor.designation || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Medical Degree:</span>
                          <span className="fw-bold">{doctor.medicalDegree || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Board Certification:</span>
                          <span className="fw-bold">{doctor.boardCertification || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Consultation Fee:</span>
                          <span className="fw-bold">
                            {doctor.consultationFee ? `$${doctor.consultationFee}` : 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="card">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Personal Information</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Blood Group:</span>
                          <span className="fw-bold">{doctor.bloodGroup || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Country:</span>
                          <span className="fw-bold">{doctor.country || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">ZIP Code:</span>
                          <span className="fw-bold">{doctor.zipCode || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Emergency Contact:</span>
                          <span className="fw-bold">{doctor.emergencyContactName || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Emergency Phone:</span>
                          <span className="fw-bold">{doctor.emergencyContactPhone || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Relationship:</span>
                          <span className="fw-bold">{doctor.emergencyContactRelationship || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Joining Date:</span>
                          <span className="fw-bold">{formatDate(doctor.joiningDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="row g-3 mb-3">
              <div className="col-xl-6">
                <div className="card">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Languages & Skills</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <span className="text-muted d-block mb-2">Languages Spoken:</span>
                      {languages.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {languages.map((lang: string, index: number) => (
                            <span key={index} className="badge bg-primary">{lang}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">Not specified</span>
                      )}
                    </div>
                    
                    {doctor.fellowships && (
                      <div className="mb-3">
                        <span className="text-muted d-block mb-2">Fellowships:</span>
                        <p className="mb-0">{doctor.fellowships}</p>
                      </div>
                    )}

                    {doctor.awards && (
                      <div className="mb-3">
                        <span className="text-muted d-block mb-2">Awards:</span>
                        <p className="mb-0">{doctor.awards}</p>
                      </div>
                    )}

                    {doctor.publications && (
                      <div>
                        <span className="text-muted d-block mb-2">Publications:</span>
                        <p className="mb-0">{doctor.publications}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="card">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Availability & Schedule</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <span className="text-muted d-block mb-2">Available Days:</span>
                      {availableDays.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {availableDays.map((day: string, index: number) => (
                            <span key={index} className="badge bg-success">{day}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">Not specified</span>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Available Hours:</span>
                        <span className="fw-bold">
                          {doctor.availableStartTime && doctor.availableEndTime 
                            ? `${doctor.availableStartTime} - ${doctor.availableEndTime}`
                            : 'Not specified'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-muted d-block mb-2">License Expiry:</span>
                      <span className="fw-bold">{formatDate(doctor.licenseExpiryDate)}</span>
                    </div>

                    {doctor.hospitalAffiliations && (
                      <div>
                        <span className="text-muted d-block mb-2">Hospital Affiliations:</span>
                        <p className="mb-0">{doctor.hospitalAffiliations}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            {insuranceAccepted.length > 0 && (
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-bold">Insurance Accepted</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-wrap gap-2">
                        {insuranceAccepted.map((insurance: string, index: number) => (
                          <span key={index} className="badge bg-info">{insurance}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

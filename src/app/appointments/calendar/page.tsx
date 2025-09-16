'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '@/hooks/useAppointments';
import { useDoctors } from '@/hooks/useDoctors';
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

// Extend Window interface for FullCalendar
declare global {
  interface Window {
    FullCalendar: any;
  }
}

export default function AppointmentCalendar() {
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { doctors, loading: doctorsLoading } = useDoctors();
  const router = useRouter();

  useEffect(() => {
    // Initialize FullCalendar when component mounts
    const initCalendar = () => {
      if (typeof window !== 'undefined' && window.FullCalendar) {
        const calendarEl = document.getElementById('my_calendar');
        if (calendarEl) {
          // Convert appointments to calendar events
          const events = appointments?.map(appointment => ({
            id: appointment.id,
            title: `${appointment.firstName || 'Patient'} ${appointment.lastName || ''} - ${appointment.type}`,
            start: `${appointment.date}T${appointment.time || '09:00'}`,
            backgroundColor: getEventColor(appointment.status),
            borderColor: getEventColor(appointment.status),
            extendedProps: {
              appointment: appointment
            }
          })) || [];

          const calendar = new window.FullCalendar.Calendar(calendarEl, {
            timeZone: 'UTC',
            initialView: 'dayGridMonth',
            events: events,
            editable: true,
            selectable: true,
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            eventClick: function(info: any) {
              // Navigate to appointment details
              router.push(`/appointments/${info.event.id}`);
            },
            select: function(info: any) {
              // Open add event modal with selected date
              setEventForm(prev => ({
                ...prev,
                startDate: info.startStr,
                endDate: info.endStr
              }));
              setShowAddEventModal(true);
            }
          });

          calendar.render();
        }
      }
    };

    // Load FullCalendar script if not already loaded
    if (typeof window !== 'undefined' && !window.FullCalendar) {
      const script = document.createElement('script');
      script.src = '/assets/plugin/fullcalendar/main.min.js';
      script.onload = initCalendar;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/plugin/fullcalendar/main.min.css';
      document.head.appendChild(link);
    } else if (typeof window !== 'undefined') {
      initCalendar();
    }
  }, [appointments, router]);

  const getEventColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return '#17a2b8';
      case 'CONFIRMED': return '#28a745';
      case 'IN_PROGRESS': return '#ffc107';
      case 'COMPLETED': return '#6f42c1';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const handleAddEvent = () => {
    // Handle add event logic here
    console.log('Add event:', eventForm);
    setShowAddEventModal(false);
    setEventForm({ title: '', startDate: '', endDate: '', description: '' });
  };

  return (
    <>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        {/* Body */}
        <div className="body d-flex py-lg-3 py-md-2">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="border-0 mb-4">
                <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom">
                  <h3 className="fw-bold mb-0">Calendar</h3>
                  <div className="col-auto d-flex">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => setShowAddEventModal(true)}
                    >
                      <i className="icofont-plus-circle me-2 fs-6"></i>Add Event
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix g-3">
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="card-body" id="my_calendar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Event</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddEventModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Event Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="deadline-form">
                  <div className="row g-3 mb-3">
                    <div className="col">
                      <label className="form-label">Event Start Date</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={eventForm.startDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Event End Date</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={eventForm.endDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Event Description (optional)</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Add any extra details about the request"
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddEventModal(false)}
                >
                  Done
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleAddEvent}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

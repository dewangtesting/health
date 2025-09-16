'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/ProtectedRoute'

interface Schedule {
  id: string
  doctorId: string
  day: string
  startTime: string
  endTime: string
  isAvailable: boolean
  note?: string
}

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00'
]

const weekDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
]

export default function DoctorSchedule() {
  const router = useRouter()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [scheduleNote, setScheduleNote] = useState('')

  // Mock data for demonstration
  useEffect(() => {
    const mockSchedules: Schedule[] = [
      {
        id: '1',
        doctorId: 'doc1',
        day: 'Monday',
        startTime: '09:00',
        endTime: '11:00',
        isAvailable: true,
        note: 'General Consultation'
      },
      {
        id: '2',
        doctorId: 'doc1',
        day: 'Tuesday',
        startTime: '14:00',
        endTime: '16:00',
        isAvailable: true,
        note: 'Surgery Hours'
      },
      {
        id: '3',
        doctorId: 'doc1',
        day: 'Wednesday',
        startTime: '10:00',
        endTime: '12:00',
        isAvailable: true,
        note: 'Patient Rounds'
      },
      {
        id: '4',
        doctorId: 'doc1',
        day: 'Friday',
        startTime: '15:00',
        endTime: '17:00',
        isAvailable: true,
        note: 'Emergency Cases'
      }
    ]
    setSchedules(mockSchedules)
  }, [])

  const handleAddSchedule = () => {
    if (!selectedDay || !selectedTime) {
      toast.error('Please select day and time')
      return
    }

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      doctorId: 'doc1',
      day: selectedDay,
      startTime: selectedTime,
      endTime: getEndTime(selectedTime),
      isAvailable: true,
      note: scheduleNote
    }

    setSchedules(prev => [...prev, newSchedule])
    setShowAddModal(false)
    setSelectedDay('')
    setSelectedTime('')
    setScheduleNote('')
    toast.success('Schedule added successfully')
  }

  const getEndTime = (startTime: string) => {
    const startIndex = timeSlots.indexOf(startTime)
    return startIndex < timeSlots.length - 1 ? timeSlots[startIndex + 1] : timeSlots[startIndex]
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const isScheduled = (day: string, time: string) => {
    return schedules.some(schedule => 
      schedule.day === day && 
      schedule.startTime <= time && 
      schedule.endTime > time
    )
  }

  const getScheduleForSlot = (day: string, time: string) => {
    return schedules.find(schedule => 
      schedule.day === day && 
      schedule.startTime === time
    )
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
      <div id="ihealth-layout" className="theme-tradewind">
        <Sidebar />
        
        <div className="main px-lg-4 px-md-4">
          <Header />
          
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              <div className="row align-items-center">
                <div className="border-0 mb-4">
                  <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                    <h3 className="fw-bold mb-0">Doctor Schedule</h3>
                    <div className="col-auto d-flex w-sm-100">
                      <button 
                        type="button" 
                        className="btn btn-primary btn-set-task w-sm-100"
                        onClick={() => setShowAddModal(true)}
                      >
                        <i className="icofont-plus-circle me-2 fs-6"></i>Add Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row clearfix g-3">
                <div className="col-sm-12">
                  <div className="card mb-3">
                    <div className="card-body overflow-auto">
                      <div className="schedule-calendar">
                        <div className="calendar-header">
                          <div className="time-column-header">Time</div>
                          {weekDays.map((day) => (
                            <div key={day} className="day-header">
                              <span className="day-full">{day}</span>
                              <span className="day-short">{day.slice(0, 3)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="calendar-body">
                          {timeSlots.map((time, timeIndex) => (
                            <div key={time} className="time-row">
                              <div className="time-label">
                                {formatTime(time)}
                              </div>
                              {weekDays.map((day, dayIndex) => {
                                const schedule = schedules.find(s => 
                                  s.day === day && s.startTime === time
                                )
                                
                                return (
                                  <div 
                                    key={`${day}-${time}`} 
                                    className={`time-slot ${schedule ? 'has-schedule' : ''}`}
                                    onClick={() => {
                                      if (!schedule) {
                                        setSelectedDay(day)
                                        setSelectedTime(time)
                                        setShowAddModal(true)
                                      }
                                    }}
                                  >
                                    {schedule && (
                                      <div className="schedule-block">
                                        <div className="schedule-note">
                                          {schedule.note || 'Available'}
                                        </div>
                                        <div className="schedule-time">
                                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Schedule Modal */}
        {showAddModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Schedule Add</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="deadline-form">
                    <div className="row g-3 mb-3">
                      <div className="col-sm-6">
                        <label className="form-label">Schedule Day</label>
                        <select 
                          className="form-select"
                          value={selectedDay}
                          onChange={(e) => setSelectedDay(e.target.value)}
                        >
                          <option value="">Select Day</option>
                          {weekDays.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Schedule Time</label>
                        <select 
                          className="form-select"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        >
                          <option value="">Select Time</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>
                              {formatTime(time)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Schedule Note</label>
                    <textarea 
                      className="form-control" 
                      rows={3}
                      value={scheduleNote}
                      onChange={(e) => setScheduleNote(e.target.value)}
                      placeholder="Enter schedule notes..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleAddSchedule}
                  >
                    Add Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .schedule-calendar {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
            background-color: white;
            min-width: 800px;
          }
          
          .calendar-header {
            display: grid;
            grid-template-columns: 120px repeat(7, 1fr);
            background-color: #6c757d;
            color: white;
          }
          
          .time-column-header {
            padding: 15px 10px;
            font-weight: bold;
            text-align: center;
            border-right: 1px solid #5a6268;
          }
          
          .day-header {
            padding: 15px 10px;
            font-weight: bold;
            text-align: center;
            border-right: 1px solid #5a6268;
          }
          
          .day-header:last-child {
            border-right: none;
          }
          
          .day-short {
            display: none;
          }
          
          .calendar-body {
            display: flex;
            flex-direction: column;
          }
          
          .time-row {
            display: grid;
            grid-template-columns: 120px repeat(7, 1fr);
            border-bottom: 1px solid #dee2e6;
            min-height: 60px;
          }
          
          .time-row:last-child {
            border-bottom: none;
          }
          
          .time-label {
            padding: 15px 10px;
            background-color: #f8f9fa;
            border-right: 1px solid #dee2e6;
            font-size: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .time-slot {
            border-right: 1px solid #dee2e6;
            padding: 5px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .time-slot:last-child {
            border-right: none;
          }
          
          .time-slot:hover:not(.has-schedule) {
            background-color: #f8f9fa;
          }
          
          .time-slot.has-schedule {
            padding: 0;
          }
          
          .schedule-block {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 8px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-radius: 4px;
            margin: 2px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .schedule-block:hover {
            transform: scale(1.02);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          
          .schedule-note {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          
          .schedule-time {
            font-size: 10px;
            opacity: 0.9;
          }
          
          @media (max-width: 768px) {
            .schedule-calendar {
              min-width: 600px;
            }
            
            .calendar-header {
              grid-template-columns: 80px repeat(7, 1fr);
            }
            
            .time-row {
              grid-template-columns: 80px repeat(7, 1fr);
            }
            
            .time-column-header,
            .time-label {
              padding: 10px 5px;
              font-size: 10px;
            }
            
            .day-full {
              display: none;
            }
            
            .day-short {
              display: block;
            }
            
            .day-header {
              padding: 10px 5px;
              font-size: 12px;
            }
            
            .schedule-note {
              font-size: 10px;
            }
            
            .schedule-time {
              font-size: 8px;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}

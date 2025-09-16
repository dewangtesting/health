import { useState, useEffect } from 'react';
import { appointmentsAPI } from '@/lib/api';
import { mockAppointments } from '@/lib/mockData';
import { getCurrentIST, formatDateIST, formatTimeIST, utcToIST } from '@/utils/timezone';
import toast from 'react-hot-toast';

export interface Appointment {
  id: string;
  patientId?: string;
  firstName?: string;
  lastName?: string;
  doctorId: string;
  date: string;
  time: string | null;
  duration: number;
  type: string;
  status: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  createdAt?: string;
  updatedAt?: string;
  patient?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
  doctor: {
    id: string;
    specialization: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface AppointmentFilters {
  page?: number;
  limit?: number;
  patientSearch?: string;
  createdDate?: string;
}

export const useAppointments = (filters?: AppointmentFilters) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Frontend: Fetching appointments with filters:', filters);
      
      // Try API first, fallback to mock data
      try {
        const response = await appointmentsAPI.getAll(filters);
        console.log('Frontend: API response received:', { 
          appointmentsCount: response.appointments?.length, 
          pagination: response.pagination 
        });
        setAppointments(response.appointments);
        setPagination(response.pagination);
      } catch (apiError) {
        console.warn('API unavailable, using mock appointments data with filters:', filters);
        
        // Apply filters to mock data
        let filteredAppointments = [...mockAppointments];
        
        // Apply patient search filter
        if (filters?.patientSearch) {
          const searchTerm = filters.patientSearch.toLowerCase();
          filteredAppointments = filteredAppointments.filter(appointment => {
            const patientName = appointment.firstName && appointment.lastName ? 
              `${appointment.firstName} ${appointment.lastName}`.toLowerCase() :
              (appointment.patient ? 
                `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`.toLowerCase() :
                ''
              );
            return patientName.includes(searchTerm);
          });
        }
        
        // Apply created date filter - IST timezone
        if (filters?.createdDate) {
          const targetDateIST = new Date(filters.createdDate + 'T00:00:00+05:30').toDateString();
          filteredAppointments = filteredAppointments.filter(appointment => {
            // For mock data, convert UTC createdAt to IST for comparison
            const createdAt = appointment.createdAt ? utcToIST(new Date(appointment.createdAt)) : getCurrentIST();
            return createdAt.toDateString() === targetDateIST;
          });
        }
        
        console.log('Mock data filtered:', { 
          originalCount: mockAppointments.length, 
          filteredCount: filteredAppointments.length,
          filters 
        });
        
        setAppointments(filteredAppointments);
        setPagination({
          page: 1,
          limit: 10,
          total: filteredAppointments.length,
          pages: Math.ceil(filteredAppointments.length / 10)
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: any) => {
    try {
      const response = await appointmentsAPI.create(appointmentData);
      toast.success('Appointment created successfully');
      await fetchAppointments(); // Refresh the list
      return response; // Return full response to access patientCreated flag
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create appointment';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateAppointment = async (id: string, appointmentData: any) => {
    try {
      const response = await appointmentsAPI.update(id, appointmentData);
      toast.success('Appointment updated successfully');
      await fetchAppointments(); // Refresh the list
      return response.appointment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update appointment';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      await appointmentsAPI.cancel(id);
      toast.success('Appointment cancelled successfully');
      await fetchAppointments(); // Refresh the list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel appointment';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getAvailableSlots = async (doctorId: string, date: string) => {
    try {
      const response = await appointmentsAPI.getAvailableSlots(doctorId, date);
      return response.availableSlots;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch available slots';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters?.page, filters?.limit, filters?.patientSearch, filters?.createdDate]);

  return {
    appointments,
    loading,
    error,
    pagination,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAvailableSlots,
    refetch: fetchAppointments
  };
};

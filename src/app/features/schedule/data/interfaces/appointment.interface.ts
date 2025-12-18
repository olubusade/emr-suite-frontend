// appointment.interface.ts

// 1. The structure returned by the API (READ/RESPONSE)
export interface IAppointmentResponse {
    id: string;
    patientId: string; // Foreign key UUID
    staffId: string;   // Foreign key UUID (Doctor/Clinician)
    appointmentDate: string; // ISO 8601 string
    reason?: string;
    status: 'scheduled' | 'completed' | 'canceled' | 'no_show';
    createdAt: string;
    updatedAt: string;
    // Optional: Add related entities if joined by the backend service
    patient?: { firstName: string; lastName: string };
    staff?: { firstName: string; lastName: string };
}

// 2. DTO for creating a new Appointment (CREATE/REQUEST)
export interface IAppointmentCreateDTO {
    patientId: string;
    staffId: string;
    appointmentDate: string; // ISO 8601 string
    reason?: string;
}

// 3. DTO for updating an existing Appointment (UPDATE/REQUEST)
// Allows updating date, reason, or status
export interface IAppointmentUpdateDTO {
    appointmentDate?: string;
    reason?: string;
    status?: 'scheduled' | 'completed' | 'canceled' | 'no_show';
    staffId?: string;
}

// Utility interface for paginated list response from the API
export interface IAppointmentListResponse {
    items: IAppointmentResponse[];
    page: number;
    pages: number;
    total: number;
}
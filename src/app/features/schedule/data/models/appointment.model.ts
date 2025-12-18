import { IAppointmentResponse } from "../interfaces/appointment.interface";

/**
 * Class representing the Appointment entity (The rich Domain Model).
 */
export class Appointment {
    // Required fields
    public id!: string;
    public patientId!: string;
    public staffId!: string;
    public reason?: string;
    public status!: 'scheduled' | 'completed' | 'canceled' | 'no_show';

    // Transformed fields (Date objects)
    public appointmentDate!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;

    // Optional fields for relational data
    public patient?: { firstName: string; lastName: string };
    public staff?: { firstName: string; lastName: string };

    // Private constructor to enforce use of static factory methods
    private constructor(data: IAppointmentResponse) {
        Object.assign(this, data);

        // 🔑 Transformation: Convert string timestamps to Date objects
        this.appointmentDate = new Date(data.appointmentDate);
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }

    /**
     * Static Factory Method: Ensures all Appointment instances are created cleanly from API data.
     */
    public static fromApi(data: IAppointmentResponse): Appointment {
        return new Appointment(data);
    }

    /**
     * Utility: Checks iaf the appointment is in a future date.
     */
    public get isUpcoming(): boolean {
        return this.status === 'scheduled' && this.appointmentDate > new Date();
    }

    /**
     * Utility: Gets the full name of the staff member.
     */
    public get staffName(): string {
        return this.staff ? `${this.staff.firstName} ${this.staff.lastName}` : 'N/A';
    }
}
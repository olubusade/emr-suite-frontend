import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/operators"; // Use '/operators' for pipeable operators
import { User } from "src/app/core/domain/interfaces/user.interface"; // <- Ensure correct User interface import
import { IUserListParams } from "src/app/features/personnel/data/interfaces/user.interface";
import { AppointmentService } from "src/app/features/schedule/data/services/appointment.service";
import { MetricsService } from "../../data/services/metrics.service";
import { StaffService } from "src/app/features/personnel/data/services/user.service";
import { PatientService } from "src/app/features/patient-chart/data/services/patient.service";
import { Subject } from "rxjs";


// --- 1. Define Missing Interfaces/Models ---
// NOTE: These should be imported. Defining here keeps context clear.
interface Appointment { patientId: string; staffId: string; appointmentDate: string; reason: string; }
interface PatientListItem { id: string; firstName: string; lastName: string; email: string; dob: string; createdAt: string; }
// --- End Interfaces ---

@Component({
  selector: "app-admin-view",
  templateUrl: "./admin-view.component.html",
  styleUrls: ["./admin-view.component.scss"],
})
export class AdminViewComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>(); 
  
    // ... data properties ...
    patientCount: number = 0;
    // ...
    bookedAppointments: Appointment[] = []; 
    patientList: PatientListItem[] = []; 
    staffList: User[] = []; 
    
  totalAppointments: number = 0;
  userCount: number = 0;
  totalEarnings: number = 0;
  
    // 5. Inject Services - CORRECTED (StaffService is injected)
    constructor(
      private metricsService: MetricsService, 
      private appointmentsService: AppointmentService, 
      private patientService: PatientService,
      private userService: StaffService 
    ) {}

    ngOnInit() {
      this.loadDashboardData(); 
    }

    /**
     * Fetches all necessary data for the Admin Dashboard widgets and tables.
     */
    loadDashboardData(): void {
      //Metrics loading logic 
      this.metricsService.getMetrics().pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => { 
            
                this.patientCount = response.patientCount;
                this.userCount = response.userCount;
                this.totalAppointments = response.totalAppointments;
                this.totalEarnings = response.revenue;
              },
              error: (err) => console.error("Error loading metrics:", err)
        })


      //Fetch Recent Appointments 
      this.appointmentsService.listAppointments({ page: 1, limit: 6 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
          next: (response:any) => { 
            this.bookedAppointments = response?.items || response?.data?.items || []; 
          },
          error: (err) => console.error("Error loading recent appointments:", err)
      });

      // --- 3. Fetch Staff List (Unchanged, already uses params object) ---
      const staffParams: IUserListParams = { page: 1, limit: 10 };
      
      this.userService.listUsers(staffParams)
      .pipe(takeUntil(this.destroy$)) 
      .subscribe({ 
        next: (response: any) => { 
          console.log("Staff List Response:", response);
          this.staffList = response?.items;
        },
        error: (err) => console.error("Error loading staff list for table:", err)
      });
    
      // --- 4. Fetch Recent Patients (Using unified params object) ---
      this.patientService.listPatients({ page: 1, limit: 6 }) //FIX: Uses params object {page, limit}
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log("patientList Response:", response);
          this.patientList = response.items || response.data || []; 
        },
        error: (err) => console.error("Error loading patients:", err)
      });
    }

   getFormattedRole(role?: string): string {
      if (!role) return '—';

      return role
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
    }

    getStaffStatusText(active?: boolean): string {
      return active ? 'Active' : 'Inactive';
    }

    getStaffStatusClass(active?: boolean): string {
      return active ? 'badge col-green' : 'badge col-red';
    }

    ngOnDestroy(): void {
        this.destroy$.next(); 
        this.destroy$.complete();
    }
}
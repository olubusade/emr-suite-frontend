import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexResponsive,
} from "ng-apexcharts";
import { Subject, takeUntil } from "rxjs";
import { User } from "src/app/core/domain/interfaces/user.interface";
import { PatientService } from "src/app/features/patient-chart/data/services/patient.service";
import { PatientListItem } from "src/app/features/patient-chart/data/interfaces/patient.interface";
import { IUserListParams } from "src/app/features/personnel/data/interfaces/user.interface";
import { StaffService } from "src/app/features/personnel/data/services/user.service";
import { Appointment } from "src/app/features/schedule/data/models/appointment.model";
import { AppointmentService } from "src/app/features/schedule/data/services/appointment.service";
import { MetricsService } from "../../data/services/metrics.service";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
};
@Component({
  selector: 'app-receptionist-view',
  templateUrl: './receptionist-view.component.html',
  styleUrls: ['./receptionist-view.component.sass']
})
export class ReceptionistViewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>(); 
  
  patientCount: number = 0;
  bookedAppointments: Appointment[] = []; 
  patientList: PatientListItem[] = []; 
  staffList: User[] = []; 
    
  totalAppointments: number = 0;
  userCount: number = 0;
  totalEarnings: number = 0;

  constructor(
    private metricsService: MetricsService, 
    private appointmentsService: AppointmentService, 
    private patientService: PatientService,
    private userService: StaffService 
  ) {}
  ngOnInit() {
      this.loadDashboardData();
  }

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
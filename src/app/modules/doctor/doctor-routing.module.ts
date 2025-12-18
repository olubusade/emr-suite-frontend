import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "../authentication/page404/page404.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { DoctorsComponent } from "./doctors/doctors.component";
import { PatientsComponent } from "./patients/patients.component";
import { SettingsComponent } from "../../features/account/components/settings/settings.component";
import { AuthGuard } from "../../core/guard/auth.guard"; // adjust path if needed
import { DoctorViewComponent } from "src/app/features/dashboard/components/doctor-view/doctor-view.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DoctorViewComponent,
    data: { permissions: ["DOCTOR_DASHBOARD_VIEW"] }
  },
  {
    path: "appointments",
    component: AppointmentsComponent,
    data: { permissions: ["APPOINTMENT_READ"] }
  },
  {
    path: "doctors",
    component: DoctorsComponent,
    data: { permissions: ["DOCTOR_READ"] }
  },
  {
    path: "patients",
    component: PatientsComponent,
    data: { permissions: ["PATIENT_READ"] }
  },
  {
    path: "settings",
    component: SettingsComponent,
    data: { permissions: ["DOCTOR_SETTINGS_MANAGE"] }
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorRoutingModule {}

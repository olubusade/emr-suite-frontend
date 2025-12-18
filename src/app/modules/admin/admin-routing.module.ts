import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("../../features/dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "role-and-permission",
    loadChildren: () =>
      import("./role-and-permission-management/role-and-permission-management.module").then((m) => m.RoleAndPermissionManagementModule),
  },
  {
    path: "staff",
    loadChildren: () =>
      import("../../features/personnel/components/staff.module").then((m) => m.StaffModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { RoleAndPermissionManagementComponent } from './role-and-permission-management/role-and-permission-management.component';
import { CoreModule } from "src/app/core/core.module";

@NgModule({
  declarations: [
  ],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}

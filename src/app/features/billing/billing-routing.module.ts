import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


import { BillListComponent } from "./bill-list/bill-list.component";
import { InvoiceComponent } from "./invoice/invoice.component";
import { Page404Component } from "../../modules/authentication/page404/page404.component";
import { Role } from "src/app/core/domain/enum/role.enum";
import { AuthGuard } from "src/app/core/guard/auth.guard";


const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    data: {
      roles: [Role.SuperAdmin, Role.Admin, Role.Receptionist]
     },
    children:[
      {
        path: "all",
        component: BillListComponent,
        data: { permissions: ['BILL_READ'] },
      },
      {
        path: "invoice",
        component: InvoiceComponent,
        data: { permissions: ['BILL_CREATE'] },
      },
      { path: "**", component: Page404Component },
    ]
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}

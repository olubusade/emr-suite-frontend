import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { MaterialModule } from "./material.module";
import { FeatherIconsModule } from "./components/feather-icons/feather-icons.module";
import { HasPermissionDirective } from "../core/directives/has-permission.directive";

const SHARED_COMPONENTS_AND_DIRECTIVES = [
  HasPermissionDirective
];
@NgModule({
  declarations: [...SHARED_COMPONENTS_AND_DIRECTIVES],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    NgbModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    MaterialModule,
    FeatherIconsModule,
    HasPermissionDirective
  ],
})
export class SharedModule {}

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Directive({ selector: '[appHasPermission]' })
export class HasPermissionDirective implements OnInit {
  // Accept either a single key or multiple keys
  @Input('appHasPermission') requiredPermissions: string | string[] = [];

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const required = Array.isArray(this.requiredPermissions)
      ? this.requiredPermissions
      : [this.requiredPermissions];

    const hasPermission = required.some(pKey =>
      this.authService.hasPermission(pKey)  // this should check by key
    );

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

/* <!-- Only users with APPOINTMENT_EDIT see this -->
<button *appHasPermission="'APPOINTMENT_EDIT'">Edit Appointment</button>

<!-- Only Admins or Doctors see this -->
<div *appHasRole="['Admin','Doctor']">
  Special doctor tools here
</div>
 */
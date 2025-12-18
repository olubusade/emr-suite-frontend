import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') roles: string[] = [];

  constructor(private authService: AuthService, private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  ngOnInit() { this.updateView(); }

  private updateView() {
    const hasRole = this.roles.some(r => this.authService.hasRole(r));
    if (hasRole) this.viewContainer.createEmbeddedView(this.templateRef);
    else this.viewContainer.clear();
  }
}

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AddStaffFormComponent } from "./add-form.component";
describe("AddStaffFormComponent", () => {
  let component: AddStaffFormComponent;
  let fixture: ComponentFixture<AddStaffFormComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddStaffFormComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(AddStaffFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

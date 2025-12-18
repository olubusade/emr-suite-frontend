import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientService } from "../data/services/patient.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { IPatientCreateDTO } from "../data/interfaces/patient.interface";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from "src/app/shared/components/dialogs/confirm-dialog/confirm-dialog.component";


@Component({
  selector: "app-add-patient",
  templateUrl: "./add-patient.component.html",
  styleUrls: ["./add-patient.component.sass"],
})
export class AddPatientComponent implements OnInit {
  patientForm: FormGroup;

  countries: string[] = [
    'Nigeria',
    'Ghana',
    'South Africa',
    'United Kingdom',
    'United States',
    'Canada',
    'Other'
  ];
  nigerianStates: string[] = [
    'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
    'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu',
    'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
    'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
    'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT'
  ];

  maxDobDate = new Date();
  constructor(private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog 
  ) {


    this.patientForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.pattern("[a-zA-Z]+")]],
      lastName: ["", [Validators.required, Validators.pattern("[a-zA-Z]+")]],
      gender: ["", [Validators.required]],
      phone: [""],
      dob: ["", [Validators.required]],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      maritalStatus: ['', Validators.required],
      address: [""],

       nationality: ['', Validators.required],
      stateOfOrigin: ['', Validators.required],
      occupation: [''],

      bloodGroup: ['', Validators.required],
      genotype: ['', Validators.required],

      emergencyContactName: ['', Validators.required],
      emergencyRelationship: ['', Validators.required],
      emergencyContactPhone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
      this.patientForm.get('nationality')?.valueChanges.subscribe(value => {
        if (value !== 'Nigeria') {
          this.patientForm.get('stateOfOrigin')?.reset();
        }
      });

  }
  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }
    // Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Patient Registration',
        message: 'Are you sure you want to register this patient?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          const formValue = this.patientForm.value;
          // 🔹 Normalize payload for backend
          const payload: IPatientCreateDTO = {
            firstName: formValue.firstName.trim(),
            lastName: formValue.lastName.trim(),
            gender: formValue.gender,
            phone: formValue.phone?.toString(),
            dob: formValue.dob,
            email: formValue.email.toLowerCase(),
            maritalStatus: formValue.maritalStatus,
            address: formValue.address,

            nationality: formValue.nationality,
            stateOfOrigin:
              formValue.nationality === 'Nigeria'
                ? formValue.stateOfOrigin
                : null,

            occupation: formValue.occupation,

            bloodGroup: formValue.bloodGroup,
            genotype: formValue.genotype,
            emergencyContactName: formValue.emergencyContactName,
            emergencyContactPhone: formValue.emergencyContactPhone,
            emergencyRelationship: formValue.emergencyRelationship,
          };

          //Call API
          this.patientService.createPatient(payload).subscribe({
            next: (patient) => {
              this.snackBar.open(
                'Patient registered successfully',
                'Close',
                { duration: 3000, panelClass: 'snackbar-success' }
              );

              // Optional: reset form
              this.patientForm.reset();

              // Optional: redirect to patient list
              this.router.navigate(['/patients']);
            },
            error: (error) => {
              console.error('Create patient failed', error);

              this.snackBar.open(
                'Failed to register patient. Please try again.',
                'Close',
                { duration: 4000, panelClass: 'snackbar-danger' }
              );
            },
          });
      
      }
      // else: user canceled, do nothing
    });
  
  }

}

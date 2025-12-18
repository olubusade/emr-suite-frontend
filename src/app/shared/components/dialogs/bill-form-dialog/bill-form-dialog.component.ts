import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { BillList } from "src/app/features/billing/bill-list/bill-list.model";
import { BillListService } from "src/app/features/billing/bill-list/bill-list.service";

@Component({
  selector: 'app-bill-form-dialog',
  templateUrl: './bill-form-dialog.component.html',
  styleUrls: ['./bill-form-dialog.component.sass']
})
export class BillFormDialogComponent {
  action: string;
  dialogTitle: string;
  billListForm: FormGroup;
  billList: BillList;
  constructor(
    public dialogRef: MatDialogRef<BillFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public billListService: BillListService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.billList.pName;
      this.billList = data.billList;
    } else {
      this.dialogTitle = "New BillList";
      this.billList = new BillList({});
    }
    this.billListForm = this.createContactForm();
  }
  formControl = new FormControl("", [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      id: [this.billList.id],
      img: [this.billList.img],
      pName: [this.billList.pName],
      admissionID: [this.billList.admissionID],
      dName: [this.billList.dName],
      status: [this.billList.status],
      date: [this.billList.date],
      dDate: [this.billList.date],
      tax: [this.billList.tax],
      discount: [this.billList.discount],
      pStatus: ['Unpaid'],
      total: [this.billList.total],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.billListService.addBillList(this.billListForm.getRawValue());
  }
}

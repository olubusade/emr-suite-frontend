import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SelectionModel } from "@angular/cdk/collections";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { PatientService } from "./patient.service";
import { Patient } from "./patient.model";

@Component({
  selector: "app-allpatients",
  templateUrl: "./allpatients.component.html",
  styleUrls: ["./allpatients.component.sass"],
})
export class AllpatientsComponent implements OnInit {
  displayedColumns = [
    "select",
    "img",
    "name",
    "gender",
    "address",
    "mobile",
    "date",
    "bGroup",
    "treatment",
    "actions",
  ];

  dataSource: PatientDataSource;
  selection = new SelectionModel<Patient>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  
  isTblLoading: boolean = false;
  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Fetch patients from API
    this.patientService.getAllPatients();

    // Initialize data source
    this.dataSource = new PatientDataSource(
      this.patientService,
      this.paginator,
      this.sort
    );

    // Filter subscription
    fromEvent(this.filter.nativeElement, "keyup").subscribe(() => {
      if (!this.dataSource) return;
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  refresh(): void {
    this.patientService.getAllPatients();
  }

  addNew(): void {
    this.router.navigateByUrl("/patients/add");
  }

  editPatient(row: Patient): void {
    // Navigate to edit page or open dialog
    this.router.navigateByUrl(`/patients/edit/${row.id}`);
  }


  /** Selection helpers */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }


}

/** DataSource for MatTable */
export class PatientDataSource extends DataSource<Patient> {
  filterChange = new BehaviorSubject<string>("");
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: Patient[] = [];
  renderedData: Patient[] = [];

  constructor(
    private patientService: PatientService,
    private paginator: MatPaginator,
    private sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<Patient[]> {
    const displayChanges = [
      this.patientService.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];

    return merge(...displayChanges).pipe(
      map(() => {
        // Filter
        this.filteredData = this.patientService.data.slice().filter((p) => {
          const searchStr = (
            p.name +
            p.gender +
            p.address +
            p.date +
            p.bGroup +
            p.treatment +
            p.mobile
          ).toLowerCase();
          return searchStr.includes(this.filter.toLowerCase());
        });

        // Sort
        const sortedData = this.sortData(this.filteredData.slice());

        // Paginate
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);

        return this.renderedData;
      })
    );
  }

  disconnect(): void {}

  private sortData(data: Patient[]): Patient[] {
    if (!this.sort.active || this.sort.direction === "") return data;

    return data.sort((a, b) => {
      let valueA: string | number = "";
      let valueB: string | number = "";

      switch (this.sort.active) {
        case "id":
          [valueA, valueB] = [a.id, b.id];
          break;
        case "name":
          [valueA, valueB] = [a.name, b.name];
          break;
        case "gender":
          [valueA, valueB] = [a.gender, b.gender];
          break;
        case "date":
          [valueA, valueB] = [a.date, b.date];
          break;
        case "address":
          [valueA, valueB] = [a.address, b.address];
          break;
        case "mobile":
          [valueA, valueB] = [a.mobile, b.mobile];
          break;
        default:
          break;
      }

      const valA = isNaN(+valueA) ? valueA : +valueA;
      const valB = isNaN(+valueB) ? valueB : +valueB;

      return (valA < valB ? -1 : 1) * (this.sort.direction === "asc" ? 1 : -1);
    });
  }
}

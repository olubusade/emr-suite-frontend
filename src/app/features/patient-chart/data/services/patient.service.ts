// src/app/features/patient-chart/allpatients/patient.service.ts (REWRITTEN)

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service'; 

// 🔑 Assuming these types are correctly structured and available:

import { Patient } from '../models/patient.model';
import { PatientListItem, IPatientListResponse, IPatientResponse, IPatientCreateDTO, IPatientUpdateDTO, IPatientListParams } from '../interfaces/patient.interface';


@Injectable({ providedIn: 'root' })
export class PatientService extends BaseApiService {
    // 🔑 Use the base API URL instead of a static JSON file
    private baseUrl = `${environment.apiUrl}/patients`;
    public dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

    constructor(http: HttpClient) {
        super(http);
    }

    // -------------------- LIST/READ METHODS --------------------
    /** Fetch all patients from API */
    getAllPatients(): void {
      this.http.get<IPatientResponse[]>(this.baseUrl)
      .pipe(
        map(response => (response ?? []).map(Patient.fromApi))
      )
      .subscribe({
        next: patients => this.dataChange.next(patients),
        error: err => console.error('Failed to fetch patients', err)
      });
    }
    /**
     * Retrieves a paginated list of patients.
     * This replaces the old getAllPatients() method.
     */
    public listPatients(
        params: IPatientListParams = {}
        ): Observable<{ items: PatientListItem[]; page: number; pages: number; total: number }> {

        let httpParams = new HttpParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
            httpParams = httpParams.set(key, String(value));
            }
        });

        return this.get<IPatientResponse[]>(this.baseUrl, httpParams).pipe(
            map((response) => {
            const patients = response ?? [];

            return {
                page: 1,
                pages: 1,
                total: patients.length,
                items: patients.map(Patient.fromApiToListItem),
            };
            })
        );
    }

    /**
     * Retrieves a single patient by ID.
     */
    public getPatient(id: string): Observable<Patient> {
        return this.get<IPatientResponse>(`${this.baseUrl}/${id}`).pipe(
            map(Patient.fromApi) // Map raw response to the full Patient Model
        );
    }

    // -------------------- CRUD METHODS --------------------

    /**
     * Creates a new patient record (replaces addPatient).
     */
    public createPatient(data: IPatientCreateDTO): Observable<Patient> {
        return this.post<IPatientResponse>(this.baseUrl, data).pipe(
            map(Patient.fromApi)
        );
    }

    /**
     * Updates an existing patient record (replaces updatePatient).
     */
    public updatePatient(id: string, data: IPatientUpdateDTO): Observable<Patient> {
        return this.patch<IPatientResponse>(`${this.baseUrl}/${id}`, data).pipe( // Use PATCH for partial updates (best practice)
            map(Patient.fromApi)
        );
    }
    
    /**
     * Deactivates/Deletes a patient record (replaces deletePatient).
     */
    public deletePatient(id: string): Observable<void> {
        // Assuming your DELETE endpoint returns a void/successful response on success
        return this.delete<void>(`${this.baseUrl}/${id}`); 
    }
}

// clinical.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service'; 
import { IClinicalNoteListParams, IClinicalNoteListResponse, IClinicalNoteResponse, IClinicalNoteCreateDTO, IClinicalNoteUpdateDTO } from '../interfaces/clinical-note.interface';
import { ClinicalNote } from '../models/clinical-note.model';


@Injectable({ providedIn: 'root' })
export class ClinicalService extends BaseApiService {
    private endpoint = '/clinical'; 
    private apiUrl = `${environment.apiUrl}${this.endpoint}`;

    constructor(http: HttpClient) {
        super(http);
    }

    /**
     * Retrieves a list of clinical notes with optional filtering/pagination.
     */
    public listClinicalNotes(params: IClinicalNoteListParams = {}): Observable<{ items: ClinicalNote[]; page: number; pages: number; total: number }> {
        let httpParams = new HttpParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                httpParams = httpParams.set(key, String(value));
            }
        });
        
        return this.get<IClinicalNoteListResponse>(this.apiUrl, httpParams).pipe(
            map(response => {
                const listResponse = response as IClinicalNoteListResponse;

                return {
                    ...listResponse,
                    items: listResponse.items.map(ClinicalNote.fromApi)
                };
            })
        );
    }

    /**
     * Retrieves a single clinical note by ID.
     */
    public getClinicalNote(id: string): Observable<ClinicalNote> {
        return this.get<IClinicalNoteResponse>(`${this.apiUrl}/${id}`).pipe(
            map(ClinicalNote.fromApi)
        );
    }

    /**
     * Creates a new clinical note.
     */
    public createClinicalNote(data: IClinicalNoteCreateDTO): Observable<ClinicalNote> {
        return this.post<IClinicalNoteResponse>(this.apiUrl, data).pipe(
            map(ClinicalNote.fromApi)
        );
    }

    /**
     * Updates an existing clinical note (PATCH for partial update).
     */
    public updateClinicalNote(id: string, data: IClinicalNoteUpdateDTO): Observable<ClinicalNote> {
        return this.patch<IClinicalNoteResponse>(`${this.apiUrl}/${id}`, data).pipe(
            map(ClinicalNote.fromApi)
        );
    }

    /**
     * Deletes a clinical note.
     */
    public deleteClinicalNote(id: string): Observable<void> {
        return this.delete<void>(`${this.apiUrl}/${id}`); 
    }
}
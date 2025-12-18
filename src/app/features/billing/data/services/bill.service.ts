// bill.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service'; 
import { Bill } from '../models/bill.model';
import { 
    IBillResponse, 
    IBillCreateDTO, 
    IBillUpdateDTO, 
    IBillListResponse 
} from '../interfaces/bill.interface';
import { apiOperators } from 'src/app/core/utils/api-operators';

@Injectable({ providedIn: 'root' })
export class BillService extends BaseApiService {
    private baseUrl = `${environment.apiUrl}/bills`;

    constructor(http: HttpClient) {
        super(http);
    }

    /**
     * Retrieves a list of bills with optional filtering/pagination.
     */
    public listBills(params?: { patientId?: string; status?: string; page?: number; limit?: number }): Observable<{ items: Bill[]; page: number; pages: number; total: number }> {
        let httpParams = new HttpParams();
        
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    httpParams = httpParams.set(key, String(value));
                }
            });
        }
        
        return this.get<IBillListResponse>(this.baseUrl, httpParams).pipe(
            map(response => {
                const listResponse = response as IBillListResponse;

                return {
                    ...listResponse,
                    // 🔑 Map raw response objects to the Bill Model
                    items: listResponse.items.map(Bill.fromApi)
                };
            })
        );
    }

    /**
     * Retrieves a single bill by ID.
     */
    public getBill(id: string): Observable<Bill> {
        return this.get<IBillResponse>(`${this.baseUrl}/${id}`).pipe(
            map(Bill.fromApi)
        );
    }

    /**
     * Creates a new bill record.
     */
    public createBill(data: IBillCreateDTO): Observable<Bill> {
        return this.post<IBillResponse>(this.baseUrl, data).pipe(
            map(Bill.fromApi)
        );
    }

    /**
     * Updates an existing bill record (PATCH for partial update).
     */
    public updateBill(id: string, data: IBillUpdateDTO): Observable<Bill> {
        return this.patch<IBillResponse>(`${this.baseUrl}/${id}`, data).pipe(
            map(Bill.fromApi)
        );
    }

    /**
     * Deletes a bill record.
     */
    public deleteBill<T>(url: string, headers?: HttpHeaders): Observable<T> {
        return this.http.delete<T>(url, { headers, observe: 'body' }).pipe(
            apiOperators<T>() 
        );
    }
}
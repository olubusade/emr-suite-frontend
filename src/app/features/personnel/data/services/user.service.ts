// src/app/features/personnel/data/services/staff.service.ts (CORRECTED)

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service'; 
import { User } from '../models/user.model';
import { 
    IUserResponse, 
    IUserCreateDTO, 
    IUserUpdateDTO, 
    IUserListResponse, 
    IUserListParams 
} from '../interfaces/user.interface';
// REMOVED: Patient-related imports, they don't belong here.

@Injectable({ providedIn: 'root' })
export class StaffService extends BaseApiService {
    private baseUrl = `${environment.apiUrl}/users`; // Assuming '/users' endpoint

    constructor(http: HttpClient) {
        super(http);
    }
    
    // 🔑 ADDED: The core list method for this service
    /**
     * Retrieves a paginated list of users (staff).
     */
   public listUsers(
        params: IUserListParams = {}
        ): Observable<{ items: User[]; page: number; pages: number; total: number }> {
        let httpParams = new HttpParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
            httpParams = httpParams.set(key, String(value));
            }
        });

        return this.get<IUserResponse[]>(this.baseUrl + '/list_staff', httpParams).pipe(
            map((response) => {
            const users = response ?? [];

            return {
                items: users.map(User.fromApi),
                page: 1,
                pages: 1,
                total: users.length,
            };
            })
        );
    }


    /**
     * Retrieves a single user by ID.
     */
    public getUser(id: string): Observable<User> {
        return this.get<IUserResponse>(`${this.baseUrl}/${id}`).pipe(
            map(User.fromApi)
        );
    }

    // ... (createUser, updateUser, deactivateUser methods remain unchanged) ...
    public createUser(data: IUserCreateDTO): Observable<User> { /* ... */ return null as any; } // Simplified for brevity
    public updateUser(id: string, data: IUserUpdateDTO): Observable<User> { /* ... */ return null as any; } // Simplified for brevity
    public deactivateUser(id: string): Observable<void> { /* ... */ return null as any; } // Simplified for brevity
}
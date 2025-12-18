
// 1. The structure returned by the API (READ/RESPONSE)
export interface IUserResponse {
    id: string;
    fName: string;
    lName: string;
    fullName: string;
    email: string;
    designation?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    // Assuming roles are eagerly loaded for display
    roles?: { id: string; name: string; key: string }[];
}

// 2. DTO for creating a new User (CREATE/REQUEST)
// password is required for creation
export interface IUserCreateDTO {
    fName: string;
    lName: string;
    fullName: string;
    email: string;
    password: string; // Plain password for hashing on backend
    designation?: string;
    // Optional: for role assignment during creation
    roleIds?: string[]; 
}

// 3. DTO for updating an existing User (UPDATE/REQUEST)
// Allows partial updates, excludes UUID, passwordHash, and creation dates
export interface IUserUpdateDTO {
    fName?: string;
    lName?: string;
    fullName?: string;
    email?: string;
    designation?: string;
    active?: boolean;
    // Note: Password update should use a separate endpoint/DTO for security
}

// 4. Utility interface for paginated list response
export interface IUserListResponse {
    items: IUserResponse[];
    page: number;
    pages: number;
    total: number;
}

// 5. Params for filtering users (if needed)
export interface IUserListParams {
    search?: string;
    active?: boolean;
    roleKey?: string;
    page?: number;
    limit?: number;
}
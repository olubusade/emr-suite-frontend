// bill.interface.ts

// Type for the currency amount (string representation of DECIMAL(10, 2))
type CurrencyAmount = string;

// 1. The structure returned by the API (READ/RESPONSE)
export interface IBillResponse {
    id: string;
    patientId: string;
    amount: CurrencyAmount;
    status: 'unpaid' | 'pending' | 'partially_paid' | 'paid' | 'cancelled';
    dueDate?: string; // DATEONLY (e.g., "2024-10-25")
    paymentMethod?: 'cash' | 'card' | 'insurance' | 'transfer';
    notes?: string;
    createdBy: string; // UUID of the staff member who created the bill
    createdAt: string;
    updatedAt: string;
    
    // Optional: Include related entities if joined by the backend
    patient?: { firstName: string; lastName: string };
}

// 2. DTO for creating a new Bill (CREATE/REQUEST)
export interface IBillCreateDTO {
    patientId: string;
    amount: CurrencyAmount;
    dueDate?: string;
    // createdBy is often auto-injected by the backend middleware from the auth token, 
    // but included here if the frontend needs to specify it.
    createdBy: string; 
    notes?: string;
}

// 3. DTO for updating an existing Bill (UPDATE/REQUEST)
// Allows updating status, amount, due date, payment method, and notes.
export interface IBillUpdateDTO {
    amount?: CurrencyAmount;
    status?: 'unpaid' | 'pending' | 'partially_paid' | 'paid' | 'cancelled';
    dueDate?: string;
    paymentMethod?: 'cash' | 'card' | 'insurance' | 'transfer';
    notes?: string;
}

// Utility interface for paginated list response from the API
export interface IBillListResponse {
    items: IBillResponse[];
    page: number;
    pages: number;
    total: number;
}
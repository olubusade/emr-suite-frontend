// Bill.model.ts

import { IBillResponse } from '../interfaces/bill.interface';

/**
 * Class representing the Bill entity (The rich Domain Model).
 */
export class Bill {
    // Required fields
    public id!: string;
    public patientId!: string;
    public amount!: number; // Transformed from string to number
    public status!: 'unpaid' | 'pending' | 'partially_paid' | 'paid' | 'cancelled';
    public createdBy!: string;

    // Optional fields
    public dueDate?: Date; // Transformed from DATEONLY string to Date object
    public paymentMethod?: 'cash' | 'card' | 'insurance' | 'transfer';
    public notes?: string;
    public patient?: { firstName: string; lastName: string };

    // Transformed fields (Date objects)
    public createdAt!: Date;
    public updatedAt!: Date;

    // Private constructor to enforce use of static factory methods
    private constructor(data: IBillResponse) {
        Object.assign(this, data);

        // 🔑 Transformation: Convert amount string (DECIMAL) to number
        this.amount = parseFloat(data.amount);
        
        // 🔑 Transformation: Convert date strings to Date objects
        if (data.dueDate) {
             this.dueDate = new Date(data.dueDate);
        }
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }

    /**
     * Static Factory Method: Ensures all Bill instances are created cleanly from API data.
     */
    public static fromApi(data: IBillResponse): Bill {
        return new Bill(data);
    }

    /**
     * Utility: Checks if the bill is considered outstanding (not paid or cancelled).
     */
    public get isOutstanding(): boolean {
        return ['unpaid', 'pending', 'partially_paid'].includes(this.status);
    }

    /**
     * Utility: Checks if the due date has passed for outstanding bills.
     */
    public get isOverdue(): boolean {
        return this.isOutstanding && !!this.dueDate && this.dueDate < new Date();
    }
}
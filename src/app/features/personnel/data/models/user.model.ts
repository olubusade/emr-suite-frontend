import { IUserResponse } from "../interfaces/user.interface";


/**
 * Class representing the User entity (The rich Domain Model).
 */
export class User {
    // Core properties
    public id!: string;
    public fName!: string;
    public lName!: string;
    public fullName!: string;
    public email!: string;
    public active!: boolean;
    public designation?: string;

    // Relational data (simplified to names/keys)
    public roles!: { id: string; name: string; key: string }[];

    // Transformed fields (Date objects)
    public createdAt!: Date;
    public updatedAt!: Date;

    private constructor(data: IUserResponse) {
        Object.assign(this, data);
        
        // Ensure roles is initialized, even if empty from API
        this.roles = data.roles || [];

        // 🔑 Transformation: Convert string timestamps to Date objects
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }

    /**
     * Static Factory Method: Ensures all User instances are created cleanly from API data.
     */
    public static fromApi(data: IUserResponse): User {
        return new User(data);
    }

    /**
     * Utility: Gets the primary role name for display.
     */
    public get primaryRoleName(): string {
        return this.roles.length > 0 ? this.roles[0].name : 'Unassigned';
    }

    /**
     * Utility: Checks if the user has a specific role key.
     */
    public hasRole(key: string): boolean {
        return this.roles.some(role => role.key === key);
    }
}
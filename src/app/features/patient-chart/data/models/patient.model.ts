import { IPatientResponse, PatientListItem } from "../interfaces/patient.interface";


// NOTE: This class is often used as the 'Patient' type itself.
export class Patient {
    // 🔑 Core Patient Properties (matching IPatientResponse, but cleaned up/typed)
    public readonly id: string;
    public readonly fullName: string;
    public readonly email: string;
    public readonly phone: string | null;
    public readonly dob: Date; // Converted from string to Date object
    public readonly gender: string;
    public readonly status: string;
    public readonly createdAt: Date; // Converted from string to Date object
    
    // Detailed Properties
    public readonly nationalId: string | null;
    public readonly address: string | null;
    public readonly bloodGroup: string | null;
    public readonly genotype: string | null;
    public readonly emergencyContact: { name: string | null; phone: string | null; relationship: string | null; };
    
    // ... potentially other properties from IPatientResponse ...

    // 🔑 Private constructor forces instantiation via static factory methods
    private constructor(data: IPatientResponse) {
        this.id = data.id;
        this.fullName = data.fullName;
        this.email = data.email;
        this.phone = data.phone || null;
        
        // Data Transformation: Convert string dates/DOB into Date objects
        this.dob = new Date(data.dob); 
        this.createdAt = new Date(data.createdAt);
        
        this.gender = data.gender;
        this.status = data.status;
        this.address = data.address || null;
        this.nationalId = data.nationalId || null;
        this.bloodGroup = data.bloodGroup || null;
        this.genotype = data.genotype || null;
        
        this.emergencyContact = {
            name: data.emergencyContactName || null,
            phone: data.emergencyContactPhone || null,
            relationship: data.emergencyRelationship || null,
        };
    }

    /**
     * 1. Factory method to create a full Patient model instance from a raw API response.
     */
    public static fromApi(response: IPatientResponse): Patient {
        return new Patient(response);
    }

    /**
     * 2. Factory method to create a simplified PatientListItem for tables/dashboards.
     * This is used specifically by the PatientService's listPatients method.
     */
    public static fromApiToListItem(response: IPatientResponse): PatientListItem {
        // NOTE: This assumes PatientListItem is a simple interface defining only the fields you need for the list
        return {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            dob: response.dob, // Keep as string for dashboard display efficiency
            createdAt: response.createdAt,
            // Include other list-specific fields here (e.g., status, phone)
        } as PatientListItem; 
    }

    // 🔑 Example of a client-side helper method
    public get age(): number {
        const today = new Date();
        const birthDate = this.dob;
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
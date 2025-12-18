import { MonthlyTrend } from "./monthly-trend.interface";

// Define the full response structure (the raw API shape after unwrapping)
export interface IMetricsDataResponse {
  patientCount: number;
  userCount: number;
  revenue: number;
  revenuePending: number;
  totalAppointments: number;
  monthlyPatientTrend: MonthlyTrend[];
  prometheusMetrics: string; 
}

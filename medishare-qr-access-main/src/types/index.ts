
export interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  hospital: string;
  date: string;
  fileUrl: string;
  thumbnailUrl?: string;
  selected?: boolean;
}

export interface SessionToken {
  recordIds: string[];
  patientId: string;
  expiryTime: number;
  accessType: "read-only" | "full";
}

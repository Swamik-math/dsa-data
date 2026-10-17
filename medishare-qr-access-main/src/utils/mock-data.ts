
import { MedicalRecord, SessionToken } from "@/types";

export const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: "rec-001",
    title: "Complete Blood Count (CBC)",
    type: "Lab Report",
    hospital: "Apollo Hospitals",
    date: "2023-12-15",
    fileUrl: "/mock-reports/cbc.pdf",
    thumbnailUrl: "/mock-reports/thumbnails/cbc.jpg",
  },
  {
    id: "rec-002",
    title: "X-Ray Chest PA View",
    type: "Radiology",
    hospital: "AIIMS Delhi",
    date: "2023-11-03",
    fileUrl: "/mock-reports/xray.pdf",
    thumbnailUrl: "/mock-reports/thumbnails/xray.jpg",
  },
  {
    id: "rec-003",
    title: "Lipid Profile Test",
    type: "Lab Report",
    hospital: "Fortis Healthcare",
    date: "2024-01-22",
    fileUrl: "/mock-reports/lipid.pdf",
    thumbnailUrl: "/mock-reports/thumbnails/lipid.jpg",
  },
  {
    id: "rec-004",
    title: "ECG Report",
    type: "Cardiology",
    hospital: "Max Super Speciality Hospital",
    date: "2024-02-10",
    fileUrl: "/mock-reports/ecg.pdf",
    thumbnailUrl: "/mock-reports/thumbnails/ecg.jpg",
  },
  {
    id: "rec-005",
    title: "MRI Scan - Lumbar Spine",
    type: "Radiology",
    hospital: "Manipal Hospitals",
    date: "2023-09-18",
    fileUrl: "/mock-reports/mri.pdf",
    thumbnailUrl: "/mock-reports/thumbnails/mri.jpg",
  },
  {
    id: "rec-006",
    title: "COVID-19 RT-PCR Test",
    type: "Pathology",
    hospital: "SRL Diagnostics",
    date: "2024-03-01",
    fileUrl: "/mock-reports/covid.pdf",
    thumbnailUrl: "/mock-reports/thumbnails/covid.jpg",
  }
];

export const MOCK_PATIENT = {
  id: "pat-001",
  name: "Rahul Sharma",
  dob: "1985-06-15",
  gender: "Male",
  aadhaarLast4: "6235",
  mobileNumber: "******7890"
};

export function generateMockToken(recordIds: string[]): string {
  // In a real app, this would be a JWT or other secure token
  return btoa(JSON.stringify({
    recordIds,
    patientId: MOCK_PATIENT.id,
    expiryTime: Date.now() + 15 * 60 * 1000, // 15 minutes from now
    accessType: "read-only"
  }));
}

export function parseMockToken(token: string): SessionToken | null {
  try {
    return JSON.parse(atob(token));
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token: SessionToken): boolean {
  return Date.now() > token.expiryTime;
}

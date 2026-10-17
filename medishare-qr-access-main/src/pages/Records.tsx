
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { RecordCard } from "@/components/RecordCard";
import { QrCodeGenerator } from "@/components/QrCodeGenerator";
import { Button } from "@/components/ui/button";
import { MedicalRecord } from "@/types";
import { MOCK_MEDICAL_RECORDS, MOCK_PATIENT } from "@/utils/mock-data";
import { Check, Filter, QrCode, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Records() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Fetch records from "DigiLocker"
  useEffect(() => {
    // Simulate API call to DigiLocker
    setTimeout(() => {
      setRecords(MOCK_MEDICAL_RECORDS);
      setLoading(false);
    }, 1000);
  }, []);
  
  const toggleRecordSelection = (id: string) => {
    setSelectedRecordIds(prev => 
      prev.includes(id) ? prev.filter(recordId => recordId !== id) : [...prev, id]
    );
  };
  
  const handleLogout = () => {
    navigate("/");
  };
  
  const handleGenerateQR = () => {
    setIsGeneratingQR(true);
  };
  
  const handleBackFromQR = () => {
    setIsGeneratingQR(false);
  };

  if (isGeneratingQR) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-medishare-50 to-white">
        <header className="container mx-auto p-4 flex justify-between items-center">
          <Logo />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <QrCodeGenerator 
            selectedRecordIds={selectedRecordIds}
            onBack={handleBackFromQR}
          />
        </main>
        
        <footer className="p-4 text-center text-xs text-gray-500">
          <p>© 2025 MediShare. Powered by DigiLocker API integration.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-medishare-50 to-white">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <Logo />
        <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Medical Records</h1>
            <p className="text-muted-foreground">
              Select records to share via secure QR code
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center text-sm gap-1">
              <span className="text-muted-foreground">Logged in as:</span>
              <span className="font-medium">{MOCK_PATIENT.name}</span>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button 
              onClick={handleGenerateQR} 
              disabled={selectedRecordIds.length === 0}
              className="bg-medishare-600 hover:bg-medishare-700 flex items-center gap-1"
            >
              <QrCode className="h-4 w-4" />
              Generate QR
            </Button>
          </div>
        </div>
        
        {selectedRecordIds.length > 0 && (
          <div className="bg-medishare-50 rounded-lg p-3 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-medishare-600 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">{selectedRecordIds.length} records selected</span>
            </div>
            <Button 
              variant="link" 
              onClick={() => setSelectedRecordIds([])}
              className="text-medishare-700"
              size="sm"
            >
              Clear Selection
            </Button>
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg"></div>
                <div className="h-24 bg-muted rounded-b-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {records.map(record => (
              <RecordCard 
                key={record.id} 
                record={record} 
                selected={selectedRecordIds.includes(record.id)}
                onToggleSelect={toggleRecordSelection}
              />
            ))}
          </div>
        )}
      </main>
      
      <footer className="p-4 text-center text-xs text-gray-500">
        <p>© 2025 MediShare. Powered by DigiLocker API integration.</p>
      </footer>
    </div>
  );
}

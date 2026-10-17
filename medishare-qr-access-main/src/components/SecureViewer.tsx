
import { useState, useEffect } from "react";
import { MedicalRecord, SessionToken } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { parseMockToken, isTokenExpired, MOCK_MEDICAL_RECORDS, MOCK_PATIENT } from "@/utils/mock-data";
import { format } from "date-fns";
import { AlertTriangle, Clock, FileText, Lock, ShieldCheck } from "lucide-react";

interface SecureViewerProps {
  token: string;
}

export function SecureViewer({ token }: SecureViewerProps) {
  const [parsedToken, setParsedToken] = useState<SessionToken | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState("overview");

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Parse and validate token
    const decoded = parseMockToken(token);
    if (!decoded) {
      setExpired(true);
      setLoading(false);
      return;
    }
    
    setParsedToken(decoded);
    
    // Check if token is expired
    if (isTokenExpired(decoded)) {
      setExpired(true);
      setLoading(false);
      return;
    }
    
    // Calculate time left
    const timeRemaining = Math.floor((decoded.expiryTime - Date.now()) / 1000);
    setTimeLeft(timeRemaining > 0 ? timeRemaining : 0);
    
    // Fetch records using token recordIds
    // In a real app, this would make an API call to fetch the selected records
    const selectedRecords = MOCK_MEDICAL_RECORDS.filter(record => 
      decoded.recordIds.includes(record.id)
    );
    
    // Simulate loading
    setTimeout(() => {
      setRecords(selectedRecords);
      setLoading(false);
    }, 800);
  }, [token]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setExpired(true);
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex justify-center gap-2 items-center">
            <ShieldCheck className="h-6 w-6 text-medical-600" />
            Secure Medical Records Viewer
          </CardTitle>
          <CardDescription>Verifying access and loading records...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-pulse space-y-8 w-full">
            <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="space-y-3">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (expired) {
    return (
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex justify-center gap-2 items-center text-red-600">
            <Lock className="h-6 w-6" />
            Access Expired
          </CardTitle>
          <CardDescription>
            This secure link has expired or is invalid. Please ask the patient to generate a new access code.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Alert variant="destructive" className="w-full max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Expired Access</AlertTitle>
            <AlertDescription>
              For security reasons, temporary access to medical records expires after 15 minutes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-medical-600" />
              Secure Medical Records
            </CardTitle>
            <CardDescription>
              Temporary access provided by patient
            </CardDescription>
          </div>
          <Alert variant={timeLeft <= 60 ? "destructive" : "default"} className="max-w-[180px] py-1">
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Expires in: <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </AlertDescription>
          </Alert>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="font-medium">{MOCK_PATIENT.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{format(new Date(MOCK_PATIENT.dob), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{MOCK_PATIENT.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aadhaar (Last 4)</p>
              <p className="font-medium">XXXX-XXXX-{MOCK_PATIENT.aadhaarLast4}</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <h3 className="font-medium text-lg">Shared Medical Records ({records.length})</h3>
            <div className="space-y-3">
              {records.map((record) => (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setCurrentTab("details")}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-medishare-100 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-medishare-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{record.title}</h4>
                      <p className="text-sm text-muted-foreground">{record.hospital} • {format(new Date(record.date), "PP")}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    record.type === "Lab Report" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                    record.type === "Radiology" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                    record.type === "Cardiology" ? "bg-red-100 text-red-800 hover:bg-red-100" : 
                    "bg-gray-100 hover:bg-gray-100"
                  }>
                    {record.type}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-6">
              {records.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <div className="bg-medishare-600 text-white px-4 py-2 flex justify-between items-center">
                    <h4 className="font-medium">{record.title}</h4>
                    <Badge variant="secondary" className="bg-white text-medishare-800">
                      {record.type}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Hospital/Lab</p>
                        <p className="font-medium">{record.hospital}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{format(new Date(record.date), "PPP")}</p>
                      </div>
                    </div>
                    
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {record.thumbnailUrl ? (
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${record.thumbnailUrl})` }} />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground mt-2">Report preview not available</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        View Full Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-start">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentTab("overview")}
                className="flex items-center gap-2"
              >
                Back to Overview
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

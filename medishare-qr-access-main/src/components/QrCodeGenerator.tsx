import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, RefreshCw, Copy, ArrowLeft, Shield } from "lucide-react";
import { generateMockToken } from "@/utils/mock-data";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QrCodeGeneratorProps {
  selectedRecordIds: string[];
  onBack: () => void;
  baseUrl?: string;
}

export function QrCodeGenerator({ selectedRecordIds, onBack, baseUrl = window.location.origin }: QrCodeGeneratorProps) {
  const [token, setToken] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 minutes in seconds
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (selectedRecordIds.length > 0) {
      const token = generateMockToken(selectedRecordIds);
      setToken(token);
    }
  }, [selectedRecordIds]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const regenerateToken = () => {
    const newToken = generateMockToken(selectedRecordIds);
    setToken(newToken);
    setTimeLeft(15 * 60);
    setCopied(false);
  };

  const copyAccessUrl = () => {
    const accessUrl = `${baseUrl}/secure-view/${token}`;
    navigator.clipboard.writeText(accessUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewAsHospital = () => {
    navigate(`/secure-view/${token}`);
  };

  const qrValue = `${baseUrl}/secure-view/${token}`;

  return (
    <Card className="w-full max-w-md glass-morphism backdrop-blur-xl shadow-premium">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-medishare-600" />
          <CardTitle className="text-2xl font-bold text-gradient">Share Medical Records</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Scan this QR code to instantly share your selected medical records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-inner">
          <QRCode 
            value={qrValue} 
            size={220} 
            level="H" 
            includeMargin={true} 
            renderAs="svg"
            bgColor="#FFFFFF"
            fgColor="#0179CC"
          />
        </div>
        
        <Alert variant="default" className={cn(
          "border transition-all duration-300 glass-effect",
          timeLeft <= 60 ? "border-red-500" : "border-amber-400"
        )}>
          <Clock className={timeLeft <= 60 ? "h-4 w-4 text-red-500" : "h-4 w-4 text-amber-500"} />
          <AlertDescription className="flex justify-between items-center">
            <span>Access expires in:</span> 
            <span className={`font-mono font-bold ${timeLeft <= 60 ? "text-red-500" : "text-amber-500"}`}>
              {formatTime(timeLeft)}
            </span>
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button 
            variant="outline" 
            onClick={regenerateToken}
            className="premium-button flex items-center gap-2 border-medishare-200 hover:bg-medishare-50"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Timer
          </Button>
          <Button 
            variant="outline"
            onClick={copyAccessUrl}
            className="premium-button flex items-center gap-2 border-medishare-200 hover:bg-medishare-50"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-2">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Records
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full premium-button bg-gradient-to-r from-medical-600 to-medical-700 hover:from-medical-700 hover:to-medical-800 text-white"
          onClick={viewAsHospital}
        >
          Demo: View as Hospital
        </Button>
      </CardFooter>
    </Card>
  );
}

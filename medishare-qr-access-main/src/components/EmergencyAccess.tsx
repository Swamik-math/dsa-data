
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function EmergencyAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleEmergencyAccess = () => {
    // In a real app, this would create a special emergency access token
    // For the demo, we'll just redirect to the login page
    setIsOpen(false);
    navigate("/login");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1 shadow-md">
          <AlertTriangle className="h-4 w-4" />
          Emergency Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Emergency Medical Access
          </DialogTitle>
          <DialogDescription>
            This feature is designed for critical medical situations where immediate access to your medical records is needed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Emergency Mode</AlertTitle>
            <AlertDescription>
              This will create a time-limited emergency access link that allows authorized medical professionals to view your critical records.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Before proceeding, confirm that:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>This is a genuine medical emergency</li>
              <li>You are at a hospital or with medical professionals</li>
              <li>You have your Aadhaar or ABHA ID available</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            variant="destructive"
            onClick={handleEmergencyAccess}
            className="gap-1"
          >
            Proceed to Emergency Access
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

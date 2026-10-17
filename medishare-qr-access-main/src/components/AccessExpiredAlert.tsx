
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock } from "lucide-react";

export function AccessExpiredAlert() {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <Lock className="h-4 w-4" />
      <AlertTitle>Access Expired</AlertTitle>
      <AlertDescription>
        For security reasons, temporary access to medical records expires after 15 minutes.
        Please ask the patient to generate a new QR code.
      </AlertDescription>
    </Alert>
  );
}

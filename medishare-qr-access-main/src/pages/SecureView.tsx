
import { useParams } from "react-router-dom";
import { SecureViewer } from "@/components/SecureViewer";
import { Logo } from "@/components/Logo";
import { ShieldCheck } from "lucide-react";

export default function SecureView() {
  const { token } = useParams<{ token: string }>();
  
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Invalid Access</h1>
          <p>No secure token provided. Please scan a valid QR code.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-medical-50 to-white">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <Logo />
        <div className="text-xs text-medical-600 font-medium flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Hospital Secure View
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 flex justify-center">
        <SecureViewer token={token} />
      </main>
      
      <footer className="p-4 text-center text-xs text-gray-500">
        <p>© 2025 MediShare. This is a secure temporary view of patient records.</p>
      </footer>
    </div>
  );
}

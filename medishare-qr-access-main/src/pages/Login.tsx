
import { Logo } from "@/components/Logo";
import { AadhaarLoginForm } from "@/components/AadhaarLoginForm";
import { Shield } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-medishare-50 to-white">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <Logo />
        <div className="text-xs text-medishare-600 font-medium flex items-center gap-1">
          <Shield className="h-3 w-3" />
          DigiLocker Secured
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">MediShare QR Access</h1>
            <p className="mt-2 text-gray-600">
              Instant, secure medical records sharing for emergencies and hospital visits
            </p>
          </div>
          
          <AadhaarLoginForm />
          
          <div className="text-center text-sm text-gray-500">
            <p>Securely access and share your DigiLocker medical records</p>
            <p className="mt-1">No data is stored. We only facilitate secure sharing.</p>
          </div>
        </div>
      </main>
      
      <footer className="p-4 text-center text-xs text-gray-500">
        <p>© 2025 MediShare. Powered by DigiLocker API integration.</p>
      </footer>
    </div>
  );
}

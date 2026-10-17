import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { EmergencyAccess } from "@/components/EmergencyAccess";
import { QrCode, ShieldCheck, Clock, Hospital, ArrowRight, Lock, FileCheck, Shield } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-medishare-50 to-white">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-2">
          <EmergencyAccess />
          <Button onClick={() => navigate("/login")} className="bg-medishare-600 hover:bg-medishare-700">
            Login
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-medishare-900">
              Medical Records at Your Fingertips
            </h1>
            <p className="text-xl text-gray-600">
              Instantly and securely share your medical history with healthcare providers through a simple QR code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => navigate("/login")}
                size="lg"
                className="bg-medishare-600 hover:bg-medishare-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-square rounded-2xl overflow-hidden border-8 border-white shadow-xl bg-medishare-50">
                <div className="w-full h-full flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-medishare-600" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-2 rounded-lg shadow-lg border border-gray-100">
                <QrCode className="w-24 h-24 text-medishare-500" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-medishare-50 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="bg-medishare-600 p-3 rounded-full text-white mb-4">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Login</h3>
                <p className="text-gray-600">
                  Login securely with your Aadhaar and OTP to connect with DigiLocker and access your medical records.
                </p>
              </div>
              
              <div className="bg-medishare-50 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="bg-medishare-600 p-3 rounded-full text-white mb-4">
                  <QrCode className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate QR</h3>
                <p className="text-gray-600">
                  Select which medical records to share and generate a secure, time-limited QR code for access.
                </p>
              </div>
              
              <div className="bg-medishare-50 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="bg-medishare-600 p-3 rounded-full text-white mb-4">
                  <Hospital className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hospital Access</h3>
                <p className="text-gray-600">
                  Healthcare providers scan the QR to instantly and securely view your shared medical history.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Security Info */}
        <section className="py-16 container mx-auto px-4">
          <div className="bg-medishare-900 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Your Security is Our Priority</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-medical-400 flex-shrink-0 mt-1" />
                  <p>Your records are securely fetched from DigiLocker only with your consent</p>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-medical-400 flex-shrink-0 mt-1" />
                  <p>Access automatically expires after 15 minutes for maximum security</p>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="h-6 w-6 text-medical-400 flex-shrink-0 mt-1" />
                  <p>Advanced encryption ensures your data remains private and secure</p>
                </li>
                <li className="flex items-start gap-3">
                  <FileCheck className="h-6 w-6 text-medical-400 flex-shrink-0 mt-1" />
                  <p>Complete audit trail of all access to your medical records</p>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-medishare-800 to-medishare-700 flex items-center justify-center">
                  <Shield className="w-32 h-32 text-medical-400" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-medical-500 p-4 rounded-full">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-4 -left-4 bg-medical-400 p-4 rounded-full">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <p className="text-sm text-gray-500 mt-4 md:mt-0">
              © 2025 MediShare. All rights reserved. Powered by DigiLocker API integration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

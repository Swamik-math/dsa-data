
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2, UnlockKeyhole } from "lucide-react";

export function AadhaarLoginForm() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate OTP sending - in a real app, this would call the DigiLocker API
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate verification - in a real app, this would verify with DigiLocker
    setTimeout(() => {
      setLoading(false);
      navigate("/records");
    }, 1500);
  };

  const formatAadhaar = (value: string) => {
    // Format as XXXX-XXXX-XXXX
    const digits = value.replace(/\D/g, "").substring(0, 12);
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.substring(0, 4)}-${digits.substring(4)}`;
    return `${digits.substring(0, 4)}-${digits.substring(4, 8)}-${digits.substring(8)}`;
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAadhaar(e.target.value);
    setAadhaarNumber(formattedValue);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Secure Login</CardTitle>
        <CardDescription>
          {otpSent 
            ? "Enter the OTP sent to your registered mobile number" 
            : "Login with your Aadhaar number to access your medical records"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!otpSent ? (
          <form onSubmit={handleAadhaarSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="aadhaar" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Aadhaar Number
              </label>
              <Input
                id="aadhaar"
                placeholder="XXXX-XXXX-XXXX"
                value={aadhaarNumber}
                onChange={handleAadhaarChange}
                className="font-mono"
                minLength={14}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-medishare-600 hover:bg-medishare-700" 
              disabled={loading || aadhaarNumber.length < 14}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Get OTP"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="otp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  One-Time Password
                </label>
                <button 
                  type="button" 
                  className="text-xs text-medishare-600 hover:text-medishare-800"
                  onClick={() => {
                    setOtp("");
                    setOtpSent(false);
                  }}
                >
                  Change Aadhaar
                </button>
              </div>
              <Input
                id="otp"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").substring(0, 6))}
                className="font-mono tracking-widest text-lg"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-medishare-600 hover:bg-medishare-700" 
              disabled={loading || otp.length < 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <UnlockKeyhole className="mr-2 h-4 w-4" />
                  Verify & Login
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        <p className="text-xs text-muted-foreground text-center">
          Your data is secured with DigiLocker integration.<br />
          We never store your medical records.
        </p>
      </CardFooter>
    </Card>
  );
}

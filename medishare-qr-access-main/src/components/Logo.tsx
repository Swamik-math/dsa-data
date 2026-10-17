
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-br from-medishare-500 to-medishare-700 p-1.5 rounded-lg shadow-md">
        <QrCode className="h-6 w-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl text-gradient leading-none">MediShare</span>
        <span className="text-xs text-muted-foreground">Secure Medical Records</span>
      </div>
    </div>
  );
}

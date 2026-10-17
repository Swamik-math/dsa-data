
import { useState } from "react";
import { Check, FileText, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { MedicalRecord } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface RecordCardProps {
  record: MedicalRecord;
  selected?: boolean;
  onToggleSelect: (id: string) => void;
}

export function RecordCard({ record, selected = false, onToggleSelect }: RecordCardProps) {
  const formattedDate = format(new Date(record.date), "PPP");
  const recordTypeIcon = record.type.toLowerCase().includes("radio") ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  
  // Enhanced styling for record type badges
  const recordTypeBgColor = 
    record.type === "Lab Report" ? "bg-blue-50/80 text-blue-700 border-blue-200" :
    record.type === "Radiology" ? "bg-purple-50/80 text-purple-700 border-purple-200" :
    record.type === "Cardiology" ? "bg-red-50/80 text-red-700 border-red-200" :
    record.type === "Pathology" ? "bg-green-50/80 text-green-700 border-green-200" :
    "bg-gray-50/80 text-gray-700 border-gray-200";

  return (
    <Card 
      className={cn(
        "group relative cursor-pointer overflow-hidden transition-all duration-300 premium-card hover:-translate-y-1",
        selected ? "ring-2 ring-medishare-600 shadow-lg" : ""
      )}
      onClick={() => onToggleSelect(record.id)}
    >
      {selected && (
        <div className="absolute top-2 right-2 bg-medishare-600 text-white rounded-full p-1 shadow-md z-10 animate-in fade-in zoom-in duration-300">
          <Check className="h-4 w-4" />
        </div>
      )}
      
      <div className="aspect-video relative bg-muted overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center transform transition-transform duration-500 group-hover:scale-110" 
          style={{ 
            backgroundImage: record.thumbnailUrl 
              ? `url(${record.thumbnailUrl})` 
              : 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted-foreground)/0.2))'
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <Badge variant="outline" className={cn("text-xs font-medium border glass-effect backdrop-blur", recordTypeBgColor)}>
            <span className="flex items-center gap-1.5">
              {recordTypeIcon}
              {record.type}
            </span>
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 relative z-10">
        <div className="space-y-2">
          <h3 className="font-medium text-base line-clamp-1 group-hover:text-medishare-800 transition-colors duration-300">{record.title}</h3>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="font-medium truncate max-w-[60%]">{record.hospital}</span>
            <time dateTime={record.date} className="tabular-nums text-right">{formattedDate}</time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

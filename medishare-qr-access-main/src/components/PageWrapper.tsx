
import React from "react";
import { Logo } from "@/components/Logo";

interface PageWrapperProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  bgGradient?: string;
  footerText?: string;
}

export function PageWrapper({ 
  children, 
  headerRight,
  bgGradient = "from-medishare-50/80 via-white to-white",
  footerText = "© 2025 MediShare. Powered by DigiLocker API integration."
}: PageWrapperProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b ${bgGradient}`}>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Logo />
          {headerRight}
        </div>
      </header>
      
      <main className="flex-1 relative">
        <div className="absolute inset-0 background-pattern -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70 -z-10" />
        {children}
      </main>
      
      <footer className="border-t border-border/20 bg-muted/50 backdrop-blur-sm">
        <div className="container mx-auto py-6 px-4">
          <p className="text-sm text-muted-foreground text-center">
            {footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}

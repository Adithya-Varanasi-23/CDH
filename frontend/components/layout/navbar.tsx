"use client";

import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-[#1E293B] px-6 lg:px-8">
      <h1 className="text-lg font-bold text-white lg:text-xl pl-12 lg:pl-0">{title}</h1>
      <div className="flex items-center gap-3">
        <Badge className="hidden sm:inline-flex bg-[#1D9E75]/20 text-[#1D9E75] hover:bg-[#1D9E75]/30 border-0">
          LSTM Model Active
        </Badge>
        <Badge className="hidden md:inline-flex bg-[#534AB7]/20 text-[#a5a0e0] hover:bg-[#534AB7]/30 border-0">
          IMD + NSE Data
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  );
}

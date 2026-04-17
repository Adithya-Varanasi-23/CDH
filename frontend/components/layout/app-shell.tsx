"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { MockDataBanner } from "./mock-data-banner";

interface AppShellProps {
  title: string;
  children: React.ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MockDataBanner />
      <Sidebar />
      <div className="lg:pl-60">
        <Navbar title={title} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

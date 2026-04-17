"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Thermometer,
  BarChart2,
  Info,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STOCK_TICKERS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Stocks",
    icon: <TrendingUp className="h-5 w-5" />,
    children: STOCK_TICKERS.map((ticker) => ({
      label: ticker,
      href: `/stocks/${ticker}`,
    })),
  },
  {
    label: "Climate Data",
    href: "/climate",
    icon: <Thermometer className="h-5 w-5" />,
  },
  {
    label: "Feature Analysis",
    href: "/features",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    label: "About",
    href: "/about",
    icon: <Info className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [stocksExpanded, setStocksExpanded] = useState(
    pathname.startsWith("/stocks")
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;
  const isStockActive = pathname.startsWith("/stocks");

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden text-white bg-[#0F172A]"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-60 bg-[#0F172A] flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1D9E75] to-[#534AB7]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 text-white"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-white text-lg leading-tight">
              GridCast
            </h1>
            <p className="text-xs text-slate-400">Climate Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setStocksExpanded(!stocksExpanded)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isStockActive
                          ? "bg-[#1D9E75]/20 text-[#1D9E75]"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      {stocksExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {stocksExpanded && (
                      <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm transition-colors",
                                isActive(child.href)
                                  ? "bg-[#1D9E75] text-white"
                                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.href!)
                        ? "bg-[#1D9E75] text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Model Status */}
        <div className="p-4">
          <div className="rounded-lg bg-[#1E293B] p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1D9E75] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1D9E75]"></span>
              </span>
              <span className="text-xs font-medium text-slate-300">
                Model Status
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">LSTM Active</p>
          </div>
        </div>
      </aside>
    </>
  );
}

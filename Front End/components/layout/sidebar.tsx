"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, UserPlus, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isManager } = useAuth();

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Entries",
      href: "/dashboard",
      icon: FileText,
    },
  ];

  const managerNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "All Entries",
      href: "/dashboard",
      icon: FileText,
    },
    {
      title: "Create Manager",
      href: "/dashboard/create-manager",
      icon: UserPlus,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const navItems = isManager ? managerNavItems : userNavItems;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-purple-100 transition-all duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 shadow-xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-purple-100 md:hidden">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Navigation
          </span>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-purple-50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "gradient-primary text-white shadow-md transform scale-[1.02]"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

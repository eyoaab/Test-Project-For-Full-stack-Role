"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isManager, user } = useAuth();

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & stats",
    },
    {
      title: "My Entries",
      href: "/dashboard/entries",
      icon: FileText,
      description: "Manage entries",
    },
  ];

  const managerNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & stats",
    },
    {
      title: "All Entries",
      href: "/dashboard/entries",
      icon: FileText,
      description: "Manage all entries",
    },
    {
      title: "Create Manager",
      href: "/dashboard/create-manager",
      icon: UserPlus,
      description: "Add new manager",
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
          "fixed left-0 top-0 z-50 h-full w-80 bg-gradient-to-br from-purple-50 to-white backdrop-blur-xl border-r border-purple-100 transition-all duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 shadow-xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-purple-100 md:hidden bg-white/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Menu
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-purple-100 rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info Card */}
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-2xl shadow-smooth p-4 border border-purple-50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                <Badge 
                  variant={isManager ? "default" : "secondary"} 
                  className={cn(
                    "text-xs font-medium mt-1",
                    isManager ? "gradient-primary text-white" : "bg-gray-100 text-gray-700"
                  )}
                >
                  {isManager ? "Manager" : "User"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-4 md:px-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300",
                  isActive
                    ? "gradient-primary text-white shadow-elegant"
                    : "text-gray-600 hover:bg-white hover:shadow-smooth"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-purple-50 group-hover:bg-purple-100"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-all",
                    isActive ? "text-white" : "text-purple-600"
                  )} />
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-bold transition-colors",
                    isActive ? "text-white" : "text-gray-800 group-hover:text-purple-700"
                  )}>
                    {item.title}
                  </p>
                  <p className={cn(
                    "text-xs transition-colors",
                    isActive ? "text-white/80" : "text-gray-500 group-hover:text-purple-600"
                  )}>
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

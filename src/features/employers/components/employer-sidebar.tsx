"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Plus,
  Briefcase,
  Bookmark,
  CreditCard,
  Building,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutUserAction } from "@/features/auth/server/auth.action";

const base = "/employer-dashboard";

const navigationItems = [
  { name: "Overview", icon: LayoutDashboard, href: base + "/" },
  { name: "Applications", icon: User, href: base + "/applications" },
  { name: "Post a Job", icon: Plus, href: base + "/jobs/create" },
  { name: "My Jobs", icon: Briefcase, href: base + "/jobs" },
  { name: "Saved Candidate", icon: Bookmark, href: base + "/saved-candidate" },
  { name: "Plans & Billing", icon: CreditCard, href: base + "/plans&billing" },
  { name: "All Companies", icon: Building, href: base + "/all-companies" },
  { name: "Settings", icon: Settings, href: base + "/settings" },
];

const EmployerSidebar = () => {
  const pathname = usePathname();

  // to check the link of the matching sidebar
  function isLinkActive({
    href,
    pathname,
    base = "/",
  }: {
    href: string;
    pathname: string;
    base?: string;
  }) {
    const normalizedHref = href.replace(/\/$/, "") || "/";

    // URLPattern is a built-in browser API that lets you define URL matching patterns using a template-like syntax.

    const pattern = new URLPattern({
      pathname: normalizedHref === base ? base : `${normalizedHref}{/*}?`,
    });

    console.log("pattern: ", pattern);

    console.log("inside: ", pattern.test({ pathname }));
    return pattern.test({ pathname });
  }

  return (
    <div className="w-64 bg-card border-r border-border fixed bottom-0 top-0">
      <div className="p-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Employers Dashboard
        </h2>
      </div>

      <nav className="px-3 space-y-1">
        {navigationItems.map((curNav) => {
          const Icon = curNav.icon;

          return (
            <Link
              key={curNav.name}
              href={curNav.href || "#"}
              // className=" flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isLinkActive({
                  href: curNav.href || "#",
                  pathname,
                  base: "/employer-dashboard",
                }) && "text-primary bg-blue-300",
              )}
            >
              <Icon />
              {curNav.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-3 right-3">
        <button
          onClick={logoutUserAction}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Log-out
        </button>
      </div>
    </div>
  );
};

export default EmployerSidebar;

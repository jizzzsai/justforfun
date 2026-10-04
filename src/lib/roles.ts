import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  ClipboardList,
  FileCheck2,
  Wallet,
  ClipboardCheck,
  PenLine,
  History,
  ListChecks,
  Inbox,
  Users,
  Banknote,
  BookMarked,
  ScrollText,
  Settings,
} from "lucide-react";

export type Role =
  | "researcher"
  | "dean"
  | "committee"
  | "iras"
  | "ofm"
  | "admin";

export const ROLES: Role[] = [
  "researcher",
  "dean",
  "committee",
  "iras",
  "ofm",
  "admin",
];

export interface RoleMeta {
  label: string;
  short: string;
  unit: string;
  blurb: string;
}

export const ROLE_META: Record<Role, RoleMeta> = {
  researcher: {
    label: "Researcher",
    short: "Researcher",
    unit: "Faculty Member",
    blurb: "Submit and track grant applications, reports and payments.",
  },
  dean: {
    label: "Dean's Office",
    short: "Dean",
    unit: "Faculty Dean",
    blurb: "First screening of proposals and sign-and-forward to IRAS.",
  },
  committee: {
    label: "Faculty Academic Committee",
    short: "Committee",
    unit: "Academic Committee",
    blurb: "Scholarly review and recommendation back to the Dean.",
  },
  iras: {
    label: "IRAS Research Office",
    short: "IRAS",
    unit: "HR / Research Office",
    blurb: "Receive forwarded proposals, complete university review and approve eligible grants.",
  },
  ofm: {
    label: "Academic",
    short: "Academic",
    unit: "Academic Office",
    blurb: "30 / 40 / 30 disbursement tracking.",
  },
  admin: {
    label: "Administrator",
    short: "Admin",
    unit: "System Administrator",
    blurb: "Users, journal tiers, audit log and system settings.",
  },
};

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV: Record<Role, NavItem[]> = {
  researcher: [
    { label: "Dashboard", href: "/researcher/dashboard", icon: LayoutDashboard },
    { label: "Submit Application", href: "/researcher/submit", icon: FilePlus2 },
    { label: "My Applications", href: "/researcher/applications", icon: FileText },
    { label: "Progress Reports", href: "/researcher/progress", icon: ClipboardList },
    { label: "Final Reports", href: "/researcher/final", icon: FileCheck2 },
    { label: "Payments", href: "/researcher/payments", icon: Wallet },
  ],
  dean: [
    { label: "Dashboard", href: "/dean/dashboard", icon: LayoutDashboard },
    { label: "First Screening", href: "/dean/screen", icon: ClipboardCheck },
    { label: "Sign & Forward", href: "/dean/sign", icon: PenLine },
    { label: "Decision History", href: "/dean/history", icon: History },
  ],
  committee: [
    { label: "Dashboard", href: "/committee/dashboard", icon: LayoutDashboard },
    { label: "Review Queue", href: "/committee/queue", icon: ListChecks },
    { label: "Past Reviews", href: "/committee/history", icon: History },
  ],
  iras: [
    { label: "Dashboard", href: "/iras/dashboard", icon: LayoutDashboard },
    { label: "Received", href: "/iras/received", icon: Inbox },
    { label: "Office Screening", href: "/iras/screen", icon: ClipboardCheck },
  ],
  ofm: [
    { label: "Dashboard", href: "/ofm/dashboard", icon: LayoutDashboard },
    { label: "Payment Queue", href: "/ofm/payments", icon: Banknote },
    { label: "Payment History", href: "/ofm/history", icon: History },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Journal Tiers", href: "/admin/journals", icon: BookMarked },
    { label: "Audit Log", href: "/admin/audit", icon: ScrollText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};


export function homeFor(role: Role): string {
  return NAV[role][0].href;
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

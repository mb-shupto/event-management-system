import type { ReactNode } from "react";
import VMenubar from "@/components/HMenubar";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1 min-h-0">
        <VMenubar />
        <div className="flex-1 min-h-0 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

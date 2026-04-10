"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BanIcon,
  Settings,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
  { href: "/admin/bloqueos", label: "Bloquear fechas", icon: BanIcon },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <aside className="w-56 shrink-0 border-r border-[#E8DCC8] bg-white flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-[#E8DCC8]">
        <span
          className="text-lg text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Mas Besaura
        </span>
        <p className="text-[10px] text-[#2C1810]/40 uppercase tracking-widest mt-0.5">
          Admin
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-[#4A6741]/10 text-[#4A6741]"
                  : "text-[#2C1810]/60 hover:bg-[#F0EAD6] hover:text-[#2C1810]",
              ].join(" ")}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#E8DCC8]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#2C1810]/50 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#2C1810]/35 hover:text-[#2C1810]/60 transition-colors mt-1"
          target="_blank"
        >
          Ver la web →
        </Link>
      </div>
    </aside>
  );
}

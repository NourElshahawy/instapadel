"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/layout/NotificationBell";
import { OWNER_NAV_LINKS } from "./ownerNavLinks";

export default function OwnerSidebar({ ownerName }) {
  const pathname = usePathname();

  return (
    <aside className="owner-sidebar">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <p className="owner-sidebar-greeting">مرحبًا بعودتك</p>
          <p className="owner-sidebar-name">{ownerName}</p>
        </div>
        <NotificationBell />
      </div>

      <nav className="owner-nav">
        {OWNER_NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={`owner-nav-link ${pathname === link.href ? "is-active" : ""}`}>
            <span>{link.icon}</span> {link.label}
          </Link>
        ))}
      </nav>

      <Link href="/" className="owner-sidebar-back">
        ← رجوع للموقع
      </Link>
    </aside>
  );
}

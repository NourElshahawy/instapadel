"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/layout/NotificationBell";
import { OWNER_NAV_LINKS } from "./ownerNavLinks";

export default function OwnerSidebar({ ownerName, notifState }) {
  const pathname = usePathname();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = notifState;
  return (
    <aside className="owner-sidebar">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <p className="owner-sidebar-greeting">مرحبًا بعودتك</p>
          <p className="owner-sidebar-name">{ownerName}</p>
        </div>
        <NotificationBell notifications={notifications} unreadCount={unreadCount} loading={loading} markAsRead={markAsRead} markAllAsRead={markAllAsRead} />
      </div>

      <nav className="owner-nav">
        {OWNER_NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={`owner-nav-link ${pathname === link.href ? "is-active" : ""}`}>
            <span>{link.icon}</span> {link.label}
          </Link>
        ))}
      </nav>

      <Link href="/owner/logout" className="owner-nav-link">
        <span>🚪</span> تسجيل الخروج
      </Link>
      <Link href="/" className="owner-sidebar-back">
        ← رجوع للموقع
      </Link>
    </aside>
  );
}

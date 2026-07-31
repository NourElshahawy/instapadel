"use client";
import { useState } from "react";
import Link from "next/link";
import NotificationBell from "@/components/layout/NotificationBell";
import { OWNER_NAV_LINKS } from "./ownerNavLinks";

export default function OwnerMobileHeader({ ownerName, notifState }) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = notifState;
  return (
    <div className="owner-mobile-header" style={{ position: "relative" }}>
      <span className="owner-mobile-header-title">لوحة {ownerName}</span>
      <div className="d-flex align-items-center gap-2">
        <NotificationBell notifications={notifications} unreadCount={unreadCount} loading={loading} markAsRead={markAsRead} markAllAsRead={markAllAsRead} />
        <button className="owner-mobile-toggle" onClick={() => setOpen((v) => !v)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="owner-mobile-menu">
          <nav className="owner-nav">
            {OWNER_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="owner-nav-link" onClick={() => setOpen(false)}>
                {link.icon} {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/owner/logout" className="owner-nav-link" onClick={() => setOpen(false)}>
            🚪 تسجيل الخروج
          </Link>
          <Link href="/" className="owner-sidebar-back">
            ← رجوع للموقع
          </Link>
        </div>
      )}
    </div>
  );
}

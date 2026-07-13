"use client";
import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/admin/dashboard", label: "نظرة عامة", icon: "📊" },
  { href: "/admin/dashboard/venues", label: "موافقة الملاعب", icon: "🏟️" },
  { href: "/admin/dashboard/bookings", label: "كل الحجوزات", icon: "📅" },
  { href: "/admin/dashboard/tournaments", label: "البطولات", icon: "🏆" },
  { href: "/admin/dashboard/users", label: "المستخدمين", icon: "👥" },
  { href: "/admin/dashboard/news", label: "الأخبار", icon: "📰" },
];

export default function AdminMobileHeader({ adminName }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="owner-mobile-header" style={{ position: "relative" }}>
      <span className="owner-mobile-header-title">لوحة {adminName}</span>
      <button className="owner-mobile-toggle" onClick={() => setOpen((v) => !v)}>{open ? "✕" : "☰"}</button>

      {open && (
        <div className="owner-mobile-menu">
          <nav className="owner-nav">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="owner-nav-link" onClick={() => setOpen(false)}>
                {link.icon} {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="owner-sidebar-back">← رجوع للموقع</Link>
        </div>
      )}
    </div>
  );
}
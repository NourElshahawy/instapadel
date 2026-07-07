"use client";
import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/owner/dashboard", label: "نظرة عامة", icon: "📊" },
  { href: "/owner/dashboard/venues", label: "ملاعبي", icon: "🏟️" },
  { href: "/owner/dashboard/bookings", label: "الحجوزات", icon: "📅" },
];

export default function OwnerMobileHeader({ ownerName }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="owner-mobile-header" style={{ position: "relative" }}>
      <span className="owner-mobile-header-title">لوحة {ownerName}</span>
      <button className="owner-mobile-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="owner-mobile-menu">
          <nav className="owner-nav">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="owner-nav-link" onClick={() => setOpen(false)}>
                {link.icon} {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="owner-sidebar-back">
            ← رجوع للموقع
          </Link>
        </div>
      )}
    </div>
  );
}

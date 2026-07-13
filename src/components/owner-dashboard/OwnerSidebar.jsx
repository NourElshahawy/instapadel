"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import "@/styles/pages/owner-dashboard.css";

const LINKS = [
  { href: "/owner/dashboard", label: "نظرة عامة", icon: "📊" },
  { href: "/owner/dashboard/venues", label: "ملاعبي", icon: "🏟️" },
  { href: "/owner/dashboard/bookings", label: "الحجوزات", icon: "📅" },
  { href: "/owner/dashboard/news", label: "الأخبار", icon: "📰" },
];

export default function OwnerSidebar({ ownerName }) {
  const pathname = usePathname();

  return (
    <aside className="owner-sidebar">
      <div>
        <p className="owner-sidebar-greeting">مرحبًا بعودتك</p>
        <p className="owner-sidebar-name">{ownerName}</p>
      </div>

      <nav className="owner-nav">
        {LINKS.map((link) => (
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

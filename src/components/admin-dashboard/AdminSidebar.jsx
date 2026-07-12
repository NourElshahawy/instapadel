"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "نظرة عامة", icon: "📊" },
  { href: "/admin/dashboard/venues", label: "موافقة الملاعب", icon: "🏟️" },
  { href: "/admin/dashboard/bookings", label: "كل الحجوزات", icon: "📅" },
  { href: "/admin/dashboard/tournaments", label: "البطولات", icon: "🏆" },
  { href: "/admin/dashboard/users", label: "المستخدمين", icon: "👥" },
  { href: "/admin/dashboard/news", label: "الأخبار", icon: "📰" },
];

export default function AdminSidebar({ adminName }) {
  const pathname = usePathname();

  return (
    <aside className="owner-sidebar">
      <div>
        <p className="owner-sidebar-greeting">مرحبًا</p>
        <p className="owner-sidebar-name">{adminName} (أدمن)</p>
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

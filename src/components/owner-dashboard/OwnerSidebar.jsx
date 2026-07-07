"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/owner/dashboard", label: "نظرة عامة", icon: "📊" },
  { href: "/owner/dashboard/venues", label: "ملاعبي", icon: "🏟️" },
  { href: "/owner/dashboard/bookings", label: "الحجوزات", icon: "📅" },
];

export default function OwnerSidebar({ ownerName }) {
  const pathname = usePathname();

  return (
    <aside className="tw-w-64 tw-shrink-0 tw-border-l tw-border-slate-800 tw-bg-slate-900 tw-p-5 tw-hidden lg:tw-flex tw-flex-col tw-gap-6">
      <div>
        <p className="tw-text-xs tw-text-slate-500">مرحبًا بعودتك</p>
        <p className="tw-text-white tw-font-bold">{ownerName}</p>
      </div>

      <nav className="tw-flex tw-flex-col tw-gap-1">
        {LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`tw-flex tw-items-center tw-gap-3 tw-rounded-lg tw-px-3 tw-py-2.5 tw-text-sm tw-transition-colors ${
                isActive ? "tw-bg-emerald-500/10 tw-text-emerald-400" : "tw-text-slate-400 hover:tw-bg-slate-800 hover:tw-text-white"
              }`}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          );
        })}
      </nav>

      <Link href="/" className="tw-mt-auto tw-text-xs tw-text-slate-500 hover:tw-text-white">
        ← رجوع للموقع
      </Link>
    </aside>
  );
}
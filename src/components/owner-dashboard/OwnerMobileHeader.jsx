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
    <div className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b tw-border-slate-800 tw-bg-slate-900 lg:tw-hidden">
      <span className="tw-text-white tw-font-semibold">لوحة {ownerName}</span>
      <button onClick={() => setOpen((v) => !v)} className="tw-text-white tw-text-2xl">
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="tw-absolute tw-top-16 tw-left-0 tw-right-0 tw-bg-slate-900 tw-border-b tw-border-slate-800 tw-p-4 tw-z-50">
          <nav className="tw-flex tw-flex-col tw-gap-2">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="tw-text-slate-300 tw-py-2">
                {link.icon} {link.label}
              </Link>
            ))}
            <Link href="/" className="tw-text-emerald-400 tw-py-2 tw-border-t tw-border-slate-800 tw-mt-2 tw-pt-3">
              ← رجوع للموقع
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
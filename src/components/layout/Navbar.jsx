"use client";
import { useState } from "react";

import "../../styles/layout/navbar.css";
import Link from "next/link";
import Image from "next/image";
import { useStickyNavbar } from "@/hooks/useStickyNavbar";
import { useAuth } from "@/hooks/useAuth";
import ProfileMenu from "./ProfileMenu";
import "@/styles/layout/profile-menu.css";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/courts", label: "الملاعب" },
  { href: "/tournaments", label: "البطولات" },
  { href: "/find-partner", label: "دور على شريك" },
  { href: "/news", label: "اخبار البادل" },
  // { href: "/contact", label: "تواصل معنا" },
];

export default function Navbar() {
  const isScrolled = useStickyNavbar();
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, loading } = useAuth();

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`navbar-ph ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/" className="brand">
          <Image
            src="/assets/imgs/logo.png" 
            alt="InstaPadel"
            width={80}
            height={40}
            priority
          />
        </Link>

        <nav className={`nav-links ${isOpen ? "is-open" : ""}`} id="navLinks">
          <Link href="/" className="brand logo-mobil" onClick={closeMenu}>
            <Image
              src="/assets/imgs/logo.png"
              alt="InstaPadel"
              width={100}
              height={56}
              style={{ height: "auto" }}
            />
          </Link>

          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}

          {!loading && !user && (
            <div className="d-flex d-lg-none gap-3 mt-3">
              <Link
                href="/login"
                className="btn btn-ghost btn-sm"
                onClick={closeMenu}
              >
                تسجيل دخول
              </Link>
              <Link
                href="/register"
                className="btn btn-accent btn-sm"
                onClick={closeMenu}
              >
                انشاء حساب
              </Link>
            </div>
          )}
          {!loading && user && (
            <div className="d-lg-none mt-3">
              <ProfileMenu name={profile?.name} />
            </div>
          )}
        </nav>

        <div className="navbar-cta">
          {loading ? null : user ? (
            <div className="d-none d-lg-block">
              <ProfileMenu name={profile?.name} />
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                تسجيل دخول
              </Link>
              <Link href="/register" className="btn btn-ghost btn-sm">
                انشاء حساب
              </Link>
            </>
          )}
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            onClick={() => setIsOpen((v) => !v)}
          >
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}

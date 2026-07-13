"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStickyNavbar } from "@/hooks/useStickyNavbar";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/services/authClient";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfileMenu";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/#courts", label: "الملاعب" },
  { href: "/tournaments", label: "البطولات" },
  { href: "/find-partner", label: "دور على شريك" },
  { href: "/#news", label: "اخبار البادل" },
  // { href: "/#contact", label: "تواصل معنا" },
];

export default function Navbar() {
  const isScrolled = useStickyNavbar();
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const closeMenu = () => setIsOpen(false);

  const handleMobileLogout = async () => {
    await signOut();
    closeMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <header className={`navbar-ph ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/" className="brand">
          <Image src="/assets/imgs/logo.png" alt="InstaPadel" width={100} height={56} priority  />
        </Link>

        <nav className={`nav-links ${isOpen ? "is-open" : ""}`} id="navLinks">
          <button className="nav-close-btn d-lg-none" onClick={closeMenu} aria-label="إغلاق القائمة">
            <i className="fa-solid fa-xmark"></i>
          </button>

          <Link href="/" className="brand logo-mobil" onClick={closeMenu}>
            <Image src="/assets/imgs/logo.png" alt="InstaPadel" width={100} height={56}  />
          </Link>

          <div className="nav-links-primary">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* ===== قسم الحساب — موبايل بس، تصميم منفصل تمامًا عن الدروب داون ===== */}
          {!loading && (
            <div className="nav-account-mobile d-lg-none">
              {user ? (
                <>
                  <div className="nav-account-header">
                    <span className="profile-menu-avatar">{profile?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                    <span className="nav-account-name">{profile?.name || "مستخدم"}</span>
                  </div>

                  {profile?.role === "owner" && (
                    <Link href="/owner/dashboard" className="nav-account-link" onClick={closeMenu}>
                      <i className="fa-solid fa-table-columns"></i> لوحة التحكم
                    </Link>
                  )}
                  {profile?.role === "admin" && (
                    <Link href="/admin/dashboard" className="nav-account-link" onClick={closeMenu}>
                      <i className="fa-solid fa-user-gear"></i> لوحة الإدارة
                    </Link>
                  )}
                  <Link href="/profile" className="nav-account-link" onClick={closeMenu}>
                    <i className="fa-solid fa-user"></i> الملف الشخصي
                  </Link>
                  <button className="nav-account-link danger" onClick={handleMobileLogout}>
                    <i className="fa-solid fa-sign-out-alt"></i> تسجيل خروج
                  </button>
                </>
              ) : (
                <div className="d-flex gap-3">
                  <Link href="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}>
                    تسجيل دخول
                  </Link>
                  <Link href="/register" className="btn btn-accent btn-sm" onClick={closeMenu}>
                    انشاء حساب
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="navbar-cta">
          {loading ? null : user ? (
            <div className="d-none d-lg-block">
              <ProfileMenu name={profile?.name} role={profile?.role} />
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
          <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setIsOpen((v) => !v)}>
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PasswordField from "@/components/shared/PasswordField";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: هتتوصل بـ endpoint تسجيل الدخول بتاع Laravel
    setStatus("loading");
    setTimeout(() => setStatus("idle"), 1200);
  };

  return (
    <div className="auth-form-col">
      <div className="auth-topbar d-flex d-lg-none">
        <Link href="/" className="brand">
          <Image src="/assets/imgs/logo.png" alt="InstaPadel" width={100} height={56} />
        </Link>
      </div>

      <div className="auth-card">
        <h1>مرحبًا بعودتك</h1>
        <p className="auth-sub">سجّل الدخول لتحجز ملعبك التالي في أقل من دقيقة.</p>

        <button type="button" className="social-btn">
          <i className="fa-brands fa-google" />
          تابع باستخدام Google
        </button>

        <div className="auth-divider">أو سجّل الدخول بالبريد الإلكتروني</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="loginEmail">البريد الإلكتروني</label>
            <div className="field-input-wrap">
              <i className="fa-solid fa-envelope field-icon" />
              <input className="field-input" type="email" id="loginEmail" name="email" placeholder="nour123@gmail.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <PasswordField id="loginPassword" label="كلمة المرور" placeholder="أدخل كلمة المرور" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />

          <div className="field-row-between">
            <label className="remember-check">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
              تذكرني
            </label>
            <Link href="/forgot-password" className="auth-link">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button type="submit" className="btn btn-accent btn-block" disabled={status === "loading"}>
            {status === "loading" ? "جاري تسجيل الدخول…" : "تسجيل الدخول"}
          </button>
        </form>

        <p className="auth-switch">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="auth-link">
            أنشئ واحدًا
          </Link>
        </p>
      </div>
    </div>
  );
}

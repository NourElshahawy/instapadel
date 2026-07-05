"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PasswordField from "@/components/shared/PasswordField";
import AccountTypeSelector from "./AccountTypeSelector";
export default function RegisterForm() {
  const router = useRouter();
  //  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);




  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
    agreeTerms: false,
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  if (form.password !== form.confirmPassword) {
    alert("كلمة المرور غير متطابقة");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          phone: form.phone,
          role: form.role,
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/verify-email");
  } finally {
    setLoading(false);
  }
};

 
  


  return (
    <div className="auth-form-col">
      <div className="auth-topbar d-flex d-lg-none">
        <Link href="/" className="brand">
          <Image src="/assets/imgs/logo.png" alt="InstaPadel" width={100} height={56} />
        </Link>
      </div>

      <div className="auth-card">
        <h1>أنشئ حسابك</h1>
        <p className="auth-sub">انضم إلى InstaPadel واحجز ملعبك الأول في دقائق.</p>

        <AccountTypeSelector />

        <button type="button" className="social-btn">
          <i className="fa-brands fa-google" />
          تابع باستخدام Google
        </button>

        <div className="auth-divider">أو سجل بالبريد الإلكتروني</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="regName">الاسم الكامل</label>
            <div className="field-input-wrap">
              <i className="fa-solid fa-circle-user field-icon" />
              <input className="field-input" type="text" id="regName" name="name" placeholder="اسمك الكامل" value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="regEmail">البريد الإلكتروني</label>
            <div className="field-input-wrap">
              <i className="fa-solid fa-envelope field-icon" />
              <input className="field-input" type="email" id="regEmail" name="email" placeholder="nour123@gmail.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="regPhone">رقم الهاتف</label>
            <div className="field-input-wrap">
              <i className="fa-solid fa-phone field-icon" />
              <input className="field-input phone-rtl-fix" type="tel" id="regPhone" name="phone" placeholder="01xx xxx xxxx" value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <PasswordField id="regPassword" label="كلمة المرور" placeholder="أنشئ كلمة مرور" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />

          <PasswordField
            id="regConfirm"
            label="تأكيد كلمة المرور"
            placeholder="أعد إدخال كلمة المرور"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          />

          <div className="terms-row">
            <input type="checkbox" id="regTerms" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} required />
            <label htmlFor="regTerms">
              أوافق على{" "}
              <Link href="/legal#terms" className="auth-link">
                شروط الخدمة
              </Link>{" "}
              و{" "}
              <Link href="/legal#privacy" className="auth-link">
                سياسة الخصوصية
              </Link>{" "}
              الخاصة بـ InstaPadel.
            </label>
          </div>

          <button type="submit" className="btn btn-accent btn-block" disabled={status === "loading"}>
            {status === "loading" ? "جاري الإنشاء…" : "أنشئ الحساب"}
          </button>
        </form>

        <p className="auth-switch">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="auth-link">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}

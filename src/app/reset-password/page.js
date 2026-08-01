import AuthVisual from "@/components/shared/AuthVisual";
import ResetPasswordForm from "@/components/pages/login/ResetPasswordForm";

export const metadata = { title: "إعادة تعيين كلمة المرور — PadelGo" };

const FEATURES = [
  { icon: "bolt", text: "توفر المواعيد في الوقت الفعلي" },
  { icon: "verified_user", text: "ملعبين احترافيين معتمدين" },
  { icon: "lock", text: "دفع إلكتروني آمن" },
];

export default function ResetPasswordPage() {
  return (
    <div className="auth-shell">
      <AuthVisual heading="ملعب PadelGo، بلمسة واحدة." features={FEATURES} />
      <ResetPasswordForm />
    </div>
  );
}

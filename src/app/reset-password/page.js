import AuthVisual from "@/components/shared/AuthVisual";
import ResetPasswordForm from "@/components/pages/login/ResetPasswordForm";

export const metadata = { title: "إعادة تعيين كلمة المرور — InstaPadel" };

const FEATURES = [
  { icon: "bolt", text: "توفر المواعيد في الوقت الفعلي" },
  { icon: "verified_user", text: "أكثر من 100 ملعب موثّق" },
  { icon: "lock", text: "دفع إلكتروني آمن" },
];

export default function ResetPasswordPage() {
  return (
    <div className="auth-shell">
      <AuthVisual heading="جميع ملاعب المنصورة، بلمسة واحدة." features={FEATURES} />
      <ResetPasswordForm />
    </div>
  );
}
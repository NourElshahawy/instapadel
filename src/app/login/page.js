import AuthVisual from "@/components/shared/AuthVisual";
import LoginForm from "@/_pages/login/LoginForm";

export const metadata = {
  title: "تسجيل الدخول — InstaPadel",
};

const FEATURES = [
  { icon: "bolt", text: "توفر المواعيد في الوقت الفعلي" },
  { icon: "user", text: "أكثر من 100 ملعب موثّق" },
  { icon: "lock", text: "دفع إلكتروني آمن" },
];

const QUOTE = {
  text: "كنت أتصل بثلاثة أندية قبل أن أجد ملعبًا متاحًا. الآن أتحقق من InstaPadel وألعب بعد عشرين دقيقة.",
  author: "أحمد سعيد، لاعب أسبوعي",
};

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <AuthVisual heading="جميع ملاعب المنصورة، بلمسة واحدة." features={FEATURES} quote={QUOTE} />
      <LoginForm />
    </div>
  );
}

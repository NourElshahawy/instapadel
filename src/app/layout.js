import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
export const metadata = {
  title: "InstaPadel | احجز ملعبك في أقل من دقيقة",
  description: "اكتشف جميع ملاعب البادل، اعرف المواعيد المتاحة واحجز ملعبك بسهولة وفي ثوانٍ.",
};

// app/layout.js (الجذر — بسيط جدًا دلوقتي)
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
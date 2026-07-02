import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AosInit from "@/components/ui/AosInit"; // client component بينادي useAos()
export const metadata = {
  title: "InstaPadel | احجز ملعبك في أقل من دقيقة",
  description: "اكتشف جميع ملاعب البادل، اعرف المواعيد المتاحة واحجز ملعبك بسهولة وفي ثوانٍ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AosInit />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

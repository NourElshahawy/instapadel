import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Urbanist, Plus_Jakarta_Sans } from "next/font/google";
import FontAwesomeLoader from "@/components/shared/FontAwesomeLoader";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "PadelGo | احجز ملعبك في أقل من دقيقة",
  description: "PadelGo — ملعبين بادل احترافيين في المنصورة. اعرف المواعيد المتاحة واحجز ملعبك بسهولة وفي ثوانٍ.",
  applicationName: "PadelGo",
  openGraph: {
    siteName: "PadelGo",
    title: "PadelGo | احجز ملعبك في أقل من دقيقة",
    description: "PadelGo — ملعب بادل احترافي في المنصورة.",
    url: "https://instapadel.tech",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${urbanist.variable} ${plusJakarta.variable}`}>
      <head>
        <FontAwesomeLoader />
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        </noscript>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

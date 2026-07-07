// app/(main)/layout.js (جديد — فيه Navbar/Footer/AosInit)
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AosInit from "@/components/ui/AosInit";

export default function MainLayout({ children }) {
  return (
    <>
      {/* <AosInit /> */}
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
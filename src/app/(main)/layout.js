// app/(main)/layout.js (جديد — فيه Navbar/Footer/AosInit)
import "@/styles/all.css";
// import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
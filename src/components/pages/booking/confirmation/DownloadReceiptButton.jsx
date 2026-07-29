"use client";
import { useRef } from "react";

export default function DownloadReceiptButton({ booking }) {
  const receiptRef = useRef(null);

  const handleDownload = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const el = receiptRef.current;
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#0b1020",
      width: el.scrollWidth,
      height: el.scrollHeight,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const doc = new jsPDF({ unit: "mm", format: [pdfWidth, pdfHeight] });
    doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    doc.save(`InstaPadel-${booking.id}.pdf`);
  };

  return (
    <>
      <button className="summary-action-btn" type="button" onClick={handleDownload}>
        <i className="fa-solid fa-download"></i> تحميل الإيصال
      </button>

      {/* قالب الإيصال المخفي — بيتصور بس، مش ظاهر للمستخدم */}
      <div style={{ position: "absolute", top: 0, left: 0, opacity: 0, pointerEvents: "none", zIndex: -1, width: "480px" }}>
        <div
          ref={receiptRef}
          dir="rtl"
          style={{
            fontFamily: "Arial, sans-serif",
            background: "#0b1020",
            color: "#fff",
            padding: "32px",
            width: "480px",
            boxSizing: "border-box",
          }}>
          <h2 style={{ color: "#7c3aed", marginBottom: 4 }}>InstaPadel</h2>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 24 }}>إيصال الحجز</p>

          <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 16 }}>
            <ReceiptRow label="رقم الحجز" value={booking.displayId || booking.id} />
            <ReceiptRow label="الملعب" value={booking.venueName} />
            <ReceiptRow label="الكورت" value={booking.subCourtName} />
            <ReceiptRow label="التاريخ" value={booking.date} />
            <ReceiptRow label="الوقت" value={booking.time} />
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#94a3b8" }}>الإجمالي</span>
            <b style={{ color: "#00d68f", fontSize: 20 }}>{booking.price} ج.م</b>
          </div>
        </div>
      </div>
    </>
  );
}

function ReceiptRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

"use client";

export default function DownloadReceiptButton({ booking }) {
  const handleDownload = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("InstaPadel - Booking Receipt", 20, 20);

    doc.setFontSize(11);
    const lines = [`Booking ID: ${booking.id}`, `Venue: ${booking.venueName}`, `Court: ${booking.subCourtName}`, `Date: ${booking.date}`, `Time: ${booking.time}`, `Total: ${booking.price} EGP`];
    lines.forEach((line, i) => doc.text(line, 20, 40 + i * 10));

    doc.save(`InstaPadel-${booking.id}.pdf`);
  };

  return (
    <button className="summary-action-btn" type="button" onClick={handleDownload}>
      <i className="fa-solid fa-download"></i> تحميل الإيصال
    </button>
  );
}

// تصدير بيانات لملف CSV بيتفتح في Excel من غير أي مكتبات خارجية
export function exportToCSV(filename, headers, rows) {
  const escape = (val) => {
    const s = String(val ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))];
  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// بيفتح نافذة طباعة جاهزة، والأونر يقدر يعمل "حفظ كـ PDF" منها مباشرة
export function exportToPDF(title, headers, rows) {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert("المتصفح قفل النافذة المنبثقة، اسمح بالنوافذ المنبثقة لهذا الموقع وحاول تاني");
    return;
  }

  const style = `
    body { font-family: Tahoma, Arial, sans-serif; direction: rtl; padding: 24px; color: #111; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    p.meta { color: #555; font-size: 12px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: right; }
    th { background: #f2f2f2; }
    tfoot td { font-weight: bold; background: #fafafa; }
  `;

  const headHtml = headers.map((h) => `<th>${h}</th>`).join("");
  const rowsHtml = rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("");

  win.document.write(`
    <html dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>${style}</style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="meta">تاريخ التصدير: ${new Date().toLocaleDateString("ar-EG")}</p>
        <table>
          <thead><tr>${headHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <script>
          window.onload = function () { window.print(); };
        </script>
      </body>
    </html>
  `);
  win.document.close();
}

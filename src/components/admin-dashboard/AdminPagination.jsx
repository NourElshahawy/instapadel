"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function AdminPagination({ currentPage, totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  // نحدد نطاق مبسّط من الأرقام حوالين الصفحة الحالية بدل ما نعرضهم كلهم لو كانوا كتير
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="admin-pagination" aria-label="تصفح الصفحات">
      <Link href={buildHref(Math.max(1, currentPage - 1))} className={`admin-pagination-btn ${currentPage === 1 ? "is-disabled" : ""}`} aria-disabled={currentPage === 1}>
        السابق
      </Link>

      {start > 1 && (
        <>
          <Link href={buildHref(1)} className="admin-pagination-btn">
            1
          </Link>
          {start > 2 && <span className="admin-pagination-ellipsis">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link key={p} href={buildHref(p)} className={`admin-pagination-btn ${p === currentPage ? "is-active" : ""}`} aria-current={p === currentPage ? "page" : undefined}>
          {p}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="admin-pagination-ellipsis">…</span>}
          <Link href={buildHref(totalPages)} className="admin-pagination-btn">
            {totalPages}
          </Link>
        </>
      )}

      <Link href={buildHref(Math.min(totalPages, currentPage + 1))} className={`admin-pagination-btn ${currentPage === totalPages ? "is-disabled" : ""}`} aria-disabled={currentPage === totalPages}>
        التالي
      </Link>
    </nav>
  );
}

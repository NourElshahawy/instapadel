"use client";
import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function Stars({ rating }) {
  return (
    <span style={{ color: "#ffb020", letterSpacing: 2 }}>
      {"★".repeat(rating)}
      <span style={{ color: "var(--text-faint, #55555f)" }}>{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function AdminReviewsTable({ reviews }) {
  const [search, setSearch] = useState("");
  const [onlyWithFeedback, setOnlyWithFeedback] = useState(false);

  const filtered = useMemo(() => {
    let list = reviews;

    if (onlyWithFeedback) {
      list = list.filter((r) => r.siteFeedback && r.siteFeedback.trim().length > 0);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.customerName.toLowerCase().includes(q) || r.venueName.toLowerCase().includes(q) || r.customerEmail.toLowerCase().includes(q));
    }

    return list;
  }, [reviews, search, onlyWithFeedback]);

  const columns = [
    columnHelper.accessor("customerName", {
      header: "العميل",
      cell: (info) => (
        <div>
          <div style={{ fontWeight: 600 }}>{info.getValue()}</div>
          <div style={{ fontSize: ".72rem", color: "var(--text-faint)" }}>{info.row.original.customerPhone}</div>
        </div>
      ),
    }),
    columnHelper.accessor("venueName", {
      header: "الملعب",
      cell: (info) => `${info.getValue()} — ${info.row.original.courtName}`,
    }),
    columnHelper.accessor("rating", {
      header: "التقييم",
      cell: (info) => <Stars rating={info.getValue()} />,
    }),
    columnHelper.accessor("comment", {
      header: "تعليق الملعب",
      cell: (info) => info.getValue() || <span style={{ color: "var(--text-faint)" }}>—</span>,
    }),
    columnHelper.accessor("siteFeedback", {
      header: "ملاحظات الموقع",
      cell: (info) =>
        info.getValue() ? (
          <span className="owner-status-chip" style={{ background: "rgba(0,229,168,.14)", color: "#00e5a8" }}>
            {info.getValue()}
          </span>
        ) : (
          <span style={{ color: "var(--text-faint)" }}>—</span>
        ),
    }),
    columnHelper.accessor("createdAt", {
      header: "التاريخ",
      cell: (info) => new Date(info.getValue()).toLocaleDateString("ar-EG", { day: "numeric", month: "long" }),
    }),
  ];

  const table = useReactTable({ data: filtered, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <div className="admin-search-bar" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input className="admin-search-input" placeholder="دور باسم العميل أو الملعب أو الإيميل..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".85rem", color: "var(--white)", whiteSpace: "nowrap" }}>
          <input type="checkbox" checked={onlyWithFeedback} onChange={(e) => setOnlyWithFeedback(e.target.checked)} />
          فيه ملاحظات موقع بس
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="owner-table-empty">مفيش تقييمات مطابقة.</p>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-table">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

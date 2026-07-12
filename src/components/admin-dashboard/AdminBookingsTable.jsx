"use client";
import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();
const STATUS_LABELS = { confirmed: "مؤكد", cancelled: "ملغي", completed: "منتهي" };

export default function AdminBookingsTable({ bookings }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return bookings;
    const q = search.toLowerCase();
    return bookings.filter((b) => b.customerName.toLowerCase().includes(q) || b.venueName.toLowerCase().includes(q) || b.customerEmail.toLowerCase().includes(q));
  }, [bookings, search]);

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
    columnHelper.accessor("venueName", { header: "الملعب", cell: (info) => `${info.getValue()} — ${info.row.original.courtName}` }),
    columnHelper.accessor("date", { header: "التاريخ" }),
    columnHelper.accessor("time", { header: "الوقت" }),
    columnHelper.accessor("price", { header: "السعر", cell: (info) => `${info.getValue()} ج.م` }),
    columnHelper.accessor("status", {
      header: "الحالة",
      cell: (info) => <span className={`owner-status-chip ${info.getValue()}`}>{STATUS_LABELS[info.getValue()]}</span>,
    }),
  ];

  const table = useReactTable({ data: filtered, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <div className="admin-search-bar">
        <input className="admin-search-input" placeholder="دور باسم العميل أو الملعب أو الإيميل..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <p className="owner-table-empty">مفيش حجوزات مطابقة.</p>
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

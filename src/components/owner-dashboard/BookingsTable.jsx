"use client";
import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { updateBookingStatus } from "@/services/ownerBookingsClient";

const columnHelper = createColumnHelper();
const STATUS_LABELS = { confirmed: "مؤكد", cancelled: "ملغي", completed: "منتهي" };

export default function BookingsTable({ initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState(null);

  const handleUpdate = async (id, status) => {
    setLoadingId(id);
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch {
      alert("حصل خطأ أثناء تحديث الحجز");
    } finally {
      setLoadingId(null);
    }
  };

  const columns = [
    columnHelper.accessor("customerName", { header: "العميل" }),
    columnHelper.accessor("courtName", { header: "الملعب" }),
    columnHelper.accessor("date", { header: "التاريخ" }),
    columnHelper.accessor("time", { header: "الوقت" }),
    columnHelper.accessor("price", { header: "السعر", cell: (info) => `${info.getValue()} ج.م` }),
    columnHelper.accessor("status", {
      header: "الحالة",
      cell: (info) => <span className={`owner-status-chip ${info.getValue()}`}>{STATUS_LABELS[info.getValue()]}</span>,
    }),
    columnHelper.display({
      id: "actions",
      header: "إجراءات",
      cell: ({ row }) => {
        const b = row.original;
        if (b.status !== "confirmed") return null;
        return (
          <div className="owner-table-actions">
            <button onClick={() => handleUpdate(b.id, "completed")} disabled={loadingId === b.id} className="owner-btn-complete">
              إتمام
            </button>
            <button onClick={() => handleUpdate(b.id, "cancelled")} disabled={loadingId === b.id} className="owner-btn-cancel-booking">
              إلغاء
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({ data: bookings, columns, getCoreRowModel: getCoreRowModel() });

  if (bookings.length === 0) return <p className="owner-table-empty">لسه مفيش حجوزات على ملاعبك.</p>;

  return (
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
  );
}

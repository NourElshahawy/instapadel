"use client";
import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { updateBookingStatus } from "@/services/ownerBookingsClient";

const columnHelper = createColumnHelper();

const STATUS_STYLES = {
  confirmed: "tw-bg-emerald-500/10 tw-text-emerald-400",
  cancelled: "tw-bg-red-500/10 tw-text-red-400",
  completed: "tw-bg-slate-500/10 tw-text-slate-400",
};
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
      cell: (info) => (
        <span className={`tw-text-xs tw-px-2 tw-py-1 tw-rounded-full ${STATUS_STYLES[info.getValue()]}`}>
          {STATUS_LABELS[info.getValue()]}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "إجراءات",
      cell: ({ row }) => {
        const b = row.original;
        if (b.status !== "confirmed") return null;
        return (
          <div className="tw-flex tw-gap-2">
            <button
              onClick={() => handleUpdate(b.id, "completed")}
              disabled={loadingId === b.id}
              className="tw-text-xs tw-bg-emerald-500 tw-text-slate-950 tw-px-2 tw-py-1 tw-rounded tw-font-semibold"
            >
              إتمام
            </button>
            <button
              onClick={() => handleUpdate(b.id, "cancelled")}
              disabled={loadingId === b.id}
              className="tw-text-xs tw-bg-red-500/10 tw-text-red-400 tw-px-2 tw-py-1 tw-rounded tw-font-semibold"
            >
              إلغاء
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({ data: bookings, columns, getCoreRowModel: getCoreRowModel() });

  if (bookings.length === 0) {
    return <p className="tw-text-slate-400 tw-text-sm tw-text-center tw-py-10">لسه مفيش حجوزات على ملاعبك.</p>;
  }

  return (
    <div className="tw-overflow-x-auto">
      <table className="tw-w-full tw-text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="tw-border-b tw-border-slate-800">
              {hg.headers.map((h) => (
                <th key={h.id} className="tw-text-right tw-text-slate-400 tw-font-medium tw-py-3 tw-px-2">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="tw-border-b tw-border-slate-800/50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="tw-py-3 tw-px-2 tw-text-white">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
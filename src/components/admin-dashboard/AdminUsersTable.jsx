"use client";
import { useMemo, useState } from "react";

const ROLE_LABELS = { player: "لاعب", owner: "مالك ملعب", admin: "أدمن" };

export default function AdminUsersTable({ users }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesSearch = !search.trim() || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  return (
    <>
      <div className="admin-filter-tabs">
        {["all", "player", "owner", "admin"].map((r) => (
          <button key={r} className={`admin-filter-tab ${roleFilter === r ? "is-active" : ""}`} onClick={() => setRoleFilter(r)}>
            {r === "all" ? "الكل" : ROLE_LABELS[r]} ({r === "all" ? users.length : users.filter((u) => u.role === r).length})
          </button>
        ))}
      </div>

      <div className="admin-search-bar">
        <input className="admin-search-input" placeholder="دور بالاسم أو الإيميل..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <p className="owner-table-empty">مفيش مستخدمين مطابقين.</p>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الإيميل</th>
                <th>الهاتف</th>
                <th>الدور</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.name || "—"}</td>
                  <td>{u.email || "—"}</td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <span className="owner-status-chip confirmed">{ROLE_LABELS[u.role]}</span>
                  </td>
                  <td>
                    {u.role === "owner" && (
                      <span className={`owner-status-chip ${u.owner_status === "approved" ? "confirmed" : "cancelled"}`}>{u.owner_status === "approved" ? "معتمد" : "قيد المراجعة"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

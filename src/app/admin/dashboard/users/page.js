import { getAllUsersForAdmin } from "@/services/adminUsersService";
import AdminUsersTable from "@/components/admin-dashboard/AdminUsersTable";

export default async function AdminUsersPage() {
  const users = await getAllUsersForAdmin();

  return (
    <>
      <h1 className="owner-page-title">كل المستخدمين ({users.length})</h1>
      <div className="owner-card">
        <AdminUsersTable users={users} />
      </div>
    </>
  );
}

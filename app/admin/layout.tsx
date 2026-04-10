import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import AdminNav from "./AdminNav";

export const metadata = { title: "Admin · Mas Besaura" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAF6]">
      <AdminNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

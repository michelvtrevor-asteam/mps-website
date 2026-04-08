import { authOptions } from "@/lib/auth/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function StaffHome() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Signed in as {session?.user?.email}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          href="/staff/attendance"
        >
          Attendance
          <div className="mt-1 text-xs font-normal text-zinc-600">
            Mark daily attendance
          </div>
        </Link>
      </div>
    </div>
  );
}


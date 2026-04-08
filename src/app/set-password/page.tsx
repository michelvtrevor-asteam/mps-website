import { SetPasswordForm } from "@/app/set-password/SetPasswordForm";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params?.token;
  const token = typeof raw === "string" ? raw : "";
  return <SetPasswordForm token={token} />;
}


import { LoginForm } from "@/app/login/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params?.callbackUrl;
  const callbackUrl =
    typeof raw === "string" && raw.length > 0 ? raw : "/dashboard";

  return <LoginForm callbackUrl={callbackUrl} />;
}


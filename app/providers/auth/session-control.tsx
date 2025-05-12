import { useEffect } from "react";
import { useAuth } from ".";
import { useNavigate } from "@/i18n/navigate";
import { useQueryClient } from "@tanstack/react-query";

function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="text-sm text-zinc-500">Oturum kontrol ediliyor...</p>
      </div>
    </div>
  );
}

export function AlreadyLoginCheck(props: { children: React.ReactNode }) {
  const { status } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "authorize") {
      navigate({ to: "/editor" });
    }
  }, [status, navigate]);

  if (status === "authorize") return null;
  return props.children;
}

export function ProtectedRoute(props: { children: React.ReactNode }) {
  const { status } = useAuth();
  const navigate = useNavigate();
  console.log(status);
  useEffect(() => {
    if (status === "unauthorize") {
      navigate({ to: "/login" });
    }
  }, [status, navigate]);

  if (status === "unauthorize") return null;
  return props.children;
}

export function AuthSessionController(props: { children: React.ReactNode }) {
  const { initialSessionControl, status } = useAuth();
  const queryClient = useQueryClient();

  // Oturum kontrolü yap
  useEffect(() => {
    initialSessionControl();
  }, [initialSessionControl, queryClient]);

  if (status === "loading") {
    return <Loading />;
  }

  return props.children;
}

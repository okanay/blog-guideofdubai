import { PropsWithChildren, useEffect } from "react";
import { useAuth } from ".";
import { useNavigate } from "@/i18n/navigate";
import { AuthStatus } from "./types";

type Props = PropsWithChildren<{
  control?: AuthStatus;
  navigateTo?: string;
}>;

export default function ProtectedRoute({
  children,
  control = "unauthorize",
  navigateTo = "/login",
}: Props) {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "loading") return;

    if (control === "unauthorize") {
      if (status === "unauthorize") {
        navigate({ to: navigateTo, replace: true });
      }
    } else if (control === "authorize") {
      if (status === "authorize") {
        navigate({ to: navigateTo, replace: true });
      }
    }
  }, [status]);

  if (status === "loading") return null;
  if (control === "unauthorize" && status === "unauthorize") return null;
  if (control === "authorize" && status === "authorize") return null;

  return children;
}

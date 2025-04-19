import { useEffect } from "react";
import { useAuth } from ".";

export const InitialSessionControl = () => {
  const { status, initialSessionControl } = useAuth();

  useEffect(() => {
    if (status !== "loading") return;
    initialSessionControl().then(() => console.log("User checked"));
  }, []);

  return <></>;
};

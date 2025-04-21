import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import { TanStackQueryProvider } from "./query";

export const RootProviders = (props: PropsWithChildren) => {
  return (
    <TanStackQueryProvider>
      <Toaster
        position="top-right"
        closeButton={true}
        expand={true}
        richColors={true}
      />
      {props.children}
    </TanStackQueryProvider>
  );
};

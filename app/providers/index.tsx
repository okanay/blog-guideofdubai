import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import { TanStackQueryProvider } from "./query";
import { ScrollToTop } from "./scroll-to-top";

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
      <ScrollToTop />
    </TanStackQueryProvider>
  );
};

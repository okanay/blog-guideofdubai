import { Toaster } from "sonner";
import { Fragment, PropsWithChildren } from "react";

export const RootProviders = (props: PropsWithChildren) => {
  return (
    <Fragment>
      <Toaster
        position="top-right"
        closeButton={true}
        expand={true}
        richColors={true}
      />
      {props.children}
    </Fragment>
  );
};

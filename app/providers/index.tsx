import { ImageProvider } from "./image";
import { Fragment, PropsWithChildren } from "react";

export const RootProviders = (props: PropsWithChildren) => {
  return (
    <Fragment>
      <ImageProvider>{props.children}</ImageProvider>
    </Fragment>
  );
};

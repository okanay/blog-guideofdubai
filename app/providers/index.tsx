import { Fragment, PropsWithChildren } from "react";

export const RootProviders = (props: PropsWithChildren) => {
  return <Fragment>{props.children}</Fragment>;
};

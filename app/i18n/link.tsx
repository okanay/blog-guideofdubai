import React from "react";
import { Link as ReactLink, type LinkProps } from "@tanstack/react-router";
import { useLanguage } from "./use-language";

interface Props extends Omit<LinkProps, "to"> {
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  role?: string;
  "aria-current"?:
    | boolean
    | "date"
    | "time"
    | "true"
    | "false"
    | "page"
    | "step"
    | "location";
}

export const Link: React.FC<Props> = ({ to, children, className, ...rest }) => {
  const { language } = useLanguage();
  const localizedPath =
    to === "/"
      ? `/${language}`
      : `/${language}${to.startsWith("/") ? to : `/${to}`}`;
  return (
    <ReactLink to={localizedPath} className={className} {...rest}>
      {children}
    </ReactLink>
  );
};

Link.displayName = "Link";

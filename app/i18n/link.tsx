import React from "react";
import { Link as RouterLink, type LinkProps } from "@tanstack/react-router";
import { useLanguage } from "./use-language";

interface Props
  extends Omit<React.ComponentPropsWithoutRef<"a">, "children" | "target">,
    Omit<LinkProps, "children" | "target"> {
  target?: React.ComponentPropsWithoutRef<"a">["target"];
  children?: React.ReactNode;
}

// /blog ile başlamıyorsa başına ekle
function ensureBlogPrefix(path: string): string {
  return path.startsWith("/blog") ? path : `/blog/${path}`;
}

function addLangToStringTo(to: string, lang: string): string {
  const [rawPath, query = ""] = to.split("?");
  const path = ensureBlogPrefix(rawPath);
  const params = new URLSearchParams(query);

  if (!params.has("lang")) {
    params.append("lang", lang);
  }

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

function addLangToObjectTo(
  to: LinkProps["to"] & { search?: Record<string, any> },
  lang: string,
) {
  // pathname'i /blog ile başlat
  const pathname = to.pathname ? ensureBlogPrefix(to.pathname) : "/blog";

  // search objesine lang ekle
  const search = { ...(to.search || {}) };
  if (!("lang" in search)) {
    search.lang = lang;
  }
  return { ...to, pathname, search };
}

export const Link: React.FC<Props> = ({ to, children, ...rest }) => {
  const { language } = useLanguage();

  let localizedTo = to;

  if (typeof to === "string") {
    localizedTo = addLangToStringTo(to, language);
  } else if (typeof to === "object" && to !== null) {
    localizedTo = addLangToObjectTo(to, language);
  }

  return (
    <RouterLink
      {...rest}
      to={localizedTo}
      preload={false}
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }}
    >
      {children}
    </RouterLink>
  );
};

Link.displayName = "Link";

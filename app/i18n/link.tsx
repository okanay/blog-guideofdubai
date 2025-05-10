import {
  useRouterState,
  Link as RouterLink,
  type LinkProps,
} from "@tanstack/react-router";
import React, { useMemo } from "react";
import { useLanguage } from "./use-language";
import { twMerge } from "tailwind-merge";

interface Props
  extends Omit<React.ComponentPropsWithoutRef<"a">, "children" | "target">,
    Omit<LinkProps, "children" | "target"> {
  target?: React.ComponentPropsWithoutRef<"a">["target"];
  children?: React.ReactNode;
  active?: string;
  debug?: boolean; // Debug bilgisi göstermek için opsiyonel prop
}

export const Link: React.FC<Props> = ({
  to,
  children,
  className,
  active = "",
  activeOptions = { exact: true },
  ...rest
}) => {
  const { language } = useLanguage();
  const routerState = useRouterState();

  // Helper fonksiyonlar component dışında, burada sadece kullanılıyor
  let localizedTo = to;
  if (typeof to === "string") {
    localizedTo = addLangToStringTo(to, language);
  } else if (typeof to === "object" && to !== null) {
    localizedTo = addLangToObjectTo(to, language);
  }

  const isActive = useMemo(() => {
    const currentPath = routerState.location.pathname;
    const currentSearch = new URLSearchParams(routerState.location.search);
    let targetPath = "";
    let targetSearch = new URLSearchParams();

    if (typeof localizedTo === "string") {
      const [path, search = ""] = localizedTo.split("?");
      targetPath = path;
      targetSearch = new URLSearchParams(search);
    } else if (typeof localizedTo === "object" && localizedTo !== null) {
      targetPath = localizedTo.pathname || "";
      targetSearch = new URLSearchParams(localizedTo.search || {});
    }

    const pathMatch = activeOptions.exact
      ? currentPath === targetPath
      : currentPath.startsWith(targetPath);

    const langMatch = currentSearch.get("lang") === targetSearch.get("lang");

    return pathMatch && langMatch;
  }, [
    routerState.location.pathname,
    routerState.location.search,
    localizedTo,
    activeOptions.exact,
  ]);

  return (
    <RouterLink
      {...rest}
      preload={false}
      to={localizedTo}
      className={twMerge(className, isActive && active)}
      resetScroll={true}
    >
      {children}
    </RouterLink>
  );
};

Link.displayName = "Link";

// /blog ile başlamıyorsa başına ekle
function ensureBlogPrefix(path: string): string {
  // Tüm slashları temizle
  const trimmedPath = path.replace(/^\/+/, ""); // Baştaki tüm slashları kaldır

  if (trimmedPath.startsWith("blog/")) {
    return `/${trimmedPath}`;
  }

  return `/blog/${trimmedPath}`;
}

function addLangToStringTo(to: string, lang: string): string {
  // Boş değer kontrolü
  if (!to) return `/blog?lang=${lang}`;

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

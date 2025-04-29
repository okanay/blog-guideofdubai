import {
  useNavigate as useRouterNavigate,
  NavigateOptions,
} from "@tanstack/react-router";
import { useLanguage } from "./use-language";

function ensureBlogPrefix(path: string): string {
  return path.startsWith("/blog")
    ? path
    : `/blog${path.startsWith("/") ? "" : "/"}${path}`;
}

function addLangToStringTo(to: string, lang: string): string {
  // Path ve query'yi ayır
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
  to: NavigateOptions["to"] & { search?: Record<string, any> },
  lang: string,
) {
  // Pathname'i /blog ile başlat
  const pathname = to.pathname ? ensureBlogPrefix(to.pathname) : "/blog";

  // Search objesine lang ekle
  const search = { ...(to.search || {}) };
  if (!("lang" in search)) {
    search.lang = lang;
  }
  return { ...to, pathname, search };
}

export function useNavigate() {
  const navigate = useRouterNavigate();
  const { language } = useLanguage();

  return (options: NavigateOptions) => {
    let to = options.to;

    if (typeof to === "string") {
      to = addLangToStringTo(to, language);
    } else if (typeof to === "object" && to !== null) {
      to = addLangToObjectTo(to, language);
    }

    return navigate({ ...options, to });
  };
}

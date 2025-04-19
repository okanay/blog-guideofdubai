import {
  useNavigate as useRouterNavigate,
  NavigateOptions,
} from "@tanstack/react-router";
import { useLanguage } from "./use-language";

export function useNavigate() {
  const navigate = useRouterNavigate();
  const { language } = useLanguage();

  return (options: NavigateOptions) => {
    if (typeof options.to === "string") {
      const localizedPath =
        options.to === "/"
          ? `/${language}`
          : `/${language}${options.to.startsWith("/") ? options.to : `/${options.to}`}`;

      return navigate({ ...options, to: localizedPath });
    }

    return navigate(options);
  };
}

import { Link } from "@/i18n/link";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "react-i18next";

export const RootHeader = () => {
  const { t } = useTranslation();

  const items = {
    main: [
      {
        name: t("header.nav.main.hotels"),
        to: "https://guideofdubai.com/hotels",
      },
      {
        name: t("header.nav.main.desert_safari"),
        to: "https://guideofdubai.com/tour/dubai-safari-tour",
      },
      {
        name: t("header.nav.main.city_tours"),
        to: "https://guideofdubai.com/toursandtickets?c=1",
      },
      {
        name: t("header.nav.main.activities"),
        to: "https://guideofdubai.com/toursandtickets",
      },
      {
        name: t("header.nav.main.rent_car"),
        to: "https://guideofdubai.com/rental-cars",
      },
      {
        name: t("header.nav.main.dubai_visa"),
        to: "https://guideofdubai.com/visa",
      },
    ],
    sub: [
      {
        name: t("header.nav.sub.museum"),
        to: "https://guideofdubai.com/ticket/museum-of-the-future",
      },
      {
        name: t("header.nav.sub.burj_khalifa"),
        to: "https://guideofdubai.com/ticket/burj-khalifa-at-the-top-level-125-124",
      },
      {
        name: t("header.nav.sub.dubai_frame"),
        to: "https://guideofdubai.com/ticket/dubai-frame",
      },
      {
        name: t("header.nav.sub.dubai_city_tour"),
        to: "https://guideofdubai.com/tour/dubai-iconic-places-tour",
      },
      {
        name: t("header.nav.sub.rent_yacht"),
        to: "https://guideofdubai.com/rent-a-yacht",
      },
      {
        name: t("header.nav.sub.restaurants"),
        to: "https://guideofdubai.com/restaurants",
      },
    ],
  };

  return (
    <header
      className="relative z-50 w-full border-b border-zinc-200 bg-white md:border-b-0 md:pb-0"
      role="banner"
    >
      <div className="relative mx-auto flex items-start justify-between px-4 py-2 md:px-0 md:py-0">
        {/* Logo - Left Section */}
        <Link
          to=""
          aria-label={t("header.return_homepage")}
          className="top-1.5 left-4 z-20 shrink-0 transition-opacity duration-300 focus:opacity-75 focus:outline-none md:absolute"
        >
          <img
            src="/images/brand.svg"
            alt={t("header.brand_logo_alt")}
            loading="eager"
            className="h-10 w-fit"
            width="120"
            height="40"
          />
        </Link>

        {/* Main Menu Navigation - Center Section */}
        <nav
          aria-label={t("header.main_menu")}
          className="hidden w-full flex-col items-center md:flex"
        >
          <ul
            id="main-navigation-menu"
            className="flex items-center justify-center gap-6 overflow-x-auto py-3.5"
            role="menubar"
            aria-label={t("header.main_menu")}
          >
            {items.main.map((item) => (
              <li
                key={"main-nav-group-" + item.name}
                role="none"
                className="text-primary before:bg-primary relative font-medium tracking-wide text-nowrap"
              >
                <a
                  href={item.to}
                  className="text-xs transition-opacity duration-300 ease-in-out hover:opacity-90 focus:opacity-75 focus:outline-none"
                  role="menuitem"
                  aria-current={location?.pathname === item.to ? "page" : false}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <ul
            id="sub-navigation-menu"
            className="bg-primary mx-auto flex w-full items-center justify-center gap-6 overflow-x-auto px-4 py-1"
            role="menubar"
            aria-label={t("header.dubai_travel_points")}
          >
            {items.sub.map((item) => (
              <li
                key={"sub-nav-group-" + item.name}
                role="none"
                className="text-color-primary before:bg-color-font relative font-medium tracking-wide text-nowrap"
              >
                <a
                  href={item.to}
                  className="text-[0.6rem] uppercase transition-opacity duration-300 ease-in-out hover:opacity-90 focus:opacity-75 focus:outline-none"
                  role="menuitem"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section - Language & CTA */}
        <div className="top-1 right-4 z-20 flex shrink-0 items-center gap-4 md:absolute">
          <LanguageSwitcher />
          <a
            href="https://guideofdubai.com/"
            className="text-color-primary border-primary-cover bg-primary flex h-11 items-center justify-center rounded-xs border px-6 text-center text-sm font-bold tracking-wide transition-opacity duration-300 ease-in-out hover:opacity-75 focus:opacity-75 focus:outline-none"
            aria-label={t("header.visit_main_website")}
          >
            {t("header.visit_now")}
          </a>
        </div>
      </div>
    </header>
  );
};

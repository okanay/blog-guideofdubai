import { Link } from "@/i18n/link";
import LanguageSwitcher from "./language-switcher";

export const RootHeader = () => {
  const items = {
    main: [
      {
        name: "Hotels",
        to: "https://guideofdubai.com/hotels",
      },
      {
        name: "Desert Safari",
        to: "https://guideofdubai.com/tour/dubai-safari-tour",
      },
      {
        name: "City Tours",
        to: "https://guideofdubai.com/toursandtickets?c=1",
      },
      {
        name: "Activities",
        to: "https://guideofdubai.com/toursandtickets",
      },
      {
        name: "Rent a Car",
        to: "https://guideofdubai.com/rental-cars",
      },
      {
        name: "Dubai Visa",
        to: "https://guideofdubai.com/visa",
      },
    ],
    sub: [
      {
        name: "MUSEUM OF THE FUTURE",
        to: "https://guideofdubai.com/ticket/museum-of-the-future",
      },
      {
        name: "BURJ KHALIFA",
        to: "https://guideofdubai.com/ticket/burj-khalifa-at-the-top-level-125-124",
      },
      {
        name: "DUBAI FRAME",
        to: "https://guideofdubai.com/ticket/dubai-frame",
      },
      {
        name: "DUBAI CITY TOUR",
        to: "https://guideofdubai.com/tour/dubai-iconic-places-tour",
      },
      {
        name: "RENT A YACHT",
        to: "https://guideofdubai.com/rent-a-yacht",
      },
      {
        name: "RESTAURANTS",
        to: "https://guideofdubai.com/restaurants",
      },
    ],
  };

  return (
    <header
      className="relative w-full border-b border-zinc-200 bg-white py-1 md:border-b-0 md:pb-0"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
        <Link
          to=""
          aria-label="Guide of Dubai - Return to homepage"
          className="transition-opacity duration-300 focus:opacity-75 focus:outline-none"
        >
          <img
            src="/images/brand.svg"
            alt="Guide of Dubai Brand Logo"
            loading="eager"
            className="h-10 w-fit"
            width="120"
            height="40"
          />
        </Link>

        {/* Main Menu Navigation */}
        <nav aria-label="Main menu navigation" className="hidden md:block">
          <ul
            id="main-navigation-menu"
            className="flex items-center gap-6"
            role="menubar"
            aria-label="Main menu"
          >
            {items.main.map((item) => (
              <li
                key={"main-nav-group-" + item.name}
                role="none"
                className="text-primary before:bg-primary relative font-medium tracking-wide"
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
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href="https://guideofdubai.com/"
            className="text-color-primary border-primary-cover bg-primary flex h-11 items-center justify-center rounded-xs border px-6 text-center text-sm font-bold tracking-wide transition-opacity duration-300 ease-in-out hover:opacity-75 focus:opacity-75 focus:outline-none"
            aria-label="Visit Guide of Dubai main website"
          >
            Visit Now
          </a>
        </div>
      </div>

      {/* Sub Menu Navigation */}
      <div className="border-primary-cover bg-primary hidden border-y pt-1 pb-1.5 backdrop-blur-sm md:block">
        <nav aria-label="Sub menu navigation">
          <ul
            id="sub-navigation-menu"
            className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4"
            role="menubar"
            aria-label="Dubai travel points"
          >
            {items.sub.map((item) => (
              <li
                key={"sub-nav-group-" + item.name}
                role="none"
                className="text-color-primary before:bg-color-font relative font-medium tracking-wide"
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
      </div>
    </header>
  );
};

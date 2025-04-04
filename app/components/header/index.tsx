import { Link } from "@/i18n/link";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";

export const RootHeader = () => {
  const items = {
    main: [
      {
        name: "Hotels",
        to: "/blog/hotels",
      },
      {
        name: "Desert Safari",
        to: "/blog/desert-safari",
      },
      {
        name: "City Tours",
        to: "/blog/city-tours",
      },
      {
        name: "Activities",
        to: "/blog/activities",
      },
      {
        name: "Rent a Car",
        to: "/blog/rent-a-car",
      },
      {
        name: "Dubai Visa",
        to: "/blog/dubai-visa",
      },
    ],
    sub: [
      {
        name: "Museum of the Future",
        to: "/blog/museum-of-the-future",
      },
      {
        name: "Burj Khalifa",
        to: "/blog/burj-khalifa",
      },
      {
        name: "Dubai Frame",
        to: "/blog/dubai-frame",
      },
      {
        name: "Dubai City Tour",
        to: "/blog/dubai-city-tour",
      },
      {
        name: "Rent a Yacht",
        to: "/blog/rent-a-yacht",
      },
      {
        name: "Restaurants",
        to: "/blog/restaurants",
      },
    ],
  };

  return (
    <header
      className="relative z-20 w-full border-b border-zinc-200 py-1 md:border-b-0 md:bg-zinc-50 md:pb-0"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
        <Link to="/" aria-label="Guide of Dubai - Return to homepage">
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
                className="text-primary before:bg-primary relative font-medium tracking-wide transition-[width_opacity] duration-500 ease-in-out hover:opacity-90"
              >
                <Link
                  to={item.to}
                  className="text-xs"
                  role="menuitem"
                  aria-current={location?.pathname === item.to ? "page" : false}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="https://guideofdubai.com/"
          className="text-color-primary border-primary-cover bg-primary flex h-11 items-center justify-center rounded-xs border px-6 text-center text-sm font-bold tracking-wide transition-[opacity] duration-500 ease-in-out hover:opacity-75"
          aria-label="Visit Guide of Dubai main website"
          rel="noopener noreferrer"
          target="_blank"
        >
          Visit Now
        </a>
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
                className="text-color-primary before:bg-color-font relative font-medium tracking-wide transition-[opacity] duration-500 ease-in-out hover:opacity-90"
              >
                <Link
                  to={item.to}
                  className="text-[0.6rem] uppercase"
                  role="menuitem"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

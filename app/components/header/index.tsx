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
      className="md:border-primary-light w-full bg-gradient-to-tr from-zinc-100/20 to-zinc-400/10 backdrop-blur-sm md:border-b"
      role="banner"
    >
      <div className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
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
              className="flex items-center gap-6 text-xs font-semibold tracking-wide lg:text-sm"
              role="menubar"
              aria-label="Main menu"
            >
              {items.main.map((item) => (
                <li key={"main-nav-group-" + item.name} role="none">
                  <Link
                    to={item.to}
                    className="hover:!text-primary-light text-color-font tracking-wide transition-colors duration-500"
                    activeProps={{
                      className: "!text-primary",
                    }}
                    aria-current={
                      location?.pathname === item.to ? "page" : undefined
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="https://guideofdubai.com/"
            className="text-color-primary border-primary from-primary to-primary-light flex h-11 items-center justify-center rounded-xs border bg-gradient-to-br px-6 text-center text-sm font-bold tracking-wide transition-[opacity_transform] duration-500 ease-in-out hover:opacity-75 active:scale-95"
            aria-label="Visit Guide of Dubai main website"
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit Now
          </a>
        </div>
      </div>

      {/* Sub Menu Navigation */}
      <div className="from-primary to-primary-light hidden bg-gradient-to-br py-2 backdrop-blur-sm md:block">
        <nav aria-label="Sub menu navigation">
          <ul
            id="sub-navigation-menu"
            className="text-color-font-invert mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 text-[0.65rem] font-medium tracking-wider lg:text-xs"
            role="menubar"
            aria-label="Dubai travel points"
          >
            {items.sub.map((item) => (
              <li key={"sub-nav-group-" + item.name} role="none">
                <Link
                  to={item.to}
                  className="hover:!text-primary-100 text-color-primary tracking-wide transition-colors duration-500"
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

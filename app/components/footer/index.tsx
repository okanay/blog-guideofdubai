/* prettier-ignore */
import { Compass, Phone, Bed, Car, ShipWheel, Heart, BookOpen, Building2, TabletSmartphone, Instagram, Palmtree } from "lucide-react";
/* prettier-ignore */
import { VisaSVG, SafariSVG, DubaiCityTourSVG, JetskiSVG, BurjSVG, AbuDhabiCityTourSVG, MuseumSVG, MiracleGardenSVG, HelicipterSVG, AppleSVG, AndroidSVG, WhatsAppSVG } from "./icons/";

export const RootFooter = () => {
  const otherServices = [
    {
      title: "Hotel Accommodation",
      description:
        "Discover the best hotels in Dubai and enjoy a luxurious stay.",
      icon: <Bed className="size-6" />,
      link: "https://guideofdubai.com/hotels",
    },
    {
      title: "Car Rental",
      description: "Rent a car and explore Dubai at your own pace.",
      icon: <Car className="size-6" />,
      link: "https://guideofdubai.com/rental-cars",
    },
    {
      title: "Dubai Visa",
      description: "Easily apply for your Dubai visa and travel hassle-free.",
      icon: <VisaSVG />,
      link: "https://guideofdubai.com/visa",
    },
    {
      title: "Yacht Rental",
      description:
        "Enjoy a luxury yacht experience in Dubai's stunning waters.",
      icon: <ShipWheel className="size-6" />,
      link: "https://guideofdubai.com/rent-a-yacht",
    },
  ];

  const popularActivities = [
    {
      title: "Dubai Safari Tour",
      description: "Experience an unforgettable adventure in the desert sands.",
      icon: <SafariSVG />,
      link: "https://guideofdubai.com/tour/dubai-safari-tour",
    },
    {
      title: "Museum of the Future",
      description: "A unique experience to explore the world of the future.",
      icon: <MuseumSVG />,
      link: "https://guideofdubai.com/ticket/museum-of-the-future",
    },
    {
      title: "Dubai City Tour",
      description: "Discover the fascinating highlights of Dubai.",
      icon: <DubaiCityTourSVG />,
      link: "https://guideofdubai.com/tour/dubai-iconic-places-tour",
    },
    {
      title: "Burj Khalifa",
      description:
        "Enjoy the breathtaking view from the world's tallest building.",
      icon: <BurjSVG />,
      link: "https://guideofdubai.com/ticket/burj-khalifa-at-the-top-level-125-124",
    },
    {
      title: "Abu Dhabi City Tour",
      description:
        "Explore the historical and modern sights of the UAE capital.",
      icon: <AbuDhabiCityTourSVG />,
      link: "https://guideofdubai.com/tour/abu-dhabi-iconic-places-tour",
    },
    {
      title: "Miracle Garden",
      description:
        "Step into the world's largest flower garden with breathtaking displays.",
      icon: <MiracleGardenSVG />,
      link: "https://guideofdubai.com/ticket/dubai-miracle-garden",
    },
    {
      title: "Dubai Helicopter Tour",
      description: "Soar over Dubai's stunning skyline and landmarks.",
      icon: <HelicipterSVG />,
      link: "https://guideofdubai.com/tour/helicopter-ride-in-dubai",
    },
    {
      title: "Dubai Jetski Tour",
      description:
        "Experience speed and adrenaline on Dubai's crystal-clear waters.",
      icon: <JetskiSVG />,
      link: "https://guideofdubai.com/tour/jetski-tour",
    },
  ];

  const contractsLinks = [
    { title: "Terms of Use", link: "https://guideofdubai.com/terms" },
    { title: "GDPR Policy", link: "https://guideofdubai.com/gdpr" },
    { title: "Privacy Policy", link: "https://guideofdubai.com/privacy" },
    { title: "Sales Agreement", link: "https://guideofdubai.com/sales" },
  ];

  const companyLinks = [
    { title: "About Us", link: "https://guideofdubai.com/aboutus" },
    { title: "Contact", link: "https://guideofdubai.com/contact" },
    { title: "FAQ", link: "https://guideofdubai.com/faq" },
  ];

  const ServiceCard = ({ title, description, icon, link }) => (
    <a
      href={link}
      className="group relative flex items-center gap-3 rounded-lg py-3 md:items-start"
    >
      <div className="absolute -inset-x-2 -inset-y-4 top-0 -z-10 scale-95 bg-zinc-50 opacity-0 transition sm:rounded-2xl group-hover:sm:scale-100 group-hover:sm:opacity-100"></div>
      <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white">
        {icon}
      </div>
      <div>
        <h3 className="mb-0.5 font-medium">{title}</h3>
        <p className="relative text-sm text-zinc-400">
          <span className="invisible line-clamp-1">{description}</span>
          <span className="absolute top-0 left-0 group-hover:line-clamp-none lg:line-clamp-1">
            {description}
          </span>
        </p>
      </div>
    </a>
  );

  const SimpleLink = ({ title, link }) => (
    <a href={link} className="block py-1 hover:underline">
      {title}
    </a>
  );

  const SectionHeader = ({ icon, title }) => (
    <h3 className="mb-6 flex items-center gap-2 border-b border-zinc-200 pb-2 text-lg font-semibold">
      {icon}
      {title}
    </h3>
  );

  return (
    <footer className="relative w-full overflow-hidden bg-white text-zinc-900">
      <div className="relative z-10">
        {/* Top Banner Section */}
        <div className="border-y border-zinc-200/60 bg-gradient-to-r from-zinc-50 to-zinc-100">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center justify-between gap-x-12 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
            {/* Left Column - Content */}
            <div className="py-8 text-center md:max-w-lg md:text-left lg:col-span-2">
              <h2 className="mb-4 text-3xl font-bold">
                Experience the Best of Dubai!
              </h2>
              <p className="mx-auto mb-6 px-4 text-base text-zinc-800 sm:px-0 sm:text-lg">
                Turn your Dubai trip into an unforgettable adventure! Explore
                exclusive activities, luxury yacht tours, desert safaris, and
                more. Book now and make your dream vacation a reality.
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                <a
                  href="https://guideofdubai.com/toursandtickets"
                  className="text-primary-500 rounded-lg border border-zinc-200/60 bg-white px-6 py-3 font-medium transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
                >
                  View All Activities
                </a>
                <a
                  href="https://guideofdubai.com/toursandtickets?c=1"
                  className="bg-primary rounded-lg border border-white px-6 py-3 font-medium text-white transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
                >
                  Exclusive Private Tours
                </a>
              </div>
            </div>

            {/* Right Column - Contact */}
            <div className="border-primary-800 bg-primary relative flex h-full w-full flex-col justify-center border-x px-6 py-8 text-center text-white lg:h-[300px] lg:w-full">
              <h3 className="mb-4 text-xl font-semibold">Need Assistance?</h3>
              <div className="mb-6 flex justify-center gap-6">
                <a
                  href="tel:+971568000304"
                  className="group flex flex-col items-center transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
                >
                  <div className="text-primary-600 group-hover:bg-primary-50 mb-2 flex size-14 items-center justify-center rounded-full border border-zinc-200/60 bg-white transition-all">
                    <Phone className="size-6" />
                  </div>
                  <span className="text-sm font-medium">Call Now</span>
                </a>
                <a
                  href="https://wa.me/+971568000304"
                  className="group flex flex-col items-center transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
                >
                  <div className="group-hover:bg-primary-50 mb-2 flex size-14 items-center justify-center rounded-full border border-zinc-200/60 bg-white text-green-600 transition-all">
                    <WhatsAppSVG />
                  </div>
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              </div>
              <a
                href="tel:+971568000304"
                className="block text-center text-xl font-semibold transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
              >
                +971 56 800 0304
              </a>
              <p className="text-primary-200 mt-1 text-center text-xs">
                24/7 Customer Support – We're here for you anytime, anywhere!
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="px-4 py-6 sm:py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
            {/* Other Services Section */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <SectionHeader
                icon={<Compass className="size-5" />}
                title="Other Services"
              />

              <div className="col-span-1 -mt-2 grid grid-cols-1 gap-x-8 gap-y-4 sm:mt-0 sm:grid-cols-2 lg:grid-cols-1">
                {otherServices.map((service, index) => (
                  <ServiceCard
                    key={index}
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    link={service.link}
                  />
                ))}
              </div>
            </div>

            {/* Popular Activities Section */}
            <div className="col-span-1 sm:col-span-2">
              <SectionHeader
                icon={<Palmtree className="size-5" />}
                title="Popular Activities"
              />
              <div className="-mt-2 grid grid-cols-1 gap-x-8 gap-y-4 sm:mt-0 sm:grid-cols-2">
                {popularActivities.map((activity, index) => (
                  <ServiceCard
                    key={index}
                    title={activity.title}
                    description={activity.description}
                    icon={activity.icon}
                    link={activity.link}
                  />
                ))}
              </div>
            </div>

            {/* Contracts & Policies Section */}
            <div className="col-span-1">
              <SectionHeader
                icon={<BookOpen className="size-5" />}
                title="Contracts & Policies"
              />
              <div className="-mt-2 space-y-3 sm:mt-0">
                {contractsLinks.map((link, index) => (
                  <SimpleLink key={index} title={link.title} link={link.link} />
                ))}
              </div>
            </div>

            {/* Guide of Dubai Section */}
            <div className="col-span-1">
              <SectionHeader
                icon={<Building2 className="size-5" />}
                title="Guide of Dubai"
              />
              <div className="-mt-3 space-y-3 sm:mt-0">
                {companyLinks.map((link, index) => (
                  <SimpleLink key={index} title={link.title} link={link.link} />
                ))}
              </div>
            </div>

            {/* Mobile App Section */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex w-full flex-col gap-2">
                <SectionHeader
                  icon={<TabletSmartphone className="size-5" />}
                  title="Mobile App"
                />
                <p className="-mt-3 text-base font-medium sm:-mt-2">
                  Download our mobile app
                </p>
                <p className="-mt-1 mb-1 text-sm text-zinc-400">
                  Use our app for faster booking and special offers.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://apps.apple.com/us/app/guide-of-dubai/id6741478557?uo=2"
                    className="inline-flex items-center rounded border border-zinc-200/50 bg-zinc-100 px-5 py-3 transition-[opacity,transform] duration-300 hover:bg-zinc-100 hover:opacity-75 focus:outline-none active:scale-95"
                  >
                    <AppleSVG />
                    <span className="ml-4 flex flex-col items-start leading-none">
                      <span className="mb-1 text-[0.6rem] text-zinc-600 uppercase">
                        Download
                      </span>
                      <span className="title-font font-medium">App Store</span>
                    </span>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.herakletit.guideofdubai&hl=en"
                    className="inline-flex items-center rounded border border-zinc-200/50 bg-zinc-100 px-5 py-3 transition-[opacity,transform] duration-300 hover:bg-zinc-100 hover:opacity-75 focus:outline-none active:scale-95"
                  >
                    <AndroidSVG />
                    <span className="ml-4 flex flex-col items-start leading-none">
                      <span className="mb-1 text-[0.6rem] text-zinc-600 uppercase">
                        Download
                      </span>
                      <span className="title-font font-medium">
                        Google Play
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="bg-primary px-4 py-6 sm:py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <img
                src="/images/brand.svg"
                alt="Guide of Dubai"
                className="h-10 w-auto brightness-0 invert"
              />
              <div
                className="text-sm text-pretty text-white"
                style={{ maxWidth: "360px" }}
              >
                <p>
                  HOI HOLDING. All rights reserved © 2025 - We are here for a
                  reliable travel experience
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://instagram.com/guideofdubai"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
              >
                <Instagram className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

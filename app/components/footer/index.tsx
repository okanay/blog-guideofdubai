/* prettier-ignore */
import { Compass, Phone, Bed, Car, ShipWheel, BookOpen, Building2, TabletSmartphone, Instagram, Palmtree } from "lucide-react";
/* prettier-ignore */
import { VisaSVG, SafariSVG, DubaiCityTourSVG, JetskiSVG, BurjSVG, AbuDhabiCityTourSVG, MuseumSVG, MiracleGardenSVG, HelicipterSVG, AppleSVG, AndroidSVG, WhatsAppSVG } from "./icons/";
import { useTranslation } from "react-i18next";

export const RootFooter = () => {
  const { t } = useTranslation();

  const otherServices = [
    {
      title: t("footer.services.hotel.title"),
      description: t("footer.services.hotel.description"),
      icon: <Bed className="size-6" />,
      link: "https://guideofdubai.com/hotels",
    },
    {
      title: t("footer.services.car.title"),
      description: t("footer.services.car.description"),
      icon: <Car className="size-6" />,
      link: "https://guideofdubai.com/rental-cars",
    },
    {
      title: t("footer.services.visa.title"),
      description: t("footer.services.visa.description"),
      icon: <VisaSVG />,
      link: "https://guideofdubai.com/visa",
    },
    {
      title: t("footer.services.yacht.title"),
      description: t("footer.services.yacht.description"),
      icon: <ShipWheel className="size-6" />,
      link: "https://guideofdubai.com/rent-a-yacht",
    },
  ];

  const popularActivities = [
    {
      title: t("footer.activities.safari.title"),
      description: t("footer.activities.safari.description"),
      icon: <SafariSVG />,
      link: "https://guideofdubai.com/tour/dubai-safari-tour",
    },
    {
      title: t("footer.activities.museum.title"),
      description: t("footer.activities.museum.description"),
      icon: <MuseumSVG />,
      link: "https://guideofdubai.com/ticket/museum-of-the-future",
    },
    {
      title: t("footer.activities.dubai_tour.title"),
      description: t("footer.activities.dubai_tour.description"),
      icon: <DubaiCityTourSVG />,
      link: "https://guideofdubai.com/tour/dubai-iconic-places-tour",
    },
    {
      title: t("footer.activities.burj.title"),
      description: t("footer.activities.burj.description"),
      icon: <BurjSVG />,
      link: "https://guideofdubai.com/ticket/burj-khalifa-at-the-top-level-125-124",
    },
    {
      title: t("footer.activities.abu_dhabi.title"),
      description: t("footer.activities.abu_dhabi.description"),
      icon: <AbuDhabiCityTourSVG />,
      link: "https://guideofdubai.com/tour/abu-dhabi-iconic-places-tour",
    },
    {
      title: t("footer.activities.miracle.title"),
      description: t("footer.activities.miracle.description"),
      icon: <MiracleGardenSVG />,
      link: "https://guideofdubai.com/ticket/dubai-miracle-garden",
    },
    {
      title: t("footer.activities.helicopter.title"),
      description: t("footer.activities.helicopter.description"),
      icon: <HelicipterSVG />,
      link: "https://guideofdubai.com/tour/helicopter-ride-in-dubai",
    },
    {
      title: t("footer.activities.jetski.title"),
      description: t("footer.activities.jetski.description"),
      icon: <JetskiSVG />,
      link: "https://guideofdubai.com/tour/jetski-tour",
    },
  ];

  const contractsLinks = [
    {
      title: t("footer.links.terms"),
      link: "https://guideofdubai.com/terms",
    },
    {
      title: t("footer.links.gdpr"),
      link: "https://guideofdubai.com/gdpr",
    },
    {
      title: t("footer.links.privacy"),
      link: "https://guideofdubai.com/privacy",
    },
    {
      title: t("footer.links.sales"),
      link: "https://guideofdubai.com/sales",
    },
  ];

  const companyLinks = [
    {
      title: t("footer.links.about"),
      link: "https://guideofdubai.com/aboutus",
    },
    {
      title: t("footer.links.contact"),
      link: "https://guideofdubai.com/contact",
    },
    { title: t("footer.links.faq"), link: "https://guideofdubai.com/faq" },
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
              <h2 className="mb-4 text-3xl font-bold sm:line-clamp-1">
                {t("footer.experience_title")}
              </h2>
              <p className="mx-auto mb-6 px-4 text-base text-zinc-800 sm:line-clamp-3 sm:px-0 sm:text-lg">
                {t("footer.experience_description")}
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                <a
                  href="https://guideofdubai.com/toursandtickets"
                  className="text-primary-500 rounded-lg border border-zinc-200/60 bg-white px-6 py-3 font-medium transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
                >
                  {t("footer.view_activities")}
                </a>
                <a
                  href="https://guideofdubai.com/toursandtickets?c=1"
                  className="bg-primary rounded-lg border border-white px-6 py-3 font-medium text-white transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
                >
                  {t("footer.exclusive_tours")}
                </a>
              </div>
            </div>

            {/* Right Column - Contact */}
            <div className="border-primary-800 bg-primary relative flex h-full w-full flex-col justify-center border-x px-6 py-8 text-center text-white lg:h-[300px] lg:w-full">
              <h3 className="mb-4 text-xl font-semibold">
                {t("footer.need_assistance")}
              </h3>
              <div className="mb-6 flex justify-center gap-6">
                <a
                  href="tel:+971568000304"
                  className="group flex flex-col items-center transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
                >
                  <div className="text-primary-600 group-hover:bg-primary-50 mb-2 flex size-14 items-center justify-center rounded-full border border-zinc-200/60 bg-white transition-all">
                    <Phone className="size-6" />
                  </div>
                  <span className="text-sm font-medium">
                    {t("footer.call_now")}
                  </span>
                </a>
                <a
                  href="https://wa.me/+971568000304"
                  className="group flex flex-col items-center transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
                >
                  <div className="group-hover:bg-primary-50 mb-2 flex size-14 items-center justify-center rounded-full border border-zinc-200/60 bg-white text-green-600 transition-all">
                    <WhatsAppSVG />
                  </div>
                  <span className="text-sm font-medium">
                    {t("footer.whatsapp")}
                  </span>
                </a>
              </div>
              <a
                href="tel:+971568000304"
                className="block text-center text-xl font-semibold transition-[opacity,transform] duration-300 hover:opacity-75 active:scale-95"
              >
                +971 56 800 0304
              </a>
              <p className="text-primary-200 mt-1 text-center text-xs">
                {t("footer.support_text")}
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
                title={t("footer.other_services")}
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
                title={t("footer.popular_activities")}
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
                title={t("footer.contracts_policies")}
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
                title={t("footer.guide_of_dubai")}
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
                  title={t("footer.mobile_app")}
                />
                <p className="-mt-3 text-base font-medium sm:-mt-2">
                  {t("footer.download_app")}
                </p>
                <p className="-mt-1 mb-1 text-sm text-zinc-400">
                  {t("footer.app_description")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://apps.apple.com/us/app/guide-of-dubai/id6741478557?uo=2"
                    className="inline-flex items-center rounded border border-zinc-200/50 bg-zinc-100 px-5 py-3 transition-[opacity,transform] duration-300 hover:bg-zinc-100 hover:opacity-75 focus:outline-none active:scale-95"
                  >
                    <AppleSVG />
                    <span className="ml-4 flex flex-col items-start leading-none">
                      <span className="mb-1 text-[0.6rem] text-zinc-600 uppercase">
                        {t("footer.download")}
                      </span>
                      <span className="title-font font-medium">
                        {t("footer.app_store")}
                      </span>
                    </span>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.herakletit.guideofdubai&hl=en"
                    className="inline-flex items-center rounded border border-zinc-200/50 bg-zinc-100 px-5 py-3 transition-[opacity,transform] duration-300 hover:bg-zinc-100 hover:opacity-75 focus:outline-none active:scale-95"
                  >
                    <AndroidSVG />
                    <span className="ml-4 flex flex-col items-start leading-none">
                      <span className="mb-1 text-[0.6rem] text-zinc-600 uppercase">
                        {t("footer.download")}
                      </span>
                      <span className="title-font font-medium">
                        {t("footer.google_play")}
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
                <p>{t("footer.copyright")}</p>
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

import Arrow from "@/components/Arrow";
import Motion from "@/components/Motion";
import {
  address,
  author,
  brand,
  email,
  external,
  members,
  portfolioUrl,
  projects,
  services,
  tagline,
} from "@/lib/content";

const nav = [
  { label: "ABOUT", href: "#about", hint: "WHO WE ARE" },
  { label: "PROJECTS", href: "#projects", hint: "SELECTED WORKS" },
  { label: "MEMBERS", href: "#members", hint: "OUR TEAM" },
];

function SwapLink({ className }: { className: string }) {
  return (
    <a href={portfolioUrl} {...external} className={`${className} anton swap-link`}>
      <span className="text-wrapper">
        <span className="swap-label swap-label--default">{email}</span>
        <span className="swap-label swap-label--clone">{email}</span>
      </span>
      <span className="divider" />
      <span className="text-wrapper">
        <Arrow className="swap-arrow swap-arrow--default" />
        <Arrow className="swap-arrow swap-arrow--clone" />
      </span>
    </a>
  );
}

function SlideUp({ children }: { children: string }) {
  return (
    <span className="text-wrapper">
      <span>{children}</span>
      <span>{children}</span>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <Motion />

      <div className="menu js-menu">
        <div className="menu__wrapper">
          <ul className="menu__list">
            <li>
              <p className="anton">
                <span className="text-wrapper">
                  <span>[MENU]</span>
                </span>
              </p>
            </li>
            {nav.map((n) => (
              <li key={n.href}>
                <a className="anton js-smooth-scroll" href={n.href}>
                  <span className="text-wrapper">
                    <span>{n.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="divider" />
          <div className="menu__contact">
            <p className="anton">
              <span className="text-wrapper">
                <span>[EMAIL]</span>
              </span>
            </p>
            <a className="anton" href={portfolioUrl} {...external}>
              <span className="text-wrapper">
                <span>{email}</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <header className="header js-header">
        <div className="header__wrapper">
          <ul className="header__list">
            {nav.map((n) => (
              <li key={n.href} className="header__item">
                <a className="header__item-link anton js-smooth-scroll" href={n.href}>
                  <span className="header__item-label header__item-label--default">
                    {n.label}
                  </span>
                  <span className="header__item-label header__item-label--clone">
                    {n.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="menu-button js-menu-button">
          <button className="menu-button__button anton" type="button">
            <span className="text-wrapper">
              <span className="menu-button__label menu-button__label--open">MENU</span>
              <span className="menu-button__label menu-button__label--close">CLOSE</span>
            </span>
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="fv">
          <div className="l-wrapper fv__wrapper">
            <div className="fv__top">
              <h1 className="fv__title anton">
                <span className="text-wrapper" data-chars>
                  {brand}
                </span>
              </h1>
              <div className="fv__vision">
                <p className="text-base">[VISION]</p>
                <p className="text-base">
                  We build digital products, shape clear communication and guide
                  organisations through technology decisions. Based in Yaoundé,
                  Cameroon, we turn ideas into work that is simple to use and built to
                  last.
                </p>
              </div>
              <SwapLink className="fv__link" />
            </div>
            <div className="fv__bottom">
              <div className="fv__labels">
                <p className="text-sm">
                  <span>SCROLL</span>
                  <span>[↓]</span>
                </p>
                <p className="text-sm">
                  <span>INDEX</span>
                  <span>[+]</span>
                </p>
                <p className="text-sm">
                  <span>SCROLL</span>
                  <span>[↓]</span>
                </p>
              </div>
              <ul className="fv__lists">
                {[...nav, { label: "CONTACT", href: "#contact", hint: "GET IN TOUCH" }].map(
                  (n) => (
                    <li key={n.label} className="fv__lists-item">
                      <p className="text-sm">[{n.label}]</p>
                      <p className="text-base">{n.hint}</p>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="p-top-about" id="about">
          <div className="l-wrapper p-top-about__wrapper">
            <h2 className="p-top-about__title anton">
              <span className="text-wrapper">
                <span>WHO</span>
                <span>WE</span>
                <span>ARE</span>
              </span>
              <span className="text-wrapper">
                <span>WHO</span>
                <span>WE</span>
                <span>ARE</span>
              </span>
            </h2>
            <div className="p-top-about__lead">
              <div className="p-top-about__intro">
                <p className="text-base">[ABOUT]</p>
                <p className="text-base">
                  We are a software development, communication and consulting agency
                  based in Yaoundé, Cameroon. We help businesses and organisations
                  build, communicate and grow in a digital world.
                </p>
              </div>
              <div className="p-top-about__floating">
                <ul className="p-top-about__floating-wrapper">
                  {[0, 1, 2].map((i) => (
                    <li key={i} className="p-top-about__floating-item">
                      <div className="p-top-about__floating-inner js-floating-inner">
                        <p className="text-sm">WHAT WE DO ???</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-top-about__info">
              <div className="p-top-about__info-item">
                <p className="text-sm">We&apos;re</p>
                <p className="text-sm">based</p>
                <p className="text-sm">in</p>
                <p className="anton">CAMEROON</p>
              </div>
              <div className="p-top-about__info-item">
                <p className="text-sm">We&apos;re</p>
                <p className="text-sm">founded</p>
                <p className="text-sm">in</p>
                <p className="anton">2026</p>
              </div>
            </div>
            <ul className="p-top-about__services">
              {services.map((s) => (
                <li key={s.title} className="p-top-about__services-item">
                  <div className="p-top-about__services-info">
                    <p className="text-base">{s.text}</p>
                    <ul>
                      {s.items.map((item) => (
                        <li key={item} className="text-sm">
                          <span className="dot" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="anton">{s.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Projects */}
        <section className="p-top-projects" id="projects">
          <div className="l-wrapper p-top-projects__wrapper">
            <div className="p-top-projects__lead">
              <div className="p-top-projects__intro">
                <p className="text-base">[PROJECTS]</p>
                <p className="text-base">
                  A selection of the projects we&apos;ve had the pleasure of working on.
                  From software and brands to strategy, each one reflects our
                  commitment to clear, thoughtful work.
                </p>
              </div>
              <h2 className="anton p-top-projects__title">
                <span className="text-wrapper">
                  <span>SELECTED</span>
                  <span>SELECTED</span>
                </span>
                <span className="text-wrapper">
                  <span>WORKS</span>
                  <span>WORKS</span>
                </span>
              </h2>
            </div>
            <div className="p-top-projects__lists">
              {projects.map((p, i) => (
                <article key={p.name} className="p-top-projects__card">
                  <p className="text-sm">({String(i + 1).padStart(2, "0")})</p>
                  <div
                    className="p-top-projects__card-img js-pixel"
                    data-seed={i + 1}
                    data-src={p.image}
                    data-w={p.width}
                    data-h={p.height}
                    style={{ aspectRatio: `${p.width} / ${p.height}` }}
                  >
                    <canvas className="js-pixel-canvas" role="img" aria-label={`${p.name}: ${p.place}`} />
                  </div>
                  <div className="p-top-projects__card-info">
                    <p className="text-sm">{p.name}</p>
                    <p className="text-sm">{p.place}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Members */}
        <section className="p-top-members" id="members">
          <div className="pixel-transition js-pixel-transition" />
          <div className="l-wrapper p-top-members__wrapper">
            <div className="p-top-members__sticky">
              <div className="p-top-members__intro p-top-members__intro--top">
                <p className="text-base">[MEMBERS]</p>
                <p className="text-base">
                  Meet the people behind our agency. A small team of developers,
                  communicators and consultants dedicated to making technology work
                  for people.
                </p>
              </div>
              <h2 className="anton p-top-members__title">
                <span className="text-wrapper" data-chars>
                  OUR TEAM
                </span>
              </h2>
              <div className="p-top-members__intro p-top-members__intro--bottom">
                <p className="text-base">[MEMBERS]</p>
                <p className="text-base">
                  Meet the people behind our agency. A small team of developers,
                  communicators and consultants dedicated to making technology work
                  for people.
                </p>
              </div>
            </div>
            <ul className="p-top-members__lists">
              {members.map((m, i) => (
                <li key={m.role} className="p-top-members__lists-item">
                  <div className="p-top-members__lists-info">
                    <p className="text-sm">{m.role}</p>
                    <p className="anton">{m.name}</p>
                    <p className="text-base">{m.text}</p>
                  </div>
                  <p className="text-base p-top-members__lists-number">
                    /{String(i + 1).padStart(3, "0")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="pixel-transition js-pixel-leave" />
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="l-wrapper footer__wrapper">
          <div className="footer__top">
            <div className="footer__contact">
              <div className="footer__intro">
                <p className="text-base">[CONTACT]</p>
                <p className="text-base">
                  Thank you for taking the time to explore our agency. No matter how
                  small your project or inquiry may be, we&apos;d love to hear from you.
                  Let&apos;s start with a conversation.
                </p>
              </div>
              <SwapLink className="footer__link" />
              <div className="footer__address">
                <p className="anton">OUR OFFICE</p>
                <p className="anton">
                  {address.line1}
                  <br />
                  {address.line2}
                </p>
              </div>
            </div>
            <h2 className="anton footer__title">
              <span className="text-wrapper" data-chars>
                GET IN TOUCH
              </span>
            </h2>
          </div>
          <div className="footer__bottom">
            <div className="footer__meta">
              <div className="footer__meta-item">
                <p className="text-sm">{tagline}</p>
              </div>
              <div className="footer__meta-item">
                <a href="#" className="text-sm slide-up">
                  <SlideUp>TERMS OF USE</SlideUp>
                </a>
                <a href="#" className="text-sm slide-up">
                  <SlideUp>PRIVACY POLICY</SlideUp>
                </a>
              </div>
              <div className="footer__meta-item">
                <p className="text-sm">© 2026 {brand}</p>
                <p className="text-sm">
                  WEBSITE BY{" "}
                  <a className="underline" href={portfolioUrl} {...external}>
                    {author}
                  </a>
                </p>
              </div>
              <div className="footer__meta-item">
                <a href="#" className="text-sm js-back-to-top slide-up">
                  <SlideUp>BACK TO TOP</SlideUp>
                  <span>[↑]</span>
                </a>
              </div>
            </div>
            <div className="footer__pixel-transition js-footer-pixel" />
          </div>
        </div>
      </footer>
    </>
  );
}

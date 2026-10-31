import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import NotFoundMotion from "@/components/NotFoundMotion";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
};

const links = [
  { label: "ABOUT", href: "/#about", hint: "WHO WE ARE" },
  { label: "PROJECTS", href: "/#projects", hint: "SELECTED WORKS" },
  { label: "MEMBERS", href: "/#members", hint: "OUR TEAM" },
  { label: "CONTACT", href: "/#contact", hint: "GET IN TOUCH" },
];

export default function NotFound() {
  return (
    <main className="nf">
      <NotFoundMotion />
      <div className="l-wrapper nf__wrapper">
        <header className="nf__top">
          <Link href="/" className="anton nf__brand">
            {brand}
          </Link>
          <p className="text-sm">[ERROR 404]</p>
        </header>

        <div className="nf__body">
          <h1 className="nf__title anton" aria-label="404">
            <span className="text-wrapper" data-chars aria-hidden="true">
              404
            </span>
          </h1>
          <div className="nf__text nf__fade">
            <p className="text-base">[PAGE NOT FOUND]</p>
            <p className="text-base">
              The page you&apos;re looking for may have moved, been renamed, or never
              existed. Let&apos;s get you back on track.
            </p>
          </div>
          <Link href="/" className="nf__link anton swap-link nf__fade">
            <span className="text-wrapper">
              <span className="swap-label swap-label--default">BACK TO HOME</span>
              <span className="swap-label swap-label--clone">BACK TO HOME</span>
            </span>
            <span className="divider" />
            <span className="text-wrapper">
              <Arrow className="swap-arrow swap-arrow--default" />
              <Arrow className="swap-arrow swap-arrow--clone" />
            </span>
          </Link>
        </div>

        <ul className="nf__index nf__fade">
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href}>
                <span className="text-sm">[{l.label}]</span>
                <span className="text-base">{l.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="nf__pixels" aria-hidden="true" />
    </main>
  );
}

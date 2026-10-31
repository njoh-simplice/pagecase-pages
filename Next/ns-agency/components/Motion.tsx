"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { splitChars } from "@/lib/split";

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Recolours a photo with a gradient map (dark -> main -> light by brightness) so
// every project image shares the site's burgundy palette.
function tintImage(img: HTMLImageElement, w: number, h: number, dark: string, main: string, light: string) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.drawImage(img, 0, 0, w, h);
  const stops = [
    { at: 0, rgb: hexToRgb(dark) },
    { at: 0.6, rgb: hexToRgb(main) },
    { at: 1, rgb: hexToRgb(light) },
  ];
  const lut = Array.from({ length: 256 }, (_, i) => {
    const l = Math.min(1, Math.max(0, ((i / 255 - 0.5) * 1.1 + 0.5)));
    const hi = stops.findIndex((s) => l <= s.at);
    const b = stops[hi === -1 ? stops.length - 1 : Math.max(hi, 1)];
    const a = stops[stops.indexOf(b) - 1];
    const t = (l - a.at) / (b.at - a.at);
    return a.rgb.map((v, k) => Math.round(v + (b.rgb[k] - v) * t));
  });
  const data = g.getImageData(0, 0, c.width, c.height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const rgb = lut[Math.round(0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2])];
    px[i] = rgb[0];
    px[i + 1] = rgb[1];
    px[i + 2] = rgb[2];
  }
  g.putImageData(data, 0, 0);
  return c;
}

// Stand-in artwork so the pixel reveal works before real photos exist.
function placeholderArt(seed: number, bg: string, main: string, dark: string) {
  const w = 800;
  const h = 1000;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, main);
  grad.addColorStop(1, dark);
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);
  const rand = (n: number) => {
    const x = Math.sin(seed * 999 + n * 77) * 10000;
    return x - Math.floor(x);
  };
  g.fillStyle = bg;
  for (let i = 0; i < 6; i++) {
    g.globalAlpha = 0.06 + rand(i) * 0.14;
    g.fillRect(rand(i + 10) * w * 0.7, rand(i + 20) * h * 0.7, w * (0.15 + rand(i + 30) * 0.4), h * (0.1 + rand(i + 40) * 0.5));
  }
  g.globalAlpha = 1;
  return c;
}

// Grid of cells that flip colour at random while scrolling.
function pixelGrid(
  el: HTMLElement,
  from: string,
  to: string,
  accent: string,
  chance: number[],
  end: string,
) {
  el.innerHTML = "";
  const flipping: { el: HTMLElement; color: string }[] = [];
  const accentable: typeof flipping = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 25; col++) {
      const cell = document.createElement("div");
      cell.className = "pixel-cell";
      cell.style.backgroundColor = from;
      if (Math.random() < chance[row]) {
        const item = { el: cell, color: to };
        flipping.push(item);
        if (row < 4) accentable.push(item);
      }
      el.appendChild(cell);
    }
  }
  gsap.utils.shuffle(accentable).slice(0, 6).forEach((item) => (item.color = accent));
  gsap.to(
    flipping.map((i) => i.el),
    {
      backgroundColor: (i: number) => flipping[i].color,
      duration: 0.05,
      stagger: { each: 0.003, from: "random" },
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end, scrub: true },
    },
  );
}

export default function Motion() {
  useEffect(() => {
    const bg = cssVar("--background");
    const main = cssVar("--main");
    const dark = cssVar("--hover");

    // ---- smooth scroll ----
    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - (1 - t) ** 3 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let menuOpen = false;
    let anchorScrolling = false;
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // ---- header hides on scroll down, returns on scroll up ----
      const header = $(".js-header")!;
      const items = $$(".header__item");
      let hidden = false;
      let headerTween: gsap.core.Tween | gsap.core.Timeline | undefined;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (anchorScrolling) return;
          if (self.direction === 1 && !hidden) {
            hidden = true;
            headerTween?.kill();
            const offset = -(header.offsetHeight + parseFloat(getComputedStyle(header).top) + 8);
            headerTween = gsap.to(header, { y: offset, duration: 0.45, ease: "power3.inOut" });
          } else if (self.direction === -1 && hidden) {
            hidden = false;
            headerTween?.kill();
            gsap.set(items, { y: -50 });
            headerTween = gsap
              .timeline()
              .to(header, { y: 0, duration: 0.45, ease: "power3.out" })
              .to(items, { y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }, "<");
          }
        },
      });

      // ---- header link hover: clone label rotates in ----
      const defaults = $$(".header__item-label--default");
      const clones = $$(".header__item-label--clone");
      gsap.set(clones, { rotate: 28, yPercent: 100, visibility: "visible", transformOrigin: "left center" });
      $$(".header__item-link").forEach((link, i) => {
        const to = (on: boolean) => {
          const vars = { duration: 0.6, ease: "power4.out", overwrite: "auto" as const };
          gsap.to(clones[i], { rotate: on ? 0 : 28, yPercent: on ? 0 : 100, ...vars });
          gsap.to(defaults[i], { scale: on ? 0 : 1, ...vars });
        };
        const enter = () => to(true);
        const leave = () => to(false);
        link.addEventListener("mouseenter", enter);
        link.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          link.removeEventListener("mouseenter", enter);
          link.removeEventListener("mouseleave", leave);
        });
      });

      // ---- hero title: letters grow up from the baseline in random order ----
      const heroTitle = $(".fv__title .text-wrapper")!;
      const heroChars = splitChars(heroTitle);
      gsap.set(heroChars, { scaleY: 0, display: "inline-block", transformOrigin: "bottom center" });
      gsap.to(heroChars, {
        scaleY: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: { each: 0.05, from: "random" },
      });

      // ---- about title: outline text filled in as it scrolls ----
      const aboutTitles = $$(".p-top-about__title .text-wrapper");
      gsap.set(aboutTitles[1], { clipPath: "polygon(0% 0%, 0% 0%, 0 100%, 0 100%)" });
      gsap.to(aboutTitles[1], {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0 100%)",
        ease: "none",
        scrollTrigger: { trigger: ".p-top-about__title", start: "top 80%", end: "top 20%", scrub: 1.5 },
      });

      // ---- floating dashed boxes bob up and down ----
      $$(".js-floating-inner").forEach((el) => {
        gsap.fromTo(
          el,
          { y: -8 },
          {
            y: 8,
            duration: gsap.utils.random(1.2, 1.8),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: gsap.utils.random(0, 2),
          },
        );
      });

      // ---- projects title: words slide out as their copies slide in ----
      const pt = $$(".p-top-projects__title .text-wrapper span");
      gsap.set([pt[1], pt[3]], { yPercent: 100, visibility: "visible" });
      gsap
        .timeline({ scrollTrigger: { trigger: ".p-top-projects__title", start: "top 65%" } })
        .to([pt[1], pt[3]], { yPercent: 0, duration: 1.5, ease: "power3.out", stagger: 0.3 })
        .to([pt[0], pt[2]], { yPercent: -100, duration: 1.5, ease: "power3.out", stagger: 0.3 }, "<");

      // ---- project images pixelate in ----
      $$(".js-pixel").forEach((box) => {
        const canvas = $<HTMLCanvasElement>(".js-pixel-canvas", box)!;
        const ctx2d = canvas.getContext("2d")!;
        const small = document.createElement("canvas");
        const smallCtx = small.getContext("2d")!;
        const state = { progress: 0 };
        const src = box.dataset.src;
        // Working resolution is capped: the card is never shown larger than this,
        // and resizing/redrawing bigger canvases every frame makes scrolling stutter.
        const MAX = 900;
        const nw = Number(box.dataset.w ?? 800);
        const nh = Number(box.dataset.h ?? 1000);
        const k = Math.min(1, MAX / Math.max(nw, nh));
        const w = Math.round(nw * k);
        const h = Math.round(nh * k);
        canvas.width = small.width = w;
        canvas.height = small.height = h;
        ctx2d.imageSmoothingEnabled = false;

        // With a photo, nothing is drawn until it loads. Without one, stand-in art is used.
        let source: HTMLCanvasElement | null = src
          ? null
          : placeholderArt(Number(box.dataset.seed ?? 1), bg, main, dark);

        const draw = () => {
          if (!source) return;
          const pw = Math.max(1, Math.round(18 + (w - 18) * state.progress ** 2.5));
          const ph = Math.max(1, Math.round((h / w) * pw));
          smallCtx.clearRect(0, 0, pw, ph);
          smallCtx.drawImage(source, 0, 0, source.width, source.height, 0, 0, pw, ph);
          ctx2d.drawImage(small, 0, 0, pw, ph, 0, 0, w, h);
        };

        if (src) {
          const img = new Image();
          img.onload = () => {
            source = tintImage(img, w, h, dark, main, bg);
            draw();
          };
          img.src = src;
        }
        draw();

        gsap.set(canvas, { scale: 1.1 });
        gsap
          .timeline({ scrollTrigger: { trigger: box, start: "top center", toggleActions: "play none none none" } })
          .to(state, { progress: 1, duration: 1.5, onUpdate: draw })
          .to(canvas, { scale: 1, duration: 1.5 }, 0);
      });

      // ---- pixel transitions between sections ----
      const chance = [0.1, 0.2, 0.5, 0.7, 1, 1];
      pixelGrid($(".js-pixel-transition")!, bg, dark, main, chance, "top 20%");
      pixelGrid($(".js-pixel-leave")!, dark, bg, main, chance, "top 20%");
      pixelGrid($(".js-footer-pixel")!, main, bg, dark, [0, 0.1, 0.2, 0.3, 0.5, 0.9], "bottom bottom");

      // ---- members title rises letter by letter ----
      const membersChars = splitChars($(".p-top-members__title .text-wrapper")!);
      gsap.set(membersChars, { yPercent: 100 });
      gsap.to(membersChars, {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "power4.out",
        scrollTrigger: { trigger: ".p-top-members__title .text-wrapper", start: "top top" },
      });

      // ---- footer title letters grow down from the top ----
      const footerChars = splitChars($(".footer__title .text-wrapper")!);
      gsap.set(footerChars, { scaleY: 0, transformOrigin: "top center" });
      gsap.to(footerChars, {
        scaleY: 1,
        duration: 1.5,
        ease: "power3.out",
        stagger: { each: 0.05, from: "random" },
        scrollTrigger: { trigger: ".footer__title .text-wrapper", start: "top 80%" },
      });

      // ---- mobile menu ----
      const button = $(".js-menu-button")!;
      const buttonEls = $$(".menu-button__button");
      const menu = $(".js-menu")!;
      const panel = $(".menu__wrapper")!;
      const openLabels = $$(".menu-button__label--open");
      const closeLabels = $$(".menu-button__label--close");
      const menuText = $$(".text-wrapper span", panel);

      gsap.set(menu, { opacity: 0, pointerEvents: "none" });
      gsap.set(panel, { opacity: 0, rotate: -28, transformOrigin: "left top" });
      gsap.set(openLabels, { yPercent: 0 });
      gsap.set(closeLabels, { yPercent: 100 });
      gsap.set(buttonEls, { backgroundColor: "transparent" });
      gsap.set(menuText, { display: "inline-block", yPercent: 100 });

      const e = { duration: 1, ease: "power4.out" };
      const openTl = gsap
        .timeline({ paused: true })
        .to(menu, { opacity: 1, pointerEvents: "all", ...e })
        .to(panel, { opacity: 1, rotate: 0, ...e }, 0)
        .to(openLabels, { yPercent: -100, ...e }, 0)
        .to(closeLabels, { yPercent: 0, ...e }, 0)
        .to(buttonEls, { backgroundColor: main, color: bg, ...e }, 0)
        .to(menuText, { yPercent: 0, stagger: 0.1, ...e }, 0);
      const closeTl = gsap
        .timeline({ paused: true })
        .to(openLabels, { yPercent: 0, ...e })
        .to(buttonEls, { backgroundColor: "transparent", color: main, ...e }, 0)
        .to(closeLabels, { yPercent: 100, ...e }, 0)
        .to(panel, { opacity: 0, rotate: -28, ...e }, 0)
        .to(menu, { opacity: 0, pointerEvents: "none", ...e }, 0);

      const closeMenu = () => {
        menuOpen = false;
        closeTl.restart();
        closeTl.eventCallback("onComplete", () => {
          lenis.start();
          closeTl.eventCallback("onComplete", null);
        });
      };
      const toggleMenu = () => {
        if (!menuOpen) {
          menuOpen = true;
          lenis.stop();
          openTl.restart();
        } else {
          closeMenu();
        }
      };
      button.addEventListener("click", toggleMenu);
      cleanups.push(() => button.removeEventListener("click", toggleMenu));

      // ---- anchor links + back to top ----
      $$(".js-smooth-scroll").forEach((a) => {
        const onClick = (ev: MouseEvent) => {
          ev.preventDefault();
          if (menuOpen) {
            menuOpen = false;
            lenis.start();
            closeTl.restart();
          }
          anchorScrolling = true;
          lenis.scrollTo(a.getAttribute("href")!, {
            duration: 1,
            easing: (t) => 1 - (1 - t) ** 2,
            lock: true,
            onComplete: () => (anchorScrolling = false),
          });
        };
        a.addEventListener("click", onClick);
        cleanups.push(() => a.removeEventListener("click", onClick));
      });

      const top = $(".js-back-to-top")!;
      const onTop = (ev: MouseEvent) => {
        ev.preventDefault();
        lenis.scrollTo(0, { duration: 2, easing: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2) });
      };
      top.addEventListener("click", onTop);
      cleanups.push(() => top.removeEventListener("click", onTop));
    });

    ScrollTrigger.refresh();

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { splitChars } from "@/lib/split";

// Animates the 404 page: the number grows up letter by letter and the pixel
// strip at the bottom fills in at random.
export default function NotFoundMotion() {
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const bg = style.getPropertyValue("--background").trim();
    const main = style.getPropertyValue("--main").trim();
    const dark = style.getPropertyValue("--hover").trim();

    const ctx = gsap.context(() => {
      const title = document.querySelector<HTMLElement>(".nf__title .text-wrapper");
      if (title) {
        const chars = splitChars(title);
        gsap.set(chars, { scaleY: 0, display: "inline-block", transformOrigin: "bottom center" });
        gsap.to(chars, {
          scaleY: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: { each: 0.12, from: "random" },
        });
      }

      gsap.from(".nf__fade", { y: 30, opacity: 0, duration: 1, delay: 0.5, stagger: 0.1, ease: "power3.out" });

      const grid = document.querySelector<HTMLElement>(".nf__pixels");
      if (!grid) return;
      grid.innerHTML = "";
      const chance = [0.1, 0.3, 0.5, 0.7, 0.9, 1];
      const filled: { el: HTMLElement; color: string }[] = [];
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 25; col++) {
          const cell = document.createElement("div");
          cell.className = "pixel-cell";
          cell.style.backgroundColor = bg;
          if (Math.random() < chance[row]) {
            filled.push({ el: cell, color: Math.random() < 0.08 ? dark : main });
          }
          grid.appendChild(cell);
        }
      }
      gsap.to(
        filled.map((f) => f.el),
        {
          backgroundColor: (i: number) => filled[i].color,
          duration: 0.05,
          stagger: { each: 0.004, from: "random" },
          ease: "none",
          delay: 0.3,
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return null;
}

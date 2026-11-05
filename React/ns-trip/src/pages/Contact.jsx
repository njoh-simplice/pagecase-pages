import { useEffect, useRef } from 'react'
import useReveal from '../hooks/useReveal'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Cursor from '../components/layout/Cursor'
import { PixelCorners } from '../components/ui/Frame'
import ContactForm from '../components/contact/ContactForm'
import background from '../assets/images/places/contact-highlands-dither.webp'
import { contact } from '../utils/content'

export default function Contact() {
  const root = useRef(null)
  useReveal(root)

  useEffect(() => {
    document.title = 'Contact | TripKam'
  }, [])

  return (
    <div ref={root}>
      <Navbar />
      <Cursor />
      <main>
        <section className="relative overflow-hidden bg-navy text-white">
          {/* Dithered highland photo, drawn with hard pixels so the dot pattern stays crisp. */}
          <div className="absolute inset-0" aria-hidden="true">
            <img src={background} alt="" className="size-full object-cover [image-rendering:pixelated]" />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Room for the floating navbar */}
          <div className="relative h-[clamp(6.5rem,4.5rem+5vw,10rem)]" />

          <div className="relative border-y border-white/20">
            <div data-reveal-component className="frame relative border-x border-white/20">
              <PixelCorners tone="light" />
              <div className="grid gap-12 px-5 py-12 lg:grid-cols-[1fr_1.39fr] lg:gap-16 lg:px-12 lg:py-20">
                <div className="flex flex-col justify-between gap-14">
                  <div>
                    <h1 data-reveal="heading" className="text-h1">
                      {contact.title}
                    </h1>
                    <div data-reveal="fade" className="mt-8 flex max-w-[460px] flex-col gap-6 lg:mt-10">
                      {contact.intro.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>

                  <div data-reveal="fade" className="grid grid-cols-2 gap-6 text-[16px] leading-[1.4]">
                    <address className="not-italic">
                      {contact.address.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                    <div>
                      <span className="text-h6 font-semibold uppercase text-lime">Connect</span>
                      <ul className="mt-3 flex flex-wrap gap-x-4">
                        {contact.socials.map((s) => (
                          <li key={s.label}>
                            <a href={s.href} target="_blank" rel="noopener" className="inline-block py-1.5 text-main transition-opacity hover:opacity-70">
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>

          <div className="frame relative h-20 border-x border-white/20" />
        </section>
      </main>
      <Footer />
    </div>
  )
}

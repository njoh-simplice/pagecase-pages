import { useRef } from 'react'
import logo from '../../assets/images/ns-trip-logo.svg'
import { footer, site } from '../../utils/content'
import Button from '../ui/Button'
import FooterScene from './FooterScene'

const year = new Date().getFullYear()

export default function Footer() {
  const scene = useRef(null)

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <FooterScene sceneRef={scene} className="absolute inset-0 size-full" />

      <div className="frame relative pt-[4.75rem]">
        <div className="grid gap-x-6 gap-y-12 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col items-start gap-8">
            <a href="/" className="flex items-center gap-3" aria-label="ns-trip home">
              <img src={logo} alt="" className="h-10 w-auto rounded-[4px]" />
              <span className="text-[1.75rem] font-semibold leading-none tracking-[-0.04em]">ns-trip</span>
            </a>
            <p data-reveal="heading" className="max-w-sm text-h5 text-white/85">
              {footer.tagline}
            </p>
            <Button href="/contact/">Contact us</Button>
          </div>

          <div className="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3">
            {footer.groups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 font-semibold">{group.title}</h3>
                <ul data-dim-siblings className="flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="inline-block py-1.5 text-small text-white/75 transition-[color,opacity] duration-200 hover:text-white">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/25 pt-5 text-[12px] leading-normal text-white/70 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <p className="max-w-3xl">
            Photos:{' '}
            {footer.photoCredits.map((c, i) => (
              <span key={c.href}>
                {i > 0 && '; '}
                <a href={c.href} target="_blank" rel="noreferrer" className="underline underline-offset-2 transition-opacity hover:opacity-70">
                  {c.subject}
                </a>{' '}
                by {c.author} ({c.license})
              </span>
            ))}
            , via Wikimedia Commons.
          </p>
          <div className="flex shrink-0 flex-col gap-1 sm:items-end">
            <p className="text-white">ns-trip © {year}. All rights reserved.</p>
            <p>
              Site by{' '}
              <a href={site.author.url} target="_blank" rel="noopener" className="text-white underline underline-offset-2 transition-opacity hover:opacity-70">
                {site.author.name}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Room for the sun, the sand and the hikers drawn by FooterScene. */}
      <div ref={scene} className="h-[clamp(300px,36vw,560px)]" aria-hidden="true" />
    </footer>
  )
}

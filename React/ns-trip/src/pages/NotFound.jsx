import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Cursor from '../components/layout/Cursor'
import Button from '../components/ui/Button'
import { PixelCorners } from '../components/ui/Frame'

// Shown for any URL the app does not know. Static hosts serve public/404.html
// instead (with a real 404 status); this covers the dev server, preview and
// hosts that send every path to index.html.
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found | TripKam'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.append(robots)
    return () => robots.remove()
  }, [])

  return (
    <div>
      <Navbar />
      <Cursor />
      <main>
        <section className="relative bg-navy text-white">
          <div className="h-[clamp(6.5rem,4.5rem+5vw,10rem)]" />
          <div className="border-y border-white/20">
            <div className="frame relative border-x border-white/20">
              <PixelCorners tone="light" />
              <div className="flex min-h-[60svh] flex-col items-center justify-center gap-6 px-5 py-20 text-center">
                <span className="text-h6 font-semibold uppercase text-lime">Error 404</span>
                <h1 className="max-w-3xl text-h1 text-balance">This trail goes nowhere</h1>
                <p className="max-w-md text-white/80">
                  The page you are looking for does not exist or has moved. Head back to the start and pick another route.
                </p>
                <Button href="/" size="regular" className="mt-4">
                  Back to TripKam
                </Button>
              </div>
            </div>
          </div>
          <div className="frame h-20 border-x border-white/20" />
        </section>
      </main>
      <Footer />
    </div>
  )
}

import { useRef } from 'react'
import useReveal from '../hooks/useReveal'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Cursor from '../components/layout/Cursor'
import Hero from '../components/home/Hero'
import RegionsGrid from '../components/home/RegionsGrid'
import MaskedBanner from '../components/home/MaskedBanner'
import StickySteps from '../components/home/StickySteps'
import About from '../components/home/About'
import WhyUs from '../components/home/WhyUs'
import Facts from '../components/home/Facts'
import Itineraries from '../components/home/Itineraries'
import Stories from '../components/home/Stories'
import CallToAction from '../components/home/CallToAction'

export default function Home() {
  const root = useRef(null)
  useReveal(root)

  return (
    <div ref={root}>
      <Navbar />
      <Cursor />
      <main>
        <Hero />
        <RegionsGrid />
        <MaskedBanner />
        <StickySteps />
        <About />
        <WhyUs />
        <Facts />
        <Itineraries />
        <Stories />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

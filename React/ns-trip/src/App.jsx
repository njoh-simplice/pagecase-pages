import useLenis from './hooks/useLenis'
import Home from './pages/Home'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Pages picked from the URL. Links are plain <a> tags, so each page is a full
// load and no router is needed. Any other path shows the 404 page.
const pages = { '/': Home, '/contact': Contact }

export default function App() {
  useLenis()

  const path =
    window.location.pathname
      .replace(/\/index\.html$/, '')
      .replace(/\/+$/, '') || '/'
  const Page = pages[path] ?? NotFound
  return <Page />
}

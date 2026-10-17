import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Panels } from './components/Panels'
import {
  BestSellers, Categories, Collection, FeaturedBanner, FinalCTA, Footer, Newsletter, OfferBanner, Testimonials, WhyChoose,
} from './components/Sections'
import { ShopProvider } from './store/shop'

export default function App() {
  return (
    <ShopProvider>
      <a className="skip" href="#shop">Skip to products</a>
      <div id="top" />
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedBanner />
        <BestSellers />
        <OfferBanner />
        <WhyChoose />
        <Collection />
        <Testimonials />
        <Newsletter />
        <FinalCTA />
      </main>
      <Footer />
      <Panels />
    </ShopProvider>
  )
}

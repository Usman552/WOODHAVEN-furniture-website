import { useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { CATEGORIES, PRODUCTS, effectivePrice, type Category } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import { useShop } from '../store/shop'
import {
  ArrowLeft, ArrowRight, BagIcon, CheckIcon, FacebookIcon, InstagramIcon, Logo, PinterestIcon,
  ShieldIcon, SofaIcon, StarIcon, TruckIcon, YoutubeIcon, LockIcon,
} from './icons'
import { Img } from './Img'
import { ProductCard } from './ProductCard'

const ri = (i: number) => ({ ['--i' as string]: i }) as CSSProperties

function goShop(filter: Category | 'all' | 'sale', set: (f: Category | 'all' | 'sale') => void) {
  set(filter)
  requestAnimationFrame(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

/* ------------------------------ 3. Categories ------------------------------ */
export function Categories() {
  const ref = useReveal()
  const { setFilter } = useShop()
  return (
    <section id="categories" className="section section-ivory reveal-group" ref={ref}>
      <div className="container">
        <header className="section-head" data-r>
          <p className="eyebrow dark">Shop by category</p>
          <h2>Explore Our Furniture Categories</h2>
          <p className="lede">From living rooms to bedrooms, find everything you need to create your perfect space.</p>
        </header>
        <ul className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <li key={c.id} data-r style={ri(i)}>
              <a
                className="cat"
                href="#shop"
                onClick={(e) => {
                  e.preventDefault()
                  goShop(c.id, setFilter)
                }}
              >
                <span className="cat-img">
                  <Img name={c.image} alt={`${c.label} furniture`} sizes="(max-width: 640px) 45vw, 20vw" />
                </span>
                <span className="cat-name">{c.label}</span>
                <span className="cat-link">
                  View All <ArrowRight width={14} height={14} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* --------------------------- 4. Featured banner ---------------------------- */
export function FeaturedBanner() {
  const ref = useReveal()
  const { setFilter } = useShop()
  const from = Math.min(...PRODUCTS.map(effectivePrice))
  return (
    <section className="band reveal-group" ref={ref}>
      <div className="container band-inner">
        <div className="band-copy">
          <p className="eyebrow" data-r>Best sellers</p>
          <h2 data-r style={ri(1)}>Top Picks For<br />Your Home</h2>
          <p data-r style={ri(2)} className="band-text">Handpicked furniture pieces that combine comfort, style and durability.</p>
          <a className="btn btn-gold" data-r style={ri(3)} href="#shop" onClick={(e) => { e.preventDefault(); goShop('all', setFilter) }}>
            View All Products <ArrowRight width={16} height={16} />
          </a>
        </div>
        <div className="band-media" data-r="img">
          <Img name="chair-green" alt="Forest green bouclé accent armchair" sizes="(max-width: 900px) 92vw, 52vw" />
          <span className="from-badge">
            <small>From</small>
            <strong>${from}</strong>
          </span>
        </div>
      </div>
    </section>
  )
}

/* --------------------------- 5. Best-selling grid -------------------------- */
export function BestSellers() {
  const ref = useReveal(0.08)
  const { filter, setFilter } = useShop()
  const track = useRef<HTMLDivElement>(null)
  const list = PRODUCTS.filter((p) => (filter === 'all' ? true : filter === 'sale' ? !!p.salePrice : p.category === filter))
  const scrollBy = (dir: number) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  const chips: { id: Category | 'all' | 'sale'; label: string }[] = [
    { id: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
    { id: 'sale', label: 'Sale' },
  ]
  return (
    <section id="shop" className="section section-ivory reveal-group" ref={ref}>
      <div className="container">
        <header className="shop-head" data-r>
          <div>
            <p className="eyebrow dark">Featured products</p>
            <h2>Our Best Selling Furniture</h2>
            <p className="lede">Modern design. Better living. Explore our most loved pieces.</p>
          </div>
          <div className="arrows">
            <button className="round-btn" onClick={() => scrollBy(-1)} aria-label="Previous products"><ArrowLeft width={16} height={16} /></button>
            <button className="round-btn" onClick={() => scrollBy(1)} aria-label="Next products"><ArrowRight width={16} height={16} /></button>
          </div>
        </header>
        <div className="chips" role="group" aria-label="Filter products" data-r style={ri(1)}>
          {chips.map((c) => (
            <button key={c.id} className={`chip ${filter === c.id ? 'is-on' : ''}`} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="products" ref={track} tabIndex={0} aria-label="Products" key={filter}>
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>
        <p className="fine" data-r>Ratings shown are demonstration data. Prices in USD.</p>
      </div>
    </section>
  )
}

/* ---------------------------- 6. Offer banner ------------------------------ */
export function OfferBanner() {
  const ref = useReveal()
  const { setFilter } = useShop()
  const best = Math.round(Math.max(...PRODUCTS.filter((p) => p.salePrice).map((p) => (1 - p.salePrice! / p.price) * 100)))
  return (
    <section className="section section-ivory tight reveal-group" ref={ref}>
      <div className="container">
        <div className="offer">
          <div className="offer-media" data-r="img">
            <Img name="sideboard" alt="Walnut sideboard in a bright living room" sizes="(max-width: 900px) 92vw, 46vw" />
          </div>
          <div className="offer-copy">
            <p className="eyebrow" data-r>Limited time offer</p>
            <h2 data-r style={ri(1)}>Make Your Home<br />More Beautiful</h2>
            <p data-r style={ri(2)}>Save up to {best}% on selected furniture pieces.</p>
            <a className="btn btn-gold" data-r style={ri(3)} href="#shop" onClick={(e) => { e.preventDefault(); goShop('sale', setFilter) }}>
              Shop Now <ArrowRight width={16} height={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- 7. Why choose us ----------------------------- */
const WHY = [
  { icon: ShieldIcon, title: 'Premium Quality Materials', text: 'Built to last, designed for comfort.' },
  { icon: SofaIcon, title: 'Modern & Timeless Designs', text: 'Stylish pieces for every space.' },
  { icon: LockIcon, title: 'Secure Shopping Experience', text: 'Safe payments & trusted service.' },
  { icon: TruckIcon, title: 'Fast & Reliable Delivery', text: 'Your furniture, right on time.' },
]
export function WhyChoose() {
  const ref = useReveal()
  return (
    <section id="why" className="section section-ivory tight reveal-group" ref={ref}>
      <div className="container">
        <div className="why">
          <header className="section-head center" data-r>
            <h2 className="h3">Why Choose WOODHAVEN Furniture?</h2>
            <p className="lede">More than just furniture — we create spaces you’ll love.</p>
          </header>
          <ul className="why-grid">
            {WHY.map((w, i) => (
              <li key={w.title} data-r style={ri(i + 1)}>
                <span className="why-icon"><w.icon width={24} height={24} /></span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ------------------------- 8. Collection showcase -------------------------- */
export function Collection() {
  const ref = useReveal(0.1)
  const { setFilter } = useShop()
  const mosaic: { cat: Category; img: string; label: string; big?: boolean }[] = [
    { cat: 'living', img: 'living-modern', label: 'Living Room Furniture', big: true },
    { cat: 'bedroom', img: 'bedroom-wood', label: 'Bedroom Furniture' },
    { cat: 'dining', img: 'dining-wood', label: 'Dining Furniture' },
  ]
  return (
    <section id="collections" className="section section-ivory tight reveal-group" ref={ref}>
      <div className="container">
        <div className="showcase">
          <div className="showcase-copy">
            <p className="eyebrow" data-r>Modern living</p>
            <h2 data-r style={ri(1)}>Stylish Furniture<br />For Every Room</h2>
            <p data-r style={ri(2)}>Design your dream home with our exclusive collections.</p>
            <a className="btn btn-gold" data-r style={ri(3)} href="#shop" onClick={(e) => { e.preventDefault(); goShop('bedroom', setFilter) }}>
              Explore Collection <ArrowRight width={16} height={16} />
            </a>
          </div>
          <div className="showcase-media" data-r="img">
            <Img name="bedroom" alt="Bedroom with fluted walnut headboard" sizes="(max-width: 900px) 92vw, 56vw" />
          </div>
        </div>

        <header className="section-head left" data-r style={{ marginTop: 56 }}>
          <h2 className="h3">Most Recommended For You</h2>
          <p className="lede">Customer favorites, loved for their style and comfort.</p>
        </header>
        <div className="mosaic">
          {mosaic.map((m, i) => (
            <a
              key={m.cat}
              className={`tile ${m.big ? 'tile-big' : ''}`}
              href="#shop"
              data-r
              style={ri(i)}
              onClick={(e) => { e.preventDefault(); goShop(m.cat, setFilter) }}
            >
              <Img name={m.img} alt={m.label} sizes={m.big ? '(max-width: 700px) 92vw, 40vw' : '(max-width: 700px) 92vw, 28vw'} />
              <span className="tile-label">
                <strong>{m.label}</strong>
                <span>Shop Now <ArrowRight width={13} height={13} /></span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- 9. Testimonials ------------------------------ */
const QUOTES = [
  { text: 'Amazing quality and beautiful designs! The sofa transformed our living room, and delivery was smooth from start to finish.', name: 'Sample customer A', place: 'Living room' },
  { text: 'The walnut sideboard looks even better in person. Solid, well finished and easy to put together.', name: 'Sample customer B', place: 'Dining room' },
  { text: 'We furnished our whole bedroom here. The bed frame is sturdy and the headboard feels really premium.', name: 'Sample customer C', place: 'Bedroom' },
]
export function Testimonials() {
  const ref = useReveal()
  const [i, setI] = useState(0)
  const go = (n: number) => setI((n + QUOTES.length) % QUOTES.length)
  const q = QUOTES[i]
  return (
    <section className="testi reveal-group" ref={ref}>
      <Img name="living-modern" alt="" sizes="100vw" className="testi-bg" />
      <div className="testi-shade" />
      <div className="container testi-inner">
        <header data-r>
          <h2 className="h3">What Our Customers Say</h2>
          <p className="lede on-dark">Sample testimonials shown for demonstration.</p>
        </header>
        <figure className="quote" data-r style={ri(1)} aria-live="polite">
          <div key={i} className="quote-body">
            <span className="quote-mark" aria-hidden="true">“</span>
            <blockquote>{q.text}</blockquote>
            <figcaption>
              <span className="avatar" aria-hidden="true">{q.name.slice(-1)}</span>
              <span>
                <strong>{q.name}</strong>
                <small>{q.place}</small>
              </span>
              <span className="stars on-light" aria-hidden="true">
                {Array.from({ length: 5 }, (_, k) => <StarIcon key={k} width={13} height={13} className="on" />)}
              </span>
            </figcaption>
          </div>
        </figure>
        <div className="quote-ctrl" data-r style={ri(2)}>
          <button className="round-btn light" onClick={() => go(i - 1)} aria-label="Previous testimonial"><ArrowLeft width={15} height={15} /></button>
          <button className="round-btn light" onClick={() => go(i + 1)} aria-label="Next testimonial"><ArrowRight width={15} height={15} /></button>
          <div className="dots" role="group" aria-label="Choose testimonial">
            {QUOTES.map((_, k) => (
              <button key={k} className={k === i ? 'is-on' : ''} onClick={() => go(k)} aria-label={`Testimonial ${k + 1}`} aria-current={k === i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- 10. Newsletter ------------------------------ */
export function Newsletter() {
  const ref = useReveal()
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const v = String(new FormData(e.currentTarget).get('email') ?? '').trim()
    if (!/^\S+@\S+\.\S+$/.test(v)) return setState('error')
    setState('done')
    e.currentTarget.reset()
  }
  return (
    <section className="section section-ivory tight reveal-group" ref={ref}>
      <div className="container">
        <div className="news">
          <div className="news-copy" data-r>
            <p className="eyebrow dark">Stay inspired</p>
            <h2 className="h3">Get Exclusive Offers &amp; Updates</h2>
            <p className="lede">Be the first to know about new arrivals, special discounts and more.</p>
            <form className="news-form" onSubmit={submit} noValidate>
              <label className="sr-only" htmlFor="news-email">Email address</label>
              <input id="news-email" name="email" type="email" placeholder="Your email address" autoComplete="email"
                aria-invalid={state === 'error'} aria-describedby="news-msg" onChange={() => state !== 'idle' && setState('idle')} />
              <button className="btn btn-green" type="submit">Subscribe</button>
            </form>
            <p id="news-msg" className={`news-msg ${state}`} role="status">
              {state === 'error' && 'Please enter a valid email address.'}
              {state === 'done' && (<><CheckIcon width={16} height={16} /> Thanks — you’re on the list. (Demo: nothing is sent or stored.)</>)}
            </p>
          </div>
          <Img name="green-room" alt="" sizes="(max-width: 900px) 0px, 30vw" className="news-img" />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- 11. Final CTA ------------------------------- */
export function FinalCTA() {
  const ref = useReveal()
  const { setFilter } = useShop()
  return (
    <section className="cta reveal-group" ref={ref}>
      <div className="cta-media" data-r="img">
        <Img name="round-chair" alt="Cream lounge chair" sizes="(max-width: 900px) 100vw, 50vw" />
      </div>
      <div className="cta-copy">
        <h2 data-r>Your Dream Home<br />Is Just a Click Away</h2>
        <p data-r style={ri(1)}>Premium furniture, Better living.</p>
        <a className="btn btn-gold" data-r style={ri(2)} href="#shop" onClick={(e) => { e.preventDefault(); goShop('all', setFilter) }}>
          Shop Now <ArrowRight width={16} height={16} />
        </a>
      </div>
    </section>
  )
}

/* ------------------------------- 12. Footer -------------------------------- */
function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="foot-col">
      <h3>{title}</h3>
      <ul>{children}</ul>
    </div>
  )
}
export function Footer() {
  const { openPanel, notify } = useShop()
  const soon = (e: React.MouseEvent) => {
    e.preventDefault()
    notify('This page isn’t part of the demo store')
  }
  return (
    <footer id="contact" className="footer">
      <div className="container foot-grid">
        <div className="foot-brand">
          <Logo />
          <p>Premium furniture for modern living. Thoughtfully designed, carefully made.</p>
        </div>
        <FooterCol title="Quick Links">
          <li><a href="#top">Home</a></li>
          <li><a href="#shop">Shop</a></li>
          <li><a href="#collections">Collections</a></li>
          <li><a href="#why">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </FooterCol>
        <FooterCol title="Customer Care">
          <li><a href="#" onClick={soon}>Shipping</a></li>
          <li><a href="#" onClick={soon}>Returns</a></li>
          <li><a href="#" onClick={soon}>FAQ</a></li>
          <li><a href="#" onClick={soon}>Terms &amp; Conditions</a></li>
          <li><a href="#" onClick={soon}>Privacy Policy</a></li>
        </FooterCol>
        <div className="foot-col">
          <h3>Follow Us</h3>
          <div className="social">
            <a href="#" onClick={soon} aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" onClick={soon} aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" onClick={soon} aria-label="YouTube"><YoutubeIcon /></a>
            <a href="#" onClick={soon} aria-label="Pinterest"><PinterestIcon /></a>
          </div>
          <button className="foot-cart" onClick={() => openPanel('cart')}><BagIcon width={16} height={16} /> View cart</button>
        </div>
      </div>
      <div className="container foot-bottom">
        <p>© {new Date().getFullYear()} WOODHAVEN furniture.com — demonstration store. All rights reserved.</p>
        <p>
          Photography via <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a> · 3D models &amp; textures{' '}
          <a href="https://polyhaven.com" target="_blank" rel="noreferrer">Poly Haven</a> (CC0)
        </p>
      </div>
    </footer>
  )
}

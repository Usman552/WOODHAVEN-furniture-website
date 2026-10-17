import { useEffect, useState } from 'react'
import { useShop } from '../store/shop'
import { BagIcon, HeartIcon, Logo, MenuIcon, SearchIcon } from './icons'

export const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Shop', href: '#shop' },
  { label: 'Collections', href: '#collections' },
  { label: 'About', href: '#why' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  const { count, wishlist, openPanel } = useShop()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#top" className="header-logo" aria-label="WOODHAVEN home">
          <Logo />
        </a>
        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.label} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Search products" onClick={() => openPanel('search')}>
            <SearchIcon />
          </button>
          <button className="icon-btn" aria-label={`Wishlist, ${wishlist.length} items`} onClick={() => openPanel('wishlist')}>
            <HeartIcon />
            {wishlist.length > 0 && <span className="badge badge-light">{wishlist.length}</span>}
          </button>
          <button className="icon-btn" aria-label={`Cart, ${count} items`} onClick={() => openPanel('cart')}>
            <BagIcon />
            {count > 0 && (
              <span key={count} className="badge">
                {count}
              </span>
            )}
          </button>
          <button className="icon-btn" aria-label="Open menu" onClick={() => openPanel('menu')}>
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  )
}

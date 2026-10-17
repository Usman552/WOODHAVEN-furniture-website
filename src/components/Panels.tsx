import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CATEGORIES, PRODUCTS, byId, effectivePrice, formatPrice } from '../data/products'
import { useShop } from '../store/shop'
import { NAV } from './Header'
import { ArrowRight, CheckIcon, CloseIcon, HeartIcon, LockIcon, MinusIcon, PlusIcon, SearchIcon, TrashIcon } from './icons'
import { Img } from './Img'
import { Stars } from './ProductCard'

/** Shared modal/drawer shell: Esc to close, focus moved in and restored, body scroll locked. */
function Shell({ label, side, onClose, children, wide }: { label: string; side: 'right' | 'center' | 'top'; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('keydown', key)
      document.body.style.overflow = prevOverflow
      prev?.focus?.()
    }
  }, [onClose])
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} className={`sheet sheet-${side} ${wide ? 'sheet-wide' : ''}`}>
        {children}
      </div>
    </div>
  )
}

function SheetHead({ title, onClose, sub }: { title: string; onClose: () => void; sub?: string }) {
  return (
    <div className="sheet-head">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      <button className="icon-btn dark" onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>
    </div>
  )
}

function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <p className="empty-title">{title}</p>
      <p>{text}</p>
      {action}
    </div>
  )
}

/* ---------------------------------- Search ---------------------------------- */
function SearchPanel() {
  const { closePanel, openProduct, addToCart, setFilter } = useShop()
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return PRODUCTS.filter((p) => {
      const cat = CATEGORIES.find((c) => c.id === p.category)?.label ?? ''
      return `${p.name} ${cat} ${p.description}`.toLowerCase().includes(s)
    })
  }, [q])
  return (
    <Shell label="Search products" side="top" onClose={closePanel}>
      <form className="search-box" role="search" onSubmit={(e) => e.preventDefault()}>
        <SearchIcon />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sofas, beds, tables…" aria-label="Search products" />
        <button type="button" className="icon-btn dark" onClick={closePanel} aria-label="Close search">
          <CloseIcon />
        </button>
      </form>
      <div className="search-body" aria-live="polite">
        {!q.trim() ? (
          <div className="search-hint">
            <p>Popular categories</p>
            <div className="chips">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className="chip"
                  onClick={() => {
                    setFilter(c.id)
                    closePanel()
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <Empty title={`No results for “${q.trim()}”`} text="Try a different word such as sofa, bed, table, desk or chair." />
        ) : (
          <ul className="rows">
            {results.map((p) => (
              <li key={p.id} className="row">
                <button className="row-img" onClick={() => openProduct(p.id)} aria-label={`View ${p.name}`}>
                  <Img name={p.image} alt="" sizes="96px" />
                </button>
                <div className="row-info">
                  <button className="row-name" onClick={() => openProduct(p.id)}>
                    {p.name}
                  </button>
                  <span className="row-meta">{CATEGORIES.find((c) => c.id === p.category)?.label}</span>
                  <strong>{formatPrice(effectivePrice(p))}</strong>
                </div>
                <button className="btn btn-sm btn-green" onClick={() => addToCart(p.id)}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Shell>
  )
}

/* ----------------------------------- Cart ----------------------------------- */
function CartPanel() {
  const { cart, subtotal, count, setQty, removeFromCart, closePanel, openPanel, openProduct } = useShop()
  const items = Object.entries(cart).flatMap(([id, qty]) => {
    const p = byId(id)
    return p ? [{ p, qty }] : []
  })
  const FREE_SHIP = 1000
  const left = Math.max(0, FREE_SHIP - subtotal)
  return (
    <Shell label="Shopping cart" side="right" onClose={closePanel}>
      <SheetHead title="Your Cart" sub={`${count} ${count === 1 ? 'item' : 'items'}`} onClose={closePanel} />
      {items.length === 0 ? (
        <Empty
          title="Your cart is empty"
          text="Browse our collections and add something you love."
          action={
            <a className="btn btn-green" href="#shop" onClick={closePanel}>
              Start shopping
            </a>
          }
        />
      ) : (
        <>
          <div className="ship-note">
            <span>
              {left > 0 ? (
                <>Add <strong>{formatPrice(left)}</strong> more for free delivery</>
              ) : (
                <>You’ve unlocked <strong>free delivery</strong></>
              )}
            </span>
            <span className="ship-bar"><i style={{ width: `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%` }} /></span>
          </div>
          <ul className="rows sheet-scroll">
            {items.map(({ p, qty }) => (
              <li key={p.id} className="row">
                <button className="row-img" onClick={() => openProduct(p.id)} aria-label={`View ${p.name}`}>
                  <Img name={p.image} alt="" sizes="96px" />
                </button>
                <div className="row-info">
                  <button className="row-name" onClick={() => openProduct(p.id)}>
                    {p.name}
                  </button>
                  <strong>{formatPrice(effectivePrice(p))}</strong>
                  <div className="qty" role="group" aria-label={`Quantity for ${p.name}`}>
                    <button onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease quantity">
                      <MinusIcon width={14} height={14} />
                    </button>
                    <output aria-live="polite">{qty}</output>
                    <button onClick={() => setQty(p.id, qty + 1)} aria-label="Increase quantity" disabled={qty >= 20}>
                      <PlusIcon width={14} height={14} />
                    </button>
                  </div>
                </div>
                <div className="row-side">
                  <strong>{formatPrice(effectivePrice(p) * qty)}</strong>
                  <button className="link-btn" onClick={() => removeFromCart(p.id)} aria-label={`Remove ${p.name}`}>
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="sheet-foot">
            <p className="sum">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </p>
            <p className="muted">Delivery and taxes calculated at checkout.</p>
            <button className="btn btn-gold btn-block" onClick={() => openPanel('checkout')}>
              Checkout <ArrowRight width={16} height={16} />
            </button>
          </div>
        </>
      )}
    </Shell>
  )
}

/* --------------------------------- Wishlist --------------------------------- */
function WishlistPanel() {
  const { wishlist, toggleWish, addToCart, closePanel, openProduct } = useShop()
  const items = wishlist.flatMap((id) => {
    const p = byId(id)
    return p ? [p] : []
  })
  return (
    <Shell label="Wishlist" side="right" onClose={closePanel}>
      <SheetHead title="Wishlist" sub={`${items.length} saved`} onClose={closePanel} />
      {items.length === 0 ? (
        <Empty
          title="Nothing saved yet"
          text="Tap the heart on any product to keep it here."
          action={
            <a className="btn btn-green" href="#shop" onClick={closePanel}>
              Browse furniture
            </a>
          }
        />
      ) : (
        <ul className="rows sheet-scroll">
          {items.map((p) => (
            <li key={p.id} className="row">
              <button className="row-img" onClick={() => openProduct(p.id)} aria-label={`View ${p.name}`}>
                <Img name={p.image} alt="" sizes="96px" />
              </button>
              <div className="row-info">
                <button className="row-name" onClick={() => openProduct(p.id)}>
                  {p.name}
                </button>
                <strong>{formatPrice(effectivePrice(p))}</strong>
                <button className="btn btn-sm btn-green" onClick={() => addToCart(p.id)}>
                  Add to cart
                </button>
              </div>
              <button className="link-btn" onClick={() => toggleWish(p.id)} aria-label={`Remove ${p.name} from wishlist`}>
                <HeartIcon width={18} height={18} style={{ fill: 'currentColor' }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  )
}

/* ----------------------------------- Menu ----------------------------------- */
function MenuPanel() {
  const { closePanel, setFilter } = useShop()
  return (
    <Shell label="Menu" side="right" onClose={closePanel}>
      <SheetHead title="Menu" onClose={closePanel} />
      <nav className="menu-list" aria-label="Menu">
        {NAV.map((n) => (
          <a key={n.label} href={n.href} onClick={closePanel}>
            {n.label}
          </a>
        ))}
        <p className="menu-sub">Shop by room</p>
        {CATEGORIES.map((c) => (
          <a
            key={c.id}
            href="#shop"
            onClick={() => {
              setFilter(c.id)
              closePanel()
            }}
          >
            {c.label}
          </a>
        ))}
      </nav>
    </Shell>
  )
}

/* ------------------------------- Product detail ------------------------------ */
function ProductPanel() {
  const { productId, openProduct, addToCart, toggleWish, isWished, openPanel } = useShop()
  const p = productId ? byId(productId) : undefined
  const [qty, setQty] = useState(1)
  if (!p) return null
  const wished = isWished(p.id)
  const close = () => openProduct(null)
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3)
  return (
    <Shell label={p.name} side="center" wide onClose={close}>
      <button className="icon-btn dark sheet-x" onClick={close} aria-label="Close product">
        <CloseIcon />
      </button>
      <div className="pd">
        <div className="pd-media">
          <Img name={p.image} alt={p.name} sizes="(max-width: 900px) 92vw, 46vw" eager />
        </div>
        <div className="pd-info">
          <p className="eyebrow dark">{CATEGORIES_LABEL[p.category]}</p>
          <h2>{p.name}</h2>
          <div className="card-rate">
            <Stars rating={p.rating} />
            <span>
              {p.rating} · {p.reviews} ratings <em className="demo">(demo data)</em>
            </span>
          </div>
          <p className="price pd-price">
            <span className={p.salePrice ? 'price-now sale' : 'price-now'}>{formatPrice(effectivePrice(p))}</span>
            {p.salePrice && <s>{formatPrice(p.price)}</s>}
          </p>
          <p className="pd-desc">{p.description}</p>
          <ul className="pd-list">
            {p.details.map((d) => (
              <li key={d}>
                <CheckIcon width={16} height={16} /> {d}
              </li>
            ))}
          </ul>
          <div className="pd-buy">
            <div className="qty qty-lg" role="group" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <MinusIcon width={14} height={14} />
              </button>
              <output aria-live="polite">{qty}</output>
              <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">
                <PlusIcon width={14} height={14} />
              </button>
            </div>
            <button
              className="btn btn-gold grow"
              onClick={() => {
                addToCart(p.id, qty)
                close()
                openPanel('cart')
              }}
            >
              Add to cart · {formatPrice(effectivePrice(p) * qty)}
            </button>
            <button
              className={`wish wish-lg ${wished ? 'is-on' : ''}`}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              onClick={() => toggleWish(p.id)}
            >
              <HeartIcon width={18} height={18} />
            </button>
          </div>
          {related.length > 0 && (
            <div className="pd-related">
              <p className="muted">More from this room</p>
              <div className="pd-related-row">
                {related.map((r) => (
                  <button key={r.id} onClick={() => openProduct(r.id)} aria-label={`View ${r.name}`}>
                    <Img name={r.image} alt="" sizes="120px" />
                    <span>{r.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  )
}
const CATEGORIES_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<string, string>

/* --------------------------------- Checkout --------------------------------- */
function CheckoutPanel() {
  const { cart, subtotal, closePanel, clearCart } = useShop()
  const [done, setDone] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const items = Object.entries(cart).flatMap(([id, qty]) => {
    const p = byId(id)
    return p ? [{ p, qty }] : []
  })
  const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 49
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const err: Record<string, string> = {}
    if (get('name').length < 2) err.name = 'Please enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(get('email'))) err.email = 'Enter a valid email address.'
    if (get('address').length < 5) err.address = 'Enter your delivery address.'
    if (get('city').length < 2) err.city = 'Enter your city.'
    if (get('zip').length < 3) err.zip = 'Enter a postal code.'
    setErrors(err)
    if (Object.keys(err).length) {
      const first = Object.keys(err)[0]
      ;(e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    setDone(`DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
    clearCart()
  }

  if (done)
    return (
      <Shell label="Order confirmation" side="center" onClose={closePanel}>
        <div className="done">
          <span className="done-icon"><CheckIcon width={28} height={28} /></span>
          <h2>Demo order placed</h2>
          <p>
            Reference <strong>{done}</strong>. This is a demonstration store — no payment was taken and no order was created.
          </p>
          <button className="btn btn-green" onClick={closePanel}>
            Continue browsing
          </button>
        </div>
      </Shell>
    )

  const field = (name: string, label: string, props: Record<string, string> = {}) => (
    <label className={`field ${errors[name] ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input name={name} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-e` : undefined} {...props} />
      {errors[name] && <em id={`${name}-e`}>{errors[name]}</em>}
    </label>
  )

  return (
    <Shell label="Checkout" side="center" wide onClose={closePanel}>
      <SheetHead title="Checkout" sub="Demonstration only" onClose={closePanel} />
      {items.length === 0 ? (
        <Empty title="Your cart is empty" text="Add a few pieces before checking out." />
      ) : (
        <div className="co">
          <form className="co-form" onSubmit={submit} noValidate>
            <div className="demo-note" role="note">
              <LockIcon width={16} height={16} />
              <span>
                <strong>Demo checkout.</strong> No payment is processed and no card details are stored or sent anywhere. Don’t enter real card numbers.
              </span>
            </div>
            <h3>Contact</h3>
            {field('name', 'Full name', { autoComplete: 'name' })}
            {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
            <h3>Delivery</h3>
            {field('address', 'Address', { autoComplete: 'street-address' })}
            <div className="grid-2">
              {field('city', 'City', { autoComplete: 'address-level2' })}
              {field('zip', 'Postal code', { autoComplete: 'postal-code' })}
            </div>
            <h3>Payment <small>(not processed)</small></h3>
            <label className="field">
              <span>Card number</span>
              <input name="card" inputMode="numeric" placeholder="Demo only — leave blank" autoComplete="off" disabled />
            </label>
            <button type="submit" className="btn btn-gold btn-block">
              Place demo order · {formatPrice(total)}
            </button>
          </form>
          <aside className="co-sum" aria-label="Order summary">
            <h3>Order summary</h3>
            <ul>
              {items.map(({ p, qty }) => (
                <li key={p.id}>
                  <Img name={p.image} alt="" sizes="64px" />
                  <span>
                    {p.name} <small>× {qty}</small>
                  </span>
                  <strong>{formatPrice(effectivePrice(p) * qty)}</strong>
                </li>
              ))}
            </ul>
            <p className="sum"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p>
            <p className="sum"><span>Delivery</span><strong>{shipping ? formatPrice(shipping) : 'Free'}</strong></p>
            <p className="sum"><span>Estimated tax (8%)</span><strong>{formatPrice(tax)}</strong></p>
            <p className="sum total"><span>Total</span><strong>{formatPrice(total)}</strong></p>
          </aside>
        </div>
      )}
    </Shell>
  )
}

export function Panels() {
  const { panel, productId, toast } = useShop()
  return (
    <>
      {panel === 'search' && <SearchPanel />}
      {panel === 'cart' && <CartPanel />}
      {panel === 'wishlist' && <WishlistPanel />}
      {panel === 'menu' && <MenuPanel />}
      {panel === 'checkout' && <CheckoutPanel />}
      {productId && panel !== 'checkout' && <ProductPanel key={productId} />}
      <div className="toast-wrap" aria-live="polite" role="status">
        {toast && (
          <div key={toast.id} className="toast">
            <CheckIcon width={16} height={16} /> {toast.message}
          </div>
        )}
      </div>
    </>
  )
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { byId, effectivePrice, type Category } from '../data/products'

type Panel = 'cart' | 'search' | 'wishlist' | 'menu' | 'checkout' | null

interface ShopState {
  cart: Record<string, number>
  wishlist: string[]
  count: number
  subtotal: number
  panel: Panel
  openPanel: (p: Panel) => void
  closePanel: () => void
  productId: string | null
  openProduct: (id: string | null) => void
  filter: Category | 'all' | 'sale'
  setFilter: (c: Category | 'all' | 'sale') => void
  addToCart: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  toggleWish: (id: string) => void
  isWished: (id: string) => boolean
  toast: { id: number; message: string } | null
  notify: (message: string) => void
  lastAdded: string | null
}

const Ctx = createContext<ShopState | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable – state stays in memory */
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>(() => {
    const stored = load<Record<string, number>>('woodhaven.cart', {})
    // drop ids that no longer exist in the catalogue
    return Object.fromEntries(Object.entries(stored).filter(([id, q]) => byId(id) && q > 0))
  })
  const [wishlist, setWishlist] = useState<string[]>(() => load<string[]>('woodhaven.wishlist', []).filter((id) => byId(id)))
  const [panel, setPanel] = useState<Panel>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Category | 'all' | 'sale'>('all')
  const [toast, setToast] = useState<ShopState['toast']>(null)
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  useEffect(() => save('woodhaven.cart', cart), [cart])
  useEffect(() => save('woodhaven.wishlist', wishlist), [wishlist])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const notify = useCallback((message: string) => setToast({ id: Date.now(), message }), [])

  const addToCart = useCallback(
    (id: string, qty = 1) => {
      setCart((c) => ({ ...c, [id]: Math.min(20, (c[id] ?? 0) + qty) }))
      setLastAdded(id)
      setTimeout(() => setLastAdded((l) => (l === id ? null : l)), 1400)
      notify(`${byId(id)?.name ?? 'Item'} added to your cart`)
    },
    [notify],
  )
  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c }
      if (qty <= 0) delete next[id]
      else next[id] = Math.min(20, qty)
      return next
    })
  }, [])
  const removeFromCart = useCallback((id: string) => setQty(id, 0), [setQty])
  const clearCart = useCallback(() => setCart({}), [])

  const toggleWish = useCallback(
    (id: string) => {
      setWishlist((w) => {
        const has = w.includes(id)
        notify(has ? 'Removed from wishlist' : 'Saved to wishlist')
        return has ? w.filter((x) => x !== id) : [...w, id]
      })
    },
    [notify],
  )

  const value = useMemo<ShopState>(() => {
    const count = Object.values(cart).reduce((a, b) => a + b, 0)
    const subtotal = Object.entries(cart).reduce((sum, [id, q]) => {
      const p = byId(id)
      return sum + (p ? effectivePrice(p) * q : 0)
    }, 0)
    return {
      cart,
      wishlist,
      count,
      subtotal,
      panel,
      openPanel: setPanel,
      closePanel: () => setPanel(null),
      productId,
      openProduct: (id) => {
        setProductId(id)
        if (id) setPanel(null)
      },
      filter,
      setFilter,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWish,
      isWished: (id) => wishlist.includes(id),
      toast,
      notify,
      lastAdded,
    }
  }, [cart, wishlist, panel, productId, filter, toast, lastAdded, addToCart, setQty, removeFromCart, clearCart, toggleWish, notify])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useShop() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useShop must be used inside ShopProvider')
  return v
}

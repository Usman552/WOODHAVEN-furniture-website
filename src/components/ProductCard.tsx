import { effectivePrice, formatPrice, type Product } from '../data/products'
import { useShop } from '../store/shop'
import { BagIcon, CheckIcon, HeartIcon, StarIcon } from './icons'
import { Img } from './Img'

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 (demo rating)`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} width={12} height={12} className={i < Math.round(rating) ? 'on' : ''} />
      ))}
    </span>
  )
}

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { addToCart, toggleWish, isWished, openProduct, lastAdded } = useShop()
  const wished = isWished(p.id)
  const added = lastAdded === p.id
  return (
    <article className="card" style={{ ['--i' as string]: index }} data-r>
      <div className="card-media">
        <button className="card-open" onClick={() => openProduct(p.id)} aria-label={`View ${p.name}`}>
          <Img name={p.image} alt={p.name} sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 24vw" />
        </button>
        {p.badge && <span className={`tag ${p.badge === 'Sale' ? 'tag-sale' : ''}`}>{p.badge}</span>}
        <button
          className={`wish ${wished ? 'is-on' : ''}`}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          onClick={() => toggleWish(p.id)}
        >
          <HeartIcon width={16} height={16} />
        </button>
      </div>
      <div className="card-body">
        <h3 className="card-title">
          <button onClick={() => openProduct(p.id)}>{p.name}</button>
        </h3>
        <div className="card-rate">
          <Stars rating={p.rating} />
          <span>({p.reviews})</span>
        </div>
        <div className="card-foot">
          <p className="price">
            <span className={p.salePrice ? 'price-now sale' : 'price-now'}>{formatPrice(effectivePrice(p))}</span>
            {p.salePrice && <s>{formatPrice(p.price)}</s>}
          </p>
          <button
            className={`cart-btn ${added ? 'is-added' : ''}`}
            onClick={() => addToCart(p.id)}
            aria-label={`Add ${p.name} to cart`}
          >
            {added ? <CheckIcon width={16} height={16} /> : <BagIcon width={16} height={16} />}
          </button>
        </div>
      </div>
    </article>
  )
}

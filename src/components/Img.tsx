import { asset } from '../assets-url'
import type { CSSProperties } from 'react'

interface Props {
  name: string
  alt: string
  sizes?: string
  className?: string
  style?: CSSProperties
  eager?: boolean
}

/** Self-hosted Unsplash photos in two widths (640w / 1600w). */
export function Img({ name, alt, sizes = '(max-width: 768px) 90vw, 33vw', className, style, eager }: Props) {
  return (
    <img
      src={asset(`img/${name}-sm.jpg`)}
      srcSet={`${asset(`img/${name}-sm.jpg`)} 640w, ${asset(`img/${name}-lg.jpg`)} 1600w`}
      sizes={sizes}
      alt={alt}
      className={className}
      style={style}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  )
}

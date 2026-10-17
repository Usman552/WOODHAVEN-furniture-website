import type { ReactNode, SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}
const I = (children: ReactNode) =>
  function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg {...base} {...props}>
        {children}
      </svg>
    )
  }

export const SearchIcon = I(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </>,
)
export const HeartIcon = I(<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />)
export const BagIcon = I(
  <>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </>,
)
export const MenuIcon = I(<path d="M4 7h16M4 12h16M4 17h16" />)
export const CloseIcon = I(<path d="m6 6 12 12M18 6 6 18" />)
export const ArrowRight = I(<path d="M5 12h14m-5-5 5 5-5 5" />)
export const ArrowLeft = I(<path d="M19 12H5m5-5-5 5 5 5" />)
export const ArrowDown = I(<path d="M12 5v14m-5-5 5 5 5-5" />)
export const StarIcon = I(<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.8l1-5.9L3.5 9.800l5.9-.8L12 3.600Z" fill="currentColor" stroke="none" />)
export const ShieldIcon = I(
  <>
    <path d="M12 3 5 6v5.5c0 4.200 2.900 7.500 7 9 4.100-1.500 7-4.800 7-9V6l-7-3Z" />
    <path d="m9 12 2.200 2.200L15.500 10" />
  </>,
)
export const TruckIcon = I(
  <>
    <path d="M3 6.500h11v9H3zM14 10h4l3 3v2.500h-7" />
    <circle cx="7" cy="17.500" r="1.800" />
    <circle cx="17" cy="17.500" r="1.800" />
  </>,
)
export const SofaIcon = I(
  <>
    <path d="M5 11V8.500A2.500 2.500 0 0 1 7.500 6h9A2.500 2.500 0 0 1 19 8.500V11" />
    <path d="M3 13a2 2 0 0 1 4 0v1.500h10V13a2 2 0 0 1 4 0v4H3v-4Z" />
    <path d="M6 17v2m12-2v2" />
  </>,
)
export const LockIcon = I(
  <>
    <rect x="5" y="10.500" width="14" height="9.500" rx="2" />
    <path d="M8.500 10.500V8a3.500 3.500 0 0 1 7 0v2.500" />
  </>,
)
export const PlusIcon = I(<path d="M12 5v14M5 12h14" />)
export const MinusIcon = I(<path d="M5 12h14" />)
export const CheckIcon = I(<path d="m5 12.500 4.500 4.500L19 7.500" />)
export const TrashIcon = I(
  <>
    <path d="M4.500 7h15M9.500 7V5h5v2M6.500 7l.8 12.500h9.400L17.500 7" />
  </>,
)
export const FacebookIcon = I(<path d="M14 8.500h2V5.500h-2.500A3.500 3.500 0 0 0 10 9v2H8v3h2v6h3v-6h2.200l.5-3H13V9.300c0-.4.300-.8 1-.8Z" fill="currentColor" stroke="none" />)
export const InstagramIcon = I(
  <>
    <rect x="4" y="4" width="16" height="16" rx="4.500" />
    <circle cx="12" cy="12" r="3.600" />
    <circle cx="16.800" cy="7.200" r=".6" fill="currentColor" />
  </>,
)
export const YoutubeIcon = I(
  <>
    <rect x="3" y="6" width="18" height="12" rx="3.500" />
    <path d="m10.500 9.500 4 2.500-4 2.500v-5Z" fill="currentColor" />
  </>,
)
export const PinterestIcon = I(
  <>
    <circle cx="12" cy="12" r="8.500" />
    <path d="m11 9.500-2 8.500m1-4.200c3.800 1.600 6-1.200 5.200-3.800C13.400 7.600 9 9 9.600 12" />
  </>,
)

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`logo ${className ?? ''}`}>
      <svg viewBox="0 0 34 40" width="32" height="34" aria-hidden="true">
        <path d="M3 8h5l3.500 16L15 8h4l3.500 16L26 8h5l-6 24h-4.500L17 17.500 13.500 32H9L3 8Z" fill="currentColor" />
      </svg>
      <span className="logo-text">
        <span className="logo-name">WOODHAVEN</span>
        <span className="logo-sub">furniture.com</span>
      </span>
    </span>
  )
}

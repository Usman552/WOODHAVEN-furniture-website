export type Category = 'living' | 'bedroom' | 'dining' | 'office' | 'outdoor'

export const CATEGORIES: { id: Category; label: string; image: string }[] = [
  { id: 'living', label: 'Living Room', image: 'living' },
  { id: 'bedroom', label: 'Bedroom', image: 'bedroom' },
  { id: 'dining', label: 'Dining Room', image: 'dining' },
  { id: 'office', label: 'Office', image: 'office' },
  { id: 'outdoor', label: 'Outdoor', image: 'outdoor' },
]

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  salePrice?: number
  image: string
  description: string
  details: string[]
  /** Demo rating – sample data, not real customer reviews. */
  rating: number
  reviews: number
  badge?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'modern-sofa-set',
    name: 'Modern Sofa Set',
    category: 'living',
    price: 899,
    image: 'sofa-grey',
    description:
      'A relaxed three-seater with deep seats, soft piped cushions and solid beech legs. Built for long evenings and easy to style with any palette.',
    details: ['Kiln-dried hardwood frame', 'Removable, washable covers', 'Seat width 210 cm', 'Ships in 5–7 working days'],
    rating: 4.8,
    reviews: 124,
    badge: 'Best seller',
  },
  {
    id: 'accent-armchair',
    name: 'Accent Armchair',
    category: 'living',
    price: 399,
    image: 'chair-green',
    description:
      'A sculpted bouclé armchair in forest green with a walnut-finished frame. Compact enough for a reading corner, comfortable enough to stay in.',
    details: ['Bouclé upholstery', 'Solid ash frame, walnut finish', 'Seat height 44 cm', 'Assembly: legs only'],
    rating: 4.7,
    reviews: 98,
  },
  {
    id: 'dining-table-set',
    name: 'Dining Table Set',
    category: 'dining',
    price: 699,
    image: 'dining-wood',
    description:
      'A warm timber dining table with four matching chairs. Rounded edges and a satin finish keep the look timeless and the surface easy to care for.',
    details: ['Seats 4–6', 'Oak veneer top, solid legs', 'Table 160 × 90 cm', 'Chairs included'],
    rating: 4.6,
    reviews: 76,
  },
  {
    id: 'elegant-bed-frame',
    name: 'Elegant Bed Frame',
    category: 'bedroom',
    price: 799,
    image: 'bed-tufted',
    description:
      'A tufted upholstered headboard and a generous frame in soft neutral fabric. Slatted base included, no box spring needed.',
    details: ['King size (160 × 200 cm)', 'Tufted headboard', 'Slatted base included', 'Under-bed storage clearance 28 cm'],
    rating: 4.9,
    reviews: 112,
    badge: 'New',
  },
  {
    id: 'forest-velvet-sofa',
    name: 'Forest Velvet Sofa',
    category: 'living',
    price: 1149,
    salePrice: 949,
    image: 'living',
    description:
      'Deep emerald velvet, tapered legs and a low, generous profile. The statement piece that anchors a room.',
    details: ['Performance velvet', 'High-resilience foam seats', 'Width 215 cm', 'Ships in 7–10 working days'],
    rating: 4.8,
    reviews: 87,
    badge: 'Sale',
  },
  {
    id: 'walnut-sideboard',
    name: 'Walnut Sideboard',
    category: 'dining',
    price: 749,
    image: 'sideboard',
    description:
      'Mid-century lines in warm walnut veneer with a sliding-door cabinet and tapered legs. Storage that looks like furniture, not storage.',
    details: ['Walnut veneer, solid legs', 'Two shelves inside', 'Width 150 cm', 'Cable access at rear'],
    rating: 4.7,
    reviews: 54,
  },
  {
    id: 'studio-work-desk',
    name: 'Studio Work Desk',
    category: 'office',
    price: 549,
    image: 'office',
    description:
      'A light oak desk with an open frame and a deep work surface. Fits two monitors and still leaves room to think.',
    details: ['Oak veneer top', 'Steel A-frame legs', '140 × 70 cm', 'Cable tray included'],
    rating: 4.6,
    reviews: 63,
  },
  {
    id: 'terrace-lounge-set',
    name: 'Terrace Lounge Set',
    category: 'outdoor',
    price: 1299,
    salePrice: 1099,
    image: 'outdoor',
    description:
      'Two striped lounge chairs and a stone-effect side drum, built from weatherproof materials for balconies and terraces.',
    details: ['Powder-coated steel frame', 'Quick-dry cushions', 'UV-resistant fabric', 'Set of 2 chairs + 1 table'],
    rating: 4.5,
    reviews: 41,
    badge: 'Sale',
  },
  {
    id: 'lounge-armchair-cream',
    name: 'Cloud Lounge Chair',
    category: 'living',
    price: 459,
    image: 'round-chair',
    description: 'A deep, rounded lounge chair with plump cushions. Wide enough to curl up in.',
    details: ['Soft-touch upholstery', 'Hardwood frame', 'Seat depth 58 cm', 'Cushions included'],
    rating: 4.7,
    reviews: 69,
  },
  {
    id: 'oak-dining-table',
    name: 'Oak Dining Table',
    category: 'dining',
    price: 629,
    image: 'dining',
    description: 'A clean-lined oak table that seats six, designed to sit comfortably in open-plan homes.',
    details: ['Solid oak legs', 'Seats 6', '180 × 90 cm', 'Matte lacquer finish'],
    rating: 4.6,
    reviews: 58,
  },
  {
    id: 'panelled-bed',
    name: 'Walnut Panel Bed',
    category: 'bedroom',
    price: 1049,
    image: 'bedroom',
    description: 'A low platform bed with a vertical fluted headboard in warm tones. Calm, architectural and quietly luxurious.',
    details: ['Platform base', 'Fluted headboard', 'King size', 'Integrated side shelf'],
    rating: 4.8,
    reviews: 47,
  },
  {
    id: 'garden-bench-set',
    name: 'Garden Planter Bench',
    category: 'outdoor',
    price: 349,
    image: 'outdoor',
    description: 'A compact bench with weather-resistant cushions for a small patio or balcony.',
    details: ['Weather-resistant', 'Folds flat', 'Width 120 cm', 'Cushions included'],
    rating: 4.4,
    reviews: 28,
  },
]

export const effectivePrice = (p: Product) => p.salePrice ?? p.price
export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id)

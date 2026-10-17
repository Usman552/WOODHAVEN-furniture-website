# WOODHAVEN — Premium Furniture E-commerce

A fully responsive furniture storefront with a **cinematic, scroll-driven 3D hero**. A real three.js living room (sofa, coffee table, armchair, plants, lamps, sunlight and shadows) is filmed by a camera that glides through it as you scroll. Below the hero is a complete shopping experience: categories, products, search, wishlist, cart and a demo checkout.

**Live demo:** https://usman552.github.io/WOODHAVEN-furniture-website/

![Hero](docs/screenshots/03-hero-final.jpg)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![three.js](https://img.shields.io/badge/three.js-R3F-000000?logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)

## Features

**3D hero**
- Real-time 3D room with PBR materials, warm sunlight, soft shadows and an HDRI for reflections.
- Four-stage camera path driven by scroll: wide room → sofa and table → material detail → final composition.
- Headline stays readable throughout; subtle mouse parallax on desktop; stage label (01–04).
- Photo shows instantly, the 3D scene loads lazily and fades in. If WebGL is missing, the device is weak or the GPU context is lost, the photo hero stays.
- Reduced-motion users get a static hero. Mobile gets a lighter scene.

**Shopping**
- 12 demo products, category chips and a sale filter.
- Live search with empty-result states.
- Wishlist and cart (add, remove, quantities, subtotal, free-delivery progress), saved in `localStorage`.
- Product detail pop-up with related items.
- Validated checkout that is clearly **demo only** (no payment is taken).
- Newsletter form with validation and feedback; testimonial carousel with controls.

**Design and UX**
- Forest green, ivory and champagne gold palette; Manrope typography.
- One consistent motion style (staggered reveal, image zoom, arrow nudges).
- Responsive from 320 px to 1920 px with no horizontal overflow.
- Keyboard accessible: focus trapping in dialogs, `Esc` to close, ARIA labels, skip link.

## Screenshots

### Desktop

| | |
|---|---|
| ![](docs/screenshots/01-hero-establishing.jpg) **Hero: establishing shot** | ![](docs/screenshots/02-hero-detail.jpg) **Hero: close detail** |
| ![](docs/screenshots/04-categories.jpg) **Categories** | ![](docs/screenshots/05-featured-banner.jpg) **Featured banner** |
| ![](docs/screenshots/06-products.jpg) **Best sellers** | ![](docs/screenshots/07-offer-why.jpg) **Offer and why choose us** |
| ![](docs/screenshots/08-collection.jpg) **Collections** | ![](docs/screenshots/09-testimonials.jpg) **Testimonials and newsletter** |
| ![](docs/screenshots/11-product-detail.jpg) **Product detail** | ![](docs/screenshots/12-cart.jpg) **Cart** |

![](docs/screenshots/10-cta-footer.jpg)

### Tablet and mobile

<p>
  <img src="docs/screenshots/13-tablet-hero.jpg" width="240" alt="Tablet hero" />
  <img src="docs/screenshots/14-tablet-products.jpg" width="240" alt="Tablet products" />
  <img src="docs/screenshots/15-mobile-hero.jpg" width="160" alt="Mobile hero" />
  <img src="docs/screenshots/16-mobile-hero-scrolled.jpg" width="160" alt="Mobile hero scrolled" />
</p>
<p>
  <img src="docs/screenshots/17-mobile-categories.jpg" width="160" alt="Mobile categories" />
  <img src="docs/screenshots/18-mobile-products.jpg" width="160" alt="Mobile products" />
  <img src="docs/screenshots/19-mobile-cart.jpg" width="160" alt="Mobile cart" />
</p>

## Tech stack

| Area | Tools |
|---|---|
| Framework | React 19, TypeScript, Vite |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Animation | GSAP + ScrollTrigger (hero), CSS transitions (everything else) |
| State | React context, `localStorage` persistence |
| Styling | Plain CSS with design tokens, no UI framework |
| Assets | Poly Haven (CC0 models, textures, HDRI), Unsplash photos |
| Hosting | GitHub Pages via GitHub Actions |

## Run locally

Requires Node.js 20 or newer.

```bash
git clone https://github.com/Usman552/WOODHAVEN-furniture-website.git
cd WOODHAVEN-furniture-website
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm run lint
```

To build for a sub-path (like GitHub Pages) set the base: `VITE_BASE=/WOODHAVEN-furniture-website/ npm run build`.

## Project structure

| Path | Purpose |
|---|---|
| `src/components/Hero.tsx` | Pinned hero, scroll progress, headline animation, 3D/static fallback |
| `src/three/` | `HeroScene` (canvas), `Room`, `Furniture`, `Lighting`, `CameraRig`, `shots` (camera keyframes) |
| `src/components/Sections.tsx` | All homepage sections and footer |
| `src/components/Panels.tsx` | Search, cart, wishlist, menu, product detail, checkout |
| `src/store/shop.tsx` | Cart, wishlist and UI state |
| `src/data/products.ts` | Demo catalogue |
| `public/` | Photos, glTF models, textures, HDRI |

To change the camera move, edit the keyframes in `src/three/shots.ts` (scroll progress 0 to 1).

## Notes and limitations

- Prices, ratings and testimonials are **sample data**. Checkout takes **no payment** and stores nothing.
- The sofa, cushions, lamps, side table, vase and books are modelled in code, because no modern CC0 sofa was available. The coffee table, armchair and plants are Poly Haven models.
- Performance was tested only with software rendering in headless Chrome, not on real GPUs or phones.
- Footer links such as Shipping and FAQ are placeholders.

## Credits

- Photography: [Unsplash](https://unsplash.com) under the Unsplash License. Please check each photo's licence before commercial use.
- 3D models, textures and HDRI: [Poly Haven](https://polyhaven.com), CC0.
- Font: [Manrope](https://fonts.google.com/specimen/Manrope).

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { webglAvailable, useIsMobile, useReducedMotion } from '../hooks/useCapabilities'
import { ArrowDown, ArrowRight, SofaIcon, ShieldIcon, TruckIcon } from './icons'
import { Img } from './Img'
import { useShop } from '../store/shop'

gsap.registerPlugin(ScrollTrigger)

// The whole 3D stack (three, r3f, drei, models) lives in this lazy chunk.
const HeroScene = lazy(() => import('../three/HeroScene'))

const STAGES = ['The room', 'The sofa', 'The details', 'The collection']

function canRender3D() {
  if (typeof window === 'undefined' || !webglAvailable()) return false
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (nav.deviceMemory && nav.deviceMemory <= 2) return false
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false
  return true
}

export function Hero() {
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const { setFilter } = useShop()
  const trackRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const progress = useRef(reduced ? 1 : 0)
  const [stage, setStage] = useState(0)
  const [supported] = useState(canRender3D)
  const [mountScene, setMountScene] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(true)

  // Mount the heavy chunk only after the first paint so the photo hero is the LCP.
  useEffect(() => {
    if (!supported) return
    const t = setTimeout(() => setMountScene(true), 350)
    return () => clearTimeout(t)
  }, [supported])

  // Scroll progress → camera. Normal scrolling (no hijack): the hero is `position: sticky`
  // inside a taller track and ScrollTrigger just reports how far through the track we are.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    progress.current = reduced ? 1 : 0
    if (reduced) return
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top+=68',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress
        setStage(Math.min(3, Math.floor(self.progress * 4)))
      },
    })
    // pause rendering once the hero has fully scrolled away
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 })
    io.observe(track)
    return () => {
      st.kill()
      io.disconnect()
    }
  }, [reduced])

  // Headline entrance: masked line reveal.
  useEffect(() => {
    const root = textRef.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.set('.hero-line > span', { yPercent: 105, opacity: 0 })
      gsap.set('.hero-fade', { y: 18, opacity: 0 })
      gsap
        .timeline({ delay: 0.25, defaults: { ease: 'power3.out' } })
        .to('.hero-line > span', { yPercent: 0, opacity: 1, duration: 1.0, stagger: 0.14 })
        .to('.hero-fade', { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.55')
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const show3D = supported && mountScene && !failed

  return (
    <section className="hero" aria-label="Introduction">
      <div className={`hero-track ${reduced ? 'is-static' : ''}`} ref={trackRef}>
        <div className="hero-sticky">
          {/* Always-present photographic layer: LCP image, loading state and no-WebGL fallback */}
          <Img name="hero" alt="" eager sizes="100vw" className="hero-photo" />
          {show3D && (
            <div className={`hero-stage ${ready ? 'is-ready' : ''}`} aria-hidden="true">
              <Suspense fallback={null}>
                <HeroScene
                  progress={progress}
                  mobile={mobile}
                  reduced={reduced}
                  active={active}
                  onReady={() => setReady(true)}
                  onFail={() => setFailed(true)}
                />
              </Suspense>
            </div>
          )}
          <div className="hero-shade" />
          {show3D && !ready && <div className="hero-loader" aria-hidden="true"><span /></div>}

          <div className="container hero-inner">
            <div className="hero-copy" ref={textRef}>
              <p className="eyebrow hero-fade">Premium furniture for modern living</p>
              <h1 className="hero-title">
                <span className="hero-line"><span>Beautiful Spaces</span></span>
                <span className="hero-line"><span>Start With</span></span>
                <span className="hero-line"><span className="gold">The Right Furniture</span></span>
              </h1>
              <p className="hero-lede hero-fade">
                Discover timeless designs, premium quality, and furniture that fits your lifestyle.
              </p>
              <a
                className="btn btn-gold hero-fade"
                href="#shop"
                onClick={() => setFilter('all')}
              >
                Shop Now <ArrowRight width={16} height={16} />
              </a>
            </div>
          </div>

          <div className="container hero-foot">
            <ul className="trust">
              <li><ShieldIcon width={18} height={18} /> Premium Quality</li>
              <li><SofaIcon width={18} height={18} /> Modern Design</li>
              <li><TruckIcon width={18} height={18} /> Fast &amp; Safe Delivery</li>
            </ul>
            {show3D && !reduced && (
              <p className="stage" aria-hidden="true">
                <span className="stage-num">0{stage + 1}</span>
                <span key={stage} className="stage-label">{STAGES[stage]}</span>
              </p>
            )}
            <a className="scroll-cue" href="#categories" aria-label="Scroll down to categories">
              <span className="scroll-circle"><ArrowDown width={16} height={16} /></span>
              <span>Scroll Down</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

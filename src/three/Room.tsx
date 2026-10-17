import { asset } from '../assets-url'
import { useLayoutEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { CanvasTexture, LinearFilter, RepeatWrapping, SRGBColorSpace, type Texture } from 'three'

function tile(t: Texture, rx: number, ry: number, srgb = false) {
  t.wrapS = t.wrapT = RepeatWrapping
  t.repeat.set(rx, ry)
  if (srgb) t.colorSpace = SRGBColorSpace
  t.anisotropy = 8
  t.needsUpdate = true
}

function usePbr(base: string, rx: number, ry: number, rough = true) {
  const b = asset(base)
  const files = rough ? [`${b}_diff.jpg`, `${b}_nor.jpg`, `${b}_rough.jpg`] : [`${b}_diff.jpg`, `${b}_nor.jpg`]
  const [map, normalMap, roughnessMap] = useTexture(files)
  useLayoutEffect(() => {
    tile(map, rx, ry, true)
    tile(normalMap, rx, ry)
    if (roughnessMap) tile(roughnessMap, rx, ry)
  }, [map, normalMap, roughnessMap, rx, ry])
  return rough ? { map, normalMap, roughnessMap } : { map, normalMap }
}

/** Procedural abstract artwork in the brand palette (forest green, sand, champagne). */
function useArtTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 640
    const g = c.getContext('2d')!
    g.fillStyle = '#e9e1d0'
    g.fillRect(0, 0, 512, 640)
    const blob = (x: number, y: number, rx: number, ry: number, col: string, rot = 0) => {
      g.save()
      g.translate(x, y)
      g.rotate(rot)
      g.fillStyle = col
      g.beginPath()
      g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      g.fill()
      g.restore()
    }
    blob(250, 230, 150, 190, '#16452f', -0.25)
    blob(290, 300, 110, 150, '#2f6b4a', 0.3)
    blob(210, 380, 120, 100, '#c9a35c', 0.6)
    blob(330, 190, 60, 90, '#e9e1d0', 0.2)
    blob(170, 220, 36, 60, '#0b2a1d', -0.4)
    const t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    t.minFilter = LinearFilter
    return t
  }, [])
}

/** Soft daylight "view" for the window: sky gradient with blurred foliage. */
function useWindowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 512
    const g = c.getContext('2d')!
    const grad = g.createLinearGradient(0, 0, 0, 512)
    grad.addColorStop(0, '#fdf4e0')
    grad.addColorStop(0.55, '#f6e7c6')
    grad.addColorStop(1, '#cfd9a8')
    g.fillStyle = grad
    g.fillRect(0, 0, 512, 512)
    g.filter = 'blur(14px)'
    // seeded PRNG so the foliage looks the same on every load
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    for (let i = 0; i < 90; i++) {
      const x = rnd() * 512
      const y = 300 + rnd() * 230
      g.fillStyle = `rgba(${40 + rnd() * 40},${90 + rnd() * 60},${40 + rnd() * 30},${0.35 + rnd() * 0.4})`
      g.beginPath()
      g.ellipse(x, y, 30 + rnd() * 40, 20 + rnd() * 30, rnd() * 3, 0, Math.PI * 2)
      g.fill()
    }
    const t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    return t
  }, [])
}

const WALL_Z = -2.4
const RIGHT_X = 4.3

export function Room() {
  const floor = usePbr('tex/wood_floor', 9, 9)
  const wall = usePbr('tex/beige_wall_001', 3, 1.5)
  const walnut = usePbr('tex/walnut_veneer_02', 1.2, 1.4)
  const rug = usePbr('tex/curly_teddy_natural', 2.4, 1.8, false)
  const art = useArtTexture()
  const view = useWindowTexture()

  return (
    <group>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial {...floor} color="#dccbb0" roughness={0.78} envMapIntensity={0.7} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 1.7, WALL_Z]} receiveShadow>
        <planeGeometry args={[30, 3.4]} />
        <meshStandardMaterial {...wall} color="#efe6d6" />
      </mesh>

      {/* ceiling and left wall so the frame is always filled by the room, never the page behind */}
      <mesh position={[0, 3.4, 4]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f4eee2" roughness={1} />
      </mesh>
      <mesh position={[-6.5, 1.7, 3]} rotation-y={Math.PI / 2} receiveShadow>
        <planeGeometry args={[30, 3.4]} />
        <meshStandardMaterial {...wall} color="#efe6d6" />
      </mesh>

      {/* walnut feature panel behind the sofa */}
      <mesh position={[-0.35, 1.5, WALL_Z + 0.04]} receiveShadow castShadow>
        <boxGeometry args={[3.9, 3.0, 0.08]} />
        <meshStandardMaterial {...walnut} color="#2a1a0f" roughness={0.6} />
      </mesh>
      {/* vertical slats */}
      {Array.from({ length: 13 }, (_, i) => (
        <mesh key={i} position={[-0.35 - 1.8 + i * 0.3, 1.5, WALL_Z + 0.12]} castShadow receiveShadow>
          <boxGeometry args={[0.07, 3.0, 0.06]} />
          <meshStandardMaterial {...walnut} color="#7a5333" roughness={0.45} />
        </mesh>
      ))}

      {/* artwork */}
      <group position={[-0.35, 1.78, WALL_Z + 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.98, 1.22, 0.04]} />
          <meshStandardMaterial color="#1c1a16" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.86, 1.1]} />
          <meshStandardMaterial map={art} roughness={0.9} />
        </mesh>
      </group>

      {/* right wall with a large window opening, built from pieces so sunlight passes through.
          group-local x → world z, group-local z → world -x (so negative local z is "outside"). */}
      <group position={[RIGHT_X, 0, 0]} rotation-y={-Math.PI / 2}>
        <mesh position={[4.15, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[15.7, 0.7, 0.3]} />
          <meshStandardMaterial {...wall} color="#efe6d6" />
        </mesh>
        <mesh position={[4.15, 3.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[15.7, 0.5, 0.3]} />
          <meshStandardMaterial {...wall} color="#efe6d6" />
        </mesh>
        <mesh position={[-2.45, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 3.4, 0.3]} />
          <meshStandardMaterial {...wall} color="#efe6d6" />
        </mesh>
        <mesh position={[7.1, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[9.8, 3.4, 0.3]} />
          <meshStandardMaterial {...wall} color="#efe6d6" />
        </mesh>
        {[-0.1, 1.1].map((x) => (
          <mesh key={x} position={[x + 0.5, 1.8, 0]} castShadow>
            <boxGeometry args={[0.06, 2.5, 0.1]} />
            <meshStandardMaterial color="#14211c" roughness={0.4} metalness={0.4} />
          </mesh>
        ))}
        <mesh position={[0.5, 1.8, 0]} castShadow>
          <boxGeometry args={[3.4, 0.05, 0.1]} />
          <meshStandardMaterial color="#14211c" roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[0.5, 1.8, -1.2]}>
          <planeGeometry args={[7, 5]} />
          <meshBasicMaterial map={view} toneMapped={false} side={2} />
        </mesh>
      </group>

      {/* sheer curtains framing the window */}
      {[-1.45, 2.45].map((z) => (
        <mesh key={z} position={[RIGHT_X - 0.4, 1.7, z]} rotation-y={-Math.PI / 2}>
          <planeGeometry args={[0.8, 3.3]} />
          <meshStandardMaterial color="#f4eee2" transparent opacity={0.85} side={2} roughness={1} />
        </mesh>
      ))}

      {/* back-wall window: picture of daylight, framed, with sheer curtains */}
      <group position={[3.3, 1.75, WALL_Z + 0.03]}>
        <mesh>
          <planeGeometry args={[2.4, 2.1]} />
          <meshBasicMaterial map={view} toneMapped={false} />
        </mesh>
        {[
          [0, 1.08, 2.5, 0.07],
          [0, -1.08, 2.5, 0.09],
          [-1.22, 0, 0.07, 2.2],
          [1.22, 0, 0.07, 2.2],
          [0, 0, 0.04, 2.1],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.03]} castShadow>
            <boxGeometry args={[w, h, 0.08]} />
            <meshStandardMaterial color="#f1ece1" roughness={0.6} />
          </mesh>
        ))}
        {[-1.5, 1.5].map((x) => (
          <mesh key={x} position={[x, 0, 0.12]}>
            <planeGeometry args={[0.7, 3.1]} />
            <meshStandardMaterial color="#f4eee2" transparent opacity={0.88} side={2} roughness={1} />
          </mesh>
        ))}
      </group>

      {/* rug */}
      <mesh position={[-0.3, 0.006, 0.1]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[3.6, 2.5]} />
        <meshStandardMaterial {...rug} color="#d9cfbb" roughness={1} />
      </mesh>
    </group>
  )
}

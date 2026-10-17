import { asset } from '../assets-url'
import { useLayoutEffect, useMemo, type ReactNode } from 'react'
import { RoundedBox, useGLTF, useTexture } from '@react-three/drei'
import { Color, LatheGeometry, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, Vector2, type Mesh, type Object3D } from 'three'

const CHAIR = asset('models/modern_arm_chair_01/modern_arm_chair_01.gltf')
const TABLE = asset('models/modern_coffee_table_01/modern_coffee_table_01.gltf')
const ANTHURIUM = asset('models/anthurium_botany_01/anthurium_botany_01.gltf')
const POTTED = asset('models/potted_plant_04/potted_plant_04.gltf')

export const MODEL_URLS = [CHAIR, TABLE, ANTHURIUM, POTTED]

function Model({ url, children, tint, ...rest }: { url: string; children?: ReactNode; tint?: Record<string, string>; [k: string]: unknown }) {
  const { scene } = useGLTF(url)
  const clone = useMemo(() => scene.clone(true), [scene])
  useLayoutEffect(() => {
    clone.traverse((o: Object3D) => {
      const m = o as Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
        // re-colour specific materials (matched by name) - keeps the original roughness/normal maps
        const mat = m.material as MeshStandardMaterial
        const hit = tint && Object.keys(tint).find((k) => mat.name.includes(k))
        if (hit) {
          mat.map = null
          mat.color = new Color(tint[hit])
          mat.metalnessMap = null
          mat.roughnessMap = null
          mat.metalness = 0
          mat.roughness = 0.88
          mat.needsUpdate = true
        }
      }
    })
  }, [clone, tint])
  return (
    <group {...rest}>
      <primitive object={clone} />
      {children}
    </group>
  )
}

const FABRIC = { roughness: 0.92, sheen: 0.7, sheenRoughness: 0.55 }

function useFabric(name: 'curly_teddy_natural', repeat = 2) {
  const [map, normalMap] = useTexture([asset(`tex/${name}_diff.jpg`), asset(`tex/${name}_nor.jpg`)])
  useLayoutEffect(() => {
    for (const t of [map, normalMap]) {
      t.wrapS = t.wrapT = RepeatWrapping
      t.repeat.set(repeat, repeat)
      t.anisotropy = 8
    }
    map.colorSpace = SRGBColorSpace
  }, [map, normalMap, repeat])
  return { map, normalMap }
}

/** Soft scatter cushion. */
function Cushion({ color, ...rest }: { color: string; [k: string]: unknown }) {
  const fabric = useFabric('curly_teddy_natural', 1)
  return (
    <RoundedBox args={[0.46, 0.44, 0.15]} radius={0.065} smoothness={5} castShadow receiveShadow {...rest}>
      <meshPhysicalMaterial {...fabric} color={color} normalScale={new Vector2(0.6, 0.6)} {...FABRIC} />
    </RoundedBox>
  )
}

/**
 * Contemporary three-seat sofa assembled from rounded boxes (no suitable CC0 modern sofa exists
 * on Poly Haven, whose sofas are all antique styles). Boucle PBR fabric, sheen, walnut feet.
 */
function ModernSofa({ color = '#efe3cb', ...rest }: { color?: string; [k: string]: unknown }) {
  const fabric = useFabric('curly_teddy_natural', 3)
  const mat = <meshPhysicalMaterial {...fabric} color={color} normalScale={new Vector2(0.7, 0.7)} {...FABRIC} />
  return (
    <group {...rest}>
      <RoundedBox args={[2.5, 0.3, 1.0]} radius={0.06} smoothness={4} position={[0, 0.3, 0]} castShadow receiveShadow>{mat}</RoundedBox>
      {[-1.17, 1.17].map((x) => (
        <RoundedBox key={x} args={[0.2, 0.52, 1.0]} radius={0.08} smoothness={5} position={[x, 0.4, 0]} castShadow receiveShadow>{mat}</RoundedBox>
      ))}
      <RoundedBox args={[2.5, 0.52, 0.26]} radius={0.08} smoothness={5} position={[0, 0.65, -0.37]} castShadow receiveShadow>{mat}</RoundedBox>
      {[-0.72, 0, 0.72].map((x) => (
        <RoundedBox key={x} args={[0.7, 0.18, 0.74]} radius={0.075} smoothness={6} position={[x, 0.54, 0.1]} castShadow receiveShadow>{mat}</RoundedBox>
      ))}
      {[-0.72, 0, 0.72].map((x) => (
        <RoundedBox key={x} args={[0.7, 0.44, 0.2]} radius={0.085} smoothness={6} position={[x, 0.8, -0.2]} rotation-x={-0.2} castShadow receiveShadow>{mat}</RoundedBox>
      ))}
      {[-1.1, 1.1].flatMap((x) =>
        [-0.4, 0.4].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.07, z]} castShadow>
            <cylinderGeometry args={[0.032, 0.022, 0.14, 20]} />
            <meshStandardMaterial color="#4a2e1a" roughness={0.4} />
          </mesh>
        )),
      )}
    </group>
  )
}

function Vase({ ...rest }: { [k: string]: unknown }) {
  const geo = useMemo(() => {
    const pts = [
      [0.0, 0],
      [0.05, 0],
      [0.075, 0.04],
      [0.085, 0.12],
      [0.06, 0.2],
      [0.032, 0.25],
      [0.036, 0.3],
      [0.05, 0.31],
    ].map(([x, y]) => new Vector2(x, y))
    return new LatheGeometry(pts, 40)
  }, [])
  return (
    <mesh geometry={geo} castShadow receiveShadow {...rest}>
      <meshStandardMaterial color="#efe8da" roughness={0.35} />
    </mesh>
  )
}

function Books({ ...rest }: { [k: string]: unknown }) {
  return (
    <group {...rest}>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.04, 0.24]} />
        <meshStandardMaterial color="#173f2e" roughness={0.7} />
      </mesh>
      <mesh position={[0.01, 0.055, 0]} rotation-y={0.12} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.03, 0.21]} />
        <meshStandardMaterial color="#d9c9a6" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.082, 0.005]} rotation-y={-0.1} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.025, 0.18]} />
        <meshStandardMaterial color="#8a5a35" roughness={0.65} />
      </mesh>
    </group>
  )
}

function SideTable({ ...rest }: { [k: string]: unknown }) {
  return (
    <group {...rest}>
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 48]} />
        <meshStandardMaterial color="#6d4528" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 16]} />
        <meshStandardMaterial color="#c9a35c" metalness={0.9} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.01, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.02, 40]} />
        <meshStandardMaterial color="#c9a35c" metalness={0.9} roughness={0.28} />
      </mesh>
    </group>
  )
}

function ArcLamp({ ...rest }: { [k: string]: unknown }) {
  const mat = useMemo(() => new MeshStandardMaterial({ color: '#16130f', roughness: 0.4, metalness: 0.6 }), [])
  return (
    <group {...rest}>
      <mesh position={[0, 0.02, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.04, 40]} />
      </mesh>
      <mesh position={[0, 1.2, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 2.4, 12]} />
      </mesh>
      <mesh position={[0.45, 2.35, 0]} rotation-z={-Math.PI / 2.4} material={mat} castShadow>
        <torusGeometry args={[0.45, 0.012, 8, 32, Math.PI / 1.8]} />
      </mesh>
      <mesh position={[0.9, 2.15, 0]} material={mat} castShadow>
        <sphereGeometry args={[0.2, 40, 20, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
      </mesh>
      <mesh position={[0.9, 2.04, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#fff0cf" toneMapped={false} />
      </mesh>
    </group>
  )
}

function Pendant({ ...rest }: { [k: string]: unknown }) {
  return (
    <group {...rest}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 1.8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh castShadow>
        <sphereGeometry args={[0.3, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#14120f" roughness={0.45} metalness={0.5} side={2} />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation-x={Math.PI / 2}>
        <circleGeometry args={[0.285, 40]} />
        <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
      </mesh>
    </group>
  )
}

interface Props {
  /** Skip small props on weaker devices. */
  detailed: boolean
}

export function Furniture({ detailed }: Props) {
  return (
    <group>
      {/* hero sofa - back against the walnut panel */}
      <ModernSofa position={[-0.35, 0, -1.7]} />
      <Cushion color="#1f5a3d" position={[-1.12, 0.8, -1.6]} rotation={[-0.28, 0.22, 0.04]} />
      <Cushion color="#3b7a55" position={[-0.74, 0.79, -1.62]} rotation={[-0.3, -0.16, -0.05]} />
      <Cushion color="#f3ead8" position={[0.62, 0.79, -1.61]} rotation={[-0.28, 0.18, 0.05]} />

      {/* coffee table (long axis turned parallel to the sofa) */}
      <Model url={TABLE} position={[-0.35, 0, 0.35]} rotation-y={Math.PI / 2} scale={1.25} />
      <Books position={[-0.65, 0.5, 0.3]} rotation-y={0.4} />
      <Vase position={[-0.2, 0.48, 0.35]} />

      {/* accent armchair turned in toward the sofa */}
      <Model url={CHAIR} position={[2.35, 0, -0.35]} rotation-y={-0.85} scale={1.35} tint={{ pillow: '#1d5a3f' }} />

      {detailed && (
        <>
          <SideTable position={[1.35, 0, -1.75]} />
          <Vase position={[1.35, 0.54, -1.75]} scale={0.8} />
          <ArcLamp position={[-2.55, 0, -1.75]} />
          <Pendant position={[-0.35, 2.55, 0.35]} />
          <Model url={ANTHURIUM} position={[3.5, 0, -1.7]} scale={1.7} rotation-y={0.6} />
          <Model url={POTTED} position={[-3.2, 0, -0.6]} scale={3.6} rotation-y={1.1} />
        </>
      )}
    </group>
  )
}

MODEL_URLS.forEach((u) => useGLTF.preload(u))

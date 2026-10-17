import { asset } from '../assets-url'
import { Environment } from '@react-three/drei'

interface Props {
  shadowSize: number
}

/**
 * Warm key light from the window (right), soft ambient fill, a small warm pendant glow
 * and a studio HDRI that is used only for reflections / gentle fill – never as a backdrop.
 */
export function Lighting({ shadowSize }: Props) {
  return (
    <>
      <Environment files={asset('hdri/studio.hdr')} environmentIntensity={0.7} />
      <hemisphereLight args={['#fff4e2', '#8a7358', 0.7]} />
      {/* sun through the window */}
      <directionalLight
        position={[9, 3.8, 1.2]}
        intensity={3.6}
        color="#ffd9a3"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={5}
        shadow-camera-bottom={-3}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={5}
      />
      {/* cool-ish bounce from the open front of the room */}
      <directionalLight position={[-4, 3, 8]} intensity={0.45} color="#eaf0ff" />
      {/* pendant glow above the table */}
      <pointLight position={[-0.3, 2.3, 0.4]} intensity={10} distance={6} decay={2} color="#ffc98a" />
    </>
  )
}

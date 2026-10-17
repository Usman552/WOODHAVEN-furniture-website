import { Suspense, useEffect, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { CameraRig } from './CameraRig'
import { Furniture } from './Furniture'
import { Lighting } from './Lighting'
import { Room } from './Room'

interface Props {
  progress: RefObject<number>
  mobile: boolean
  reduced: boolean
  /** Pause rendering while the hero is off-screen. */
  active: boolean
  onReady: () => void
  onFail: () => void
}

function Ready({ onReady }: { onReady: () => void }) {
  // mounted only once every Suspense child (models + textures) has resolved
  useEffect(() => {
    // two frames so the first lit frame is on screen before we fade the canvas in
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady))
    return () => cancelAnimationFrame(id)
  }, [onReady])
  return null
}

export default function HeroScene({ progress, mobile, reduced, active, onReady, onFail }: Props) {
  return (
    <Canvas
      className="hero-canvas"
      shadows="percentage"
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 40, near: 0.1, far: 60, position: [3.0, 1.9, 6.8] }}
      gl={{ antialias: !mobile, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.25 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onFail()
        })
      }}
    >
      <Suspense fallback={null}>
        <Lighting shadowSize={mobile ? 1024 : 2048} />
        <Room />
        <Furniture detailed={!mobile} />
        {!mobile && <ContactShadows position={[0, 0.012, -0.2]} scale={9} blur={2.4} opacity={0.4} far={2.5} resolution={512} frames={1} />}
        <CameraRig progress={progress} mobile={mobile} reduced={reduced} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}

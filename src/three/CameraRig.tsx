import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { buildRig, sampleRig, SHOTS_DESKTOP, SHOTS_MOBILE } from './shots'

interface Props {
  /** 0–1 scroll progress through the hero, written by ScrollTrigger. */
  progress: RefObject<number>
  mobile: boolean
  reduced: boolean
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Drives the camera along the choreographed rig.
 *  - scroll progress is damped so the dolly never feels jittery
 *  - a 2.8 s intro dolly plays on load (the "establishing shot" breathes before the user scrolls)
 *  - a tiny pointer parallax is added on desktop
 *  - setViewOffset shifts the composition so the furniture sits right of the left-aligned headline
 */
export function CameraRig({ progress, mobile, reduced }: Props) {
  const { camera, size, pointer } = useThree()
  const rig = useMemo(() => buildRig(mobile ? SHOTS_MOBILE : SHOTS_DESKTOP), [mobile])
  const smooth = useRef(progress.current ?? 0)
  const intro = useRef(reduced ? 1 : 0)
  const pos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])
  const sway = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cam = camera as PerspectiveCamera
    const portrait = size.width < size.height
    const ox = mobile || portrait ? 0 : -size.width * 0.17
    const oy = mobile || portrait ? -size.height * 0.1 : 0
    cam.setViewOffset(size.width, size.height, ox, oy, size.width, size.height)
    return () => cam.clearViewOffset()
  }, [camera, size.width, size.height, mobile])

  useFrame((_, dt) => {
    const cam = camera as PerspectiveCamera
    const target = progress.current ?? 0
    smooth.current = MathUtils.damp(smooth.current, target, 5, dt)
    intro.current = Math.min(1, intro.current + dt / 2.8)
    const k = 1 - easeOutCubic(intro.current)

    const fov = sampleRig(rig, smooth.current, pos, look)

    // intro: start slightly further back & higher, glide into position
    pos.z += k * 1.6
    pos.y += k * 0.35
    pos.x += k * 0.6

    if (!reduced && !mobile) {
      sway.current.x = MathUtils.damp(sway.current.x, pointer.x * 0.12, 3, dt)
      sway.current.y = MathUtils.damp(sway.current.y, pointer.y * 0.05, 3, dt)
      pos.x += sway.current.x
      pos.y += sway.current.y
    }

    cam.position.copy(pos)
    cam.lookAt(look)
    const aspect = size.width / size.height
    // keep the sofa fully in frame on narrow viewports
    const fit = aspect < 1 ? 1 + (1 - aspect) * 0.55 : 1
    const f = fov * fit
    if (Math.abs(cam.fov - f) > 0.01) {
      cam.fov = f
      cam.updateProjectionMatrix()
    }
  })

  return null
}

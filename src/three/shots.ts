import { CatmullRomCurve3, MathUtils, Vector3 } from 'three'

/**
 * Camera choreography. Each shot is a keyframe at a normalised scroll progress (0–1)
 * through the hero. Positions/targets are interpolated with Catmull-Rom splines so the
 * move is one continuous dolly rather than four straight segments.
 *
 *   0.00  Establishing – wide view of the whole room
 *   0.22  Reveal       – drifting toward sofa + coffee table
 *   0.50  Detail       – closer on fabric, cushions and walnut table
 *   0.75  (swing)      – gentle arc across the seating group
 *   1.00  Final        – balanced composition of sofa, table, chair and decor
 */
export interface Shot {
  t: number
  pos: [number, number, number]
  look: [number, number, number]
  fov: number
}

export const SHOTS_DESKTOP: Shot[] = [
  { t: 0.0, pos: [3.0, 1.9, 6.8], look: [-0.1, 0.95, -0.7], fov: 40 },
  { t: 0.22, pos: [2.5, 1.7, 6.5], look: [-0.2, 0.85, -0.6], fov: 38 },
  { t: 0.5, pos: [1.3, 1.35, 5.0], look: [-0.3, 0.6, -0.5], fov: 36 },
  { t: 0.75, pos: [0.2, 1.15, 4.6], look: [-0.2, 0.55, -0.5], fov: 35 },
  { t: 1.0, pos: [1.4, 1.55, 6.6], look: [0.35, 0.7, -0.6], fov: 38 },
]

/** Portrait screens: pulled further back so the 2.7 m sofa still fits, shorter path. */
export const SHOTS_MOBILE: Shot[] = [
  { t: 0.0, pos: [3.2, 2.3, 11.5], look: [0.2, 0.9, -0.7], fov: 42 },
  { t: 0.35, pos: [2.2, 1.8, 9.2], look: [0.0, 0.8, -0.6], fov: 40 },
  { t: 0.7, pos: [1.0, 1.5, 7.4], look: [-0.1, 0.7, -0.5], fov: 38 },
  { t: 1.0, pos: [1.2, 1.55, 8.2], look: [0.1, 0.75, -0.5], fov: 38 },
]

export interface Rig {
  pos: CatmullRomCurve3
  look: CatmullRomCurve3
  ts: number[]
  fovs: number[]
}

export function buildRig(shots: Shot[]): Rig {
  return {
    pos: new CatmullRomCurve3(shots.map((s) => new Vector3(...s.pos)), false, 'centripetal'),
    look: new CatmullRomCurve3(shots.map((s) => new Vector3(...s.look)), false, 'centripetal'),
    ts: shots.map((s) => s.t),
    fovs: shots.map((s) => s.fov),
  }
}

/** Map progress → curve parameter honouring the (non-uniform) keyframe times. */
function curveU(ts: number[], p: number) {
  const n = ts.length - 1
  if (p <= ts[0]) return 0
  if (p >= ts[n]) return 1
  let i = 0
  while (i < n - 1 && p > ts[i + 1]) i++
  const local = (p - ts[i]) / (ts[i + 1] - ts[i])
  return (i + local) / n
}

export function sampleRig(rig: Rig, p: number, outPos: Vector3, outLook: Vector3) {
  const u = curveU(rig.ts, MathUtils.clamp(p, 0, 1))
  rig.pos.getPoint(u, outPos)
  rig.look.getPoint(u, outLook)
  // fov: piecewise lerp
  const n = rig.ts.length - 1
  let i = 0
  while (i < n - 1 && p > rig.ts[i + 1]) i++
  const local = MathUtils.clamp((p - rig.ts[i]) / (rig.ts[i + 1] - rig.ts[i]), 0, 1)
  return MathUtils.lerp(rig.fovs[i], rig.fovs[i + 1], MathUtils.smoothstep(local, 0, 1))
}

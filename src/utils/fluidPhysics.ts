import { LiquidLayer } from '../types/hydration';

export interface SplashDroplet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  color: string;
}

export interface MicroBubble {
  id: number;
  x: number;
  y: number;
  speed: number;
  r: number;
  wobblePhase: number;
  wobbleAmp: number;
  alpha: number;
}

export interface FluidPhysicsState {
  levelPercent: number;
  tilt: number; // px offset at right edge (+tilt => right side lower, left side higher)
  tiltVelocity: number;
  targetTilt: number;
  waveAmplitude: number;
  waveVelocity: number;
  phaseFront: number;
  phaseBack: number;
  causticPulse: number;
  splashes: SplashDroplet[];
  bubbles: MicroBubble[];
  nextId: number;
}

export const BASE_WAVE_AMPLITUDE = 3.1;
export const MAX_TILT_PX = 24;
export const MAX_WAVE_AMPLITUDE = 13.5;
export const OVERFLOW_THRESHOLD_PERCENT = 150;

/**
 * Deterministic initial micro-bubble layout inside a flask chamber.
 */
export function createInitialBubbles(
  fillTopY: number,
  fillBottomY: number,
  count = 11
): MicroBubble[] {
  const height = Math.max(40, fillBottomY - fillTopY);
  const bubbles: MicroBubble[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    bubbles.push({
      id: i + 1,
      x: 68 + ((i * 29) % 106),
      y: fillBottomY - 6 - t * (height * 0.72),
      speed: 14 + (i % 5) * 5.2,
      r: 1.4 + (i % 4) * 0.95,
      wobblePhase: i * 1.17,
      wobbleAmp: 2.2 + (i % 3) * 1.35,
      alpha: 0.34 + (i % 4) * 0.12,
    });
  }
  return bubbles;
}

export function createFluidPhysicsState(
  initialPercent: number,
  fillTopY: number,
  fillBottomY: number
): FluidPhysicsState {
  const clamped = Math.max(0, Math.min(100, initialPercent));
  return {
    levelPercent: clamped,
    tilt: 0,
    tiltVelocity: 0,
    targetTilt: 0,
    waveAmplitude: BASE_WAVE_AMPLITUDE,
    waveVelocity: 0,
    phaseFront: 0,
    phaseBack: 1.9,
    causticPulse: 0,
    splashes: [],
    bubbles: createInitialBubbles(fillTopY, fillBottomY, 11),
    nextId: 100,
  };
}

/**
 * Maps DeviceOrientationEvent gamma (-45deg..45deg) to liquid tilt in SVG px.
 */
export function gammaToTargetTilt(gammaDeg: number): number {
  if (!Number.isFinite(gammaDeg)) return 0;
  const clampedDeg = Math.max(-45, Math.min(45, gammaDeg));
  return (clampedDeg / 45) * MAX_TILT_PX;
}

/**
 * Computes exact liquid surface Y coordinate at horizontal position x (0..240).
 */
export function getSurfaceYAtX(
  x: number,
  baseSurfaceY: number,
  tilt: number,
  phase: number,
  amplitude: number,
  frequency = 0.044
): number {
  const normalizedX = (x - 120) / 120;
  const tiltOffset = normalizedX * tilt;
  const primary = Math.sin(x * frequency + phase) * amplitude;
  const harmonic = Math.sin(x * frequency * 1.92 - phase * 0.78) * (amplitude * 0.28);
  return baseSurfaceY + tiltOffset + primary + harmonic;
}

/**
 * Triggers a juicy impact splash & slosh when a drink is added or tapped hard.
 */
export function applySplashImpulse(
  state: FluidPhysicsState,
  options: {
    strength?: number;
    direction?: number;
    color: string;
    surfaceY: number;
    dropletCount?: number;
  }
): FluidPhysicsState {
  const strength = Math.max(0.25, Math.min(2.2, options.strength ?? 1));
  const dir = options.direction ?? (state.nextId % 2 === 0 ? 1 : -1);
  const dropletCount = options.dropletCount ?? Math.round(5 + strength * 3);

  const nextSplashes = [...state.splashes];
  let nextId = state.nextId;

  for (let i = 0; i < dropletCount; i++) {
    const spread = dropletCount > 1 ? i / (dropletCount - 1) - 0.5 : 0;
    const x = 120 + spread * 78 + Math.sin(nextId * 2.3) * 8;
    const vx = spread * 72 * strength + dir * 22 + Math.cos(nextId * 1.7) * 14;
    const vy = -(58 + ((i * 19) % 44)) * strength;
    nextSplashes.push({
      id: nextId++,
      x,
      y: options.surfaceY - 2,
      vx,
      vy,
      r: 2.0 + (i % 3) * 1.15,
      alpha: 0.92,
      color: options.color,
    });
  }

  return {
    ...state,
    tiltVelocity: Math.max(-140, Math.min(140, state.tiltVelocity + dir * 48 * strength)),
    waveVelocity: Math.min(95, state.waveVelocity + 34 * strength),
    waveAmplitude: Math.min(MAX_WAVE_AMPLITUDE, state.waveAmplitude + 3.2 * strength),
    splashes: nextSplashes.slice(-18),
    nextId,
  };
}

/**
 * Applies interactive slosh impulse when user taps or drags across the vessel.
 */
export function applyTouchSlosh(
  state: FluidPhysicsState,
  options: {
    normalizedX: number; // -1 (left) to +1 (right)
    velocityX: number; // px/frame or pointer deltaX
    color: string;
    surfaceY: number;
    spawnDroplets?: boolean;
  }
): FluidPhysicsState {
  const clampedNorm = Math.max(-1, Math.min(1, options.normalizedX));
  const clampedVel = Math.max(-40, Math.min(40, options.velocityX));
  const impulse = clampedVel * 3.1 + clampedNorm * 28;
  const energy = Math.min(1.6, Math.abs(impulse) / 55 + 0.35);

  let next: FluidPhysicsState = {
    ...state,
    tiltVelocity: Math.max(-150, Math.min(150, state.tiltVelocity + impulse)),
    waveVelocity: Math.min(90, state.waveVelocity + 18 * energy),
    waveAmplitude: Math.min(MAX_WAVE_AMPLITUDE, state.waveAmplitude + 1.8 * energy),
  };

  if (options.spawnDroplets) {
    next = applySplashImpulse(next, {
      strength: Math.min(1.1, energy * 0.72),
      direction: impulse >= 0 ? 1 : -1,
      color: options.color,
      surfaceY: options.surfaceY,
      dropletCount: 4,
    });
  }

  return next;
}

/**
 * Advances the damped-spring slosh, dual-layer wave phases, splash droplets,
 * and rising micro-bubbles by dt seconds.
 */
export function stepFluidPhysics(
  state: FluidPhysicsState,
  dtSeconds: number,
  params: {
    targetPercent: number;
    fillTopY: number;
    fillBottomY: number;
    isOverflowing?: boolean;
  }
): FluidPhysicsState {
  const dt = Math.max(0.004, Math.min(0.05, dtSeconds));
  const targetPercent = Math.max(0, Math.min(100, params.targetPercent));

  // Smooth level interpolation with gentle ease
  const levelDiff = targetPercent - state.levelPercent;
  const levelPercent =
    Math.abs(levelDiff) < 0.05
      ? targetPercent
      : state.levelPercent + levelDiff * Math.min(1, dt * 6.5);

  // Damped spring for liquid tilt (slosh)
  const tiltStiffness = 28;
  const tiltDamping = 4.2;
  const tiltAccel =
    (state.targetTilt - state.tilt) * tiltStiffness - state.tiltVelocity * tiltDamping;
  const tiltVelocity = state.tiltVelocity + tiltAccel * dt;
  const tilt = Math.max(-MAX_TILT_PX, Math.min(MAX_TILT_PX, state.tilt + tiltVelocity * dt));

  // Damped spring for wave amplitude around BASE_WAVE_AMPLITUDE
  const baseAmp = params.isOverflowing ? BASE_WAVE_AMPLITUDE + 1.2 : BASE_WAVE_AMPLITUDE;
  const ampStiffness = 22;
  const ampDamping = 3.8;
  const ampAccel = (baseAmp - state.waveAmplitude) * ampStiffness - state.waveVelocity * ampDamping;
  const waveVelocity = state.waveVelocity + ampAccel * dt;
  const waveAmplitude = Math.max(
    1.4,
    Math.min(MAX_WAVE_AMPLITUDE, state.waveAmplitude + waveVelocity * dt)
  );

  // Parallax wave phase progression (front faster, back slower & opposite feel)
  const speedBoost = 1 + Math.abs(tiltVelocity) * 0.008;
  const phaseFront = (state.phaseFront + dt * 3.15 * speedBoost) % (Math.PI * 200);
  const phaseBack = (state.phaseBack - dt * 1.95 * speedBoost + Math.PI * 200) % (Math.PI * 200);

  // Compute current surface Y
  const fillableHeight = Math.max(1, params.fillBottomY - params.fillTopY);
  const surfaceY = params.fillBottomY - (levelPercent / 100) * fillableHeight;

  // Update splash droplets under gravity
  const gravity = 240;
  const splashes: SplashDroplet[] = [];
  for (const drop of state.splashes) {
    const ny = drop.y + drop.vy * dt;
    const nvy = drop.vy + gravity * dt;
    const nx = drop.x + drop.vx * dt;
    const nAlpha = drop.alpha - dt * 1.18;
    const localSurface = getSurfaceYAtX(nx, surfaceY, tilt, phaseFront, waveAmplitude);
    if (nAlpha > 0.05 && (nvy < 0 || ny < localSurface + 4)) {
      splashes.push({
        ...drop,
        x: nx,
        y: ny,
        vy: nvy,
        alpha: nAlpha,
      });
    }
  }

  // Update rising micro-bubbles continuously from bottom until popping at surface
  let nextId = state.nextId;
  const bubbles: MicroBubble[] = state.bubbles.map((b, idx) => {
    const ny = b.y - b.speed * dt;
    const nPhase = b.wobblePhase + dt * 3.2;
    const localSurface = getSurfaceYAtX(b.x, surfaceY, tilt, phaseFront, waveAmplitude);

    if (levelPercent <= 2) {
      return { ...b, y: params.fillBottomY - 6, wobblePhase: nPhase };
    }

    // Pop at surface and respawn near bottom of the vessel
    if (ny <= localSurface + 2) {
      const seed = nextId++;
      return {
        ...b,
        x: 64 + ((seed * 37 + idx * 19) % 112),
        y: params.fillBottomY - 4 - (seed % 14),
        speed: 14 + (seed % 6) * 4.4,
        r: 1.3 + (seed % 4) * 0.9,
        wobblePhase: nPhase,
        alpha: 0.34 + (seed % 4) * 0.13,
      };
    }

    return {
      ...b,
      y: ny,
      wobblePhase: nPhase,
    };
  });

  const causticPulse = Math.min(1, Math.abs(tilt) / MAX_TILT_PX + (waveAmplitude - baseAmp) / 10);

  return {
    levelPercent,
    tilt,
    tiltVelocity,
    targetTilt: state.targetTilt,
    waveAmplitude,
    waveVelocity,
    phaseFront,
    phaseBack,
    causticPulse,
    splashes,
    bubbles,
    nextId,
  };
}

/**
 * Generates an organic closed SVG path for the liquid top surface wave (front or back).
 */
export function buildSurfaceWavePath(options: {
  baseSurfaceY: number;
  bottomY: number;
  tilt: number;
  phase: number;
  amplitude: number;
  frequency?: number;
  width?: number;
  step?: number;
}): string {
  const width = options.width ?? 240;
  const step = options.step ?? 12;
  const freq = options.frequency ?? 0.044;

  const points: string[] = [];
  for (let x = 0; x <= width; x += step) {
    const y = getSurfaceYAtX(x, options.baseSurfaceY, options.tilt, options.phase, options.amplitude, freq);
    points.push(`${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  points.push(`L ${width} ${(options.bottomY + 18).toFixed(1)}`);
  points.push(`L 0 ${(options.bottomY + 18).toFixed(1)} Z`);
  return points.join(' ');
}

/**
 * Generates an open SVG stroke path tracing the crisp illuminated crest of the front wave.
 */
export function buildCrestHighlightPath(options: {
  baseSurfaceY: number;
  tilt: number;
  phase: number;
  amplitude: number;
  frequency?: number;
  width?: number;
  step?: number;
}): string {
  const width = options.width ?? 240;
  const step = options.step ?? 12;
  const freq = options.frequency ?? 0.044;

  const points: string[] = [];
  for (let x = 0; x <= width; x += step) {
    const y = getSurfaceYAtX(x, options.baseSurfaceY, options.tilt, options.phase, options.amplitude, freq);
    points.push(`${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  return points.join(' ');
}

/**
 * Generates an organic wavy polygon path for a single beverage layer band so
 * transitions between Água, Café, Suco etc. ripple fluidly instead of straight lines.
 */
export function buildOrganicLayerBandPath(options: {
  topY: number;
  bottomY: number;
  isBottomLayer: boolean;
  isTopLayer: boolean;
  layerIndex: number;
  tilt: number;
  phaseFront: number;
  amplitude: number;
  width?: number;
  step?: number;
}): string {
  const width = options.width ?? 240;
  const step = options.step ?? 12;

  // Top edge wave (topmost layer uses full surface wave; inner seams have softer density ripples)
  const topAmp = options.isTopLayer ? options.amplitude : Math.min(5.4, options.amplitude * 0.62);
  const topTilt = options.isTopLayer ? options.tilt : options.tilt * 0.85;
  const topPhase = options.isTopLayer ? options.phaseFront : options.phaseFront - (options.layerIndex + 1) * 0.85;

  const bottomAmp = options.isBottomLayer ? 0 : Math.min(4.8, options.amplitude * 0.56);
  const bottomTilt = options.isBottomLayer ? 0 : options.tilt * 0.78;
  const bottomPhase = options.phaseFront - options.layerIndex * 0.85;

  const cmds: string[] = [];

  // Trace left -> right along the top wavy boundary
  for (let x = 0; x <= width; x += step) {
    const y = getSurfaceYAtX(x, options.topY, topTilt, topPhase, topAmp, 0.044);
    cmds.push(`${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(2)}`);
  }

  // Trace right -> left along the bottom boundary (overlap +2.2px to avoid subpixel gaps)
  if (options.isBottomLayer) {
    cmds.push(`L ${width} ${(options.bottomY + 16).toFixed(1)}`);
    cmds.push(`L 0 ${(options.bottomY + 16).toFixed(1)} Z`);
  } else {
    for (let x = width; x >= 0; x -= step) {
      const y =
        getSurfaceYAtX(x, options.bottomY, bottomTilt, bottomPhase, bottomAmp, 0.044) + 2.4;
      cmds.push(`L ${x.toFixed(1)} ${y.toFixed(2)}`);
    }
    cmds.push('Z');
  }

  return cmds.join(' ');
}

/**
 * Scales stacked LiquidLayer coordinates proportionally to the currently animated
 * smoothed levelPercent so all layers rise smoothly together without popping.
 */
export function scaleLayersForAnimatedLevel(
  layers: LiquidLayer[],
  targetClampedPercent: number,
  animatedPercent: number
): Array<LiquidLayer & { scaledStart: number; scaledHeight: number }> {
  if (layers.length === 0 || animatedPercent <= 0) return [];
  const ratio = targetClampedPercent > 0 ? animatedPercent / targetClampedPercent : 1;
  return layers.map((layer) => ({
    ...layer,
    scaledStart: layer.startPercent * ratio,
    scaledHeight: layer.heightPercent * ratio,
  }));
}

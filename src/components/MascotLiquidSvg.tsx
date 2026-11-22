import React, { useEffect, useId, useRef, useState } from 'react';
import { GLASS_MATERIAL_MAP } from '../data/alchemy';
import {
  CharacterPartAnimation,
  GlassMaterialId,
  LiquidEffectId,
  LiquidLayer,
  MascotAnimatedPart,
  MascotDefinition,
} from '../types/hydration';
import {
  applySplashImpulse,
  applyTouchSlosh,
  BASE_WAVE_AMPLITUDE,
  buildCrestHighlightPath,
  buildOrganicLayerBandPath,
  buildSurfaceWavePath,
  createFluidPhysicsState,
  FluidPhysicsState,
  getSurfaceYAtX,
  OVERFLOW_THRESHOLD_PERCENT,
  scaleLayersForAnimatedLevel,
  stepFluidPhysics,
} from '../utils/fluidPhysics';

interface MascotLiquidSvgProps {
  mascot: MascotDefinition;
  layers: LiquidLayer[];
  clampedPercent: number;
  rawPercent?: number;
  glassMaterialId?: GlassMaterialId;
  liquidEffectId?: LiquidEffectId;
  bubbleBurstKey?: number;
  squishKey?: number;
  gyroTiltPx?: number;
  onInteractiveTap?: () => void;
  size?: 'hero' | 'card' | 'modal';
  locked?: boolean;
  className?: string;
}

const GOLD_BUBBLES = [
  { cx: 88, r: 3.4, delay: '0s', offset: 18 },
  { cx: 108, r: 4.1, delay: '0.9s', offset: 34 },
  { cx: 132, r: 3.0, delay: '1.7s', offset: 22 },
  { cx: 148, r: 3.8, delay: '2.4s', offset: 40 },
  { cx: 120, r: 2.8, delay: '0.45s', offset: 52 },
];

const STAR_DUST = [
  { x: 90, yRatio: 0.24, size: 4.0, delay: '0s' },
  { x: 118, yRatio: 0.48, size: 5.0, delay: '0.6s' },
  { x: 142, yRatio: 0.3, size: 3.6, delay: '1.2s' },
  { x: 102, yRatio: 0.72, size: 4.4, delay: '1.7s' },
  { x: 136, yRatio: 0.66, size: 3.5, delay: '0.9s' },
  { x: 122, yRatio: 0.16, size: 3.2, delay: '2.0s' },
];

const PART_ANIM_CLASS: Record<CharacterPartAnimation, string> = {
  'wing-left': 'animate-wing-left',
  'wing-right': 'animate-wing-right',
  'tail-wag': 'animate-tail-wag',
  'flame-dance': 'animate-flame-dance',
  'tongue-wiggle': 'animate-tongue-wiggle',
  'ear-twitch': 'animate-ear-twitch',
  'halo-float': 'animate-halo-float',
};

export const MascotLiquidSvg: React.FC<MascotLiquidSvgProps> = ({
  mascot,
  layers,
  clampedPercent,
  rawPercent,
  glassMaterialId = 'cristal',
  liquidEffectId = 'nenhum',
  bubbleBurstKey = 0,
  squishKey = 0,
  gyroTiltPx = 0,
  onInteractiveTap,
  size = 'hero',
  locked = false,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const outerClipId = `oclip-${mascot.id}-${uid}`;
  const innerClipId = `iclip-${mascot.id}-${uid}`;
  const rimGradId = `rim-${mascot.id}-${uid}`;
  const glassBodyGradId = `glass-${mascot.id}-${uid}`;
  const thickWallGradId = `wall-${mascot.id}-${uid}`;
  const cylShadeId = `cyl-${mascot.id}-${uid}`;
  const topHighlightId = `topgl-${mascot.id}-${uid}`;
  const mistGradId = `mist-${mascot.id}-${uid}`;
  const goldGradId = `gold-${mascot.id}-${uid}`;
  const bronzeGradId = `bronze-${mascot.id}-${uid}`;
  const corkGradId = `cork-${mascot.id}-${uid}`;
  const crystalGradId = `crys-${mascot.id}-${uid}`;
  const causticGradId = `caust-${mascot.id}-${uid}`;
  const softBlurId = `sblur-${mascot.id}-${uid}`;

  const material = GLASS_MATERIAL_MAP[glassMaterialId] || GLASS_MATERIAL_MAP.cristal;
  const isHero = size === 'hero';
  const effectiveRawPercent = rawPercent ?? clampedPercent;
  const isOverflowing = !locked && effectiveRawPercent > OVERFLOW_THRESHOLD_PERCENT;

  const innerCx = mascot.innerCenter?.x ?? 120;
  const innerCy = mascot.innerCenter?.y ?? (mascot.fillTopY + mascot.fillBottomY) / 2;
  const innerScaleX = mascot.innerCenter?.scaleX ?? 0.915;
  const innerScaleY = mascot.innerCenter?.scaleY ?? 0.94;
  const innerTransform = `translate(${innerCx} ${innerCy}) scale(${innerScaleX} ${innerScaleY}) translate(${-innerCx} ${-innerCy})`;

  // Inner chamber vertical bounds inside the blown-glass character
  const chamberTopY = innerCy + (mascot.fillTopY - innerCy) * innerScaleY + 1;
  const chamberBottomY = innerCy + (mascot.fillBottomY - innerCy) * innerScaleY - 1;
  const fillableHeight = Math.max(20, chamberBottomY - chamberTopY);

  const topLayer = layers[layers.length - 1];
  const bottomLayer = layers[0];
  const primaryLiquidColor = topLayer?.color || mascot.accentColor;
  const bottomLiquidColor = bottomLayer?.color || primaryLiquidColor;

  // ---------------------------------------------------------------------------
  // 60fps Living Fluid Physics Loop (active for Hero when unlocked)
  // ---------------------------------------------------------------------------
  const physicsRef = useRef<FluidPhysicsState>(
    createFluidPhysicsState(clampedPercent, chamberTopY, chamberBottomY)
  );
  const [physics, setPhysics] = useState<FluidPhysicsState>(() => physicsRef.current);

  const targetPercentRef = useRef(clampedPercent);
  targetPercentRef.current = clampedPercent;

  const isOverflowingRef = useRef(isOverflowing);
  isOverflowingRef.current = isOverflowing;

  const boundsRef = useRef({ topY: chamberTopY, bottomY: chamberBottomY });
  boundsRef.current = { topY: chamberTopY, bottomY: chamberBottomY };

  const prevBurstRef = useRef(bubbleBurstKey);
  const prevTargetRef = useRef(clampedPercent);
  const pointerStateRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    lastX: number;
    moved: boolean;
  }>({ active: false, startX: 0, startY: 0, lastX: 0, moved: false });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isHero || locked) return;
    physicsRef.current = {
      ...physicsRef.current,
      targetTilt: gyroTiltPx,
    };
  }, [gyroTiltPx, isHero, locked]);

  useEffect(() => {
    physicsRef.current = createFluidPhysicsState(clampedPercent, chamberTopY, chamberBottomY);
    setPhysics(physicsRef.current);
    prevTargetRef.current = clampedPercent;
  }, [mascot.id]);

  useEffect(() => {
    if (!isHero || locked) return;
    const burstChanged = bubbleBurstKey !== prevBurstRef.current && bubbleBurstKey > 0;
    const jumpedUp = clampedPercent > prevTargetRef.current + 1.5;

    if (burstChanged || jumpedUp) {
      const currentSurfaceY =
        boundsRef.current.bottomY -
        (physicsRef.current.levelPercent / 100) *
          (boundsRef.current.bottomY - boundsRef.current.topY);
      physicsRef.current = applySplashImpulse(physicsRef.current, {
        strength: burstChanged ? 1.35 : 0.95,
        color: topLayer?.waveHighlight || primaryLiquidColor,
        surfaceY: Math.max(boundsRef.current.topY + 12, currentSurfaceY),
        dropletCount: burstChanged ? 8 : 5,
      });
    }
    prevBurstRef.current = bubbleBurstKey;
    prevTargetRef.current = clampedPercent;
  }, [bubbleBurstKey, clampedPercent, isHero, locked, primaryLiquidColor, topLayer?.waveHighlight]);

  useEffect(() => {
    if (!isHero || locked) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      physicsRef.current = {
        ...physicsRef.current,
        levelPercent: clampedPercent,
        tilt: gyroTiltPx,
        waveAmplitude: 2.2,
      };
      setPhysics(physicsRef.current);
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.004, (now - lastTime) / 1000));
      lastTime = now;

      physicsRef.current = stepFluidPhysics(physicsRef.current, dt, {
        targetPercent: targetPercentRef.current,
        fillTopY: boundsRef.current.topY,
        fillBottomY: boundsRef.current.bottomY,
        isOverflowing: isOverflowingRef.current,
      });
      setPhysics(physicsRef.current);
      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  }, [isHero, locked, mascot.id]);

  // Interactive pointer slosh & tap handler on Hero character
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isHero || locked) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointerStateRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      moved: false,
    };

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && rect.width > 0) {
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const surfaceY =
        chamberBottomY - (physicsRef.current.levelPercent / 100) * fillableHeight;
      physicsRef.current = applyTouchSlosh(physicsRef.current, {
        normalizedX: normX,
        velocityX: normX * 10,
        color: topLayer?.waveHighlight || primaryLiquidColor,
        surfaceY: Math.max(chamberTopY + 12, surfaceY),
        spawnDroplets: false,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isHero || locked || !pointerStateRef.current.active) return;
    const dx = e.clientX - pointerStateRef.current.lastX;
    const totalMove = Math.hypot(
      e.clientX - pointerStateRef.current.startX,
      e.clientY - pointerStateRef.current.startY
    );
    if (totalMove > 9) {
      pointerStateRef.current.moved = true;
    }
    pointerStateRef.current.lastX = e.clientX;

    if (Math.abs(dx) > 0.5) {
      const rect = containerRef.current?.getBoundingClientRect();
      const normX =
        rect && rect.width > 0 ? ((e.clientX - rect.left) / rect.width) * 2 - 1 : 0;
      const surfaceY =
        chamberBottomY - (physicsRef.current.levelPercent / 100) * fillableHeight;
      physicsRef.current = applyTouchSlosh(physicsRef.current, {
        normalizedX: normX,
        velocityX: dx * 1.4,
        color: topLayer?.waveHighlight || primaryLiquidColor,
        surfaceY: Math.max(chamberTopY + 12, surfaceY),
        spawnDroplets: Math.abs(dx) > 10,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isHero || locked) return;
    const wasTap = pointerStateRef.current.active && !pointerStateRef.current.moved;
    pointerStateRef.current.active = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    if (wasTap) {
      const rect = containerRef.current?.getBoundingClientRect();
      const normX =
        rect && rect.width > 0 ? ((e.clientX - rect.left) / rect.width) * 2 - 1 : 0;
      const surfaceY =
        chamberBottomY - (physicsRef.current.levelPercent / 100) * fillableHeight;
      physicsRef.current = applySplashImpulse(physicsRef.current, {
        strength: 0.85,
        direction: normX >= 0 ? 1 : -1,
        color: topLayer?.waveHighlight || primaryLiquidColor,
        surfaceY: Math.max(chamberTopY + 12, surfaceY),
        dropletCount: 5,
      });
      onInteractiveTap?.();
    }
  };

  // Active render values
  const activeLevelPercent = isHero ? physics.levelPercent : clampedPercent;
  const activeTilt = isHero ? physics.tilt : 0;
  const activeAmp = isHero ? physics.waveAmplitude : BASE_WAVE_AMPLITUDE * 0.88;
  const activePhaseFront = isHero ? physics.phaseFront : 0.8;
  const activePhaseBack = isHero ? physics.phaseBack : 2.6;
  const activeCausticPulse = isHero ? physics.causticPulse : 0.15;

  const topSurfaceY = chamberBottomY - (activeLevelPercent / 100) * fillableHeight;
  const showLiquid = !locked && activeLevelPercent > 0.5 && layers.length > 0;
  const filledPixelHeight = Math.max(0, chamberBottomY - topSurfaceY);

  const animatedLayers = isHero
    ? scaleLayersForAnimatedLevel(layers, clampedPercent, activeLevelPercent)
    : layers.map((l) => ({ ...l, scaledStart: l.startPercent, scaledHeight: l.heightPercent }));

  const showSurfaceWaves = showLiquid && activeLevelPercent < 98.5;
  const backWavePath = showSurfaceWaves
    ? buildSurfaceWavePath({
        baseSurfaceY: topSurfaceY - 2.4,
        bottomY: chamberBottomY,
        tilt: activeTilt * 0.72,
        phase: activePhaseBack,
        amplitude: activeAmp * 0.82,
        frequency: 0.039,
      })
    : '';

  const crestHighlightPath = showSurfaceWaves
    ? buildCrestHighlightPath({
        baseSurfaceY: topSurfaceY,
        tilt: activeTilt,
        phase: activePhaseFront,
        amplitude: activeAmp,
      })
    : '';

  const dimensionClass =
    size === 'hero'
      ? 'w-[218px] h-[250px] sm:w-[232px] sm:h-[266px]'
      : size === 'modal'
        ? 'w-32 h-36'
        : 'w-[92px] h-[106px]';

  const metalGradUrl = (metal: 'gold' | 'bronze' | 'cork' | 'crystal') => {
    if (metal === 'gold') return `url(#${goldGradId})`;
    if (metal === 'bronze') return `url(#${bronzeGradId})`;
    if (metal === 'cork') return `url(#${corkGradId})`;
    return `url(#${crystalGradId})`;
  };

  const renderAnimatedPart = (part: MascotAnimatedPart, idx: number) => {
    const resolvedFill =
      part.fill === 'gold'
        ? `url(#${goldGradId})`
        : part.fill === 'crystal'
          ? `url(#${crystalGradId})`
          : part.fill ?? 'none';
    const resolvedStroke = part.metal
      ? metalGradUrl(part.metal)
      : part.stroke ?? 'none';

    return (
      <g
        key={`${part.animation}-${idx}`}
        className={PART_ANIM_CLASS[part.animation]}
        style={{ transformOrigin: `${part.pivotX}px ${part.pivotY}px` }}
      >
        <path
          d={part.d}
          fill={resolvedFill}
          stroke={resolvedStroke}
          strokeWidth={part.strokeWidth ?? (part.fill ? 1.1 : 2.5)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={part.opacity ?? 0.94}
        />
      </g>
    );
  };

  const backAnimatedParts = (mascot.animatedParts ?? []).filter((p) => p.layer === 'back');
  const frontAnimatedParts = (mascot.animatedParts ?? []).filter((p) => p.layer !== 'back');

  // Grounded characters breathe firmly planted on their feet; floating spirits levitate
  const idleMotionClass = locked
    ? ''
    : mascot.floating
      ? 'animate-mascot-float'
      : 'animate-char-breathe';

  return (
    <div
      ref={containerRef}
      onPointerDown={isHero ? handlePointerDown : undefined}
      onPointerMove={isHero ? handlePointerMove : undefined}
      onPointerUp={isHero ? handlePointerUp : undefined}
      onPointerCancel={() => {
        pointerStateRef.current.active = false;
      }}
      onKeyDown={
        isHero && onInteractiveTap
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onInteractiveTap();
              }
            }
          : undefined
      }
      role={isHero && onInteractiveTap ? 'button' : undefined}
      tabIndex={isHero && onInteractiveTap ? 0 : undefined}
      aria-label={
        isHero && onInteractiveTap
          ? `Interagir com ${mascot.name}. Toque ou arraste para balançar o líquido e ouvir novo comentário`
          : undefined
      }
      className={`relative flex items-center justify-center select-none ${
        isHero && !locked
          ? 'cursor-grab touch-none active:cursor-grabbing focus-visible:rounded-3xl focus-visible:outline-2 focus-visible:outline-[#D4AF37]'
          : ''
      } ${className}`}
      data-testid={isHero ? 'mascot-svg-container' : undefined}
      data-fill-percent={Math.round(clampedPercent)}
      data-overflowing={isOverflowing ? 'true' : 'false'}
      data-glass-material={glassMaterialId}
      data-liquid-effect={liquidEffectId}
    >
      {/* Radiant Apothecary Aura Glow behind active Hero character */}
      {isHero && !locked && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-2 rounded-full blur-3xl transition-colors duration-700 ${
            isOverflowing ? 'animate-overflow-pulse' : ''
          }`}
          style={{
            background: isOverflowing
              ? `radial-gradient(circle, ${primaryLiquidColor}66 0%, #D4AF3744 44%, transparent 74%)`
              : `radial-gradient(circle, ${primaryLiquidColor}4D 0%, ${primaryLiquidColor}1E 48%, transparent 74%)`,
          }}
        />
      )}

      <div
        key={isHero ? `hop-${squishKey}-${bubbleBurstKey}` : undefined}
        className={isHero && (squishKey > 0 || bubbleBurstKey > 0) ? 'animate-char-hop' : ''}
      >
        <svg
          viewBox="0 0 240 280"
          className={`${dimensionClass} relative overflow-visible`}
          role="img"
          aria-label={
            locked
              ? `Personagem ${mascot.name} bloqueado`
              : `${mascot.name} preenchido em ${Math.round(effectiveRawPercent)}%`
          }
        >
          <defs>
            {/* Outer Crystal Character Silhouette Clip */}
            <clipPath id={outerClipId}>
              <path d={mascot.clipPathD} />
            </clipPath>

            {/* Inner Blown-Glass Chamber Clip (~4.5px realistic crystal wall thickness) */}
            <clipPath id={innerClipId}>
              <path d={mascot.clipPathD} transform={innerTransform} />
            </clipPath>

            {/* Soft blur filter for 3D sculpted anatomy & creases */}
            <filter id={softBlurId} x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="2" />
            </filter>

            {/* 3D Crystal Rim Light Gradient */}
            <linearGradient id={rimGradId} x1="10%" y1="4%" x2="90%" y2="96%">
              <stop offset="0%" stopColor={locked ? '#64748B' : material.rimStart} stopOpacity="0.98" />
              <stop offset="46%" stopColor={locked ? '#475569' : material.rimMid} stopOpacity="0.74" />
              <stop offset="100%" stopColor={locked ? '#1E293B' : material.rimEnd} stopOpacity="0.92" />
            </linearGradient>

            {/* Blown-Glass Wall Refraction Band */}
            <linearGradient id={thickWallGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={material.specularColor} stopOpacity="0.46" />
              <stop offset="35%" stopColor={material.rimMid} stopOpacity="0.22" />
              <stop offset="72%" stopColor={material.rimEnd} stopOpacity="0.34" />
              <stop offset="100%" stopColor={material.specularColor} stopOpacity="0.3" />
            </linearGradient>

            {/* Translucent Crystal Interior Depth */}
            <radialGradient id={glassBodyGradId} cx="32%" cy="26%" r="76%">
              <stop offset="0%" stopColor={material.glassTintInner} />
              <stop offset="66%" stopColor="rgba(15, 23, 42, 0.15)" />
              <stop offset="100%" stopColor={material.glassTintOuter} />
            </radialGradient>

            {/* 3D Cylindrical Horizontal Liquid Shading Overlay */}
            <linearGradient id={cylShadeId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0.36" />
              <stop offset="22%" stopColor="#FFFFFF" stopOpacity="0.24" />
              <stop offset="46%" stopColor="#FFFFFF" stopOpacity="0.06" />
              <stop offset="78%" stopColor="#020617" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.42" />
            </linearGradient>

            {/* Soft Top-Left Crystal Dome Sheen */}
            <linearGradient id={topHighlightId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={material.specularColor} stopOpacity="0.28" />
              <stop offset="34%" stopColor={material.specularColor} stopOpacity="0.07" />
              <stop offset="100%" stopColor={material.specularColor} stopOpacity="0" />
            </linearGradient>

            {/* Cauldron Mist Vertical Fade */}
            <linearGradient id={mistGradId} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0" />
            </linearGradient>

            {/* Aged Gold Metallic Gradient */}
            <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="38%" stopColor="#E6C24E" />
              <stop offset="72%" stopColor="#C49622" />
              <stop offset="100%" stopColor="#784E0D" />
            </linearGradient>

            {/* Antique Bronze Metallic Gradient */}
            <linearGradient id={bronzeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="35%" stopColor="#B45309" />
              <stop offset="80%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            {/* Warm Leather/Wood Accent */}
            <linearGradient id={corkGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D6A97A" />
              <stop offset="50%" stopColor="#A97448" />
              <stop offset="100%" stopColor="#6F4526" />
            </linearGradient>

            {/* Cut Crystal Finial Gradient */}
            <linearGradient id={crystalGradId} x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Floor Colored Caustics Glow */}
            <radialGradient id={causticGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={bottomLiquidColor} stopOpacity="0.56" />
              <stop offset="55%" stopColor={primaryLiquidColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={primaryLiquidColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* =============================================================== */}
          {/* LAYER 1: FLOOR CONTACT SHADOW + COLORED CAUSTICS (STATIONARY)   */}
          {/* =============================================================== */}
          {!locked && (
            <g aria-hidden="true">
              <ellipse
                cx="120"
                cy="264"
                rx={mascot.floating ? 44 : 66}
                ry={mascot.floating ? 6 : 8.5}
                className="fill-slate-950/24 dark:fill-black/72"
              />
              {showLiquid && (
                <>
                  <ellipse
                    cx={120 + activeTilt * 0.5}
                    cy="263"
                    rx={(mascot.floating ? 40 : 62) * (1 + activeCausticPulse * 0.08)}
                    ry={(mascot.floating ? 5.5 : 8) * (1 + activeCausticPulse * 0.12)}
                    fill={`url(#${causticGradId})`}
                    opacity={0.72 + activeCausticPulse * 0.25}
                  />
                  <ellipse
                    cx={120 + activeTilt * 0.72}
                    cy="263.5"
                    rx={mascot.floating ? 18 : 30}
                    ry="2.6"
                    fill={topLayer?.waveHighlight || '#FFFFFF'}
                    opacity={0.34 + activeCausticPulse * 0.22}
                  />
                </>
              )}
            </g>
          )}

          {/* =============================================================== */}
          {/* ANIMATED CHARACTER RIG (BREATHING / LEVITATING ABOVE SHADOW)    */}
          {/* =============================================================== */}
          <g className={idleMotionClass}>
            {/* Back-layer animated appendages (Dragon wings & tail, Owl wings, Kraken back tentacles, Horse tail) */}
            {!locked && backAnimatedParts.length > 0 && (
              <g aria-hidden="true">{backAnimatedParts.map(renderAnimatedPart)}</g>
            )}

            {/* Contained Overflow Crown Twinkles when > 150% */}
            {!locked && isOverflowing && (
              <g aria-hidden="true">
                {[
                  { cx: 86, cy: Math.max(24, mascot.fillTopY + 18), r: 5.2, color: '#FEF08A', delay: '0s' },
                  { cx: 158, cy: Math.max(26, mascot.fillTopY + 22), r: 4.8, color: '#38BDF8', delay: '0.6s' },
                  { cx: 52, cy: 138, r: 4.2, color: '#FDE047', delay: '1.1s' },
                  { cx: 188, cy: 132, r: 4.2, color: '#BAE6FD', delay: '1.6s' },
                ].map((sp, i) => (
                  <path
                    key={i}
                    d={`M ${sp.cx} ${sp.cy - sp.r} L ${sp.cx + sp.r * 0.3} ${sp.cy - sp.r * 0.3} L ${sp.cx + sp.r} ${sp.cy} L ${sp.cx + sp.r * 0.3} ${sp.cy + sp.r * 0.3} L ${sp.cx} ${sp.cy + sp.r} L ${sp.cx - sp.r * 0.3} ${sp.cy + sp.r * 0.3} L ${sp.cx - sp.r} ${sp.cy} L ${sp.cx - sp.r * 0.3} ${sp.cy - sp.r * 0.3} Z`}
                    fill={sp.color}
                    className="animate-star-twinkle"
                    style={{
                      transformOrigin: `${sp.cx}px ${sp.cy}px`,
                      animationDelay: sp.delay,
                    }}
                  />
                ))}
              </g>
            )}

            {/* ============================================================= */}
            {/* LAYER 2: OUTER SCULPTED CRYSTAL CHARACTER SHELL               */}
            {/* ============================================================= */}
            <path
              d={mascot.clipPathD}
              className={
                locked
                  ? 'fill-slate-200/80 dark:fill-slate-900/85'
                  : 'fill-slate-200/45 dark:fill-[#0D1426]/82'
              }
            />
            {!locked && (
              <g clipPath={`url(#${outerClipId})`}>
                <path d={mascot.clipPathD} fill={`url(#${glassBodyGradId})`} />
                <path
                  d={mascot.clipPathD}
                  fill="none"
                  stroke={`url(#${thickWallGradId})`}
                  strokeWidth="10"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* ============================================================= */}
            {/* LAYER 3: INNER CHAMBER LIVING FLUID (FEET -> LEGS -> HEAD)    */}
            {/* ============================================================= */}
            {!locked && (
              <g clipPath={`url(#${innerClipId})`}>
                {/* Back Parallax Depth Wave */}
                {showSurfaceWaves && topLayer && (
                  <g>
                    <path d={backWavePath} fill={topLayer.color} opacity="0.58" />
                    <path d={backWavePath} fill="#020617" opacity="0.22" />
                  </g>
                )}

                {/* Organic Wavy Stacked Beverage Layers */}
                {showLiquid &&
                  animatedLayers.map((layer, idx) => {
                    const layerBottomY =
                      chamberBottomY - (layer.scaledStart / 100) * fillableHeight;
                    const layerHeight = (layer.scaledHeight / 100) * fillableHeight;
                    const layerTopY = layerBottomY - layerHeight;
                    const isBottom = idx === 0;
                    const isTop = idx === animatedLayers.length - 1;

                    const bandPath = buildOrganicLayerBandPath({
                      topY: isTop && activeLevelPercent >= 98.5 ? chamberTopY - 8 : layerTopY,
                      bottomY: layerBottomY,
                      isBottomLayer: isBottom,
                      isTopLayer: isTop,
                      layerIndex: idx,
                      tilt: activeTilt,
                      phaseFront: activePhaseFront,
                      amplitude: isTop && activeLevelPercent >= 98.5 ? 1.5 : activeAmp,
                    });

                    return (
                      <g key={layer.beverageId}>
                        <path d={bandPath} fill={layer.color} />
                        {!isBottom && (
                          <path
                            d={buildCrestHighlightPath({
                              baseSurfaceY: layerBottomY,
                              tilt: activeTilt * 0.78,
                              phase: activePhaseFront - idx * 0.85,
                              amplitude: Math.min(4.8, activeAmp * 0.56),
                            })}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="1.2"
                            opacity="0.24"
                          />
                        )}
                      </g>
                    );
                  })}

                {/* 3D Cylindrical Horizontal Shading over Liquid */}
                {showLiquid && (
                  <rect
                    x="0"
                    y={Math.max(0, topSurfaceY - 26)}
                    width="240"
                    height={Math.max(0, chamberBottomY - topSurfaceY + 42)}
                    fill={`url(#${cylShadeId})`}
                  />
                )}

                {/* Specular Meniscus & Foam Crest */}
                {showSurfaceWaves && topLayer && (
                  <g aria-hidden="true">
                    <g transform={`rotate(${(activeTilt / 24) * 10} 120 ${topSurfaceY})`}>
                      <ellipse
                        cx="120"
                        cy={topSurfaceY + 1.5}
                        rx="76"
                        ry="6.6"
                        fill="#FFFFFF"
                        fillOpacity="0.22"
                      />
                    </g>
                    <path
                      d={crestHighlightPath}
                      fill="none"
                      stroke={topLayer.waveHighlight}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      opacity="0.82"
                    />
                    <path
                      d={crestHighlightPath}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </g>
                )}

                {/* Live Rising Micro-Bubbles */}
                {showLiquid &&
                  (isHero ? physics.bubbles : physics.bubbles.slice(0, 5)).map((b) => {
                    const bx = b.x + Math.sin(b.wobblePhase) * b.wobbleAmp;
                    const localSurf = getSurfaceYAtX(
                      bx,
                      topSurfaceY,
                      activeTilt,
                      activePhaseFront,
                      activeAmp
                    );
                    if (b.y < localSurf + 3) return null;
                    return (
                      <g key={b.id} opacity={b.alpha}>
                        <circle
                          cx={bx}
                          cy={b.y}
                          r={b.r}
                          fill="#FFFFFF"
                          fillOpacity="0.26"
                          stroke="#FFFFFF"
                          strokeWidth="0.75"
                          strokeOpacity="0.7"
                        />
                        <circle
                          cx={bx - b.r * 0.3}
                          cy={b.y - b.r * 0.3}
                          r={Math.max(0.45, b.r * 0.3)}
                          fill="#FFFFFF"
                          fillOpacity="0.9"
                        />
                      </g>
                    );
                  })}

                {/* Splash Droplets jumping above surface on pour/slosh */}
                {isHero &&
                  physics.splashes.map((drop) => (
                    <circle
                      key={drop.id}
                      cx={drop.x}
                      cy={drop.y}
                      r={drop.r}
                      fill={drop.color}
                      fillOpacity={drop.alpha}
                      stroke="#FFFFFF"
                      strokeWidth="0.65"
                      strokeOpacity={drop.alpha * 0.7}
                    />
                  ))}

                {/* === EQUIPPED LIQUID MAGIC EFFECTS === */}
                {showLiquid && liquidEffectId === 'gelo' && activeLevelPercent < 96 && (
                  <g>
                    {[
                      { x: 92, w: 16, h: 14, rot: -8 },
                      { x: 120, w: 15, h: 13, rot: 6 },
                      { x: 144, w: 13, h: 12, rot: -4 },
                    ].map((cube, i) => {
                      const cy = getSurfaceYAtX(
                        cube.x,
                        topSurfaceY,
                        activeTilt,
                        activePhaseFront,
                        activeAmp
                      );
                      const angle = cube.rot + (activeTilt / 24) * 14;
                      return (
                        <g
                          key={i}
                          transform={`translate(${cube.x} ${cy}) rotate(${angle})`}
                        >
                          <rect
                            x={-cube.w / 2}
                            y={-cube.h / 2}
                            width={cube.w}
                            height={cube.h}
                            rx="3.5"
                            fill="#E0F2FE"
                            fillOpacity="0.62"
                            stroke="#FFFFFF"
                            strokeWidth="1.3"
                          />
                          <path
                            d={`M ${-cube.w / 2 + 3} ${-cube.h / 2 + 3} L ${cube.w / 2 - 4} ${-cube.h / 2 + 3} L ${-cube.w / 2 + 3} ${cube.h / 2 - 4} Z`}
                            fill="#FFFFFF"
                            fillOpacity="0.65"
                          />
                        </g>
                      );
                    })}
                  </g>
                )}

                {showLiquid && liquidEffectId === 'poeira-estelar' && (
                  <g>
                    {STAR_DUST.map((s, idx) => {
                      const sy =
                        topSurfaceY + 12 + s.yRatio * Math.max(12, filledPixelHeight - 20);
                      return (
                        <g
                          key={idx}
                          style={{
                            transformOrigin: `${s.x}px ${sy}px`,
                            animationDelay: s.delay,
                          }}
                          className="animate-star-twinkle"
                        >
                          <path
                            d={`M ${s.x} ${sy - s.size} L ${s.x + s.size * 0.32} ${sy - s.size * 0.32} L ${s.x + s.size} ${sy} L ${s.x + s.size * 0.32} ${sy + s.size * 0.32} L ${s.x} ${sy + s.size} L ${s.x - s.size * 0.32} ${sy + s.size * 0.32} L ${s.x - s.size} ${sy} L ${s.x - s.size * 0.32} ${sy - s.size * 0.32} Z`}
                            fill="#FEF9C3"
                          />
                        </g>
                      );
                    })}
                  </g>
                )}

                {showLiquid && liquidEffectId === 'bolhas-douradas' && (
                  <g>
                    {GOLD_BUBBLES.map((b, idx) => (
                      <circle
                        key={idx}
                        cx={b.cx}
                        cy={Math.min(chamberBottomY - 6, topSurfaceY + b.offset + 24)}
                        r={b.r}
                        fill="#FDE047"
                        fillOpacity="0.72"
                        stroke="#FEF9C3"
                        strokeWidth="1"
                        className="animate-ambient-bubble"
                        style={{ animationDelay: b.delay }}
                      />
                    ))}
                  </g>
                )}

                {showLiquid && liquidEffectId === 'nevoa' && activeLevelPercent < 94 && (
                  <g transform={`translate(0 ${topSurfaceY})`}>
                    <ellipse
                      cx="98"
                      cy="-12"
                      rx="24"
                      ry="11"
                      fill={`url(#${mistGradId})`}
                      className="animate-mist-rise"
                    />
                    <ellipse
                      cx="132"
                      cy="-16"
                      rx="28"
                      ry="12"
                      fill={`url(#${mistGradId})`}
                      className="animate-mist-rise"
                      style={{ animationDelay: '1.1s' }}
                    />
                  </g>
                )}

                {isOverflowing && (
                  <rect
                    x="0"
                    y={chamberTopY - 4}
                    width="240"
                    height="26"
                    fill="#FEF08A"
                    opacity="0.22"
                    className="animate-overflow-pulse"
                  />
                )}
              </g>
            )}

            {/* ============================================================= */}
            {/* LAYER 4: INNER CRYSTAL WALL + 3D ANATOMICAL RELIEF + GLOSS    */}
            {/* ============================================================= */}
            {!locked && (
              <g clipPath={`url(#${outerClipId})`} aria-hidden="true">
                {/* Subtle inner blown-glass wall edge separating crystal thickness from liquid */}
                <path
                  d={mascot.clipPathD}
                  transform={innerTransform}
                  fill="none"
                  stroke={material.specularColor}
                  strokeWidth="1.2"
                  opacity="0.32"
                />

                {/* 3D Sculpted Anatomy Shading & Creases */}
                {mascot.sculptPaths?.map((sc, idx) => (
                  <path
                    key={idx}
                    d={sc.d}
                    fill={sc.fill ?? 'none'}
                    stroke={sc.stroke ?? 'none'}
                    strokeWidth={sc.strokeWidth ?? 0}
                    strokeLinecap="round"
                    opacity={sc.opacity ?? 0.25}
                    filter={sc.blur ? `url(#${softBlurId})` : undefined}
                  />
                ))}

                {/* Front Studio Glass Ambient Dome Sheen */}
                <path d={mascot.clipPathD} fill={`url(#${topHighlightId})`} />

                {/* Left Long Specular Studio Reflection Arcs */}
                {mascot.specularPaths.map((sp, idx) => (
                  <path
                    key={idx}
                    d={sp.d}
                    fill="none"
                    stroke={material.specularColor}
                    strokeWidth={sp.strokeWidth ?? 5}
                    strokeLinecap="round"
                    opacity={sp.opacity ?? 0.52}
                  />
                ))}

                {/* Crisp Upper-Left Pinpoint Studio Highlight */}
                {mascot.pinpointHighlight && (
                  <ellipse
                    cx={mascot.pinpointHighlight.cx}
                    cy={mascot.pinpointHighlight.cy}
                    rx={mascot.pinpointHighlight.rx ?? 3.4}
                    ry={mascot.pinpointHighlight.ry ?? 2.1}
                    transform={`rotate(-28 ${mascot.pinpointHighlight.cx} ${mascot.pinpointHighlight.cy})`}
                    fill="#FFFFFF"
                    opacity="0.86"
                  />
                )}

                {/* Fine Studio Right-Side Rim Backlight */}
                {mascot.rightRimPath && (
                  <path
                    d={mascot.rightRimPath}
                    fill="none"
                    stroke={material.specularColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.46"
                  />
                )}
              </g>
            )}

            {/* ============================================================= */}
            {/* LAYER 5: OUTER CRYSTAL RIM OUTLINE                            */}
            {/* ============================================================= */}
            <path
              d={mascot.clipPathD}
              fill="none"
              stroke={`url(#${rimGradId})`}
              strokeWidth={locked ? 2.2 : isHero ? 2.7 : 2.8}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* ============================================================= */}
            {/* LAYER 6: AGED GOLD / BRONZE / CRYSTAL CHARACTER ACCESSORIES   */}
            {/* ============================================================= */}
            {!locked && mascot.metallicPaths && (
              <g aria-hidden="true">
                {mascot.metallicPaths.map((mp, idx) => (
                  <path
                    key={idx}
                    d={mp.d}
                    fill={mp.fill ? metalGradUrl(mp.metal) : 'none'}
                    stroke={
                      mp.fill
                        ? mp.metal === 'crystal'
                          ? '#FFFFFF'
                          : '#451A03'
                        : metalGradUrl(mp.metal)
                    }
                    strokeWidth={mp.strokeWidth ?? (mp.fill ? 0.9 : 2.5)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={mp.opacity ?? 0.95}
                  />
                ))}
              </g>
            )}

            {/* Front-layer animated character parts (Tassels, flames, tongue, halos, stars) */}
            {!locked && frontAnimatedParts.length > 0 && (
              <g aria-hidden="true">{frontAnimatedParts.map(renderAnimatedPart)}</g>
            )}

            {/* ============================================================= */}
            {/* LAYER 7: EXPRESSIVE FACE & ANIMATED BLINKING EYES             */}
            {/* ============================================================= */}
            {!locked && (
              <g className="text-slate-900 dark:text-slate-100">
                {mascot.detailPaths.map((detail, idx) => (
                  <path
                    key={idx}
                    d={detail.d}
                    fill={detail.fill ?? 'none'}
                    stroke={detail.stroke ?? 'currentColor'}
                    strokeWidth={detail.strokeWidth ?? 2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={detail.opacity ?? 0.92}
                  />
                ))}

                {mascot.eyes.map((eye, idx) => {
                  const ry = eye.ry ?? eye.rx;
                  const transform = eye.tilt
                    ? `rotate(${eye.tilt} ${eye.cx} ${eye.cy})`
                    : undefined;
                  return (
                    <g key={idx}>
                      {eye.browD && (
                        <path
                          d={eye.browD}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.7"
                          strokeLinecap="round"
                        />
                      )}
                      <g
                        className="animate-eye-blink"
                        style={{ transformOrigin: `${eye.cx}px ${eye.cy}px` }}
                      >
                        <g transform={transform}>
                          <ellipse
                            cx={eye.cx}
                            cy={eye.cy}
                            rx={eye.rx + 1.3}
                            ry={ry + 1.3}
                            fill="#FFFFFF"
                            fillOpacity="0.9"
                          />
                          <ellipse
                            cx={eye.cx}
                            cy={eye.cy}
                            rx={eye.rx}
                            ry={ry}
                            fill={eye.irisColor ?? '#0F172A'}
                          />
                          <circle
                            cx={eye.cx - eye.rx * 0.34}
                            cy={eye.cy - ry * 0.34}
                            r={Math.max(1.4, Math.min(eye.rx, ry) * 0.34)}
                            fill="#FFFFFF"
                          />
                          <circle
                            cx={eye.cx + eye.rx * 0.28}
                            cy={eye.cy + ry * 0.28}
                            r={Math.max(0.85, Math.min(eye.rx, ry) * 0.16)}
                            fill="#FFFFFF"
                            fillOpacity="0.85"
                          />
                        </g>
                      </g>
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  applySplashImpulse,
  applyTouchSlosh,
  BASE_WAVE_AMPLITUDE,
  buildCrestHighlightPath,
  buildOrganicLayerBandPath,
  buildSurfaceWavePath,
  createFluidPhysicsState,
  gammaToTargetTilt,
  getSurfaceYAtX,
  MAX_TILT_PX,
  scaleLayersForAnimatedLevel,
  stepFluidPhysics,
} from './fluidPhysics.ts';
import type { LiquidLayer } from '../types/hydration.ts';

describe('GotaViva 60fps Fluid Physics Engine', () => {
  it('damps slosh tilt and wave amplitude back to equilibrium over time', () => {
    let state = createFluidPhysicsState(45, 20, 236);
    state = applySplashImpulse(state, {
      strength: 1.4,
      direction: 1,
      color: '#0EA5E9',
      surfaceY: 130,
      dropletCount: 6,
    });

    assert.equal(state.splashes.length, 6);
    assert.ok(state.waveAmplitude > BASE_WAVE_AMPLITUDE);
    assert.ok(Math.abs(state.tiltVelocity) > 20);

    // Simulate 4 seconds at 60fps
    for (let i = 0; i < 240; i++) {
      state = stepFluidPhysics(state, 1 / 60, {
        targetPercent: 60,
        fillTopY: 20,
        fillBottomY: 236,
      });
    }

    assert.ok(Math.abs(state.levelPercent - 60) < 0.2, 'levelPercent should converge smoothly to 60%');
    assert.ok(Math.abs(state.tilt) < 0.8, 'tilt should damp back near 0');
    assert.ok(
      Math.abs(state.waveAmplitude - BASE_WAVE_AMPLITUDE) < 0.6,
      'waveAmplitude should settle near baseline'
    );
    assert.equal(state.splashes.length, 0, 'splash droplets should fall back and expire');
  });

  it('reacts directionally to touch/drag slosh and gyroscope tilt', () => {
    let state = createFluidPhysicsState(50, 20, 236);
    state = applyTouchSlosh(state, {
      normalizedX: 0.7,
      velocityX: 18,
      color: '#F97316',
      surfaceY: 128,
      spawnDroplets: true,
    });
    assert.ok(state.tiltVelocity > 0, 'rightward drag should push tiltVelocity positive');
    assert.ok(state.splashes.length > 0, 'strong touch slosh should spawn droplets');

    assert.equal(gammaToTargetTilt(0), 0);
    assert.equal(gammaToTargetTilt(45), MAX_TILT_PX);
    assert.equal(gammaToTargetTilt(-90), -MAX_TILT_PX);
  });

  it('builds non-flat organic wavy boundaries for multi-drink layers and surface waves', () => {
    const surfaceWave = buildSurfaceWavePath({
      baseSurfaceY: 120,
      bottomY: 236,
      tilt: 8,
      phase: 1.2,
      amplitude: 5,
    });
    assert.ok(surfaceWave.startsWith('M 0.0 '));
    assert.ok(surfaceWave.endsWith('Z'));

    const crest = buildCrestHighlightPath({
      baseSurfaceY: 120,
      tilt: 8,
      phase: 1.2,
      amplitude: 5,
    });
    assert.ok(crest.startsWith('M 0.0 '));
    assert.ok(!crest.endsWith('Z'), 'crest highlight should be an open stroke path');

    const yLeft = getSurfaceYAtX(12, 120, 10, 0.5, 4);
    const yRight = getSurfaceYAtX(228, 120, 10, 0.5, 4);
    assert.ok(yRight > yLeft, 'positive tilt should lower right side relative to left');

    const middleBand = buildOrganicLayerBandPath({
      topY: 140,
      bottomY: 180,
      isBottomLayer: false,
      isTopLayer: false,
      layerIndex: 1,
      tilt: 6,
      phaseFront: 2.1,
      amplitude: 4.5,
    });
    // Extract all Y coordinates along the band to confirm organic non-constant seams
    const matches = [...middleBand.matchAll(/[ML]\s+[\d.]+\s+([\d.]+)/g)].map((m) => Number(m[1]));
    const uniqueYs = new Set(matches.map((y) => Math.round(y * 10)));
    assert.ok(uniqueYs.size > 10, 'organic beverage band should have varied curved Y coordinates');
  });

  it('cycles rising micro-bubbles continuously and scales animated layers proportionally', () => {
    let state = createFluidPhysicsState(50, 20, 236);
    const initialCount = state.bubbles.length;
    for (let i = 0; i < 120; i++) {
      state = stepFluidPhysics(state, 1 / 60, {
        targetPercent: 50,
        fillTopY: 20,
        fillBottomY: 236,
      });
    }
    assert.equal(state.bubbles.length, initialCount, 'bubble pool size should remain constant');

    const layers: LiquidLayer[] = [
      {
        beverageId: 'agua',
        name: 'Água',
        color: '#0EA5E9',
        waveHighlight: '#38BDF8',
        rawMl: 500,
        hydratedMl: 500,
        startPercent: 0,
        heightPercent: 30,
      },
      {
        beverageId: 'cafe',
        name: 'Café',
        color: '#78350F',
        waveHighlight: '#B45309',
        rawMl: 250,
        hydratedMl: 200,
        startPercent: 30,
        heightPercent: 20,
      },
    ];

    const scaled = scaleLayersForAnimatedLevel(layers, 50, 25);
    assert.equal(scaled[0].scaledHeight, 15);
    assert.equal(scaled[1].scaledStart, 15);
    assert.equal(scaled[1].scaledHeight, 10);
  });
});

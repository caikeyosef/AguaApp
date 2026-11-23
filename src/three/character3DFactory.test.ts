import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MASCOTS } from '../data/mascots';
import { GLASS_MATERIALS, LIQUID_EFFECTS } from '../data/alchemy';
import {
  buildCharacter3D,
  getAlchemyParticleConfig,
  getPedestalAlchemyStyle,
  MASCOT_TO_3D_KEY,
  RARITY_3D_COLOR,
} from './character3DFactory';

test('MASCOT_TO_3D_KEY maps all 16 GotaViva mascots cleanly', () => {
  assert.equal(MASCOTS.length, 16);
  const uniqueKeys = new Set<string>();

  for (const mascot of MASCOTS) {
    const key = MASCOT_TO_3D_KEY[mascot.id];
    assert.ok(key, `Missing 3D key for mascot ${mascot.id}`);
    uniqueKeys.add(key);
    assert.ok(RARITY_3D_COLOR[mascot.rarity], `Missing rarity 3D color for ${mascot.rarity}`);
  }

  assert.equal(uniqueKeys.size, 16, 'Each of the 16 mascots must map to a unique 3D character');
});

test('buildCharacter3D constructs valid solid 3D rigs and disposes cleanly for all 16 creatures', () => {
  const waterSurface = new THREE.MeshStandardMaterial({ color: 0x0ea5e9 });
  const waterStream = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });

  for (const mascot of MASCOTS) {
    const rig = buildCharacter3D(mascot.id, { waterSurface, waterStream });
    assert.equal(rig.id, mascot.id);
    assert.equal(rig.key3D, MASCOT_TO_3D_KEY[mascot.id]);
    assert.ok(rig.root instanceof THREE.Group);
    assert.ok(rig.bodyGroup instanceof THREE.Group);
    assert.ok(rig.headGroup instanceof THREE.Group);
    assert.ok(rig.armGroup instanceof THREE.Group);
    assert.ok(rig.mouthMarker instanceof THREE.Object3D);
    assert.ok(rig.spoutMarker instanceof THREE.Object3D);

    let meshCount = 0;
    let usesSharedWaterSurface = false;
    rig.root.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        meshCount += 1;
        const m = obj as THREE.Mesh;
        if (m.material === waterSurface) {
          usesSharedWaterSurface = true;
        }
      }
    });

    assert.ok(
      meshCount >= 8,
      `Expected >= 8 meshes for ${mascot.id}, got ${meshCount}`
    );
    assert.equal(
      usesSharedWaterSurface,
      true,
      `Expected ${mascot.id} vessel to use shared dynamic waterSurface material`
    );

    // Ensure dispose runs cleanly without throwing
    assert.doesNotThrow(() => rig.dispose());
  }

  waterSurface.dispose();
  waterStream.dispose();
});

test('Alchemy 3D pedestal styles and particle configs cover all unlocked/locked items', () => {
  for (const mat of GLASS_MATERIALS) {
    const style = getPedestalAlchemyStyle(mat.id);
    assert.equal(typeof style.topColor, 'number');
    assert.equal(typeof style.rimLightColor, 'number');
    assert.ok(style.rimLightIntensity > 0);
  }

  for (const eff of LIQUID_EFFECTS) {
    const cfg = getAlchemyParticleConfig(eff.id);
    assert.equal(cfg.id, eff.id);
    if (eff.id === 'nenhum') {
      assert.equal(cfg.count, 0);
    } else {
      assert.ok(cfg.count > 0, `Expected 3D particles for effect ${eff.id}`);
    }
  }
});

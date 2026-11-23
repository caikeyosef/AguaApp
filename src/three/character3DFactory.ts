import * as THREE from 'three';
import { GlassMaterialId, LiquidEffectId, MascotId, Rarity } from '../types/hydration';

export type Character3DKey =
  | 'gnomo'
  | 'sapo'
  | 'cogumelo'
  | 'goblin'
  | 'nessie'
  | 'yeti'
  | 'et'
  | 'troll'
  | 'saci'
  | 'fantasma'
  | 'mimico'
  | 'coruja'
  | 'dragao'
  | 'genio'
  | 'kraken'
  | 'mula';

export const MASCOT_TO_3D_KEY: Record<MascotId, Character3DKey> = {
  gnomo: 'gnomo',
  'sapo-mago': 'sapo',
  cogumelo: 'cogumelo',
  'goblin-cafe': 'goblin',
  nessie: 'nessie',
  yeti: 'yeti',
  'et-varginha': 'et',
  troll: 'troll',
  saci: 'saci',
  fantasma: 'fantasma',
  mimico: 'mimico',
  'coruja-alquimista': 'coruja',
  'dragao-bebe': 'dragao',
  genio: 'genio',
  kraken: 'kraken',
  'mula-sem-cabeca': 'mula',
};

export const RARITY_3D_COLOR: Record<Rarity, { hex: number; css: string }> = {
  comum: { hex: 0x94a3b8, css: '#94a3b8' },
  raro: { hex: 0x38bdf8, css: '#38bdf8' },
  epico: { hex: 0xa855f7, css: '#a855f7' },
  lendario: { hex: 0xf59e0b, css: '#f59e0b' },
};

export interface PedestalAlchemyStyle {
  topColor: number;
  baseColor: number;
  roughness: number;
  metalness: number;
  rimLightColor: number;
  rimLightIntensity: number;
  innerRingColor: number;
  prismShift?: boolean;
}

export function getPedestalAlchemyStyle(materialId: GlassMaterialId): PedestalAlchemyStyle {
  switch (materialId) {
    case 'esmeralda':
      return {
        topColor: 0x064e3b,
        baseColor: 0x022c22,
        roughness: 0.24,
        metalness: 0.42,
        rimLightColor: 0x34d399,
        rimLightIntensity: 2.3,
        innerRingColor: 0x6ee7b7,
      };
    case 'obsidiana':
      return {
        topColor: 0x090d16,
        baseColor: 0x02040a,
        roughness: 0.14,
        metalness: 0.72,
        rimLightColor: 0xe2e8f0,
        rimLightIntensity: 2.25,
        innerRingColor: 0xcbd5e1,
      };
    case 'ouro':
      return {
        topColor: 0x451a03,
        baseColor: 0x261004,
        roughness: 0.22,
        metalness: 0.85,
        rimLightColor: 0xfbbf24,
        rimLightIntensity: 2.4,
        innerRingColor: 0xfde047,
      };
    case 'prisma':
      return {
        topColor: 0x1e1b4b,
        baseColor: 0x0f172a,
        roughness: 0.18,
        metalness: 0.65,
        rimLightColor: 0xe879f9,
        rimLightIntensity: 2.45,
        innerRingColor: 0x38bdf8,
        prismShift: true,
      };
    case 'cristal':
    default:
      return {
        topColor: 0x111827,
        baseColor: 0x0b0f1a,
        roughness: 0.42,
        metalness: 0.22,
        rimLightColor: 0x38bdf8,
        rimLightIntensity: 1.9,
        innerRingColor: 0xd4af37,
      };
  }
}

export interface AlchemyParticleConfig {
  id: LiquidEffectId;
  count: number;
  color: number;
  emissive: number;
}

export function getAlchemyParticleConfig(effectId: LiquidEffectId): AlchemyParticleConfig {
  switch (effectId) {
    case 'gelo':
      return { id: 'gelo', count: 10, color: 0xbae6fd, emissive: 0x38bdf8 };
    case 'poeira-estelar':
      return { id: 'poeira-estelar', count: 18, color: 0xe879f9, emissive: 0xc084fc };
    case 'bolhas-douradas':
      return { id: 'bolhas-douradas', count: 14, color: 0xfde047, emissive: 0xd4af37 };
    case 'nevoa':
      return { id: 'nevoa', count: 12, color: 0x99f6e4, emissive: 0x2dd4bf };
    case 'nenhum':
    default:
      return { id: 'nenhum', count: 0, color: 0xffffff, emissive: 0x000000 };
  }
}

export interface KrakenArmRig {
  pivot: THREE.Group;
  cup: THREE.Group;
  spout: THREE.Object3D;
  restRotX: number;
}

export interface Character3DSpecial {
  frogThroat?: THREE.Mesh;
  isStraw?: boolean;
  isJittery?: boolean;
  nessieCurve?: THREE.CatmullRomCurve3;
  nessieGulp?: THREE.Mesh;
  isNessie?: boolean;
  saciWhirlwind?: THREE.Group;
  isFloater?: boolean;
  mimicTongue?: THREE.Mesh;
  isMimic?: boolean;
  dragonWings?: [THREE.Mesh, THREE.Mesh];
  isDragon?: boolean;
  krakenArms?: KrakenArmRig[];
  isKraken?: boolean;
  isMula?: boolean;
  mulaFlames?: THREE.Mesh[];
  mulaFlameMats?: [THREE.MeshStandardMaterial, THREE.MeshStandardMaterial];
}

export interface Character3DRig {
  id: MascotId;
  key3D: Character3DKey;
  root: THREE.Group;
  bodyGroup: THREE.Group;
  headGroup: THREE.Group;
  armGroup: THREE.Group;
  cupGroup: THREE.Group;
  mouthMarker: THREE.Object3D;
  spoutMarker: THREE.Object3D;
  special: Character3DSpecial;
  idleRest: {
    armPos: THREE.Vector3;
    armRot: THREE.Euler;
    cupPos: THREE.Vector3;
    cupRot: THREE.Euler;
    headPos: THREE.Vector3;
    headRot: THREE.Euler;
    bodyY: number;
  };
  dispose: () => void;
}

type VesselType =
  | 'wood_mug'
  | 'chalice'
  | 'leaf_straw'
  | 'giant_mug'
  | 'ice_mug'
  | 'cosmic_cup'
  | 'stone_mug'
  | 'gourd'
  | 'well_bucket'
  | 'beaker'
  | 'pitcher'
  | 'mini_cup'
  | 'royal_chalice'
  | 'basin';

export interface LiquidMaterialsRef {
  waterSurface: THREE.MeshStandardMaterial;
  waterStream: THREE.MeshStandardMaterial;
}

/**
 * Recursively disposes geometries and materials created inside a character rig,
 * skipping externally shared liquid materials owned by the stage.
 */
export function disposeObject3D(
  root: THREE.Object3D,
  skipMaterials?: Set<THREE.Material>
): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      geometries.add(mesh.geometry);
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => {
          if (!skipMaterials?.has(m)) materials.add(m);
        });
      } else if (!skipMaterials?.has(mesh.material)) {
        materials.add(mesh.material);
      }
    }
  });

  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}

/**
 * Builds one of the 16 solid PBR vinyl-toy/clay 3D characters with its unique vessel
 * and animation rig, faithfully ported from the GotaViva 3D showcase.
 */
export function buildCharacter3D(
  mascotId: MascotId,
  liquidMats: LiquidMaterialsRef
): Character3DRig {
  const key3D = MASCOT_TO_3D_KEY[mascotId] || 'gnomo';
  const localMatCache = new Map<string, THREE.MeshStandardMaterial>();
  const skipMaterials = new Set<THREE.Material>([
    liquidMats.waterSurface,
    liquidMats.waterStream,
  ]);

  const clayMat = (
    hex: number,
    roughness = 0.5,
    metalness = 0.04,
    emissive = 0x000000,
    emissiveIntensity = 0
  ): THREE.MeshStandardMaterial => {
    const key = `${hex}_${roughness}_${metalness}_${emissive}_${emissiveIntensity}`;
    const existing = localMatCache.get(key);
    if (existing) return existing;
    const mat = new THREE.MeshStandardMaterial({
      color: hex,
      roughness,
      metalness,
      emissive,
      emissiveIntensity,
      transparent: false,
      opacity: 1.0,
    });
    localMatCache.set(key, mat);
    return mat;
  };

  const metalMat = (hex = 0xd4af37, roughness = 0.24, metalness = 0.86) =>
    clayMat(hex, roughness, metalness);

  const M = {
    eyeDark: clayMat(0x0b0f19, 0.08, 0.12),
    eyeWhite: clayMat(0xffffff, 0.12, 0.0),
    gold: metalMat(0xd4af37, 0.22, 0.88),
    goldBright: metalMat(0xf5c542, 0.18, 0.9),
    bronze: metalMat(0x9a6b35, 0.32, 0.78),
    silver: metalMat(0xcbd5e1, 0.24, 0.85),
    wood: clayMat(0x7c4a26, 0.68, 0.04),
    woodDark: clayMat(0x4a2a14, 0.72, 0.04),
    stone: clayMat(0x64748b, 0.78, 0.05),
    blush: clayMat(0xf472b6, 0.55, 0.0),
    waterSurface: liquidMats.waterSurface,
  };

  const makeMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
    rot: [number, number, number] = [0, 0, 0]
  ): THREE.Mesh => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.rotation.set(rot[0], rot[1], rot[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const makeEye = (
    r = 0.085,
    sclera = false,
    pupilColor: number | null = null
  ): THREE.Group => {
    const g = new THREE.Group();
    if (sclera) {
      g.add(makeMesh(new THREE.SphereGeometry(r, 20, 16), M.eyeWhite));
      const pMat = pupilColor ? clayMat(pupilColor, 0.12, 0.1) : M.eyeDark;
      g.add(makeMesh(new THREE.SphereGeometry(r * 0.62, 16, 14), pMat, [0, 0, r * 0.54]));
      g.add(
        makeMesh(
          new THREE.SphereGeometry(r * 0.24, 10, 10),
          M.eyeWhite,
          [-r * 0.22, r * 0.24, r * 1.02]
        )
      );
    } else {
      const pMat = pupilColor ? clayMat(pupilColor, 0.1, 0.12) : M.eyeDark;
      g.add(makeMesh(new THREE.SphereGeometry(r, 20, 16), pMat));
      g.add(
        makeMesh(
          new THREE.SphereGeometry(r * 0.34, 10, 10),
          M.eyeWhite,
          [-r * 0.28, r * 0.3, r * 0.78]
        )
      );
      g.add(
        makeMesh(
          new THREE.SphereGeometry(r * 0.16, 10, 10),
          M.eyeWhite,
          [r * 0.26, -r * 0.22, r * 0.84]
        )
      );
    }
    return g;
  };

  const createVessel = (type: VesselType): { cup: THREE.Group; spout: THREE.Object3D } => {
    const cup = new THREE.Group();
    const spout = new THREE.Object3D();
    spout.position.set(0, 0.22, 0);
    cup.add(spout);

    if (type === 'wood_mug') {
      cup.add(makeMesh(new THREE.CylinderGeometry(0.15, 0.13, 0.3, 18), M.wood, [0, 0, 0]));
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.146, 0.018, 10, 22),
          M.gold,
          [0, 0.09, 0],
          [1, 1, 1],
          [Math.PI / 2, 0, 0]
        )
      );
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.135, 0.018, 10, 22),
          M.gold,
          [0, -0.09, 0],
          [1, 1, 1],
          [Math.PI / 2, 0, 0]
        )
      );
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.09, 0.022, 10, 18, Math.PI),
          M.woodDark,
          [0.14, 0, 0],
          [1, 1, 1],
          [0, 0, -Math.PI / 2]
        )
      );
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 18), M.waterSurface, [0, 0.145, 0])
      );
      spout.position.set(-0.11, 0.16, 0);
    } else if (type === 'chalice') {
      cup.add(makeMesh(new THREE.CylinderGeometry(0.15, 0.05, 0.2, 20), M.goldBright, [0, 0.09, 0]));
      cup.add(makeMesh(new THREE.CylinderGeometry(0.03, 0.035, 0.16, 14), M.gold, [0, -0.06, 0]));
      cup.add(makeMesh(new THREE.CylinderGeometry(0.09, 0.11, 0.04, 18), M.goldBright, [0, -0.15, 0]));
      cup.add(
        makeMesh(
          new THREE.CylinderGeometry(0.132, 0.132, 0.025, 18),
          M.waterSurface,
          [0, 0.185, 0]
        )
      );
      spout.position.set(-0.1, 0.2, 0);
    } else if (type === 'leaf_straw') {
      const leafMat = clayMat(0x22c55e, 0.45);
      const strawMat = clayMat(0xfef08a, 0.35);
      cup.add(makeMesh(new THREE.CylinderGeometry(0.13, 0.09, 0.22, 16), leafMat, [0, 0, 0]));
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.11, 0.11, 0.025, 16), M.waterSurface, [0, 0.1, 0])
      );
      cup.add(makeMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24, 10), strawMat, [0.02, 0.19, 0]));
      cup.add(
        makeMesh(
          new THREE.CylinderGeometry(0.018, 0.018, 0.16, 10),
          strawMat,
          [-0.04, 0.31, 0],
          [1, 1, 1],
          [0, 0, 1.05]
        )
      );
      spout.position.set(-0.11, 0.34, 0);
    } else if (type === 'giant_mug') {
      const mugMat = clayMat(0xf5f5f4, 0.32);
      const bandMat = clayMat(0xb45309, 0.42);
      cup.add(makeMesh(new THREE.CylinderGeometry(0.2, 0.18, 0.34, 20), mugMat, [0, 0, 0]));
      cup.add(makeMesh(new THREE.CylinderGeometry(0.204, 0.2, 0.07, 20), bandMat, [0, 0.02, 0]));
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.11, 0.028, 10, 18, Math.PI),
          mugMat,
          [0.19, 0, 0],
          [1, 1, 1],
          [0, 0, -Math.PI / 2]
        )
      );
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.175, 0.175, 0.03, 20), M.waterSurface, [0, 0.165, 0])
      );
      spout.position.set(-0.14, 0.18, 0);
    } else if (type === 'ice_mug') {
      const iceMat = clayMat(0xbae6fd, 0.22, 0.12);
      cup.add(makeMesh(new THREE.BoxGeometry(0.3, 0.34, 0.3), iceMat, [0, 0, 0]));
      cup.add(makeMesh(new THREE.BoxGeometry(0.12, 0.18, 0.06), iceMat, [0.19, 0, 0]));
      cup.add(makeMesh(new THREE.BoxGeometry(0.25, 0.035, 0.25), M.waterSurface, [0, 0.165, 0]));
      spout.position.set(-0.12, 0.18, 0);
    } else if (type === 'cosmic_cup') {
      const cupMat = clayMat(0x4c1d95, 0.28, 0.35, 0x3b0764, 0.35);
      const ringMat = clayMat(0x22d3ee, 0.22, 0.4, 0x06b6d4, 0.5);
      cup.add(makeMesh(new THREE.CylinderGeometry(0.14, 0.09, 0.26, 18), cupMat, [0, 0, 0]));
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.13, 0.018, 10, 22),
          ringMat,
          [0, 0.06, 0],
          [1, 1, 1],
          [Math.PI / 2, 0, 0]
        )
      );
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 18), M.waterSurface, [0, 0.125, 0])
      );
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 18; i++) {
        const t = i / 18;
        const ang = t * Math.PI * 3.5;
        pts.push(
          new THREE.Vector3(
            Math.cos(ang) * 0.035 * (1 - t * 0.4),
            0.11 + t * 0.28,
            Math.sin(ang) * 0.035 * (1 - t * 0.4)
          )
        );
      }
      pts.push(new THREE.Vector3(-0.1, 0.43, 0));
      const spiralGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, 0.015, 8, false);
      cup.add(makeMesh(spiralGeo, clayMat(0x38bdf8, 0.25, 0.1, 0x0284c7, 0.3)));
      spout.position.set(-0.1, 0.43, 0);
    } else if (type === 'stone_mug') {
      cup.add(makeMesh(new THREE.CylinderGeometry(0.18, 0.17, 0.34, 8), M.stone, [0, 0, 0]));
      cup.add(makeMesh(new THREE.BoxGeometry(0.11, 0.19, 0.07), M.stone, [0.19, 0, 0]));
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 8), M.waterSurface, [0, 0.165, 0])
      );
      spout.position.set(-0.14, 0.18, 0);
    } else if (type === 'gourd') {
      const gourdMat = clayMat(0xb45309, 0.56);
      cup.add(
        makeMesh(new THREE.SphereGeometry(0.15, 18, 16), gourdMat, [0, -0.05, 0], [1, 0.92, 1])
      );
      cup.add(makeMesh(new THREE.CylinderGeometry(0.08, 0.12, 0.14, 16), gourdMat, [0, 0.09, 0]));
      cup.add(
        makeMesh(
          new THREE.CylinderGeometry(0.072, 0.072, 0.025, 16),
          M.waterSurface,
          [0, 0.158, 0]
        )
      );
      spout.position.set(-0.07, 0.165, 0);
    } else if (type === 'well_bucket') {
      cup.add(makeMesh(new THREE.CylinderGeometry(0.15, 0.11, 0.24, 14), M.wood, [0, 0, 0]));
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.135, 0.014, 8, 18),
          M.silver,
          [0, 0.06, 0],
          [1, 1, 1],
          [Math.PI / 2, 0, 0]
        )
      );
      cup.add(makeMesh(new THREE.TorusGeometry(0.145, 0.012, 8, 18, Math.PI), M.silver, [0, 0.11, 0]));
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.13, 0.13, 0.025, 14), M.waterSurface, [0, 0.115, 0])
      );
      spout.position.set(-0.11, 0.13, 0);
    } else if (type === 'beaker') {
      const labMat = clayMat(0xe2e8f0, 0.25, 0.08);
      cup.add(makeMesh(new THREE.ConeGeometry(0.16, 0.24, 20), labMat, [0, -0.02, 0]));
      cup.add(makeMesh(new THREE.CylinderGeometry(0.055, 0.062, 0.16, 16), labMat, [0, 0.15, 0]));
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.06, 0.012, 8, 18),
          M.gold,
          [0, 0.22, 0],
          [1, 1, 1],
          [Math.PI / 2, 0, 0]
        )
      );
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.125, 0.152, 0.09, 20), M.waterSurface, [0, -0.08, 0])
      );
      spout.position.set(-0.04, 0.24, 0);
    } else if (type === 'pitcher') {
      const ceramic = clayMat(0xfef3c7, 0.3, 0.06);
      cup.add(
        makeMesh(new THREE.SphereGeometry(0.18, 20, 16), ceramic, [0, -0.03, 0], [0.95, 1.05, 0.95])
      );
      cup.add(makeMesh(new THREE.CylinderGeometry(0.11, 0.09, 0.16, 18), ceramic, [0, 0.15, 0]));
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.105, 0.016, 10, 20),
          M.gold,
          [0, 0.22, 0],
          [1, 1, 1],
          [Math.PI / 2, 0, 0]
        )
      );
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.11, 0.022, 10, 18, Math.PI),
          M.gold,
          [0.16, 0.03, 0],
          [1, 1, 1],
          [0, 0, -Math.PI / 2]
        )
      );
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.095, 0.095, 0.025, 16), M.waterSurface, [0, 0.22, 0])
      );
      spout.position.set(-0.1, 0.23, 0);
    } else if (type === 'mini_cup') {
      const cupMat = clayMat(0xfde68a, 0.35);
      cup.add(makeMesh(new THREE.CylinderGeometry(0.095, 0.075, 0.16, 14), cupMat, [0, 0, 0]));
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.082, 0.082, 0.02, 14), M.waterSurface, [0, 0.078, 0])
      );
      spout.position.set(-0.06, 0.09, 0);
    } else if (type === 'royal_chalice') {
      cup.add(makeMesh(new THREE.CylinderGeometry(0.17, 0.06, 0.22, 20), M.goldBright, [0, 0.1, 0]));
      cup.add(makeMesh(new THREE.CylinderGeometry(0.036, 0.04, 0.16, 14), M.gold, [0, -0.06, 0]));
      cup.add(makeMesh(new THREE.CylinderGeometry(0.1, 0.12, 0.045, 18), M.goldBright, [0, -0.15, 0]));
      const gemMat = clayMat(0xe11d48, 0.16, 0.2, 0x9f1239, 0.3);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        cup.add(
          makeMesh(new THREE.OctahedronGeometry(0.028), gemMat, [
            Math.cos(a) * 0.145,
            0.11,
            Math.sin(a) * 0.145,
          ])
        );
      }
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 20), M.waterSurface, [0, 0.2, 0])
      );
      spout.position.set(-0.12, 0.21, 0);
    } else {
      cup.add(makeMesh(new THREE.CylinderGeometry(0.32, 0.2, 0.22, 22), M.stone, [0, 0.24, 0]));
      cup.add(makeMesh(new THREE.CylinderGeometry(0.12, 0.18, 0.22, 18), M.stone, [0, 0.06, 0]));
      cup.add(
        makeMesh(
          new THREE.TorusGeometry(0.31, 0.024, 10, 24),
          M.gold,
          [0, 0.34, 0],
          [1, 1, 1],
          [Math.PI / 2, 0, 0]
        )
      );
      cup.add(
        makeMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 22), M.waterSurface, [0, 0.335, 0])
      );
      spout.position.set(0, 0.36, 0);
    }

    return { cup, spout };
  };

  const root = new THREE.Group();
  root.name = `GotaViva_${mascotId}`;

  const bodyGroup = new THREE.Group();
  const headGroup = new THREE.Group();
  const armGroup = new THREE.Group();
  const mouthMarker = new THREE.Object3D();

  root.add(bodyGroup);

  let spoutMarker = new THREE.Object3D();
  let cupGroup = new THREE.Group();
  const special: Character3DSpecial = {};

  // -------------------------------------------------------------------------
  // 01. GNOMO RABUGENTO
  // -------------------------------------------------------------------------
  if (key3D === 'gnomo') {
    const tunic = clayMat(0x1e3a8a, 0.56);
    const hatRed = clayMat(0xdc2626, 0.48);
    const skin = clayMat(0xf5c2a3, 0.48);
    const nosePink = clayMat(0xf08c84, 0.42);
    const beardWhite = clayMat(0xf8fafc, 0.62);
    const bootMat = clayMat(0x3f2414, 0.65);

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.17, 18, 14), bootMat, [-0.24, 0.13, 0.08], [1.0, 0.72, 1.35])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.17, 18, 14), bootMat, [0.24, 0.13, 0.08], [1.0, 0.72, 1.35])
    );

    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.42, 0.54, 0.78, 24), tunic, [0, 0.56, 0]));
    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.5, 0.52, 0.11, 24), M.woodDark, [0, 0.44, 0]));
    bodyGroup.add(makeMesh(new THREE.BoxGeometry(0.18, 0.14, 0.07), M.goldBright, [0, 0.44, 0.5]));

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.11, 0.28, 8, 14),
        tunic,
        [-0.52, 0.66, 0.04],
        [1, 1, 1],
        [0.2, 0, 0.45]
      )
    );
    bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.11, 14, 12), skin, [-0.58, 0.48, 0.14]));

    headGroup.position.set(0, 1.04, 0);
    bodyGroup.add(headGroup);

    headGroup.add(makeMesh(new THREE.SphereGeometry(0.38, 24, 20), skin, [0, 0.08, 0]));

    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.44, 0.72, 20),
        beardWhite,
        [0, -0.34, 0.18],
        [1.05, 1, 0.78],
        [Math.PI, 0, 0]
      )
    );
    headGroup.add(makeMesh(new THREE.SphereGeometry(0.24, 16, 14), beardWhite, [-0.21, -0.14, 0.24]));
    headGroup.add(makeMesh(new THREE.SphereGeometry(0.24, 16, 14), beardWhite, [0.21, -0.14, 0.24]));
    headGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.085, 0.2, 8, 12),
        beardWhite,
        [-0.14, -0.05, 0.36],
        [1, 1, 0.8],
        [0, 0, 1.25]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.085, 0.2, 8, 12),
        beardWhite,
        [0.14, -0.05, 0.36],
        [1, 1, 0.8],
        [0, 0, -1.25]
      )
    );

    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.145, 20, 16), nosePink, [0, 0.07, 0.38], [1.1, 0.92, 0.95])
    );

    const eL = makeEye(0.068, true);
    eL.position.set(-0.15, 0.15, 0.32);
    headGroup.add(eL);
    const eR = makeEye(0.068, true);
    eR.position.set(0.15, 0.15, 0.32);
    headGroup.add(eR);
    headGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.042, 0.15, 6, 10),
        beardWhite,
        [-0.15, 0.24, 0.35],
        [1, 1, 0.75],
        [0, 0, 1.22]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.042, 0.15, 6, 10),
        beardWhite,
        [0.15, 0.24, 0.35],
        [1, 1, 0.75],
        [0, 0, -1.22]
      )
    );

    headGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.41, 0.085, 12, 26),
        hatRed,
        [0, 0.3, -0.02],
        [1, 1, 0.7],
        [Math.PI / 2 - 0.12, 0, 0]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.42, 1.02, 24),
        hatRed,
        [0, 0.78, -0.08],
        [1, 1, 1],
        [-0.14, 0, 0.06]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.37, 0.036, 10, 24),
        M.woodDark,
        [0, 0.39, -0.02],
        [1, 1, 1],
        [Math.PI / 2 - 0.12, 0, 0]
      )
    );
    headGroup.add(makeMesh(new THREE.BoxGeometry(0.14, 0.12, 0.06), M.goldBright, [0, 0.41, 0.35]));

    mouthMarker.position.set(0, -0.09, 0.38);
    headGroup.add(mouthMarker);

    armGroup.position.set(0.46, 0.8, 0.08);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.105, 0.28, 8, 14),
        tunic,
        [0.1, -0.14, 0.14],
        [1, 1, 1],
        [0.65, 0, -0.25]
      )
    );
    armGroup.add(makeMesh(new THREE.SphereGeometry(0.105, 14, 12), skin, [0.16, -0.24, 0.28]));

    const v = createVessel('wood_mug');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.16, -0.14, 0.44);
    armGroup.add(cupGroup);
  }

  // -------------------------------------------------------------------------
  // 02. SAPO MAGO
  // -------------------------------------------------------------------------
  else if (key3D === 'sapo') {
    const green = clayMat(0x10b981, 0.46);
    const belly = clayMat(0xa7f3d0, 0.55);
    const wizBlue = clayMat(0x1e3a8a, 0.5);
    const capePurple = clayMat(0x6d28d9, 0.55);

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.24, 18, 14), green, [-0.46, 0.16, -0.02], [1.1, 0.65, 1.35])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.24, 18, 14), green, [0.46, 0.16, -0.02], [1.1, 0.65, 1.35])
    );

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.62, 26, 22), green, [0, 0.56, 0], [1.08, 0.9, 0.98])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.46, 22, 18), belly, [0, 0.52, 0.26], [1.0, 0.88, 0.72])
    );

    bodyGroup.add(
      makeMesh(
        new THREE.CylinderGeometry(0.42, 0.66, 0.66, 20, 1, false, Math.PI * 0.25, Math.PI * 1.5),
        capePurple,
        [0, 0.58, -0.08]
      )
    );
    bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.08, 14, 12), M.goldBright, [0, 0.9, 0.44]));

    const throat = makeMesh(
      new THREE.SphereGeometry(0.26, 20, 16),
      belly,
      [0, 0.84, 0.45],
      [1.15, 0.75, 0.85]
    );
    bodyGroup.add(throat);
    special.frogThroat = throat;

    headGroup.position.set(0, 0.98, 0.04);
    bodyGroup.add(headGroup);
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.5, 24, 20), green, [0, 0.08, 0.04], [1.18, 0.72, 1.0])
    );

    [-0.28, 0.28].forEach((x) => {
      headGroup.add(makeMesh(new THREE.SphereGeometry(0.2, 18, 16), green, [x, 0.36, 0.14]));
      const eye = makeEye(0.14, true, 0x0f172a);
      eye.position.set(x, 0.37, 0.25);
      headGroup.add(eye);
    });
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.08, 12, 10), M.blush, [-0.38, 0.04, 0.36], [1.2, 0.7, 0.5])
    );
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.08, 12, 10), M.blush, [0.38, 0.04, 0.36], [1.2, 0.7, 0.5])
    );
    headGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.22, 0.022, 8, 20, Math.PI),
        clayMat(0x064e3b, 0.5),
        [0, 0.04, 0.48],
        [1, 0.5, 1],
        [0, 0, Math.PI]
      )
    );

    const hat = new THREE.Group();
    hat.position.set(0.04, 0.44, -0.02);
    hat.rotation.z = -0.18;
    hat.add(makeMesh(new THREE.CylinderGeometry(0.56, 0.58, 0.06, 24), wizBlue, [0, 0, 0]));
    hat.add(
      makeMesh(
        new THREE.ConeGeometry(0.36, 0.72, 22),
        wizBlue,
        [0, 0.36, -0.02],
        [1, 1, 1],
        [-0.15, 0, -0.1]
      )
    );
    hat.add(makeMesh(new THREE.OctahedronGeometry(0.055), M.goldBright, [0.14, 0.3, 0.22]));
    hat.add(makeMesh(new THREE.OctahedronGeometry(0.045), M.goldBright, [-0.15, 0.46, 0.14]));
    hat.add(makeMesh(new THREE.OctahedronGeometry(0.04), M.goldBright, [0.02, 0.16, 0.32]));
    headGroup.add(hat);

    mouthMarker.position.set(0, -0.02, 0.52);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.1, 0.25, 8, 12),
        green,
        [-0.54, 0.6, 0.18],
        [1, 1, 1],
        [0.4, 0, 0.5]
      )
    );

    armGroup.position.set(0.5, 0.72, 0.14);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.1, 0.25, 8, 12),
        green,
        [0.08, -0.12, 0.18],
        [1, 1, 1],
        [0.7, 0, -0.2]
      )
    );

    const v = createVessel('chalice');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.12, -0.06, 0.38);
    armGroup.add(cupGroup);
  }

  // -------------------------------------------------------------------------
  // 03. COGUMELO VIVO
  // -------------------------------------------------------------------------
  else if (key3D === 'cogumelo') {
    const stem = clayMat(0xfef3c7, 0.55);
    const capRed = clayMat(0xe11d48, 0.34);
    const spotWhite = clayMat(0xffffff, 0.42);
    const underCap = clayMat(0xfde68a, 0.65);

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.16, 16, 12), stem, [-0.2, 0.11, 0.06], [1, 0.7, 1.2])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.16, 16, 12), stem, [0.2, 0.11, 0.06], [1, 0.7, 1.2])
    );
    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.36, 0.48, 0.88, 24), stem, [0, 0.56, 0]));

    headGroup.position.set(0, 0.96, 0);
    bodyGroup.add(headGroup);

    headGroup.add(makeMesh(new THREE.CylinderGeometry(0.76, 0.38, 0.14, 28), underCap, [0, 0.16, 0]));
    headGroup.add(
      makeMesh(
        new THREE.SphereGeometry(0.8, 28, 22, 0, Math.PI * 2, 0, Math.PI * 0.55),
        capRed,
        [0, 0.14, 0],
        [1.04, 0.86, 1.04]
      )
    );

    const spots: Array<[number, number, number, number]> = [
      [0, 0.78, 0.16, 0.14],
      [-0.45, 0.56, 0.46, 0.13],
      [0.48, 0.52, 0.42, 0.12],
      [-0.58, 0.36, -0.34, 0.13],
      [0.54, 0.42, -0.38, 0.14],
      [0.05, 0.58, -0.58, 0.13],
      [-0.12, 0.36, 0.7, 0.1],
    ];
    spots.forEach(([x, y, z, r]) => {
      headGroup.add(makeMesh(new THREE.SphereGeometry(r, 16, 12), spotWhite, [x, y, z], [1, 0.72, 1]));
    });

    [-0.16, 0.16].forEach((x) => {
      const eye = makeEye(0.072, false);
      eye.position.set(x, -0.14, 0.38);
      headGroup.add(eye);
      headGroup.add(
        makeMesh(
          new THREE.SphereGeometry(0.082, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.52),
          stem,
          [x, -0.12, 0.39],
          [1.1, 0.9, 1.0],
          [0.2, 0, 0]
        )
      );
    });
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.065, 12, 10), M.blush, [-0.26, -0.22, 0.36], [1.2, 0.7, 0.5])
    );
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.065, 12, 10), M.blush, [0.26, -0.22, 0.36], [1.2, 0.7, 0.5])
    );
    headGroup.add(
      makeMesh(
        new THREE.SphereGeometry(0.045, 12, 10),
        clayMat(0x7c2d12, 0.5),
        [0, -0.24, 0.4],
        [1, 1.2, 0.6]
      )
    );

    mouthMarker.position.set(0, -0.24, 0.44);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.085, 0.18, 8, 12),
        stem,
        [-0.46, 0.6, 0.1],
        [1, 1, 1],
        [0.2, 0, 0.6]
      )
    );

    armGroup.position.set(0.42, 0.64, 0.14);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.085, 0.18, 8, 12),
        stem,
        [0.06, -0.08, 0.14],
        [1, 1, 1],
        [0.6, 0, -0.3]
      )
    );

    const v = createVessel('leaf_straw');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.06, -0.05, 0.3);
    armGroup.add(cupGroup);
    special.isStraw = true;
  }

  // -------------------------------------------------------------------------
  // 04. GOBLIN DO CAFÉ
  // -------------------------------------------------------------------------
  else if (key3D === 'goblin') {
    const skin = clayMat(0x65a30d, 0.5);
    const bags = clayMat(0x6b21a8, 0.58);
    const vest = clayMat(0x78350f, 0.64);
    const pants = clayMat(0x292524, 0.68);

    bodyGroup.add(makeMesh(new THREE.CapsuleGeometry(0.1, 0.22, 8, 12), pants, [-0.18, 0.18, 0]));
    bodyGroup.add(makeMesh(new THREE.CapsuleGeometry(0.1, 0.22, 8, 12), pants, [0.18, 0.18, 0]));
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.4, 22, 18), vest, [0, 0.58, 0], [0.95, 1.05, 0.85])
    );
    bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.04, 10, 10), M.gold, [0, 0.66, 0.34]));
    bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.04, 10, 10), M.gold, [0, 0.5, 0.35]));

    headGroup.position.set(0, 1.08, 0);
    bodyGroup.add(headGroup);
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.4, 24, 20), skin, [0, 0.08, 0], [1.06, 0.94, 0.95])
    );

    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.15, 0.64, 14),
        skin,
        [-0.56, 0.14, -0.02],
        [1, 1, 0.5],
        [0, 0, 1.32]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.15, 0.64, 14),
        skin,
        [0.56, 0.14, -0.02],
        [1, 1, 0.5],
        [0, 0, -1.32]
      )
    );

    [-0.16, 0.16].forEach((x) => {
      headGroup.add(
        makeMesh(
          new THREE.TorusGeometry(0.11, 0.036, 10, 18),
          bags,
          [x, 0.1, 0.31],
          [1.1, 0.95, 0.7]
        )
      );
      const eye = makeEye(0.105, true);
      eye.position.set(x, 0.13, 0.33);
      headGroup.add(eye);
    });
    headGroup.add(
      makeMesh(new THREE.ConeGeometry(0.065, 0.18, 12), skin, [0, 0.05, 0.44], [1, 1, 1], [1.25, 0, 0])
    );
    headGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.15, 0.022, 8, 18, Math.PI),
        clayMat(0x1c1917, 0.5),
        [0, -0.05, 0.36],
        [1, 0.65, 1],
        [0, 0, Math.PI]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.028, 0.07, 8),
        M.eyeWhite,
        [-0.08, -0.1, 0.38],
        [1, 1, 1],
        [Math.PI, 0, 0]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.028, 0.07, 8),
        M.eyeWhite,
        [0.08, -0.1, 0.38],
        [1, 1, 1],
        [Math.PI, 0, 0]
      )
    );

    mouthMarker.position.set(0, -0.08, 0.42);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.08, 0.28, 8, 12),
        skin,
        [-0.46, 0.64, 0.08],
        [1, 1, 1],
        [0.2, 0, 0.45]
      )
    );

    armGroup.position.set(0.42, 0.72, 0.1);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.08, 0.28, 8, 12),
        skin,
        [0.1, -0.12, 0.18],
        [1, 1, 1],
        [0.65, 0, -0.25]
      )
    );

    const v = createVessel('giant_mug');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.14, -0.08, 0.42);
    armGroup.add(cupGroup);
    special.isJittery = true;
  }

  // -------------------------------------------------------------------------
  // 05. NESSIE (LAGO NESS)
  // -------------------------------------------------------------------------
  else if (key3D === 'nessie') {
    const teal = clayMat(0x0d9488, 0.42);
    const belly = clayMat(0x99f6e4, 0.5);
    const ridge = clayMat(0x115e59, 0.46);

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.56, 26, 20), teal, [0, 0.46, -0.12], [0.95, 0.76, 1.32])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.42, 20, 16), belly, [0, 0.38, -0.08], [0.92, 0.64, 1.2])
    );
    bodyGroup.add(
      makeMesh(new THREE.ConeGeometry(0.24, 0.65, 16), teal, [0, 0.38, -0.96], [1, 1, 1], [-1.35, 0, 0])
    );

    const flippers: Array<[number, number, number, number]> = [
      [-0.56, 0.18, 0.18, 0.3],
      [0.56, 0.18, 0.18, -0.3],
      [-0.52, 0.16, -0.45, 0.4],
      [0.52, 0.16, -0.45, -0.4],
    ];
    flippers.forEach(([x, y, z, rz]) => {
      bodyGroup.add(
        makeMesh(new THREE.SphereGeometry(0.24, 16, 12), teal, [x, y, z], [1.4, 0.32, 0.82], [0, 0, rz])
      );
    });

    headGroup.position.set(0, 0.68, 0.34);
    bodyGroup.add(headGroup);

    const neckPts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.38, 0.14),
      new THREE.Vector3(0, 0.8, 0.04),
      new THREE.Vector3(0, 1.15, 0.14),
    ];
    const neckCurve = new THREE.CatmullRomCurve3(neckPts);
    headGroup.add(makeMesh(new THREE.TubeGeometry(neckCurve, 24, 0.145, 16, false), teal));

    [0.2, 0.45, 0.7].forEach((t) => {
      const p = neckCurve.getPoint(t);
      headGroup.add(
        makeMesh(new THREE.ConeGeometry(0.06, 0.15, 10), ridge, [0, p.y, p.z - 0.15], [1, 1, 1], [-1.3, 0, 0])
      );
    });

    const gulpBulge = makeMesh(
      new THREE.SphereGeometry(0.21, 18, 16),
      clayMat(0x2dd4bf, 0.38),
      [0, 0.9, 0.1]
    );
    gulpBulge.visible = false;
    headGroup.add(gulpBulge);
    special.nessieCurve = neckCurve;
    special.nessieGulp = gulpBulge;

    const snoutGroup = new THREE.Group();
    snoutGroup.position.set(0, 1.18, 0.18);
    headGroup.add(snoutGroup);
    snoutGroup.add(
      makeMesh(new THREE.SphereGeometry(0.22, 20, 16), teal, [0, 0, 0], [1.0, 0.92, 1.25])
    );
    snoutGroup.add(
      makeMesh(new THREE.SphereGeometry(0.15, 16, 14), teal, [0, -0.04, 0.2], [1.1, 0.78, 1.0])
    );
    const eL = makeEye(0.055, true);
    eL.position.set(-0.14, 0.06, 0.14);
    snoutGroup.add(eL);
    const eR = makeEye(0.055, true);
    eR.position.set(0.14, 0.06, 0.14);
    snoutGroup.add(eR);

    mouthMarker.position.set(0, -0.09, 0.3);
    snoutGroup.add(mouthMarker);

    const v = createVessel('basin');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0, 0.02, 0.95);
    root.add(cupGroup);
    special.isNessie = true;
  }

  // -------------------------------------------------------------------------
  // 06. YETI GELADO
  // -------------------------------------------------------------------------
  else if (key3D === 'yeti') {
    const fur = clayMat(0xf1f5f9, 0.66);
    const iceFace = clayMat(0x7dd3fc, 0.44);
    const hornMat = clayMat(0x94a3b8, 0.42);

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.22, 16, 12), iceFace, [-0.3, 0.14, 0.1], [1.1, 0.65, 1.35])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.22, 16, 12), iceFace, [0.3, 0.14, 0.1], [1.1, 0.65, 1.35])
    );

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.68, 26, 22), fur, [0, 0.74, 0], [1.14, 1.02, 0.92])
    );
    const tufts: Array<[number, number, number]> = [
      [-0.56, 1.05, 0.04],
      [0.56, 1.05, 0.04],
      [-0.42, 0.56, 0.42],
      [0.42, 0.56, 0.42],
      [0, 0.94, 0.46],
    ];
    tufts.forEach(([x, y, z]) => {
      bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.22, 14, 12), fur, [x, y, z]));
    });

    headGroup.position.set(0, 1.24, 0.05);
    bodyGroup.add(headGroup);
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.45, 22, 18), fur, [0, 0.08, -0.02], [1.08, 0.96, 0.96])
    );
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.32, 20, 16), iceFace, [0, 0.04, 0.24], [1.05, 0.88, 0.72])
    );

    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.085, 0.3, 12),
        hornMat,
        [-0.32, 0.42, 0.04],
        [1, 1, 1],
        [0.1, 0, 0.48]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.085, 0.3, 12),
        hornMat,
        [0.32, 0.42, 0.04],
        [1, 1, 1],
        [0.1, 0, -0.48]
      )
    );

    const eL = makeEye(0.072, true);
    eL.position.set(-0.14, 0.14, 0.42);
    headGroup.add(eL);
    const eR = makeEye(0.072, true);
    eR.position.set(0.14, 0.14, 0.42);
    headGroup.add(eR);
    headGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.15, 0.024, 8, 18, Math.PI),
        clayMat(0x0c4a6e, 0.5),
        [0, -0.04, 0.43],
        [1, 0.7, 1],
        [0, 0, Math.PI]
      )
    );
    headGroup.add(makeMesh(new THREE.BoxGeometry(0.06, 0.075, 0.04), M.eyeWhite, [0.05, -0.1, 0.45]));

    mouthMarker.position.set(0, -0.08, 0.47);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.17, 0.42, 8, 14),
        fur,
        [-0.74, 0.72, 0.06],
        [1, 1, 1],
        [0.15, 0, 0.28]
      )
    );
    bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.16, 14, 12), iceFace, [-0.82, 0.46, 0.16]));

    armGroup.position.set(0.68, 0.94, 0.08);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.16, 0.4, 8, 14),
        fur,
        [0.1, -0.22, 0.16],
        [1, 1, 1],
        [0.65, 0, -0.18]
      )
    );
    armGroup.add(makeMesh(new THREE.SphereGeometry(0.15, 14, 12), iceFace, [0.14, -0.34, 0.34]));

    const v = createVessel('ice_mug');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.14, -0.2, 0.52);
    armGroup.add(cupGroup);
  }

  // -------------------------------------------------------------------------
  // 07. ET DE VARGINHA
  // -------------------------------------------------------------------------
  else if (key3D === 'et') {
    const skin = clayMat(0x8c5a3c, 0.46);
    const ridgeMat = clayMat(0x71432a, 0.42);
    const redEye = clayMat(0xef4444, 0.1, 0.12, 0x991b1b, 0.45);

    bodyGroup.add(makeMesh(new THREE.CapsuleGeometry(0.075, 0.36, 8, 12), skin, [-0.14, 0.24, 0]));
    bodyGroup.add(makeMesh(new THREE.CapsuleGeometry(0.075, 0.36, 8, 12), skin, [0.14, 0.24, 0]));
    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.18, 0.24, 0.62, 20), skin, [0, 0.68, 0]));

    headGroup.position.set(0, 1.12, 0);
    bodyGroup.add(headGroup);
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.46, 26, 22), skin, [0, 0.24, 0.02], [1.04, 1.18, 1.08])
    );

    [-0.22, 0, 0.22].forEach((x, idx) => {
      const h = idx === 1 ? 0.24 : 0.19;
      headGroup.add(
        makeMesh(
          new THREE.CapsuleGeometry(0.075, h, 8, 12),
          ridgeMat,
          [x, 0.68, -0.02],
          [0.85, 1.0, 1.6],
          [0.22, 0, x * -0.45]
        )
      );
    });

    [-0.19, 0.19].forEach((x, idx) => {
      const eyeGrp = new THREE.Group();
      eyeGrp.position.set(x, 0.22, 0.38);
      eyeGrp.rotation.z = idx === 0 ? -0.32 : 0.32;
      eyeGrp.add(makeMesh(new THREE.SphereGeometry(0.13, 18, 16), redEye, [0, 0, 0], [1.28, 0.82, 0.65]));
      eyeGrp.add(makeMesh(new THREE.SphereGeometry(0.036, 10, 10), M.eyeWhite, [-0.04, 0.04, 0.078]));
      headGroup.add(eyeGrp);
    });

    headGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.018, 0.08, 6, 8),
        clayMat(0x3b1f12, 0.5),
        [0, -0.04, 0.42],
        [1, 1, 1],
        [0, 0, Math.PI / 2]
      )
    );
    mouthMarker.position.set(0, -0.04, 0.45);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.055, 0.38, 8, 12),
        skin,
        [-0.3, 0.72, 0.08],
        [1, 1, 1],
        [0.2, 0, 0.38]
      )
    );

    armGroup.position.set(0.24, 0.84, 0.08);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.055, 0.36, 8, 12),
        skin,
        [0.08, -0.14, 0.18],
        [1, 1, 1],
        [0.7, 0, -0.2]
      )
    );

    const v = createVessel('cosmic_cup');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.08, -0.08, 0.38);
    armGroup.add(cupGroup);
    special.isStraw = true;
  }

  // -------------------------------------------------------------------------
  // 08. TROLL DA PONTE
  // -------------------------------------------------------------------------
  else if (key3D === 'troll') {
    const rock = clayMat(0x64748b, 0.76);
    const rockLight = clayMat(0x94a3b8, 0.72);
    const moss = clayMat(0x16a34a, 0.75);
    const cloth = clayMat(0x78350f, 0.7);

    bodyGroup.add(makeMesh(new THREE.BoxGeometry(0.28, 0.18, 0.38), rock, [-0.28, 0.1, 0.06]));
    bodyGroup.add(makeMesh(new THREE.BoxGeometry(0.28, 0.18, 0.38), rock, [0.28, 0.1, 0.06]));
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.64, 24, 20), rock, [0, 0.64, 0], [1.14, 0.88, 1.0])
    );
    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.58, 0.56, 0.24, 20), cloth, [0, 0.38, 0]));

    const mossPos: Array<[number, number, number]> = [
      [-0.5, 1.02, 0.06],
      [-0.36, 1.08, -0.06],
      [0.48, 1.02, -0.04],
      [0.58, 0.96, 0.08],
    ];
    mossPos.forEach(([x, y, z]) => {
      bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.14, 12, 10), moss, [x, y, z], [1.2, 0.72, 1.0]));
    });

    headGroup.position.set(0, 1.08, 0.08);
    bodyGroup.add(headGroup);
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.42, 22, 18), rock, [0, 0.08, 0], [1.16, 0.88, 0.96])
    );
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.16, 18, 14), rockLight, [0, 0.08, 0.39], [1.15, 0.95, 0.95])
    );
    headGroup.add(
      makeMesh(new THREE.BoxGeometry(0.52, 0.09, 0.14), clayMat(0x334155, 0.78), [0, 0.24, 0.36])
    );

    const eL = makeEye(0.065, true, 0xd97706);
    eL.position.set(-0.15, 0.15, 0.36);
    headGroup.add(eL);
    const eR = makeEye(0.065, true, 0xd97706);
    eR.position.set(0.15, 0.15, 0.36);
    headGroup.add(eR);

    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.045, 0.14, 10),
        M.eyeWhite,
        [-0.14, -0.08, 0.39],
        [1, 1, 1],
        [0.15, 0, -0.15]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.045, 0.14, 10),
        M.eyeWhite,
        [0.14, -0.08, 0.39],
        [1, 1, 1],
        [0.15, 0, 0.15]
      )
    );

    mouthMarker.position.set(0, -0.09, 0.42);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.15, 0.36, 8, 12),
        rock,
        [-0.7, 0.62, 0.08],
        [1, 1, 1],
        [0.2, 0, 0.25]
      )
    );

    armGroup.position.set(0.64, 0.8, 0.1);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.15, 0.34, 8, 12),
        rock,
        [0.1, -0.16, 0.18],
        [1, 1, 1],
        [0.65, 0, -0.2]
      )
    );

    const v = createVessel('stone_mug');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.14, -0.14, 0.44);
    armGroup.add(cupGroup);
  }

  // -------------------------------------------------------------------------
  // 09. SACI
  // -------------------------------------------------------------------------
  else if (key3D === 'saci') {
    const skin = clayMat(0x5c3317, 0.45);
    const red = clayMat(0xdc2626, 0.44);
    const dust = clayMat(0xd6bfa2, 0.68);
    const dustLight = clayMat(0xf5e6d3, 0.62);

    const whirl = new THREE.Group();
    whirl.position.set(0, 0.04, 0);
    whirl.add(
      makeMesh(
        new THREE.TorusGeometry(0.18, 0.055, 10, 22),
        dust,
        [0, 0.06, 0],
        [1, 1, 1],
        [Math.PI / 2, 0, 0]
      )
    );
    whirl.add(
      makeMesh(
        new THREE.TorusGeometry(0.32, 0.06, 10, 24),
        dustLight,
        [0, 0.18, 0],
        [1, 1, 1],
        [Math.PI / 2 + 0.08, 0, 0]
      )
    );
    whirl.add(
      makeMesh(
        new THREE.TorusGeometry(0.46, 0.055, 10, 26),
        dust,
        [0, 0.32, 0],
        [1, 1, 1],
        [Math.PI / 2 - 0.08, 0, 0]
      )
    );
    root.add(whirl);
    special.saciWhirlwind = whirl;

    bodyGroup.position.y = 0.24;
    bodyGroup.add(makeMesh(new THREE.CapsuleGeometry(0.095, 0.36, 8, 12), skin, [0, 0.28, 0]));
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.11, 14, 12), skin, [0, 0.08, 0.06], [1, 0.65, 1.35])
    );

    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.26, 0.3, 0.26, 20), red, [0, 0.56, 0]));
    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.24, 0.26, 0.42, 20), skin, [0, 0.86, 0]));

    headGroup.position.set(0, 1.24, 0);
    bodyGroup.add(headGroup);
    headGroup.add(makeMesh(new THREE.SphereGeometry(0.34, 24, 20), skin, [0, 0.06, 0]));

    headGroup.add(
      makeMesh(
        new THREE.SphereGeometry(0.355, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.52),
        red,
        [0, 0.09, 0]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.26, 0.52, 18),
        red,
        [0.06, 0.48, -0.02],
        [1, 1, 1],
        [-0.15, 0, -0.32]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.14, 0.36, 14),
        red,
        [0.25, 0.56, 0.05],
        [1, 1, 1],
        [0.2, 0, -1.65]
      )
    );

    const eL = makeEye(0.068, true);
    eL.position.set(-0.12, 0.09, 0.3);
    headGroup.add(eL);
    const eR = makeEye(0.068, true);
    eR.position.set(0.12, 0.09, 0.3);
    headGroup.add(eR);
    headGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.11, 0.025, 8, 16, Math.PI),
        M.eyeWhite,
        [0, -0.04, 0.31],
        [1, 0.72, 1],
        [0, 0, Math.PI]
      )
    );

    mouthMarker.position.set(0, -0.07, 0.35);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.075, 0.32, 8, 12),
        skin,
        [-0.36, 0.94, 0.02],
        [1, 1, 1],
        [0, 0, 0.95]
      )
    );

    armGroup.position.set(0.28, 0.96, 0.06);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.075, 0.3, 8, 12),
        skin,
        [0.1, -0.12, 0.16],
        [1, 1, 1],
        [0.65, 0, -0.28]
      )
    );

    const v = createVessel('gourd');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.12, -0.06, 0.34);
    armGroup.add(cupGroup);
  }

  // -------------------------------------------------------------------------
  // 10. FANTASMA DO POÇO
  // -------------------------------------------------------------------------
  else if (key3D === 'fantasma') {
    const porcelain = clayMat(0xede9fe, 0.32, 0.04);
    const lavenderShadow = clayMat(0xc4b5fd, 0.42, 0.04);

    bodyGroup.position.y = 0.28;
    bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.46, 28, 22), porcelain, [0, 1.02, 0]));
    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.46, 0.56, 0.8, 28), porcelain, [0, 0.62, 0]));

    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = 0.44;
      bodyGroup.add(
        makeMesh(
          new THREE.SphereGeometry(0.18, 14, 12),
          i % 2 === 0 ? porcelain : lavenderShadow,
          [Math.cos(a) * r, 0.2, Math.sin(a) * r],
          [1, 1.15, 1]
        )
      );
    }

    headGroup.position.set(0, 1.02, 0);
    bodyGroup.add(headGroup);

    const eL = makeEye(0.095, false);
    eL.position.set(-0.17, 0.06, 0.42);
    headGroup.add(eL);
    const eR = makeEye(0.095, false);
    eR.position.set(0.17, 0.06, 0.42);
    headGroup.add(eR);
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.07, 12, 10), M.blush, [-0.28, -0.05, 0.37], [1.2, 0.7, 0.5])
    );
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.07, 12, 10), M.blush, [0.28, -0.05, 0.37], [1.2, 0.7, 0.5])
    );
    headGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.065, 0.022, 10, 18),
        clayMat(0x312e81, 0.4),
        [0, -0.1, 0.44],
        [0.85, 1.15, 0.6]
      )
    );

    mouthMarker.position.set(0, -0.1, 0.47);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.11, 0.2, 8, 12),
        porcelain,
        [-0.52, 0.78, 0.12],
        [1, 1, 1],
        [0.3, 0, 0.6]
      )
    );

    armGroup.position.set(0.46, 0.82, 0.14);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.11, 0.2, 8, 12),
        porcelain,
        [0.08, -0.06, 0.16],
        [1, 1, 1],
        [0.7, 0, -0.35]
      )
    );

    const v = createVessel('well_bucket');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.1, -0.06, 0.34);
    armGroup.add(cupGroup);
    special.isFloater = true;
  }

  // -------------------------------------------------------------------------
  // 11. MÍMICO (BAÚ VIVO)
  // -------------------------------------------------------------------------
  else if (key3D === 'mimico') {
    const chestWood = clayMat(0x5c3317, 0.58);
    const insideMouth = clayMat(0x4c0519, 0.65);
    const tonguePink = clayMat(0xf43f5e, 0.36);
    const eyeGold = clayMat(0xfacc15, 0.15, 0.2, 0xeab308, 0.55);

    bodyGroup.add(makeMesh(new THREE.BoxGeometry(1.16, 0.58, 0.78), chestWood, [0, 0.34, 0]));
    bodyGroup.add(makeMesh(new THREE.BoxGeometry(1.04, 0.14, 0.68), insideMouth, [0, 0.6, 0]));
    [-0.44, 0.44].forEach((x) => {
      bodyGroup.add(makeMesh(new THREE.BoxGeometry(0.12, 0.61, 0.82), M.gold, [x, 0.34, 0]));
    });
    bodyGroup.add(makeMesh(new THREE.BoxGeometry(0.22, 0.24, 0.08), M.goldBright, [0, 0.52, 0.41]));
    bodyGroup.add(makeMesh(new THREE.BoxGeometry(0.05, 0.1, 0.09), M.eyeDark, [0, 0.5, 0.42]));

    for (let i = -3; i <= 3; i++) {
      bodyGroup.add(makeMesh(new THREE.ConeGeometry(0.055, 0.14, 8), M.eyeWhite, [i * 0.14, 0.68, 0.32]));
    }

    const tonguePts = [
      new THREE.Vector3(0, 0.62, 0.05),
      new THREE.Vector3(0, 0.65, 0.42),
      new THREE.Vector3(0.06, 0.54, 0.62),
      new THREE.Vector3(-0.04, 0.42, 0.58),
    ];
    const tongue = makeMesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tonguePts), 22, 0.085, 12, false),
      tonguePink
    );
    bodyGroup.add(tongue);
    special.mimicTongue = tongue;

    [-0.22, 0.22].forEach((x) => {
      bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.09, 16, 14), eyeGold, [x, 0.72, 0.2]));
      bodyGroup.add(makeMesh(new THREE.SphereGeometry(0.04, 10, 10), M.eyeDark, [x, 0.72, 0.28]));
    });

    headGroup.position.set(0, 0.63, -0.39);
    bodyGroup.add(headGroup);

    const lidGeo = new THREE.CylinderGeometry(0.39, 0.39, 1.16, 20, 1, false, 0, Math.PI);
    lidGeo.rotateZ(Math.PI / 2);
    headGroup.add(makeMesh(lidGeo, chestWood, [0, 0, 0.39]));
    [-0.44, 0.44].forEach((x) => {
      const strapGeo = new THREE.CylinderGeometry(0.41, 0.41, 0.12, 20, 1, false, 0, Math.PI);
      strapGeo.rotateZ(Math.PI / 2);
      headGroup.add(makeMesh(strapGeo, M.gold, [x, 0, 0.39]));
    });
    for (let i = -3; i <= 3; i++) {
      headGroup.add(
        makeMesh(
          new THREE.ConeGeometry(0.052, 0.14, 8),
          M.eyeWhite,
          [i * 0.14, -0.05, 0.72],
          [1, 1, 1],
          [Math.PI, 0, 0]
        )
      );
    }
    headGroup.rotation.x = -0.38;

    mouthMarker.position.set(0, 0.68, 0.18);
    bodyGroup.add(mouthMarker);

    armGroup.position.set(0.82, 1.15, 0.36);
    root.add(armGroup);
    const v = createVessel('pitcher');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    armGroup.add(cupGroup);
    special.isMimic = true;
  }

  // -------------------------------------------------------------------------
  // 12. CORUJA ALQUIMISTA
  // -------------------------------------------------------------------------
  else if (key3D === 'coruja') {
    const brown = clayMat(0x78350f, 0.56);
    const cream = clayMat(0xfef3c7, 0.58);
    const scarf = clayMat(0x991b1b, 0.62);
    const beak = clayMat(0xf59e0b, 0.38);

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.11, 12, 10), beak, [-0.2, 0.08, 0.14], [1.1, 0.55, 1.4])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.11, 12, 10), beak, [0.2, 0.08, 0.14], [1.1, 0.55, 1.4])
    );

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.56, 26, 22), brown, [0, 0.62, 0], [1.0, 1.08, 0.94])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.42, 22, 18), cream, [0, 0.56, 0.24], [0.95, 0.98, 0.65])
    );
    bodyGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.42, 0.095, 12, 24),
        scarf,
        [0, 0.98, 0.02],
        [1, 1, 0.85],
        [Math.PI / 2, 0, 0]
      )
    );
    bodyGroup.add(
      makeMesh(new THREE.BoxGeometry(0.16, 0.34, 0.06), scarf, [-0.22, 0.78, 0.44], [1, 1, 1], [0, 0, 0.12])
    );

    bodyGroup.add(
      makeMesh(
        new THREE.SphereGeometry(0.24, 16, 14),
        brown,
        [-0.54, 0.64, -0.02],
        [0.55, 1.35, 0.92],
        [0, 0, 0.22]
      )
    );

    headGroup.position.set(0, 1.24, 0.02);
    bodyGroup.add(headGroup);
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.42, 24, 20), brown, [0, 0.08, 0], [1.08, 0.94, 0.94])
    );
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.22, 18, 14), cream, [-0.16, 0.08, 0.28], [1, 1, 0.55])
    );
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.22, 18, 14), cream, [0.16, 0.08, 0.28], [1, 1, 0.55])
    );

    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.12, 0.32, 12),
        brown,
        [-0.34, 0.44, 0],
        [1, 1, 0.6],
        [0, 0, 0.45]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.12, 0.32, 12),
        brown,
        [0.34, 0.44, 0],
        [1, 1, 0.6],
        [0, 0, -0.45]
      )
    );

    const eL = makeEye(0.095, true, 0xd97706);
    eL.position.set(-0.16, 0.1, 0.35);
    headGroup.add(eL);
    const eR = makeEye(0.095, true, 0xd97706);
    eR.position.set(0.16, 0.1, 0.35);
    headGroup.add(eR);
    headGroup.add(makeMesh(new THREE.TorusGeometry(0.135, 0.02, 10, 22), M.goldBright, [0.16, 0.1, 0.42]));
    headGroup.add(
      makeMesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.26, 8),
        M.gold,
        [0.29, -0.02, 0.39],
        [1, 1, 1],
        [0, 0, -0.15]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.028, 0.15, 6, 8),
        brown,
        [0.16, 0.26, 0.4],
        [1, 1, 1],
        [0, 0, 1.38]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.028, 0.15, 6, 8),
        brown,
        [-0.16, 0.22, 0.4],
        [1, 1, 1],
        [0, 0, 1.65]
      )
    );

    headGroup.add(
      makeMesh(new THREE.ConeGeometry(0.08, 0.18, 12), beak, [0, -0.02, 0.44], [1, 1, 1], [1.65, 0, 0])
    );
    mouthMarker.position.set(0, -0.05, 0.48);
    headGroup.add(mouthMarker);

    armGroup.position.set(0.48, 0.78, 0.12);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.SphereGeometry(0.2, 16, 14),
        brown,
        [0.1, -0.1, 0.14],
        [0.55, 1.15, 0.85],
        [0.5, 0, -0.3]
      )
    );

    const v = createVessel('beaker');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.1, -0.04, 0.34);
    armGroup.add(cupGroup);
  }

  // -------------------------------------------------------------------------
  // 13. DRAGÃO BEBÊ GORDINHO
  // -------------------------------------------------------------------------
  else if (key3D === 'dragao') {
    const emerald = clayMat(0x059669, 0.42);
    const bellyGold = clayMat(0xfbbf24, 0.45);
    const wingMat = clayMat(0x047857, 0.48);

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.2, 16, 14), emerald, [-0.36, 0.16, 0.14], [1, 0.75, 1.2])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.2, 16, 14), emerald, [0.36, 0.16, 0.14], [1, 0.75, 1.2])
    );

    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.6, 26, 22), emerald, [0, 0.58, 0], [1.04, 0.96, 1.02])
    );
    bodyGroup.add(
      makeMesh(new THREE.SphereGeometry(0.45, 22, 18), bellyGold, [0, 0.54, 0.26], [0.96, 0.9, 0.72])
    );

    bodyGroup.add(
      makeMesh(new THREE.ConeGeometry(0.18, 0.62, 14), emerald, [0, 0.34, -0.76], [1, 1, 1], [-1.25, 0, 0])
    );
    bodyGroup.add(makeMesh(new THREE.OctahedronGeometry(0.12), M.goldBright, [0, 0.42, -1.06]));

    const wingL = makeMesh(
      new THREE.BoxGeometry(0.34, 0.24, 0.06),
      wingMat,
      [-0.46, 0.88, -0.34],
      [1, 1, 1],
      [0.2, 0.45, 0.35]
    );
    const wingR = makeMesh(
      new THREE.BoxGeometry(0.34, 0.24, 0.06),
      wingMat,
      [0.46, 0.88, -0.34],
      [1, 1, 1],
      [0.2, -0.45, -0.35]
    );
    bodyGroup.add(wingL, wingR);
    special.dragonWings = [wingL, wingR];

    headGroup.position.set(0, 1.14, 0.1);
    bodyGroup.add(headGroup);
    headGroup.add(makeMesh(new THREE.SphereGeometry(0.38, 24, 20), emerald, [0, 0.08, 0]));
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.24, 18, 16), emerald, [0, 0.01, 0.3], [1.18, 0.8, 0.92])
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.068, 0.26, 12),
        M.goldBright,
        [-0.2, 0.42, -0.04],
        [1, 1, 1],
        [-0.15, 0, 0.28]
      )
    );
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.068, 0.26, 12),
        M.goldBright,
        [0.2, 0.42, -0.04],
        [1, 1, 1],
        [-0.15, 0, -0.28]
      )
    );

    const eL = makeEye(0.085, true);
    eL.position.set(-0.17, 0.16, 0.31);
    headGroup.add(eL);
    const eR = makeEye(0.085, true);
    eR.position.set(0.17, 0.16, 0.31);
    headGroup.add(eR);
    headGroup.add(makeMesh(new THREE.SphereGeometry(0.025, 8, 8), clayMat(0x064e3b), [-0.08, 0.06, 0.49]));
    headGroup.add(makeMesh(new THREE.SphereGeometry(0.025, 8, 8), clayMat(0x064e3b), [0.08, 0.06, 0.49]));

    mouthMarker.position.set(0, -0.06, 0.48);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.095, 0.22, 8, 12),
        emerald,
        [-0.52, 0.72, 0.18],
        [1, 1, 1],
        [0.4, 0, 0.45]
      )
    );

    armGroup.position.set(0.48, 0.78, 0.18);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.095, 0.22, 8, 12),
        emerald,
        [0.08, -0.1, 0.18],
        [1, 1, 1],
        [0.7, 0, -0.25]
      )
    );

    const v = createVessel('royal_chalice');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.1, -0.06, 0.38);
    armGroup.add(cupGroup);
    special.isDragon = true;
  }

  // -------------------------------------------------------------------------
  // 14. GÊNIO DA LÂMPADA
  // -------------------------------------------------------------------------
  else if (key3D === 'genio') {
    const blue = clayMat(0x2563eb, 0.38);
    const blueTail = clayMat(0x3b82f6, 0.36);
    const turban = clayMat(0xf8fafc, 0.44);
    const beard = clayMat(0x0f172a, 0.48);
    const gemRed = clayMat(0xe11d48, 0.16, 0.2, 0x9f1239, 0.4);

    const lamp = new THREE.Group();
    lamp.position.set(0, 0.14, 0);
    lamp.add(
      makeMesh(new THREE.SphereGeometry(0.3, 22, 16), M.goldBright, [0, 0.05, 0], [1.45, 0.65, 0.92])
    );
    lamp.add(makeMesh(new THREE.CylinderGeometry(0.18, 0.22, 0.08, 18), M.gold, [0, -0.1, 0]));
    lamp.add(
      makeMesh(
        new THREE.ConeGeometry(0.1, 0.36, 14),
        M.goldBright,
        [0.44, 0.14, 0],
        [1, 1, 1],
        [0, 0, -1.15]
      )
    );
    lamp.add(makeMesh(new THREE.TorusGeometry(0.13, 0.028, 10, 18), M.gold, [-0.42, 0.12, 0]));
    root.add(lamp);

    bodyGroup.add(
      makeMesh(new THREE.ConeGeometry(0.32, 0.58, 22), blueTail, [0, 0.46, 0], [1, 1, 1], [Math.PI, 0, 0])
    );
    bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.46, 0.28, 0.56, 22), blue, [0, 0.96, 0]));
    bodyGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.3, 0.075, 12, 22),
        clayMat(0xdc2626, 0.5),
        [0, 0.7, 0],
        [1, 1, 1],
        [Math.PI / 2, 0, 0]
      )
    );

    headGroup.position.set(0, 1.44, 0);
    bodyGroup.add(headGroup);
    headGroup.add(makeMesh(new THREE.SphereGeometry(0.34, 24, 20), blue, [0, 0.06, 0]));
    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.38, 22, 18), turban, [0, 0.3, -0.02], [1.08, 0.76, 1.04])
    );
    headGroup.add(makeMesh(new THREE.OctahedronGeometry(0.09), gemRed, [0, 0.32, 0.36]));
    headGroup.add(makeMesh(new THREE.TorusGeometry(0.095, 0.02, 8, 16), M.goldBright, [0, 0.32, 0.35]));
    headGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.11, 0.26, 12),
        beard,
        [0, -0.26, 0.22],
        [1, 1, 1],
        [Math.PI + 0.2, 0, 0]
      )
    );
    const eL = makeEye(0.068, true);
    eL.position.set(-0.13, 0.1, 0.29);
    headGroup.add(eL);
    const eR = makeEye(0.068, true);
    eR.position.set(0.13, 0.1, 0.29);
    headGroup.add(eR);
    headGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.12, 0.026, 8, 16, Math.PI),
        M.eyeWhite,
        [0, -0.03, 0.31],
        [1, 0.7, 1],
        [0, 0, Math.PI]
      )
    );

    mouthMarker.position.set(0, -0.06, 0.35);
    headGroup.add(mouthMarker);

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.13, 0.34, 8, 14),
        blue,
        [-0.56, 1.04, 0.06],
        [1, 1, 1],
        [0.2, 0, 0.35]
      )
    );
    bodyGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.135, 0.035, 10, 18),
        M.goldBright,
        [-0.62, 0.88, 0.1],
        [1, 1, 1],
        [Math.PI / 2, 0.3, 0]
      )
    );

    armGroup.position.set(0.5, 1.1, 0.08);
    bodyGroup.add(armGroup);
    armGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.13, 0.32, 8, 14),
        blue,
        [0.1, -0.14, 0.16],
        [1, 1, 1],
        [0.65, 0, -0.22]
      )
    );
    armGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.135, 0.035, 10, 18),
        M.goldBright,
        [0.14, -0.22, 0.28],
        [1, 1, 1],
        [0.7, 0, 0]
      )
    );

    const v = createVessel('royal_chalice');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    cupGroup.position.set(0.14, -0.1, 0.44);
    armGroup.add(cupGroup);
    special.isFloater = true;
  }

  // -------------------------------------------------------------------------
  // 15. KRAKEN ABISSAL
  // -------------------------------------------------------------------------
  else if (key3D === 'kraken') {
    const crimson = clayMat(0x9f1239, 0.4);
    const deepPurple = clayMat(0x581c87, 0.46);

    headGroup.position.set(0, 0.92, 0);
    bodyGroup.add(headGroup);

    headGroup.add(
      makeMesh(new THREE.SphereGeometry(0.56, 26, 22), crimson, [0, 0.18, 0], [0.96, 1.15, 0.96])
    );
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      headGroup.add(
        makeMesh(
          new THREE.ConeGeometry(0.085, 0.28, 10),
          M.goldBright,
          [Math.cos(a) * 0.26, 0.78, Math.sin(a) * 0.26],
          [1, 1, 1],
          [Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]
        )
      );
    }
    [-0.22, 0.22].forEach((x) => {
      const eye = makeEye(0.11, true, 0xfacc15);
      eye.position.set(x, 0.08, 0.48);
      headGroup.add(eye);
      headGroup.add(makeMesh(new THREE.SphereGeometry(0.045, 10, 10), M.eyeDark, [x, 0.08, 0.585]));
      headGroup.add(
        makeMesh(
          new THREE.CapsuleGeometry(0.036, 0.16, 6, 8),
          deepPurple,
          [x, 0.22, 0.48],
          [1, 1, 1],
          [0, 0, x < 0 ? 1.25 : -1.25]
        )
      );
    });

    mouthMarker.position.set(0, -0.18, 0.48);
    headGroup.add(mouthMarker);

    special.krakenArms = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + 0.35;
      const isDrinkingArm = i === 0 || i === 1 || i === 7;

      const tentPivot = new THREE.Group();
      tentPivot.position.set(Math.cos(angle) * 0.34, 0.46, Math.sin(angle) * 0.34);
      tentPivot.rotation.y = -angle + Math.PI / 2;
      bodyGroup.add(tentPivot);

      const pts = isDrinkingArm
        ? [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -0.18, 0.32),
            new THREE.Vector3(0, 0.05, 0.56),
            new THREE.Vector3(0, 0.28, 0.54),
          ]
        : [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -0.26, 0.36),
            new THREE.Vector3(0, -0.34, 0.66),
            new THREE.Vector3(0, -0.12, 0.8),
          ];
      const curve = new THREE.CatmullRomCurve3(pts);
      tentPivot.add(
        makeMesh(new THREE.TubeGeometry(curve, 18, 0.105, 12, false), i % 2 === 0 ? crimson : deepPurple)
      );
      [0.35, 0.65].forEach((t) => {
        const p = curve.getPoint(t);
        tentPivot.add(
          makeMesh(new THREE.SphereGeometry(0.04, 8, 8), clayMat(0xfda4af, 0.45), [p.x, p.y - 0.08, p.z])
        );
      });

      if (isDrinkingArm) {
        const v = createVessel('mini_cup');
        v.cup.position.set(0, 0.36, 0.54);
        tentPivot.add(v.cup);
        special.krakenArms.push({ pivot: tentPivot, cup: v.cup, spout: v.spout, restRotX: 0 });
        if (i === 1) {
          spoutMarker = v.spout;
        }
      }
    }
    special.isKraken = true;
  }

  // -------------------------------------------------------------------------
  // 16. MULA SEM CABEÇA
  // -------------------------------------------------------------------------
  else if (key3D === 'mula') {
    const coat = clayMat(0x451a03, 0.48);
    const hoof = M.goldBright;
    const saddle = clayMat(0x991b1b, 0.54);
    const flameOrange = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.72,
      roughness: 0.25,
      metalness: 0.05,
    });
    const flameGold = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.22,
      metalness: 0.05,
    });

    const legs: Array<[number, number, number]> = [
      [-0.24, 0.28, 0.34],
      [0.24, 0.28, 0.34],
      [-0.24, 0.28, -0.34],
      [0.24, 0.28, -0.34],
    ];
    legs.forEach(([x, y, z]) => {
      bodyGroup.add(makeMesh(new THREE.CapsuleGeometry(0.095, 0.36, 8, 12), coat, [x, y, z]));
      bodyGroup.add(makeMesh(new THREE.CylinderGeometry(0.11, 0.12, 0.1, 14), hoof, [x, 0.06, z]));
    });

    bodyGroup.add(
      makeMesh(
        new THREE.CapsuleGeometry(0.36, 0.56, 14, 22),
        coat,
        [0, 0.66, 0],
        [1.0, 1.0, 1.0],
        [Math.PI / 2, 0, 0]
      )
    );
    bodyGroup.add(
      makeMesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.42, 20),
        saddle,
        [0, 0.7, -0.02],
        [1.0, 1.0, 1.0],
        [Math.PI / 2, 0, 0]
      )
    );
    bodyGroup.add(makeMesh(new THREE.TorusGeometry(0.385, 0.028, 10, 22), M.goldBright, [0, 0.7, 0.18]));
    bodyGroup.add(makeMesh(new THREE.TorusGeometry(0.385, 0.028, 10, 22), M.goldBright, [0, 0.7, -0.22]));

    bodyGroup.add(
      makeMesh(
        new THREE.ConeGeometry(0.12, 0.48, 12),
        clayMat(0x1c1917, 0.58),
        [0, 0.56, -0.68],
        [1, 1, 1],
        [-0.55, 0, 0]
      )
    );

    bodyGroup.add(
      makeMesh(
        new THREE.CylinderGeometry(0.19, 0.26, 0.46, 18),
        coat,
        [0, 1.0, 0.38],
        [1, 1, 1],
        [0.22, 0, 0]
      )
    );
    bodyGroup.add(
      makeMesh(
        new THREE.TorusGeometry(0.2, 0.036, 10, 22),
        M.goldBright,
        [0, 1.22, 0.43],
        [1, 1, 1],
        [Math.PI / 2 + 0.22, 0, 0]
      )
    );

    headGroup.position.set(0, 1.24, 0.44);
    bodyGroup.add(headGroup);

    const f1 = makeMesh(new THREE.ConeGeometry(0.22, 0.64, 14), flameOrange, [0, 0.3, 0]);
    const f2 = makeMesh(
      new THREE.ConeGeometry(0.14, 0.48, 12),
      flameGold,
      [0.1, 0.24, 0.06],
      [1, 1, 1],
      [0.15, 0, -0.25]
    );
    const f3 = makeMesh(
      new THREE.ConeGeometry(0.13, 0.44, 12),
      flameGold,
      [-0.11, 0.22, -0.04],
      [1, 1, 1],
      [-0.12, 0, 0.28]
    );
    headGroup.add(f1, f2, f3);

    special.isMula = true;
    special.mulaFlames = [f1, f2, f3];
    special.mulaFlameMats = [flameOrange, flameGold];

    mouthMarker.position.set(0, 0.12, 0);
    headGroup.add(mouthMarker);

    armGroup.position.set(0.66, 1.62, 0.44);
    root.add(armGroup);
    const v = createVessel('pitcher');
    cupGroup = v.cup;
    spoutMarker = v.spout;
    armGroup.add(cupGroup);
  }

  const idleRest = {
    armPos: armGroup.position.clone(),
    armRot: armGroup.rotation.clone(),
    cupPos: cupGroup.position.clone(),
    cupRot: cupGroup.rotation.clone(),
    headPos: headGroup.position.clone(),
    headRot: headGroup.rotation.clone(),
    bodyY: bodyGroup.position.y,
  };

  return {
    id: mascotId,
    key3D,
    root,
    bodyGroup,
    headGroup,
    armGroup,
    cupGroup,
    mouthMarker,
    spoutMarker,
    special,
    idleRest,
    dispose: () => {
      disposeObject3D(root, skipMaterials);
      localMatCache.clear();
    },
  };
}

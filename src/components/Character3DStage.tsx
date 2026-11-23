import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildCharacter3D,
  Character3DRig,
  disposeObject3D,
  getAlchemyParticleConfig,
  getPedestalAlchemyStyle,
  RARITY_3D_COLOR,
} from '../three/character3DFactory';
import {
  GlassMaterialId,
  LiquidEffectId,
  LiquidLayer,
  MascotId,
  Rarity,
} from '../types/hydration';
import { playAhhhSound, playGulpSound } from '../utils/sound';

export interface Character3DStageProps {
  mascotId: MascotId;
  rarity: Rarity;
  mascotName: string;
  glassMaterialId: GlassMaterialId;
  liquidEffectId: LiquidEffectId;
  layers?: LiquidLayer[];
  clampedPercent?: number;
  rawPercent?: number;
  drinkColor?: string;
  drinkTriggerKey?: number;
  soundEnabled?: boolean;
  showProgressRing?: boolean;
  allowZoom?: boolean;
  size?: 'hero' | 'modal' | 'alchemy';
  onTapCharacter?: () => void;
  className?: string;
}

interface SplashParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  gravity: number;
  life: number;
  maxLife: number;
}

interface AlchemyOrbiter {
  mesh: THREE.Mesh;
  angle: number;
  radius: number;
  baseY: number;
  speed: number;
  phase: number;
  riseSpeed: number;
}

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl =
      (probe.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (probe.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoft = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return isSoft;
  } catch {
    return false;
  }
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

const SIZE_CLASSES: Record<'hero' | 'modal' | 'alchemy', string> = {
  hero: 'h-[248px] w-[248px] sm:h-[262px] sm:w-[262px]',
  modal: 'h-[264px] w-[264px]',
  alchemy: 'h-[220px] w-[220px]',
};

const DRINK_DURATION_SEC = 3.35;
const STREAM_BEAD_COUNT = 10;

export const Character3DStage: React.FC<Character3DStageProps> = ({
  mascotId,
  rarity,
  mascotName,
  glassMaterialId,
  liquidEffectId,
  layers = [],
  clampedPercent = 0,
  rawPercent = 0,
  drinkColor = '#0EA5E9',
  drinkTriggerKey = 0,
  soundEnabled = true,
  showProgressRing = true,
  allowZoom = false,
  size = 'hero',
  onTapCharacter,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isDrinkingUi, setIsDrinkingUi] = useState(false);

  // Live mutable refs so the single WebGLRenderer never tears down on prop updates
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const onTapCharacterRef = useRef(onTapCharacter);
  onTapCharacterRef.current = onTapCharacter;

  const clampedPercentRef = useRef(clampedPercent);
  clampedPercentRef.current = clampedPercent;

  const drinkColorRef = useRef(new THREE.Color(drinkColor));
  const drinkColorHexRef = useRef(drinkColor);

  const stageApiRef = useRef<{
    setMascot: (id: MascotId, r: Rarity) => void;
    setAlchemyMaterial: (matId: GlassMaterialId) => void;
    setAlchemyEffect: (effId: LiquidEffectId) => void;
    setDrinkColor: (hex: string) => void;
    triggerDrink: () => void;
  } | null>(null);

  const lastTriggerKeyRef = useRef(drinkTriggerKey);

  // Determine aura glow color (top beverage or rarity)
  const auraColor = useMemo(() => {
    if (layers.length > 0) {
      return layers[layers.length - 1].color;
    }
    return RARITY_3D_COLOR[rarity].css;
  }, [layers, rarity]);

  // Precompute SVG segmented progress ring arcs (outer perimeter around 3D stage)
  const ringRadius = 150;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringSegments = useMemo(() => {
    if (!showProgressRing || layers.length === 0) return [];
    let consumed = 0;
    const segments: Array<{
      id: string;
      color: string;
      dashArray: string;
      dashOffset: number;
    }> = [];

    for (const layer of layers) {
      const remaining = Math.max(0, 100 - consumed);
      const pct = Math.min(layer.heightPercent, remaining);
      if (pct <= 0.1) continue;

      const arcLen = (pct / 100) * ringCircumference;
      const startLen = (consumed / 100) * ringCircumference;
      segments.push({
        id: layer.beverageId,
        color: layer.color,
        dashArray: `${Math.max(0.5, arcLen - 1.2)} ${ringCircumference}`,
        dashOffset: -startLen,
      });
      consumed += pct;
      if (consumed >= 100) break;
    }

    return segments;
  }, [layers, ringCircumference, showProgressRing]);

  // Mount a single WebGLRenderer for the lifetime of this stage
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const scene = new THREE.Scene();

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 280;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    const defaultCamPos = new THREE.Vector3(0.35, 1.8, 6.2);
    const defaultTarget = new THREE.Vector3(0, 0.85, 0);
    camera.position.copy(defaultCamPos);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    // Subtle PBR studio environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.45;
    pmrem.dispose();
    roomEnv.dispose();

    // Studio lights
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e1b4b, 0.92);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.25);
    keyLight.position.set(3.4, 5.2, 4.2);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 16;
      keyLight.shadow.camera.left = -2.5;
      keyLight.shadow.camera.right = 2.5;
      keyLight.shadow.camera.top = 3.2;
      keyLight.shadow.camera.bottom = -1.5;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const initialPedStyle = getPedestalAlchemyStyle(glassMaterialId);
    const rimLight = new THREE.DirectionalLight(
      initialPedStyle.rimLightColor,
      initialPedStyle.rimLightIntensity
    );
    rimLight.position.set(-3.5, 3.0, -3.4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xd4af37, 1.35, 10);
    fillLight.position.set(-2.6, 1.4, 2.4);
    scene.add(fillLight);

    // OrbitControls: horizontal 360° drag rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(defaultTarget);
    controls.enablePan = false;
    controls.enableZoom = allowZoom;
    controls.minDistance = 2.9;
    controls.maxDistance = 6.8;
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.54;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.autoRotate = !isSoftwareGl;
    controls.autoRotateSpeed = 0.85;

    let idleRotateTimer: number | null = null;
    const onControlStart = () => {
      renderer.domElement.style.cursor = 'grabbing';
      controls.autoRotate = false;
      if (idleRotateTimer !== null) {
        window.clearTimeout(idleRotateTimer);
        idleRotateTimer = null;
      }
    };
    const onControlEnd = () => {
      renderer.domElement.style.cursor = 'grab';
      if (!isSoftwareGl) {
        idleRotateTimer = window.setTimeout(() => {
          controls.autoRotate = true;
        }, 3000);
      }
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    // Pedestal (Apothecary dark base + Alchemy material finish + Rarity glow ring)
    const pedestalGroup = new THREE.Group();
    const pedTopMat = new THREE.MeshStandardMaterial({
      color: initialPedStyle.topColor,
      roughness: initialPedStyle.roughness,
      metalness: initialPedStyle.metalness,
    });
    const pedBaseMat = new THREE.MeshStandardMaterial({
      color: initialPedStyle.baseColor,
      roughness: Math.min(0.85, initialPedStyle.roughness + 0.12),
      metalness: Math.min(0.95, initialPedStyle.metalness + 0.08),
    });
    const initialRarHex = RARITY_3D_COLOR[rarity].hex;
    const rarityRingMat = new THREE.MeshStandardMaterial({
      color: initialRarHex,
      emissive: initialRarHex,
      emissiveIntensity: 0.4,
      roughness: 0.22,
      metalness: 0.88,
    });
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: initialPedStyle.innerRingColor,
      emissive: initialPedStyle.innerRingColor,
      emissiveIntensity: 0.22,
      roughness: 0.26,
      metalness: 0.88,
    });

    const pedTopGeo = new THREE.CylinderGeometry(1.12, 1.2, 0.14, 44);
    const pedBaseGeo = new THREE.CylinderGeometry(1.24, 1.34, 0.18, 44);
    const rarityRingGeo = new THREE.TorusGeometry(1.16, 0.038, 14, 52);
    const innerRingGeo = new THREE.TorusGeometry(0.95, 0.014, 10, 44);

    const pedTop = new THREE.Mesh(pedTopGeo, pedTopMat);
    pedTop.position.set(0, -0.07, 0);
    pedTop.receiveShadow = true;

    const pedBase = new THREE.Mesh(pedBaseGeo, pedBaseMat);
    pedBase.position.set(0, -0.21, 0);
    pedBase.receiveShadow = true;

    const rarityRing = new THREE.Mesh(rarityRingGeo, rarityRingMat);
    rarityRing.position.set(0, -0.005, 0);
    rarityRing.rotation.set(Math.PI / 2, 0, 0);

    const innerGoldRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerGoldRing.position.set(0, 0.005, 0);
    innerGoldRing.rotation.set(Math.PI / 2, 0, 0);

    pedestalGroup.add(pedTop, pedBase, rarityRing, innerGoldRing);
    scene.add(pedestalGroup);

    // Shared liquid materials dynamically tinted by the logged beverage color
    const initDrinkCol = new THREE.Color(drinkColorHexRef.current);
    const initEmissiveCol = initDrinkCol.clone().multiplyScalar(0.45);
    const waterSurface = new THREE.MeshStandardMaterial({
      color: initDrinkCol,
      emissive: initEmissiveCol,
      emissiveIntensity: 0.36,
      roughness: 0.14,
      metalness: 0.08,
    });
    const waterStream = new THREE.MeshStandardMaterial({
      color: initDrinkCol.clone().lerp(new THREE.Color(0xffffff), 0.18),
      emissive: initDrinkCol,
      emissiveIntensity: 0.55,
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: 0.92,
    });

    // Dynamic FX group (liquid stream beads + splash drops + sparkles)
    const fxGroup = new THREE.Group();
    scene.add(fxGroup);

    const beadGeo = new THREE.SphereGeometry(0.042, 10, 8);
    const streamBeads: THREE.Mesh[] = [];
    for (let i = 0; i < STREAM_BEAD_COUNT; i++) {
      const m = new THREE.Mesh(beadGeo, waterStream);
      m.visible = false;
      fxGroup.add(m);
      streamBeads.push(m);
    }

    const dropGeo = new THREE.SphereGeometry(0.036, 8, 8);
    const sparkleGeo = new THREE.OctahedronGeometry(0.046);
    const particles: SplashParticle[] = [];

    const spawnSplash = (
      origin: THREE.Vector3,
      count = 6,
      mode: 'drop' | 'sparkle' | 'bubble' = 'drop'
    ) => {
      const baseColor = drinkColorRef.current;
      for (let i = 0; i < count; i++) {
        const isSparkle = mode === 'sparkle';
        const isBubble = mode === 'bubble';
        const c = isSparkle
          ? baseColor.clone().lerp(new THREE.Color(0xffffff), 0.45)
          : isBubble
            ? baseColor.clone().lerp(new THREE.Color(0xe0f2fe), 0.55)
            : baseColor.clone().lerp(new THREE.Color(0xffffff), 0.12);

        const mat = new THREE.MeshStandardMaterial({
          color: c,
          emissive: baseColor.clone(),
          emissiveIntensity: isSparkle ? 0.9 : 0.42,
          roughness: 0.1,
          transparent: true,
          opacity: isBubble ? 0.82 : 0.94,
        });

        const mesh = new THREE.Mesh(isSparkle ? sparkleGeo : dropGeo, mat);
        mesh.position.copy(origin);
        const s = isBubble ? 0.9 + Math.random() * 1.1 : 0.65 + Math.random() * 0.75;
        mesh.scale.setScalar(s);
        fxGroup.add(mesh);

        const angle = Math.random() * Math.PI * 2;
        const speed = isSparkle
          ? 1.05 + Math.random() * 1.25
          : isBubble
            ? 0.25 + Math.random() * 0.45
            : 0.5 + Math.random() * 0.85;

        particles.push({
          mesh,
          vel: new THREE.Vector3(
            Math.cos(angle) * speed,
            isBubble
              ? 0.88 + Math.random() * 0.8
              : isSparkle
                ? 1.15 + Math.random() * 1.15
                : 0.7 + Math.random() * 0.95,
            Math.sin(angle) * speed
          ),
          gravity: isBubble ? -0.45 : isSparkle ? 1.2 : 3.8,
          life: 0,
          maxLife: isBubble ? 1.25 : isSparkle ? 0.95 : 0.65,
        });
      }
    };

    // Real 3D Alchemy ambient particles (gelo, poeira-estelar, bolhas-douradas, nevoa)
    const alchemyGroup = new THREE.Group();
    scene.add(alchemyGroup);
    let alchemyOrbiters: AlchemyOrbiter[] = [];
    let alchemyMode: LiquidEffectId = 'nenhum';
    let isPrismMaterial = Boolean(initialPedStyle.prismShift);

    const rebuildAlchemyParticles = (effId: LiquidEffectId) => {
      // Dispose old alchemy particles cleanly
      if (alchemyGroup.children.length > 0) {
        disposeObject3D(alchemyGroup);
        alchemyGroup.clear();
      }
      alchemyOrbiters = [];
      alchemyMode = effId;

      const cfg = getAlchemyParticleConfig(effId);
      if (cfg.count <= 0) return;

      let geo: THREE.BufferGeometry;
      if (effId === 'gelo') {
        geo = new THREE.BoxGeometry(0.11, 0.11, 0.11);
      } else if (effId === 'poeira-estelar') {
        geo = new THREE.OctahedronGeometry(0.055);
      } else if (effId === 'bolhas-douradas') {
        geo = new THREE.SphereGeometry(0.055, 10, 8);
      } else {
        geo = new THREE.SphereGeometry(0.14, 10, 8);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: effId === 'nevoa' ? 0.35 : 0.75,
        roughness: effId === 'gelo' ? 0.12 : 0.25,
        metalness: effId === 'bolhas-douradas' ? 0.72 : 0.18,
        transparent: true,
        opacity: effId === 'nevoa' ? 0.34 : effId === 'gelo' ? 0.78 : 0.88,
      });

      for (let i = 0; i < cfg.count; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        const angle = (i / cfg.count) * Math.PI * 2 + Math.random() * 0.4;
        const radius =
          effId === 'nevoa'
            ? 0.95 + Math.random() * 0.55
            : 1.05 + Math.random() * 0.48;
        const baseY =
          effId === 'nevoa'
            ? 0.1 + Math.random() * 0.42
            : 0.22 + (i / cfg.count) * 1.65;

        const scale =
          effId === 'nevoa'
            ? 0.75 + Math.random() * 0.7
            : 0.65 + Math.random() * 0.65;
        mesh.scale.setScalar(scale);
        mesh.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
        alchemyGroup.add(mesh);

        alchemyOrbiters.push({
          mesh,
          angle,
          radius,
          baseY,
          speed: (effId === 'nevoa' ? 0.35 : 0.65) + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          riseSpeed: effId === 'bolhas-douradas' ? 0.36 + Math.random() * 0.25 : 0,
        });
      }
    };

    // Active character rig management (strictly 1 rig in memory at a time; disposes old rig on swap)
    let activeRig: Character3DRig | null = null;
    const animState = {
      isDrinking: false,
      drinkTime: 0,
      gulpBeatPlayed: [false, false, false],
      ahhhPlayed: false,
    };

    const stopDrinking = (resetPose: boolean) => {
      animState.isDrinking = false;
      animState.drinkTime = 0;
      streamBeads.forEach((b) => {
        b.visible = false;
      });
      setIsDrinkingUi(false);

      if (resetPose && activeRig) {
        const r = activeRig.idleRest;
        activeRig.armGroup.position.copy(r.armPos);
        activeRig.armGroup.rotation.copy(r.armRot);
        activeRig.cupGroup.position.copy(r.cupPos);
        activeRig.cupGroup.rotation.copy(r.cupRot);
        activeRig.headGroup.position.copy(r.headPos);
        activeRig.headGroup.rotation.copy(r.headRot);
        activeRig.bodyGroup.position.y = r.bodyY;
        activeRig.bodyGroup.scale.set(1, 1, 1);

        if (activeRig.special.nessieGulp) {
          activeRig.special.nessieGulp.visible = false;
        }
        if (activeRig.special.frogThroat) {
          activeRig.special.frogThroat.scale.set(1.15, 0.75, 0.85);
        }
        if (activeRig.special.krakenArms) {
          activeRig.special.krakenArms.forEach((ka) => {
            ka.pivot.rotation.x = ka.restRotX;
            ka.cup.rotation.x = 0;
          });
        }
        if (activeRig.special.mulaFlameMats) {
          activeRig.special.mulaFlameMats[0].color.setHex(0xf97316);
          activeRig.special.mulaFlameMats[0].emissive.setHex(0xea580c);
          activeRig.special.mulaFlameMats[1].color.setHex(0xfacc15);
          activeRig.special.mulaFlameMats[1].emissive.setHex(0xf59e0b);
        }
      }
    };

    const triggerDrink = () => {
      if (!activeRig) return;
      animState.isDrinking = true;
      animState.drinkTime = 0;
      animState.gulpBeatPlayed = [false, false, false];
      animState.ahhhPlayed = false;
      setIsDrinkingUi(true);
    };

    const applyDrinkColor = (hex: string) => {
      drinkColorHexRef.current = hex;
      const col = new THREE.Color(hex);
      drinkColorRef.current.copy(col);
      waterSurface.color.copy(col);
      waterSurface.emissive.copy(col).multiplyScalar(0.45);
      waterStream.color.copy(col).lerp(new THREE.Color(0xffffff), 0.16);
      waterStream.emissive.copy(col);
    };

    const setMascot = (id: MascotId, r: Rarity) => {
      if (activeRig) {
        scene.remove(activeRig.root);
        activeRig.dispose();
        activeRig = null;
      }
      activeRig = buildCharacter3D(id, { waterSurface, waterStream });
      scene.add(activeRig.root);
      stopDrinking(true);

      const rarHex = RARITY_3D_COLOR[r].hex;
      rarityRingMat.color.setHex(rarHex);
      rarityRingMat.emissive.setHex(rarHex);
    };

    const setAlchemyMaterial = (matId: GlassMaterialId) => {
      const style = getPedestalAlchemyStyle(matId);
      pedTopMat.color.setHex(style.topColor);
      pedTopMat.roughness = style.roughness;
      pedTopMat.metalness = style.metalness;

      pedBaseMat.color.setHex(style.baseColor);
      pedBaseMat.roughness = Math.min(0.85, style.roughness + 0.12);
      pedBaseMat.metalness = Math.min(0.95, style.metalness + 0.08);

      rimLight.color.setHex(style.rimLightColor);
      rimLight.intensity = style.rimLightIntensity;

      innerRingMat.color.setHex(style.innerRingColor);
      innerRingMat.emissive.setHex(style.innerRingColor);
      isPrismMaterial = Boolean(style.prismShift);
    };

    // Tap vs Drag detection on canvas
    let pointerDownInfo: { x: number; y: number; time: number } | null = null;
    const onPointerDown = (e: PointerEvent) => {
      pointerDownInfo = { x: e.clientX, y: e.clientY, time: performance.now() };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDownInfo) return;
      const dx = e.clientX - pointerDownInfo.x;
      const dy = e.clientY - pointerDownInfo.y;
      const dist = Math.hypot(dx, dy);
      const elapsed = performance.now() - pointerDownInfo.time;
      pointerDownInfo = null;

      if (dist < 9 && elapsed < 360) {
        triggerDrink();
        onTapCharacterRef.current?.();
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Expose live update API to React effects
    stageApiRef.current = {
      setMascot,
      setAlchemyMaterial,
      setAlchemyEffect: rebuildAlchemyParticles,
      setDrinkColor: applyDrinkColor,
      triggerDrink,
    };

    // Initial load
    setMascot(mascotId, rarity);
    setAlchemyMaterial(glassMaterialId);
    rebuildAlchemyParticles(liquidEffectId);
    applyDrinkColor(drinkColorHexRef.current);

    // Responsive ResizeObserver
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    // Reusable scratch vectors & colors for 60fps loop
    const tmpSpout = new THREE.Vector3();
    const tmpMouth = new THREE.Vector3();
    const tmpMid = new THREE.Vector3();
    const colorOrange = new THREE.Color(0xf97316);
    const colorOrangeEm = new THREE.Color(0xea580c);
    const colorGold = new THREE.Color(0xfacc15);
    const colorGoldEm = new THREE.Color(0xf59e0b);
    const tmpDrinkLight = new THREE.Color();
    const prismColor = new THREE.Color();

    let disposed = false;
    let rafId = 0;
    let softTimerId: number | null = null;
    let lastNow = performance.now();

    const updateAnimation = (timeSec: number, dt: number) => {
      // Progressive pedestal rarity glow proportional to daily hydration %
      const targetGlow = 0.24 + (Math.min(100, Math.max(0, clampedPercentRef.current)) / 100) * 1.05;
      const pulse = Math.sin(timeSec * 2.2) * 0.08;
      rarityRingMat.emissiveIntensity = targetGlow + pulse;

      if (isPrismMaterial) {
        const hue = (timeSec * 0.14) % 1;
        prismColor.setHSL(hue, 0.82, 0.62);
        rimLight.color.copy(prismColor);
        innerRingMat.color.copy(prismColor);
        innerRingMat.emissive.copy(prismColor);
      }

      // Update 3D Alchemy ambient particles
      for (let i = 0; i < alchemyOrbiters.length; i++) {
        const o = alchemyOrbiters[i];
        o.angle += dt * o.speed;
        if (alchemyMode === 'bolhas-douradas') {
          o.baseY += dt * o.riseSpeed;
          if (o.baseY > 2.15) o.baseY = 0.08;
          o.mesh.position.set(
            Math.cos(o.angle) * o.radius,
            o.baseY,
            Math.sin(o.angle) * o.radius
          );
        } else if (alchemyMode === 'gelo') {
          const bob = Math.sin(timeSec * 1.9 + o.phase) * 0.12;
          o.mesh.position.set(
            Math.cos(o.angle) * o.radius,
            o.baseY + bob,
            Math.sin(o.angle) * o.radius
          );
          o.mesh.rotation.x += dt * 0.9;
          o.mesh.rotation.y += dt * 1.2;
        } else if (alchemyMode === 'poeira-estelar') {
          const bob = Math.sin(timeSec * 2.8 + o.phase) * 0.16;
          o.mesh.position.set(
            Math.cos(o.angle) * o.radius,
            o.baseY + bob,
            Math.sin(o.angle) * o.radius
          );
          o.mesh.rotation.y += dt * 2.4;
          const twinkle = 0.55 + Math.abs(Math.sin(timeSec * 3.6 + o.phase)) * 0.7;
          o.mesh.scale.setScalar(twinkle);
        } else if (alchemyMode === 'nevoa') {
          const drift = Math.sin(timeSec * 1.1 + o.phase) * 0.08;
          o.mesh.position.set(
            Math.cos(o.angle) * o.radius,
            o.baseY + drift,
            Math.sin(o.angle) * o.radius
          );
        }
      }

      // Update transient splash/sparkle particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          fxGroup.remove(p.mesh);
          (p.mesh.material as THREE.Material).dispose();
          particles.splice(i, 1);
          continue;
        }
        p.vel.y -= p.gravity * dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        const progress = p.life / p.maxLife;
        (p.mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 1 - progress);
        p.mesh.scale.multiplyScalar(Math.max(0.1, 1 - dt * 0.5));
      }

      if (!activeRig) return;
      const rig = activeRig;
      const rest = rig.idleRest;
      const sp = rig.special;

      // 1. Continuous Idle animation (breathing, floating, whirlwind, flames, dragon wings)
      const breathe = Math.sin(timeSec * 2.4);
      let scaleY = 1 + breathe * 0.022;
      let scaleXZ = 1 - breathe * 0.012;
      let bodyOffsetY = sp.isFloater ? Math.sin(timeSec * 2.1) * 0.07 : 0;

      if (sp.saciWhirlwind) {
        sp.saciWhirlwind.rotation.y += dt * (animState.isDrinking ? 4.8 : 2.2);
        bodyOffsetY = Math.sin(timeSec * 3.2) * 0.045;
      }

      if (sp.mulaFlames) {
        sp.mulaFlames.forEach((f, idx) => {
          f.scale.y = 0.92 + Math.sin(timeSec * (8 + idx * 2) + idx) * 0.14;
          f.rotation.y = Math.sin(timeSec * 4 + idx) * 0.25;
        });
      }

      if (sp.dragonWings) {
        const flap = Math.sin(timeSec * (animState.isDrinking ? 14 : 4)) * 0.22;
        sp.dragonWings[0].rotation.z = 0.35 + flap;
        sp.dragonWings[1].rotation.z = -0.35 - flap;
      }

      // 2. Expressive 3-Phase Drinking Animation
      if (animState.isDrinking) {
        animState.drinkTime += dt;
        const t = animState.drinkTime;

        const raise = smoothstep(0.0, 0.62, t);
        const inGulps = t >= 0.62 && t <= 2.38;
        const gulpProgress = THREE.MathUtils.clamp((t - 0.62) / 1.76, 0, 1);
        const gulpPulse = inGulps ? Math.max(0, Math.sin(gulpProgress * Math.PI * 6)) : 0;
        const lower = smoothstep(2.35, 2.85, t);
        const activeHold = raise * (1 - lower);

        // 3 Gulp sound + splash beats
        const beatTimes = [0.76, 1.32, 1.88];
        beatTimes.forEach((bt, idx) => {
          if (t >= bt && !animState.gulpBeatPlayed[idx]) {
            animState.gulpBeatPlayed[idx] = true;
            playGulpSound(soundEnabledRef.current, idx);
            rig.mouthMarker.getWorldPosition(tmpMouth);
            spawnSplash(tmpMouth, 5, 'drop');
          }
        });

        // Phase 3 satisfaction chord + sparkles
        if (t >= 2.46 && !animState.ahhhPlayed) {
          animState.ahhhPlayed = true;
          playAhhhSound(soundEnabledRef.current);
          rig.mouthMarker.getWorldPosition(tmpMouth);
          spawnSplash(tmpMouth, 12, 'sparkle');
          if (sp.isDragon) {
            spawnSplash(tmpMouth, 9, 'bubble');
          }
        }

        // Squash & stretch happy hop
        let hopY = 0;
        if (t > 2.42 && t < 3.18) {
          const hp = (t - 2.42) / 0.76;
          hopY = Math.sin(hp * Math.PI) * 0.24;
          const sq = Math.sin(hp * Math.PI * 2) * 0.09;
          scaleY += sq;
          scaleXZ -= sq * 0.6;
        }

        if (inGulps) {
          scaleXZ += gulpPulse * 0.065;
          scaleY -= gulpPulse * 0.03;
        }

        // Per-creature drinking choreography
        if (sp.isMimic) {
          const chomp = inGulps ? Math.sin(gulpProgress * Math.PI * 6) * 0.22 : 0;
          rig.headGroup.rotation.x = rest.headRot.x - activeHold * 0.88 + chomp;
          rig.armGroup.position.set(
            THREE.MathUtils.lerp(rest.armPos.x, 0.26, activeHold),
            THREE.MathUtils.lerp(rest.armPos.y, 1.48, activeHold),
            THREE.MathUtils.lerp(rest.armPos.z, 0.22, activeHold)
          );
          rig.cupGroup.rotation.z = activeHold * 1.18;
        } else if (sp.isMula) {
          rig.armGroup.position.set(
            THREE.MathUtils.lerp(rest.armPos.x, 0.3, activeHold),
            THREE.MathUtils.lerp(rest.armPos.y, 1.98, activeHold),
            THREE.MathUtils.lerp(rest.armPos.z, 0.44, activeHold)
          );
          rig.cupGroup.rotation.z = activeHold * 1.25;

          if (sp.mulaFlameMats) {
            const blend = smoothstep(0.65, 1.15, t) * (1 - smoothstep(2.65, 3.25, t));
            tmpDrinkLight.copy(drinkColorRef.current).lerp(new THREE.Color(0xffffff), 0.35);
            sp.mulaFlameMats[0].color.copy(colorOrange).lerp(drinkColorRef.current, blend);
            sp.mulaFlameMats[0].emissive.copy(colorOrangeEm).lerp(drinkColorRef.current, blend);
            sp.mulaFlameMats[1].color.copy(colorGold).lerp(tmpDrinkLight, blend);
            sp.mulaFlameMats[1].emissive.copy(colorGoldEm).lerp(drinkColorRef.current, blend);
          }
        } else if (sp.isNessie) {
          rig.headGroup.rotation.x = rest.headRot.x + activeHold * 0.62 - gulpPulse * 0.08;
          if (inGulps && sp.nessieGulp && sp.nessieCurve) {
            sp.nessieGulp.visible = true;
            const singleBeat = (gulpProgress * 3) % 1;
            const pt = sp.nessieCurve.getPoint(THREE.MathUtils.clamp(1 - singleBeat, 0.05, 0.98));
            sp.nessieGulp.position.copy(pt);
            const s = 0.75 + Math.sin(singleBeat * Math.PI) * 0.45;
            sp.nessieGulp.scale.setScalar(s);
          } else if (sp.nessieGulp) {
            sp.nessieGulp.visible = false;
          }
        } else if (sp.isKraken && sp.krakenArms) {
          rig.headGroup.rotation.x = rest.headRot.x - activeHold * 0.24 - gulpPulse * 0.08;
          sp.krakenArms.forEach((ka, idx) => {
            const wave = inGulps ? Math.sin(gulpProgress * Math.PI * 6 + idx * 1.8) * 0.18 : 0;
            ka.pivot.rotation.x = -activeHold * 0.55 + wave;
            ka.cup.rotation.x = -activeHold * 0.55;
          });
        } else {
          const jitterX = sp.isJittery && inGulps ? Math.sin(timeSec * 48) * 0.04 : 0;
          const jitterZ = sp.isJittery && inGulps ? Math.cos(timeSec * 52) * 0.03 : 0;

          if (sp.isStraw) {
            rig.headGroup.rotation.x = rest.headRot.x + activeHold * 0.14 + gulpPulse * 0.07;
            rig.armGroup.position.set(
              rest.armPos.x - activeHold * 0.16,
              rest.armPos.y + activeHold * 0.24,
              rest.armPos.z + activeHold * 0.1
            );
            rig.armGroup.rotation.x = rest.armRot.x - activeHold * 0.22;
            rig.cupGroup.rotation.z = activeHold * 0.18;
          } else {
            rig.headGroup.rotation.x = rest.headRot.x - activeHold * 0.36 - gulpPulse * 0.1;
            rig.headGroup.rotation.z = jitterZ;

            rig.armGroup.position.set(
              rest.armPos.x - activeHold * 0.22 + jitterX,
              rest.armPos.y + activeHold * 0.34,
              rest.armPos.z + activeHold * 0.14
            );
            rig.armGroup.rotation.x = rest.armRot.x - activeHold * 0.65;
            rig.armGroup.rotation.z = rest.armRot.z + activeHold * 0.25;
            rig.cupGroup.rotation.z = activeHold * 0.92;
          }

          if (sp.frogThroat) {
            const puff = inGulps ? 1 + gulpPulse * 0.52 : 1;
            sp.frogThroat.scale.set(1.15 * puff, 0.75 * puff, 0.85 * puff);
          }
        }

        // Parabolic Bézier liquid stream beads in Phase 2
        if (inGulps) {
          rig.spoutMarker.getWorldPosition(tmpSpout);
          rig.mouthMarker.getWorldPosition(tmpMouth);
          tmpMid.addVectors(tmpSpout, tmpMouth).multiplyScalar(0.5);
          tmpMid.y += sp.isStraw ? 0.04 : 0.14;

          streamBeads.forEach((bead, i) => {
            bead.visible = true;
            const u = (timeSec * 3.8 + i / STREAM_BEAD_COUNT) % 1;
            const inv = 1 - u;
            bead.position.set(
              inv * inv * tmpSpout.x + 2 * inv * u * tmpMid.x + u * u * tmpMouth.x,
              inv * inv * tmpSpout.y + 2 * inv * u * tmpMid.y + u * u * tmpMouth.y,
              inv * inv * tmpSpout.z + 2 * inv * u * tmpMid.z + u * u * tmpMouth.z
            );
            const pulseSize = 0.7 + Math.sin(u * Math.PI) * 0.55;
            bead.scale.setScalar(pulseSize);
          });
        } else {
          streamBeads.forEach((b) => {
            b.visible = false;
          });
        }

        rig.bodyGroup.position.y = rest.bodyY + bodyOffsetY + hopY;
        rig.bodyGroup.scale.set(scaleXZ, scaleY, scaleXZ);

        if (t >= DRINK_DURATION_SEC) {
          stopDrinking(true);
        }
      } else {
        rig.bodyGroup.position.y = rest.bodyY + bodyOffsetY;
        rig.bodyGroup.scale.set(scaleXZ, scaleY, scaleXZ);
        if (!sp.isMimic && !sp.isMula) {
          rig.headGroup.rotation.z = Math.sin(timeSec * 1.4) * 0.04;
        }
      }
    };

    const glCtx = renderer.getContext();
    const afterSoftwareDraw = (next: () => void) => {
      if (disposed) return;
      if (typeof WebGL2RenderingContext !== 'undefined' && glCtx instanceof WebGL2RenderingContext) {
        const sync = glCtx.fenceSync(glCtx.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (sync) {
          glCtx.flush();
          const poll = () => {
            if (disposed) {
              glCtx.deleteSync(sync);
              return;
            }
            if (glCtx.clientWaitSync(sync, 0, 0) === glCtx.TIMEOUT_EXPIRED) {
              softTimerId = window.setTimeout(poll, 16);
              return;
            }
            glCtx.deleteSync(sync);
            softTimerId = window.setTimeout(next, 80);
          };
          softTimerId = window.setTimeout(poll, 0);
          return;
        }
      }
      softTimerId = window.setTimeout(next, 120);
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;
      const timeSec = now / 1000;

      updateAnimation(timeSec, dt);
      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterSoftwareDraw(tick);
      } else {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      tick();
    } else {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      stageApiRef.current = null;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (softTimerId !== null) window.clearTimeout(softTimerId);
      if (idleRotateTimer !== null) window.clearTimeout(idleRotateTimer);

      ro.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.dispose();

      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      if (activeRig) {
        scene.remove(activeRig.root);
        activeRig.dispose();
        activeRig = null;
      }

      // Clean up FX particles
      particles.forEach((p) => {
        fxGroup.remove(p.mesh);
        (p.mesh.material as THREE.Material).dispose();
      });
      particles.length = 0;

      // Clean up alchemy particles
      disposeObject3D(alchemyGroup);
      alchemyGroup.clear();

      // Dispose shared geometries, materials & environment
      pedTopGeo.dispose();
      pedBaseGeo.dispose();
      rarityRingGeo.dispose();
      innerRingGeo.dispose();
      pedTopMat.dispose();
      pedBaseMat.dispose();
      rarityRingMat.dispose();
      innerRingMat.dispose();

      beadGeo.dispose();
      dropGeo.dispose();
      sparkleGeo.dispose();
      waterSurface.dispose();
      waterStream.dispose();

      envRT.dispose();
      scene.environment = null;

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // Intentionally mount WebGLRenderer once per stage instance (allowZoom stays stable per mount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowZoom]);

  // Swap character cleanly without recreating WebGLRenderer
  useEffect(() => {
    stageApiRef.current?.setMascot(mascotId, rarity);
  }, [mascotId, rarity]);

  // Update pedestal & rim light when Alchemy material changes
  useEffect(() => {
    stageApiRef.current?.setAlchemyMaterial(glassMaterialId);
  }, [glassMaterialId]);

  // Update 3D orbiting Alchemy particles when effect changes
  useEffect(() => {
    stageApiRef.current?.setAlchemyEffect(liquidEffectId);
  }, [liquidEffectId]);

  // Update cup/stream/splash beverage color dynamically
  useEffect(() => {
    stageApiRef.current?.setDrinkColor(drinkColor);
  }, [drinkColor]);

  // Trigger drinking animation whenever parent increments drinkTriggerKey
  useEffect(() => {
    if (drinkTriggerKey > lastTriggerKeyRef.current) {
      lastTriggerKeyRef.current = drinkTriggerKey;
      stageApiRef.current?.triggerDrink();
    }
  }, [drinkTriggerKey]);

  return (
    <div
      data-testid="character-3d-stage"
      data-mascot-id={mascotId}
      data-drinking={isDrinkingUi ? 'true' : 'false'}
      data-drink-color={drinkColor}
      aria-label={`${mascotName} em 3D (${rawPercent}% da meta diária). Arraste para girar 360 graus ou toque para beber.`}
      className={`relative flex select-none items-center justify-center ${SIZE_CLASSES[size]} ${className}`}
    >
      {/* Subtle radial glow behind the solid 3D character */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full opacity-28 blur-2xl transition-colors duration-500 dark:opacity-38"
        style={{
          background: `radial-gradient(circle, ${auraColor} 0%, transparent 72%)`,
        }}
      />

      {/* Luminous Segmented Circular SVG Progress Ring (Multi-Beverage Layers) */}
      {showProgressRing && (
        <svg
          viewBox="0 0 320 320"
          aria-hidden="true"
          data-testid="hydration-progress-ring"
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
        >
          {/* Base track */}
          <circle
            cx="160"
            cy="160"
            r={ringRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-300/65 dark:text-slate-800/85"
          />

          {/* Subtle golden inner guide ring */}
          <circle
            cx="160"
            cy="160"
            r={ringRadius - 9}
            fill="none"
            stroke="#D4AF37"
            strokeOpacity="0.22"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {/* Proportional multi-beverage luminous arc segments */}
          {ringSegments.map((seg) => (
            <circle
              key={seg.id}
              cx="160"
              cy="160"
              r={ringRadius}
              fill="none"
              stroke={seg.color}
              strokeWidth="7.5"
              strokeLinecap="butt"
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              style={{
                filter: `drop-shadow(0 0 6px ${seg.color})`,
                transition: 'stroke-dasharray 450ms ease, stroke-dashoffset 450ms ease',
              }}
            />
          ))}
        </svg>
      )}

      {/* Single Three.js WebGLRenderer mount point (kept empty of React children, zero backdrop-blur) */}
      <div ref={mountRef} className="relative z-10 h-full w-full" />
    </div>
  );
};

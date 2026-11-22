export type BeverageId =
  | 'agua'
  | 'cafe'
  | 'cha'
  | 'suco'
  | 'isotonico'
  | 'leite'
  | 'refrigerante';

export type MascotId =
  // Comuns
  | 'gnomo'
  | 'sapo-mago'
  | 'cogumelo'
  | 'goblin-cafe'
  // Raros
  | 'nessie'
  | 'yeti'
  | 'et-varginha'
  | 'troll'
  // Épicos
  | 'saci'
  | 'fantasma'
  | 'mimico'
  | 'coruja-alquimista'
  // Lendários
  | 'dragao-bebe'
  | 'genio'
  | 'kraken'
  | 'mula-sem-cabeca';

export type Rarity = 'comum' | 'raro' | 'epico' | 'lendario';

export type GlassMaterialId =
  | 'cristal'
  | 'esmeralda'
  | 'obsidiana'
  | 'ouro'
  | 'prisma';

export type LiquidEffectId =
  | 'nenhum'
  | 'gelo'
  | 'poeira-estelar'
  | 'bolhas-douradas'
  | 'nevoa';

export type TabId = 'hoje' | 'missoes' | 'colecao' | 'historico';

export type ThemeMode = 'dark' | 'light';

export interface BeverageDefinition {
  id: BeverageId;
  name: string;
  shortName: string;
  color: string;
  waveHighlight: string;
  hydrationFactor: number;
  description: string;
  isHealthyVariety: boolean;
}

export interface LogEntry {
  id: string;
  beverageId: BeverageId;
  volumeMl: number;
  hydratedMl: number;
  timestamp: string; // ISO string
  hour: number; // 0-23
}

export interface DayRecord {
  dateKey: string; // YYYY-MM-DD
  entries: LogEntry[];
  goalMl: number;
  workoutBonusActive: boolean;
  celebratedGoal: boolean;
  shielded?: boolean;
  rhythmBonusClaimed?: boolean;
}

export interface UserSettings {
  goalMode: 'auto' | 'manual';
  weightKg: number;
  manualGoalMl: number;
  soundEnabled: boolean;
  theme: ThemeMode;
}

export interface ChallengeDefinition {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  type:
    | 'pure_water'
    | 'morning_boost'
    | 'athlete_mode'
    | 'streak_3'
    | 'variety_3';
}

export interface ChallengeStatus {
  challenge: ChallengeDefinition;
  isActive: boolean;
  isCompleted: boolean;
  progressPercent: number;
  progressLabel: string;
}

export interface MascotDetailPath {
  d: string;
  strokeWidth?: number;
  fill?: string;
  stroke?: string;
  opacity?: number;
}

export interface MascotEye {
  cx: number;
  cy: number;
  rx: number;
  ry?: number;
  tilt?: number;
  irisColor?: string;
  browD?: string;
}

export interface MascotSculptPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  blur?: boolean;
}

export interface MascotMetallicPath {
  d: string;
  metal: 'gold' | 'bronze' | 'cork' | 'crystal';
  fill?: boolean;
  strokeWidth?: number;
  opacity?: number;
}

export interface MascotDefinition {
  id: MascotId;
  name: string;
  subtitle: string;
  rarity: Rarity;
  unlockConditionText: string;
  starterUnlocked: boolean;
  accentColor: string;
  waveColor: string;
  clipPathD: string;
  fillTopY: number;
  fillBottomY: number;
  /** Optional calibration for the thick double-walled inner crystal chamber */
  innerCenter?: { x: number; y: number; scaleX?: number; scaleY?: number };
  /** 3D relief shading & crease paths (hat folds, beard layers, ear hollows, horn facets) */
  sculptPaths?: MascotSculptPath[];
  /** Aged gold, bronze, cork, or cut-crystal alchemical details integrated onto the flask */
  metallicPaths?: MascotMetallicPath[];
  /** Glossy white specular reflection paths tailored to this creature's curves */
  specularPaths: Array<{
    d: string;
    opacity?: number;
    strokeWidth?: number;
    isFill?: boolean;
  }>;
  /** Studio pinpoint highlight dot near top-left dome */
  pinpointHighlight?: { cx: number; cy: number; rx?: number; ry?: number };
  /** Fine crisp studio rim-light reflection along right side */
  rightRimPath?: string;
  /** X position on the right inner wall for etched 25/50/75/100% lab ticks */
  measureX?: number;
  /** Expressive comic face & feature paths rendered ABOVE the glass */
  detailPaths: MascotDetailPath[];
  eyes: MascotEye[];
  /** Extra magical crest rendered outside/above silhouette (e.g. Headless Mule sparks) */
  topSparks?: boolean;
  /** True for floating ghost / genie silhouettes with softer smaller floor shadow */
  floating?: boolean;
}

export interface GlassMaterialDefinition {
  id: GlassMaterialId;
  name: string;
  description: string;
  rarity: Rarity;
  starterUnlocked: boolean;
  rimStart: string;
  rimMid: string;
  rimEnd: string;
  glassTintInner: string;
  glassTintOuter: string;
  specularColor: string;
  previewSwatch: string;
}

export interface LiquidEffectDefinition {
  id: LiquidEffectId;
  name: string;
  description: string;
  rarity: Rarity;
  starterUnlocked: boolean;
  previewColor: string;
}

export interface LiquidLayer {
  beverageId: BeverageId;
  name: string;
  color: string;
  waveHighlight: string;
  rawMl: number;
  hydratedMl: number;
  startPercent: number;
  heightPercent: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export interface RhythmComboStatus {
  morning: boolean; // < 12h
  afternoon: boolean; // 12h - 17h59
  night: boolean; // >= 18h
  completedCount: number;
  isComplete: boolean;
}

export type GachaReward =
  | { kind: 'mascot'; id: MascotId; name: string; subtitle: string; rarity: Rarity }
  | { kind: 'material'; id: GlassMaterialId; name: string; subtitle: string; rarity: Rarity }
  | { kind: 'effect'; id: LiquidEffectId; name: string; subtitle: string; rarity: Rarity };

export interface AppState {
  currentDateKey: string;
  activeMascotId: MascotId;
  unlockedMascotIds: MascotId[];
  activeGlassMaterialId: GlassMaterialId;
  unlockedGlassMaterialIds: GlassMaterialId[];
  activeLiquidEffectId: LiquidEffectId;
  unlockedLiquidEffectIds: LiquidEffectId[];
  goldCoins: number;
  streakShields: number;
  activeChallengeIds: string[];
  completedChallengeIds: string[];
  bonusXp: number;
  days: Record<string, DayRecord>;
  settings: UserSettings;
}

import { GLASS_MATERIAL_MAP, LIQUID_EFFECT_MAP } from '../data/alchemy';
import { CHALLENGES } from '../data/challenges';
import { VALID_MASCOT_IDS } from '../data/mascots';
import {
  AppState,
  DayRecord,
  GlassMaterialId,
  LiquidEffectId,
  LogEntry,
  MascotId,
  UserSettings,
} from '../types/hydration';
import {
  addDaysToDateKey,
  calculateBaseGoalMl,
  calculateHydratedMl,
  getDateKey,
  rolloverToDate,
} from './hydration';

export const STORAGE_KEY = 'gotaviva_state_v1';

const DEFAULT_SETTINGS: UserSettings = {
  goalMode: 'auto',
  weightKg: 70,
  manualGoalMl: 2500,
  soundEnabled: true,
  theme: 'dark',
};

const VALID_CHALLENGE_IDS = new Set(CHALLENGES.map((c) => c.id));

function makeSeedEntry(
  id: string,
  beverageId: LogEntry['beverageId'],
  volumeMl: number,
  dateKey: string,
  hour: number,
  minute: number
): LogEntry {
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return {
    id,
    beverageId,
    volumeMl,
    hydratedMl: calculateHydratedMl(volumeMl, beverageId),
    timestamp: `${dateKey}T${hh}:${mm}:00`,
    hour,
  };
}

/**
 * Safely sanitizes legacy or corrupted mascot IDs (e.g., "lhama", "capivara", "gato")
 * into valid new mythical creature IDs, defaulting active mascot to "gnomo".
 */
export function sanitizeMascotId(rawId: unknown): MascotId {
  if (typeof rawId === 'string' && VALID_MASCOT_IDS.has(rawId)) {
    return rawId as MascotId;
  }
  return 'gnomo';
}

export function sanitizeUnlockedMascots(rawList: unknown): MascotId[] {
  const set = new Set<MascotId>(['gnomo', 'sapo-mago']);
  if (Array.isArray(rawList)) {
    for (const item of rawList) {
      if (typeof item === 'string' && VALID_MASCOT_IDS.has(item)) {
        set.add(item as MascotId);
      }
    }
  }
  return Array.from(set);
}

export function sanitizeGlassMaterialId(rawId: unknown): GlassMaterialId {
  if (typeof rawId === 'string' && rawId in GLASS_MATERIAL_MAP) {
    return rawId as GlassMaterialId;
  }
  return 'cristal';
}

export function sanitizeLiquidEffectId(rawId: unknown): LiquidEffectId {
  if (typeof rawId === 'string' && rawId in LIQUID_EFFECT_MAP) {
    return rawId as LiquidEffectId;
  }
  return 'nenhum';
}

export function createInitialState(todayKey: string = getDateKey()): AppState {
  const baseGoal = calculateBaseGoalMl(DEFAULT_SETTINGS);

  const d5 = addDaysToDateKey(todayKey, -5);
  const d4 = addDaysToDateKey(todayKey, -4);
  const d3 = addDaysToDateKey(todayKey, -3);
  const d2 = addDaysToDateKey(todayKey, -2);
  const d1 = addDaysToDateKey(todayKey, -1);

  const days: Record<string, DayRecord> = {
    [d5]: {
      dateKey: d5,
      goalMl: baseGoal,
      workoutBonusActive: false,
      celebratedGoal: false,
      entries: [
        makeSeedEntry('seed-d5-1', 'agua', 500, d5, 9, 15),
        makeSeedEntry('seed-d5-2', 'cafe', 200, d5, 11, 0),
        makeSeedEntry('seed-d5-3', 'agua', 450, d5, 16, 30),
      ],
    },
    [d4]: {
      dateKey: d4,
      goalMl: baseGoal,
      workoutBonusActive: false,
      celebratedGoal: false,
      entries: [
        makeSeedEntry('seed-d4-1', 'agua', 550, d4, 8, 45),
        makeSeedEntry('seed-d4-2', 'cha', 300, d4, 14, 20),
        makeSeedEntry('seed-d4-3', 'agua', 500, d4, 18, 10),
      ],
    },
    [d3]: {
      dateKey: d3,
      goalMl: baseGoal,
      workoutBonusActive: false,
      celebratedGoal: false,
      entries: [
        makeSeedEntry('seed-d3-1', 'agua', 450, d3, 9, 0),
        makeSeedEntry('seed-d3-2', 'suco', 250, d3, 12, 40),
        makeSeedEntry('seed-d3-3', 'agua', 450, d3, 17, 25),
      ],
    },
    [d2]: {
      dateKey: d2,
      goalMl: baseGoal,
      workoutBonusActive: false,
      celebratedGoal: false,
      entries: [
        makeSeedEntry('seed-d2-1', 'agua', 600, d2, 9, 30),
        makeSeedEntry('seed-d2-2', 'isotonico', 250, d2, 15, 0),
        makeSeedEntry('seed-d2-3', 'agua', 500, d2, 19, 15),
      ],
    },
    [d1]: {
      dateKey: d1,
      goalMl: baseGoal,
      workoutBonusActive: false,
      celebratedGoal: false,
      entries: [
        makeSeedEntry('seed-d1-1', 'agua', 650, d1, 8, 50),
        makeSeedEntry('seed-d1-2', 'cha', 300, d1, 13, 30),
        makeSeedEntry('seed-d1-3', 'agua', 550, d1, 18, 45),
      ],
    },
    [todayKey]: {
      dateKey: todayKey,
      goalMl: baseGoal,
      workoutBonusActive: false,
      celebratedGoal: false,
      entries: [
        makeSeedEntry('seed-today-1', 'agua', 450, todayKey, 8, 20),
        makeSeedEntry('seed-today-2', 'cafe', 200, todayKey, 10, 15),
        makeSeedEntry('seed-today-3', 'suco', 250, todayKey, 13, 40),
      ],
    },
  };

  return {
    currentDateKey: todayKey,
    activeMascotId: 'gnomo',
    unlockedMascotIds: ['gnomo', 'sapo-mago'],
    activeGlassMaterialId: 'cristal',
    unlockedGlassMaterialIds: ['cristal'],
    activeLiquidEffectId: 'nenhum',
    unlockedLiquidEffectIds: ['nenhum'],
    goldCoins: 180, // Lets user explore or immediately save/open 1 Gnome Chest!
    streakShields: 0,
    activeChallengeIds: ['sobrevivente-treino'],
    completedChallengeIds: [],
    bonusXp: 0,
    days,
    settings: DEFAULT_SETTINGS,
  };
}

/**
 * Pure migration helper so unit tests can directly verify legacy localStorage payloads
 * (e.g., old animal IDs "lhama" / "capivara") upgrade cleanly to the new schema.
 */
export function migrateParsedState(
  parsed: Partial<AppState> & Record<string, unknown>,
  realTodayKey: string = getDateKey()
): AppState {
  if (!parsed || typeof parsed !== 'object' || !parsed.days || !parsed.settings) {
    return createInitialState(realTodayKey);
  }

  const mergedSettings: UserSettings = {
    ...DEFAULT_SETTINGS,
    ...(parsed.settings as Partial<UserSettings>),
  };

  const unlockedMascots = sanitizeUnlockedMascots(parsed.unlockedMascotIds);
  let activeMascot = sanitizeMascotId(parsed.activeMascotId);
  if (!unlockedMascots.includes(activeMascot)) {
    activeMascot = 'gnomo';
  }

  const unlockedMaterialsSet = new Set<GlassMaterialId>(['cristal']);
  if (Array.isArray(parsed.unlockedGlassMaterialIds)) {
    for (const m of parsed.unlockedGlassMaterialIds) {
      unlockedMaterialsSet.add(sanitizeGlassMaterialId(m));
    }
  }
  const activeMaterial = sanitizeGlassMaterialId(parsed.activeGlassMaterialId);

  const unlockedEffectsSet = new Set<LiquidEffectId>(['nenhum']);
  if (Array.isArray(parsed.unlockedLiquidEffectIds)) {
    for (const e of parsed.unlockedLiquidEffectIds) {
      unlockedEffectsSet.add(sanitizeLiquidEffectId(e));
    }
  }
  const activeEffect = sanitizeLiquidEffectId(parsed.activeLiquidEffectId);

  const activeChallenges = Array.isArray(parsed.activeChallengeIds)
    ? parsed.activeChallengeIds.filter((id): id is string => VALID_CHALLENGE_IDS.has(String(id)))
    : ['sobrevivente-treino'];

  const completedChallenges = Array.isArray(parsed.completedChallengeIds)
    ? parsed.completedChallengeIds.filter((id): id is string =>
        VALID_CHALLENGE_IDS.has(String(id))
      )
    : [];

  const hydratedState: AppState = {
    currentDateKey:
      typeof parsed.currentDateKey === 'string' && parsed.currentDateKey
        ? parsed.currentDateKey
        : realTodayKey,
    activeMascotId: activeMascot,
    unlockedMascotIds: unlockedMascots,
    activeGlassMaterialId: unlockedMaterialsSet.has(activeMaterial)
      ? activeMaterial
      : 'cristal',
    unlockedGlassMaterialIds: Array.from(unlockedMaterialsSet),
    activeLiquidEffectId: unlockedEffectsSet.has(activeEffect) ? activeEffect : 'nenhum',
    unlockedLiquidEffectIds: Array.from(unlockedEffectsSet),
    goldCoins: typeof parsed.goldCoins === 'number' && parsed.goldCoins >= 0 ? parsed.goldCoins : 180,
    streakShields:
      typeof parsed.streakShields === 'number' && parsed.streakShields >= 0
        ? parsed.streakShields
        : 0,
    activeChallengeIds: activeChallenges,
    completedChallengeIds: completedChallenges,
    bonusXp: typeof parsed.bonusXp === 'number' ? parsed.bonusXp : 0,
    days: parsed.days as Record<string, DayRecord>,
    settings: mergedSettings,
  };

  if (realTodayKey > hydratedState.currentDateKey) {
    return rolloverToDate(hydratedState, realTodayKey);
  }

  if (!hydratedState.days[hydratedState.currentDateKey]) {
    hydratedState.days[hydratedState.currentDateKey] = {
      dateKey: hydratedState.currentDateKey,
      entries: [],
      goalMl: calculateBaseGoalMl(hydratedState.settings),
      workoutBonusActive: false,
      celebratedGoal: false,
    };
  }

  return hydratedState;
}

export function loadAppState(): AppState {
  const realTodayKey = getDateKey();
  if (typeof window === 'undefined') {
    return createInitialState(realTodayKey);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState(realTodayKey);
    }
    const parsed = JSON.parse(raw) as Partial<AppState> & Record<string, unknown>;
    return migrateParsedState(parsed, realTodayKey);
  } catch {
    return createInitialState(realTodayKey);
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota issues cleanly
  }
}

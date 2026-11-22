import {
  CHEST_COST_COINS,
  GLASS_MATERIALS,
  LIQUID_EFFECTS,
  SHIELD_COST_COINS,
} from '../data/alchemy';
import { BEVERAGE_MAP } from '../data/beverages';
import { CHALLENGES } from '../data/challenges';
import { MASCOTS } from '../data/mascots';
import {
  AppState,
  BeverageId,
  ChallengeDefinition,
  ChallengeStatus,
  DayRecord,
  GachaReward,
  LevelInfo,
  LiquidLayer,
  LogEntry,
  MascotId,
  RhythmComboStatus,
  UserSettings,
} from '../types/hydration';

export const WORKOUT_BONUS_ML = 500;
export const XP_PER_100ML = 10;
export const GOAL_COIN_REWARD = 100;
export const RHYTHM_COMBO_COIN_REWARD = 50;
export const RHYTHM_COMBO_XP_REWARD = 100;

const LEVEL_RANKS: Array<{ minLevel: number; title: string }> = [
  { minLevel: 1, title: 'Aprendiz do Frasco' },
  { minLevel: 2, title: 'Boticário da Nascente' },
  { minLevel: 3, title: 'Alquimista do Orvalho' },
  { minLevel: 4, title: 'Mestre das Poções' },
  { minLevel: 5, title: 'Guardião do Caldeirão' },
  { minLevel: 7, title: 'Sábio dos Elixires' },
  { minLevel: 10, title: 'Grão-Mago das Águas' },
  { minLevel: 14, title: 'Lenda Cristalina' },
];

export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

export function addDaysToDateKey(dateKey: string, deltaDays: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + deltaDays);
  return getDateKey(date);
}

export function formatMl(ml: number): string {
  return `${Math.round(ml).toLocaleString('pt-BR')} ml`;
}

export function formatLiters(ml: number): string {
  const liters = ml / 1000;
  return `${liters.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} L`;
}

export function calculateHydratedMl(volumeMl: number, beverageId: BeverageId): number {
  const bev = BEVERAGE_MAP[beverageId];
  if (!bev || volumeMl <= 0) return 0;
  return Math.round(volumeMl * bev.hydrationFactor);
}

/**
 * Awards +5 to +15 gold coins per logged drink scaled by volume, doubled if Rhythm Combo 2x is active.
 */
export function calculateDrinkCoins(volumeMl: number, rhythmComboActive: boolean): number {
  const base = Math.max(5, Math.min(15, Math.round(volumeMl / 40)));
  return rhythmComboActive ? base * 2 : base;
}

export function calculateBaseGoalMl(settings: UserSettings): number {
  if (settings.goalMode === 'manual') {
    return Math.max(800, Math.min(6000, Math.round(settings.manualGoalMl)));
  }
  const safeWeight = Math.max(30, Math.min(200, settings.weightKg));
  return Math.round((safeWeight * 35) / 50) * 50;
}

export function calculateDailyGoalMl(
  settings: UserSettings,
  workoutBonusActive: boolean
): number {
  return calculateBaseGoalMl(settings) + (workoutBonusActive ? WORKOUT_BONUS_ML : 0);
}

export function evaluateRhythmCombo(day: DayRecord | undefined): RhythmComboStatus {
  if (!day || day.entries.length === 0) {
    return {
      morning: false,
      afternoon: false,
      night: false,
      completedCount: 0,
      isComplete: false,
    };
  }
  let morning = false;
  let afternoon = false;
  let night = false;

  for (const entry of day.entries) {
    if (entry.hour < 12) morning = true;
    else if (entry.hour < 18) afternoon = true;
    else night = true;
  }

  const completedCount = Number(morning) + Number(afternoon) + Number(night);
  return {
    morning,
    afternoon,
    night,
    completedCount,
    isComplete: morning && afternoon && night,
  };
}

export function getDayTotals(day: DayRecord | undefined): {
  hydratedMl: number;
  rawMl: number;
  goalMl: number;
  rawPercent: number;
  clampedPercent: number;
  metGoal: boolean;
} {
  if (!day) {
    return {
      hydratedMl: 0,
      rawMl: 0,
      goalMl: 2450,
      rawPercent: 0,
      clampedPercent: 0,
      metGoal: false,
    };
  }
  const hydratedMl = day.entries.reduce((sum, e) => sum + e.hydratedMl, 0);
  const rawMl = day.entries.reduce((sum, e) => sum + e.volumeMl, 0);
  const goalMl = Math.max(1, day.goalMl);
  const rawPercent = Math.round((hydratedMl / goalMl) * 100);
  const clampedPercent = Math.max(0, Math.min(100, (hydratedMl / goalMl) * 100));
  return {
    hydratedMl,
    rawMl,
    goalMl,
    rawPercent,
    clampedPercent,
    metGoal: hydratedMl >= goalMl,
  };
}

export function computeLiquidLayers(entries: LogEntry[], dailyGoalMl: number): {
  layers: LiquidLayer[];
  totalHydratedMl: number;
  rawPercent: number;
  clampedPercent: number;
} {
  const safeGoal = Math.max(1, dailyGoalMl);
  const grouped = new Map<BeverageId, { hydratedMl: number; rawMl: number }>();

  for (const entry of entries) {
    const prev = grouped.get(entry.beverageId);
    if (prev) {
      prev.hydratedMl += entry.hydratedMl;
      prev.rawMl += entry.volumeMl;
    } else {
      grouped.set(entry.beverageId, {
        hydratedMl: entry.hydratedMl,
        rawMl: entry.volumeMl,
      });
    }
  }

  const totalHydratedMl = Array.from(grouped.values()).reduce(
    (sum, item) => sum + item.hydratedMl,
    0
  );
  const rawPercent = Math.round((totalHydratedMl / safeGoal) * 100);
  const clampedPercent = Math.max(0, Math.min(100, (totalHydratedMl / safeGoal) * 100));

  if (totalHydratedMl <= 0) {
    return { layers: [], totalHydratedMl: 0, rawPercent: 0, clampedPercent: 0 };
  }

  const scale = totalHydratedMl > safeGoal ? 100 / totalHydratedMl : 100 / safeGoal;
  let cursor = 0;
  const layers: LiquidLayer[] = [];

  for (const [beverageId, data] of grouped.entries()) {
    const bev = BEVERAGE_MAP[beverageId];
    const heightPercent = data.hydratedMl * scale;
    layers.push({
      beverageId,
      name: bev.shortName,
      color: bev.color,
      waveHighlight: bev.waveHighlight,
      rawMl: data.rawMl,
      hydratedMl: data.hydratedMl,
      startPercent: cursor,
      heightPercent,
    });
    cursor += heightPercent;
  }

  return {
    layers,
    totalHydratedMl,
    rawPercent,
    clampedPercent,
  };
}

export function calculateTotalHydratedMlAllTime(days: Record<string, DayRecord>): number {
  return Object.values(days).reduce(
    (total, day) => total + day.entries.reduce((s, e) => s + e.hydratedMl, 0),
    0
  );
}

export function calculateTotalXp(state: AppState): number {
  let drinkXp = 0;
  for (const day of Object.values(state.days)) {
    const dayHydrated = day.entries.reduce((sum, e) => sum + e.hydratedMl, 0);
    const rhythm = evaluateRhythmCombo(day);
    const mult = rhythm.isComplete ? 2 : 1;
    drinkXp += Math.floor(dayHydrated / 100) * XP_PER_100ML * mult;
  }
  return drinkXp + state.bonusXp;
}

export function calculateLevelInfo(totalXp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(totalXp));
  let level = 1;
  let remaining = safeXp;
  let needed = 250;

  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = 250 + (level - 1) * 75;
  }

  let title = LEVEL_RANKS[0].title;
  for (const rank of LEVEL_RANKS) {
    if (level >= rank.minLevel) {
      title = rank.title;
    }
  }

  return {
    level,
    title,
    currentXp: safeXp,
    xpIntoLevel: remaining,
    xpForNextLevel: needed,
    progressPercent: Math.min(100, Math.round((remaining / needed) * 100)),
  };
}

export function isPureWaterGoalDay(day: DayRecord | undefined): boolean {
  if (!day || day.entries.length === 0) return false;
  const totals = getDayTotals(day);
  if (!totals.metGoal) return false;
  return day.entries.every((e) => e.beverageId === 'agua');
}

export function calculateStreaks(
  days: Record<string, DayRecord>,
  currentDateKey: string
): { currentStreak: number; bestStreak: number; totalGoalDays: number } {
  const goalDateKeys = Object.values(days)
    .filter((d) => getDayTotals(d).metGoal)
    .map((d) => d.dateKey)
    .sort();

  const streakKeepingKeys = Object.values(days)
    .filter((d) => getDayTotals(d).metGoal || Boolean(d.shielded))
    .map((d) => d.dateKey)
    .sort();

  const totalGoalDays = goalDateKeys.length;
  const keepSet = new Set(streakKeepingKeys);

  let currentStreak = 0;
  let cursor = keepSet.has(currentDateKey)
    ? currentDateKey
    : addDaysToDateKey(currentDateKey, -1);

  while (keepSet.has(cursor)) {
    currentStreak += 1;
    cursor = addDaysToDateKey(cursor, -1);
  }

  let bestStreak = 0;
  let running = 0;
  let prevKey: string | null = null;

  for (const key of streakKeepingKeys) {
    if (prevKey && addDaysToDateKey(prevKey, 1) === key) {
      running += 1;
    } else {
      running = 1;
    }
    if (running > bestStreak) {
      bestStreak = running;
    }
    prevKey = key;
  }

  return { currentStreak, bestStreak, totalGoalDays };
}

export function evaluateChallengeStatus(
  challenge: ChallengeDefinition,
  state: AppState
): ChallengeStatus {
  const isActive = state.activeChallengeIds.includes(challenge.id);
  const alreadyCompleted = state.completedChallengeIds.includes(challenge.id);
  const today = state.days[state.currentDateKey];
  const todayTotals = getDayTotals(today);

  if (alreadyCompleted) {
    return {
      challenge,
      isActive,
      isCompleted: true,
      progressPercent: 100,
      progressLabel: 'Concluída',
    };
  }

  switch (challenge.type) {
    case 'pure_water': {
      const hasNonWater = Boolean(today?.entries.some((e) => e.beverageId !== 'agua'));
      if (hasNonWater) {
        return {
          challenge,
          isActive,
          isCompleted: false,
          progressPercent: 0,
          progressLabel: 'Outra bebida registrada hoje',
        };
      }
      const pct = Math.min(100, Math.round(todayTotals.clampedPercent));
      return {
        challenge,
        isActive,
        isCompleted: isActive && isPureWaterGoalDay(today),
        progressPercent: pct,
        progressLabel: `${formatMl(todayTotals.hydratedMl)} / ${formatMl(todayTotals.goalMl)} (só água)`,
      };
    }

    case 'morning_boost': {
      const morningMl = (today?.entries ?? [])
        .filter((e) => e.hour < 10)
        .reduce((sum, e) => sum + e.hydratedMl, 0);
      const target = 500;
      const pct = Math.min(100, Math.round((morningMl / target) * 100));
      return {
        challenge,
        isActive,
        isCompleted: isActive && morningMl >= target,
        progressPercent: pct,
        progressLabel: `${formatMl(morningMl)} / ${formatMl(target)} antes das 10h`,
      };
    }

    case 'athlete_mode': {
      const bonusOn = Boolean(today?.workoutBonusActive);
      const pct = bonusOn ? Math.min(100, Math.round(todayTotals.clampedPercent)) : 0;
      return {
        challenge,
        isActive,
        isCompleted: isActive && bonusOn && todayTotals.metGoal,
        progressPercent: pct,
        progressLabel: bonusOn
          ? `${pct}% da meta de treino (${formatMl(todayTotals.goalMl)})`
          : 'Ative o botão Treino / Calor',
      };
    }

    case 'variety_3': {
      const uniqueBeverages = new Set((today?.entries ?? []).map((e) => e.beverageId));
      const count = uniqueBeverages.size;
      const clamped = Math.min(3, count);
      return {
        challenge,
        isActive,
        isCompleted: isActive && count >= 3,
        progressPercent: Math.round((clamped / 3) * 100),
        progressLabel: `${clamped} / 3 bebidas diferentes hoje`,
      };
    }

    case 'streak_3': {
      const { currentStreak } = calculateStreaks(state.days, state.currentDateKey);
      const clamped = Math.min(3, currentStreak);
      return {
        challenge,
        isActive,
        isCompleted: isActive && currentStreak >= 3,
        progressPercent: Math.round((clamped / 3) * 100),
        progressLabel: `${clamped} / 3 dias seguidos`,
      };
    }
  }
}

export function evaluateUnlockedMascots(state: AppState): MascotId[] {
  const unlocked = new Set<MascotId>(state.unlockedMascotIds);
  const { currentStreak, bestStreak, totalGoalDays } = calculateStreaks(
    state.days,
    state.currentDateKey
  );
  const totalHydratedMl = calculateTotalHydratedMlAllTime(state.days);
  const hasPureWaterDay = Object.values(state.days).some((day) => isPureWaterGoalDay(day));
  const levelInfo = calculateLevelInfo(calculateTotalXp(state));

  let coffeeEntriesCount = 0;
  let nightEntriesCount = 0;
  let hasCompletedRhythm = false;

  for (const day of Object.values(state.days)) {
    if (evaluateRhythmCombo(day).isComplete) {
      hasCompletedRhythm = true;
    }
    for (const entry of day.entries) {
      if (entry.beverageId === 'cafe') coffeeEntriesCount += 1;
      if (entry.hour >= 18) nightEntriesCount += 1;
    }
  }

  for (const mascot of MASCOTS) {
    if (mascot.starterUnlocked) unlocked.add(mascot.id);
  }

  // Comuns
  if (totalGoalDays >= 1) unlocked.add('cogumelo');
  if (coffeeEntriesCount >= 3) unlocked.add('goblin-cafe');

  // Raros
  if (totalHydratedMl >= 10000) unlocked.add('nessie');
  if (hasPureWaterDay) unlocked.add('yeti');
  if (levelInfo.level >= 4) unlocked.add('et-varginha');
  if (state.completedChallengeIds.length >= 1) unlocked.add('troll');

  // Épicos
  if (hasCompletedRhythm) unlocked.add('saci');
  if (nightEntriesCount >= 3) unlocked.add('fantasma');
  if (Math.max(currentStreak, bestStreak) >= 3) unlocked.add('coruja-alquimista');

  // Lendários
  if (levelInfo.level >= 5) unlocked.add('dragao-bebe');
  if (totalGoalDays >= 5) unlocked.add('genio');
  if (totalHydratedMl >= 25000) unlocked.add('kraken');
  if (Math.max(currentStreak, bestStreak) >= 7) unlocked.add('mula-sem-cabeca');

  return MASCOTS.map((m) => m.id).filter((id) => unlocked.has(id));
}

export function syncGamificationState(state: AppState): {
  nextState: AppState;
  newlyUnlockedMascots: MascotId[];
  newlyCompletedChallengeIds: string[];
  coinsEarnedFromSync: number;
  rhythmJustCompleted: boolean;
} {
  let bonusXp = state.bonusXp;
  let goldCoins = state.goldCoins;
  let coinsEarnedFromSync = 0;
  const completedSet = new Set(state.completedChallengeIds);
  const newlyCompletedChallengeIds: string[] = [];

  for (const challenge of CHALLENGES) {
    if (completedSet.has(challenge.id)) continue;
    const status = evaluateChallengeStatus(challenge, state);
    if (status.isCompleted) {
      completedSet.add(challenge.id);
      bonusXp += challenge.xpReward;
      goldCoins += challenge.coinReward;
      coinsEarnedFromSync += challenge.coinReward;
      newlyCompletedChallengeIds.push(challenge.id);
    }
  }

  // Check Daily Rhythm Combo completion bonus
  const today = ensureDayRecord(state, state.currentDateKey);
  const rhythm = evaluateRhythmCombo(today);
  let rhythmJustCompleted = false;
  let nextDays = state.days;

  if (rhythm.isComplete && !today.rhythmBonusClaimed) {
    rhythmJustCompleted = true;
    bonusXp += RHYTHM_COMBO_XP_REWARD;
    goldCoins += RHYTHM_COMBO_COIN_REWARD;
    coinsEarnedFromSync += RHYTHM_COMBO_COIN_REWARD;
    nextDays = {
      ...state.days,
      [state.currentDateKey]: {
        ...today,
        rhythmBonusClaimed: true,
      },
    };
  }

  const intermediateState: AppState = {
    ...state,
    bonusXp,
    goldCoins,
    days: nextDays,
    completedChallengeIds: Array.from(completedSet),
  };

  const prevUnlocked = new Set(state.unlockedMascotIds);
  const evaluatedUnlocked = evaluateUnlockedMascots(intermediateState);
  const newlyUnlockedMascots = evaluatedUnlocked.filter((id) => !prevUnlocked.has(id));

  return {
    nextState: {
      ...intermediateState,
      unlockedMascotIds: evaluatedUnlocked,
    },
    newlyUnlockedMascots,
    newlyCompletedChallengeIds,
    coinsEarnedFromSync,
    rhythmJustCompleted,
  };
}

/**
 * Returns every unowned gacha item (creatures, glass materials, liquid effects)
 * so the Gnome Chest NEVER grants duplicates.
 */
export function getAvailableGachaPool(state: AppState): GachaReward[] {
  const pool: GachaReward[] = [];
  const ownedMascots = new Set(state.unlockedMascotIds);
  const ownedMaterials = new Set(state.unlockedGlassMaterialIds);
  const ownedEffects = new Set(state.unlockedLiquidEffectIds);

  for (const m of MASCOTS) {
    if (!ownedMascots.has(m.id)) {
      pool.push({
        kind: 'mascot',
        id: m.id,
        name: m.name,
        subtitle: m.subtitle,
        rarity: m.rarity,
      });
    }
  }

  for (const mat of GLASS_MATERIALS) {
    if (!ownedMaterials.has(mat.id)) {
      pool.push({
        kind: 'material',
        id: mat.id,
        name: mat.name,
        subtitle: mat.description,
        rarity: mat.rarity,
      });
    }
  }

  for (const eff of LIQUID_EFFECTS) {
    if (!ownedEffects.has(eff.id)) {
      pool.push({
        kind: 'effect',
        id: eff.id,
        name: eff.name,
        subtitle: eff.description,
        rarity: eff.rarity,
      });
    }
  }

  return pool;
}

/**
 * Opens the Gnome's Mystery Chest for 150 gold coins and guarantees a new unowned item.
 */
export function openGnomeChest(
  state: AppState,
  randomFn: () => number = Math.random
): { nextState: AppState; reward: GachaReward | null; error?: string } {
  if (state.goldCoins < CHEST_COST_COINS) {
    return { nextState: state, reward: null, error: 'Moedas de Ouro insuficientes.' };
  }

  const pool = getAvailableGachaPool(state);
  if (pool.length === 0) {
    return { nextState: state, reward: null, error: 'Você já colecionou todos os itens do Baú!' };
  }

  // Slight weighting favoring common/rare early while keeping epic/legendary exciting
  const weights: Record<GachaReward['rarity'], number> = {
    comum: 3.5,
    raro: 2.6,
    epico: 1.8,
    lendario: 1.1,
  };
  const totalWeight = pool.reduce((sum, item) => sum + weights[item.rarity], 0);
  let pick = Math.min(0.999999, Math.max(0, randomFn())) * totalWeight;
  let chosen = pool[0];
  for (const item of pool) {
    pick -= weights[item.rarity];
    if (pick <= 0) {
      chosen = item;
      break;
    }
  }

  const nextMascots = new Set(state.unlockedMascotIds);
  const nextMaterials = new Set(state.unlockedGlassMaterialIds);
  const nextEffects = new Set(state.unlockedLiquidEffectIds);

  if (chosen.kind === 'mascot') {
    nextMascots.add(chosen.id);
  } else if (chosen.kind === 'material') {
    nextMaterials.add(chosen.id);
  } else {
    nextEffects.add(chosen.id);
  }

  const nextState: AppState = {
    ...state,
    goldCoins: state.goldCoins - CHEST_COST_COINS,
    unlockedMascotIds: MASCOTS.map((m) => m.id).filter((id) => nextMascots.has(id)),
    unlockedGlassMaterialIds: GLASS_MATERIALS.map((m) => m.id).filter((id) =>
      nextMaterials.has(id)
    ),
    unlockedLiquidEffectIds: LIQUID_EFFECTS.map((e) => e.id).filter((id) =>
      nextEffects.has(id)
    ),
  };

  return { nextState, reward: chosen };
}

export function buyStreakShield(state: AppState): {
  nextState: AppState;
  purchased: boolean;
} {
  if (state.goldCoins < SHIELD_COST_COINS) {
    return { nextState: state, purchased: false };
  }
  return {
    purchased: true,
    nextState: {
      ...state,
      goldCoins: state.goldCoins - SHIELD_COST_COINS,
      streakShields: state.streakShields + 1,
    },
  };
}

export interface WeeklyBarPoint {
  dateKey: string;
  weekdayLabel: string;
  dayNumber: number;
  hydratedMl: number;
  goalMl: number;
  metGoal: boolean;
  shielded: boolean;
  isToday: boolean;
  primaryColor: string;
}

const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function buildWeeklyChartData(state: AppState): WeeklyBarPoint[] {
  const defaultGoal = calculateBaseGoalMl(state.settings);
  const points: WeeklyBarPoint[] = [];

  for (let offset = -6; offset <= 0; offset += 1) {
    const key = addDaysToDateKey(state.currentDateKey, offset);
    const date = parseDateKey(key);
    const record = state.days[key];
    const totals = record
      ? getDayTotals(record)
      : { hydratedMl: 0, goalMl: defaultGoal, metGoal: false };

    let primaryColor = '#0EA5E9';
    if (record && record.entries.length > 0) {
      const counts = new Map<BeverageId, number>();
      for (const e of record.entries) {
        counts.set(e.beverageId, (counts.get(e.beverageId) ?? 0) + e.hydratedMl);
      }
      let bestBev: BeverageId = 'agua';
      let bestVol = -1;
      for (const [bId, vol] of counts.entries()) {
        if (vol > bestVol) {
          bestVol = vol;
          bestBev = bId;
        }
      }
      primaryColor = BEVERAGE_MAP[bestBev].color;
    }

    points.push({
      dateKey: key,
      weekdayLabel: WEEKDAYS_PT[date.getDay()],
      dayNumber: date.getDate(),
      hydratedMl: totals.hydratedMl,
      goalMl: totals.goalMl,
      metGoal: totals.metGoal,
      shielded: Boolean(record?.shielded),
      isToday: offset === 0,
      primaryColor,
    });
  }

  return points;
}

export interface CalendarCell {
  dateKey: string | null;
  dayNumber: number | null;
  metGoal: boolean;
  shielded: boolean;
  hasActivity: boolean;
  isToday: boolean;
  percent: number;
}

export function buildMonthlyCalendarData(
  state: AppState,
  year: number,
  monthIndex: number
): CalendarCell[] {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingEmpty = firstDay.getDay();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < leadingEmpty; i += 1) {
    cells.push({
      dateKey: null,
      dayNumber: null,
      metGoal: false,
      shielded: false,
      hasActivity: false,
      isToday: false,
      percent: 0,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = state.days[key];
    const totals = record ? getDayTotals(record) : null;
    cells.push({
      dateKey: key,
      dayNumber: day,
      metGoal: Boolean(totals?.metGoal),
      shielded: Boolean(record?.shielded),
      hasActivity: Boolean(totals && totals.hydratedMl > 0),
      isToday: key === state.currentDateKey,
      percent: totals ? Math.min(100, totals.rawPercent) : 0,
    });
  }

  return cells;
}

export function computeOverallStats(state: AppState): {
  totalHydratedMl: number;
  bestStreak: number;
  currentStreak: number;
  totalGoalDays: number;
  favoriteBeverageId: BeverageId;
  favoriteBeverageName: string;
} {
  const totalHydratedMl = calculateTotalHydratedMlAllTime(state.days);
  const { currentStreak, bestStreak, totalGoalDays } = calculateStreaks(
    state.days,
    state.currentDateKey
  );

  const bevTotals = new Map<BeverageId, number>();
  for (const day of Object.values(state.days)) {
    for (const entry of day.entries) {
      bevTotals.set(entry.beverageId, (bevTotals.get(entry.beverageId) ?? 0) + entry.volumeMl);
    }
  }

  let favoriteBeverageId: BeverageId = 'agua';
  let maxVol = -1;
  for (const [bevId, vol] of bevTotals.entries()) {
    if (vol > maxVol) {
      maxVol = vol;
      favoriteBeverageId = bevId;
    }
  }

  return {
    totalHydratedMl,
    bestStreak,
    currentStreak,
    totalGoalDays,
    favoriteBeverageId,
    favoriteBeverageName: BEVERAGE_MAP[favoriteBeverageId].shortName,
  };
}

export function ensureDayRecord(state: AppState, dateKey: string): DayRecord {
  const existing = state.days[dateKey];
  if (existing) return existing;
  return {
    dateKey,
    entries: [],
    goalMl: calculateBaseGoalMl(state.settings),
    workoutBonusActive: false,
    celebratedGoal: false,
  };
}

/**
 * Advances to targetDateKey. If the previous day missed its goal while the user had an active
 * streak AND holds a Streak Shield, automatically consumes 1 shield to protect the streak!
 */
export function rolloverToDate(state: AppState, targetDateKey: string): AppState {
  if (state.currentDateKey === targetDateKey) {
    return state;
  }

  const nextDays: Record<string, DayRecord> = { ...state.days };
  let shieldsRemaining = state.streakShields;

  // Check if the departing day missed its goal and needs automatic shield protection
  const prevDayKey = state.currentDateKey;
  const prevDay = nextDays[prevDayKey];
  if (prevDay && !getDayTotals(prevDay).metGoal && !prevDay.shielded && shieldsRemaining > 0) {
    const streakBeforeToday = calculateStreaks(state.days, addDaysToDateKey(prevDayKey, -1))
      .currentStreak;
    if (streakBeforeToday > 0) {
      nextDays[prevDayKey] = {
        ...prevDay,
        shielded: true,
      };
      shieldsRemaining -= 1;
    }
  }

  if (!nextDays[targetDateKey]) {
    nextDays[targetDateKey] = {
      dateKey: targetDateKey,
      entries: [],
      goalMl: calculateBaseGoalMl(state.settings),
      workoutBonusActive: false,
      celebratedGoal: false,
    };
  }

  return {
    ...state,
    currentDateKey: targetDateKey,
    streakShields: shieldsRemaining,
    days: nextDays,
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDaysToDateKey,
  buyStreakShield,
  calculateDailyGoalMl,
  calculateDrinkCoins,
  calculateHydratedMl,
  calculateStreaks,
  computeLiquidLayers,
  evaluateRhythmCombo,
  getAvailableGachaPool,
  openGnomeChest,
  rolloverToDate,
  syncGamificationState,
} from './hydration';
import { createInitialState, migrateParsedState } from './storage';
import { MASCOTS } from '../data/mascots';
import { pickSpeechLine, formatTimeSinceLastSip } from '../data/dialogue';
import { AppState, LogEntry } from '../types/hydration';

test('all 16 mythical creatures exist across 4 rarities with starter unlocks gnomo and sapo-mago', () => {
  assert.equal(MASCOTS.length, 16);
  const byRarity = {
    comum: MASCOTS.filter((m) => m.rarity === 'comum').length,
    raro: MASCOTS.filter((m) => m.rarity === 'raro').length,
    epico: MASCOTS.filter((m) => m.rarity === 'epico').length,
    lendario: MASCOTS.filter((m) => m.rarity === 'lendario').length,
  };
  assert.deepEqual(byRarity, { comum: 4, raro: 4, epico: 4, lendario: 4 });

  const init = createInitialState('2026-11-21');
  assert.deepEqual(init.unlockedMascotIds, ['gnomo', 'sapo-mago']);
  assert.equal(init.activeMascotId, 'gnomo');
});

test('legacy localStorage migration converts old animal IDs (lhama, capivara) safely to gnomo', () => {
  const legacyPayload = {
    currentDateKey: '2026-11-21',
    activeMascotId: 'lhama',
    unlockedMascotIds: ['lhama', 'capivara', 'gato'],
    activeChallengeIds: ['dia-puro'],
    completedChallengeIds: ['dia-puro'],
    bonusXp: 150,
    days: {
      '2026-11-21': {
        dateKey: '2026-11-21',
        entries: [],
        goalMl: 2450,
        workoutBonusActive: false,
        celebratedGoal: false,
      },
    },
    settings: {
      goalMode: 'auto' as const,
      weightKg: 72,
      manualGoalMl: 2500,
      soundEnabled: true,
      theme: 'dark' as const,
    },
  };

  const migrated = migrateParsedState(legacyPayload as unknown as Record<string, unknown>, '2026-11-21');
  assert.equal(migrated.activeMascotId, 'gnomo');
  assert.ok(migrated.unlockedMascotIds.includes('gnomo'));
  assert.ok(migrated.unlockedMascotIds.includes('sapo-mago'));
  assert.equal(migrated.activeGlassMaterialId, 'cristal');
  assert.equal(migrated.activeLiquidEffectId, 'nenhum');
  assert.equal(migrated.settings.weightKg, 72);
});

test('hydration factors, goals, drink coins, and Rhythm Combo 2x bonus calculate accurately', () => {
  assert.equal(calculateHydratedMl(250, 'agua'), 250);
  assert.equal(calculateHydratedMl(200, 'cafe'), 160);
  assert.equal(calculateHydratedMl(500, 'isotonico'), 550);
  assert.equal(calculateHydratedMl(350, 'refrigerante'), 263);

  assert.equal(
    calculateDailyGoalMl(
      { goalMode: 'auto', weightKg: 80, manualGoalMl: 2000, soundEnabled: true, theme: 'dark' },
      true
    ),
    3300
  );

  // Drink coins scale 5..15 and double with Rhythm Combo
  assert.equal(calculateDrinkCoins(150, false), 5);
  assert.equal(calculateDrinkCoins(400, false), 10);
  assert.equal(calculateDrinkCoins(600, false), 15);
  assert.equal(calculateDrinkCoins(400, true), 20);

  const entries: LogEntry[] = [
    { id: 'm', beverageId: 'agua', volumeMl: 300, hydratedMl: 300, timestamp: '', hour: 9 },
    { id: 'a', beverageId: 'cha', volumeMl: 300, hydratedMl: 285, timestamp: '', hour: 15 },
    { id: 'n', beverageId: 'agua', volumeMl: 300, hydratedMl: 300, timestamp: '', hour: 20 },
  ];
  const combo = evaluateRhythmCombo({
    dateKey: '2026-11-21',
    entries,
    goalMl: 2450,
    workoutBonusActive: false,
    celebratedGoal: false,
  });
  assert.equal(combo.isComplete, true);
  assert.equal(combo.completedCount, 3);
});

test('Gnome Chest gacha never grants duplicates and Streak Shield protects missed days', () => {
  const init = createInitialState('2026-11-21');
  const richState: AppState = { ...init, goldCoins: 600 };

  const initialPoolSize = getAvailableGachaPool(richState).length;
  // 14 locked creatures + 4 locked glass materials + 4 locked liquid effects = 22
  assert.equal(initialPoolSize, 22);

  const open1 = openGnomeChest(richState, () => 0.1);
  assert.ok(open1.reward !== null);
  assert.equal(open1.nextState.goldCoins, 450);
  assert.equal(getAvailableGachaPool(open1.nextState).length, initialPoolSize - 1);

  // Buy Streak Shield (200 gold)
  const shieldRes = buyStreakShield(open1.nextState);
  assert.equal(shieldRes.purchased, true);
  assert.equal(shieldRes.nextState.goldCoins, 250);
  assert.equal(shieldRes.nextState.streakShields, 1);

  // Verify Streak Shield automatically protects streak on rollover after a missed day
  const d1 = '2026-11-20';
  const d2 = '2026-11-21';
  const d3 = '2026-11-22';
  const streakState: AppState = {
    ...shieldRes.nextState,
    currentDateKey: d2,
    days: {
      [d1]: {
        dateKey: d1,
        goalMl: 2000,
        workoutBonusActive: false,
        celebratedGoal: true,
        entries: [{ id: '1', beverageId: 'agua', volumeMl: 2000, hydratedMl: 2000, timestamp: '', hour: 10 }],
      },
      [d2]: {
        dateKey: d2,
        goalMl: 2000,
        workoutBonusActive: false,
        celebratedGoal: false,
        entries: [], // Missed goal on d2!
      },
    },
  };

  const rolled = rolloverToDate(streakState, d3);
  assert.equal(rolled.streakShields, 0);
  assert.equal(rolled.days[d2].shielded, true);
  assert.equal(calculateStreaks(rolled.days, d3).currentStreak, 2);
});

test('liquid layers, tavern mission completion, and sarcastic dialogue behave cleanly', () => {
  const init = createInitialState('2026-11-21');
  const today = init.days['2026-11-21'];
  const layers = computeLiquidLayers(today.entries, today.goalMl);
  assert.equal(layers.layers.length, 3);

  // Complete Alquimista Curioso (3 different drinks today — already in seed!)
  const withMission: AppState = {
    ...init,
    activeChallengeIds: ['alquimista-curioso'],
  };
  const synced = syncGamificationState(withMission);
  assert.ok(synced.newlyCompletedChallengeIds.includes('alquimista-curioso'));
  assert.ok(synced.coinsEarnedFromSync >= 75);
  assert.ok(synced.newlyUnlockedMascots.includes('troll')); // 1 mission completed!

  // Dialogue checks
  const coffeeLine = pickSpeechLine({ type: 'beverage', beverageId: 'cafe' }, 0);
  assert.ok(coffeeLine.length > 10);
  const dryCheck = formatTimeSinceLastSip('2026-11-21T08:00:00', Date.parse('2026-11-21T11:30:00'));
  assert.equal(dryCheck.isOverTwoHours, true);
  assert.equal(addDaysToDateKey('2026-11-21', 1), '2026-11-22');
});

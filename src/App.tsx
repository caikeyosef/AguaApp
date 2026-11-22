import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Coins,
  Crown,
  Droplets,
  Moon,
  ScrollText,
  Settings,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CelebrationModal, CelebrationPayload } from './components/CelebrationModal';
import { ChallengesTab } from './components/ChallengesTab';
import { CollectionTab } from './components/CollectionTab';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { HistoryTab } from './components/HistoryTab';
import { QuickLogSheet } from './components/QuickLogSheet';
import { SettingsModal } from './components/SettingsModal';
import { TodayTab } from './components/TodayTab';
import {
  GLASS_MATERIAL_MAP,
  LIQUID_EFFECT_MAP,
  SHIELD_COST_COINS,
} from './data/alchemy';
import { BEVERAGE_MAP } from './data/beverages';
import { CHALLENGES } from './data/challenges';
import { formatTimeSinceLastSip, pickSpeechLine } from './data/dialogue';
import { MASCOT_MAP } from './data/mascots';
import {
  AppState,
  BeverageId,
  GachaReward,
  GlassMaterialId,
  LiquidEffectId,
  LogEntry,
  MascotId,
  TabId,
  UserSettings,
} from './types/hydration';
import {
  addDaysToDateKey,
  buyStreakShield,
  calculateDailyGoalMl,
  calculateDrinkCoins,
  calculateHydratedMl,
  calculateLevelInfo,
  calculateStreaks,
  calculateTotalXp,
  computeLiquidLayers,
  ensureDayRecord,
  evaluateChallengeStatus,
  evaluateRhythmCombo,
  formatMl,
  getAvailableGachaPool,
  getDateKey,
  getDayTotals,
  GOAL_COIN_REWARD,
  openGnomeChest,
  rolloverToDate,
  syncGamificationState,
} from './utils/hydration';
import { useGyroscopeTilt } from './hooks/useGyroscopeTilt';
import {
  playCelebrationChord,
  playDropletSound,
  playTapSound,
} from './utils/sound';
import { createInitialState, loadAppState, saveAppState } from './utils/storage';

const NAV_TABS: Array<{
  id: TabId;
  label: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: 'hoje', label: 'Hoje', icon: Droplets },
  { id: 'missoes', label: 'Missões', icon: ScrollText },
  { id: 'colecao', label: 'Coleção', icon: Crown },
  { id: 'historico', label: 'Histórico', icon: BarChart3 },
];

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<TabId>('hoje');
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bubbleBurstKey, setBubbleBurstKey] = useState(0);
  const [squishKey, setSquishKey] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  const [celebration, setCelebration] = useState<CelebrationPayload | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [speechState, setSpeechState] = useState<{ text: string; key: number }>(() => {
    const initial = loadAppState();
    const todayRec = ensureDayRecord(initial, initial.currentDateKey);
    const totals = getDayTotals(todayRec);
    const lastEntry = todayRec.entries[todayRec.entries.length - 1] ?? null;
    const timing = formatTimeSinceLastSip(lastEntry?.timestamp ?? null);

    if (totals.metGoal) {
      return { text: pickSpeechLine({ type: 'goal_reached' }, 0), key: 1 };
    }
    if (timing.isOverTwoHours || totals.rawPercent < 30) {
      return { text: pickSpeechLine({ type: 'dry_spell' }, 0), key: 1 };
    }
    return {
      text: pickSpeechLine(
        lastEntry ? { type: 'beverage', beverageId: lastEntry.beverageId } : { type: 'idle' },
        0
      ),
      key: 1,
    };
  });

  // Persist every state change to localStorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Sync Tailwind v4 dark class & PWA theme-color meta tag
  useEffect(() => {
    const isDark = state.settings.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#07090F' : '#F5F6F8');
    }
  }, [state.settings.theme]);

  // Check real calendar day rollover when window regains focus
  useEffect(() => {
    const checkRollover = () => {
      const realToday = getDateKey();
      setState((prev) => {
        if (realToday > prev.currentDateKey) {
          return rolloverToDate(prev, realToday);
        }
        return prev;
      });
    };
    window.addEventListener('focus', checkRollover);
    return () => window.removeEventListener('focus', checkRollover);
  }, []);

  // Auto-hide transient toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Auto-stop confetti canvas after burst completes
  useEffect(() => {
    if (!confettiActive) return;
    const timer = window.setTimeout(() => setConfettiActive(false), 3200);
    return () => window.clearTimeout(timer);
  }, [confettiActive]);

  const today = useMemo(() => ensureDayRecord(state, state.currentDateKey), [state]);

  const liquidSummary = useMemo(
    () => computeLiquidLayers(today.entries, today.goalMl),
    [today.entries, today.goalMl]
  );

  const streakInfo = useMemo(
    () => calculateStreaks(state.days, state.currentDateKey),
    [state.days, state.currentDateKey]
  );

  const levelInfo = useMemo(() => calculateLevelInfo(calculateTotalXp(state)), [state]);

  const rhythmCombo = useMemo(() => evaluateRhythmCombo(today), [today]);

  const challengeStatuses = useMemo(
    () => CHALLENGES.map((c) => evaluateChallengeStatus(c, state)),
    [state]
  );

  const remainingGachaCount = useMemo(() => getAvailableGachaPool(state).length, [state]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const { gyroEnabled, gyroTiltPx, toggleGyroscope } = useGyroscopeTilt(showToast);

  const updateSpeech = (text: string) => {
    setSpeechState((prev) => ({ text, key: prev.key + 1 }));
  };

  const applyStateWithGamification = (
    draft: AppState,
    options?: { forceCheckCelebration?: boolean; directCoins?: number }
  ) => {
    const draftToday = ensureDayRecord(draft, draft.currentDateKey);
    const totals = getDayTotals(draftToday);
    const justHitGoal = totals.metGoal && !draftToday.celebratedGoal;

    const goalBonusCoins = justHitGoal ? GOAL_COIN_REWARD : 0;

    const markedDraft: AppState = justHitGoal
      ? {
          ...draft,
          goldCoins: draft.goldCoins + goalBonusCoins,
          days: {
            ...draft.days,
            [draft.currentDateKey]: {
              ...draftToday,
              celebratedGoal: true,
            },
          },
        }
      : draft;

    const {
      nextState,
      newlyUnlockedMascots,
      newlyCompletedChallengeIds,
      coinsEarnedFromSync,
      rhythmJustCompleted,
    } = syncGamificationState(markedDraft);

    setState(nextState);

    if (justHitGoal) {
      updateSpeech(pickSpeechLine({ type: 'goal_reached' }, speechState.key + 1));
    } else if (rhythmJustCompleted) {
      showToast('Combo de Ritmo completo! Bônus 2x XP & Ouro ativado!');
    }

    const totalModalCoins = goalBonusCoins + coinsEarnedFromSync;
    const shouldCelebrate =
      justHitGoal ||
      newlyUnlockedMascots.length > 0 ||
      (Boolean(options?.forceCheckCelebration) && newlyCompletedChallengeIds.length > 0);

    if (shouldCelebrate) {
      playCelebrationChord(nextState.settings.soundEnabled);
      setConfettiActive(true);
      const completedTitles = newlyCompletedChallengeIds
        .map((id) => CHALLENGES.find((c) => c.id === id)?.title)
        .filter((t): t is string => Boolean(t));

      setCelebration({
        goalReached: justHitGoal,
        unlockedMascotIds: newlyUnlockedMascots,
        completedChallengeTitles: completedTitles,
        coinsEarned: totalModalCoins,
        goalMl: draftToday.goalMl,
      });
    } else if (newlyCompletedChallengeIds.length > 0) {
      playCelebrationChord(nextState.settings.soundEnabled);
      const title = CHALLENGES.find((c) => c.id === newlyCompletedChallengeIds[0])?.title;
      if (title) {
        showToast(`Missão concluída: ${title}! (+${coinsEarnedFromSync} Ouro)`);
      }
    }
  };

  const handleTapMascot = () => {
    playDropletSound(state.settings.soundEnabled);
    setSquishKey((k) => k + 1);

    const lastEntry = today.entries[today.entries.length - 1] ?? null;
    const timing = formatTimeSinceLastSip(lastEntry?.timestamp ?? null);

    if (liquidSummary.rawPercent >= 100) {
      updateSpeech(pickSpeechLine({ type: 'goal_reached' }, speechState.key + 1));
    } else if (liquidSummary.rawPercent < 30 || timing.isOverTwoHours) {
      updateSpeech(pickSpeechLine({ type: 'dry_spell' }, speechState.key + 1));
    } else {
      updateSpeech(pickSpeechLine({ type: 'tap' }, speechState.key + 1));
    }
  };

  const handleLogBeverage = (beverageId: BeverageId, volumeMl: number) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      beverageId,
      volumeMl,
      hydratedMl: calculateHydratedMl(volumeMl, beverageId),
      timestamp: `${state.currentDateKey}T${hh}:${mm}:${ss}`,
      hour: now.getHours(),
    };

    const currentDay = ensureDayRecord(state, state.currentDateKey);
    const updatedDay = {
      ...currentDay,
      entries: [...currentDay.entries, newEntry],
    };

    const comboNow = evaluateRhythmCombo(updatedDay);
    const earnedCoins = calculateDrinkCoins(volumeMl, comboNow.isComplete);

    const nextDraft: AppState = {
      ...state,
      goldCoins: state.goldCoins + earnedCoins,
      days: {
        ...state.days,
        [state.currentDateKey]: updatedDay,
      },
    };

    playDropletSound(state.settings.soundEnabled);
    setBubbleBurstKey((k) => k + 1);
    const bev = BEVERAGE_MAP[beverageId];
    updateSpeech(pickSpeechLine({ type: 'beverage', beverageId }, speechState.key + 1));
    showToast(`+${formatMl(newEntry.hydratedMl)} (${bev.shortName}) · +${earnedCoins} Ouro`);
    applyStateWithGamification(nextDraft, { directCoins: earnedCoins });
  };

  const handleDeleteEntry = (entryId: string) => {
    const currentDay = ensureDayRecord(state, state.currentDateKey);
    const removed = currentDay.entries.find((e) => e.id === entryId);
    if (!removed) return;

    const updatedEntries = currentDay.entries.filter((e) => e.id !== entryId);
    playTapSound(state.settings.soundEnabled);
    setState((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [prev.currentDateKey]: {
          ...currentDay,
          entries: updatedEntries,
        },
      },
    }));
    showToast(`Registro de ${BEVERAGE_MAP[removed.beverageId].shortName} removido`);
  };

  const handleToggleWorkoutBonus = () => {
    const currentDay = ensureDayRecord(state, state.currentDateKey);
    const nextBonus = !currentDay.workoutBonusActive;
    const nextGoalMl = calculateDailyGoalMl(state.settings, nextBonus);

    playTapSound(state.settings.soundEnabled);

    const nextDraft: AppState = {
      ...state,
      days: {
        ...state.days,
        [state.currentDateKey]: {
          ...currentDay,
          workoutBonusActive: nextBonus,
          goalMl: nextGoalMl,
        },
      },
    };

    if (nextBonus) {
      updateSpeech(pickSpeechLine({ type: 'workout' }, speechState.key + 1));
    }
    showToast(
      nextBonus
        ? `Dia de Treino ativado: meta +500 ml (${formatMl(nextGoalMl)})`
        : `Bônus de treino desativado (${formatMl(nextGoalMl)})`
    );
    applyStateWithGamification(nextDraft);
  };

  const handleUpdateSettings = (partial: Partial<UserSettings>) => {
    const nextSettings: UserSettings = {
      ...state.settings,
      ...partial,
    };
    const currentDay = ensureDayRecord(state, state.currentDateKey);
    const nextGoalMl = calculateDailyGoalMl(nextSettings, currentDay.workoutBonusActive);

    const nextDraft: AppState = {
      ...state,
      settings: nextSettings,
      days: {
        ...state.days,
        [state.currentDateKey]: {
          ...currentDay,
          goalMl: nextGoalMl,
        },
      },
    };

    applyStateWithGamification(nextDraft);
  };

  const handleToggleChallenge = (challengeId: string) => {
    const isAlreadyActive = state.activeChallengeIds.includes(challengeId);
    const nextActive = isAlreadyActive
      ? state.activeChallengeIds.filter((id) => id !== challengeId)
      : [...state.activeChallengeIds, challengeId];

    playTapSound(state.settings.soundEnabled);
    const nextDraft: AppState = {
      ...state,
      activeChallengeIds: nextActive,
    };
    applyStateWithGamification(nextDraft);
  };

  const handleSelectMascot = (mascotId: MascotId) => {
    if (!state.unlockedMascotIds.includes(mascotId)) return;
    playTapSound(state.settings.soundEnabled);
    setState((prev) => ({
      ...prev,
      activeMascotId: mascotId,
    }));
    showToast(`Criatura equipada: ${MASCOT_MAP[mascotId].name}`);
  };

  const handleSelectGlassMaterial = (materialId: GlassMaterialId) => {
    if (!state.unlockedGlassMaterialIds.includes(materialId)) return;
    playTapSound(state.settings.soundEnabled);
    setState((prev) => ({
      ...prev,
      activeGlassMaterialId: materialId,
    }));
    showToast(`Vidro equipado: ${GLASS_MATERIAL_MAP[materialId].name}`);
  };

  const handleSelectLiquidEffect = (effectId: LiquidEffectId) => {
    if (!state.unlockedLiquidEffectIds.includes(effectId)) return;
    playTapSound(state.settings.soundEnabled);
    setState((prev) => ({
      ...prev,
      activeLiquidEffectId: effectId,
    }));
    showToast(`Efeito equipado: ${LIQUID_EFFECT_MAP[effectId].name}`);
  };

  const handleOpenChest = (): GachaReward | null => {
    const { nextState, reward, error } = openGnomeChest(state);
    if (!reward) {
      if (error) showToast(error);
      return null;
    }

    // Unlock Mimic automatically on first chest opened if not already awarded
    const finalMascots = new Set(nextState.unlockedMascotIds);
    finalMascots.add('mimico');
    const updatedState: AppState = {
      ...nextState,
      unlockedMascotIds: Array.from(finalMascots),
    };

    playCelebrationChord(state.settings.soundEnabled);
    setConfettiActive(true);
    setState(updatedState);
    return reward;
  };

  const handleBuyStreakShield = () => {
    const { nextState, purchased } = buyStreakShield(state);
    if (!purchased) {
      showToast(`Precisa de ${SHIELD_COST_COINS} Moedas de Ouro`);
      return;
    }
    playCelebrationChord(state.settings.soundEnabled);
    setState(nextState);
    showToast('Escudo de Ofensiva adicionado ao inventário!');
  };

  const handleTestAdvanceDay = () => {
    const nextDateKey = addDaysToDateKey(state.currentDateKey, 1);
    const rolled = rolloverToDate(state, nextDateKey);
    const usedShield = rolled.streakShields < state.streakShields;
    playTapSound(state.settings.soundEnabled);
    setState(rolled);
    updateSpeech(pickSpeechLine({ type: 'dry_spell' }, speechState.key + 1));
    const [y, m, d] = nextDateKey.split('-');
    showToast(
      usedShield
        ? `Novo dia (${d}/${m}/${y}) · Escudo protegeu sua ofensiva!`
        : `Novo dia simulado: ${d}/${m}/${y}`
    );
  };

  const handleTestSimulateGoal = () => {
    const currentDay = ensureDayRecord(state, state.currentDateKey);
    const totals = getDayTotals(currentDay);
    const missingMl = Math.max(250, currentDay.goalMl - totals.hydratedMl);

    const simEntry: LogEntry = {
      id: `sim-${Date.now()}`,
      beverageId: 'agua',
      volumeMl: missingMl,
      hydratedMl: missingMl,
      timestamp: `${state.currentDateKey}T09:30:00`,
      hour: 9,
    };

    const nextDraft: AppState = {
      ...state,
      days: {
        ...state.days,
        [state.currentDateKey]: {
          ...currentDay,
          entries: [...currentDay.entries, simEntry],
        },
      },
    };

    setBubbleBurstKey((k) => k + 1);
    setActiveTab('hoje');
    applyStateWithGamification(nextDraft, { forceCheckCelebration: true });
  };

  const handleTestAddGold = () => {
    playCelebrationChord(state.settings.soundEnabled);
    setState((prev) => ({
      ...prev,
      goldCoins: prev.goldCoins + 500,
    }));
    showToast('+500 Moedas de Ouro adicionadas!');
  };

  const handleResetAllData = () => {
    const fresh = createInitialState(getDateKey());
    setState({
      ...fresh,
      settings: {
        ...fresh.settings,
        theme: state.settings.theme,
        soundEnabled: state.settings.soundEnabled,
      },
    });
    setActiveTab('hoje');
    updateSpeech(pickSpeechLine({ type: 'idle' }, 0));
    showToast('Dados iniciais restaurados');
  };

  const toggleSound = () => {
    const next = !state.settings.soundEnabled;
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: next,
      },
    }));
    if (next) playTapSound(true);
  };

  const toggleTheme = () => {
    playTapSound(state.settings.soundEnabled);
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark',
      },
    }));
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#E8ECF2] text-slate-900 transition-colors duration-200 dark:bg-[#04060B] dark:text-slate-100 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-5">
      {/* Smartphone container on desktop / full edge-to-edge on mobile */}
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#F5F6F8] dark:bg-[#07090F] sm:h-[min(860px,calc(100vh-2.5rem))] sm:max-w-[430px] sm:rounded-[38px] sm:border sm:border-slate-300/80 sm:shadow-[0_28px_80px_-20px_rgba(2,6,23,0.45)] dark:sm:border-[#D4AF37]/20 dark:sm:shadow-[0_32px_90px_-16px_rgba(0,0,0,0.92)]">
        {/* Confetti overlay layer */}
        <ConfettiCanvas active={confettiActive} />

        {/* Compact Top App Bar (Obsidian & Gold Apothecary Header) */}
        <header className="pt-safe relative z-30 flex shrink-0 items-center justify-between gap-2 border-b border-slate-200/85 bg-[#F5F6F8]/95 px-4 pb-2.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#07090F]/95">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-xs">
              <Droplets className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              GotaViva
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Gold Coins Balance (clickable shortcut to Baú do Gnomo / Coleção) */}
            <button
              type="button"
              onClick={() => {
                playTapSound(state.settings.soundEnabled);
                setActiveTab('colecao');
              }}
              aria-label={`Saldo de ${state.goldCoins} Moedas de Ouro`}
              data-testid="gold-coins-balance"
              className="btn-spring font-mono-num mr-1 flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/12 px-2.5 text-xs font-bold text-amber-800 dark:text-[#F3D77A]"
            >
              <Coins className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
              <span>{state.goldCoins.toLocaleString('pt-BR')}</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={state.settings.soundEnabled ? 'Silenciar sons' : 'Ativar sons'}
              aria-pressed={!state.settings.soundEnabled}
              className="btn-spring flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {state.settings.soundEnabled ? (
                <Volume2 className="h-4.5 w-4.5" />
              ) : (
                <VolumeX className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                state.settings.theme === 'dark'
                  ? 'Alternar para modo claro'
                  : 'Alternar para modo escuro'
              }
              className="btn-spring flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {state.settings.theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5" />
              ) : (
                <Moon className="h-4.5 w-4.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                playTapSound(state.settings.soundEnabled);
                setSettingsOpen(true);
              }}
              aria-label="Abrir ajustes de meta"
              className="btn-spring flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Settings className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Transient feedback toast positioned cleanly below top header */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            data-testid="app-toast"
            className="animate-toast-drop pointer-events-none absolute top-[calc(max(0.75rem,env(safe-area-inset-top))+54px)] right-4 left-4 z-40 flex justify-center"
          >
            <div className="max-w-full rounded-xl border border-[#D4AF37]/50 bg-white/96 px-3.5 py-2 text-center text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-md dark:bg-[#131A2C]/96 dark:text-white">
              {toastMessage}
            </div>
          </div>
        )}

        {/* Scrollable Main Content Viewport */}
        <main className="phone-scroll flex-1 overflow-y-auto px-4 pt-4">
          {activeTab === 'hoje' && (
            <TodayTab
              today={today}
              activeMascotId={state.activeMascotId}
              activeGlassMaterialId={state.activeGlassMaterialId}
              activeLiquidEffectId={state.activeLiquidEffectId}
              layers={liquidSummary.layers}
              totalHydratedMl={liquidSummary.totalHydratedMl}
              rawPercent={liquidSummary.rawPercent}
              clampedPercent={liquidSummary.clampedPercent}
              currentStreak={streakInfo.currentStreak}
              streakShields={state.streakShields}
              levelInfo={levelInfo}
              rhythmCombo={rhythmCombo}
              speechText={speechState.text}
              speechKey={speechState.key}
              bubbleBurstKey={bubbleBurstKey}
              squishKey={squishKey}
              gyroEnabled={gyroEnabled}
              gyroTiltPx={gyroTiltPx}
              onToggleGyroscope={toggleGyroscope}
              onTapMascot={handleTapMascot}
              onQuickAddWater={() => handleLogBeverage('agua', 250)}
              onOpenQuickLog={() => {
                playTapSound(state.settings.soundEnabled);
                setQuickLogOpen(true);
              }}
              onToggleWorkoutBonus={handleToggleWorkoutBonus}
              onDeleteEntry={handleDeleteEntry}
            />
          )}

          {activeTab === 'missoes' && (
            <ChallengesTab
              statuses={challengeStatuses}
              onToggleChallenge={handleToggleChallenge}
            />
          )}

          {activeTab === 'colecao' && (
            <CollectionTab
              activeMascotId={state.activeMascotId}
              unlockedMascotIds={state.unlockedMascotIds}
              activeGlassMaterialId={state.activeGlassMaterialId}
              unlockedGlassMaterialIds={state.unlockedGlassMaterialIds}
              activeLiquidEffectId={state.activeLiquidEffectId}
              unlockedLiquidEffectIds={state.unlockedLiquidEffectIds}
              goldCoins={state.goldCoins}
              streakShields={state.streakShields}
              remainingGachaCount={remainingGachaCount}
              todayLayers={liquidSummary.layers}
              todayClampedPercent={liquidSummary.clampedPercent}
              onSelectMascot={handleSelectMascot}
              onSelectGlassMaterial={handleSelectGlassMaterial}
              onSelectLiquidEffect={handleSelectLiquidEffect}
              onOpenChest={handleOpenChest}
              onBuyStreakShield={handleBuyStreakShield}
            />
          )}

          {activeTab === 'historico' && <HistoryTab state={state} />}
        </main>

        {/* Fixed 4-Tab Bottom Navigation Bar */}
        <nav
          aria-label="Navegação principal"
          className="pb-safe absolute right-0 bottom-0 left-0 z-30 border-t border-slate-200/85 bg-white/94 backdrop-blur-md dark:border-slate-800/90 dark:bg-[#0A0E18]/94"
        >
          <div className="grid h-16 grid-cols-4 items-center px-2">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playTapSound(state.settings.soundEnabled);
                    setActiveTab(tab.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`btn-spring flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl ${
                    isActive
                      ? 'text-amber-700 dark:text-[#F3D77A]'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'
                    }`}
                  />
                  <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Quick Beverage Log Bottom Sheet */}
        <QuickLogSheet
          open={quickLogOpen}
          rhythmBonusActive={rhythmCombo.isComplete}
          onClose={() => setQuickLogOpen(false)}
          onLogBeverage={handleLogBeverage}
        />

        {/* Settings & Smart Goal Modal */}
        {settingsOpen && (
          <SettingsModal
            open={settingsOpen}
            settings={state.settings}
            currentDateKey={state.currentDateKey}
            onClose={() => setSettingsOpen(false)}
            onUpdateSettings={handleUpdateSettings}
            onTestAdvanceDay={handleTestAdvanceDay}
            onTestSimulateGoal={handleTestSimulateGoal}
            onTestAddGold={handleTestAddGold}
            onResetAllData={handleResetAllData}
          />
        )}

        {/* Goal Completion & Creature Unlock Celebration Modal */}
        <CelebrationModal
          payload={celebration}
          activeGlassMaterialId={state.activeGlassMaterialId}
          activeLiquidEffectId={state.activeLiquidEffectId}
          onClose={() => setCelebration(null)}
          onSelectMascot={handleSelectMascot}
        />
      </div>
    </div>
  );
}

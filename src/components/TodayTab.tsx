import React from 'react';
import {
  Clock,
  Compass,
  Droplets,
  Flame,
  Moon,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Sun,
  Sunrise,
  Trash2,
} from 'lucide-react';
import { BEVERAGE_MAP } from '../data/beverages';
import { formatTimeSinceLastSip } from '../data/dialogue';
import { MASCOT_MAP } from '../data/mascots';
import {
  DayRecord,
  GlassMaterialId,
  LevelInfo,
  LiquidEffectId,
  LiquidLayer,
  MascotId,
  RhythmComboStatus,
} from '../types/hydration';
import { OVERFLOW_THRESHOLD_PERCENT } from '../utils/fluidPhysics';
import { formatMl, WORKOUT_BONUS_ML } from '../utils/hydration';
import { MascotLiquidSvg } from './MascotLiquidSvg';
import { BeverageIcon } from './QuickLogSheet';

interface TodayTabProps {
  today: DayRecord;
  activeMascotId: MascotId;
  activeGlassMaterialId: GlassMaterialId;
  activeLiquidEffectId: LiquidEffectId;
  layers: LiquidLayer[];
  totalHydratedMl: number;
  rawPercent: number;
  clampedPercent: number;
  currentStreak: number;
  streakShields: number;
  levelInfo: LevelInfo;
  rhythmCombo: RhythmComboStatus;
  speechText: string;
  speechKey: number;
  bubbleBurstKey: number;
  squishKey: number;
  gyroEnabled: boolean;
  gyroTiltPx: number;
  onToggleGyroscope: () => void;
  onTapMascot: () => void;
  onQuickAddWater: () => void;
  onOpenQuickLog: () => void;
  onToggleWorkoutBonus: () => void;
  onDeleteEntry: (entryId: string) => void;
}

function formatEntryTime(iso: string): string {
  const match = iso.match(/T(\d{2}:\d{2})/);
  if (match) return match[1];
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '--:--';
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export const TodayTab: React.FC<TodayTabProps> = ({
  today,
  activeMascotId,
  activeGlassMaterialId,
  activeLiquidEffectId,
  layers,
  totalHydratedMl,
  rawPercent,
  clampedPercent,
  currentStreak,
  streakShields,
  levelInfo,
  rhythmCombo,
  speechText,
  speechKey,
  bubbleBurstKey,
  squishKey,
  gyroEnabled,
  gyroTiltPx,
  onToggleGyroscope,
  onTapMascot,
  onQuickAddWater,
  onOpenQuickLog,
  onToggleWorkoutBonus,
  onDeleteEntry,
}) => {
  const mascot = MASCOT_MAP[activeMascotId] || MASCOT_MAP.gnomo;
  const remainingMl = Math.max(0, today.goalMl - totalHydratedMl);
  const goalMet = totalHydratedMl >= today.goalMl;
  const isOverflowing = rawPercent > OVERFLOW_THRESHOLD_PERCENT;

  const lastEntry = today.entries[today.entries.length - 1] ?? null;
  const sipTiming = formatTimeSinceLastSip(lastEntry?.timestamp ?? null);

  return (
    <div className="flex flex-col pb-28">
      {/* Level & XP Progress Strip */}
      <section
        aria-label="Progresso de nível e experiência"
        className="border-b border-slate-200/80 pb-3 dark:border-slate-800/80"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
            Nível {levelInfo.level} · {levelInfo.title}
          </span>
          <span className="font-mono-num shrink-0 pl-2 text-[11px] text-slate-500 dark:text-slate-400">
            {levelInfo.xpIntoLevel}/{levelInfo.xpForNextLevel} XP
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#161D2F]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-300 transition-all duration-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </section>

      {/* Streak (+ Shields) & Workout/Heat Bonus */}
      <section className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 text-sm"
            aria-label={`Ofensiva atual de ${currentStreak} dias seguidos`}
          >
            <Flame
              className={`h-5 w-5 ${
                currentStreak > 0
                  ? 'fill-orange-500 text-orange-500'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            />
            <span className="font-mono-num font-bold text-slate-900 dark:text-white">
              {currentStreak}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {currentStreak === 1 ? 'dia' : 'dias'}
            </span>
          </div>

          {streakShields > 0 && (
            <div
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-[#E8C967]"
              title="Escudos de Ofensiva disponíveis para proteger sua sequência"
              aria-label={`${streakShields} escudo(s) de ofensiva`}
            >
              <Shield className="h-3.5 w-3.5 fill-amber-500/20" />
              <span className="font-mono-num">{streakShields}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleWorkoutBonus}
          aria-pressed={today.workoutBonusActive}
          className={`btn-spring flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
            today.workoutBonusActive
              ? 'border-[#D4AF37]/80 bg-[#D4AF37]/15 text-amber-800 dark:text-[#F3D77A]'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-[#101522] dark:text-slate-300'
          }`}
        >
          <Sun className="h-3.5 w-3.5 shrink-0" />
          <span>Treino / Calor</span>
          <span className="font-mono-num opacity-85">+{WORKOUT_BONUS_ML}ml</span>
        </button>
      </section>

      {/* Daily Rhythm Combo (Manhã / Tarde / Noite -> 2x XP & Ouro) */}
      <section
        aria-label="Combo de Ritmo Diário"
        className="mt-2.5 flex items-center justify-between gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-3 py-2 dark:border-slate-800/90 dark:bg-[#101522]"
      >
        <div className="flex items-center gap-3">
          {[
            { key: 'morning', label: 'Manhã', active: rhythmCombo.morning, Icon: Sunrise },
            { key: 'afternoon', label: 'Tarde', active: rhythmCombo.afternoon, Icon: Sun },
            { key: 'night', label: 'Noite', active: rhythmCombo.night, Icon: Moon },
          ].map(({ key, label, active, Icon }) => (
            <div
              key={key}
              className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                active
                  ? 'text-amber-700 dark:text-[#E8C967]'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <span
          className={`font-mono-num text-[11px] font-bold whitespace-nowrap ${
            rhythmCombo.isComplete
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {rhythmCombo.isComplete ? '2x XP & Ouro' : `${rhythmCombo.completedCount}/3 · 2x`}
        </span>
      </section>

      {/* Sarcastic Speech Bubble + Hero 3D Thick-Glass Mascot Stage */}
      <section className="mt-2.5 flex flex-col items-center">
        <div
          key={speechKey}
          data-testid="mascot-speech-bubble"
          className="animate-speech-pop relative w-full max-w-[336px] rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-center shadow-xs dark:border-[#D4AF37]/45 dark:bg-[#12192A]"
        >
          <p className="text-xs font-medium leading-relaxed text-slate-900 dark:text-slate-50">
            &ldquo;{speechText}&rdquo;
          </p>
          <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-300/80">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{sipTiming.label}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{mascot.name}</span>
          </div>
          {/* Speech pointer triangle */}
          <div
            aria-hidden="true"
            className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-slate-200 bg-white dark:border-[#D4AF37]/45 dark:bg-[#12192A]"
          />
        </div>

        {/* Hero Centerpiece Stage with Discreet Gyroscope / Physics Toggle */}
        <div className="relative mt-1 flex w-full items-center justify-center">
          <button
            type="button"
            onClick={onToggleGyroscope}
            aria-pressed={gyroEnabled}
            aria-label={
              gyroEnabled
                ? 'Desativar física por giroscópio'
                : 'Ativar física por giroscópio ao inclinar o celular'
            }
            title={gyroEnabled ? 'Giroscópio ativo' : 'Ativar física de inclinação (Giroscópio)'}
            data-testid="gyro-toggle-btn"
            className={`btn-spring absolute top-2 right-1 z-10 flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              gyroEnabled
                ? 'border-[#D4AF37]/80 bg-[#D4AF37]/15 text-amber-700 shadow-xs dark:text-[#F3D77A]'
                : 'border-slate-200/90 bg-white/80 text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-slate-800 dark:bg-[#101522]/85 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Compass className={`h-4 w-4 ${gyroEnabled ? 'animate-spin' : ''}`} style={gyroEnabled ? { animationDuration: '9s' } : undefined} />
          </button>

          <div className="p-1">
            <MascotLiquidSvg
              mascot={mascot}
              layers={layers}
              clampedPercent={clampedPercent}
              rawPercent={rawPercent}
              glassMaterialId={activeGlassMaterialId}
              liquidEffectId={activeLiquidEffectId}
              bubbleBurstKey={bubbleBurstKey}
              squishKey={squishKey}
              gyroTiltPx={gyroTiltPx}
              onInteractiveTap={onTapMascot}
              size="hero"
            />
          </div>
        </div>

        {/* Primary Hydration Readout */}
        <div className="mt-0.5 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span
              className="font-display tabular-nums text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
              data-testid="hydration-percent"
            >
              {rawPercent}%
            </span>
          </div>

          <p
            className="font-mono-num mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200"
            data-testid="hydration-volume"
          >
            {formatMl(totalHydratedMl)}{' '}
            <span className="font-normal text-slate-400 dark:text-slate-500">/</span>{' '}
            {formatMl(today.goalMl)}
          </p>

          {isOverflowing ? (
            <p
              data-testid="overflow-status"
              className="mt-1 inline-flex items-center justify-center gap-1 text-xs font-semibold text-amber-700 dark:text-[#F3D77A]"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Poção Transbordando! Frasco na capacidade máxima.</span>
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {goalMet
                ? 'Poção diária completa! Boticário aprovado.'
                : `Faltam ${formatMl(remainingMl)} para encher o frasco`}
            </p>
          )}
        </div>

        {/* Inline Legend of Layered Beverages */}
        {layers.length > 0 && (
          <div
            className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400"
            aria-label="Camadas de bebidas de hoje"
          >
            {layers.map((layer) => (
              <span key={layer.beverageId} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-xs border border-black/10 dark:border-white/15"
                  style={{ backgroundColor: layer.color }}
                  aria-hidden="true"
                />
                <span>{layer.name}</span>
                <span className="font-mono-num text-[11px] opacity-80">{layer.rawMl}ml</span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Primary Thumb-Zone Quick Actions */}
      <section className="mt-3 grid grid-cols-[1fr_1.35fr] gap-2.5">
        <button
          type="button"
          onClick={onQuickAddWater}
          className="btn-spring flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-sky-500/40 bg-sky-500/12 px-3 text-sm font-bold text-sky-700 hover:bg-sky-500/20 dark:text-sky-300"
        >
          <Droplets className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">+250 ml Água</span>
        </button>

        <button
          type="button"
          onClick={onOpenQuickLog}
          className="btn-spring flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400"
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span className="whitespace-nowrap">Registrar bebida</span>
        </button>
      </section>

      {/* Discreet Today's Intake List with 1-tap Undo/Delete */}
      <section className="mt-6" aria-labelledby="today-logs-heading">
        <div className="mb-2 flex items-center justify-between">
          <h2
            id="today-logs-heading"
            className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400"
          >
            Registros de hoje ({today.entries.length})
          </h2>
          {today.entries.length > 0 && (
            <button
              type="button"
              onClick={() => onDeleteEntry(today.entries[today.entries.length - 1].id)}
              className="btn-spring inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Desfazer último</span>
            </button>
          )}
        </div>

        {today.entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center dark:border-slate-800">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Frasco vazio por enquanto
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Toque em &quot;+250 ml Água&quot; ou registre outra bebida para encher sua criatura.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200/80 rounded-2xl border border-slate-200/90 bg-white/85 dark:divide-slate-800/80 dark:border-slate-800/90 dark:bg-[#101522]">
            {[...today.entries].reverse().map((entry) => {
              const bev = BEVERAGE_MAP[entry.beverageId];
              const factorPct = Math.round(bev.hydrationFactor * 100);
              return (
                <li
                  key={entry.id}
                  className="flex min-h-[58px] items-center justify-between gap-3 px-3.5 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: bev.color,
                        color: bev.id === 'leite' ? '#0F172A' : '#FFFFFF',
                      }}
                    >
                      <BeverageIcon beverageId={entry.beverageId} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {bev.shortName}{' '}
                        <span className="font-mono-num font-normal text-slate-600 dark:text-slate-300">
                          · {formatMl(entry.volumeMl)}
                        </span>
                      </p>
                      <p className="font-mono-num text-xs text-slate-500 dark:text-slate-400">
                        {formatEntryTime(entry.timestamp)} · +{formatMl(entry.hydratedMl)} reais (
                        {factorPct}%)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    aria-label={`Excluir ${bev.shortName} de ${entry.volumeMl} ml das ${formatEntryTime(entry.timestamp)}`}
                    className="btn-spring flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

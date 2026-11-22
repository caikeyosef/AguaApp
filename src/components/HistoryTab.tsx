import React, { useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { AppState } from '../types/hydration';
import {
  buildMonthlyCalendarData,
  buildWeeklyChartData,
  computeOverallStats,
  formatLiters,
  formatMl,
  parseDateKey,
} from '../utils/hydration';

interface HistoryTabProps {
  state: AppState;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAY_INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const HistoryTab: React.FC<HistoryTabProps> = ({ state }) => {
  const currentDate = parseDateKey(state.currentDateKey);
  const [viewMonth, setViewMonth] = React.useState<{ year: number; month: number }>({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  });

  const weeklyData = useMemo(() => buildWeeklyChartData(state), [state]);
  const stats = useMemo(() => computeOverallStats(state), [state]);
  const calendarCells = useMemo(
    () => buildMonthlyCalendarData(state, viewMonth.year, viewMonth.month),
    [state, viewMonth.year, viewMonth.month]
  );

  const referenceGoal = weeklyData[weeklyData.length - 1]?.goalMl || 2450;
  const maxChartMl = Math.max(
    referenceGoal * 1.18,
    ...weeklyData.map((d) => d.hydratedMl * 1.1),
    1000
  );
  const goalLineBottomPct = Math.min(92, Math.max(12, (referenceGoal / maxChartMl) * 100));

  const shiftMonth = (delta: number) => {
    setViewMonth((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
    <div className="pb-nav-safe flex flex-col">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Histórico
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Acompanhe sua consistência nos últimos 7 dias e ao longo do mês
        </p>
      </header>

      {/* Key Aggregate Statistics */}
      <section
        aria-label="Estatísticas gerais"
        className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white py-3.5 dark:divide-slate-800 dark:border-slate-800 dark:bg-[#101522]"
      >
        <div className="px-2.5 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Total bebido</p>
          <p className="font-mono-num mt-1 text-base font-bold text-slate-900 dark:text-white">
            {formatLiters(stats.totalHydratedMl)}
          </p>
        </div>
        <div className="px-2.5 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Melhor ofensiva</p>
          <p className="font-mono-num mt-1 text-base font-bold text-slate-900 dark:text-white">
            {stats.bestStreak} {stats.bestStreak === 1 ? 'dia' : 'dias'}
          </p>
        </div>
        <div className="px-2.5 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Favorita</p>
          <p className="mt-1 truncate text-sm font-bold text-amber-700 dark:text-[#E8C967]">
            {stats.favoriteBeverageName}
          </p>
        </div>
      </section>

      {/* Last 7 Days Bar Chart with Dashed Goal Reference Line */}
      <section
        aria-labelledby="weekly-chart-title"
        className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#101522]"
      >
        <div className="flex items-baseline justify-between">
          <h2
            id="weekly-chart-title"
            className="font-display text-base font-bold text-slate-900 dark:text-white"
          >
            Últimos 7 dias
          </h2>
          <span className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400">
            Meta: {formatMl(referenceGoal)}
          </span>
        </div>

        <div className="relative mt-4 h-44 pt-4">
          <div
            className="pointer-events-none absolute right-0 left-0 z-10 border-t border-dashed border-[#D4AF37]/80"
            style={{ bottom: `${goalLineBottomPct}%` }}
            aria-hidden="true"
          >
            <span className="font-mono-num absolute -top-4 right-0 rounded-xs bg-white/95 px-1 text-[10px] font-semibold text-amber-700 dark:bg-[#101522] dark:text-[#E8C967]">
              100%
            </span>
          </div>

          <div className="grid h-full grid-cols-7 items-end gap-2">
            {weeklyData.map((bar) => {
              const heightPct = Math.max(
                bar.hydratedMl > 0 ? 6 : 2,
                Math.min(100, (bar.hydratedMl / maxChartMl) * 100)
              );
              return (
                <div
                  key={bar.dateKey}
                  className="flex h-full flex-col items-center justify-end"
                  title={`${bar.weekdayLabel} ${bar.dayNumber}: ${formatMl(bar.hydratedMl)} / ${formatMl(bar.goalMl)}`}
                >
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-[28px] rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: bar.metGoal
                          ? '#10B981'
                          : bar.shielded
                            ? '#D4AF37'
                            : bar.hydratedMl > 0
                              ? bar.primaryColor
                              : 'rgba(148,163,184,0.22)',
                        opacity: bar.isToday ? 1 : 0.85,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2 text-center">
          {weeklyData.map((bar) => (
            <div key={bar.dateKey} className="flex flex-col items-center">
              <span
                className={`text-[11px] font-medium ${
                  bar.isToday
                    ? 'font-bold text-amber-700 dark:text-[#E8C967]'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {bar.weekdayLabel}
              </span>
              <span className="font-mono-num text-[10px] text-slate-400 dark:text-slate-500">
                {bar.dayNumber}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Calendar */}
      <section
        aria-labelledby="calendar-title"
        className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#101522]"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="calendar-title"
            className="font-display text-base font-bold text-slate-900 dark:text-white"
          >
            {MONTH_NAMES[viewMonth.month]} {viewMonth.year}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Mês anterior"
              className="btn-spring flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Próximo mês"
              className="btn-spring flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          {WEEKDAY_INITIALS.map((label, idx) => (
            <span key={idx}>{label}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell, idx) => {
            if (!cell.dayNumber) {
              return <div key={`empty-${idx}`} className="h-9" />;
            }

            return (
              <div
                key={cell.dateKey}
                className={`font-mono-num relative flex h-9 items-center justify-center rounded-xl text-xs font-semibold ${
                  cell.metGoal
                    ? 'bg-emerald-500 text-white'
                    : cell.shielded
                      ? 'bg-[#D4AF37]/25 text-amber-800 dark:text-[#F3D77A]'
                      : cell.hasActivity
                        ? 'bg-sky-500/18 text-sky-700 dark:text-sky-300'
                        : 'text-slate-600 dark:text-slate-400'
                } ${cell.isToday ? 'ring-2 ring-[#D4AF37] ring-offset-1 ring-offset-white dark:ring-offset-[#101522]' : ''}`}
                title={
                  cell.metGoal
                    ? `Dia ${cell.dayNumber}: Meta concluída`
                    : cell.shielded
                      ? `Dia ${cell.dayNumber}: Protegido por Escudo de Ofensiva`
                      : cell.hasActivity
                        ? `Dia ${cell.dayNumber}: ${cell.percent}% da meta`
                        : `Dia ${cell.dayNumber}: Sem registros`
                }
              >
                <span>{cell.dayNumber}</span>
                {cell.metGoal && (
                  <Check
                    className="absolute right-0.5 bottom-0.5 h-2.5 w-2.5 opacity-90"
                    aria-hidden="true"
                  />
                )}
                {!cell.metGoal && cell.shielded && (
                  <Shield
                    className="absolute right-0.5 bottom-0.5 h-2.5 w-2.5 opacity-90"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-xs bg-emerald-500" />
            <span>Meta batida ({stats.totalGoalDays})</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#D4AF37]" />
            <span>Escudo</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-xs bg-sky-500/30" />
            <span>Parcial</span>
          </span>
        </div>
      </section>
    </div>
  );
};

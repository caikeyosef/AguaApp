import React from 'react';
import { CheckCircle2, Coins, Flame, Play, ScrollText, Trophy } from 'lucide-react';
import { ChallengeStatus } from '../types/hydration';

interface ChallengesTabProps {
  statuses: ChallengeStatus[];
  onToggleChallenge: (challengeId: string) => void;
}

export const ChallengesTab: React.FC<ChallengesTabProps> = ({
  statuses,
  onToggleChallenge,
}) => {
  const completedCount = statuses.filter((s) => s.isCompleted).length;
  const activeCount = statuses.filter((s) => s.isActive && !s.isCompleted).length;

  return (
    <div className="flex flex-col pb-28">
      <header className="mb-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-[#D4AF37]" />
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Missões da Taverna
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Aceite contratos de hidratação para ganhar Moedas de Ouro e XP · {completedCount}/
          {statuses.length} concluídas · {activeCount} ativa(s)
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {statuses.map((item) => {
          const { challenge, isActive, isCompleted, progressPercent, progressLabel } = item;

          return (
            <article
              key={challenge.id}
              className={`rounded-2xl border p-4 transition-colors ${
                isCompleted
                  ? 'border-emerald-500/45 bg-emerald-500/8 dark:bg-emerald-500/10'
                  : isActive
                    ? 'border-[#D4AF37]/60 bg-white dark:bg-[#101522]'
                    : 'border-slate-200 bg-white/85 dark:border-slate-800 dark:bg-[#101522]/85'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      {challenge.title}
                    </h2>
                    {isCompleted && (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-500"
                        aria-label="Missão concluída"
                      />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {challenge.description}
                  </p>
                  <p className="font-mono-num mt-2 flex flex-wrap items-center gap-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-[#E8C967]">
                      <Coins className="h-3.5 w-3.5" />+{challenge.coinReward} Ouro
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>+{challenge.xpReward} XP</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {isCompleted ? 'Concluída' : isActive ? 'Em andamento' : 'Disponível'}
                    </span>
                  </p>
                </div>

                {!isCompleted ? (
                  <button
                    type="button"
                    onClick={() => onToggleChallenge(challenge.id)}
                    aria-pressed={isActive}
                    className={`btn-spring flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap ${
                      isActive
                        ? 'border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                        : 'bg-[#D4AF37] text-slate-950 hover:brightness-105'
                    }`}
                  >
                    {isActive ? (
                      <span>Pausar</span>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Aceitar</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Trophy className="h-4 w-4" />
                    <span>Feita</span>
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-3.5">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">{progressLabel}</span>
                  <span className="font-mono-num font-semibold text-slate-900 dark:text-white">
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#192136]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : isActive
                          ? 'bg-gradient-to-r from-[#D4AF37] to-amber-300'
                          : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-2.5 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <Flame className="h-4 w-4 shrink-0 text-[#D4AF37]" />
        <p>
          Complete missões para juntar Ouro mais rápido e abrir Baús do Gnomo na aba Coleção.
        </p>
      </div>
    </div>
  );
};

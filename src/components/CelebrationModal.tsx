import React from 'react';
import { Award, CheckCircle2, Coins, X } from 'lucide-react';
import { RARITY_META } from '../data/alchemy';
import { MASCOT_MAP } from '../data/mascots';
import { GlassMaterialId, LiquidEffectId, MascotId } from '../types/hydration';
import { MascotLiquidSvg } from './MascotLiquidSvg';

export interface CelebrationPayload {
  goalReached: boolean;
  unlockedMascotIds: MascotId[];
  completedChallengeTitles: string[];
  coinsEarned: number;
  goalMl: number;
}

interface CelebrationModalProps {
  payload: CelebrationPayload | null;
  activeGlassMaterialId: GlassMaterialId;
  activeLiquidEffectId: LiquidEffectId;
  onClose: () => void;
  onSelectMascot: (id: MascotId) => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  payload,
  activeGlassMaterialId,
  activeLiquidEffectId,
  onClose,
  onSelectMascot,
}) => {
  if (!payload) return null;

  const firstUnlocked = payload.unlockedMascotIds[0]
    ? MASCOT_MAP[payload.unlockedMascotIds[0]]
    : null;
  const rarityMeta = firstUnlocked ? RARITY_META[firstUnlocked.rarity] : null;

  return (
    <div
      className="modal-safe-padding fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      <div className="relative max-h-[88dvh] w-full max-w-[360px] overflow-y-auto rounded-3xl border border-[#D4AF37]/60 bg-white p-6 text-center shadow-2xl dark:bg-[#101522]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar comemoração"
          className="btn-spring absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/18 text-amber-700 dark:text-[#E8C967]">
          {firstUnlocked ? <Award className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
        </div>

        <h2
          id="celebration-title"
          className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          {payload.goalReached ? 'Meta Diária Concluída!' : 'Nova Conquista!'}
        </h2>

        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
          {payload.goalReached
            ? `Você atingiu 100% dos seus ${payload.goalMl.toLocaleString('pt-BR')} ml de hidratação hoje.`
            : 'Seu grimório de boticário acaba de crescer.'}
        </p>

        {payload.coinsEarned > 0 && (
          <p className="font-mono-num mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-amber-700 dark:text-[#F3D77A]">
            <Coins className="h-4 w-4" />
            <span>+{payload.coinsEarned} Moedas de Ouro</span>
          </p>
        )}

        {firstUnlocked && rarityMeta && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#0B0F1A]">
            <p className={`text-xs font-semibold ${rarityMeta.textClass}`}>
              Nova criatura · {rarityMeta.label}
            </p>
            <div className="my-2 flex justify-center">
              <MascotLiquidSvg
                mascot={firstUnlocked}
                layers={[
                  {
                    beverageId: 'agua',
                    name: 'Água',
                    color: firstUnlocked.accentColor,
                    waveHighlight: firstUnlocked.waveColor,
                    rawMl: 1000,
                    hydratedMl: 1000,
                    startPercent: 0,
                    heightPercent: 80,
                  },
                ]}
                clampedPercent={80}
                glassMaterialId={activeGlassMaterialId}
                liquidEffectId={activeLiquidEffectId}
                size="modal"
              />
            </div>
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {firstUnlocked.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {firstUnlocked.subtitle}
            </p>
            {payload.unlockedMascotIds.length > 1 && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                + {payload.unlockedMascotIds.length - 1} outra(s) criatura(s) na Coleção
              </p>
            )}
          </div>
        )}

        {payload.completedChallengeTitles.length > 0 && (
          <div className="mt-4 border-t border-slate-200 pt-3 text-left dark:border-slate-800">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Missão concluída
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
              {payload.completedChallengeTitles.join(' · ')}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          {firstUnlocked && (
            <button
              type="button"
              onClick={() => {
                onSelectMascot(firstUnlocked.id);
                onClose();
              }}
              className="btn-spring min-h-[46px] w-full rounded-2xl bg-[#D4AF37] px-4 py-3 text-sm font-bold text-slate-950 hover:brightness-105"
            >
              Equipar {firstUnlocked.name}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`btn-spring min-h-[46px] w-full rounded-2xl px-4 py-3 text-sm font-semibold ${
              firstUnlocked
                ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                : 'bg-[#D4AF37] font-bold text-slate-950 hover:brightness-105'
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  CalendarPlus,
  Coins,
  Download,
  FlaskConical,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { UserSettings } from '../types/hydration';
import { calculateBaseGoalMl, formatMl } from '../utils/hydration';

interface SettingsModalProps {
  open: boolean;
  settings: UserSettings;
  currentDateKey: string;
  onClose: () => void;
  onUpdateSettings: (partial: Partial<UserSettings>) => void;
  onTestAdvanceDay: () => void;
  onTestSimulateGoal: () => void;
  onTestAddGold: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  settings,
  currentDateKey,
  onClose,
  onUpdateSettings,
  onTestAdvanceDay,
  onTestSimulateGoal,
  onTestAddGold,
  onResetAllData,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);

  if (!open) return null;

  const calculatedGoal = calculateBaseGoalMl(settings);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 backdrop-blur-xs sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[88vh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl border border-slate-200 bg-white px-5 pt-4 pb-6 shadow-2xl dark:border-slate-800 dark:bg-[#101522] sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h2
              id="settings-modal-title"
              className="font-display text-xl font-bold text-slate-900 dark:text-white"
            >
              Ajustes & Meta Inteligente
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize sua meta diária de hidratação
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar ajustes"
            className="btn-spring flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Segmented Toggle */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Cálculo da meta diária
          </p>
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-[#0B0F1A]">
            <button
              type="button"
              onClick={() => onUpdateSettings({ goalMode: 'auto' })}
              aria-pressed={settings.goalMode === 'auto'}
              className={`btn-spring min-h-[42px] rounded-xl text-xs font-semibold ${
                settings.goalMode === 'auto'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-[#1A2236] dark:text-[#F3D77A]'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Automática (Peso × 35 ml)
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ goalMode: 'manual' })}
              aria-pressed={settings.goalMode === 'manual'}
              className={`btn-spring min-h-[42px] rounded-xl text-xs font-semibold ${
                settings.goalMode === 'manual'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-[#1A2236] dark:text-[#F3D77A]'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Weight or Manual Goal Input */}
        {settings.goalMode === 'auto' ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#0B0F1A]">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="weight-input"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Seu peso atual
              </label>
              <span className="font-mono-num text-lg font-bold text-slate-900 dark:text-white">
                {settings.weightKg} kg
              </span>
            </div>
            <input
              id="weight-input"
              type="range"
              min={35}
              max={160}
              step={1}
              value={settings.weightKg}
              onChange={(e) => onUpdateSettings({ weightKg: Number(e.target.value) })}
              className="gota-slider mt-3 w-full bg-slate-200 dark:bg-slate-800"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Fórmula: {settings.weightKg} kg × 35 ml</span>
              <span className="font-mono-num font-bold text-sky-600 dark:text-sky-400">
                Meta: {formatMl(calculatedGoal)}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#0B0F1A]">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="manual-goal-input"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Meta diária personalizada
              </label>
              <span className="font-mono-num text-lg font-bold text-sky-600 dark:text-sky-400">
                {formatMl(settings.manualGoalMl)}
              </span>
            </div>
            <input
              id="manual-goal-input"
              type="range"
              min={1000}
              max={5000}
              step={100}
              value={settings.manualGoalMl}
              onChange={(e) => onUpdateSettings({ manualGoalMl: Number(e.target.value) })}
              className="gota-slider mt-3 w-full bg-slate-200 dark:bg-slate-800"
            />
            <div className="font-mono-num mt-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>1.000 ml</span>
              <span>3.000 ml</span>
              <span>5.000 ml</span>
            </div>
          </div>
        )}

        {/* PWA In-App Install Prompt */}
        {!isInstalled && (isInstallable || isIOS) && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-[#0B0F1A]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Instalar GotaViva
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Acesse em tela cheia direto da tela inicial
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isInstallable) {
                    void install();
                  } else {
                    setShowIOSHint((v) => !v);
                  }
                }}
                className="btn-spring flex min-h-[40px] items-center gap-1.5 rounded-xl bg-sky-500 px-3 text-xs font-semibold text-white hover:bg-sky-400"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Instalar</span>
              </button>
            </div>
            {showIOSHint && isIOS && (
              <p className="mt-2 border-t border-slate-200 pt-2 text-[11px] text-slate-600 dark:border-slate-800 dark:text-slate-300">
                No Safari, toque em <strong>Compartilhar</strong> e depois em{' '}
                <strong>Adicionar à Tela de Início</strong>.
              </p>
            )}
          </div>
        )}

        {/* Discreet Test Mode Disclosure */}
        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowTestPanel((v) => !v)}
            aria-expanded={showTestPanel}
            className="btn-spring flex min-h-[40px] w-full items-center justify-between rounded-xl px-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
          >
            <span className="inline-flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              <span>Modo Teste (+1 Dia / Simular Meta / Ouro)</span>
            </span>
            <span className="font-mono-num text-[11px]">
              {showTestPanel ? 'Ocultar' : 'Abrir'}
            </span>
          </button>

          {showTestPanel && (
            <div className="mt-3 space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-[#0B0F1A]">
              <p className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400">
                Data ativa simulada: {currentDateKey}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onTestSimulateGoal();
                    onClose();
                  }}
                  className="btn-spring flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 text-xs font-bold text-white hover:bg-emerald-400"
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>Simular Meta</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onTestAdvanceDay();
                    onClose();
                  }}
                  className="btn-spring flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 text-xs font-bold text-white hover:bg-sky-400"
                >
                  <CalendarPlus className="h-4 w-4 shrink-0" />
                  <span>+1 Dia</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  onTestAddGold();
                  onClose();
                }}
                className="btn-spring flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#D4AF37] px-3 text-xs font-bold text-slate-950 hover:brightness-105"
              >
                <Coins className="h-4 w-4 shrink-0" />
                <span>+500 Moedas de Ouro (Teste)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  onClose();
                }}
                className="btn-spring flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-500/15 dark:text-rose-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restaurar dados iniciais</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

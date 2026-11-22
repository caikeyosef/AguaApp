import React, { useState } from 'react';
import {
  Citrus,
  Coffee,
  Coins,
  CupSoda,
  Droplets,
  Leaf,
  Milk,
  X,
  Zap,
} from 'lucide-react';
import { BEVERAGES, BEVERAGE_MAP, VOLUME_PRESETS } from '../data/beverages';
import { BeverageId } from '../types/hydration';
import {
  calculateDrinkCoins,
  calculateHydratedMl,
  formatMl,
} from '../utils/hydration';

interface QuickLogSheetProps {
  open: boolean;
  rhythmBonusActive: boolean;
  onClose: () => void;
  onLogBeverage: (beverageId: BeverageId, volumeMl: number) => void;
}

export function BeverageIcon({
  beverageId,
  className = 'h-5 w-5',
}: {
  beverageId: BeverageId;
  className?: string;
}) {
  switch (beverageId) {
    case 'agua':
      return <Droplets className={className} />;
    case 'cafe':
      return <Coffee className={className} />;
    case 'cha':
      return <Leaf className={className} />;
    case 'suco':
      return <Citrus className={className} />;
    case 'isotonico':
      return <Zap className={className} />;
    case 'leite':
      return <Milk className={className} />;
    case 'refrigerante':
      return <CupSoda className={className} />;
  }
}

export const QuickLogSheet: React.FC<QuickLogSheetProps> = ({
  open,
  rhythmBonusActive,
  onClose,
  onLogBeverage,
}) => {
  const [selectedBeverage, setSelectedBeverage] = useState<BeverageId>('agua');
  const [volumeMl, setVolumeMl] = useState<number>(250);

  if (!open) return null;

  const activeBev = BEVERAGE_MAP[selectedBeverage];
  const effectiveMl = calculateHydratedMl(volumeMl, selectedBeverage);
  const factorPercent = Math.round(activeBev.hydrationFactor * 100);
  const coinPreview = calculateDrinkCoins(volumeMl, rhythmBonusActive);

  const handleConfirm = () => {
    onLogBeverage(selectedBeverage, volumeMl);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 pt-[calc(env(safe-area-inset-top,0px)+1rem)] backdrop-blur-xs sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-log-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet-safe-bottom max-h-[90dvh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl border border-slate-200 bg-white px-5 pt-3 shadow-2xl dark:border-slate-800 dark:bg-[#101522] sm:rounded-3xl sm:pb-6">
        <div
          className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-700"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between">
          <div>
            <h2
              id="quick-log-title"
              className="font-display text-xl font-bold text-slate-900 dark:text-white"
            >
              Registrar Bebida
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escolha o elixir e o volume consumido
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar registro de bebida"
            className="btn-spring flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Beverage selector grid */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Tipo de bebida
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BEVERAGES.map((bev) => {
              const isSelected = bev.id === selectedBeverage;
              const rate = Math.round(bev.hydrationFactor * 100);
              return (
                <button
                  key={bev.id}
                  type="button"
                  onClick={() => setSelectedBeverage(bev.id)}
                  aria-pressed={isSelected}
                  className={`btn-spring flex min-h-[54px] items-center gap-2.5 rounded-2xl border px-3 py-2 text-left ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37]/12 text-slate-900 dark:bg-[#182136] dark:text-white'
                      : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B0F1A] dark:text-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                    style={{
                      backgroundColor: bev.color,
                      color: bev.id === 'leite' ? '#0F172A' : '#FFFFFF',
                    }}
                  >
                    <BeverageIcon beverageId={bev.id} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold leading-tight">
                      {bev.shortName}
                    </span>
                    <span className="font-mono-num block text-[11px] text-slate-500 dark:text-slate-400">
                      {rate}% hidr.
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume presets */}
        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between">
            <label
              htmlFor="custom-volume-slider"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Quantidade
            </label>
            <span className="font-mono-num text-lg font-bold text-slate-900 dark:text-white">
              {formatMl(volumeMl)}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {VOLUME_PRESETS.map((preset) => {
              const active = volumeMl === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setVolumeMl(preset)}
                  aria-pressed={active}
                  className={`btn-spring font-mono-num min-h-[44px] rounded-xl border text-xs font-semibold whitespace-nowrap ${
                    active
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-slate-950'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B0F1A] dark:text-slate-300'
                  }`}
                >
                  {preset} ml
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <input
              id="custom-volume-slider"
              type="range"
              min={50}
              max={1000}
              step={25}
              value={volumeMl}
              onChange={(e) => setVolumeMl(Number(e.target.value))}
              className="gota-slider w-full bg-slate-200 dark:bg-slate-800"
            />
            <div className="font-mono-num mt-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>50 ml</span>
              <span>500 ml</span>
              <span>1.000 ml</span>
            </div>
          </div>
        </div>

        {/* Effective hydration + gold reward preview */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs dark:border-slate-800">
          <div className="min-w-0 pr-2">
            <p className="truncate font-semibold text-slate-900 dark:text-white">
              {activeBev.name}
            </p>
            <p className="truncate text-slate-500 dark:text-slate-400">
              Fator {factorPercent}% ·{' '}
              <span className="font-mono-num font-semibold text-amber-700 dark:text-[#E8C967]">
                +{coinPreview} Ouro
              </span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Hidratação real</p>
            <p className="font-mono-num text-sm font-bold text-sky-600 dark:text-sky-400">
              +{formatMl(effectiveMl)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="btn-spring mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400"
        >
          <span>
            Adicionar {formatMl(volumeMl)} de {activeBev.shortName}
          </span>
          <span className="font-mono-num inline-flex items-center gap-0.5 text-xs opacity-90">
            · <Coins className="h-3.5 w-3.5" />+{coinPreview}
          </span>
        </button>
      </div>
    </div>
  );
};

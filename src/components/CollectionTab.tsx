import React, { useState } from 'react';
import {
  Box,
  Check,
  Coins,
  Droplets,
  FlaskConical,
  Gift,
  Lock,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import {
  CHEST_COST_COINS,
  GLASS_MATERIALS,
  GLASS_MATERIAL_MAP,
  LIQUID_EFFECTS,
  RARITY_META,
  SHIELD_COST_COINS,
} from '../data/alchemy';
import { MASCOTS, MASCOT_MAP } from '../data/mascots';
import {
  GachaReward,
  GlassMaterialId,
  LiquidEffectId,
  LiquidLayer,
  MascotId,
  Rarity,
} from '../types/hydration';
import { Character3DStage } from './Character3DStage';
import { MascotLiquidSvg } from './MascotLiquidSvg';

type CollectionSubTab = 'criaturas' | 'bau' | 'alquimia';

interface CollectionTabProps {
  activeMascotId: MascotId;
  unlockedMascotIds: MascotId[];
  activeGlassMaterialId: GlassMaterialId;
  unlockedGlassMaterialIds: GlassMaterialId[];
  activeLiquidEffectId: LiquidEffectId;
  unlockedLiquidEffectIds: LiquidEffectId[];
  goldCoins: number;
  streakShields: number;
  remainingGachaCount: number;
  todayLayers: LiquidLayer[];
  todayClampedPercent: number;
  lastDrinkColor: string;
  soundEnabled: boolean;
  onSelectMascot: (id: MascotId) => void;
  onSelectGlassMaterial: (id: GlassMaterialId) => void;
  onSelectLiquidEffect: (id: LiquidEffectId) => void;
  onOpenChest: () => GachaReward | null;
  onBuyStreakShield: () => void;
}

const RARITY_ORDER: Rarity[] = ['comum', 'raro', 'epico', 'lendario'];

export const CollectionTab: React.FC<CollectionTabProps> = ({
  activeMascotId,
  unlockedMascotIds,
  activeGlassMaterialId,
  unlockedGlassMaterialIds,
  activeLiquidEffectId,
  unlockedLiquidEffectIds,
  goldCoins,
  streakShields,
  remainingGachaCount,
  todayLayers,
  todayClampedPercent,
  lastDrinkColor,
  soundEnabled,
  onSelectMascot,
  onSelectGlassMaterial,
  onSelectLiquidEffect,
  onOpenChest,
  onBuyStreakShield,
}) => {
  const [subTab, setSubTab] = useState<CollectionSubTab>('criaturas');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'todas'>('todas');
  const [chestShaking, setChestShaking] = useState(false);
  const [revealedReward, setRevealedReward] = useState<GachaReward | null>(null);
  const [inspectedMascotId, setInspectedMascotId] = useState<MascotId | null>(null);
  const [modalDrinkKey, setModalDrinkKey] = useState(0);

  const unlockedMascotSet = new Set(unlockedMascotIds);
  const unlockedMaterialSet = new Set(unlockedGlassMaterialIds);
  const unlockedEffectSet = new Set(unlockedLiquidEffectIds);

  const activeMascot = MASCOT_MAP[activeMascotId] || MASCOT_MAP.gnomo;

  const handleChestClick = () => {
    if (chestShaking || goldCoins < CHEST_COST_COINS || remainingGachaCount === 0) return;
    setChestShaking(true);
    window.setTimeout(() => {
      const reward = onOpenChest();
      setChestShaking(false);
      if (reward) {
        setRevealedReward(reward);
      }
    }, 680);
  };

  const handleEquipReward = (reward: GachaReward) => {
    if (reward.kind === 'mascot') onSelectMascot(reward.id);
    else if (reward.kind === 'material') onSelectGlassMaterial(reward.id);
    else onSelectLiquidEffect(reward.id);
    setRevealedReward(null);
  };

  const previewLayersForAlchemy: LiquidLayer[] =
    todayLayers.length > 0
      ? todayLayers
      : [
          {
            beverageId: 'agua',
            name: 'Água',
            color: activeMascot.accentColor,
            waveHighlight: activeMascot.waveColor,
            rawMl: 1000,
            hydratedMl: 1000,
            startPercent: 0,
            heightPercent: 68,
          },
        ];

  const visibleRarities =
    rarityFilter === 'todas' ? RARITY_ORDER : RARITY_ORDER.filter((r) => r === rarityFilter);

  return (
    <div className="pb-nav-safe flex flex-col">
      <header className="mb-3.5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Coleção & Boticário
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {unlockedMascotIds.length} de {MASCOTS.length} criaturas ·{' '}
          {unlockedGlassMaterialIds.length}/{GLASS_MATERIALS.length} vidros ·{' '}
          {unlockedLiquidEffectIds.length}/{LIQUID_EFFECTS.length} efeitos
        </p>
      </header>

      {/* Clean 3-Sub-Tab Switcher */}
      <div
        role="tablist"
        aria-label="Seções da coleção"
        className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-slate-200/75 p-1 dark:bg-[#101522]"
      >
        {(
          [
            { id: 'criaturas', label: 'Criaturas' },
            { id: 'bau', label: 'Baú do Gnomo' },
            { id: 'alquimia', label: 'Alquimia' },
          ] as const
        ).map((tab) => {
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSubTab(tab.id)}
              className={`btn-spring min-h-[40px] rounded-xl px-2 text-xs font-semibold whitespace-nowrap ${
                active
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-[#1B2438] dark:text-[#F3D77A]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================= */}
      {/* SUB-TAB 1: 16 CRIATURAS POR RARIDADE                          */}
      {/* ============================================================= */}
      {subTab === 'criaturas' && (
        <div>
          {/* Rarity Filter Bar */}
          <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            {(
              [
                { id: 'todas', label: 'Todas (16)' },
                { id: 'comum', label: 'Comuns' },
                { id: 'raro', label: 'Raros' },
                { id: 'epico', label: 'Épicos' },
                { id: 'lendario', label: 'Lendários' },
              ] as const
            ).map((f) => {
              const active = rarityFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRarityFilter(f.id)}
                  aria-pressed={active}
                  className={`btn-spring min-h-[36px] shrink-0 rounded-xl border px-3 text-xs font-semibold whitespace-nowrap ${
                    active
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-amber-800 dark:text-[#F3D77A]'
                      : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-[#101522] dark:text-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-6">
            {visibleRarities.map((rarity) => {
              const meta = RARITY_META[rarity];
              const group = MASCOTS.filter((m) => m.rarity === rarity);

              return (
                <section key={rarity} aria-label={meta.groupTitle}>
                  <div className="mb-2.5 flex items-center justify-between">
                    <h2 className={`font-display text-sm font-bold ${meta.textClass}`}>
                      {meta.groupTitle}
                    </h2>
                    <span className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400">
                      {group.filter((m) => unlockedMascotSet.has(m.id)).length}/{group.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {group.map((mascot) => {
                      const isUnlocked = unlockedMascotSet.has(mascot.id);
                      const isActive = mascot.id === activeMascotId;

                      const cardLayers: LiquidLayer[] =
                        isActive && todayLayers.length > 0
                          ? todayLayers
                          : [
                              {
                                beverageId: 'agua',
                                name: 'Água',
                                color: mascot.accentColor,
                                waveHighlight: mascot.waveColor,
                                rawMl: 1000,
                                hydratedMl: 1000,
                                startPercent: 0,
                                heightPercent: 66,
                              },
                            ];

                      const cardPercent = isActive ? Math.max(28, todayClampedPercent) : 66;

                      return (
                        <div key={mascot.id} className="relative">
                          <button
                            type="button"
                            disabled={!isUnlocked}
                            onClick={() => isUnlocked && onSelectMascot(mascot.id)}
                            aria-pressed={isActive}
                            aria-label={
                              isUnlocked
                                ? `${mascot.name} (${meta.label})${isActive ? ' — ativo' : ' — tocar para equipar'}`
                                : `${mascot.name} bloqueado: ${mascot.unlockConditionText}`
                            }
                            className={`btn-spring relative flex h-full w-full flex-col items-center rounded-2xl border p-3 text-center ${
                              isActive
                                ? `${meta.activeRingClass} bg-white dark:bg-[#141C2E]`
                                : isUnlocked
                                  ? `${meta.borderClass} bg-white hover:bg-slate-50 dark:bg-[#101522] dark:hover:bg-[#141B2D]`
                                  : 'cursor-not-allowed border-slate-200/80 bg-slate-100/75 opacity-80 dark:border-slate-800/80 dark:bg-[#0C101B]'
                            }`}
                          >
                            {/* Top-right status icon */}
                            <div className="absolute top-2.5 right-2.5">
                              {isActive ? (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-slate-950">
                                  <Check className="h-3.5 w-3.5 stroke-[2.8]" />
                                </span>
                              ) : !isUnlocked ? (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                  <Lock className="h-3.5 w-3.5" />
                                </span>
                              ) : null}
                            </div>

                            <div className="my-0.5 flex items-center justify-center">
                              <MascotLiquidSvg
                                mascot={mascot}
                                layers={cardLayers}
                                clampedPercent={cardPercent}
                                glassMaterialId={isActive ? activeGlassMaterialId : 'cristal'}
                                liquidEffectId={isActive ? activeLiquidEffectId : 'nenhum'}
                                size="card"
                                locked={!isUnlocked}
                              />
                            </div>

                            <h3 className="font-display mt-1 text-sm font-bold leading-tight text-slate-900 dark:text-white">
                              {mascot.name}
                            </h3>

                            <p className={`mt-0.5 text-[11px] font-medium ${meta.textClass}`}>
                              {meta.label}
                              {isActive ? ' · Ativo' : ''}
                            </p>

                            <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                              {isUnlocked ? mascot.subtitle : mascot.unlockConditionText}
                            </p>
                          </button>

                          {/* Discreet 3D Inspection Modal trigger (keeps 16-card grid 100% lightweight SVG) */}
                          {isUnlocked && (
                            <button
                              type="button"
                              onClick={() => {
                                setModalDrinkKey(0);
                                setInspectedMascotId(mascot.id);
                              }}
                              data-testid={`inspect-3d-${mascot.id}`}
                              aria-label={`Inspecionar ${mascot.name} em 3D`}
                              title={`Ver ${mascot.name} em 3D`}
                              className="btn-spring absolute top-2 left-2 z-10 inline-flex min-h-[28px] items-center gap-1 rounded-lg border border-slate-200/90 bg-white/95 px-2 text-[10px] font-bold text-slate-700 shadow-xs hover:border-[#D4AF37]/70 hover:text-amber-700 dark:border-slate-700 dark:bg-[#101522]/95 dark:text-slate-200 dark:hover:text-[#F3D77A]"
                            >
                              <Box className="h-3 w-3 shrink-0" />
                              <span>3D</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 2: BAÚ DO GNOMO (GACHA) & ESCUDO DE OFENSIVA          */}
      {/* ============================================================= */}
      {subTab === 'bau' && (
        <div className="space-y-4">
          {/* Mystery Golden Chest Card */}
          <section className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/60 bg-white p-5 text-center dark:bg-[#101522]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 left-1/2 h-36 w-56 -translate-x-1/2 rounded-full bg-[#D4AF37]/18 blur-3xl"
            />

            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-3xl border border-[#D4AF37]/70 bg-gradient-to-br from-[#F3D77A] via-[#D4AF37] to-[#926B16] text-slate-950 shadow-xl shadow-amber-500/20 ${
                  chestShaking ? 'animate-chest-shake' : ''
                }`}
              >
                <Gift className="h-10 w-10 stroke-[2.2]" />
              </div>
            </div>

            <h2 className="font-display mt-3 text-xl font-bold text-slate-900 dark:text-white">
              Baú Misterioso do Gnomo
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Sorteia <strong className="text-slate-900 dark:text-white">1 item inédito</strong>{' '}
              sem repetição: criatura lendária/rara, material de vidro ou efeito mágico no líquido.
            </p>

            <p className="font-mono-num mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              Itens restantes no baú: {remainingGachaCount} · Seu saldo: {goldCoins} Ouro
            </p>

            <button
              type="button"
              disabled={chestShaking || goldCoins < CHEST_COST_COINS || remainingGachaCount === 0}
              onClick={handleChestClick}
              className={`btn-spring mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold whitespace-nowrap ${
                remainingGachaCount === 0
                  ? 'cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  : goldCoins >= CHEST_COST_COINS
                    ? 'bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-105'
                    : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'
              }`}
            >
              <Coins className="h-4 w-4 shrink-0" />
              <span>
                {chestShaking
                  ? 'Abrindo o Baú...'
                  : remainingGachaCount === 0
                    ? 'Coleção Completa!'
                    : `Abrir Baú (${CHEST_COST_COINS} Ouro)`}
              </span>
            </button>
          </section>

          {/* Streak Shield Consumable Shop Card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#101522]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/45 bg-[#D4AF37]/12 text-amber-700 dark:text-[#E8C967]">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Escudo de Ofensiva
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    Protege automaticamente sua ofensiva se você esquecer de bater a meta por 1 dia.
                  </p>
                  <p className="font-mono-num mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    No inventário: {streakShields} escudo(s)
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={goldCoins < SHIELD_COST_COINS}
              onClick={onBuyStreakShield}
              className={`btn-spring mt-3.5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold ${
                goldCoins >= SHIELD_COST_COINS
                  ? 'border border-[#D4AF37]/60 bg-[#D4AF37]/15 text-amber-800 hover:bg-[#D4AF37]/25 dark:text-[#F3D77A]'
                  : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'
              }`}
            >
              <Coins className="h-4 w-4 shrink-0" />
              <span>Comprar Escudo ({SHIELD_COST_COINS} Ouro)</span>
            </button>
          </section>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 3: ALQUIMIA (MATERIAIS DE VIDRO & EFEITOS NO LÍQUIDO) */}
      {/* ============================================================= */}
      {subTab === 'alquimia' && (
        <div className="space-y-5">
          {/* Live Single-WebGLRenderer 3D Alchemy Preview (Pedestal + Rim Light + 3D Particles) */}
          <section className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-4 py-4 text-center dark:border-slate-800 dark:bg-[#101522]">
            {!revealedReward && !inspectedMascotId ? (
              <Character3DStage
                mascotId={activeMascot.id}
                rarity={activeMascot.rarity}
                mascotName={activeMascot.name}
                glassMaterialId={activeGlassMaterialId}
                liquidEffectId={activeLiquidEffectId}
                layers={previewLayersForAlchemy}
                clampedPercent={Math.max(52, todayClampedPercent)}
                rawPercent={Math.max(52, todayClampedPercent)}
                drinkColor={lastDrinkColor}
                soundEnabled={soundEnabled}
                showProgressRing={false}
                allowZoom={false}
                size="alchemy"
              />
            ) : (
              <div className="h-[220px] w-[220px]" />
            )}
            <p className="font-display mt-1 text-base font-bold text-slate-900 dark:text-white">
              {activeMascot.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {GLASS_MATERIAL_MAP[activeGlassMaterialId].name} ·{' '}
              {LIQUID_EFFECTS.find((e) => e.id === activeLiquidEffectId)?.name}
            </p>
          </section>

          {/* Glass Materials List */}
          <section aria-labelledby="glass-materials-heading">
            <h2
              id="glass-materials-heading"
              className="font-display mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"
            >
              <FlaskConical className="h-4 w-4 text-[#D4AF37]" />
              <span>Materiais Alquímicos (Pedestal &amp; Luz 3D)</span>
            </h2>

            <div className="space-y-2">
              {GLASS_MATERIALS.map((mat) => {
                const isUnlocked = unlockedMaterialSet.has(mat.id);
                const isEquipped = activeGlassMaterialId === mat.id;
                const rarityMeta = RARITY_META[mat.rarity];

                return (
                  <button
                    key={mat.id}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && onSelectGlassMaterial(mat.id)}
                    aria-pressed={isEquipped}
                    className={`btn-spring flex min-h-[60px] w-full items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-left ${
                      isEquipped
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 dark:bg-[#161F33]'
                        : isUnlocked
                          ? 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#101522]'
                          : 'cursor-not-allowed border-slate-200/70 bg-slate-100/70 opacity-75 dark:border-slate-800/70 dark:bg-[#0C101B]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-9 w-9 shrink-0 rounded-xl border border-white/25 shadow-xs"
                        style={{ background: mat.previewSwatch }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {mat.name}{' '}
                          <span className={`text-[11px] font-medium ${rarityMeta.textClass}`}>
                            · {rarityMeta.label}
                          </span>
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {isUnlocked ? mat.description : 'Desbloqueie no Baú do Gnomo'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isEquipped ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-slate-950">
                          <Check className="h-4 w-4 stroke-[2.8]" />
                        </span>
                      ) : !isUnlocked ? (
                        <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      ) : (
                        <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                          Equipar
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Liquid Magic Effects List */}
          <section aria-labelledby="liquid-effects-heading">
            <h2
              id="liquid-effects-heading"
              className="font-display mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"
            >
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              <span>Efeitos Mágicos 3D</span>
            </h2>

            <div className="space-y-2">
              {LIQUID_EFFECTS.map((eff) => {
                const isUnlocked = unlockedEffectSet.has(eff.id);
                const isEquipped = activeLiquidEffectId === eff.id;
                const rarityMeta = RARITY_META[eff.rarity];

                return (
                  <button
                    key={eff.id}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && onSelectLiquidEffect(eff.id)}
                    aria-pressed={isEquipped}
                    className={`btn-spring flex min-h-[60px] w-full items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-left ${
                      isEquipped
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 dark:bg-[#161F33]'
                        : isUnlocked
                          ? 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#101522]'
                          : 'cursor-not-allowed border-slate-200/70 bg-slate-100/70 opacity-75 dark:border-slate-800/70 dark:bg-[#0C101B]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15"
                        style={{ backgroundColor: `${eff.previewColor}28`, color: eff.previewColor }}
                        aria-hidden="true"
                      >
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {eff.name}{' '}
                          <span className={`text-[11px] font-medium ${rarityMeta.textClass}`}>
                            · {rarityMeta.label}
                          </span>
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {isUnlocked ? eff.description : 'Desbloqueie no Baú do Gnomo'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isEquipped ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-slate-950">
                          <Check className="h-4 w-4 stroke-[2.8]" />
                        </span>
                      ) : !isUnlocked ? (
                        <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      ) : (
                        <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                          Equipar
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Gacha Reward Reveal Modal */}
      {revealedReward && (
        <div
          className="modal-safe-padding fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chest-reward-title"
        >
          <div className="relative max-h-[88dvh] w-full max-w-[350px] overflow-y-auto rounded-3xl border border-[#D4AF37]/70 bg-white p-6 text-center shadow-2xl dark:bg-[#101522]">
            <button
              type="button"
              onClick={() => setRevealedReward(null)}
              aria-label="Fechar recompensa do baú"
              className="btn-spring absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <p className={`text-xs font-bold ${RARITY_META[revealedReward.rarity].textClass}`}>
              {RARITY_META[revealedReward.rarity].label} ·{' '}
              {revealedReward.kind === 'mascot'
                ? 'Nova Criatura'
                : revealedReward.kind === 'material'
                  ? 'Material de Vidro'
                  : 'Efeito Mágico'}
            </p>

            <h2
              id="chest-reward-title"
              className="font-display mt-1 text-2xl font-bold text-slate-900 dark:text-white"
            >
              {revealedReward.name}
            </h2>

            <div className="my-4 flex justify-center">
              {revealedReward.kind === 'mascot' ? (
                <MascotLiquidSvg
                  mascot={MASCOT_MAP[revealedReward.id]}
                  layers={[
                    {
                      beverageId: 'agua',
                      name: 'Água',
                      color: MASCOT_MAP[revealedReward.id].accentColor,
                      waveHighlight: MASCOT_MAP[revealedReward.id].waveColor,
                      rawMl: 1000,
                      hydratedMl: 1000,
                      startPercent: 0,
                      heightPercent: 75,
                    },
                  ]}
                  clampedPercent={75}
                  glassMaterialId={activeGlassMaterialId}
                  liquidEffectId={activeLiquidEffectId}
                  size="modal"
                />
              ) : (
                <MascotLiquidSvg
                  mascot={activeMascot}
                  layers={previewLayersForAlchemy}
                  clampedPercent={72}
                  glassMaterialId={
                    revealedReward.kind === 'material'
                      ? revealedReward.id
                      : activeGlassMaterialId
                  }
                  liquidEffectId={
                    revealedReward.kind === 'effect'
                      ? revealedReward.id
                      : activeLiquidEffectId
                  }
                  size="modal"
                />
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">{revealedReward.subtitle}</p>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleEquipReward(revealedReward)}
                className="btn-spring min-h-[46px] w-full rounded-2xl bg-[#D4AF37] px-4 text-sm font-bold text-slate-950 hover:brightness-105"
              >
                Equipar agora
              </button>
              <button
                type="button"
                onClick={() => setRevealedReward(null)}
                className="btn-spring min-h-[44px] w-full rounded-2xl bg-slate-100 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                Guardar na Coleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single-WebGLRenderer 3D Creature Inspection Modal */}
      {inspectedMascotId && (() => {
        const inspected = MASCOT_MAP[inspectedMascotId];
        if (!inspected) return null;
        const rarMeta = RARITY_META[inspected.rarity];
        const isAlreadyEquipped = inspected.id === activeMascotId;

        return (
          <div
            data-testid="modal-inspect-3d"
            className="modal-safe-padding fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspect-3d-title"
          >
            <div className="relative max-h-[90dvh] w-full max-w-[368px] overflow-y-auto rounded-3xl border border-[#D4AF37]/65 bg-white p-5 text-center shadow-2xl dark:bg-[#101522]">
              <button
                type="button"
                onClick={() => setInspectedMascotId(null)}
                aria-label="Fechar visualização 3D"
                className="btn-spring absolute top-3.5 right-3.5 z-20 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>

              <p className={`text-xs font-bold ${rarMeta.textClass}`}>{rarMeta.label}</p>
              <h2
                id="inspect-3d-title"
                className="font-display mt-0.5 text-xl font-bold text-slate-900 dark:text-white"
              >
                {inspected.name}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {inspected.subtitle}
              </p>

              <div className="my-2 flex flex-col items-center justify-center">
                <Character3DStage
                  mascotId={inspected.id}
                  rarity={inspected.rarity}
                  mascotName={inspected.name}
                  glassMaterialId={activeGlassMaterialId}
                  liquidEffectId={activeLiquidEffectId}
                  layers={todayLayers}
                  clampedPercent={Math.max(60, todayClampedPercent)}
                  rawPercent={Math.max(60, todayClampedPercent)}
                  drinkColor={lastDrinkColor}
                  drinkTriggerKey={modalDrinkKey}
                  soundEnabled={soundEnabled}
                  showProgressRing={false}
                  allowZoom
                  size="modal"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Arraste para girar 360° · Pinça/scroll para zoom
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModalDrinkKey((k) => k + 1)}
                  className="btn-spring flex min-h-[46px] items-center justify-center gap-1.5 rounded-2xl border border-sky-500/45 bg-sky-500/12 px-3 text-xs font-bold text-sky-700 hover:bg-sky-500/20 dark:text-sky-300"
                >
                  <Droplets className="h-4 w-4 shrink-0" />
                  <span>Beber agora</span>
                </button>

                <button
                  type="button"
                  disabled={isAlreadyEquipped}
                  onClick={() => {
                    onSelectMascot(inspected.id);
                    setInspectedMascotId(null);
                  }}
                  className={`btn-spring flex min-h-[46px] items-center justify-center gap-1.5 rounded-2xl px-3 text-xs font-bold ${
                    isAlreadyEquipped
                      ? 'cursor-default border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-amber-800 dark:text-[#F3D77A]'
                      : 'bg-[#D4AF37] text-slate-950 hover:brightness-105'
                  }`}
                >
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{isAlreadyEquipped ? 'Equipada' : 'Equipar'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

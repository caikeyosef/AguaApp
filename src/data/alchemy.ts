import {
  GlassMaterialDefinition,
  GlassMaterialId,
  LiquidEffectDefinition,
  LiquidEffectId,
  Rarity,
} from '../types/hydration';

export const CHEST_COST_COINS = 150;
export const SHIELD_COST_COINS = 200;

export const RARITY_META: Record<
  Rarity,
  {
    label: string;
    groupTitle: string;
    borderClass: string;
    activeRingClass: string;
    textClass: string;
    dotColor: string;
  }
> = {
  comum: {
    label: 'Comum',
    groupTitle: 'Comuns · Bosque & Pântano',
    borderClass: 'border-slate-300/90 dark:border-slate-600/75',
    activeRingClass: 'border-slate-400 ring-1 ring-slate-400/50 dark:border-slate-300',
    textClass: 'text-slate-600 dark:text-slate-300',
    dotColor: '#94A3B8',
  },
  raro: {
    label: 'Raro',
    groupTitle: 'Raros · Criptídeos & Lendas Bizarras',
    borderClass: 'border-sky-400/80 dark:border-sky-500/60',
    activeRingClass: 'border-sky-500 ring-1 ring-sky-400/60',
    textClass: 'text-sky-700 dark:text-sky-300',
    dotColor: '#38BDF8',
  },
  epico: {
    label: 'Épico',
    groupTitle: 'Épicos · Folclore & Magia',
    borderClass: 'border-violet-400/85 dark:border-violet-500/65',
    activeRingClass: 'border-violet-500 ring-1 ring-violet-400/65',
    textClass: 'text-violet-700 dark:text-violet-300',
    dotColor: '#A855F7',
  },
  lendario: {
    label: 'Lendário',
    groupTitle: 'Lendários · Relíquias de Ouro',
    borderClass: 'border-[#D4AF37]/90 dark:border-[#D4AF37]/80',
    activeRingClass: 'border-[#D4AF37] ring-1 ring-[#D4AF37]/70',
    textClass: 'text-amber-700 dark:text-[#E8C967]',
    dotColor: '#D4AF37',
  },
};

export const GLASS_MATERIALS: GlassMaterialDefinition[] = [
  {
    id: 'cristal',
    name: 'Cristal Puro',
    description: 'Vidro soprado translúcido com brilho limpo de boticário.',
    rarity: 'comum',
    starterUnlocked: true,
    rimStart: '#FFFFFF',
    rimMid: '#CBD5E1',
    rimEnd: '#475569',
    glassTintInner: 'rgba(226, 232, 240, 0.14)',
    glassTintOuter: 'rgba(15, 23, 42, 0.34)',
    specularColor: '#FFFFFF',
    previewSwatch: 'linear-gradient(135deg, #F8FAFC 0%, #94A3B8 55%, #334155 100%)',
  },
  {
    id: 'esmeralda',
    name: 'Vidro de Esmeralda',
    description: 'Frasco alquímico tingido em verde-esmeralda translúcido.',
    rarity: 'raro',
    starterUnlocked: false,
    rimStart: '#A7F3D0',
    rimMid: '#10B981',
    rimEnd: '#064E3B',
    glassTintInner: 'rgba(52, 211, 153, 0.22)',
    glassTintOuter: 'rgba(6, 78, 59, 0.42)',
    specularColor: '#D1FAE5',
    previewSwatch: 'linear-gradient(135deg, #A7F3D0 0%, #10B981 55%, #064E3B 100%)',
  },
  {
    id: 'obsidiana',
    name: 'Obsidiana Fumê',
    description: 'Cristal vulcânico escuro com reflexo prateado polido.',
    rarity: 'epico',
    starterUnlocked: false,
    rimStart: '#E2E8F0',
    rimMid: '#64748B',
    rimEnd: '#020617',
    glassTintInner: 'rgba(71, 85, 105, 0.25)',
    glassTintOuter: 'rgba(2, 6, 23, 0.62)',
    specularColor: '#E2E8F0',
    previewSwatch: 'linear-gradient(135deg, #CBD5E1 0%, #334155 50%, #020617 100%)',
  },
  {
    id: 'ouro',
    name: 'Borda Dourada',
    description: 'Acabamento real em ouro envelhecido com brilho quente.',
    rarity: 'lendario',
    starterUnlocked: false,
    rimStart: '#FEF3C7',
    rimMid: '#D4AF37',
    rimEnd: '#78350F',
    glassTintInner: 'rgba(251, 191, 36, 0.16)',
    glassTintOuter: 'rgba(120, 53, 15, 0.34)',
    specularColor: '#FEF9C3',
    previewSwatch: 'linear-gradient(135deg, #FEF3C7 0%, #D4AF37 55%, #78350F 100%)',
  },
  {
    id: 'prisma',
    name: 'Prisma Astral',
    description: 'Cristal iridescente que refrata luz violeta, ciano e ouro.',
    rarity: 'lendario',
    starterUnlocked: false,
    rimStart: '#F0ABFC',
    rimMid: '#38BDF8',
    rimEnd: '#FDE047',
    glassTintInner: 'rgba(192, 132, 252, 0.22)',
    glassTintOuter: 'rgba(14, 116, 144, 0.36)',
    specularColor: '#F5D0FE',
    previewSwatch: 'linear-gradient(135deg, #F0ABFC 0%, #38BDF8 50%, #FDE047 100%)',
  },
];

export const GLASS_MATERIAL_MAP: Record<GlassMaterialId, GlassMaterialDefinition> =
  GLASS_MATERIALS.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<GlassMaterialId, GlassMaterialDefinition>
  );

export const LIQUID_EFFECTS: LiquidEffectDefinition[] = [
  {
    id: 'nenhum',
    name: 'Nenhum',
    description: 'Poção líquida pura, sem encantamentos extras.',
    rarity: 'comum',
    starterUnlocked: true,
    previewColor: '#64748B',
  },
  {
    id: 'gelo',
    name: 'Cubos de Gelo do Yeti',
    description: 'Cubos translúcidos flutuando sobre o menisco da bebida.',
    rarity: 'raro',
    starterUnlocked: false,
    previewColor: '#38BDF8',
  },
  {
    id: 'poeira-estelar',
    name: 'Poeira Estelar',
    description: 'Partículas mágicas cintilantes suspensas dentro do líquido.',
    rarity: 'epico',
    starterUnlocked: false,
    previewColor: '#C084FC',
  },
  {
    id: 'bolhas-douradas',
    name: 'Bolhas Douradas',
    description: 'Efervescência contínua de microbolhas de ouro líquido.',
    rarity: 'epico',
    starterUnlocked: false,
    previewColor: '#D4AF37',
  },
  {
    id: 'nevoa',
    name: 'Névoa de Caldeirão',
    description: 'Vapor místico suave subindo acima da superfície da poção.',
    rarity: 'lendario',
    starterUnlocked: false,
    previewColor: '#5EEAD4',
  },
];

export const LIQUID_EFFECT_MAP: Record<LiquidEffectId, LiquidEffectDefinition> =
  LIQUID_EFFECTS.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<LiquidEffectId, LiquidEffectDefinition>
  );

import { BeverageDefinition, BeverageId } from '../types/hydration';

export const BEVERAGES: BeverageDefinition[] = [
  {
    id: 'agua',
    name: 'Água',
    shortName: 'Água',
    color: '#0EA5E9',
    waveHighlight: '#38BDF8',
    hydrationFactor: 1.0,
    description: 'Hidratação pura e imediata',
    isHealthyVariety: true,
  },
  {
    id: 'cafe',
    name: 'Café',
    shortName: 'Café',
    color: '#78350F',
    waveHighlight: '#B45309',
    hydrationFactor: 0.8,
    description: 'Leve efeito diurético pela cafeína',
    isHealthyVariety: false,
  },
  {
    id: 'cha',
    name: 'Chá',
    shortName: 'Chá',
    color: '#10B981',
    waveHighlight: '#34D399',
    hydrationFactor: 0.95,
    description: 'Infusão leve e refrescante',
    isHealthyVariety: true,
  },
  {
    id: 'suco',
    name: 'Suco',
    shortName: 'Suco',
    color: '#F97316',
    waveHighlight: '#FB923C',
    hydrationFactor: 0.9,
    description: 'Natural com vitaminas e água',
    isHealthyVariety: true,
  },
  {
    id: 'isotonico',
    name: 'Isotônico / Água de Coco',
    shortName: 'Isotônico',
    color: '#06B6D4',
    waveHighlight: '#22D3EE',
    hydrationFactor: 1.1,
    description: 'Eletrólitos que aceleram a absorção',
    isHealthyVariety: true,
  },
  {
    id: 'leite',
    name: 'Leite / Shake',
    shortName: 'Leite',
    color: '#E2E8F0',
    waveHighlight: '#F8FAFC',
    hydrationFactor: 1.0,
    description: 'Retenção prolongada de líquidos',
    isHealthyVariety: false,
  },
  {
    id: 'refrigerante',
    name: 'Refrigerante',
    shortName: 'Refri',
    color: '#991B1B',
    waveHighlight: '#DC2626',
    hydrationFactor: 0.75,
    description: 'Menor aproveitamento hídrico',
    isHealthyVariety: false,
  },
];

export const BEVERAGE_MAP: Record<BeverageId, BeverageDefinition> = BEVERAGES.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<BeverageId, BeverageDefinition>
);

export const VOLUME_PRESETS = [150, 250, 350, 500] as const;

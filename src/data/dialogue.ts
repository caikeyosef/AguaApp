import { BeverageId } from '../types/hydration';

export type SpeechContext =
  | { type: 'beverage'; beverageId: BeverageId }
  | { type: 'goal_reached' }
  | { type: 'dry_spell' }
  | { type: 'workout' }
  | { type: 'tap' }
  | { type: 'idle' };

const BEVERAGE_QUIPS: Record<BeverageId, string[]> = {
  agua: [
    'Água pura! Rara e lendária.',
    'O nível do chapéu tá subindo!',
    'Seus rins acabaram de aplaudir de pé.',
    'Cristalina e sem drama. Aprovado pela guilda.',
  ],
  cafe: [
    'Mais café? Suas olheiras já têm CEP próprio.',
    'O Goblin aprovou, seus rins nem tanto.',
    'Poção de produtividade registrada (80% de água, 20% caos).',
    'Cafeína no frasco! Só não esqueça da água depois.',
  ],
  cha: [
    'Chá quentinho... que chique, mestre alquimista.',
    'Infusão de ervas aprovada pelo Sapo Mago.',
    '95% hidratação e 100% paz interior.',
  ],
  suco: [
    'Elixir de frutas! Vitamina aprovada no frasco.',
    'Cor vibrante garantida na camada de hoje.',
    'Suco fresco! Quase tão puro quanto água da fonte.',
  ],
  isotonico: [
    '110% de hidratação! Poção turbinada detectada.',
    'Eletrólitos mágicos — o Yeti ficou com inveja.',
    'Bônus de absorção ativado! Escolha de campeão.',
  ],
  leite: [
    'Poção cremosa! Camada branca digna de alquimia.',
    '100% hidratação com textura de taverna.',
    'Leite no frasco — forte nos ossos e na meta.',
  ],
  refrigerante: [
    'Poção suspeita detectada... aceito 75%.',
    'Borbulhante e duvidoso, mas conta no grimório.',
    'Beba uma água depois pra equilibrar o feitiço.',
  ],
};

const GOAL_QUIPS = [
  'Hidratação nível mago supremo. Pode descansar, mortal.',
  '100% no frasco! A guilda dos boticários saúda você.',
  'Meta batida! Nem o Kraken aguenta tanta água.',
];

const DRY_QUIPS = [
  'Mestre, estou virando uva-passa aqui dentro.',
  'Faz tempo desde o último gole... manda uma poção aí!',
  'Tô mais seco que pergaminho antigo. Um copinho, vai?',
  'Alô? Tem água nesse reino hoje?',
];

const WORKOUT_QUIPS = [
  'Modo treino ativo! +500 ml pra compensar o suor épico.',
  'Calor ou batalha na academia? Mais poção no frasco!',
];

const TAP_QUIPS = [
  'Ei! Cuidado que eu sou de vidro soprado!',
  'Cutucando o frasco não enche a meta, mortal.',
  'Balança devagar que faz espuma!',
  'Olha o brilho desse cristal... mas prefiro cheio de água.',
  'Toque registrado. Agora manda um gole pra dentro!',
];

export function pickSpeechLine(context: SpeechContext, seedIndex: number): string {
  const safeIdx = Math.abs(Math.floor(seedIndex));
  switch (context.type) {
    case 'beverage': {
      const list = BEVERAGE_QUIPS[context.beverageId];
      return list[safeIdx % list.length];
    }
    case 'goal_reached':
      return GOAL_QUIPS[safeIdx % GOAL_QUIPS.length];
    case 'dry_spell':
      return DRY_QUIPS[safeIdx % DRY_QUIPS.length];
    case 'workout':
      return WORKOUT_QUIPS[safeIdx % WORKOUT_QUIPS.length];
    case 'tap':
      return TAP_QUIPS[safeIdx % TAP_QUIPS.length];
    case 'idle':
      return 'Pronto para misturar sua próxima poção de hidratação.';
  }
}

export function formatTimeSinceLastSip(lastTimestampIso: string | null, nowMs: number = Date.now()): {
  label: string;
  isOverTwoHours: boolean;
} {
  if (!lastTimestampIso) {
    return { label: 'Nenhum gole hoje', isOverTwoHours: true };
  }
  const parsed = Date.parse(lastTimestampIso);
  if (Number.isNaN(parsed)) {
    return { label: 'Último gole recente', isOverTwoHours: false };
  }
  const diffMin = Math.max(0, Math.floor((nowMs - parsed) / 60000));
  if (diffMin < 1) {
    return { label: 'Último gole agora', isOverTwoHours: false };
  }
  if (diffMin < 60) {
    return { label: `Último gole há ${diffMin} min`, isOverTwoHours: false };
  }
  const hours = Math.floor(diffMin / 60);
  const remMin = diffMin % 60;
  return {
    label: remMin > 0 ? `Último gole há ${hours}h ${remMin}m` : `Último gole há ${hours}h`,
    isOverTwoHours: diffMin >= 120,
  };
}

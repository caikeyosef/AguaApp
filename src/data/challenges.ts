import { ChallengeDefinition } from '../types/hydration';

export const CHALLENGES: ChallengeDefinition[] = [
  {
    id: 'pacto-agua-pura',
    title: 'Pacto da Água Pura',
    description: 'Beba apenas água pura hoje e atinja 100% da sua meta diária.',
    xpReward: 150,
    coinReward: 80,
    type: 'pure_water',
  },
  {
    id: 'ritual-amanhecer',
    title: 'Ritual do Amanhecer',
    description: 'Registre pelo menos 500 ml hidratados antes das 10h da manhã.',
    xpReward: 100,
    coinReward: 60,
    type: 'morning_boost',
  },
  {
    id: 'sobrevivente-treino',
    title: 'Sobrevivente do Treino',
    description: 'Ative o bônus Treino / Calor (+500 ml) e complete 100% da meta.',
    xpReward: 200,
    coinReward: 120,
    type: 'athlete_mode',
  },
  {
    id: 'alquimista-curioso',
    title: 'Alquimista Curioso',
    description: 'Experimente 3 tipos de bebidas diferentes no mesmo dia.',
    xpReward: 120,
    coinReward: 75,
    type: 'variety_3',
  },
  {
    id: 'guardiao-chama',
    title: 'Guardião da Chama',
    description: 'Mantenha 3 dias seguidos batendo 100% da sua meta diária.',
    xpReward: 250,
    coinReward: 150,
    type: 'streak_3',
  },
];

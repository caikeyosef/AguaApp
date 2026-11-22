import { MascotDefinition, MascotId } from '../types/hydration';

export const MASCOTS: MascotDefinition[] = [
  // =========================================================================
  // COMUNS · Bosque & Pântano
  // =========================================================================
  {
    id: 'gnomo',
    name: 'Gnomo Rabugento',
    subtitle: 'Fiscal oficial do nível do chapéu',
    rarity: 'comum',
    unlockConditionText: 'Disponível desde o início',
    starterUnlocked: true,
    accentColor: '#0EA5E9',
    waveColor: '#38BDF8',
    fillTopY: 16,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 148, scaleX: 0.905, scaleY: 0.925 },
    measureX: 168,
    // Tall pointed gnome hat curving slightly at the tip, wide brim, round beard-belly body
    clipPathD:
      'M 124 16 C 142 32 152 68 158 96 C 172 100 184 108 182 118 C 178 124 168 124 160 124 C 178 142 186 168 182 196 C 176 222 154 238 120 238 C 86 238 64 222 58 196 C 54 168 62 142 80 124 C 72 124 62 124 58 118 C 56 108 68 100 82 96 C 90 66 106 30 124 16 Z',
    sculptPaths: [
      // Soft 3D creases folded into the tall pointed gnome hat
      { d: 'M 100 66 Q 124 76 148 64', stroke: '#020617', strokeWidth: 3.2, opacity: 0.24, blur: true },
      { d: 'M 90 88 Q 122 98 155 86', stroke: '#020617', strokeWidth: 3.8, opacity: 0.28, blur: true },
      // Deep shadow under hat brim casting onto forehead
      { d: 'M 72 122 Q 120 138 168 122 L 164 132 Q 120 144 76 132 Z', fill: '#020617', opacity: 0.3, blur: true },
      // Layered volumetric beard folds (3D relief shadows)
      { d: 'M 68 166 Q 94 186 120 174 Q 146 186 172 166', stroke: '#020617', strokeWidth: 4, opacity: 0.22, blur: true },
      { d: 'M 78 194 Q 100 212 120 200 Q 140 212 162 194', stroke: '#020617', strokeWidth: 3.6, opacity: 0.2, blur: true },
      // Soft volumetric cheek highlight behind nose
      { d: 'M 86 146 Q 120 156 154 146', stroke: '#FFFFFF', strokeWidth: 2.5, opacity: 0.16, blur: true },
    ],
    metallicPaths: [
      // Faceted crystal finial cap on the gnome's hat tip
      { d: 'M 124 11 L 130 20 L 124 27 L 118 20 Z', metal: 'crystal', fill: true, strokeWidth: 1.2 },
      // Aged-gold hat band with central square alchemical buckle
      { d: 'M 81 103 Q 120 116 159 103 L 160 112 Q 120 125 80 112 Z', metal: 'bronze', fill: true, opacity: 0.9 },
      { d: 'M 111 106 L 129 106 L 129 120 L 111 120 Z', metal: 'gold', fill: false, strokeWidth: 2.8 },
      { d: 'M 117 113 L 123 113', metal: 'gold', fill: false, strokeWidth: 2.2 },
      // Subtle gold alchemical base-ring framing the bottom
      { d: 'M 86 230 Q 120 238 154 230', metal: 'gold', fill: false, strokeWidth: 2.4, opacity: 0.8 },
    ],
    specularPaths: [
      { d: 'M 116 32 C 103 52 95 74 91 93', strokeWidth: 5, opacity: 0.62 },
      { d: 'M 71 148 C 64 172 67 198 81 216', strokeWidth: 6.5, opacity: 0.48 },
    ],
    pinpointHighlight: { cx: 118, cy: 29, rx: 3.2, ry: 2.1 },
    rightRimPath: 'M 174 146 C 181 170 179 198 165 218',
    eyes: [
      { cx: 102, cy: 136, rx: 4.5, ry: 4.5, browD: 'M 90 127 L 111 132' },
      { cx: 138, cy: 136, rx: 4.5, ry: 4.5, browD: 'M 150 127 L 129 132' },
    ],
    detailPaths: [
      { d: 'M 109 152 C 109 142 131 142 131 152 C 131 162 109 162 109 152 Z', fill: 'rgba(255,255,255,0.22)', strokeWidth: 2.4 },
      { d: 'M 74 161 Q 92 175 110 166 Q 120 177 130 166 Q 148 175 166 161', strokeWidth: 2.4, opacity: 0.8 },
      { d: 'M 86 196 Q 103 212 120 202 Q 137 212 154 196', strokeWidth: 2.2, opacity: 0.56 },
    ],
  },
  {
    id: 'sapo-mago',
    name: 'Sapo Mago',
    subtitle: 'Mestre em poções e cochilos no brejo',
    rarity: 'comum',
    unlockConditionText: 'Disponível desde o início',
    starterUnlocked: true,
    accentColor: '#10B981',
    waveColor: '#34D399',
    fillTopY: 22,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 152, scaleX: 0.905, scaleY: 0.925 },
    measureX: 184,
    clipPathD:
      'M 146 22 C 154 44 150 68 158 84 C 176 86 192 94 188 102 C 184 108 172 108 164 108 C 174 116 174 132 166 140 C 194 152 204 176 200 202 C 194 226 166 238 120 238 C 74 238 46 226 40 202 C 36 176 46 152 74 140 C 64 128 66 112 78 104 C 66 102 58 98 60 92 C 62 84 82 80 100 80 C 110 56 128 32 146 22 Z',
    sculptPaths: [
      // Crooked wizard hat fabric crease
      { d: 'M 114 58 Q 134 66 152 54', stroke: '#020617', strokeWidth: 3.4, opacity: 0.25, blur: true },
      // Plump frog cheek & chin volumetric shadows
      { d: 'M 56 172 Q 120 198 184 172', stroke: '#020617', strokeWidth: 4.5, opacity: 0.2, blur: true },
      { d: 'M 72 206 Q 120 190 168 206', stroke: '#FFFFFF', strokeWidth: 3.5, opacity: 0.14, blur: true },
    ],
    metallicPaths: [
      // Golden wizard hat band + mystical bronze star emblem
      { d: 'M 94 84 Q 126 94 162 86 L 163 94 Q 126 102 92 92 Z', metal: 'gold', fill: true, opacity: 0.92 },
      { d: 'M 134 54 L 136 60 L 142 61 L 137 64 L 139 70 L 134 66 L 129 70 L 131 64 L 126 61 L 132 60 Z', metal: 'gold', fill: true, opacity: 0.92 },
      // Alchemical throat amulet ring
      { d: 'M 113 176 A 7 7 0 1 0 127 176 A 7 7 0 1 0 113 176 Z', metal: 'gold', fill: false, strokeWidth: 2.2 },
    ],
    specularPaths: [
      { d: 'M 136 38 C 122 52 112 66 107 78', strokeWidth: 4.8, opacity: 0.56 },
      { d: 'M 54 166 C 48 186 52 208 68 220', strokeWidth: 6.5, opacity: 0.46 },
    ],
    pinpointHighlight: { cx: 141, cy: 31, rx: 3, ry: 2 },
    rightRimPath: 'M 188 158 C 196 178 194 202 178 218',
    eyes: [
      { cx: 88, cy: 122, rx: 9.5, ry: 9.5 },
      { cx: 152, cy: 122, rx: 9.5, ry: 9.5 },
    ],
    detailPaths: [
      { d: 'M 72 158 Q 120 180 168 158', strokeWidth: 2.8 },
      { d: 'M 78 206 Q 120 192 162 206', strokeWidth: 2.2, opacity: 0.44 },
    ],
  },
  {
    id: 'cogumelo',
    name: 'Cogumelo Vivo',
    subtitle: 'Sonolento 24 horas por dia',
    rarity: 'comum',
    unlockConditionText: 'Bata sua meta 1 vez ou sorteie no Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#F97316',
    waveColor: '#FB923C',
    fillTopY: 38,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 145, scaleX: 0.905, scaleY: 0.925 },
    measureX: 154,
    clipPathD:
      'M 120 38 C 178 38 214 78 212 118 C 210 134 188 142 160 142 C 164 170 168 206 158 224 C 148 236 134 238 120 238 C 106 238 92 236 82 224 C 72 206 76 170 80 142 C 52 142 30 134 28 118 C 26 78 62 38 120 38 Z',
    sculptPaths: [
      // Deep underside shadow beneath mushroom umbrella cap
      { d: 'M 54 134 Q 120 154 186 134 L 160 148 Q 120 160 80 148 Z', fill: '#020617', opacity: 0.34, blur: true },
      // Dome ribs curving over mushroom cap
      { d: 'M 64 114 Q 82 66 112 46 M 176 114 Q 158 66 128 46', stroke: '#020617', strokeWidth: 2.8, opacity: 0.18, blur: true },
    ],
    metallicPaths: [
      // Aged-cork & brass alchemical stem ring under the cap
      { d: 'M 79 144 Q 120 156 161 144 L 161 152 Q 120 164 79 152 Z', metal: 'cork', fill: true, opacity: 0.88 },
      { d: 'M 79 148 Q 120 160 161 148', metal: 'gold', fill: false, strokeWidth: 2.2 },
    ],
    specularPaths: [
      { d: 'M 48 94 C 58 64 84 48 114 46', strokeWidth: 6.5, opacity: 0.58 },
      { d: 'M 86 164 C 84 184 84 204 90 218', strokeWidth: 5, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 80, cy: 56, rx: 4.5, ry: 2.4 },
    rightRimPath: 'M 196 82 C 206 96 208 112 200 124 M 158 164 C 162 186 160 208 152 220',
    eyes: [
      { cx: 103, cy: 174, rx: 4.5, ry: 3.5, browD: 'M 94 167 Q 103 163 112 167' },
      { cx: 137, cy: 174, rx: 4.5, ry: 3.5, browD: 'M 128 167 Q 137 163 146 167' },
    ],
    detailPaths: [
      { d: 'M 72 86 A 12 10 0 1 0 72.1 86 Z', fill: 'rgba(255,255,255,0.28)', strokeWidth: 1.8 },
      { d: 'M 156 76 A 14 11 0 1 0 156.1 76 Z', fill: 'rgba(255,255,255,0.28)', strokeWidth: 1.8 },
      { d: 'M 118 64 A 9 8 0 1 0 118.1 64 Z', fill: 'rgba(255,255,255,0.28)', strokeWidth: 1.8 },
      { d: 'M 68 140 Q 120 152 172 140', strokeWidth: 2.4, opacity: 0.65 },
      { d: 'M 114 192 Q 120 198 126 192', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'goblin-cafe',
    name: 'Goblin do Café',
    subtitle: 'Movido a espresso e sarcasmo puro',
    rarity: 'comum',
    unlockConditionText: 'Registre 3 cafés ou sorteie no Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#B45309',
    waveColor: '#D97706',
    fillTopY: 50,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 152, scaleX: 0.905, scaleY: 0.925 },
    measureX: 162,
    clipPathD:
      'M 120 50 C 148 50 166 64 172 82 L 222 68 C 228 66 228 76 220 84 L 174 112 C 170 124 162 134 152 140 C 168 156 174 182 170 208 C 166 228 148 238 120 238 C 92 238 74 228 70 208 C 66 182 72 156 88 140 C 78 134 70 124 66 112 L 20 84 C 12 76 12 66 18 68 L 68 82 C 74 64 92 50 120 50 Z',
    sculptPaths: [
      // Deep inner hollows inside the long pointed goblin ears
      { d: 'M 28 76 L 64 92 L 62 104 Z', fill: '#020617', opacity: 0.28, blur: true },
      { d: 'M 212 76 L 176 92 L 178 104 Z', fill: '#020617', opacity: 0.28, blur: true },
      // Comic caffeinated forehead worry wrinkles & chin crease
      { d: 'M 98 68 Q 120 74 142 68 M 104 76 Q 120 81 136 76', stroke: '#020617', strokeWidth: 2.2, opacity: 0.26, blur: true },
      { d: 'M 88 142 Q 120 156 152 142', stroke: '#020617', strokeWidth: 3.6, opacity: 0.28, blur: true },
    ],
    metallicPaths: [
      // Double aged-gold ear cuffs pierced on the goblin's long ears
      { d: 'M 44 74 L 40 94 M 52 77 L 48 99', metal: 'gold', fill: false, strokeWidth: 2.8 },
      { d: 'M 196 74 L 200 94', metal: 'gold', fill: false, strokeWidth: 2.8 },
      // Brass alchemical collar around neck
      { d: 'M 88 139 Q 120 152 152 139 L 154 146 Q 120 159 86 146 Z', metal: 'bronze', fill: true, opacity: 0.9 },
    ],
    specularPaths: [
      { d: 'M 84 68 C 96 58 108 56 120 56', strokeWidth: 4.8, opacity: 0.54 },
      { d: 'M 80 164 C 76 184 78 206 88 220', strokeWidth: 5.8, opacity: 0.46 },
    ],
    pinpointHighlight: { cx: 96, cy: 61, rx: 3.5, ry: 2 },
    rightRimPath: 'M 164 162 C 169 182 168 204 158 220',
    eyes: [
      { cx: 100, cy: 96, rx: 6.5, ry: 6.5, browD: 'M 88 84 L 110 90' },
      { cx: 140, cy: 96, rx: 6.5, ry: 6.5, browD: 'M 152 84 L 130 90' },
    ],
    detailPaths: [
      { d: 'M 91 106 Q 100 112 109 106 M 131 106 Q 140 112 149 106', strokeWidth: 2.2, opacity: 0.72 },
      { d: 'M 118 102 L 124 110 L 116 112', strokeWidth: 2.2 },
      { d: 'M 98 122 Q 120 134 142 120', strokeWidth: 2.6 },
      { d: 'M 106 125 L 109 131 L 112 126 M 131 124 L 134 130 L 137 122', strokeWidth: 2 },
    ],
  },

  // =========================================================================
  // RAROS · Criptídeos & Lendas Bizarras
  // =========================================================================
  {
    id: 'nessie',
    name: 'Nessie (Lago Ness)',
    subtitle: 'Desfocada nas fotos, nítida na hidratação',
    rarity: 'raro',
    unlockConditionText: 'Acumule 10 litros hidratados ou Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#06B6D4',
    waveColor: '#22D3EE',
    fillTopY: 28,
    fillBottomY: 236,
    innerCenter: { x: 114, y: 152, scaleX: 0.905, scaleY: 0.925 },
    measureX: 168,
    clipPathD:
      'M 86 28 C 104 28 114 40 112 56 C 110 72 98 84 96 104 C 94 126 108 142 132 146 C 156 150 176 164 186 154 C 194 146 206 150 202 164 C 196 184 184 202 172 216 C 156 232 132 236 102 236 C 64 236 42 218 44 190 C 46 168 62 154 70 140 C 66 116 64 82 70 54 C 74 36 78 28 86 28 Z',
    sculptPaths: [
      { d: 'M 72 156 Q 112 170 162 168', stroke: '#020617', strokeWidth: 4, opacity: 0.22, blur: true },
      { d: 'M 94 74 C 90 100 94 124 106 138', stroke: '#020617', strokeWidth: 3.5, opacity: 0.2, blur: true },
    ],
    metallicPaths: [
      // Brass aquatic neck collar with teardrop crystal medallion
      { d: 'M 66 114 Q 82 122 96 112 L 96 119 Q 82 129 66 121 Z', metal: 'gold', fill: true, opacity: 0.9 },
      { d: 'M 80 124 L 85 133 L 80 139 L 75 133 Z', metal: 'crystal', fill: true, strokeWidth: 1.1 },
    ],
    specularPaths: [
      { d: 'M 78 50 C 74 78 76 112 80 136', strokeWidth: 4.8, opacity: 0.56 },
      { d: 'M 56 180 C 54 202 64 218 84 224', strokeWidth: 6.2, opacity: 0.46 },
    ],
    pinpointHighlight: { cx: 81, cy: 38, rx: 3, ry: 2 },
    rightRimPath: 'M 190 164 C 184 184 172 204 156 218',
    eyes: [{ cx: 92, cy: 48, rx: 4.5, ry: 4.5 }],
    detailPaths: [
      { d: 'M 74 60 Q 86 68 98 62', strokeWidth: 2.4 },
      { d: 'M 114 146 Q 124 134 134 146 Q 144 136 154 150', strokeWidth: 2.3, opacity: 0.7 },
      { d: 'M 76 196 Q 112 206 150 196', strokeWidth: 2.2, opacity: 0.45 },
    ],
  },
  {
    id: 'yeti',
    name: 'Yeti Gelado',
    subtitle: 'Grande, parrudo e zero noção de perigo',
    rarity: 'raro',
    unlockConditionText: 'Complete 1 dia bebendo apenas água ou Baú',
    starterUnlocked: false,
    accentColor: '#38BDF8',
    waveColor: '#7DD3FC',
    fillTopY: 30,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 148, scaleX: 0.905, scaleY: 0.925 },
    measureX: 186,
    clipPathD:
      'M 80 54 C 66 44 64 32 74 30 C 82 28 88 38 92 48 C 108 43 132 43 148 48 C 152 38 158 28 166 30 C 176 32 174 44 160 54 C 186 72 204 106 204 148 C 204 198 184 238 120 238 C 56 238 36 198 36 148 C 36 106 54 72 80 54 Z',
    sculptPaths: [
      // Faceted horn ridge shadows + broad yeti shoulder contour
      { d: 'M 76 34 Q 82 44 88 52 M 164 34 Q 158 44 152 52', stroke: '#020617', strokeWidth: 2.8, opacity: 0.28, blur: true },
      { d: 'M 66 152 Q 120 172 174 152', stroke: '#020617', strokeWidth: 4.5, opacity: 0.22, blur: true },
    ],
    metallicPaths: [
      // Bronze horn rings + ice-crystal chest clasp
      { d: 'M 71 42 L 88 48 M 169 42 L 152 48', metal: 'gold', fill: false, strokeWidth: 3 },
      { d: 'M 120 164 L 128 174 L 120 184 L 112 174 Z', metal: 'crystal', fill: true, strokeWidth: 1.3 },
    ],
    specularPaths: [
      { d: 'M 54 102 C 44 130 44 166 56 198', strokeWidth: 7, opacity: 0.48 },
      { d: 'M 88 59 C 104 51 124 49 140 53', strokeWidth: 4.8, opacity: 0.5 },
    ],
    pinpointHighlight: { cx: 92, cy: 58, rx: 3.5, ry: 2 },
    rightRimPath: 'M 188 106 C 198 134 198 168 186 198',
    eyes: [
      { cx: 96, cy: 96, rx: 6.5, ry: 6.5 },
      { cx: 144, cy: 96, rx: 5.5, ry: 5.5 },
    ],
    detailPaths: [
      { d: 'M 94 126 Q 120 138 146 126', strokeWidth: 3 },
      { d: 'M 106 130 L 111 121 L 116 132', fill: '#FFFFFF', strokeWidth: 2 },
      { d: 'M 80 162 Q 96 172 112 162 Q 120 172 128 162 Q 144 172 160 162', strokeWidth: 2.4, opacity: 0.48 },
    ],
  },
  {
    id: 'et-varginha',
    name: 'ET de Varginha',
    subtitle: 'Cabeção de 3 litros de sabedoria cósmica',
    rarity: 'raro',
    unlockConditionText: 'Alcance o Nível 4 ou sorteie no Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#22C55E',
    waveColor: '#4ADE80',
    fillTopY: 22,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 122, scaleX: 0.905, scaleY: 0.93 },
    measureX: 164,
    clipPathD:
      'M 120 22 C 130 22 134 30 142 32 C 154 26 168 38 176 56 C 192 84 186 122 158 148 C 148 158 140 164 142 174 C 154 184 158 206 150 224 C 144 234 132 238 120 238 C 108 238 96 234 90 224 C 82 206 86 184 98 174 C 100 164 92 158 82 148 C 54 122 48 84 64 56 C 72 38 86 26 98 32 C 106 30 110 22 120 22 Z',
    sculptPaths: [
      // Three cranial crest ridges typical of the Varginha legend
      { d: 'M 102 36 Q 104 54 108 66 M 120 28 L 120 62 M 138 36 Q 136 54 132 66', stroke: '#020617', strokeWidth: 3, opacity: 0.24, blur: true },
      { d: 'M 86 142 Q 120 162 154 142', stroke: '#020617', strokeWidth: 3.8, opacity: 0.22, blur: true },
    ],
    metallicPaths: [
      // Golden cosmic alchemical collar around slender neck
      { d: 'M 98 168 Q 120 178 142 168 L 143 175 Q 120 185 97 175 Z', metal: 'gold', fill: true, opacity: 0.92 },
      // Tiny crystal crest stud
      { d: 'M 120 56 L 125 63 L 120 70 L 115 63 Z', metal: 'crystal', fill: true, strokeWidth: 1.1 },
    ],
    specularPaths: [
      { d: 'M 66 70 C 60 94 66 118 82 136', strokeWidth: 6.5, opacity: 0.58 },
      { d: 'M 94 190 C 90 204 92 218 100 226', strokeWidth: 4.2, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 82, cy: 52, rx: 4, ry: 2.5 },
    rightRimPath: 'M 174 68 C 184 90 180 116 164 136',
    eyes: [
      { cx: 92, cy: 98, rx: 14, ry: 10, tilt: 22, irisColor: '#DC2626' },
      { cx: 148, cy: 98, rx: 14, ry: 10, tilt: -22, irisColor: '#DC2626' },
    ],
    detailPaths: [
      { d: 'M 111 132 Q 120 137 129 132', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'troll',
    name: 'Troll da Ponte',
    subtitle: 'Só libera passagem após 250 ml de água',
    rarity: 'raro',
    unlockConditionText: 'Complete 1 Missão da Taverna ou Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#84CC16',
    waveColor: '#A3E635',
    fillTopY: 60,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 158, scaleX: 0.905, scaleY: 0.925 },
    measureX: 184,
    clipPathD:
      'M 80 78 C 66 72 56 80 60 94 C 62 100 66 104 70 106 C 46 124 38 156 42 190 C 46 222 76 238 120 238 C 164 238 194 222 198 190 C 202 156 194 124 170 106 C 174 104 178 100 180 94 C 184 80 174 72 160 78 C 150 64 136 60 120 60 C 104 60 90 64 80 78 Z',
    sculptPaths: [
      // Heavy brow ridge & potbelly fold
      { d: 'M 80 90 Q 120 102 160 90', stroke: '#020617', strokeWidth: 4.5, opacity: 0.25, blur: true },
      { d: 'M 64 178 Q 120 202 176 178', stroke: '#020617', strokeWidth: 4.5, opacity: 0.22, blur: true },
    ],
    metallicPaths: [
      // Heavy bronze bridge-keeper torque + gold buckle at waist
      { d: 'M 48 186 Q 120 204 192 186 L 191 194 Q 120 212 49 194 Z', metal: 'bronze', fill: true, opacity: 0.85 },
      { d: 'M 109 190 L 131 190 L 131 206 L 109 206 Z', metal: 'gold', fill: false, strokeWidth: 3 },
    ],
    specularPaths: [
      { d: 'M 54 142 C 48 168 52 196 66 216', strokeWidth: 6.5, opacity: 0.48 },
      { d: 'M 94 71 Q 120 63 144 71', strokeWidth: 4.5, opacity: 0.5 },
    ],
    pinpointHighlight: { cx: 100, cy: 70, rx: 3.5, ry: 2 },
    rightRimPath: 'M 184 140 C 194 166 192 196 178 214',
    eyes: [
      { cx: 98, cy: 96, rx: 4.5, ry: 4.5 },
      { cx: 142, cy: 96, rx: 4.5, ry: 4.5 },
    ],
    detailPaths: [
      { d: 'M 84 86 Q 120 96 156 86', strokeWidth: 3.4 },
      { d: 'M 104 114 C 104 98 136 98 136 114 C 136 130 104 130 104 114 Z', fill: 'rgba(255,255,255,0.2)', strokeWidth: 2.6 },
      { d: 'M 88 144 Q 120 136 152 144', strokeWidth: 2.8 },
      { d: 'M 98 142 L 102 132 L 107 141 M 133 141 L 138 132 L 142 142', fill: '#FFFFFF', strokeWidth: 2 },
    ],
  },

  // =========================================================================
  // ÉPICOS · Folclore & Magia
  // =========================================================================
  {
    id: 'saci',
    name: 'Saci',
    subtitle: 'Redemoinho de hidratação e travessuras',
    rarity: 'epico',
    unlockConditionText: 'Ative o Combo de Ritmo 1 vez ou Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#EF4444',
    waveColor: '#F87171',
    fillTopY: 18,
    fillBottomY: 238,
    innerCenter: { x: 118, y: 136, scaleX: 0.905, scaleY: 0.925 },
    measureX: 162,
    clipPathD:
      'M 64 46 C 72 22 104 16 130 28 C 154 40 166 64 168 90 C 176 106 172 128 158 142 C 176 154 182 174 168 192 C 154 206 138 214 144 226 C 138 234 126 238 118 238 C 104 238 92 228 96 214 C 72 204 62 182 74 160 C 80 150 86 146 88 142 C 74 130 70 108 78 90 C 66 78 58 62 64 46 Z',
    sculptPaths: [
      // Phrygian cap fold + tornado spiral relief
      { d: 'M 76 62 Q 112 52 152 68', stroke: '#020617', strokeWidth: 3.4, opacity: 0.25, blur: true },
      { d: 'M 80 174 Q 122 188 164 170 M 90 198 Q 120 210 150 196', stroke: '#020617', strokeWidth: 3.6, opacity: 0.24, blur: true },
    ],
    metallicPaths: [
      // Golden folklore cap ring & bronze whirlwind band
      { d: 'M 78 86 Q 124 74 168 86 L 168 93 Q 124 81 78 93 Z', metal: 'gold', fill: true, opacity: 0.92 },
      { d: 'M 84 146 Q 122 156 158 144', metal: 'bronze', fill: false, strokeWidth: 2.8, opacity: 0.85 },
    ],
    specularPaths: [
      { d: 'M 78 38 C 98 25 122 30 140 46', strokeWidth: 5.2, opacity: 0.58 },
      { d: 'M 82 164 C 76 182 84 198 100 206', strokeWidth: 5.2, opacity: 0.45 },
    ],
    pinpointHighlight: { cx: 88, cy: 33, rx: 3.5, ry: 2 },
    rightRimPath: 'M 164 156 C 174 168 172 184 158 196',
    eyes: [
      { cx: 102, cy: 108, rx: 5, ry: 5 },
      { cx: 140, cy: 108, rx: 5, ry: 2.2, browD: 'M 132 100 Q 140 96 148 100' },
    ],
    detailPaths: [
      { d: 'M 98 126 Q 120 142 144 124', strokeWidth: 2.8 },
      { d: 'M 86 184 Q 120 194 156 180 M 96 208 Q 120 216 142 206', strokeWidth: 2.3, opacity: 0.55 },
    ],
  },
  {
    id: 'fantasma',
    name: 'Fantasma do Poço',
    subtitle: 'Flutuando leve e assustadoramente hidratado',
    rarity: 'epico',
    unlockConditionText: 'Registre 3 bebidas à noite ou Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#A855F7',
    waveColor: '#C084FC',
    fillTopY: 30,
    fillBottomY: 220,
    floating: true,
    innerCenter: { x: 120, y: 128, scaleX: 0.905, scaleY: 0.92 },
    measureX: 170,
    clipPathD:
      'M 120 30 C 164 30 186 64 186 112 C 198 122 204 136 196 144 C 190 150 182 144 180 138 L 182 198 C 182 214 166 220 156 208 C 146 196 136 220 120 220 C 104 220 94 196 84 208 C 74 220 58 214 58 198 L 60 138 C 58 144 50 150 44 144 C 36 136 42 122 54 112 C 54 64 76 30 120 30 Z',
    sculptPaths: [
      // Ethereal vertical drapery folds in the ghost sheet
      { d: 'M 92 148 L 90 202 M 148 148 L 150 202', stroke: '#020617', strokeWidth: 3.5, opacity: 0.18, blur: true },
    ],
    metallicPaths: [
      // Floating antique gold halo crown above the ghost dome
      { d: 'M 92 20 Q 120 13 148 20 Q 120 27 92 20 Z', metal: 'gold', fill: false, strokeWidth: 2.6, opacity: 0.92 },
    ],
    specularPaths: [
      { d: 'M 68 84 C 72 56 92 40 114 38', strokeWidth: 6.2, opacity: 0.6 },
      { d: 'M 66 150 L 66 192', strokeWidth: 4.6, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 86, cy: 48, rx: 4, ry: 2.2 },
    rightRimPath: 'M 176 68 C 182 90 182 114 176 136 M 176 154 L 176 196',
    eyes: [
      { cx: 98, cy: 96, rx: 7.5, ry: 9.5 },
      { cx: 142, cy: 96, rx: 7.5, ry: 9.5 },
    ],
    detailPaths: [
      { d: 'M 111 124 C 111 114 129 114 129 124 C 129 136 111 136 111 124 Z', fill: 'rgba(15,23,42,0.75)', strokeWidth: 2.2 },
    ],
  },
  {
    id: 'mimico',
    name: 'Mímico (Baú Vivo)',
    subtitle: 'Finge ser tesouro mas só quer mais água',
    rarity: 'epico',
    unlockConditionText: 'Abra 1 Baú do Gnomo ou sorteie nele',
    starterUnlocked: false,
    accentColor: '#D97706',
    waveColor: '#F59E0B',
    fillTopY: 50,
    fillBottomY: 234,
    innerCenter: { x: 120, y: 148, scaleX: 0.905, scaleY: 0.925 },
    measureX: 184,
    clipPathD:
      'M 54 88 C 60 58 88 50 120 50 C 152 50 180 58 186 88 L 202 102 C 206 108 202 116 194 118 L 194 214 C 194 226 184 234 170 234 L 70 234 C 56 234 46 226 46 214 L 46 118 C 38 116 34 108 38 102 Z',
    sculptPaths: [
      // Recessed jaw mouth interior shadow
      { d: 'M 48 122 L 192 122 L 192 152 L 48 152 Z', fill: '#020617', opacity: 0.34, blur: true },
      // Wood plank horizontal grooves on chest body
      { d: 'M 50 182 L 190 182 M 50 208 L 190 208', stroke: '#020617', strokeWidth: 2.4, opacity: 0.22 },
    ],
    metallicPaths: [
      // Heavy iron-gold chest bands & ornate lockplate
      { d: 'M 72 56 L 72 232 M 168 56 L 168 232', metal: 'bronze', fill: false, strokeWidth: 4.2, opacity: 0.85 },
      { d: 'M 46 118 L 194 118', metal: 'gold', fill: false, strokeWidth: 3.4 },
      { d: 'M 108 110 L 132 110 L 130 128 L 110 128 Z', metal: 'gold', fill: true, opacity: 0.92 },
    ],
    specularPaths: [
      { d: 'M 62 84 C 72 64 94 56 118 56', strokeWidth: 5.5, opacity: 0.56 },
      { d: 'M 56 142 L 56 212', strokeWidth: 5.5, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 80, cy: 64, rx: 4, ry: 2.2 },
    rightRimPath: 'M 186 142 L 186 214',
    eyes: [
      { cx: 94, cy: 96, rx: 6.5, ry: 6.5, irisColor: '#FACC15' },
      { cx: 146, cy: 96, rx: 6.5, ry: 6.5, irisColor: '#FACC15' },
    ],
    detailPaths: [
      { d: 'M 48 122 L 192 122 M 48 150 L 192 150', strokeWidth: 2.6, opacity: 0.8 },
      { d: 'M 62 122 L 70 136 L 78 122 M 92 122 L 100 136 L 108 122 M 132 122 L 140 136 L 148 122 M 162 122 L 170 136 L 178 122', fill: '#FFFFFF', strokeWidth: 1.8 },
      { d: 'M 110 144 C 110 176 138 186 142 164 C 144 154 134 144 128 144 Z', fill: '#FB7185', strokeWidth: 2.2 },
    ],
  },
  {
    id: 'coruja-alquimista',
    name: 'Coruja Alquimista',
    subtitle: 'Te julgando silenciosamente pelo monóculo',
    rarity: 'epico',
    unlockConditionText: 'Alcance 3 dias de ofensiva ou Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#EC4899',
    waveColor: '#F472B6',
    fillTopY: 28,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 146, scaleX: 0.905, scaleY: 0.925 },
    measureX: 178,
    clipPathD:
      'M 68 68 L 54 32 C 52 26 58 24 64 28 L 94 48 C 110 43 130 43 146 48 L 176 28 C 182 24 188 26 186 32 L 172 68 C 190 94 198 134 190 174 C 184 212 158 238 120 238 C 82 238 56 212 50 174 C 42 134 50 94 68 68 Z',
    sculptPaths: [
      // Tucked owl wing folds along left and right flanks
      { d: 'M 66 136 C 58 164 64 196 84 214 M 174 136 C 182 164 176 196 156 214', stroke: '#020617', strokeWidth: 3.8, opacity: 0.24, blur: true },
      // Facial feather disc shadow
      { d: 'M 72 114 Q 120 132 168 114', stroke: '#020617', strokeWidth: 3.2, opacity: 0.2, blur: true },
    ],
    metallicPaths: [
      // Golden Alchemist Monocle + delicate chain + shoulder pin
      { d: 'M 146 78 A 18 18 0 1 0 146.1 78 Z', metal: 'gold', fill: false, strokeWidth: 3.2 },
      { d: 'M 164 98 Q 174 128 168 156', metal: 'gold', fill: false, strokeWidth: 2, opacity: 0.9 },
      { d: 'M 168 154 A 4 4 0 1 0 168.1 154 Z', metal: 'gold', fill: true },
    ],
    specularPaths: [
      { d: 'M 62 104 C 52 134 54 168 68 198', strokeWidth: 6.5, opacity: 0.48 },
      { d: 'M 60 36 L 76 58', strokeWidth: 3.8, opacity: 0.52 },
    ],
    pinpointHighlight: { cx: 64, cy: 36, rx: 3, ry: 2 },
    rightRimPath: 'M 180 104 C 188 134 186 168 172 198',
    eyes: [
      { cx: 94, cy: 96, rx: 6.5, ry: 6.5, browD: 'M 80 86 L 108 86' },
      { cx: 146, cy: 96, rx: 6.5, ry: 6.5, browD: 'M 132 82 Q 146 76 160 84' },
    ],
    detailPaths: [
      { d: 'M 114 108 L 120 122 L 126 108 L 120 102 Z', fill: '#F59E0B', strokeWidth: 1.8 },
      { d: 'M 94 156 Q 104 166 114 156 M 126 156 Q 136 166 146 156 M 110 176 Q 120 186 130 176', strokeWidth: 2.3, opacity: 0.52 },
    ],
  },

  // =========================================================================
  // LENDÁRIOS · Relíquias de Ouro
  // =========================================================================
  {
    id: 'dragao-bebe',
    name: 'Dragão Bebê Gordinho',
    subtitle: 'Cospe bolhinhas e domina o barrigão',
    rarity: 'lendario',
    unlockConditionText: 'Atinja o Nível 5 ou sorteie no Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#14B8A6',
    waveColor: '#2DD4BF',
    fillTopY: 24,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 154, scaleX: 0.905, scaleY: 0.925 },
    measureX: 174,
    clipPathD:
      'M 92 56 C 82 40 82 26 90 24 C 98 22 104 34 106 48 C 115 45 125 45 134 48 C 136 34 142 22 150 24 C 158 26 158 40 148 56 C 164 66 168 88 158 106 L 166 122 C 184 108 206 112 214 126 C 218 136 206 146 198 152 C 204 160 194 170 184 170 C 190 206 168 238 120 238 C 72 238 50 206 56 170 C 46 170 36 160 42 152 C 34 146 22 136 26 126 C 34 112 56 108 74 122 L 82 106 C 72 88 76 66 92 56 Z',
    sculptPaths: [
      // Faceted dragon horn ridges + bat wing membrane ribs
      { d: 'M 90 30 L 98 50 M 150 30 L 142 50', stroke: '#020617', strokeWidth: 2.6, opacity: 0.28, blur: true },
      { d: 'M 42 132 L 70 146 M 198 132 L 170 146', stroke: '#020617', strokeWidth: 2.8, opacity: 0.24, blur: true },
      { d: 'M 80 148 Q 120 162 160 148', stroke: '#020617', strokeWidth: 4, opacity: 0.22, blur: true },
    ],
    metallicPaths: [
      // Golden dragon horn cuffs & royal neck collar
      { d: 'M 85 41 L 101 44 M 155 41 L 139 44', metal: 'gold', fill: false, strokeWidth: 2.8 },
      { d: 'M 82 120 Q 120 132 158 120 L 160 127 Q 120 139 80 127 Z', metal: 'gold', fill: true, opacity: 0.9 },
      { d: 'M 120 132 L 126 141 L 120 148 L 114 141 Z', metal: 'crystal', fill: true, strokeWidth: 1.1 },
    ],
    specularPaths: [
      { d: 'M 70 164 C 64 186 70 212 88 225', strokeWidth: 6.5, opacity: 0.48 },
      { d: 'M 86 74 C 82 86 84 98 90 106', strokeWidth: 4.2, opacity: 0.52 },
    ],
    pinpointHighlight: { cx: 92, cy: 66, rx: 3.2, ry: 2 },
    rightRimPath: 'M 176 168 C 180 192 172 214 154 226',
    eyes: [
      { cx: 102, cy: 84, rx: 5.5, ry: 5.5 },
      { cx: 138, cy: 84, rx: 5.5, ry: 5.5 },
    ],
    detailPaths: [
      { d: 'M 111 98 L 111 101 M 129 98 L 129 101', strokeWidth: 3.4 },
      { d: 'M 104 108 Q 120 118 136 108', strokeWidth: 2.6 },
      { d: 'M 90 166 Q 120 176 150 166 M 86 190 Q 120 200 154 190 M 94 214 Q 120 222 146 214', stroke: '#D4AF37', strokeWidth: 2.3, opacity: 0.72 },
    ],
  },
  {
    id: 'genio',
    name: 'Gênio da Lâmpada',
    subtitle: 'Três desejos: água, água e mais água',
    rarity: 'lendario',
    unlockConditionText: 'Bata a meta 5 vezes ou sorteie no Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#3B82F6',
    waveColor: '#60A5FA',
    fillTopY: 18,
    fillBottomY: 228,
    floating: true,
    innerCenter: { x: 120, y: 126, scaleX: 0.905, scaleY: 0.925 },
    measureX: 164,
    clipPathD:
      'M 120 18 C 134 32 148 44 156 64 C 162 80 156 96 146 106 C 176 118 190 144 176 172 C 164 194 134 202 128 214 C 124 222 136 226 128 228 C 110 232 96 218 104 202 C 110 190 78 188 64 172 C 50 144 64 118 94 106 C 84 96 78 80 84 64 C 92 44 106 32 120 18 Z',
    sculptPaths: [
      // Turban silk folds + broad heroic chest contour
      { d: 'M 92 54 Q 120 66 148 54', stroke: '#020617', strokeWidth: 3.2, opacity: 0.25, blur: true },
      { d: 'M 80 144 Q 120 160 160 144', stroke: '#020617', strokeWidth: 4, opacity: 0.22, blur: true },
    ],
    metallicPaths: [
      // Royal gold turban band, cut crystal gem brooch & gilded waist sash
      { d: 'M 85 70 Q 120 82 155 70 L 154 77 Q 120 89 86 77 Z', metal: 'gold', fill: true, opacity: 0.95 },
      { d: 'M 120 44 L 127 56 L 120 67 L 113 56 Z', metal: 'crystal', fill: true, strokeWidth: 1.4 },
      { d: 'M 84 166 Q 120 178 156 166 L 154 174 Q 120 186 86 174 Z', metal: 'gold', fill: true, opacity: 0.9 },
    ],
    specularPaths: [
      { d: 'M 92 62 C 96 46 108 32 118 26', strokeWidth: 4.8, opacity: 0.58 },
      { d: 'M 70 136 C 66 152 72 168 86 178', strokeWidth: 6.2, opacity: 0.48 },
    ],
    pinpointHighlight: { cx: 108, cy: 36, rx: 3.2, ry: 2 },
    rightRimPath: 'M 168 128 C 178 144 176 164 162 178',
    eyes: [
      { cx: 105, cy: 90, rx: 4.8, ry: 4.8, browD: 'M 96 81 Q 105 77 114 82' },
      { cx: 135, cy: 90, rx: 4.8, ry: 4.8, browD: 'M 144 81 Q 135 77 126 82' },
    ],
    detailPaths: [
      { d: 'M 108 104 Q 120 112 132 104', strokeWidth: 2.5 },
      { d: 'M 120 112 C 120 120 126 124 122 128', strokeWidth: 2.4 },
    ],
  },
  {
    id: 'kraken',
    name: 'Kraken Abissal',
    subtitle: 'Oito tentáculos, todos segurando copos',
    rarity: 'lendario',
    unlockConditionText: 'Acumule 25 litros hidratados ou Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#6366F1',
    waveColor: '#818CF8',
    fillTopY: 26,
    fillBottomY: 238,
    innerCenter: { x: 120, y: 140, scaleX: 0.905, scaleY: 0.925 },
    measureX: 168,
    clipPathD:
      'M 120 26 C 164 26 184 62 178 108 C 176 124 172 136 168 144 C 194 148 214 166 210 186 C 206 202 186 204 176 192 C 182 214 170 236 146 236 C 134 236 126 228 120 220 C 114 228 106 236 94 236 C 70 236 58 214 64 192 C 54 204 34 202 30 186 C 26 166 46 148 72 144 C 68 136 64 124 62 108 C 56 62 76 26 120 26 Z',
    sculptPaths: [
      // Mantle dome curve + tentacle base creases
      { d: 'M 72 94 Q 120 112 168 94', stroke: '#020617', strokeWidth: 3.6, opacity: 0.22, blur: true },
      { d: 'M 72 152 Q 120 172 168 152', stroke: '#020617', strokeWidth: 4.2, opacity: 0.24, blur: true },
    ],
    metallicPaths: [
      // Sunken antique gold crown band resting on the kraken dome + bronze tentacle rings
      { d: 'M 78 52 L 90 36 L 106 48 L 120 32 L 134 48 L 150 36 L 162 52 Q 120 62 78 52 Z', metal: 'gold', fill: true, opacity: 0.9 },
      { d: 'M 52 160 L 66 176 M 188 160 L 174 176', metal: 'bronze', fill: false, strokeWidth: 3.2 },
    ],
    specularPaths: [
      { d: 'M 72 80 C 74 52 94 36 116 34', strokeWidth: 6.5, opacity: 0.58 },
      { d: 'M 40 174 C 38 184 46 190 56 188', strokeWidth: 4.2, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 88, cy: 48, rx: 4, ry: 2.2 },
    rightRimPath: 'M 170 68 C 176 90 174 114 166 134',
    eyes: [
      { cx: 96, cy: 118, rx: 7.5, ry: 7.5, browD: 'M 84 106 L 108 113' },
      { cx: 144, cy: 118, rx: 7.5, ry: 7.5, browD: 'M 156 106 L 132 113' },
    ],
    detailPaths: [
      { d: 'M 50 176 A 4 4 0 1 0 50.1 176 Z M 78 216 A 4 4 0 1 0 78.1 216 Z M 162 216 A 4 4 0 1 0 162.1 216 Z M 190 176 A 4 4 0 1 0 190.1 176 Z', fill: 'rgba(255,255,255,0.35)', strokeWidth: 1.5 },
      { d: 'M 110 138 Q 120 132 130 138', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'mula-sem-cabeca',
    name: 'Mula Sem Cabeça',
    subtitle: 'Edição Líquida · solta faíscas quando enche',
    rarity: 'lendario',
    unlockConditionText: 'Alcance 7 dias de ofensiva ou Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#F59E0B',
    waveColor: '#FBBF24',
    fillTopY: 66,
    fillBottomY: 238,
    topSparks: true,
    innerCenter: { x: 120, y: 162, scaleX: 0.905, scaleY: 0.925 },
    measureX: 182,
    clipPathD:
      'M 86 68 C 98 62 118 62 130 68 C 134 94 146 118 168 128 C 194 140 202 172 194 202 C 188 224 166 238 122 238 C 76 238 50 220 48 188 C 46 158 62 134 74 114 C 82 100 84 84 86 68 Z',
    sculptPaths: [
      // Muscular equine neck & chest relief shadows
      { d: 'M 78 134 Q 112 152 154 140', stroke: '#020617', strokeWidth: 4, opacity: 0.24, blur: true },
      { d: 'M 72 194 Q 124 212 176 192', stroke: '#020617', strokeWidth: 3.8, opacity: 0.2, blur: true },
    ],
    metallicPaths: [
      // Ornate double aged-gold apothecary bottle collar at the mystic neck opening
      { d: 'M 80 65 Q 108 77 136 65 L 135 76 Q 108 87 81 76 Z', metal: 'gold', fill: true, opacity: 0.96 },
      { d: 'M 83 78 Q 108 88 133 78', metal: 'bronze', fill: false, strokeWidth: 2.6 },
      // Golden flowing mane crest & ornate saddle medallion
      { d: 'M 134 86 Q 152 90 148 106 Q 166 112 162 126', metal: 'gold', fill: false, strokeWidth: 3.2, opacity: 0.9 },
      { d: 'M 122 158 L 130 170 L 122 182 L 114 170 Z', metal: 'gold', fill: true, opacity: 0.85 },
    ],
    specularPaths: [
      { d: 'M 94 84 C 92 106 82 126 70 144', strokeWidth: 5.2, opacity: 0.56 },
      { d: 'M 60 174 C 58 196 68 216 90 226', strokeWidth: 6.5, opacity: 0.48 },
    ],
    pinpointHighlight: { cx: 95, cy: 90, rx: 3.2, ry: 2 },
    rightRimPath: 'M 184 150 C 194 172 192 198 176 218',
    eyes: [],
    detailPaths: [
      { d: 'M 98 168 Q 124 182 152 168', stroke: '#D4AF37', strokeWidth: 2.4, opacity: 0.65 },
    ],
  },
];

export const MASCOT_MAP: Record<MascotId, MascotDefinition> = MASCOTS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<MascotId, MascotDefinition>
);

export const VALID_MASCOT_IDS = new Set<string>(MASCOTS.map((m) => m.id));

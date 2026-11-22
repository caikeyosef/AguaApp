import { MascotDefinition, MascotId } from '../types/hydration';

export const MASCOTS: MascotDefinition[] = [
  // =========================================================================
  // COMUNS · Bosque & Pântano
  // =========================================================================
  {
    id: 'gnomo',
    name: 'Gnomo Rabugento',
    subtitle: 'Fiscal oficial da hidratação da guilda',
    rarity: 'comum',
    unlockConditionText: 'Disponível desde o início',
    starterUnlocked: true,
    accentColor: '#0EA5E9',
    waveColor: '#38BDF8',
    fillTopY: 16,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 152, scaleX: 0.915, scaleY: 0.94 },
    // Full-body sculpted gnome: tall pointed hat, brim, grumpy face & beard, arms on hips, tunic, two separate legs & chunky curled boots!
    clipPathD:
      'M 122 16 C 140 34 150 64 156 88 C 170 92 178 98 176 106 C 172 112 162 112 156 112 C 162 122 164 134 162 144 C 178 150 188 164 184 182 C 180 194 168 198 158 194 L 156 208 C 154 222 156 234 164 242 C 174 246 176 256 164 256 L 136 256 C 128 256 126 248 128 238 L 128 214 C 124 212 116 212 112 214 L 112 238 C 114 248 112 256 104 256 L 76 256 C 64 256 66 246 76 242 C 84 234 86 222 84 208 L 82 194 C 72 198 60 194 56 182 C 52 164 62 150 78 144 C 76 134 78 122 84 112 C 78 112 68 112 64 106 C 62 98 70 92 84 88 C 92 62 106 32 122 16 Z',
    sculptPaths: [
      { d: 'M 100 60 Q 122 70 146 58', stroke: '#020617', strokeWidth: 3, opacity: 0.24, blur: true },
      { d: 'M 76 110 Q 120 124 164 110 L 160 119 Q 120 130 80 119 Z', fill: '#020617', opacity: 0.28, blur: true },
      // Arm & sleeve separation creases
      { d: 'M 78 152 C 74 166 76 182 84 192 M 162 152 C 166 166 164 182 156 192', stroke: '#020617', strokeWidth: 3.2, opacity: 0.28, blur: true },
      // Layered beard shadow
      { d: 'M 80 154 Q 100 172 120 162 Q 140 172 160 154', stroke: '#020617', strokeWidth: 3.4, opacity: 0.22, blur: true },
      // Boot cuffs & ankle creases
      { d: 'M 84 234 Q 98 240 112 234 M 128 234 Q 142 240 156 234', stroke: '#020617', strokeWidth: 2.8, opacity: 0.25 },
    ],
    metallicPaths: [
      // Faceted crystal finial on hat tip
      { d: 'M 122 11 L 128 19 L 122 25 L 116 19 Z', metal: 'crystal', fill: true, strokeWidth: 1.1 },
      // Aged bronze hatband + golden buckle
      { d: 'M 84 92 Q 120 104 156 92 L 157 100 Q 120 112 83 100 Z', metal: 'bronze', fill: true, opacity: 0.9 },
      { d: 'M 112 94 L 128 94 L 128 107 L 112 107 Z', metal: 'gold', fill: false, strokeWidth: 2.6 },
      // Tunic waist belt & golden buckle
      { d: 'M 83 196 Q 120 205 157 196 L 156 204 Q 120 212 84 204 Z', metal: 'bronze', fill: true, opacity: 0.9 },
      { d: 'M 111 196 L 129 196 L 129 209 L 111 209 Z', metal: 'gold', fill: false, strokeWidth: 2.6 },
      // Boot buckles
      { d: 'M 82 244 L 92 244 L 92 250 L 82 250 Z M 148 244 L 158 244 L 158 250 L 148 250 Z', metal: 'gold', fill: false, strokeWidth: 1.8 },
    ],
    animatedParts: [
      // Small golden hat tassel gently swaying from the hat tip
      {
        d: 'M 126 18 Q 142 26 146 42 Q 138 40 135 32',
        animation: 'tail-wag',
        pivotX: 126,
        pivotY: 18,
        metal: 'gold',
        strokeWidth: 2.6,
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 114 30 C 102 48 95 68 91 86', strokeWidth: 4.8, opacity: 0.6 },
      { d: 'M 63 162 C 60 174 63 184 70 189', strokeWidth: 4, opacity: 0.48 },
      { d: 'M 90 216 L 89 238', strokeWidth: 4.2, opacity: 0.45 },
    ],
    pinpointHighlight: { cx: 116, cy: 27, rx: 3.2, ry: 2 },
    rightRimPath: 'M 176 162 C 181 174 178 186 168 190 M 151 216 L 153 238',
    eyes: [
      { cx: 103, cy: 123, rx: 4.4, ry: 4.4, browD: 'M 92 115 L 112 120' },
      { cx: 137, cy: 123, rx: 4.4, ry: 4.4, browD: 'M 148 115 L 128 120' },
    ],
    detailPaths: [
      { d: 'M 110 137 C 110 128 130 128 130 137 C 130 146 110 146 110 137 Z', fill: 'rgba(255,255,255,0.22)', strokeWidth: 2.3 },
      { d: 'M 80 148 Q 98 162 112 152 Q 120 164 128 152 Q 142 162 160 148', strokeWidth: 2.3, opacity: 0.8 },
      { d: 'M 90 176 Q 105 190 120 182 Q 135 190 150 176', strokeWidth: 2.1, opacity: 0.58 },
      // Hands tucked on belt
      { d: 'M 68 180 Q 76 186 84 182 M 172 180 Q 164 186 156 182', strokeWidth: 2.2, opacity: 0.7 },
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
    fillTopY: 18,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 158, scaleX: 0.915, scaleY: 0.94 },
    // Full-body crouching frog wizard: crooked hat, bulging eyes, seated plump body, front arms supporting weight, folded hind frog legs & splayed webbed feet!
    clipPathD:
      'M 144 18 C 152 38 148 60 154 76 C 172 78 184 84 182 92 C 178 98 168 98 160 98 C 168 106 168 120 160 128 C 180 138 188 156 186 176 C 198 188 206 208 200 228 C 198 238 204 246 208 250 C 204 256 192 256 184 252 C 178 256 168 256 162 252 C 154 256 144 254 146 244 C 150 234 152 224 146 218 C 142 232 142 246 138 254 C 132 256 124 256 122 246 L 122 224 L 118 224 L 118 246 C 116 256 108 256 102 254 C 98 246 98 232 94 218 C 88 224 90 234 94 244 C 96 254 86 256 78 252 C 72 256 62 256 56 252 C 48 256 36 256 32 250 C 36 246 42 238 40 228 C 34 208 42 188 54 176 C 52 156 60 138 80 128 C 72 120 72 106 80 98 C 72 98 62 98 58 92 C 56 84 68 78 86 76 C 102 52 124 28 144 18 Z',
    sculptPaths: [
      { d: 'M 110 54 Q 130 62 150 50', stroke: '#020617', strokeWidth: 3.2, opacity: 0.25, blur: true },
      // Folded frog thigh creases separating legs from belly
      { d: 'M 54 178 C 68 186 78 204 78 226 M 186 178 C 172 186 162 204 162 226', stroke: '#020617', strokeWidth: 3.8, opacity: 0.28, blur: true },
      { d: 'M 94 184 Q 120 198 146 184', stroke: '#FFFFFF', strokeWidth: 3.2, opacity: 0.16, blur: true },
    ],
    metallicPaths: [
      { d: 'M 88 78 Q 124 88 158 80 L 159 87 Q 124 95 86 85 Z', metal: 'gold', fill: true, opacity: 0.94 },
      { d: 'M 113 176 A 7 7 0 1 0 127 176 A 7 7 0 1 0 113 176 Z', metal: 'gold', fill: false, strokeWidth: 2.3 },
    ],
    animatedParts: [
      // Floating golden star gleaming on the wizard hat
      {
        d: 'M 132 48 L 134 54 L 140 55 L 135 58 L 137 64 L 132 60 L 127 64 L 129 58 L 124 55 L 130 54 Z',
        animation: 'halo-float',
        pivotX: 132,
        pivotY: 56,
        metal: 'gold',
        fill: 'gold',
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 134 34 C 120 48 110 60 105 72', strokeWidth: 4.6, opacity: 0.56 },
      { d: 'M 48 192 C 44 208 46 226 56 238', strokeWidth: 5.5, opacity: 0.46 },
    ],
    pinpointHighlight: { cx: 139, cy: 27, rx: 3, ry: 2 },
    rightRimPath: 'M 192 194 C 196 210 194 226 184 238',
    eyes: [
      { cx: 90, cy: 112, rx: 9, ry: 9 },
      { cx: 150, cy: 112, rx: 9, ry: 9 },
    ],
    detailPaths: [
      { d: 'M 74 148 Q 120 168 166 148', strokeWidth: 2.7 },
      // Front arm inner contours
      { d: 'M 94 186 L 96 220 M 146 186 L 144 220', strokeWidth: 2.2, opacity: 0.55 },
      { d: 'M 86 206 Q 120 194 154 206', strokeWidth: 2, opacity: 0.4 },
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
    fillTopY: 26,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 146, scaleX: 0.915, scaleY: 0.94 },
    // Full-body mushroom sprite: wide toadstool cap, cute plump torso, two swinging arms, two stubby walking legs & feet!
    clipPathD:
      'M 120 26 C 176 26 210 64 208 102 C 206 118 184 126 156 126 C 158 136 160 148 162 156 C 176 160 186 170 182 182 C 178 190 168 188 160 182 C 160 196 158 208 154 218 L 156 238 C 164 242 166 256 152 256 L 132 256 C 124 256 124 246 126 236 L 126 222 C 122 220 118 220 114 222 L 114 236 C 116 246 116 256 108 256 L 88 256 C 74 256 76 242 84 238 L 86 218 C 82 208 80 196 80 182 C 72 188 62 190 58 182 C 54 170 64 160 78 156 C 80 148 82 136 84 126 C 56 126 34 118 32 102 C 30 64 64 26 120 26 Z',
    sculptPaths: [
      { d: 'M 54 118 Q 120 138 186 118 L 156 132 Q 120 144 84 132 Z', fill: '#020617', opacity: 0.34, blur: true },
      { d: 'M 64 98 Q 82 54 112 34 M 176 98 Q 158 54 128 34', stroke: '#020617', strokeWidth: 2.6, opacity: 0.18, blur: true },
      { d: 'M 80 158 L 82 182 M 160 158 L 158 182', stroke: '#020617', strokeWidth: 2.6, opacity: 0.24, blur: true },
    ],
    metallicPaths: [
      // Cozy golden leaf-clasp scarf around mushroom sprite neck
      { d: 'M 84 132 Q 120 144 156 132 L 155 139 Q 120 151 85 139 Z', metal: 'gold', fill: true, opacity: 0.9 },
    ],
    specularPaths: [
      { d: 'M 50 82 C 60 52 86 36 114 34', strokeWidth: 6.2, opacity: 0.58 },
      { d: 'M 88 154 C 86 176 86 198 92 214', strokeWidth: 4.8, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 80, cy: 44, rx: 4.4, ry: 2.3 },
    rightRimPath: 'M 194 70 C 202 84 204 98 196 110 M 152 192 L 150 218',
    eyes: [
      { cx: 104, cy: 162, rx: 4.5, ry: 3.4, browD: 'M 95 155 Q 104 151 113 155' },
      { cx: 136, cy: 162, rx: 4.5, ry: 3.4, browD: 'M 127 155 Q 136 151 145 155' },
    ],
    detailPaths: [
      { d: 'M 72 72 A 12 10 0 1 0 72.1 72 Z', fill: 'rgba(255,255,255,0.28)', strokeWidth: 1.8 },
      { d: 'M 156 64 A 14 11 0 1 0 156.1 64 Z', fill: 'rgba(255,255,255,0.28)', strokeWidth: 1.8 },
      { d: 'M 118 52 A 9 8 0 1 0 118.1 52 Z', fill: 'rgba(255,255,255,0.28)', strokeWidth: 1.8 },
      { d: 'M 114 180 Q 120 186 126 180', strokeWidth: 2.4 },
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
    fillTopY: 42,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 154, scaleX: 0.915, scaleY: 0.94 },
    // Full-body crouched goblin: long pointy ears, cheeky head, lean torso, raised waving left arm, right arm on hip, crouched legs & pointed goblin feet!
    clipPathD:
      'M 120 42 C 146 42 162 56 168 72 L 218 58 C 224 56 224 66 216 74 L 170 98 C 166 110 158 120 148 126 C 164 134 176 148 186 166 C 192 178 182 188 172 182 C 166 178 160 170 154 162 L 154 198 C 160 214 162 232 166 242 C 178 246 182 256 168 256 L 138 256 C 130 256 130 246 134 236 L 132 212 C 126 208 114 208 108 212 L 106 236 C 110 246 110 256 102 256 L 72 256 C 58 256 62 246 74 242 C 78 232 80 214 86 198 L 86 162 C 74 168 62 166 52 152 C 44 140 52 130 62 136 C 70 142 78 144 86 138 C 88 132 90 128 92 126 C 82 120 74 110 70 98 L 24 74 C 16 66 16 56 22 58 L 72 72 C 78 56 94 42 120 42 Z',
    sculptPaths: [
      { d: 'M 30 66 L 66 82 L 64 92 Z M 210 66 L 174 82 L 176 92 Z', fill: '#020617', opacity: 0.28, blur: true },
      { d: 'M 98 58 Q 120 64 142 58', stroke: '#020617', strokeWidth: 2.2, opacity: 0.24, blur: true },
      { d: 'M 88 136 Q 120 148 152 136', stroke: '#020617', strokeWidth: 3.2, opacity: 0.25, blur: true },
      { d: 'M 88 196 Q 120 206 152 196', stroke: '#020617', strokeWidth: 2.8, opacity: 0.22 },
    ],
    metallicPaths: [
      { d: 'M 46 64 L 42 82 M 54 67 L 50 86 M 194 64 L 198 82', metal: 'gold', fill: false, strokeWidth: 2.6 },
      { d: 'M 90 127 Q 120 139 150 127 L 151 134 Q 120 146 89 134 Z', metal: 'bronze', fill: true, opacity: 0.9 },
      { d: 'M 86 190 Q 120 198 154 190', metal: 'gold', fill: false, strokeWidth: 2.5 },
    ],
    animatedParts: [
      // Caffeinated golden spark zipping near left ear
      {
        d: 'M 34 44 L 38 52 L 32 54 L 36 62',
        animation: 'ear-twitch',
        pivotX: 36,
        pivotY: 54,
        metal: 'gold',
        strokeWidth: 2.4,
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 86 58 C 98 48 110 47 122 47', strokeWidth: 4.5, opacity: 0.56 },
      { d: 'M 92 152 L 90 194', strokeWidth: 4.8, opacity: 0.44 },
      { d: 'M 88 214 L 82 238', strokeWidth: 3.8, opacity: 0.42 },
    ],
    pinpointHighlight: { cx: 96, cy: 52, rx: 3.2, ry: 2 },
    rightRimPath: 'M 150 154 L 150 194 M 154 214 L 158 238',
    eyes: [
      { cx: 100, cy: 84, rx: 6.4, ry: 6.4, browD: 'M 88 73 L 110 79' },
      { cx: 140, cy: 84, rx: 6.4, ry: 6.4, browD: 'M 152 73 L 130 79' },
    ],
    detailPaths: [
      { d: 'M 91 94 Q 100 100 109 94 M 131 94 Q 140 100 149 94', strokeWidth: 2.1, opacity: 0.72 },
      { d: 'M 118 90 L 124 98 L 116 100', strokeWidth: 2.2 },
      { d: 'M 98 109 Q 120 120 142 107', strokeWidth: 2.5 },
      { d: 'M 106 112 L 109 118 L 112 113 M 131 111 L 134 117 L 137 109', strokeWidth: 1.9 },
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
    fillTopY: 22,
    fillBottomY: 256,
    innerCenter: { x: 118, y: 162, scaleX: 0.915, scaleY: 0.94 },
    // Full-body plesiosaur: long S-neck, sculpted head, aquatic torso, sweeping tail, and distinct front & rear flippers!
    clipPathD:
      'M 80 22 C 98 22 108 34 106 50 C 104 66 94 82 94 104 C 94 128 108 142 132 146 C 154 150 174 162 192 152 C 204 146 218 152 212 166 C 204 184 186 198 168 206 L 176 236 C 182 248 172 256 160 254 C 148 252 142 238 140 222 C 128 224 116 224 104 222 L 96 244 C 90 256 76 258 66 252 C 56 246 60 232 68 214 C 50 204 42 184 48 164 C 52 150 64 140 70 128 C 64 102 62 72 68 46 C 70 30 74 22 80 22 Z',
    sculptPaths: [
      { d: 'M 72 156 Q 112 170 162 168', stroke: '#020617', strokeWidth: 3.8, opacity: 0.22, blur: true },
      { d: 'M 68 212 Q 86 216 102 222 M 140 220 Q 156 214 168 206', stroke: '#020617', strokeWidth: 3.2, opacity: 0.26, blur: true },
    ],
    metallicPaths: [
      { d: 'M 65 104 Q 80 112 95 102 L 95 109 Q 80 119 65 111 Z', metal: 'gold', fill: true, opacity: 0.9 },
      { d: 'M 79 114 L 84 122 L 79 128 L 74 122 Z', metal: 'crystal', fill: true, strokeWidth: 1.1 },
    ],
    animatedParts: [
      // Gentle waving aquatic tail crest shimmer
      {
        d: 'M 196 154 C 210 140 224 146 218 162',
        animation: 'tail-wag',
        pivotX: 196,
        pivotY: 158,
        stroke: '#67E8F9',
        strokeWidth: 3,
        opacity: 0.72,
        layer: 'back',
      },
    ],
    specularPaths: [
      { d: 'M 75 44 C 71 70 73 102 78 126', strokeWidth: 4.6, opacity: 0.56 },
      { d: 'M 56 172 C 54 190 62 204 76 210', strokeWidth: 5.8, opacity: 0.46 },
    ],
    pinpointHighlight: { cx: 78, cy: 32, rx: 3, ry: 2 },
    rightRimPath: 'M 196 164 C 188 180 178 192 164 202',
    eyes: [{ cx: 88, cy: 40, rx: 4.4, ry: 4.4 }],
    detailPaths: [
      { d: 'M 70 52 Q 82 60 94 54', strokeWidth: 2.3 },
      { d: 'M 112 146 Q 122 134 132 146 Q 142 136 152 150', strokeWidth: 2.3, opacity: 0.7 },
      { d: 'M 80 194 Q 114 204 150 194', strokeWidth: 2.1, opacity: 0.45 },
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
    fillTopY: 24,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 152, scaleX: 0.915, scaleY: 0.94 },
    // Full-body mighty standing Yeti: curved horns, broad shoulders, massive hanging arms & hands, muscular torso, two heavy legs & Bigfoot feet!
    clipPathD:
      'M 86 44 C 74 36 72 24 82 22 C 90 20 94 30 98 38 C 110 34 130 34 142 38 C 146 30 150 20 158 22 C 168 24 166 36 154 44 C 178 58 196 86 202 124 C 208 152 206 178 196 192 C 186 202 174 196 172 182 L 170 156 L 166 204 C 166 220 168 234 176 242 C 186 246 184 256 170 256 L 138 256 C 128 256 128 246 130 234 L 130 206 C 124 204 116 204 110 206 L 110 234 C 112 246 112 256 102 256 L 70 256 C 56 256 54 246 64 242 C 72 234 74 220 74 204 L 70 156 L 68 182 C 66 196 54 202 44 192 C 34 178 32 152 38 124 C 44 86 62 58 86 44 Z',
    sculptPaths: [
      { d: 'M 82 26 Q 88 34 94 42 M 158 26 Q 152 34 146 42', stroke: '#020617', strokeWidth: 2.6, opacity: 0.28, blur: true },
      // Arm & shoulder separation
      { d: 'M 68 112 L 70 162 M 172 112 L 170 162', stroke: '#020617', strokeWidth: 3.6, opacity: 0.28, blur: true },
      { d: 'M 74 142 Q 120 160 166 142', stroke: '#020617', strokeWidth: 4, opacity: 0.22, blur: true },
    ],
    metallicPaths: [
      { d: 'M 78 34 L 94 40 M 162 34 L 146 40', metal: 'gold', fill: false, strokeWidth: 2.8 },
      { d: 'M 120 154 L 128 164 L 120 174 L 112 164 Z', metal: 'crystal', fill: true, strokeWidth: 1.3 },
    ],
    specularPaths: [
      { d: 'M 50 116 C 42 140 42 164 50 182', strokeWidth: 6.2, opacity: 0.48 },
      { d: 'M 94 48 Q 120 42 144 48', strokeWidth: 4.5, opacity: 0.5 },
      { d: 'M 82 214 L 80 238', strokeWidth: 4.2, opacity: 0.42 },
    ],
    pinpointHighlight: { cx: 98, cy: 48, rx: 3.4, ry: 2 },
    rightRimPath: 'M 192 116 C 198 140 198 164 190 182',
    eyes: [
      { cx: 100, cy: 78, rx: 6, ry: 6 },
      { cx: 140, cy: 78, rx: 5.2, ry: 5.2 },
    ],
    detailPaths: [
      { d: 'M 96 106 Q 120 118 144 106', strokeWidth: 2.9 },
      { d: 'M 106 110 L 111 101 L 116 112', fill: '#FFFFFF', strokeWidth: 2 },
      { d: 'M 84 144 Q 98 154 112 144 Q 120 154 128 144 Q 142 154 156 144', strokeWidth: 2.2, opacity: 0.48 },
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
    fillTopY: 18,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 132, scaleX: 0.915, scaleY: 0.94 },
    // Full-body classic alien: 3-ridge cranium, slender neck, torso, spindly gesturing arms & hands, two slender legs & 3-toed feet!
    clipPathD:
      'M 120 18 C 128 18 132 25 140 27 C 152 22 164 32 172 48 C 186 72 180 106 154 128 C 144 136 136 142 138 150 C 154 156 170 166 184 184 C 190 194 180 202 172 194 C 164 186 156 178 148 174 L 146 206 L 152 240 C 160 244 162 256 150 256 L 134 256 C 126 256 126 246 130 238 L 128 210 C 124 208 116 208 112 210 L 110 238 C 114 246 114 256 106 256 L 90 256 C 78 256 80 244 88 240 L 94 206 L 92 174 C 84 178 76 186 68 194 C 60 202 50 194 56 184 C 70 166 86 156 102 150 C 104 142 96 136 86 128 C 60 106 54 72 68 48 C 76 32 88 22 100 27 C 108 25 112 18 120 18 Z',
    sculptPaths: [
      { d: 'M 102 30 Q 104 46 108 58 M 120 22 L 120 54 M 138 30 Q 136 46 132 58', stroke: '#020617', strokeWidth: 2.8, opacity: 0.24, blur: true },
      { d: 'M 94 172 L 96 204 M 146 172 L 144 204', stroke: '#020617', strokeWidth: 2.5, opacity: 0.22 },
    ],
    metallicPaths: [
      { d: 'M 102 146 Q 120 156 138 146 L 139 152 Q 120 162 101 152 Z', metal: 'gold', fill: true, opacity: 0.92 },
    ],
    animatedParts: [
      // Glowing telepathic forehead crystal pulsing softly
      {
        d: 'M 120 48 L 126 56 L 120 64 L 114 56 Z',
        animation: 'halo-float',
        pivotX: 120,
        pivotY: 56,
        metal: 'crystal',
        fill: 'crystal',
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 68 62 C 62 84 68 106 84 122', strokeWidth: 6.2, opacity: 0.58 },
      { d: 'M 98 176 L 96 204', strokeWidth: 3.6, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 82, cy: 44, rx: 4, ry: 2.4 },
    rightRimPath: 'M 170 60 C 178 82 174 104 160 122',
    eyes: [
      { cx: 94, cy: 86, rx: 13.5, ry: 9.5, tilt: 22, irisColor: '#DC2626' },
      { cx: 146, cy: 86, rx: 13.5, ry: 9.5, tilt: -22, irisColor: '#DC2626' },
    ],
    detailPaths: [
      { d: 'M 111 116 Q 120 121 129 116', strokeWidth: 2.4 },
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
    fillTopY: 44,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 158, scaleX: 0.915, scaleY: 0.94 },
    // Full-body hunchbacked bridge troll: chunky ears, broad potbelly, long heavy club-like arms, tree-trunk legs & big stomping feet!
    clipPathD:
      'M 84 62 C 70 56 62 64 66 78 C 68 84 72 88 76 90 C 52 106 40 134 38 168 C 36 186 44 200 56 198 C 64 196 68 186 70 174 L 72 206 C 72 220 72 234 64 242 C 56 246 58 256 72 256 L 104 256 C 112 256 112 246 110 236 L 110 212 C 116 210 124 210 130 212 L 130 236 C 128 246 128 256 136 256 L 168 256 C 182 256 184 246 176 242 C 168 234 168 220 168 206 L 170 174 C 172 186 176 196 184 198 C 196 200 204 186 202 168 C 200 134 188 106 164 90 C 168 88 172 84 174 78 C 178 64 170 56 156 62 C 146 48 134 44 120 44 C 106 44 94 48 84 62 Z',
    sculptPaths: [
      { d: 'M 82 74 Q 120 86 158 74', stroke: '#020617', strokeWidth: 4.2, opacity: 0.26, blur: true },
      { d: 'M 70 128 L 70 176 M 170 128 L 170 176', stroke: '#020617', strokeWidth: 3.6, opacity: 0.28, blur: true },
      { d: 'M 74 166 Q 120 186 166 166', stroke: '#020617', strokeWidth: 4, opacity: 0.22, blur: true },
    ],
    metallicPaths: [
      { d: 'M 70 184 Q 120 198 170 184 L 169 192 Q 120 206 71 192 Z', metal: 'bronze', fill: true, opacity: 0.88 },
      { d: 'M 109 186 L 131 186 L 131 202 L 109 202 Z', metal: 'gold', fill: false, strokeWidth: 2.8 },
    ],
    specularPaths: [
      { d: 'M 50 134 C 44 156 44 176 52 190', strokeWidth: 6, opacity: 0.48 },
      { d: 'M 94 55 Q 120 47 144 55', strokeWidth: 4.4, opacity: 0.5 },
    ],
    pinpointHighlight: { cx: 100, cy: 54, rx: 3.5, ry: 2 },
    rightRimPath: 'M 190 134 C 196 156 196 176 188 190',
    eyes: [
      { cx: 100, cy: 80, rx: 4.5, ry: 4.5 },
      { cx: 140, cy: 80, rx: 4.5, ry: 4.5 },
    ],
    detailPaths: [
      { d: 'M 86 70 Q 120 80 154 70', strokeWidth: 3.3 },
      { d: 'M 105 98 C 105 83 135 83 135 98 C 135 113 105 113 105 98 Z', fill: 'rgba(255,255,255,0.2)', strokeWidth: 2.5 },
      { d: 'M 90 128 Q 120 120 150 128', strokeWidth: 2.7 },
      { d: 'M 98 126 L 102 117 L 107 125 M 133 125 L 138 117 L 142 126', fill: '#FFFFFF', strokeWidth: 2 },
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
    fillTopY: 16,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 144, scaleX: 0.915, scaleY: 0.94 },
    // Full-body iconic Brazilian folklore Saci: tilted Phrygian cap, smiling head, arms akimbo/waving, lean torso, and his authentic single agile leg & foot!
    clipPathD:
      'M 68 42 C 76 18 106 14 130 26 C 152 36 162 58 164 80 C 170 96 166 116 154 128 C 170 134 184 146 194 138 C 202 132 208 140 202 150 C 190 166 172 164 156 156 L 152 194 C 148 206 140 214 136 226 L 136 244 C 146 246 150 256 136 256 L 106 256 C 96 256 96 246 106 242 L 106 220 C 98 212 90 204 88 194 L 84 166 C 72 174 56 170 50 156 C 46 144 58 134 72 138 C 78 140 82 142 86 138 L 86 128 C 74 116 70 96 78 80 C 68 70 62 56 68 42 Z',
    sculptPaths: [
      { d: 'M 78 56 Q 112 46 150 62', stroke: '#020617', strokeWidth: 3.2, opacity: 0.25, blur: true },
      { d: 'M 86 144 L 88 188 M 154 144 L 152 188', stroke: '#020617', strokeWidth: 2.8, opacity: 0.24 },
      { d: 'M 92 192 Q 120 204 148 192', stroke: '#020617', strokeWidth: 3.2, opacity: 0.25 },
    ],
    metallicPaths: [
      { d: 'M 78 78 Q 122 66 164 78 L 164 85 Q 122 73 78 85 Z', metal: 'gold', fill: true, opacity: 0.92 },
      { d: 'M 88 188 Q 120 198 152 188', metal: 'bronze', fill: false, strokeWidth: 3 },
    ],
    animatedParts: [
      // Magical spinning whirlwind ring circling around Saci's single leg
      {
        d: 'M 82 224 Q 120 238 158 222 Q 124 230 82 224 Z',
        animation: 'halo-float',
        pivotX: 120,
        pivotY: 228,
        metal: 'gold',
        fill: 'gold',
        opacity: 0.78,
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 80 34 C 98 22 122 26 138 42', strokeWidth: 5, opacity: 0.58 },
      { d: 'M 94 150 L 94 186', strokeWidth: 4.5, opacity: 0.45 },
      { d: 'M 112 214 L 112 242', strokeWidth: 3.8, opacity: 0.42 },
    ],
    pinpointHighlight: { cx: 88, cy: 30, rx: 3.4, ry: 2 },
    rightRimPath: 'M 150 152 L 146 190',
    eyes: [
      { cx: 103, cy: 98, rx: 4.8, ry: 4.8 },
      { cx: 139, cy: 98, rx: 4.8, ry: 2.2, browD: 'M 131 90 Q 139 86 147 90' },
    ],
    detailPaths: [
      { d: 'M 99 116 Q 120 130 143 114', strokeWidth: 2.7 },
      // Shorts hem
      { d: 'M 94 198 Q 120 208 146 198', strokeWidth: 2.3, opacity: 0.55 },
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
    fillBottomY: 240,
    floating: true,
    innerCenter: { x: 120, y: 138, scaleX: 0.915, scaleY: 0.935 },
    // Expressive full-body levitating spectral ghost: sculpted dome head, two waving arms with hands, flowing multi-tail cloak!
    clipPathD:
      'M 120 30 C 162 30 180 62 178 104 C 194 100 208 88 214 96 C 220 104 208 122 192 132 C 186 136 180 136 178 134 L 182 214 C 182 232 166 238 156 224 C 146 210 138 240 120 240 C 102 240 94 210 84 224 C 74 238 58 232 58 214 L 62 134 C 60 136 54 136 48 132 C 32 122 20 104 26 96 C 32 88 46 100 62 104 C 60 62 78 30 120 30 Z',
    sculptPaths: [
      { d: 'M 92 154 L 88 218 M 148 154 L 152 218', stroke: '#020617', strokeWidth: 3.4, opacity: 0.18, blur: true },
    ],
    animatedParts: [
      // Levitating antique gold halo gently bobbing above the ghost
      {
        d: 'M 92 19 Q 120 12 148 19 Q 120 26 92 19 Z',
        animation: 'halo-float',
        pivotX: 120,
        pivotY: 19,
        metal: 'gold',
        strokeWidth: 2.6,
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 72 80 C 76 54 94 38 114 36', strokeWidth: 6, opacity: 0.6 },
      { d: 'M 68 154 L 66 206', strokeWidth: 4.5, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 88, cy: 46, rx: 4, ry: 2.2 },
    rightRimPath: 'M 172 68 C 176 90 176 114 172 136 M 174 156 L 176 208',
    eyes: [
      { cx: 100, cy: 92, rx: 7.4, ry: 9.4 },
      { cx: 140, cy: 92, rx: 7.4, ry: 9.4 },
    ],
    detailPaths: [
      { d: 'M 111 120 C 111 110 129 110 129 120 C 129 132 111 132 111 120 Z', fill: 'rgba(15,23,42,0.75)', strokeWidth: 2.2 },
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
    fillTopY: 42,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 150, scaleX: 0.915, scaleY: 0.94 },
    // Full-body walking fantasy mimic monster: open-jaw chest body + four distinct clawed scurrying legs & feet underneath!
    clipPathD:
      'M 56 80 C 62 50 88 42 120 42 C 152 42 178 50 184 80 L 198 94 C 202 100 198 108 190 110 L 190 194 C 190 204 182 210 174 212 L 184 242 C 188 250 180 256 172 254 C 164 252 162 242 158 214 L 146 214 L 148 244 C 148 252 140 256 134 254 C 128 252 128 242 128 214 L 112 214 C 112 242 112 252 106 254 C 100 256 92 252 92 244 L 94 214 L 82 214 C 78 242 76 252 68 254 C 60 256 52 250 56 242 L 66 212 C 58 210 50 204 50 194 L 50 110 C 42 108 38 100 42 94 Z',
    sculptPaths: [
      { d: 'M 52 112 L 188 112 L 188 140 L 52 140 Z', fill: '#020617', opacity: 0.34, blur: true },
      { d: 'M 54 166 L 186 166 M 54 190 L 186 190', stroke: '#020617', strokeWidth: 2.3, opacity: 0.22 },
    ],
    metallicPaths: [
      { d: 'M 74 48 L 74 210 M 166 48 L 166 210', metal: 'bronze', fill: false, strokeWidth: 4, opacity: 0.85 },
      { d: 'M 50 110 L 190 110', metal: 'gold', fill: false, strokeWidth: 3.2 },
      { d: 'M 108 102 L 132 102 L 130 120 L 110 120 Z', metal: 'gold', fill: true, opacity: 0.92 },
    ],
    animatedParts: [
      // Playful wagging mimic tongue poking out of the chest jaw!
      {
        d: 'M 110 134 C 110 168 140 176 144 154 C 146 142 134 134 128 134 Z',
        animation: 'tongue-wiggle',
        pivotX: 120,
        pivotY: 136,
        fill: '#FB7185',
        stroke: '#881337',
        strokeWidth: 2,
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 64 76 C 74 56 96 48 118 48', strokeWidth: 5.4, opacity: 0.56 },
      { d: 'M 58 136 L 58 194', strokeWidth: 5.2, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 82, cy: 56, rx: 4, ry: 2.2 },
    rightRimPath: 'M 182 136 L 182 194',
    eyes: [
      { cx: 96, cy: 88, rx: 6.4, ry: 6.4, irisColor: '#FACC15' },
      { cx: 144, cy: 88, rx: 6.4, ry: 6.4, irisColor: '#FACC15' },
    ],
    detailPaths: [
      { d: 'M 52 114 L 188 114 M 52 140 L 188 140', strokeWidth: 2.5, opacity: 0.8 },
      { d: 'M 64 114 L 72 128 L 80 114 M 92 114 L 100 128 L 108 114 M 132 114 L 140 128 L 148 114 M 160 114 L 168 128 L 176 114', fill: '#FFFFFF', strokeWidth: 1.8 },
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
    fillTopY: 22,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 146, scaleX: 0.915, scaleY: 0.94 },
    // Full-body perched owl: ear tufts, distinct sculpted wings, feathered torso, tail tip, and two clawed owl legs & gripping talons!
    clipPathD:
      'M 72 60 L 58 26 C 56 20 62 18 68 22 L 96 42 C 110 37 130 37 144 42 L 172 22 C 178 18 184 20 182 26 L 168 60 C 186 84 196 122 194 162 C 192 184 182 204 166 214 L 154 222 L 156 244 C 164 248 164 256 154 256 C 146 256 142 252 138 256 C 130 256 128 248 134 242 L 134 226 C 126 228 114 228 106 226 L 106 242 C 112 248 110 256 102 256 C 98 252 94 256 86 256 C 76 256 76 248 84 244 L 86 222 L 74 214 C 58 204 48 184 46 162 C 44 122 54 84 72 60 Z',
    sculptPaths: [
      { d: 'M 70 124 C 60 152 64 184 82 204 M 170 124 C 180 152 176 184 158 204', stroke: '#020617', strokeWidth: 3.6, opacity: 0.25, blur: true },
      { d: 'M 74 106 Q 120 124 166 106', stroke: '#020617', strokeWidth: 3, opacity: 0.2, blur: true },
    ],
    metallicPaths: [
      { d: 'M 144 70 A 17 17 0 1 0 144.1 70 Z', metal: 'gold', fill: false, strokeWidth: 3 },
      { d: 'M 161 90 Q 170 120 165 148', metal: 'gold', fill: false, strokeWidth: 2, opacity: 0.9 },
      { d: 'M 165 146 A 4 4 0 1 0 165.1 146 Z', metal: 'gold', fill: true },
    ],
    animatedParts: [
      // Gentle owl left & right wing feathers ruffling
      {
        d: 'M 54 128 C 36 146 34 176 48 196 C 54 182 58 158 58 136 Z',
        animation: 'wing-left',
        pivotX: 56,
        pivotY: 132,
        fill: 'rgba(236, 72, 153, 0.22)',
        stroke: '#F9A8D4',
        strokeWidth: 1.8,
        layer: 'back',
      },
      {
        d: 'M 186 128 C 204 146 206 176 192 196 C 186 182 182 158 182 136 Z',
        animation: 'wing-right',
        pivotX: 184,
        pivotY: 132,
        fill: 'rgba(236, 72, 153, 0.22)',
        stroke: '#F9A8D4',
        strokeWidth: 1.8,
        layer: 'back',
      },
    ],
    specularPaths: [
      { d: 'M 64 96 C 54 126 56 160 68 188', strokeWidth: 6.2, opacity: 0.48 },
      { d: 'M 64 30 L 78 52', strokeWidth: 3.6, opacity: 0.52 },
    ],
    pinpointHighlight: { cx: 68, cy: 30, rx: 3, ry: 2 },
    rightRimPath: 'M 178 96 C 186 126 184 160 172 188',
    eyes: [
      { cx: 96, cy: 88, rx: 6.4, ry: 6.4, browD: 'M 82 78 L 109 78' },
      { cx: 144, cy: 88, rx: 6.4, ry: 6.4, browD: 'M 131 74 Q 144 68 158 76' },
    ],
    detailPaths: [
      { d: 'M 114 98 L 120 112 L 126 98 L 120 92 Z', fill: '#F59E0B', strokeWidth: 1.8 },
      { d: 'M 94 148 Q 104 158 114 148 M 126 148 Q 136 158 146 148 M 110 168 Q 120 178 130 168', strokeWidth: 2.2, opacity: 0.52 },
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
    fillTopY: 20,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 152, scaleX: 0.915, scaleY: 0.94 },
    // Full-body standing baby dragon: horned head, cute forearms, round belly, two sturdy clawed hind legs & feet, animated flapping wings & wagging spiked tail!
    clipPathD:
      'M 94 50 C 84 36 84 22 92 20 C 100 18 105 30 108 42 C 116 39 124 39 132 42 C 135 30 140 18 148 20 C 156 22 156 36 146 50 C 160 60 164 80 154 98 L 160 114 C 174 124 182 142 178 158 C 174 168 166 170 162 164 C 172 184 170 208 158 222 L 160 242 C 170 246 172 256 158 256 L 134 256 C 126 256 126 246 128 236 L 128 224 C 122 226 118 226 112 224 L 112 236 C 114 246 114 256 106 256 L 82 256 C 68 256 70 246 80 242 L 82 222 C 70 208 68 184 78 164 C 74 170 66 168 62 158 C 58 142 66 124 80 114 L 86 98 C 76 80 80 60 94 50 Z',
    sculptPaths: [
      { d: 'M 92 26 L 100 44 M 148 26 L 140 44', stroke: '#020617', strokeWidth: 2.5, opacity: 0.28, blur: true },
      { d: 'M 82 142 Q 120 156 158 142', stroke: '#020617', strokeWidth: 3.8, opacity: 0.22, blur: true },
    ],
    metallicPaths: [
      { d: 'M 87 36 L 103 39 M 153 36 L 137 39', metal: 'gold', fill: false, strokeWidth: 2.6 },
      { d: 'M 86 112 Q 120 124 154 112 L 156 119 Q 120 131 84 119 Z', metal: 'gold', fill: true, opacity: 0.9 },
      { d: 'M 120 124 L 126 132 L 120 139 L 114 132 Z', metal: 'crystal', fill: true, strokeWidth: 1.1 },
    ],
    animatedParts: [
      // Left & Right translucent crystal bat wings gently fluttering behind dragon!
      {
        d: 'M 78 122 C 52 98 26 104 20 124 C 18 136 32 146 42 150 C 36 162 50 172 68 166 Z',
        animation: 'wing-left',
        pivotX: 78,
        pivotY: 136,
        fill: 'rgba(20, 184, 166, 0.28)',
        stroke: '#5EEAD4',
        strokeWidth: 2.2,
        layer: 'back',
      },
      {
        d: 'M 162 122 C 188 98 214 104 220 124 C 222 136 208 146 198 150 C 204 162 190 172 172 166 Z',
        animation: 'wing-right',
        pivotX: 162,
        pivotY: 136,
        fill: 'rgba(20, 184, 166, 0.28)',
        stroke: '#5EEAD4',
        strokeWidth: 2.2,
        layer: 'back',
      },
      // Curled dragon tail gently wagging on the right!
      {
        d: 'M 162 204 C 186 210 204 198 212 180 C 204 188 194 192 184 192 C 176 192 168 190 162 192 Z',
        animation: 'tail-wag',
        pivotX: 162,
        pivotY: 198,
        fill: 'rgba(20, 184, 166, 0.36)',
        stroke: '#5EEAD4',
        strokeWidth: 2.2,
        layer: 'back',
      },
    ],
    specularPaths: [
      { d: 'M 76 168 C 72 186 76 208 90 220', strokeWidth: 5.8, opacity: 0.48 },
      { d: 'M 88 68 C 84 80 86 92 92 100', strokeWidth: 4, opacity: 0.52 },
    ],
    pinpointHighlight: { cx: 94, cy: 60, rx: 3.2, ry: 2 },
    rightRimPath: 'M 164 168 C 168 188 164 208 150 220',
    eyes: [
      { cx: 103, cy: 76, rx: 5.4, ry: 5.4 },
      { cx: 137, cy: 76, rx: 5.4, ry: 5.4 },
    ],
    detailPaths: [
      { d: 'M 111 90 L 111 93 M 129 90 L 129 93', strokeWidth: 3.2 },
      { d: 'M 105 100 Q 120 109 135 100', strokeWidth: 2.5 },
      { d: 'M 92 162 Q 120 172 148 162 M 88 184 Q 120 194 152 184 M 96 206 Q 120 214 144 206', stroke: '#D4AF37', strokeWidth: 2.2, opacity: 0.72 },
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
    fillTopY: 16,
    fillBottomY: 248,
    floating: true,
    innerCenter: { x: 120, y: 134, scaleX: 0.915, scaleY: 0.94 },
    // Heroic full-body levitating genie: royal turban, expressive face, broad torso with strong gesturing arms & golden bracers, tapering swirling smoke-tail!
    clipPathD:
      'M 120 16 C 134 28 148 40 154 58 C 160 74 154 90 144 100 C 174 106 196 124 200 148 C 202 162 188 172 174 166 C 168 162 164 154 162 148 L 154 178 C 148 194 132 204 128 218 C 124 230 142 238 134 246 C 114 252 94 236 102 216 C 108 202 92 194 86 178 L 78 148 C 76 154 72 162 66 166 C 52 172 38 162 40 148 C 44 124 66 106 96 100 C 86 90 80 74 86 58 C 92 40 106 28 120 16 Z',
    sculptPaths: [
      { d: 'M 92 50 Q 120 62 148 50', stroke: '#020617', strokeWidth: 3.2, opacity: 0.25, blur: true },
      { d: 'M 78 136 L 84 168 M 162 136 L 156 168', stroke: '#020617', strokeWidth: 3.2, opacity: 0.24, blur: true },
    ],
    metallicPaths: [
      { d: 'M 86 64 Q 120 76 154 64 L 153 71 Q 120 83 87 71 Z', metal: 'gold', fill: true, opacity: 0.95 },
      { d: 'M 120 40 L 127 51 L 120 61 L 113 51 Z', metal: 'crystal', fill: true, strokeWidth: 1.3 },
      // Golden genie wrist bracers & waist sash
      { d: 'M 48 152 L 66 156 M 192 152 L 174 156', metal: 'gold', fill: false, strokeWidth: 4 },
      { d: 'M 86 172 Q 120 184 154 172 L 152 180 Q 120 192 88 180 Z', metal: 'gold', fill: true, opacity: 0.92 },
    ],
    animatedParts: [
      // Ethereal golden magic ring swirling around genie tail
      {
        d: 'M 94 214 Q 120 224 146 212',
        animation: 'halo-float',
        pivotX: 120,
        pivotY: 218,
        metal: 'gold',
        strokeWidth: 2.4,
        opacity: 0.85,
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 94 56 C 98 42 108 30 118 24', strokeWidth: 4.6, opacity: 0.58 },
      { d: 'M 54 136 C 50 148 54 158 64 162', strokeWidth: 4.5, opacity: 0.46 },
    ],
    pinpointHighlight: { cx: 108, cy: 32, rx: 3.2, ry: 2 },
    rightRimPath: 'M 186 136 C 190 148 186 158 176 162',
    eyes: [
      { cx: 106, cy: 84, rx: 4.8, ry: 4.8, browD: 'M 97 75 Q 106 71 115 76' },
      { cx: 134, cy: 84, rx: 4.8, ry: 4.8, browD: 'M 143 75 Q 134 71 125 76' },
    ],
    detailPaths: [
      { d: 'M 108 98 Q 120 106 132 98', strokeWidth: 2.4 },
      { d: 'M 120 106 C 120 114 126 118 122 122', strokeWidth: 2.3 },
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
    fillTopY: 20,
    fillBottomY: 256,
    innerCenter: { x: 120, y: 146, scaleX: 0.915, scaleY: 0.94 },
    // Full-body sea titan: bulbous cephalopod mantle + six dynamically splayed curling tentacles acting as its stance!
    clipPathD:
      'M 120 20 C 162 20 182 54 176 98 C 174 114 170 126 166 136 C 194 138 216 156 214 178 C 212 194 192 198 182 186 C 180 198 192 222 186 244 C 180 256 164 256 158 242 C 154 228 152 210 146 196 L 144 242 C 142 256 128 258 124 244 L 122 208 L 118 208 L 116 244 C 112 258 98 256 96 242 L 94 196 C 88 210 86 228 82 242 C 76 256 60 256 54 244 C 48 222 60 198 58 186 C 48 198 28 194 26 178 C 24 156 46 138 74 136 C 70 126 66 114 64 98 C 58 54 78 20 120 20 Z',
    sculptPaths: [
      { d: 'M 74 88 Q 120 106 166 88', stroke: '#020617', strokeWidth: 3.4, opacity: 0.22, blur: true },
      { d: 'M 74 148 Q 120 168 166 148', stroke: '#020617', strokeWidth: 4, opacity: 0.24, blur: true },
    ],
    metallicPaths: [
      { d: 'M 78 46 L 90 30 L 106 42 L 120 26 L 134 42 L 150 30 L 162 46 Q 120 56 78 46 Z', metal: 'gold', fill: true, opacity: 0.9 },
      { d: 'M 54 154 L 68 170 M 186 154 L 172 170', metal: 'bronze', fill: false, strokeWidth: 3 },
    ],
    animatedParts: [
      // Undulating back tentacles peeking dynamically on left & right
      {
        d: 'M 42 146 C 20 132 14 114 26 106 C 34 102 42 114 38 124',
        animation: 'wing-left',
        pivotX: 44,
        pivotY: 146,
        stroke: '#818CF8',
        strokeWidth: 6,
        opacity: 0.65,
        layer: 'back',
      },
      {
        d: 'M 198 146 C 220 132 226 114 214 106 C 206 102 198 114 202 124',
        animation: 'wing-right',
        pivotX: 196,
        pivotY: 146,
        stroke: '#818CF8',
        strokeWidth: 6,
        opacity: 0.65,
        layer: 'back',
      },
    ],
    specularPaths: [
      { d: 'M 74 74 C 76 46 96 30 116 28', strokeWidth: 6.2, opacity: 0.58 },
      { d: 'M 38 168 C 36 178 44 184 52 182', strokeWidth: 4, opacity: 0.44 },
    ],
    pinpointHighlight: { cx: 88, cy: 42, rx: 4, ry: 2.2 },
    rightRimPath: 'M 168 62 C 174 84 172 108 164 128',
    eyes: [
      { cx: 96, cy: 112, rx: 7.4, ry: 7.4, browD: 'M 84 100 L 108 107' },
      { cx: 144, cy: 112, rx: 7.4, ry: 7.4, browD: 'M 156 100 L 132 107' },
    ],
    detailPaths: [
      { d: 'M 44 170 A 4 4 0 1 0 44.1 170 Z M 68 232 A 4 4 0 1 0 68.1 232 Z M 172 232 A 4 4 0 1 0 172.1 232 Z M 196 170 A 4 4 0 1 0 196.1 170 Z', fill: 'rgba(255,255,255,0.35)', strokeWidth: 1.5 },
      { d: 'M 110 132 Q 120 126 130 132', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'mula-sem-cabeca',
    name: 'Mula Sem Cabeça',
    subtitle: 'Edição Cristal · solta chamas mágicas no topo',
    rarity: 'lendario',
    unlockConditionText: 'Alcance 7 dias de ofensiva ou Baú do Gnomo',
    starterUnlocked: false,
    accentColor: '#F59E0B',
    waveColor: '#FBBF24',
    fillTopY: 64,
    fillBottomY: 256,
    innerCenter: { x: 118, y: 168, scaleX: 0.915, scaleY: 0.94 },
    topSparks: true,
    // Full-body realistic sculpted equine standing on 4 distinct horse legs & hooves, muscular chest & arched neck with golden bridle collar!
    clipPathD:
      'M 78 66 C 90 60 108 60 118 66 C 122 92 132 114 152 122 C 176 124 194 142 192 168 C 190 182 184 192 176 200 L 182 244 C 184 252 178 256 170 256 L 160 256 C 154 256 154 248 156 240 L 154 206 L 144 208 L 148 244 C 148 252 142 256 136 256 L 128 256 C 124 256 124 248 126 240 L 124 206 C 114 206 104 204 96 202 L 96 244 C 96 252 90 256 84 256 L 76 256 C 72 256 72 248 74 240 L 74 198 L 66 244 C 66 252 58 256 52 256 L 44 256 C 40 256 40 248 44 240 L 50 188 C 44 166 50 140 62 120 C 70 104 74 84 78 66 Z',
    sculptPaths: [
      { d: 'M 72 134 Q 108 150 148 138', stroke: '#020617', strokeWidth: 3.8, opacity: 0.24, blur: true },
      { d: 'M 64 190 Q 118 206 174 190', stroke: '#020617', strokeWidth: 3.4, opacity: 0.22 },
      // Hoof bands at bottom of all 4 legs
      { d: 'M 42 246 L 64 246 M 73 246 L 95 246 M 125 246 L 147 246 M 155 246 L 181 246', stroke: '#020617', strokeWidth: 3, opacity: 0.35 },
    ],
    metallicPaths: [
      { d: 'M 72 64 Q 98 76 124 64 L 123 74 Q 98 85 73 74 Z', metal: 'gold', fill: true, opacity: 0.96 },
      { d: 'M 75 76 Q 98 86 121 76', metal: 'bronze', fill: false, strokeWidth: 2.5 },
      { d: 'M 118 148 L 126 160 L 118 172 L 110 160 Z', metal: 'gold', fill: true, opacity: 0.88 },
    ],
    animatedParts: [
      // Flowing golden horse tail swaying gently at rear!
      {
        d: 'M 190 146 C 212 152 222 174 214 198 C 206 184 202 168 188 164 Z',
        animation: 'tail-wag',
        pivotX: 190,
        pivotY: 150,
        metal: 'gold',
        fill: 'gold',
        opacity: 0.9,
        layer: 'back',
      },
      // Dancing mystic flame crest erupting from the golden collar!
      {
        d: 'M 88 64 C 76 44 82 22 96 12 C 94 28 104 32 102 48 C 110 36 120 24 114 10 C 132 26 126 50 110 64 Z',
        animation: 'flame-dance',
        pivotX: 100,
        pivotY: 64,
        fill: '#F59E0B',
        stroke: '#FEF08A',
        strokeWidth: 1.5,
        opacity: 0.94,
        layer: 'front',
      },
    ],
    specularPaths: [
      { d: 'M 86 80 C 84 100 74 122 62 140', strokeWidth: 5, opacity: 0.56 },
      { d: 'M 58 166 C 58 184 62 198 72 204', strokeWidth: 5, opacity: 0.45 },
    ],
    pinpointHighlight: { cx: 88, cy: 86, rx: 3.2, ry: 2 },
    rightRimPath: 'M 182 146 C 188 164 186 184 176 196',
    eyes: [],
    detailPaths: [
      { d: 'M 122 84 Q 140 88 136 104 Q 154 110 150 124', stroke: '#D4AF37', strokeWidth: 2.8, opacity: 0.85 },
      { d: 'M 94 162 Q 118 174 146 162', stroke: '#D4AF37', strokeWidth: 2.2, opacity: 0.65 },
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

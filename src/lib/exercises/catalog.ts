// ─── Exercise Catalog ──────────────────────────────────────────────────────────
// A Forxa Fitness App
// 80+ exercises with full multilingual metadata, muscle groups, and level system
// ─────────────────────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'cardio'
  | 'full_body';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'cardio_machine';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;       // Spanish (default)
  nameEn: string;     // English
  nameGl: string;     // Galician
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  icon: string;       // emoji
  svgPath: string;    // key into the SVG icon library
}

// ─── EXERCISE CATALOG ─────────────────────────────────────────────────────────

export const EXERCISES: Exercise[] = [
  // ── CHEST (6) ────────────────────────────────────────────────────────────────
  {
    id: 'bench-press',
    name: 'Press de Banca',
    nameEn: 'Bench Press',
    nameGl: 'Press de Banca',
    muscleGroup: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🏋️',
    svgPath: 'bench-press',
  },
  {
    id: 'incline-press',
    name: 'Press Inclinado',
    nameEn: 'Incline Press',
    nameGl: 'Press Inclinado',
    muscleGroup: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '📐',
    svgPath: 'incline-press',
  },
  {
    id: 'decline-press',
    name: 'Press Declinado',
    nameEn: 'Decline Press',
    nameGl: 'Press Declinado',
    muscleGroup: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '📉',
    svgPath: 'bench-press',
  },
  {
    id: 'dumbbell-flyes',
    name: 'Aperturas con Mancuernas',
    nameEn: 'Dumbbell Flyes',
    nameGl: 'Aberturas con Mancuernas',
    muscleGroup: 'chest',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🦅',
    svgPath: 'dumbbell-fly',
  },
  {
    id: 'chest-dips',
    name: 'Fondos en Paralelas',
    nameEn: 'Chest Dips',
    nameGl: 'Fondos en Paralelas',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '🤸',
    svgPath: 'dips',
  },
  {
    id: 'cable-crossover',
    name: 'Crossover en Polea',
    nameEn: 'Cable Crossover',
    nameGl: 'Crossover en Polea',
    muscleGroup: 'chest',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '🔀',
    svgPath: 'cable-crossover',
  },
  {
    id: 'push-up',
    name: 'Flexiones',
    nameEn: 'Push-Up',
    nameGl: 'Flexións',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '💪',
    svgPath: 'push-up',
  },

  // ── BACK (7) ─────────────────────────────────────────────────────────────────
  {
    id: 'pull-up',
    name: 'Dominadas',
    nameEn: 'Pull-Up',
    nameGl: 'Dominadas',
    muscleGroup: 'back',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '🧗',
    svgPath: 'pull-up',
  },
  {
    id: 'lat-pulldown',
    name: 'Jalón al Pecho',
    nameEn: 'Lat Pulldown',
    nameGl: 'Jalón ao Peito',
    muscleGroup: 'back',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '⬇️',
    svgPath: 'lat-pulldown',
  },
  {
    id: 'barbell-row',
    name: 'Remo con Barra',
    nameEn: 'Barbell Row',
    nameGl: 'Remo con Barra',
    muscleGroup: 'back',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🚣',
    svgPath: 'cable-row',
  },
  {
    id: 'dumbbell-row',
    name: 'Remo con Mancuerna',
    nameEn: 'Dumbbell Row',
    nameGl: 'Remo con Mancuerna',
    muscleGroup: 'back',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🏋️',
    svgPath: 'dumbbell-row',
  },
  {
    id: 'deadlift',
    name: 'Peso Muerto',
    nameEn: 'Deadlift',
    nameGl: 'Peso Morto',
    muscleGroup: 'back',
    equipment: 'barbell',
    difficulty: 'advanced',
    icon: '☠️',
    svgPath: 'deadlift',
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    nameEn: 'Face Pull',
    nameGl: 'Face Pull',
    muscleGroup: 'back',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '😤',
    svgPath: 'face-pull',
  },
  {
    id: 'pullover',
    name: 'Pull-Over',
    nameEn: 'Pull-Over',
    nameGl: 'Pull-Over',
    muscleGroup: 'back',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🔄',
    svgPath: 'pullover',
  },
  {
    id: 'seated-cable-row',
    name: 'Remo en Polea Sentado',
    nameEn: 'Seated Cable Row',
    nameGl: 'Remo en Polea Sentado',
    muscleGroup: 'back',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '🚣',
    svgPath: 'cable-row',
  },

  // ── SHOULDERS (6) ────────────────────────────────────────────────────────────
  {
    id: 'overhead-press',
    name: 'Press Militar',
    nameEn: 'Overhead Press',
    nameGl: 'Press Militar',
    muscleGroup: 'shoulders',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🪖',
    svgPath: 'overhead-press',
  },
  {
    id: 'lateral-raises',
    name: 'Elevaciones Laterales',
    nameEn: 'Lateral Raises',
    nameGl: 'Elevacións Laterais',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🦆',
    svgPath: 'lateral-raise',
  },
  {
    id: 'front-raises',
    name: 'Elevaciones Frontales',
    nameEn: 'Front Raises',
    nameGl: 'Elevacións Frontais',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '⬆️',
    svgPath: 'front-raise',
  },
  {
    id: 'reverse-flyes',
    name: 'Pájaros / Aperturas Inversas',
    nameEn: 'Reverse Flyes',
    nameGl: 'Paxaros / Aberturas Inversas',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🐦',
    svgPath: 'reverse-fly',
  },
  {
    id: 'arnold-press',
    name: 'Press Arnold',
    nameEn: 'Arnold Press',
    nameGl: 'Press Arnold',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    icon: '💪',
    svgPath: 'overhead-press',
  },
  {
    id: 'upright-row',
    name: 'Remo al Cuello',
    nameEn: 'Upright Row',
    nameGl: 'Remo ao Pescozo',
    muscleGroup: 'shoulders',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '⬆️',
    svgPath: 'upright-row',
  },

  // ── BICEPS (5) ───────────────────────────────────────────────────────────────
  {
    id: 'barbell-curl',
    name: 'Curl de Bíceps con Barra',
    nameEn: 'Barbell Curl',
    nameGl: 'Curl de Bíceps con Barra',
    muscleGroup: 'biceps',
    equipment: 'barbell',
    difficulty: 'beginner',
    icon: '💪',
    svgPath: 'dumbbell-curl',
  },
  {
    id: 'hammer-curl',
    name: 'Curl Martillo',
    nameEn: 'Hammer Curl',
    nameGl: 'Curl Martelo',
    muscleGroup: 'biceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🔨',
    svgPath: 'dumbbell-curl',
  },
  {
    id: 'scott-curl',
    name: 'Curl Scott',
    nameEn: 'Scott Curl / Preacher Curl',
    nameGl: 'Curl Scott',
    muscleGroup: 'biceps',
    equipment: 'barbell',
    difficulty: 'beginner',
    icon: '📖',
    svgPath: 'preacher-curl',
  },
  {
    id: 'concentration-curl',
    name: 'Curl Concentrado',
    nameEn: 'Concentration Curl',
    nameGl: 'Curl Concentrado',
    muscleGroup: 'biceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🎯',
    svgPath: 'dumbbell-curl',
  },
  {
    id: 'cable-curl',
    name: 'Curl en Polea',
    nameEn: 'Cable Curl',
    nameGl: 'Curl en Polea',
    muscleGroup: 'biceps',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '🔗',
    svgPath: 'cable-curl',
  },

  // ── TRICEPS (5) ──────────────────────────────────────────────────────────────
  {
    id: 'cable-pushdown',
    name: 'Extensión en Polea',
    nameEn: 'Cable Pushdown',
    nameGl: 'Extensión en Polea',
    muscleGroup: 'triceps',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '⬇️',
    svgPath: 'cable-pushdown',
  },
  {
    id: 'skull-crusher',
    name: 'Rompecráneos / Press Francés',
    nameEn: 'Skull Crusher',
    nameGl: 'Rompecráneos / Press Francés',
    muscleGroup: 'triceps',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '💀',
    svgPath: 'skull-crusher',
  },
  {
    id: 'triceps-dips',
    name: 'Fondos de Tríceps',
    nameEn: 'Triceps Dips',
    nameGl: 'Fondos de Tríceps',
    muscleGroup: 'triceps',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🤸',
    svgPath: 'dips',
  },
  {
    id: 'triceps-kickback',
    name: 'Patada de Tríceps',
    nameEn: 'Triceps Kickback',
    nameGl: 'Patada de Tríceps',
    muscleGroup: 'triceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🦵',
    svgPath: 'triceps-kickback',
  },
  {
    id: 'overhead-triceps-extension',
    name: 'Extensión de Tríceps sobre la Cabeza',
    nameEn: 'Overhead Triceps Extension',
    nameGl: 'Extensión de Tríceps sobre a Cabeza',
    muscleGroup: 'triceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '☝️',
    svgPath: 'overhead-triceps',
  },

  // ── QUADS (6) ────────────────────────────────────────────────────────────────
  {
    id: 'squat',
    name: 'Sentadilla',
    nameEn: 'Squat',
    nameGl: 'Sentadilla',
    muscleGroup: 'quads',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🏋️',
    svgPath: 'squat',
  },
  {
    id: 'leg-press',
    name: 'Prensa de Pierna',
    nameEn: 'Leg Press',
    nameGl: 'Prensa de Perna',
    muscleGroup: 'quads',
    equipment: 'machine',
    difficulty: 'beginner',
    icon: '🦵',
    svgPath: 'leg-press',
  },
  {
    id: 'leg-extension',
    name: 'Extensión de Cuádriceps',
    nameEn: 'Leg Extension',
    nameGl: 'Extensión de Cuádriceps',
    muscleGroup: 'quads',
    equipment: 'machine',
    difficulty: 'beginner',
    icon: '🦵',
    svgPath: 'leg-extension',
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Sentadilla Búlgara',
    nameEn: 'Bulgarian Split Squat',
    nameGl: 'Sentadilla Búlgara',
    muscleGroup: 'quads',
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    icon: '🇧🇬',
    svgPath: 'split-squat',
  },
  {
    id: 'hack-squat',
    name: 'Hack Squat',
    nameEn: 'Hack Squat',
    nameGl: 'Hack Squat',
    muscleGroup: 'quads',
    equipment: 'machine',
    difficulty: 'intermediate',
    icon: '🔩',
    svgPath: 'hack-squat',
  },
  {
    id: 'lunges',
    name: 'Zancadas',
    nameEn: 'Lunges',
    nameGl: 'Zancadas',
    muscleGroup: 'quads',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🚶',
    svgPath: 'lunge',
  },

  // ── HAMSTRINGS & GLUTES (6) ──────────────────────────────────────────────────
  {
    id: 'romanian-deadlift',
    name: 'Peso Muerto Rumano',
    nameEn: 'Romanian Deadlift',
    nameGl: 'Peso Morto Rumano',
    muscleGroup: 'hamstrings',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🇷🇴',
    svgPath: 'romanian-deadlift',
  },
  {
    id: 'leg-curl',
    name: 'Curl Femoral',
    nameEn: 'Leg Curl',
    nameGl: 'Curl Femoral',
    muscleGroup: 'hamstrings',
    equipment: 'machine',
    difficulty: 'beginner',
    icon: '🦵',
    svgPath: 'leg-curl',
  },
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    nameEn: 'Hip Thrust',
    nameGl: 'Hip Thrust',
    muscleGroup: 'glutes',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🍑',
    svgPath: 'hip-thrust',
  },
  {
    id: 'glute-kickback',
    name: 'Patada de Glúteo',
    nameEn: 'Glute Kickback',
    nameGl: 'Patada de Glúteo',
    muscleGroup: 'glutes',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '🦵',
    svgPath: 'glute-kickback',
  },
  {
    id: 'sumo-squat',
    name: 'Sentadilla Sumo',
    nameEn: 'Sumo Squat',
    nameGl: 'Sentadilla Sumo',
    muscleGroup: 'glutes',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🤼',
    svgPath: 'sumo-squat',
  },
  {
    id: 'good-mornings',
    name: 'Buenos Días',
    nameEn: 'Good Mornings',
    nameGl: 'Bos Días',
    muscleGroup: 'hamstrings',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🌅',
    svgPath: 'good-mornings',
  },

  // ── CALVES (2) ───────────────────────────────────────────────────────────────
  {
    id: 'standing-calf-raise',
    name: 'Elevación de Talones de Pie',
    nameEn: 'Standing Calf Raise',
    nameGl: 'Elevación de Talóns de Pé',
    muscleGroup: 'calves',
    equipment: 'machine',
    difficulty: 'beginner',
    icon: '🦵',
    svgPath: 'calf-raise',
  },
  {
    id: 'seated-calf-raise',
    name: 'Elevación de Talones Sentado',
    nameEn: 'Seated Calf Raise',
    nameGl: 'Elevación de Talóns Sentado',
    muscleGroup: 'calves',
    equipment: 'machine',
    difficulty: 'beginner',
    icon: '💺',
    svgPath: 'calf-raise',
  },

  // ── ABS (5) ──────────────────────────────────────────────────────────────────
  {
    id: 'crunch',
    name: 'Crunch Abdominal',
    nameEn: 'Crunch',
    nameGl: 'Crunch Abdominal',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🙆',
    svgPath: 'crunch',
  },
  {
    id: 'plank',
    name: 'Plancha',
    nameEn: 'Plank',
    nameGl: 'Prancha',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🪵',
    svgPath: 'plank',
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    nameEn: 'Russian Twist',
    nameGl: 'Russian Twist',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🌀',
    svgPath: 'russian-twist',
  },
  {
    id: 'leg-raise',
    name: 'Elevación de Piernas',
    nameEn: 'Leg Raise',
    nameGl: 'Elevación de Pernas',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🦵',
    svgPath: 'leg-raise',
  },
  {
    id: 'ab-wheel',
    name: 'Rueda Abdominal',
    nameEn: 'Ab Wheel Rollout',
    nameGl: 'Roda Abdominal',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '⚙️',
    svgPath: 'ab-wheel',
  },

  // ── CARDIO (5) ───────────────────────────────────────────────────────────────
  {
    id: 'running',
    name: 'Carrera / Running',
    nameEn: 'Running',
    nameGl: 'Carreira / Running',
    muscleGroup: 'cardio',
    equipment: 'cardio_machine',
    difficulty: 'beginner',
    icon: '🏃',
    svgPath: 'running',
  },
  {
    id: 'cycling',
    name: 'Bicicleta Estática',
    nameEn: 'Cycling',
    nameGl: 'Bicicleta Estática',
    muscleGroup: 'cardio',
    equipment: 'cardio_machine',
    difficulty: 'beginner',
    icon: '🚴',
    svgPath: 'cycling',
  },
  {
    id: 'rowing-machine',
    name: 'Remo en Ergómetro',
    nameEn: 'Rowing Machine',
    nameGl: 'Remo en Ergómetro',
    muscleGroup: 'cardio',
    equipment: 'cardio_machine',
    difficulty: 'intermediate',
    icon: '🚣',
    svgPath: 'rowing',
  },
  {
    id: 'elliptical',
    name: 'Elíptica',
    nameEn: 'Elliptical',
    nameGl: 'Elíptica',
    muscleGroup: 'cardio',
    equipment: 'cardio_machine',
    difficulty: 'beginner',
    icon: '♾️',
    svgPath: 'elliptical',
  },
  {
    id: 'swimming',
    name: 'Natación',
    nameEn: 'Swimming',
    nameGl: 'Natación',
    muscleGroup: 'cardio',
    equipment: 'cardio_machine',
    difficulty: 'beginner',
    icon: '🏊',
    svgPath: 'swimming',
  },

  // ── FULL BODY / COMPOUND (additional exercises to reach 80+) ─────────────────
  {
    id: 'power-clean',
    name: 'Power Clean',
    nameEn: 'Power Clean',
    nameGl: 'Power Clean',
    muscleGroup: 'full_body',
    equipment: 'barbell',
    difficulty: 'advanced',
    icon: '⚡',
    svgPath: 'deadlift',
  },
  {
    id: 'thruster',
    name: 'Thruster',
    nameEn: 'Thruster',
    nameGl: 'Thruster',
    muscleGroup: 'full_body',
    equipment: 'barbell',
    difficulty: 'advanced',
    icon: '🚀',
    svgPath: 'overhead-press',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    nameEn: 'Burpee',
    nameGl: 'Burpee',
    muscleGroup: 'full_body',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '💥',
    svgPath: 'burpee',
  },
  {
    id: 'kettlebell-swing',
    name: 'Swing con Kettlebell',
    nameEn: 'Kettlebell Swing',
    nameGl: 'Swing con Kettlebell',
    muscleGroup: 'full_body',
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    icon: '🔔',
    svgPath: 'kettlebell-swing',
  },
  {
    id: 'clean-and-jerk',
    name: 'Arrancada y Envión',
    nameEn: 'Clean and Jerk',
    nameGl: 'Arrincada e Envión',
    muscleGroup: 'full_body',
    equipment: 'barbell',
    difficulty: 'advanced',
    icon: '🏆',
    svgPath: 'deadlift',
  },
  // Extra Chest
  {
    id: 'pec-deck',
    name: 'Mariposa en Máquina',
    nameEn: 'Pec Deck',
    nameGl: 'Bolboreta en Máquina',
    muscleGroup: 'chest',
    equipment: 'machine',
    difficulty: 'beginner',
    icon: '🦋',
    svgPath: 'pec-deck',
  },
  {
    id: 'cable-fly',
    name: 'Aperturas en Polea',
    nameEn: 'Cable Fly',
    nameGl: 'Aberturas en Polea',
    muscleGroup: 'chest',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '🦅',
    svgPath: 'cable-crossover',
  },
  // Extra Back
  {
    id: 'hyperextension',
    name: 'Hiperextensión Lumbar',
    nameEn: 'Back Extension',
    nameGl: 'Hiperextensión Lumbar',
    muscleGroup: 'back',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🌉',
    svgPath: 'back-extension',
  },
  {
    id: 'chest-supported-row',
    name: 'Remo con Apoyo en Pecho',
    nameEn: 'Chest-Supported Row',
    nameGl: 'Remo con Apoio no Peito',
    muscleGroup: 'back',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🤲',
    svgPath: 'dumbbell-row',
  },
  // Extra Shoulders
  {
    id: 'shrugs',
    name: 'Encogimientos de Hombros',
    nameEn: 'Shrugs',
    nameGl: 'Encollementos de Ombros',
    muscleGroup: 'shoulders',
    equipment: 'barbell',
    difficulty: 'beginner',
    icon: '🤷',
    svgPath: 'shrug',
  },
  {
    id: 'machine-press',
    name: 'Press de Hombros en Máquina',
    nameEn: 'Machine Shoulder Press',
    nameGl: 'Press de Ombros en Máquina',
    muscleGroup: 'shoulders',
    equipment: 'machine',
    difficulty: 'beginner',
    icon: '🤖',
    svgPath: 'overhead-press',
  },
  // Extra Biceps
  {
    id: 'incline-curl',
    name: 'Curl Inclinado',
    nameEn: 'Incline Dumbbell Curl',
    nameGl: 'Curl Inclinado',
    muscleGroup: 'biceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '📐',
    svgPath: 'dumbbell-curl',
  },
  {
    id: 'chin-up',
    name: 'Dominada Supina',
    nameEn: 'Chin-Up',
    nameGl: 'Dominada Supina',
    muscleGroup: 'biceps',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '🧗',
    svgPath: 'pull-up',
  },
  // Extra Triceps
  {
    id: 'close-grip-bench',
    name: 'Press de Banca Agarre Cerrado',
    nameEn: 'Close-Grip Bench Press',
    nameGl: 'Press de Banca Agarre Pechado',
    muscleGroup: 'triceps',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🤏',
    svgPath: 'bench-press',
  },
  // Extra Quads
  {
    id: 'front-squat',
    name: 'Sentadilla Frontal',
    nameEn: 'Front Squat',
    nameGl: 'Sentadilla Frontal',
    muscleGroup: 'quads',
    equipment: 'barbell',
    difficulty: 'advanced',
    icon: '🔂',
    svgPath: 'squat',
  },
  {
    id: 'goblet-squat',
    name: 'Sentadilla Goblet',
    nameEn: 'Goblet Squat',
    nameGl: 'Sentadilla Goblet',
    muscleGroup: 'quads',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🍶',
    svgPath: 'squat',
  },
  // Extra Glutes/Hamstrings
  {
    id: 'nordic-curl',
    name: 'Curl Nórdico',
    nameEn: 'Nordic Curl',
    nameGl: 'Curl Nórdico',
    muscleGroup: 'hamstrings',
    equipment: 'bodyweight',
    difficulty: 'advanced',
    icon: '❄️',
    svgPath: 'nordic-curl',
  },
  {
    id: 'glute-bridge',
    name: 'Puente de Glúteo',
    nameEn: 'Glute Bridge',
    nameGl: 'Ponte de Glúteo',
    muscleGroup: 'glutes',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🌉',
    svgPath: 'glute-bridge',
  },
  {
    id: 'cable-pull-through',
    name: 'Pull-Through en Polea',
    nameEn: 'Cable Pull-Through',
    nameGl: 'Pull-Through en Polea',
    muscleGroup: 'glutes',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '🔗',
    svgPath: 'cable-row',
  },
  // Extra Abs
  {
    id: 'cable-crunch',
    name: 'Crunch en Polea',
    nameEn: 'Cable Crunch',
    nameGl: 'Crunch en Polea',
    muscleGroup: 'abs',
    equipment: 'cable',
    difficulty: 'beginner',
    icon: '🔗',
    svgPath: 'crunch',
  },
  {
    id: 'hanging-leg-raise',
    name: 'Elevación de Piernas Colgado',
    nameEn: 'Hanging Leg Raise',
    nameGl: 'Elevación de Pernas Colgado',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '🪝',
    svgPath: 'hanging-leg-raise',
  },
  {
    id: 'side-plank',
    name: 'Plancha Lateral',
    nameEn: 'Side Plank',
    nameGl: 'Prancha Lateral',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '↔️',
    svgPath: 'side-plank',
  },
  {
    id: 'bicycle-crunch',
    name: 'Crunch Bicicleta',
    nameEn: 'Bicycle Crunch',
    nameGl: 'Crunch Bicicleta',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🚴',
    svgPath: 'crunch',
  },
  // Extra Cardio
  {
    id: 'jump-rope',
    name: 'Comba / Saltar a la Cuerda',
    nameEn: 'Jump Rope',
    nameGl: 'Comba / Saltar á Corda',
    muscleGroup: 'cardio',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🪢',
    svgPath: 'jump-rope',
  },
  {
    id: 'box-jump',
    name: 'Salto a la Caja',
    nameEn: 'Box Jump',
    nameGl: 'Salto á Caixa',
    muscleGroup: 'cardio',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '📦',
    svgPath: 'box-jump',
  },
  {
    id: 'battle-ropes',
    name: 'Cuerdas de Batalla',
    nameEn: 'Battle Ropes',
    nameGl: 'Cordas de Batalla',
    muscleGroup: 'cardio',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '🪢',
    svgPath: 'battle-ropes',
  },
  // Extra Full Body
  {
    id: 'snatch',
    name: 'Arranque',
    nameEn: 'Snatch',
    nameGl: 'Arrincada',
    muscleGroup: 'full_body',
    equipment: 'barbell',
    difficulty: 'advanced',
    icon: '🔱',
    svgPath: 'deadlift',
  },
  {
    id: 'farmer-walk',
    name: 'Caminata del Granjero',
    nameEn: "Farmer's Walk",
    nameGl: 'Camiñada do Labrego',
    muscleGroup: 'full_body',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    icon: '🚜',
    svgPath: 'running',
  },
  {
    id: 'bear-crawl',
    name: 'Caminar del Oso',
    nameEn: 'Bear Crawl',
    nameGl: 'Camiñada do Oso',
    muscleGroup: 'full_body',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🐻',
    svgPath: 'bear-crawl',
  },
  {
    id: 'turkish-getup',
    name: 'Turkish Get-Up',
    nameEn: 'Turkish Get-Up',
    nameGl: 'Turkish Get-Up',
    muscleGroup: 'full_body',
    equipment: 'dumbbell',
    difficulty: 'advanced',
    icon: '🏺',
    svgPath: 'default',
  },
  {
    id: 'sled-push',
    name: 'Empuje de Trineo',
    nameEn: 'Sled Push',
    nameGl: 'Empurre de Trineo',
    muscleGroup: 'full_body',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    icon: '🛷',
    svgPath: 'default',
  },
  {
    id: 'mountain-climber',
    name: 'Escalador de Montaña',
    nameEn: 'Mountain Climber',
    nameGl: 'Escalador de Montaña',
    muscleGroup: 'full_body',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '⛰️',
    svgPath: 'mountain-climber',
  },
  {
    id: 'jumping-jack',
    name: 'Jumping Jack',
    nameEn: 'Jumping Jack',
    nameGl: 'Jumping Jack',
    muscleGroup: 'cardio',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '⭐',
    svgPath: 'jumping-jack',
  },
  {
    id: 'step-up',
    name: 'Subida al Cajón',
    nameEn: 'Step-Up',
    nameGl: 'Subida ao Caixón',
    muscleGroup: 'quads',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🪜',
    svgPath: 'step-up',
  },
  {
    id: 'calf-raise-donkey',
    name: 'Elevación de Talones con Burro',
    nameEn: 'Donkey Calf Raise',
    nameGl: 'Elevación de Talóns con Burro',
    muscleGroup: 'calves',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    icon: '🫏',
    svgPath: 'calf-raise',
  },
  {
    id: 'pull-over-machine',
    name: 'Pull-Over en Máquina',
    nameEn: 'Machine Pull-Over',
    nameGl: 'Pull-Over en Máquina',
    muscleGroup: 'back',
    equipment: 'machine',
    difficulty: 'beginner',
    icon: '🔄',
    svgPath: 'pullover',
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Press Inclinado con Mancuernas',
    nameEn: 'Incline Dumbbell Press',
    nameGl: 'Press Inclinado con Mancuernas',
    muscleGroup: 'chest',
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    icon: '📐',
    svgPath: 'incline-press',
  },
  {
    id: 't-bar-row',
    name: 'Remo en T',
    nameEn: 'T-Bar Row',
    nameGl: 'Remo en T',
    muscleGroup: 'back',
    equipment: 'barbell',
    difficulty: 'intermediate',
    icon: '🏗️',
    svgPath: 'cable-row',
  },
  {
    id: 'reverse-curl',
    name: 'Curl Inverso',
    nameEn: 'Reverse Curl',
    nameGl: 'Curl Inverso',
    muscleGroup: 'biceps',
    equipment: 'barbell',
    difficulty: 'beginner',
    icon: '🔃',
    svgPath: 'dumbbell-curl',
  },
  {
    id: 'sissy-squat',
    name: 'Sentadilla Sissy',
    nameEn: 'Sissy Squat',
    nameGl: 'Sentadilla Sissy',
    muscleGroup: 'quads',
    equipment: 'bodyweight',
    difficulty: 'advanced',
    icon: '🎀',
    svgPath: 'squat',
  },
  {
    id: 'single-leg-deadlift',
    name: 'Peso Muerto a Una Pierna',
    nameEn: 'Single-Leg Deadlift',
    nameGl: 'Peso Morto a Unha Perna',
    muscleGroup: 'hamstrings',
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    icon: '🦩',
    svgPath: 'deadlift',
  },
  {
    id: 'wood-chop',
    name: 'Leñador en Polea',
    nameEn: 'Cable Wood Chop',
    nameGl: 'Lenhador en Polea',
    muscleGroup: 'abs',
    equipment: 'cable',
    difficulty: 'intermediate',
    icon: '🪓',
    svgPath: 'russian-twist',
  },
  {
    id: 'dragon-flag',
    name: 'Bandera del Dragón',
    nameEn: 'Dragon Flag',
    nameGl: 'Bandeira do Dragón',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'advanced',
    icon: '🐉',
    svgPath: 'leg-raise',
  },
];

// ─── MUSCLE GROUPS ────────────────────────────────────────────────────────────

export interface MuscleGroupMeta {
  id: MuscleGroup;
  label: string;       // Spanish label
  labelEn: string;     // English label
  labelGl: string;     // Galician label
  color: string;       // CSS hex color for UI chips
  emoji: string;
}

export const MUSCLE_GROUPS: MuscleGroupMeta[] = [
  { id: 'chest',      label: 'Pecho',        labelEn: 'Chest',       labelGl: 'Peito',        color: '#ef4444', emoji: '💪' },
  { id: 'back',       label: 'Espalda',      labelEn: 'Back',        labelGl: 'Costas',       color: '#3b82f6', emoji: '🏋️' },
  { id: 'shoulders',  label: 'Hombros',      labelEn: 'Shoulders',   labelGl: 'Ombros',       color: '#8b5cf6', emoji: '🦁' },
  { id: 'biceps',     label: 'Bíceps',       labelEn: 'Biceps',      labelGl: 'Bíceps',       color: '#06b6d4', emoji: '💪' },
  { id: 'triceps',    label: 'Tríceps',      labelEn: 'Triceps',     labelGl: 'Tríceps',      color: '#0ea5e9', emoji: '💪' },
  { id: 'quads',      label: 'Cuádriceps',   labelEn: 'Quads',       labelGl: 'Cuádriceps',   color: '#f97316', emoji: '🦵' },
  { id: 'hamstrings', label: 'Isquiotibiales', labelEn: 'Hamstrings', labelGl: 'Isquiotibiais', color: '#f59e0b', emoji: '🦵' },
  { id: 'glutes',     label: 'Glúteos',      labelEn: 'Glutes',      labelGl: 'Glúteos',      color: '#ec4899', emoji: '🍑' },
  { id: 'calves',     label: 'Gemelos',      labelEn: 'Calves',      labelGl: 'Xemelgos',     color: '#10b981', emoji: '🦵' },
  { id: 'abs',        label: 'Abdominales',  labelEn: 'Abs',         labelGl: 'Abdominais',   color: '#84cc16', emoji: '🎯' },
  { id: 'cardio',     label: 'Cardio',       labelEn: 'Cardio',      labelGl: 'Cardio',       color: '#22c55e', emoji: '❤️' },
  { id: 'full_body',  label: 'Cuerpo Completo', labelEn: 'Full Body', labelGl: 'Corpo Completo', color: '#a855f7', emoji: '⚡' },
];

// ─── LEVEL SYSTEM ─────────────────────────────────────────────────────────────

export type LevelTier =
  | 'novato'
  | 'aprendiz'
  | 'intermedio'
  | 'avanzado'
  | 'elite'
  | 'legendario';

export interface Level {
  id: LevelTier;
  label: string;       // Spanish label
  labelEn: string;     // English label
  labelGl: string;     // Galician label
  icon: string;        // emoji badge icon
  minXp: number;       // minimum XP required to reach this level
  maxXp: number;       // XP cap for this level (exclusive)
  color: string;       // primary color
  glowColor: string;   // for glow/shadow effects
}

export const LEVELS: Level[] = [
  {
    id: 'novato',
    label: 'Novato',
    labelEn: 'Novice',
    labelGl: 'Novato',
    icon: '🥉',        // bronze medal
    minXp: 0,
    maxXp: 500,
    color: '#cd7f32',
    glowColor: 'rgba(205,127,50,0.35)',
  },
  {
    id: 'aprendiz',
    label: 'Aprendiz',
    labelEn: 'Apprentice',
    labelGl: 'Aprendiz',
    icon: '🥈',        // silver medal
    minXp: 500,
    maxXp: 1500,
    color: '#a8a8a8',
    glowColor: 'rgba(168,168,168,0.35)',
  },
  {
    id: 'intermedio',
    label: 'Intermedio',
    labelEn: 'Intermediate',
    labelGl: 'Intermedio',
    icon: '🥇',        // gold medal
    minXp: 1500,
    maxXp: 4000,
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.35)',
  },
  {
    id: 'avanzado',
    label: 'Avanzado',
    labelEn: 'Advanced',
    labelGl: 'Avanzado',
    icon: '💎',        // diamond
    minXp: 4000,
    maxXp: 10000,
    color: '#67e8f9',
    glowColor: 'rgba(103,232,249,0.35)',
  },
  {
    id: 'elite',
    label: 'Élite',
    labelEn: 'Elite',
    labelGl: 'Élite',
    icon: '👑',        // crown
    minXp: 10000,
    maxXp: 25000,
    color: '#f97316',
    glowColor: 'rgba(249,115,22,0.45)',
  },
  {
    id: 'legendario',
    label: 'Legendario',
    labelEn: 'Legendary',
    labelGl: 'Lendario',
    icon: '⚡',        // lightning
    minXp: 25000,
    maxXp: Infinity,
    color: '#a855f7',
    glowColor: 'rgba(168,85,247,0.45)',
  },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/**
 * Returns the Level object corresponding to a given XP value.
 * Falls back to the first (Novato) level for negative XP.
 */
export function getLevelForXP(xp: number): Level {
  if (xp < 0) return LEVELS[0];
  // Iterate from highest to lowest to find the correct tier
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Returns the progress (0–1) within the current level.
 * Returns 1 for the last (legendary) level once maxXp is Infinity.
 */
export function getLevelProgress(xp: number): number {
  const level = getLevelForXP(xp);
  if (level.maxXp === Infinity) return 1;
  const range = level.maxXp - level.minXp;
  const progress = (xp - level.minXp) / range;
  return Math.min(Math.max(progress, 0), 1);
}

/**
 * Filters exercises by muscle group.
 * Pass 'all' or undefined to return all exercises.
 */
export function getExercisesByMuscle(muscle: MuscleGroup | 'all'): Exercise[] {
  if (muscle === 'all') return EXERCISES;
  return EXERCISES.filter((e) => e.muscleGroup === muscle);
}

/**
 * Filters exercises by difficulty.
 */
export function getExercisesByDifficulty(difficulty: Difficulty): Exercise[] {
  return EXERCISES.filter((e) => e.difficulty === difficulty);
}

/**
 * Filters exercises by equipment.
 */
export function getExercisesByEquipment(equipment: Equipment): Exercise[] {
  return EXERCISES.filter((e) => e.equipment === equipment);
}

/**
 * Returns a single exercise by its id. Returns undefined if not found.
 */
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

/**
 * Search exercises by name (Spanish, English, or Galician).
 * Case-insensitive.
 */
export function searchExercises(query: string): Exercise[] {
  const q = query.toLowerCase().trim();
  if (!q) return EXERCISES;
  return EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.nameEn.toLowerCase().includes(q) ||
      e.nameGl.toLowerCase().includes(q)
  );
}

/**
 * Returns the MuscleGroupMeta for a given muscle group id.
 */
export function getMuscleGroupMeta(muscle: MuscleGroup): MuscleGroupMeta {
  return MUSCLE_GROUPS.find((m) => m.id === muscle) ?? MUSCLE_GROUPS[0];
}

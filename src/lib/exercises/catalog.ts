export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'quads' | 'hamstrings' | 'calves' | 'abs' | 'cardio' | 'full_body';
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'cardio_machine';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string; // Default es
  nameEn: string;
  nameGl: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  icon: string; // SVG id
}

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string; color: string }[] = [
  { id: 'chest', label: 'Pecho', color: '#3b82f6' },
  { id: 'back', label: 'Espalda', color: '#10b981' },
  { id: 'shoulders', label: 'Hombros', color: '#8b5cf6' },
  { id: 'biceps', label: 'Bíceps', color: '#f59e0b' },
  { id: 'triceps', label: 'Tríceps', color: '#ec4899' },
  { id: 'quads', label: 'Cuádriceps', color: '#ef4444' },
  { id: 'hamstrings', label: 'Femoral', color: '#f97316' },
  { id: 'calves', label: 'Gemelos', color: '#14b8a6' },
  { id: 'abs', label: 'Abdomen', color: '#6366f1' },
  { id: 'cardio', label: 'Cardio', color: '#f43f5e' }
];

export const LEVELS = [
  { id: 1, name: 'Novato', emoji: '🥉', minXp: 0, color: '#cd7f32' },
  { id: 2, name: 'Aprendiz', emoji: '🥈', minXp: 100, color: '#c0c0c0' },
  { id: 3, name: 'Guerrero', emoji: '🥇', minXp: 300, color: '#ffd700' },
  { id: 4, name: 'Veterano', emoji: '💎', minXp: 700, color: '#00ffff' },
  { id: 5, name: 'Élite', emoji: '👑', minXp: 1500, color: '#ff00ff' },
  { id: 6, name: 'Legendario', emoji: '⚡', minXp: 3000, color: '#ff4500' }
];

export function getLevelForXP(xp: number) {
  return [...LEVELS].reverse().find(l => xp >= l.minXp) || LEVELS[0];
}

export const EXERCISE_CATALOG: Exercise[] = [
  // CHEST
  { id: 'bench-press', name: 'Press de Banca', nameEn: 'Bench Press', nameGl: 'Press de Banca', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', icon: 'bench-press' },
  { id: 'incline-bench-press', name: 'Press Inclinado', nameEn: 'Incline Bench Press', nameGl: 'Press Inclinado', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', icon: 'bench-press' },
  { id: 'decline-bench-press', name: 'Press Declinado', nameEn: 'Decline Bench Press', nameGl: 'Press Declinado', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', icon: 'bench-press' },
  { id: 'dumbbell-flyes', name: 'Aperturas', nameEn: 'Dumbbell Flyes', nameGl: 'Aperturas', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'beginner', icon: 'default' },
  { id: 'dips', name: 'Fondos', nameEn: 'Dips', nameGl: 'Fondos', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'advanced', icon: 'default' },
  { id: 'cable-crossover', name: 'Cruce de Poleas', nameEn: 'Cable Crossover', nameGl: 'Cruce de Poleas', muscleGroup: 'chest', equipment: 'cable', difficulty: 'intermediate', icon: 'default' },
  
  // BACK
  { id: 'pull-ups', name: 'Dominadas', nameEn: 'Pull-ups', nameGl: 'Dominadas', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'advanced', icon: 'pull-up' },
  { id: 'lat-pulldown', name: 'Jalón al Pecho', nameEn: 'Lat Pulldown', nameGl: 'Xalón ao Peito', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', icon: 'lat-pulldown' },
  { id: 'barbell-row', name: 'Remo con Barra', nameEn: 'Barbell Row', nameGl: 'Remo con Barra', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', icon: 'default' },
  { id: 'dumbbell-row', name: 'Remo con Mancuerna', nameEn: 'Dumbbell Row', nameGl: 'Remo con Mancuerna', muscleGroup: 'back', equipment: 'dumbbell', difficulty: 'beginner', icon: 'default' },
  { id: 'deadlift', name: 'Peso Muerto', nameEn: 'Deadlift', nameGl: 'Peso Morto', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced', icon: 'deadlift' },
  { id: 'face-pull', name: 'Face Pull', nameEn: 'Face Pull', nameGl: 'Face Pull', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', icon: 'default' },
  { id: 'cable-row', name: 'Remo en Polea', nameEn: 'Seated Cable Row', nameGl: 'Remo en Polea', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', icon: 'cable-row' },
  
  // SHOULDERS
  { id: 'overhead-press', name: 'Press Militar', nameEn: 'Overhead Press', nameGl: 'Press Militar', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', icon: 'overhead-press' },
  { id: 'lateral-raises', name: 'Elevaciones Laterales', nameEn: 'Lateral Raises', nameGl: 'Elevacións Laterais', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', icon: 'default' },
  { id: 'front-raises', name: 'Elevaciones Frontales', nameEn: 'Front Raises', nameGl: 'Elevacións Frontais', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', icon: 'default' },
  { id: 'reverse-pec-deck', name: 'Pájaros (Máquina)', nameEn: 'Reverse Pec Deck', nameGl: 'Paxaros (Máquina)', muscleGroup: 'shoulders', equipment: 'machine', difficulty: 'beginner', icon: 'default' },
  { id: 'arnold-press', name: 'Press Arnold', nameEn: 'Arnold Press', nameGl: 'Press Arnold', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate', icon: 'overhead-press' },
  { id: 'upright-row', name: 'Remo al Cuello', nameEn: 'Upright Row', nameGl: 'Remo ao Pescozo', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', icon: 'default' },
  
  // BICEPS
  { id: 'barbell-curl', name: 'Curl con Barra', nameEn: 'Barbell Curl', nameGl: 'Curl con Barra', muscleGroup: 'biceps', equipment: 'barbell', difficulty: 'beginner', icon: 'dumbbell-curl' },
  { id: 'hammer-curl', name: 'Curl Martillo', nameEn: 'Hammer Curl', nameGl: 'Curl Martelo', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', icon: 'dumbbell-curl' },
  { id: 'preacher-curl', name: 'Curl Banco Scott', nameEn: 'Preacher Curl', nameGl: 'Curl Banco Scott', muscleGroup: 'biceps', equipment: 'machine', difficulty: 'beginner', icon: 'dumbbell-curl' },
  { id: 'concentration-curl', name: 'Curl Concentrado', nameEn: 'Concentration Curl', nameGl: 'Curl Concentrado', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', icon: 'dumbbell-curl' },
  { id: 'cable-curl', name: 'Curl en Polea', nameEn: 'Cable Curl', nameGl: 'Curl en Polea', muscleGroup: 'biceps', equipment: 'cable', difficulty: 'beginner', icon: 'dumbbell-curl' },
  
  // TRICEPS
  { id: 'triceps-pushdown', name: 'Extensión en Polea', nameEn: 'Triceps Pushdown', nameGl: 'Extensión en Polea', muscleGroup: 'triceps', equipment: 'cable', difficulty: 'beginner', icon: 'default' },
  { id: 'skullcrushers', name: 'Rompecráneos', nameEn: 'Skullcrushers', nameGl: 'Rompacranios', muscleGroup: 'triceps', equipment: 'barbell', difficulty: 'intermediate', icon: 'default' },
  { id: 'triceps-dips', name: 'Fondos de Tríceps', nameEn: 'Triceps Dips', nameGl: 'Fondos de Tríceps', muscleGroup: 'triceps', equipment: 'bodyweight', difficulty: 'advanced', icon: 'default' },
  { id: 'overhead-triceps', name: 'Extensión Tras Nuca', nameEn: 'Overhead Extension', nameGl: 'Extensión Tras Nuca', muscleGroup: 'triceps', equipment: 'dumbbell', difficulty: 'beginner', icon: 'default' },
  { id: 'triceps-kickback', name: 'Patada de Tríceps', nameEn: 'Triceps Kickback', nameGl: 'Patada de Tríceps', muscleGroup: 'triceps', equipment: 'dumbbell', difficulty: 'beginner', icon: 'default' },
  
  // QUADS
  { id: 'squat', name: 'Sentadilla', nameEn: 'Squat', nameGl: 'Sentadilla', muscleGroup: 'quads', equipment: 'barbell', difficulty: 'advanced', icon: 'squat' },
  { id: 'leg-press', name: 'Prensa', nameEn: 'Leg Press', nameGl: 'Prensa', muscleGroup: 'quads', equipment: 'machine', difficulty: 'beginner', icon: 'leg-press' },
  { id: 'leg-extension', name: 'Extensión de Cuádriceps', nameEn: 'Leg Extension', nameGl: 'Extensión de Cuádriceps', muscleGroup: 'quads', equipment: 'machine', difficulty: 'beginner', icon: 'default' },
  { id: 'bulgarian-split-squat', name: 'Sentadilla Búlgara', nameEn: 'Bulgarian Split Squat', nameGl: 'Sentadilla Búlgara', muscleGroup: 'quads', equipment: 'dumbbell', difficulty: 'intermediate', icon: 'default' },
  { id: 'hack-squat', name: 'Hack Squat', nameEn: 'Hack Squat', nameGl: 'Hack Squat', muscleGroup: 'quads', equipment: 'machine', difficulty: 'intermediate', icon: 'default' },
  { id: 'lunges', name: 'Zancadas', nameEn: 'Lunges', nameGl: 'Zancadas', muscleGroup: 'quads', equipment: 'dumbbell', difficulty: 'beginner', icon: 'default' },
  
  // HAMSTRINGS & GLUTES
  { id: 'romanian-deadlift', name: 'Peso Muerto Rumano', nameEn: 'Romanian Deadlift', nameGl: 'Peso Morto Romanés', muscleGroup: 'hamstrings', equipment: 'barbell', difficulty: 'intermediate', icon: 'deadlift' },
  { id: 'leg-curl', name: 'Curl Femoral', nameEn: 'Leg Curl', nameGl: 'Curl Femoral', muscleGroup: 'hamstrings', equipment: 'machine', difficulty: 'beginner', icon: 'default' },
  { id: 'hip-thrust', name: 'Hip Thrust', nameEn: 'Hip Thrust', nameGl: 'Hip Thrust', muscleGroup: 'hamstrings', equipment: 'barbell', difficulty: 'intermediate', icon: 'hip-thrust' },
  { id: 'glute-kickback', name: 'Patada de Glúteo', nameEn: 'Glute Kickback', nameGl: 'Patada de Glúteo', muscleGroup: 'hamstrings', equipment: 'cable', difficulty: 'beginner', icon: 'default' },
  { id: 'sumo-squat', name: 'Sentadilla Sumo', nameEn: 'Sumo Squat', nameGl: 'Sentadilla Sumo', muscleGroup: 'hamstrings', equipment: 'dumbbell', difficulty: 'beginner', icon: 'default' },
  
  // CALVES
  { id: 'standing-calf-raise', name: 'Elevación Gemelos Pie', nameEn: 'Standing Calf Raise', nameGl: 'Elevación Xemelgos Pé', muscleGroup: 'calves', equipment: 'machine', difficulty: 'beginner', icon: 'default' },
  { id: 'seated-calf-raise', name: 'Elevación Gemelos Sentado', nameEn: 'Seated Calf Raise', nameGl: 'Elevación Xemelgos Sentado', muscleGroup: 'calves', equipment: 'machine', difficulty: 'beginner', icon: 'default' },
  
  // ABS
  { id: 'crunch', name: 'Crunch', nameEn: 'Crunch', nameGl: 'Crunch', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', icon: 'default' },
  { id: 'plank', name: 'Plancha', nameEn: 'Plank', nameGl: 'Prancha', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', icon: 'default' },
  { id: 'russian-twist', name: 'Giro Ruso', nameEn: 'Russian Twist', nameGl: 'Xiro Ruso', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'intermediate', icon: 'default' },
  { id: 'leg-raises', name: 'Elevación de Piernas', nameEn: 'Leg Raises', nameGl: 'Elevación de Pernas', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'intermediate', icon: 'default' },
  { id: 'ab-wheel', name: 'Rueda Abdominal', nameEn: 'Ab Wheel', nameGl: 'Roda Abdominal', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'advanced', icon: 'default' },
  
  // CARDIO
  { id: 'treadmill', name: 'Cinta de Correr', nameEn: 'Treadmill', nameGl: 'Cinta de Correr', muscleGroup: 'cardio', equipment: 'cardio_machine', difficulty: 'beginner', icon: 'running' },
  { id: 'stationary-bike', name: 'Bicicleta Estática', nameEn: 'Stationary Bike', nameGl: 'Bicicleta Estática', muscleGroup: 'cardio', equipment: 'cardio_machine', difficulty: 'beginner', icon: 'default' },
  { id: 'rowing-machine', name: 'Remo Ergómetro', nameEn: 'Rowing Machine', nameGl: 'Remo Ergómetro', muscleGroup: 'cardio', equipment: 'cardio_machine', difficulty: 'intermediate', icon: 'default' },
  { id: 'elliptical', name: 'Elíptica', nameEn: 'Elliptical', nameGl: 'Elíptica', muscleGroup: 'cardio', equipment: 'cardio_machine', difficulty: 'beginner', icon: 'default' },
  { id: 'stair-climber', name: 'Escaleras', nameEn: 'Stair Climber', nameGl: 'Escaleiras', muscleGroup: 'cardio', equipment: 'cardio_machine', difficulty: 'intermediate', icon: 'default' }
];

export function getExercisesByMuscle(muscle: MuscleGroup) {
  return EXERCISE_CATALOG.filter(e => e.muscleGroup === muscle);
}

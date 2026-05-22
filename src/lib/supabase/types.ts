export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string | null;
          weight: number | null;
          height: number | null;
          age: number | null;
          goal: 'muscle' | 'fat_loss' | 'maintain' | null;
          activity_level:
            | 'sedentary'
            | 'light'
            | 'moderate'
            | 'active'
            | 'very_active'
            | null;
          tdee: number | null;
          macro_calories: number | null;
          macro_protein: number | null;
          macro_carbs: number | null;
          macro_fat: number | null;
          onboarded: boolean;
          theme: 'dark' | 'light';
          language: 'es' | 'gl' | 'en';
          avatar_url: string | null;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          name: string;
          routine_id: string | null;
          volume: number;
          duration: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['workouts']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['workouts']['Row']>;
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          exercise_name: string;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['workout_exercises']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<
          Database['public']['Tables']['workout_exercises']['Row']
        >;
      };
      workout_sets: {
        Row: {
          id: string;
          workout_exercise_id: string;
          set_number: number;
          weight: number | null;
          reps: number | null;
          done: boolean;
          rest_seconds: number | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['workout_sets']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['workout_sets']['Row']>;
      };
      exercise_progress: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          xp: number;
          best_weight: number | null;
          best_reps: number | null;
          total_sessions: number;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['exercise_progress']['Row'],
          'id'
        >;
        Update: Partial<
          Database['public']['Tables']['exercise_progress']['Row']
        >;
      };
      nutrition_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
          food_name: string;
          brand: string | null;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          grams: number;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['nutrition_entries']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<
          Database['public']['Tables']['nutrition_entries']['Row']
        >;
      };
      weight_log: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          weight: number;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['weight_log']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['weight_log']['Row']>;
      };
      shopping_list: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string | null;
          quantity: string | null;
          checked: boolean;
          calories_estimate: number | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['shopping_list']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['shopping_list']['Row']>;
      };
      weekly_menu: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          day_of_week: number;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
          food_name: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          grams: number;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['weekly_menu']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['weekly_menu']['Row']>;
      };
      routines: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          day_tag: string | null;
          exercise_ids: string[];
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['routines']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['routines']['Row']>;
      };
    };
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Workout = Database['public']['Tables']['workouts']['Row'];
export type WorkoutExercise =
  Database['public']['Tables']['workout_exercises']['Row'];
export type WorkoutSet = Database['public']['Tables']['workout_sets']['Row'];
export type ExerciseProgress =
  Database['public']['Tables']['exercise_progress']['Row'];
export type NutritionEntry =
  Database['public']['Tables']['nutrition_entries']['Row'];
export type WeightLog = Database['public']['Tables']['weight_log']['Row'];
export type ShoppingItem = Database['public']['Tables']['shopping_list']['Row'];
export type WeeklyMenuItem = Database['public']['Tables']['weekly_menu']['Row'];
export type Routine = Database['public']['Tables']['routines']['Row'];

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type WorkoutInsert = Database['public']['Tables']['workouts']['Insert'];
export type WorkoutExerciseInsert =
  Database['public']['Tables']['workout_exercises']['Insert'];
export type WorkoutSetInsert =
  Database['public']['Tables']['workout_sets']['Insert'];
export type ExerciseProgressInsert =
  Database['public']['Tables']['exercise_progress']['Insert'];
export type NutritionEntryInsert =
  Database['public']['Tables']['nutrition_entries']['Insert'];
export type WeightLogInsert =
  Database['public']['Tables']['weight_log']['Insert'];
export type ShoppingItemInsert =
  Database['public']['Tables']['shopping_list']['Insert'];
export type WeeklyMenuItemInsert =
  Database['public']['Tables']['weekly_menu']['Insert'];
export type RoutineInsert = Database['public']['Tables']['routines']['Insert'];

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type WorkoutUpdate = Database['public']['Tables']['workouts']['Update'];
export type WorkoutExerciseUpdate =
  Database['public']['Tables']['workout_exercises']['Update'];
export type WorkoutSetUpdate =
  Database['public']['Tables']['workout_sets']['Update'];
export type NutritionEntryUpdate =
  Database['public']['Tables']['nutrition_entries']['Update'];
export type WeightLogUpdate =
  Database['public']['Tables']['weight_log']['Update'];
export type ShoppingItemUpdate =
  Database['public']['Tables']['shopping_list']['Update'];
export type WeeklyMenuItemUpdate =
  Database['public']['Tables']['weekly_menu']['Update'];
export type RoutineUpdate = Database['public']['Tables']['routines']['Update'];

// Domain-specific types
export type GoalType = NonNullable<Profile['goal']>;
export type ActivityLevel = NonNullable<Profile['activity_level']>;
export type MealType = NutritionEntry['meal_type'];
export type Theme = Profile['theme'];
export type Language = Profile['language'];

'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Play, Square, Timer, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface WorkoutSet {
  id: string;
  reps: string;
  weight: string;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

interface ActiveWorkoutProps {
  isOpen: boolean;
  onClose: () => void;
  routineId?: string | null;
  routineName?: string;
}

export default function ActiveWorkout({ isOpen, onClose, routineId, routineName }: ActiveWorkoutProps) {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  
  const supabase = createClient();
  const router = useRouter();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, startTime]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
      setElapsedTime(0);
      setExercises([]);
      // If we had a predefined routine, we would load its exercises here.
      // Since we start empty, we just leave it empty.
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const addExercise = () => {
    if (!newExerciseName.trim()) return;
    
    setExercises([
      ...exercises, 
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newExerciseName,
        sets: [
          { id: Math.random().toString(36).substr(2, 9), reps: '', weight: '', completed: false }
        ]
      }
    ]);
    setNewExerciseName('');
    setShowAddExercise(false);
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        // Copy values from previous set if exists
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { 
            id: Math.random().toString(36).substr(2, 9), 
            reps: lastSet ? lastSet.reps : '', 
            weight: lastSet ? lastSet.weight : '', 
            completed: false 
          }]
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
        };
      }
      return ex;
    }));
  };

  const finishWorkout = async () => {
    // Check if at least one set is completed
    const hasCompletedSets = exercises.some(ex => ex.sets.some(s => s.completed));
    if (!hasCompletedSets) {
      if (confirm('No has completado ninguna serie. ¿Quieres cancelar el entrenamiento?')) {
        onClose();
      }
      return;
    }

    setIsSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No user');

      // 1. Create Workout Log
      const { data: workoutLog, error: logError } = await supabase.from('workout_logs').insert({
        user_id: userData.user.id,
        duration_minutes: Math.floor(elapsedTime / 60),
        routine_id: routineId || null,
        date: new Date().toISOString().split('T')[0]
      } as any).select().single();

      if (logError) throw logError;

      const logData = workoutLog as any;

      // 2. Insert Sets
      const setsToInsert: any[] = [];
      exercises.forEach(ex => {
        ex.sets.forEach((set, index) => {
          if (set.completed && set.reps && set.weight) {
            setsToInsert.push({
              workout_log_id: logData.id,
              user_id: userData.user.id,
              exercise_name: ex.name,
              set_number: index + 1,
              reps: parseInt(set.reps),
              weight_kg: parseFloat(set.weight)
            });
          }
        });
      });

      if (setsToInsert.length > 0) {
        const { error: setsError } = await supabase.from('workout_sets').insert(setsToInsert as any);
        if (setsError) throw setsError;
      }

      onClose();
      router.refresh(); // Refresh parent to show new history
    } catch (err) {
      console.error('Error saving workout', err);
      alert('Hubo un error al guardar el entrenamiento.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-base)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {formatTime(elapsedTime)}
          </span>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
            {routineName || 'Entrenamiento Libre'}
          </h2>
        </div>
        <button 
          onClick={finishWorkout}
          disabled={isSaving}
          style={{ background: 'var(--fire-1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}
        >
          {isSaving ? 'Guardando...' : 'Finalizar'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '100px' }}>
        
        {exercises.map((ex, exIndex) => (
          <div key={ex.id} style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--blue-1)' }}>{ex.name}</h3>
            </div>
            
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 50px', padding: '8px 16px', borderBottom: '1px solid var(--border)', color: 'var(--text-3)', fontSize: '12px', fontWeight: 600 }}>
              <div style={{ textAlign: 'center' }}>SET</div>
              <div style={{ textAlign: 'center' }}>KG</div>
              <div style={{ textAlign: 'center' }}>REPS</div>
              <div style={{ textAlign: 'center' }}><Check size={14} style={{ margin: '0 auto' }} /></div>
            </div>

            {/* Sets Rows */}
            {ex.sets.map((set, setIndex) => (
              <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 50px', padding: '8px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: set.completed ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-2)' }}>
                  {setIndex + 1}
                </div>
                <div style={{ padding: '0 8px' }}>
                  <input 
                    type="number" 
                    value={set.weight}
                    onChange={(e) => updateSet(ex.id, set.id, 'weight', e.target.value)}
                    disabled={set.completed}
                    placeholder="-"
                    style={{ width: '100%', background: 'var(--bg-surface)', border: 'none', borderRadius: '8px', padding: '10px 0', textAlign: 'center', color: 'var(--text-1)', fontSize: '16px', fontWeight: 600 }}
                  />
                </div>
                <div style={{ padding: '0 8px' }}>
                  <input 
                    type="number" 
                    value={set.reps}
                    onChange={(e) => updateSet(ex.id, set.id, 'reps', e.target.value)}
                    disabled={set.completed}
                    placeholder="-"
                    style={{ width: '100%', background: 'var(--bg-surface)', border: 'none', borderRadius: '8px', padding: '10px 0', textAlign: 'center', color: 'var(--text-1)', fontSize: '16px', fontWeight: 600 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={() => toggleSetComplete(ex.id, set.id)}
                    style={{ 
                      width: '32px', height: '32px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: set.completed ? 'var(--blue-1)' : 'var(--bg-surface)',
                      color: set.completed ? 'white' : 'var(--text-3)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Check size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div style={{ padding: '12px' }}>
              <button 
                onClick={() => addSet(ex.id)}
                style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px dashed var(--border)', borderRadius: '8px', color: 'var(--text-2)', fontSize: '14px', fontWeight: 600 }}
              >
                + Añadir Serie
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setShowAddExercise(true)}
          style={{ width: '100%', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--blue-1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Plus size={20} /> Añadir Ejercicio
        </button>

      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1001, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'var(--bg-card)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Elegir Ejercicio</h3>
              <button onClick={() => setShowAddExercise(false)} style={{ background: 'none', border: 'none', color: 'var(--text-2)' }}><X size={24}/></button>
            </div>
            
            <input 
              type="text" 
              placeholder="Ej: Press de Banca, Sentadilla..." 
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              className="input-field"
              style={{ marginBottom: '16px' }}
              autoFocus
            />

            <button 
              onClick={addExercise}
              className="btn-primary" 
              style={{ width: '100%', padding: '16px' }}
              disabled={!newExerciseName.trim()}
            >
              Añadir
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

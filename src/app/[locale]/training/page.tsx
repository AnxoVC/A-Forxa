'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Plus, Dumbbell, Clock, History, MoreVertical } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ActiveWorkout from '@/components/training/ActiveWorkout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TrainingPage() {
  const t = useTranslations('training');
  const [routines, setRoutines] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Workout State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);
  const [activeRoutineName, setActiveRoutineName] = useState<string>('');

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // 1. Fetch Routines
      const { data: userRoutines } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (userRoutines) setRoutines(userRoutines);

      // 2. Fetch History (Workout Logs)
      const { data: userHistory } = await supabase
        .from('workout_logs')
        .select('*, routines(name)')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (userHistory) setHistory(userHistory);

    } catch (error) {
      console.error('Error fetching training data', error);
    } finally {
      setLoading(false);
    }
  };

  const startEmptyWorkout = () => {
    setActiveRoutineId(null);
    setActiveRoutineName('');
    setIsWorkoutActive(true);
  };

  const startRoutine = (routine: any) => {
    setActiveRoutineId(routine.id);
    setActiveRoutineName(routine.name);
    setIsWorkoutActive(true);
  };

  const createRoutine = async () => {
    const name = prompt('Nombre de la nueva rutina:');
    if (!name) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase.from('routines').insert({
        user_id: userData.user.id,
        name
      } as any).select().single();

      if (error) throw error;
      setRoutines([data, ...routines]);
    } catch (error) {
      console.error('Error creating routine', error);
      alert('Error al crear la rutina');
    }
  };

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Dumbbell size={28} className="text-fire" />
          {t('title')}
        </h1>
      </div>

      {/* Hero Action */}
      <div 
        onClick={startEmptyWorkout}
        style={{ 
          background: 'var(--fire-grad)', 
          borderRadius: '24px', 
          padding: '40px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '16px',
          cursor: 'pointer',
          boxShadow: 'var(--fire-glow)',
          transition: 'transform 0.2s',
          color: 'white'
        }}
        className="hover:-translate-y-1"
      >
        <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Play size={32} fill="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{t('start_session')}</h2>
      </div>

      {/* Routines List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{t('routines')}</h2>
          <button onClick={createRoutine} style={{ background: 'none', border: 'none', color: 'var(--blue-1)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <Plus size={18} /> Nueva
          </button>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: '20px' }}>Cargando...</div>
        ) : routines.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-3)' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>{t('no_routines')}</p>
            <button onClick={createRoutine} className="btn-secondary" style={{ padding: '8px 16px' }}>
              {t('create_first_routine')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {routines.map(routine => (
              <div key={routine.id} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{routine.name}</div>
                <button 
                  onClick={() => startRoutine(routine)}
                  style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--blue-1)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Play size={14} fill="currentColor" /> Iniciar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={20} className="text-fire" /> Historial
        </h2>
        
        {loading ? (
          <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: '20px' }}>Cargando...</div>
        ) : history.length === 0 ? (
          <div style={{ color: 'var(--text-3)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            Aún no has registrado ningún entrenamiento.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map(log => (
              <div key={log.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--bg-surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
                  <Dumbbell size={24} />
                </div>
                <div style={{ flex: 1, borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                    {log.routines?.name || 'Entrenamiento Libre'}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-3)', fontSize: '12px' }}>
                    <span>{format(new Date(log.date), "d 'de' MMMM", { locale: es })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> {log.duration_minutes || 0} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The full-screen workout modal */}
      <ActiveWorkout 
        isOpen={isWorkoutActive} 
        onClose={() => {
          setIsWorkoutActive(false);
          fetchData(); // Refresh history when closed
        }} 
        routineId={activeRoutineId}
        routineName={activeRoutineName}
      />

    </div>
  );
}

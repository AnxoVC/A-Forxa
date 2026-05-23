'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Activity, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Plus, Dumbbell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressPage() {
  const t = useTranslations('progress');
  const [weightLogs, setWeightLogs] = useState<any[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: wLogs } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('date', { ascending: false });

      if (wLogs) setWeightLogs(wLogs);

      const { data: woLogs } = await supabase
        .from('workout_logs')
        .select('*, workout_sets(weight, reps)')
        .eq('user_id', userData.user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (woLogs) setWorkoutLogs(woLogs);

    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWeightLog = async () => {
    if (!newWeight) return;
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { error } = await supabase.from('progress_logs').insert({
        user_id: userData.user.id,
        weight_kg: parseFloat(newWeight),
        date: new Date().toISOString().split('T')[0]
      } as any);

      if (error) throw error;
      
      setNewWeight('');
      setShowAddWeight(false);
      fetchProgress();
    } catch (error) {
      console.error('Error adding weight:', error);
      alert('Error al guardar el peso.');
    }
  };

  const getWeightDifference = () => {
    if (weightLogs.length < 2) return null;
    const latest = weightLogs[0].weight_kg;
    const previous = weightLogs[1].weight_kg;
    const diff = latest - previous;
    return {
      value: Math.abs(diff).toFixed(1),
      isDown: diff < 0
    };
  };

  const diff = getWeightDifference();

  const chartData = [...weightLogs].reverse().map(log => ({
    date: format(new Date(log.date), 'MMM d'),
    weight: log.weight_kg
  }));

  // Calculate Total Volume Lifted in last 30 days
  const totalVolume = workoutLogs.reduce((acc, workout) => {
    const workoutVol = workout.workout_sets?.reduce((sum: number, set: any) => sum + ((set.weight || 0) * (set.reps || 0)), 0) || 0;
    return acc + workoutVol;
  }, 0);

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TrendingUp size={28} className="text-fire" />
          {t('title') || 'Progreso'}
        </h1>
        <button onClick={() => setShowAddWeight(true)} style={{ background: 'var(--fire-1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={16} /> Añadir Peso
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Main Metric Card */}
        <div style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.05) 100%)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '14px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Peso Actual
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>
                {weightLogs.length > 0 ? weightLogs[0].weight_kg : '0.0'}
              </span>
              <span style={{ fontSize: '20px', color: 'var(--text-3)', fontWeight: 600 }}>kg</span>
            </div>

            {diff && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: diff.isDown ? '#10B981' : 'var(--fire-2)', fontSize: '14px', fontWeight: 600, background: diff.isDown ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '20px', width: 'fit-content' }}>
                {diff.isDown ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                {diff.value} kg desde la última vez
              </div>
            )}
          </div>
          <Activity size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', color: 'var(--blue-1)', opacity: 0.1, transform: 'rotate(-15deg)' }} />
        </div>

        {/* Volume Card */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dumbbell size={16} className="text-fire" /> Volumen (Últimos 30 días)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>
              {totalVolume.toLocaleString()}
            </span>
            <span style={{ fontSize: '16px', color: 'var(--text-3)', fontWeight: 600 }}>kg</span>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-3)' }}>En {workoutLogs.length} entrenamientos</p>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 24px 0', fontWeight: 600 }}>Evolución del Peso</h2>
        {chartData.length > 1 ? (
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--blue-1)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--blue-1)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--text-3)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--blue-1)', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="weight" stroke="var(--blue-1)" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', border: '1px dashed var(--border)', borderRadius: '16px' }}>
            Añade al menos 2 pesajes para ver el gráfico
          </div>
        )}
      </div>

      {/* History List */}
      <div>
        <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} className="text-fire" /> Historial de Pesajes
        </h2>
        
        {loading ? (
          <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: '20px' }}>Cargando...</div>
        ) : weightLogs.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '32px 24px', borderRadius: '16px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-3)' }}>
            <Activity size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '14px' }}>Aún no has registrado tu peso.</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.7 }}>Añade tu primer pesaje para empezar a seguir tu evolución.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weightLogs.map(log => (
              <div key={log.id} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--blue-1)' }} />
                  <div style={{ color: 'var(--text-2)', fontSize: '14px', fontWeight: 500 }}>
                    {format(new Date(log.date), "d 'de' MMMM, yyyy", { locale: es })}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-1)' }}>
                  {log.weight_kg} kg
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Weight Modal */}
      {showAddWeight && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-card)', borderRadius: '24px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', textAlign: 'center' }}>Nuevo Pesaje</h3>
            
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <input 
                type="number" 
                step="0.1"
                placeholder="75.5" 
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                style={{ width: '100%', padding: '20px', fontSize: '32px', fontWeight: 800, textAlign: 'center', background: 'var(--bg-surface)', border: '2px solid var(--border)', borderRadius: '16px', color: 'var(--text-1)' }}
                autoFocus
              />
              <span style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', fontWeight: 600, color: 'var(--text-3)' }}>kg</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowAddWeight(false)} style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-2)', fontWeight: 600 }}>
                Cancelar
              </button>
              <button onClick={addWeightLog} disabled={!newWeight} style={{ flex: 1, padding: '16px', background: 'var(--fire-1)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 600 }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

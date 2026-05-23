'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { User, Save, LogOut, Activity, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    target_calories: 0,
    target_protein: 0,
    weight: 0,
    height: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        const profileData = data as any;
        setProfile({
          name: profileData.name || '',
          target_calories: profileData.target_calories || 0,
          target_protein: profileData.target_protein || 0,
          weight: profileData.weight || 0,
          height: profileData.height || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const queryBuilder = supabase.from('profiles') as any;
      const { error } = await queryBuilder
        .update({
          name: profile.name,
          target_calories: profile.target_calories,
          target_protein: profile.target_protein,
          weight: profile.weight,
          height: profile.height,
        })
        .eq('id', user.id);

      if (error) throw error;
      alert(t('changes_saved') || '¡Cambios guardados!');
      
      // Also insert a progress log if weight was changed
      if (profile.weight > 0) {
        const today = new Date().toISOString().split('T')[0];
        
        // Check if there is already a log for today
        const { data: existingLog } = await supabase
          .from('progress_logs')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        if (existingLog) {
          const pb = supabase.from('progress_logs') as any;
          await pb.update({ weight_kg: profile.weight }).eq('id', (existingLog as any).id);
        } else {
          const pb = supabase.from('progress_logs') as any;
          await pb.insert({
            user_id: user.id,
            date: today,
            weight_kg: profile.weight
          });
        }
      }

      router.refresh();
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)' }}>Cargando...</div>;

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <User size={28} className="text-fire" />
          {t('title') || 'Mi Perfil'}
        </h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ background: 'var(--fire-1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          <Save size={16} /> {saving ? 'Guardando...' : (t('save_changes') || 'Guardar')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* Personal Info */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} className="text-fire" /> Información Personal
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 600 }}>Nombre</label>
            <input 
              type="text" 
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-1)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 600 }}>Peso (kg)</label>
              <input 
                type="number" 
                name="weight"
                value={profile.weight || ''}
                onChange={handleChange}
                placeholder="75"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-1)' }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 600 }}>Altura (cm)</label>
              <input 
                type="number" 
                name="height"
                value={profile.height || ''}
                onChange={handleChange}
                placeholder="175"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-1)' }}
              />
            </div>
          </div>
        </div>

        {/* Nutritional Goals */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} className="text-fire" /> Metas Nutricionales
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 600 }}>Calorías Diarias (kcal)</label>
            <input 
              type="number" 
              name="target_calories"
              value={profile.target_calories || ''}
              onChange={handleChange}
              placeholder="Ej: 2500"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-1)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 600 }}>Proteína Diaria (g)</label>
            <input 
              type="number" 
              name="target_protein"
              value={profile.target_protein || ''}
              onChange={handleChange}
              placeholder="Ej: 150"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-1)' }}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop: '16px' }}>
          <button 
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(220, 38, 38, 0.1)', color: 'var(--fire-2)', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(220, 38, 38, 0.2)', width: '100%', justifyContent: 'center', transition: 'background 0.2s', cursor: 'pointer' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  );
}

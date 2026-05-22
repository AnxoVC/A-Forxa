'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { User, Settings, LogOut, Bell, Shield, Smartphone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const t = useTranslations('nav');
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh(); // This will trigger the middleware and redirect to /auth
  };

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <User size={28} className="text-fire" />
          Mi Perfil
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Profile Card */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: '2px solid var(--fire-1)' }}>
            🔥
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Forjador</h2>
            <p style={{ margin: 0, color: 'var(--text-2)', fontSize: '14px' }}>Plan Gratuito • Nivel 1</p>
          </div>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Editar
          </button>
        </div>

        {/* Settings List */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} className="hover:bg-white/5">
            <Settings size={20} className="text-fire" />
            <span style={{ fontWeight: 500 }}>Ajustes de la Cuenta</span>
          </div>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} className="hover:bg-white/5">
            <Bell size={20} style={{ color: 'var(--blue-1)' }} />
            <span style={{ fontWeight: 500 }}>Notificaciones</span>
          </div>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} className="hover:bg-white/5">
            <Shield size={20} style={{ color: 'var(--green-1)' }} />
            <span style={{ fontWeight: 500 }}>Privacidad y Seguridad</span>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} className="hover:bg-white/5">
            <Smartphone size={20} className="text-fire" />
            <span style={{ fontWeight: 500 }}>Dispositivos Conectados</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop: '16px' }}>
          <button 
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(220, 38, 38, 0.1)', color: 'var(--fire-2)', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(220, 38, 38, 0.2)', width: '100%', justifyContent: 'center', transition: 'background 0.2s' }}
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

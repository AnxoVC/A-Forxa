'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { LineChart, Activity, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ProgressPage() {
  const t = useTranslations('nav');
  
  const stats = [
    { label: 'Peso Actual', value: '78.5 kg', trend: '-1.2 kg', positive: true },
    { label: 'Grasa Corporal', value: '15.2 %', trend: '-0.5 %', positive: true },
    { label: 'Entrenamientos', value: '12', trend: '+3', positive: true, subtitle: 'este mes' },
    { label: 'Calorías Medias', value: '2,450', trend: 'Mantenimiento', positive: null }
  ];

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LineChart size={28} className="text-fire" />
          Mi Progreso
        </h1>
        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
          <Calendar size={16} /> Este Mes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: stat.positive === true ? 'var(--green-1)' : stat.positive === false ? 'var(--fire-2)' : 'var(--text-3)' }}>
              {stat.positive === true && <ArrowDownRight size={16} />}
              {stat.positive === false && <ArrowUpRight size={16} />}
              <span style={{ fontWeight: 600 }}>{stat.trend}</span>
              {stat.subtitle && <span style={{ color: 'var(--text-3)', marginLeft: '4px' }}>{stat.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
        <Activity size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
        <p style={{ fontSize: '16px', fontWeight: 500 }}>Gráficos en construcción</p>
        <p style={{ fontSize: '14px', textAlign: 'center', maxWidth: '400px', marginTop: '8px' }}>
          Aquí conectaremos los datos de tus entrenamientos y nutrición para mostrarte tu evolución a lo largo del tiempo.
        </p>
      </div>
    </div>
  );
}

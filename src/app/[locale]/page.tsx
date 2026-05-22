import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Flame, Activity, Target, Plus, Utensils, Dumbbell, Barcode } from 'lucide-react';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: `A Forxa | ${t('dashboard')}` };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // In a real app, fetch this from Supabase profiles/nutrition_entries
  const macros = {
    calories: { current: 1850, target: 2500 },
    protein: { current: 120, target: 160, color: 'var(--blue-1)' },
    carbs: { current: 200, target: 300, color: 'var(--fire-1)' },
    fat: { current: 63, target: 70, color: 'var(--green-1)' }
  };

  const streak = [
    { day: 'L', active: true },
    { day: 'M', active: true },
    { day: 'X', active: true },
    { day: 'J', active: false },
    { day: 'V', active: false },
    { day: 'S', active: false },
    { day: 'D', active: false },
  ];

  const date = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  // A helper component for the circular progress (Donut)
  const CalorieDonut = () => {
    const size = 200;
    const strokeWidth = 16;
    const center = size / 2;
    const radius = center - strokeWidth;
    const dashArray = 2 * Math.PI * radius;
    const percentage = Math.min(macros.calories.current / macros.calories.target, 1);
    const dashOffset = dashArray * (1 - percentage);

    return (
      <div className={styles.macroRingContainer}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle 
            cx={center} cy={center} r={radius} 
            fill="none" stroke="var(--bg-card)" strokeWidth={strokeWidth} 
          />
          <circle 
            cx={center} cy={center} r={radius} 
            fill="none" stroke="url(#fireGradient)" strokeWidth={strokeWidth}
            strokeDasharray={dashArray} strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s var(--ease-spring)' }}
          />
          <defs>
            <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--fire-1)" />
              <stop offset="100%" stopColor="var(--fire-2)" />
            </linearGradient>
          </defs>
        </svg>
        <div className={styles.macroInfo}>
          <div className={styles.value}>{macros.calories.target - macros.calories.current}</div>
          <div className={styles.label}>kcal restantes</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.greeting}>
        <div>
          <h1>¡Hola, {user?.email?.split('@')[0] || 'Forjador'}!</h1>
          <p>{date.charAt(0).toUpperCase() + date.slice(1)}</p>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Flame className="text-fire" />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <Target size={20} className="text-fire" />
            <span>Nutrición Hoy</span>
          </div>
          
          <CalorieDonut />

          <div className={styles.macroBars}>
            {['protein', 'carbs', 'fat'].map((macro) => {
              const data = macros[macro as keyof Omit<typeof macros, 'calories'>];
              const percent = Math.min((data.current / data.target) * 100, 100);
              const labelMap = { protein: 'Proteínas', carbs: 'Carbohidratos', fat: 'Grasas' };
              
              return (
                <div key={macro} className={styles.macroBar}>
                  <div className={styles.macroHeader}>
                    <span>{labelMap[macro as keyof typeof labelMap]}</span>
                    <span>{data.current} / {data.target}g</span>
                  </div>
                  <div className={styles.macroTrack}>
                    <div 
                      className={styles.macroFill} 
                      style={{ width: `${percent}%`, background: data.color }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Activity size={20} className="text-fire" />
              <span>Racha de Entrenamientos</span>
            </div>
            <div className={styles.streakDays}>
              {streak.map((d, i) => (
                <div key={i} className={styles.streakDay}>
                  <span className={styles.dayLabel}>{d.day}</span>
                  <div className={`${styles.dayDot} ${d.active ? styles.active : ''}`}>
                    {d.active ? <Flame size={16} /> : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.quickActions}>
            <button className={styles.actionBtn}>
              <Dumbbell size={24} className="text-fire" />
              <span>Entrenar</span>
            </button>
            <button className={styles.actionBtn}>
              <Utensils size={24} style={{ color: 'var(--blue-1)' }} />
              <span>Comida</span>
            </button>
            <button className={styles.actionBtn}>
              <Barcode size={24} style={{ color: 'var(--green-1)' }} />
              <span>Escanear</span>
            </button>
            <button className={styles.actionBtn}>
              <Plus size={24} />
              <span>Peso</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const profileData = profile as any;
  const targetCalories = profileData?.target_calories || 0;
  const targetProtein = profileData?.target_protein || 0;

  // 2. Fetch Today's Nutrition Logs
  const today = new Date().toISOString().split('T')[0];
  const { data: nutritionLogs } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today);

  const currentCalories = nutritionLogs?.reduce((acc: number, log: any) => acc + (log.calories || 0), 0) || 0;
  const currentProtein = nutritionLogs?.reduce((acc: number, log: any) => acc + (log.protein || 0), 0) || 0;
  const currentCarbs = nutritionLogs?.reduce((acc: number, log: any) => acc + (log.carbs || 0), 0) || 0;
  const currentFat = nutritionLogs?.reduce((acc: number, log: any) => acc + (log.fat || 0), 0) || 0;

  const macros = {
    calories: { current: currentCalories, target: targetCalories },
    protein: { current: currentProtein, target: targetProtein, color: 'var(--blue-1)' },
    carbs: { current: currentCarbs, target: 0, color: 'var(--fire-1)' }, // Target not defined in DB yet, leave 0
    fat: { current: currentFat, target: 0, color: 'var(--green-1)' }
  };

  // 3. Fetch Workout Streak (Last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const { data: workoutLogs } = await supabase
    .from('workout_logs')
    .select('date')
    .eq('user_id', user.id)
    .in('date', last7Days);

  const activeDates = new Set(workoutLogs?.map((l: any) => l.date) || []);
  
  const streak = last7Days.map(dateStr => {
    const d = new Date(dateStr);
    const dayName = d.toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'gl' ? 'gl-ES' : 'es-ES', { weekday: 'short' }).charAt(0).toUpperCase();
    return { day: dayName, active: activeDates.has(dateStr) };
  });

  const date = new Date().toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'gl' ? 'gl-ES' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  // A helper component for the circular progress (Donut)
  const CalorieDonut = () => {
    const size = 200;
    const strokeWidth = 16;
    const center = size / 2;
    const radius = center - strokeWidth;
    const dashArray = 2 * Math.PI * radius;
    const percentage = macros.calories.target > 0 ? Math.min(macros.calories.current / macros.calories.target, 1) : 0;
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
          <div className={styles.value}>{Math.max(macros.calories.target - macros.calories.current, 0)}</div>
          <div className={styles.label}>{t('calories_remaining')}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.greeting}>
        <div>
          <h1>{t('greeting_default', { name: profileData?.name || user?.email?.split('@')[0] || 'Forjador' })}</h1>
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
            <span>{t('macros_today')}</span>
          </div>
          
          <CalorieDonut />

          <div className={styles.macroBars}>
            {['protein', 'carbs', 'fat'].map((macro) => {
              const data = macros[macro as keyof Omit<typeof macros, 'calories'>];
              const percent = data.target > 0 ? Math.min((data.current / data.target) * 100, 100) : 0;
              const labelMap = { protein: t('protein'), carbs: t('carbs'), fat: t('fat') };
              
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
              <span>{t('streak')}</span>
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

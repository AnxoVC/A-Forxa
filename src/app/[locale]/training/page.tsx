'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Play } from 'lucide-react';
import styles from './page.module.css';
import { EXERCISE_CATALOG, MUSCLE_GROUPS, getLevelForXP } from '@/lib/exercises/catalog';
import { ExerciseIcon } from '@/lib/exercises/icons';

export default function TrainingPage() {
  const t = useTranslations('training');
  const [activeTab, setActiveTab] = useState<'routines' | 'exercises' | 'session'>('routines');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredExercises = EXERCISE_CATALOG.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || ex.muscleGroup === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const routines = [
    { id: '1', name: 'Día de Empuje', tag: 'PUSH', muscles: ['chest', 'shoulders', 'triceps'], count: 6 },
    { id: '2', name: 'Día de Tirón', tag: 'PULL', muscles: ['back', 'biceps'], count: 5 },
    { id: '3', name: 'Día de Pierna', tag: 'LEGS', muscles: ['quads', 'hamstrings', 'calves'], count: 6 }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('title') || 'Entrenamiento'}</h1>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'routines' ? styles.active : ''}`}
          onClick={() => setActiveTab('routines')}
        >
          {t('routines') || 'Rutinas'}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'exercises' ? styles.active : ''}`}
          onClick={() => setActiveTab('exercises')}
        >
          {t('exercises') || 'Ejercicios'}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'session' ? styles.active : ''}`}
          onClick={() => setActiveTab('session')}
        >
          {t('session') || 'Sesión'}
        </button>
      </div>

      {activeTab === 'routines' && (
        <div className={styles.routinesGrid}>
          {routines.map(routine => (
            <div key={routine.id} className={styles.routineCard}>
              <div className={styles.routineHeader}>
                <h3 className={styles.routineTitle}>{routine.name}</h3>
                <span className={styles.routineTag}>{routine.tag}</span>
              </div>
              <div className={styles.routineMuscles}>
                {routine.muscles.map(m => {
                  const muscle = MUSCLE_GROUPS.find(mg => mg.id === m);
                  return muscle ? (
                    <div 
                      key={m} 
                      className={styles.muscleBadge} 
                      style={{ background: muscle.color }} 
                      title={muscle.label}
                    />
                  ) : null;
                })}
              </div>
              <div className={styles.routineFooter}>
                <span className={styles.exerciseCount}>{routine.count} {t('exercises_count') || 'ejercicios'}</span>
                <button className={styles.startBtn}>
                  <Play size={16} fill="white" />
                  {t('start') || 'Iniciar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'exercises' && (
        <div>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder={t('search_exercises') || 'Buscar ejercicio...'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            <button 
              className={`${styles.filterChip} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              {t('all') || 'Todos'}
            </button>
            {MUSCLE_GROUPS.map(mg => (
              <button 
                key={mg.id}
                className={`${styles.filterChip} ${activeFilter === mg.id ? styles.active : ''}`}
                onClick={() => setActiveFilter(mg.id)}
              >
                {mg.label}
              </button>
            ))}
          </div>

          <div className={styles.exerciseGrid}>
            {filteredExercises.map(ex => {
              // Mock XP data for now
              const mockXp = Math.floor(Math.random() * 400);
              const level = getLevelForXP(mockXp);
              const nextLevel = getLevelForXP(mockXp + 500); // just to get next threshold
              const progress = Math.min((mockXp - level.minXp) / (nextLevel.minXp - level.minXp || 1) * 100, 100);

              const muscleGroup = MUSCLE_GROUPS.find(mg => mg.id === ex.muscleGroup);

              return (
                <div key={ex.id} className={styles.exerciseCard}>
                  <div className={styles.exerciseIcon} style={{ background: muscleGroup?.color || 'var(--bg-card)' }}>
                    <ExerciseIcon exerciseId={ex.icon} size={28} />
                  </div>
                  <div className={styles.exerciseInfo}>
                    <div className={styles.exerciseName}>{ex.name}</div>
                    <div className={styles.exerciseMeta}>
                      <span>{muscleGroup?.label}</span>
                      <div className={styles.levelBadge} style={{ color: level.color }}>
                        {level.emoji} {level.name}
                      </div>
                    </div>
                    <div className={styles.xpBarContainer}>
                      <div className={styles.xpBarFill} style={{ width: `${progress}%`, background: level.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'session' && (
        <div className={styles.sessionEmpty}>
          <Play size={48} />
          <h2>{t('no_active_session') || 'No hay sesión activa'}</h2>
          <p>{t('start_session_desc') || 'Inicia una rutina o añade ejercicios libres para comenzar a forjar.'}</p>
          <button className={styles.startSessionBtn}>
            {t('start_empty_session') || 'Sesión Libre'}
          </button>
        </div>
      )}
    </div>
  );
}

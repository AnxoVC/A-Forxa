'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Barcode, Plus, Utensils, Apple, Coffee, Flame, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import FoodSearchModal from '@/components/nutrition/FoodSearchModal';
import { format } from 'date-fns';

interface NutritionLog {
  id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  brand: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amount_g: number;
}

export default function NutritionPage() {
  const t = useTranslations('nav');
  const [activeTab, setActiveTab] = useState<'diary' | 'menu'>('diary');
  
  // Database states
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(150);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // 1. Fetch Profile Targets
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userData.user.id).single();
      const profileData = profile as any;
      if (profileData) {
        setTargetCalories(profileData.target_calories || 2000);
        setTargetProtein(profileData.target_protein || 150);
      }

      // 2. Fetch Today's Logs
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: todayLogs } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('date', today);

      if (todayLogs) {
        setLogs(todayLogs);
      }
    } catch (err) {
      console.error('Error fetching nutrition data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (food: any, amountG: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const today = format(new Date(), 'yyyy-MM-dd');
      const multiplier = amountG / 100;
      
      const newLog = {
        user_id: userData.user.id,
        date: today,
        meal_type: selectedMeal,
        food_name: food.name,
        brand: food.brand,
        amount_g: amountG,
        calories: Math.round(food.calories * multiplier),
        protein: food.protein * multiplier,
        carbs: food.carbs * multiplier,
        fat: food.fat * multiplier,
        barcode: food.barcode
      };

      const { data, error } = await supabase.from('nutrition_logs').insert(newLog as any).select().single();
      if (error) throw error;
      
      setLogs([...logs, data]);
    } catch (error) {
      console.error('Error adding food', error);
      alert('Error al añadir el alimento.');
    }
  };

  const deleteLog = async (id: string) => {
    try {
      await supabase.from('nutrition_logs').delete().eq('id', id);
      setLogs(logs.filter(log => log.id !== id));
    } catch (error) {
      console.error('Error deleting food', error);
    }
  };

  const openSearch = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  // Calculate Totals
  const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = logs.reduce((sum, log) => sum + log.protein, 0);
  const totalCarbs = logs.reduce((sum, log) => sum + log.carbs, 0);
  const totalFat = logs.reduce((sum, log) => sum + log.fat, 0);

  const renderMealSection = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack', title: string, icon: any) => {
    const mealLogs = logs.filter(l => l.meal_type === type);
    const mealCalories = mealLogs.reduce((sum, log) => sum + log.calories, 0);

    return (
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: mealLogs.length > 0 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '8px', borderRadius: '8px' }}>
              {icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{title}</h3>
              <span style={{ color: 'var(--text-3)', fontSize: '12px' }}>{mealCalories} kcal</span>
            </div>
          </div>
          <button 
            onClick={() => openSearch(type)}
            className="text-fire hover:bg-white/5" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Plus size={20} />
          </button>
        </div>

        {mealLogs.length > 0 && (
          <div style={{ padding: '0 16px' }}>
            {mealLogs.map(log => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }} className="last:border-0">
                <div>
                  <div style={{ fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {log.food_name}
                    <button onClick={() => deleteLog(log.id)} style={{ border: 'none', color: 'var(--fire-2)', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', cursor: 'pointer' }}>Borrar</button>
                  </div>
                  <div style={{ color: 'var(--text-3)', fontSize: '12px', marginTop: '2px' }}>{log.amount_g}g • {log.brand || 'Sin marca'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{log.calories} kcal</div>
                  <div style={{ color: 'var(--text-3)', fontSize: '11px', marginTop: '2px', display: 'flex', gap: '6px' }}>
                    <span style={{ color: 'var(--blue-1)' }}>{log.protein.toFixed(1)}p</span>
                    <span style={{ color: 'var(--yellow-1)' }}>{log.carbs.toFixed(1)}c</span>
                    <span style={{ color: 'var(--fire-2)' }}>{log.fat.toFixed(1)}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Cargando datos de nutrición...</div>;
  }

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg-base)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
        <button 
          onClick={() => setActiveTab('diary')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600, background: activeTab === 'diary' ? 'var(--bg-surface)' : 'transparent', color: activeTab === 'diary' ? 'var(--text-1)' : 'var(--text-2)', boxShadow: activeTab === 'diary' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none' }}
        >
          Diario
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600, background: activeTab === 'menu' ? 'var(--bg-surface)' : 'transparent', color: activeTab === 'menu' ? 'var(--text-1)' : 'var(--text-2)', boxShadow: activeTab === 'menu' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none' }}
        >
          Plan Semanal
        </button>
      </div>

      {activeTab === 'diary' && (
        <>
          {/* Daily Summary Rings */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-2)' }}>Restantes hoy</h3>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {Math.max(0, targetCalories - totalCalories)} <span style={{ fontSize: '16px', color: 'var(--text-3)', fontWeight: 500 }}>kcal</span>
                </div>
              </div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '6px solid var(--fire-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame className="text-fire" size={24} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--blue-1)' }}>Proteínas</span>
                  <span>{totalProtein.toFixed(0)} / {targetProtein}g</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--blue-1)', width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}></div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--yellow-1)' }}>Carbos</span>
                  <span>{totalCarbs.toFixed(0)}g</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--yellow-1)', width: `${Math.min(100, (totalCarbs / 250) * 100)}%` }}></div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--fire-2)' }}>Grasas</span>
                  <span>{totalFat.toFixed(0)}g</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--fire-2)', width: `${Math.min(100, (totalFat / 70) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Meals */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {renderMealSection('breakfast', 'Desayuno', <Coffee size={18} className="text-fire" />)}
            {renderMealSection('lunch', 'Comida', <Utensils size={18} className="text-fire" />)}
            {renderMealSection('dinner', 'Cena', <Utensils size={18} className="text-fire" />)}
            {renderMealSection('snack', 'Snacks', <Apple size={18} className="text-fire" />)}
          </div>
        </>
      )}

      {activeTab === 'menu' && (
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-3)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px auto', opacity: 0.2 }} />
          <h3 style={{ color: 'var(--text-1)', fontSize: '18px', margin: '0 0 8px 0' }}>Plan Semanal Próximamente</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>Esta función te permitirá planificar tus comidas de toda la semana y generar la lista de la compra automáticamente.</p>
        </div>
      )}

      <FoodSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddFood}
        mealType={selectedMeal}
      />
    </div>
  );
}

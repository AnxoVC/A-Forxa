'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Utensils, Apple, Coffee, Flame, ChevronRight, ShoppingCart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import FoodSearchModal from '@/components/nutrition/FoodSearchModal';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface NutritionLog {
  id: string;
  date: string;
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
  const t = useTranslations('nutrition');
  const [activeTab, setActiveTab] = useState<'diary' | 'menu'>('diary');
  
  // Database states
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetCalories, setTargetCalories] = useState(0);
  const [targetProtein, setTargetProtein] = useState(0);

  // Modal & Selection states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Weekly Plan states
  const [expandedDay, setExpandedDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [showShoppingList, setShowShoppingList] = useState(false);

  const generateShoppingList = () => {
    const list: Record<string, { name: string, brand: string | null, amount: number }> = {};
    logs.forEach(log => {
      const key = `${log.food_name}-${log.brand || ''}`;
      if (!list[key]) {
        list[key] = { name: log.food_name, brand: log.brand, amount: 0 };
      }
      list[key].amount += log.amount_g;
    });
    return list;
  };

  const supabase = createClient();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'));

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
        setTargetCalories(profileData.target_calories || 0);
        setTargetProtein(profileData.target_protein || 0);
      }

      // 2. Fetch Entire Week's Logs
      const { data: weekLogs } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', userData.user.id)
        .gte('date', weekDays[0])
        .lte('date', weekDays[6]);

      if (weekLogs) {
        setLogs(weekLogs);
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

      const multiplier = amountG / 100;
      
      const newLog = {
        user_id: userData.user.id,
        date: selectedDate, // Uses the specifically selected date (today for diary, any day for planner)
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

  const openSearch = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack', date: string = todayStr) => {
    setSelectedMeal(meal);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // View specific logs
  const displayLogs = activeTab === 'diary' ? logs.filter(l => l.date === todayStr) : logs;
  
  const totalCalories = displayLogs.filter(l => l.date === todayStr).reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = displayLogs.filter(l => l.date === todayStr).reduce((sum, log) => sum + log.protein, 0);
  const totalCarbs = displayLogs.filter(l => l.date === todayStr).reduce((sum, log) => sum + log.carbs, 0);
  const totalFat = displayLogs.filter(l => l.date === todayStr).reduce((sum, log) => sum + log.fat, 0);

  const renderMealSection = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack', title: string, icon: any, date: string = todayStr) => {
    const mealLogs = logs.filter(l => l.meal_type === type && l.date === date);
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
            onClick={() => openSearch(type, date)}
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
      
      {/* Header Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Nutrición</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg-base)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
        <button 
          onClick={() => setActiveTab('diary')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600, background: activeTab === 'diary' ? 'var(--bg-surface)' : 'transparent', color: activeTab === 'diary' ? 'var(--text-1)' : 'var(--text-2)', boxShadow: activeTab === 'diary' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none', border: 'none', cursor: 'pointer' }}
        >
          Diario
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600, background: activeTab === 'menu' ? 'var(--bg-surface)' : 'transparent', color: activeTab === 'menu' ? 'var(--text-1)' : 'var(--text-2)', boxShadow: activeTab === 'menu' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none', border: 'none', cursor: 'pointer' }}
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
                  {targetCalories > 0 ? Math.max(0, targetCalories - totalCalories) : totalCalories} <span style={{ fontSize: '16px', color: 'var(--text-3)', fontWeight: 500 }}>{targetCalories > 0 ? 'kcal' : 'kcal consumidas'}</span>
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
                  <span>{totalProtein.toFixed(0)} {targetProtein > 0 ? `/ ${targetProtein}g` : 'g'}</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--blue-1)', width: targetProtein > 0 ? `${Math.min(100, (totalProtein / targetProtein) * 100)}%` : '100%' }}></div>
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
            {renderMealSection('breakfast', 'Desayuno', <Coffee size={18} className="text-fire" />, todayStr)}
            {renderMealSection('lunch', 'Comida', <Utensils size={18} className="text-fire" />, todayStr)}
            {renderMealSection('dinner', 'Cena', <Utensils size={18} className="text-fire" />, todayStr)}
            {renderMealSection('snack', 'Snacks', <Apple size={18} className="text-fire" />, todayStr)}
          </div>
        </>
      )}

      {activeTab === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <button 
            onClick={() => setShowShoppingList(true)}
            style={{ width: '100%', padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', color: 'var(--text-1)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <ShoppingCart size={20} className="text-fire" /> Generar Lista de Compra
          </button>

          {weekDays.map(dateStr => {
            const dateObj = new Date(dateStr);
            const dayName = format(dateObj, 'EEEE', { locale: es });
            const isToday = dateStr === todayStr;
            const dayLogs = logs.filter(l => l.date === dateStr);
            const dayCals = dayLogs.reduce((sum, l) => sum + l.calories, 0);
            
            return (
              <div key={dateStr} style={{ background: 'var(--bg-card)', borderRadius: '16px', border: isToday ? '2px solid var(--fire-1)' : '1px solid var(--border)', overflow: 'hidden' }}>
                <div 
                  onClick={() => setExpandedDay(expandedDay === dateStr ? '' : dateStr)}
                  style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedDay === dateStr ? 'var(--bg-surface)' : 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isToday ? 'var(--fire-1)' : 'var(--bg-surface)', color: isToday ? 'white' : 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px' }}>
                      {format(dateObj, 'd')}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, textTransform: 'capitalize' }}>
                        {dayName} {isToday && <span style={{ fontSize: '12px', color: 'var(--fire-1)', marginLeft: '8px' }}>Hoy</span>}
                      </h3>
                      <span style={{ color: 'var(--text-3)', fontSize: '12px' }}>{dayLogs.length} comidas • {dayCals} kcal</span>
                    </div>
                  </div>
                  <ChevronRight size={20} style={{ color: 'var(--text-3)', transform: expandedDay === dateStr ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
                
                {expandedDay === dateStr && (
                  <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
                    {renderMealSection('breakfast', 'Desayuno', <Coffee size={18} className="text-fire" />, dateStr)}
                    {renderMealSection('lunch', 'Comida', <Utensils size={18} className="text-fire" />, dateStr)}
                    {renderMealSection('dinner', 'Cena', <Utensils size={18} className="text-fire" />, dateStr)}
                    {renderMealSection('snack', 'Snacks', <Apple size={18} className="text-fire" />, dateStr)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showShoppingList && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={24} className="text-fire" /> Lista de la Compra
            </h3>
            <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '14px' }}>Basado en tu Plan Semanal de esta semana.</p>
            
            <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.values(generateShoppingList()).length === 0 ? (
                <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: '20px' }}>Tu plan semanal está vacío. Añade alimentos a los días de la semana para generar la lista.</div>
              ) : (
                Object.values(generateShoppingList()).sort((a: any, b: any) => b.amount - a.amount).map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }} className="last:border-0 last:pb-0">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{item.brand || 'Marca genérica'}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--text-2)', background: 'var(--bg-card)', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
                      {Math.ceil(item.amount)} g
                    </div>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => setShowShoppingList(false)} style={{ width: '100%', padding: '16px', background: 'var(--fire-1)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 600, marginTop: '8px' }}>
              Cerrar
            </button>
          </div>
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

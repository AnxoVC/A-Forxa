'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Barcode, Plus, Check, ShoppingCart, Calendar, Coffee, Utensils, Apple } from 'lucide-react';
import styles from './page.module.css';

export default function NutritionPage() {
  const t = useTranslations('nutrition'); // Assuming these exist, if not we will just use Spanish fallback text
  const [activeTab, setActiveTab] = useState<'diary' | 'menu' | 'shopping'>('diary');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for Diary
  const macros = {
    cals: { current: 1200, target: 2500 },
    prot: { current: 85, target: 160 },
    carb: { current: 110, target: 300 },
    fat: { current: 40, target: 70 }
  };

  const meals = [
    { id: 'breakfast', name: 'Desayuno', icon: Coffee, items: [{ name: 'Avena con Proteína', cals: 350, prot: 30 }] },
    { id: 'lunch', name: 'Comida', icon: Utensils, items: [] },
    { id: 'dinner', name: 'Cena', icon: Utensils, items: [] },
    { id: 'snacks', name: 'Snacks', icon: Apple, items: [{ name: 'Plátano', cals: 105, prot: 1 }] },
  ];

  // Mock data for Shopping List
  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: 'Pechuga de Pollo', category: 'Carnes', qty: '1 kg', checked: false },
    { id: 2, name: 'Arroz Basmati', category: 'Despensa', qty: '1 paquete', checked: true },
    { id: 3, name: 'Huevos', category: 'Frescos', qty: '2 docenas', checked: false },
    { id: 4, name: 'Avena en copos', category: 'Despensa', qty: '500g', checked: false },
  ]);

  const toggleItem = (id: number) => {
    setShoppingList(list => list.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('title') || 'Nutrición'}</h1>
        <button className={styles.scanBtn}>
          <Barcode size={20} className="text-fire" />
          <span className="hidden md:inline">Escanear</span>
        </button>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'diary' ? styles.active : ''}`}
          onClick={() => setActiveTab('diary')}
        >
          Diario
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'menu' ? styles.active : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menú
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'shopping' ? styles.active : ''}`}
          onClick={() => setActiveTab('shopping')}
        >
          Compra
        </button>
      </div>

      {activeTab === 'diary' && (
        <div>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar alimento o receta..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.macrosOverview}>
            <div className={styles.macroItem}>
              <span className={styles.macroValue} style={{ color: 'var(--fire-1)' }}>{macros.cals.current}</span>
              <span className={styles.macroLabel}>Kcal</span>
            </div>
            <div className={styles.macroItem}>
              <span className={styles.macroValue} style={{ color: 'var(--blue-1)' }}>{macros.prot.current}</span>
              <span className={styles.macroLabel}>Prot</span>
            </div>
            <div className={styles.macroItem}>
              <span className={styles.macroValue} style={{ color: 'var(--fire-2)' }}>{macros.carb.current}</span>
              <span className={styles.macroLabel}>Carbs</span>
            </div>
            <div className={styles.macroItem}>
              <span className={styles.macroValue} style={{ color: 'var(--green-1)' }}>{macros.fat.current}</span>
              <span className={styles.macroLabel}>Grasas</span>
            </div>
          </div>

          <div className={styles.mealsList}>
            {meals.map(meal => (
              <div key={meal.id} className={styles.mealCard}>
                <div className={styles.mealHeader}>
                  <div className={styles.mealTitle}>
                    <meal.icon size={20} className="text-fire" />
                    {meal.name}
                  </div>
                  <button className={styles.mealAddBtn}>
                    <Plus size={20} />
                  </button>
                </div>
                {meal.items.length === 0 ? (
                  <div className={styles.emptyMeal}>No hay alimentos registrados</div>
                ) : (
                  <div>
                    {meal.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                        <div style={{ color: 'var(--text-2)', fontSize: '14px' }}>
                          <span style={{ color: 'var(--fire-1)', fontWeight: 600 }}>{item.cals} kcal</span>
                          <span style={{ marginLeft: '8px', color: 'var(--blue-1)' }}>{item.prot}g P</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shopping' && (
        <div>
          <div className={styles.header} style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} className="text-fire" /> 
              Lista de la Compra
            </h2>
            <button className={styles.mealAddBtn} style={{ background: 'var(--fire-grad)', color: 'white' }}>
              <Plus size={20} />
            </button>
          </div>

          <div className={styles.mealCard} style={{ padding: 0, overflow: 'hidden' }}>
            {shoppingList.map(item => (
              <div key={item.id} className={styles.shoppingItem}>
                <div 
                  className={`${styles.checkbox} ${item.checked ? styles.checked : ''}`}
                  onClick={() => toggleItem(item.id)}
                >
                  {item.checked && <Check size={16} />}
                </div>
                <div className={styles.itemInfo}>
                  <div className={`${styles.itemName} ${item.checked ? styles.crossed : ''}`}>
                    {item.name}
                  </div>
                  <div className={styles.itemMeta}>
                    {item.qty} • {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div>
          <div className={styles.header} style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} className="text-fire" /> 
              Menú Semanal
            </h2>
          </div>

          <div className={styles.weeklyGrid}>
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
              <div key={day} className={styles.dayCard}>
                <div className={styles.dayName}>{day}</div>
                <div className={styles.emptyMeal} style={{ padding: '8px 0', fontSize: '12px' }}>
                  <Plus size={16} style={{ margin: '0 auto 8px' }} />
                  Planificar
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

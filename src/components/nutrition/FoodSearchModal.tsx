'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Barcode, Plus, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface FoodItem {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  barcode: string | null;
}

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: FoodItem, amountG: number) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export default function FoodSearchModal({ isOpen, onClose, onAdd, mealType }: FoodSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Selected food state
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amount, setAmount] = useState<string>('100');

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setQuery('');
    setResults([]);
    setSelectedFood(null);
    setAmount('100');
    setError(null);
    stopScanner();
  };

  const stopScanner = () => {
    if (scannerRef.current && isScanning) {
      scannerRef.current.stop().catch(console.error);
      scannerRef.current.clear();
      setIsScanning(false);
    }
  };

  const startScanner = async () => {
    setIsScanning(true);
    setError(null);
    try {
      scannerRef.current = new Html5Qrcode("reader");
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          stopScanner();
          searchByBarcode(decodedText);
        },
        (errorMessage) => {
          // Ignore frequent scan errors
        }
      );
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar la cámara. Comprueba los permisos.");
      setIsScanning(false);
    }
  };

  const searchFood = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`);
      const data = await res.json();
      
      const parsedResults: FoodItem[] = data.products
        .filter((p: any) => p.product_name && p.nutriments && p.nutriments['energy-kcal_100g'] !== undefined)
        .map((p: any) => ({
          name: p.product_name,
          brand: p.brands || 'Sin marca',
          calories: p.nutriments['energy-kcal_100g'] || 0,
          protein: p.nutriments['proteins_100g'] || 0,
          carbs: p.nutriments['carbohydrates_100g'] || 0,
          fat: p.nutriments['fat_100g'] || 0,
          barcode: p.code || null
        }));
      
      setResults(parsedResults);
      if (parsedResults.length === 0) {
        setError("No se encontraron alimentos.");
      }
    } catch (err) {
      setError("Error al conectar con la base de datos de alimentos.");
    } finally {
      setLoading(false);
    }
  };

  const searchByBarcode = async (barcode: string) => {
    setLoading(true);
    setError(null);
    setQuery(barcode); // Show what was scanned
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      
      if (data.status === 1 && data.product) {
        const p = data.product;
        const food: FoodItem = {
          name: p.product_name || 'Alimento desconocido',
          brand: p.brands || 'Sin marca',
          calories: p.nutriments['energy-kcal_100g'] || 0,
          protein: p.nutriments['proteins_100g'] || 0,
          carbs: p.nutriments['carbohydrates_100g'] || 0,
          fat: p.nutriments['fat_100g'] || 0,
          barcode: barcode
        };
        setSelectedFood(food);
      } else {
        setError("Producto no encontrado en la base de datos.");
      }
    } catch (err) {
      setError("Error al buscar el código de barras.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (selectedFood && amount) {
      onAdd(selectedFood, parseFloat(amount));
      onClose();
    }
  };

  if (!isOpen) return null;

  const mealLabels = {
    breakfast: 'Desayuno',
    lunch: 'Comida',
    dinner: 'Cena',
    snack: 'Snack'
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-base)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => selectedFood ? setSelectedFood(null) : onClose()} style={{ background: 'none', border: 'none', color: 'var(--text-1)' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, flex: 1 }}>
          {selectedFood ? 'Detalles del alimento' : `Añadir a ${mealLabels[mealType]}`}
        </h2>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        
        {/* Scanner View */}
        {isScanning && !selectedFood && (
          <div style={{ marginBottom: '24px' }}>
            <div id="reader" style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--fire-1)' }}></div>
            <button 
              onClick={stopScanner}
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '16px', padding: '12px' }}
            >
              Cancelar Escáner
            </button>
          </div>
        )}

        {/* Selected Food View */}
        {selectedFood ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>{selectedFood.name}</h3>
              <p style={{ color: 'var(--text-2)', margin: 0 }}>{selectedFood.brand}</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-2)', marginBottom: '8px' }}>Cantidad (gramos)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-2)', fontSize: '12px', marginBottom: '4px' }}>Kcal</div>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{Math.round((selectedFood.calories * parseFloat(amount || '0')) / 100)}</div>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: 'var(--blue-1)', fontSize: '12px', marginBottom: '4px' }}>Prot</div>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{((selectedFood.protein * parseFloat(amount || '0')) / 100).toFixed(1)}g</div>
              </div>
              <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: 'var(--yellow-1)', fontSize: '12px', marginBottom: '4px' }}>Carb</div>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{((selectedFood.carbs * parseFloat(amount || '0')) / 100).toFixed(1)}g</div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: 'var(--fire-2)', fontSize: '12px', marginBottom: '4px' }}>Grasa</div>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{((selectedFood.fat * parseFloat(amount || '0')) / 100).toFixed(1)}g</div>
              </div>
            </div>

            <button 
              onClick={handleAdd}
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '18px', marginTop: 'auto' }}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Añadir al Diario
            </button>
          </div>
        ) : !isScanning ? (
          <>
            {/* Search Input */}
            <form onSubmit={searchFood} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input 
                  type="text" 
                  placeholder="Busca un alimento..." 
                  className="input-field" 
                  style={{ paddingLeft: '48px', height: '56px' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button 
                type="button" 
                onClick={startScanner}
                style={{ width: '56px', height: '56px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-1)' }}
              >
                <Barcode size={24} />
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div style={{ padding: '16px', background: 'rgba(220, 38, 38, 0.1)', color: 'var(--fire-2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <AlertTriangle size={20} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{error}</span>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>
                Buscando...
              </div>
            )}

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedFood(item)}
                  style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{item.name}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-3)' }}>{item.brand} • {item.calories} kcal / 100g</p>
                  </div>
                  <Plus size={20} className="text-fire" />
                </div>
              ))}
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
}

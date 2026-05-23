'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  target: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
}

interface ExerciseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (name: string, gifUrl: string) => void;
}

export default function ExerciseSearchModal({ isOpen, onClose, onSelectExercise }: ExerciseSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch some popular exercises by default if query is empty
  useEffect(() => {
    if (isOpen && query.length === 0 && results.length === 0) {
      searchExercises('press'); // default search
    }
  }, [isOpen]);

  const searchExercises = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/exercises?name=${searchQuery}&limit=10`);
      const data = await res.json();
      
      if (res.ok) {
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } else {
        setError(data.error || 'Error al buscar.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchExercises(query);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1001, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', height: '80vh', background: 'var(--bg-base)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Biblioteca de Ejercicios</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer' }}>
              <X size={24}/>
            </button>
          </div>
          
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input 
                type="text" 
                placeholder="Buscar ejercicio (en inglés, ej: squat, curl...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%', padding: '16px', paddingLeft: '44px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-1)' }}
              />
            </div>
            <button type="submit" style={{ padding: '0 20px', background: 'var(--blue-1)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 600 }}>
              Buscar
            </button>
          </form>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--text-3)' }}>
              <Loader2 size={32} className="animate-spin" style={{ marginBottom: '16px', color: 'var(--blue-1)' }} />
              <span>Buscando en la base de datos...</span>
            </div>
          ) : error ? (
            <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--fire-1)', borderRadius: '12px', textAlign: 'center' }}>
              {error}
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>
              No se encontraron ejercicios. Prueba con otra palabra clave en inglés (ej: deadlift, bench).
            </div>
          ) : (
            results.map((ex) => (
              <div 
                key={ex.id}
                onClick={() => {
                  onSelectExercise(ex.name.charAt(0).toUpperCase() + ex.name.slice(1), ex.gifUrl);
                }}
                style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', border: '1px solid var(--border)', cursor: 'pointer' }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {ex.gifUrl ? (
                    <img src={ex.gifUrl} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
                  ) : (
                    <ImageIcon size={32} color="#ccc" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-1)', textTransform: 'capitalize' }}>
                    {ex.name}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(59,130,246,0.1)', color: 'var(--blue-1)', borderRadius: '20px', textTransform: 'capitalize' }}>
                      {ex.target}
                    </span>
                    <span style={{ fontSize: '12px', padding: '4px 8px', background: 'var(--bg-surface)', color: 'var(--text-2)', borderRadius: '20px', textTransform: 'capitalize' }}>
                      {ex.equipment}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CardDisplay from './components/CardDisplay';
import { Category } from './types';
import { ADVICE_DATABASE, ALL_ADVICE } from './constants';

const App: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentAdvice, setCurrentAdvice] = useState<string>("");

  // Logic to get a random advice based on filters
  const getRandomAdvice = useCallback(() => {
    let pool: string[] = [];

    if (selectedCategories.length === 0) {
      pool = ALL_ADVICE;
    } else {
      selectedCategories.forEach(cat => {
        if (ADVICE_DATABASE[cat]) {
          pool = [...pool, ...ADVICE_DATABASE[cat]];
        }
      });
    }

    if (pool.length === 0) return "No advice available for this category.";

    // Ensure we don't pick the exact same one if possible (unless pool is size 1)
    let newAdvice = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && newAdvice === currentAdvice) {
      // Try one more time to avoid immediate duplicate
      newAdvice = pool[Math.floor(Math.random() * pool.length)];
    }
    
    return newAdvice;
  }, [selectedCategories, currentAdvice]);

  // Initial load
  useEffect(() => {
    setCurrentAdvice(getRandomAdvice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // When categories change, update the advice immediately to match context
  useEffect(() => {
    setCurrentAdvice(getRandomAdvice());
  }, [selectedCategories, getRandomAdvice]);

  // Handle Spacebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling
        setCurrentAdvice(getRandomAdvice());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getRandomAdvice]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 font-sans selection:bg-stone-200">
      <Sidebar 
        selectedCategories={selectedCategories} 
        toggleCategory={toggleCategory} 
      />
      
      <main className="md:ml-80 min-h-screen flex items-center justify-center p-6 md:p-12 transition-all duration-300">
        <CardDisplay 
          advice={currentAdvice} 
          onNext={() => setCurrentAdvice(getRandomAdvice())} 
        />
      </main>
    </div>
  );
};

export default App;
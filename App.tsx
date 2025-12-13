import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CardDisplay from './components/CardDisplay';
import { Category } from './types';
import { ADVICE_DATABASE, ALL_ADVICE } from './constants';

const App: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentAdvice, setCurrentAdvice] = useState<string>("");
  const [trigger, setTrigger] = useState(0);

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
    
    // If there's only one option, we can't switch.
    if (pool.length === 1) return pool[0];

    // Try to find a different advice from current
    let newAdvice = currentAdvice;
    let attempts = 0;
    while (newAdvice === currentAdvice && attempts < 10) {
      newAdvice = pool[Math.floor(Math.random() * pool.length)];
      attempts++;
    }
    
    return newAdvice;
  }, [selectedCategories, currentAdvice]);

  // Handle generating next advice
  const handleNext = useCallback(() => {
    const nextAdvice = getRandomAdvice();
    setCurrentAdvice(nextAdvice);
    setTrigger(t => t + 1); // Always increment trigger to force animation
  }, [getRandomAdvice]);

  // Initial load
  useEffect(() => {
    setCurrentAdvice(getRandomAdvice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // When categories change, update the advice immediately
  useEffect(() => {
    // When changing filters, we want to update the card.
    const nextAdvice = getRandomAdvice();
    if (nextAdvice !== currentAdvice) {
        setCurrentAdvice(nextAdvice);
        setTrigger(t => t + 1);
    }
  }, [selectedCategories]); 

  // Handle Spacebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext]);

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
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 font-sans selection:bg-stone-200 overflow-hidden">
      <Sidebar 
        selectedCategories={selectedCategories} 
        toggleCategory={toggleCategory} 
      />
      
      {/* Updated alignment: items-end for bottom alignment, pb-0 to touch bottom */}
      <main className="md:ml-80 h-screen flex items-end justify-center pb-0 px-4 md:px-0 transition-all duration-300">
        <CardDisplay 
          advice={currentAdvice} 
          trigger={trigger}
          onNext={handleNext} 
        />
      </main>
    </div>
  );
};

export default App;
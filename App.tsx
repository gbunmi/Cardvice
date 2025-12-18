import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CardDisplay from './components/CardDisplay';
import { Category } from './types';
import { ADVICE_DATABASE, ALL_ADVICE } from './constants';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentAdvice, setCurrentAdvice] = useState<string>("");
  const [trigger, setTrigger] = useState(0);

  // Logic to get a random advice based on the single filter
  const getRandomAdvice = useCallback(() => {
    let pool: string[] = [];

    if (!selectedCategory) {
      pool = ALL_ADVICE;
    } else {
      pool = ADVICE_DATABASE[selectedCategory] || [];
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
  }, [selectedCategory, currentAdvice]);

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

  // When category changes, update the advice immediately
  useEffect(() => {
    const nextAdvice = getRandomAdvice();
    if (nextAdvice !== currentAdvice) {
        setCurrentAdvice(nextAdvice);
        setTrigger(t => t + 1);
    }
  }, [selectedCategory]); 

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
    setSelectedCategory(prev => prev === category ? null : category);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#FAFAF9] text-stone-900 font-sans selection:bg-stone-200 overflow-hidden flex flex-col md:block">
      <Sidebar 
        selectedCategory={selectedCategory} 
        toggleCategory={toggleCategory} 
      />
      
      <main 
        className="flex-1 w-full md:w-auto md:ml-80 md:h-[100dvh] flex items-end justify-center pb-0 px-4 md:px-0 transition-all duration-300 bg-no-repeat bg-bottom bg-cover"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/gbunmi/images/main/cardvice%20BG%204%20(1).png')`
        }}
      >
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
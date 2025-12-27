import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import CardDisplay from './components/CardDisplay';
import { Category } from './types';
import { ADVICE_DATABASE } from './constants';

interface AdviceItem {
  text: string;
  category: Category;
}

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentAdvice, setCurrentAdvice] = useState<AdviceItem>({ text: "", category: Category.SelfCare });
  const [trigger, setTrigger] = useState(0);

  // Flatten all advice into a lookup array for "All" shuffling
  const allAdviceItems = useMemo(() => {
    return Object.entries(ADVICE_DATABASE).flatMap(([cat, items]) => 
      items.map(item => ({ text: item, category: cat as Category }))
    );
  }, []);

  const getRandomAdvice = useCallback((): AdviceItem => {
    let pool: AdviceItem[] = [];

    if (!selectedCategory) {
      pool = allAdviceItems;
    } else {
      const texts = ADVICE_DATABASE[selectedCategory] || [];
      pool = texts.map(t => ({ text: t, category: selectedCategory }));
    }

    if (pool.length === 0) return { text: "No advice available.", category: Category.SelfCare };
    
    if (pool.length === 1) return pool[0];

    // Try to find a different advice from current
    let picked = pool[Math.floor(Math.random() * pool.length)];
    let attempts = 0;
    while (picked.text === currentAdvice.text && attempts < 10) {
      picked = pool[Math.floor(Math.random() * pool.length)];
      attempts++;
    }
    
    return picked;
  }, [selectedCategory, currentAdvice.text, allAdviceItems]);

  const handleNext = useCallback(() => {
    const next = getRandomAdvice();
    setCurrentAdvice(next);
    setTrigger(t => t + 1);
  }, [getRandomAdvice]);

  useEffect(() => {
    setCurrentAdvice(getRandomAdvice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    const next = getRandomAdvice();
    if (next.text !== currentAdvice.text) {
        setCurrentAdvice(next);
        setTrigger(t => t + 1);
    }
  }, [selectedCategory]); 

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
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
          advice={currentAdvice.text} 
          category={currentAdvice.category}
          trigger={trigger}
          onNext={handleNext} 
        />
      </main>
    </div>
  );
};

export default App;
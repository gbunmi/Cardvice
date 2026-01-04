import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

  // Shuffled pools for each category + "ALL"
  const poolsRef = useRef<Record<string, AdviceItem[]>>({});

  // Flatten all advice once
  const allAdviceItems = useMemo(() => {
    return Object.entries(ADVICE_DATABASE).flatMap(([cat, items]) => 
      items.map(item => ({ text: item, category: cat as Category }))
    );
  }, []);

  // Fisher-Yates shuffle
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const getNextFromPool = useCallback((): AdviceItem => {
    const key = selectedCategory || 'ALL_CONTEXT';
    
    // Initialize or refill pool if empty
    if (!poolsRef.current[key] || poolsRef.current[key].length === 0) {
      let freshPool: AdviceItem[] = [];
      if (!selectedCategory) {
        freshPool = allAdviceItems;
      } else {
        const texts = ADVICE_DATABASE[selectedCategory] || [];
        freshPool = texts.map(t => ({ text: t, category: selectedCategory }));
      }

      // If database is empty, return a fallback
      if (freshPool.length === 0) {
        return { text: "No advice available.", category: Category.SelfCare };
      }

      // Shuffle the fresh pool
      let shuffled = shuffleArray(freshPool);

      // Prevent immediate repetition when refilling if pool has > 1 item
      if (shuffled.length > 1 && shuffled[shuffled.length - 1].text === currentAdvice.text) {
        // Swap last item with second to last
        [shuffled[shuffled.length - 1], shuffled[shuffled.length - 2]] = 
        [shuffled[shuffled.length - 2], shuffled[shuffled.length - 1]];
      }

      poolsRef.current[key] = shuffled;
    }

    // Pop from the pool
    const nextItem = poolsRef.current[key].pop()!;
    return nextItem;
  }, [selectedCategory, allAdviceItems, currentAdvice.text]);

  const handleNext = useCallback(() => {
    const next = getNextFromPool();
    setCurrentAdvice(next);
    setTrigger(t => t + 1);
  }, [getNextFromPool]);

  // Initial load
  useEffect(() => {
    setCurrentAdvice(getNextFromPool());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // When category changes
  useEffect(() => {
    const next = getNextFromPool();
    setCurrentAdvice(next);
    setTrigger(t => t + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
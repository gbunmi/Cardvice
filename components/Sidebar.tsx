import React from 'react';
import { Category } from '../types';

interface SidebarProps {
  selectedCategories: Category[];
  toggleCategory: (category: Category) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategories, toggleCategory }) => {
  const categories = Object.values(Category);

  return (
    <div className="w-full md:w-80 md:h-[100dvh] md:fixed md:left-0 md:top-0 bg-[#FAFAF9] px-4 py-6 md:px-5 md:py-10 flex flex-col flex-shrink-0 md:border-r border-stone-200 z-10">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="mb-10 md:mb-12">
        <h1 className="text-3xl font-bold text-stone-900 font-serif tracking-tight">Cardvice.</h1>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 md:grid md:grid-cols-2 md:gap-2 md:pb-0 md:mx-0 md:px-0 no-scrollbar">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`
                px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 border text-center whitespace-nowrap flex-shrink-0
                ${isSelected 
                  ? 'bg-stone-800 text-white border-stone-800 shadow-md' 
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900'}
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
      
      <div className="mt-auto hidden md:block pt-10">
        <p className="text-xs text-stone-400">
          <br/>
          &copy; {new Date().getFullYear()} Cardvice.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
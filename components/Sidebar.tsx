import React from 'react';
import { Category } from '../types';

interface SidebarProps {
  selectedCategories: Category[];
  toggleCategory: (category: Category) => void;
}

const CATEGORY_EMOJI_CODES: Record<Category, string> = {
  [Category.Finance]: "1f4b8",
  [Category.Love]: "1f498",
  [Category.Health]: "1f9d8",
  [Category.Social]: "1f942",
  [Category.Work]: "1f4bc",
  [Category.SelfCare]: "1f6c1",
  [Category.Family]: "1f3e1",
  [Category.DailyHabits]: "1f5d3-fe0f",
  [Category.Friends]: "1f46f",
  [Category.DigitalLife]: "1f4f1",
};

const Sidebar: React.FC<SidebarProps> = ({ selectedCategories, toggleCategory }) => {
  const categories = Object.values(Category);

  return (
    <div className="w-full md:w-80 md:h-[100dvh] md:fixed md:left-0 md:top-0 bg-[#FAFAF9] px-4 pt-12 pb-6 md:px-5 md:py-10 flex flex-col flex-shrink-0 md:border-r border-stone-200 z-10">
      <div className="mb-10 md:mb-12">
        <h1 className="text-3xl font-bold text-stone-900 font-serif tracking-tight">Cardvice.</h1>
      </div>

      <div className="grid grid-cols-12 gap-1.5 pb-2 md:grid-cols-2 md:gap-2 md:pb-0">
        {categories.map((category, index) => {
          const isSelected = selectedCategories.includes(category);
          const emojiUrl = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/64/${CATEGORY_EMOJI_CODES[category]}.png`;
          
          // Mobile Layout Logic (12 column grid):
          // Rows 1: 4 items (Index 0-3) -> span 3 cols each (12/3 = 4 items)
          // Rows 2: 3 items (Index 4-6) -> span 4 cols each (12/4 = 3 items)
          // Rows 3: 3 items (Index 7-9) -> span 4 cols each (12/4 = 3 items)
          const colSpanClass = index < 4 ? 'col-span-3' : 'col-span-4';

          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`
                ${colSpanClass} md:col-span-1
                px-1 py-2 md:px-3 md:py-3 
                rounded-lg text-[10px] sm:text-xs md:text-sm font-bold 
                transition-all duration-200 border text-center whitespace-nowrap 
                flex-shrink-0 flex items-center justify-center gap-1 md:gap-2
                ${isSelected 
                  ? 'bg-stone-800 text-white border-stone-800 shadow-md' 
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900'}
              `}
            >
              <img src={emojiUrl} alt="" className="w-4 h-4 md:w-5 md:h-5 object-contain select-none pointer-events-none" draggable={false} />
              <span className="truncate">{category}</span>
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
import React, { useEffect, useState } from 'react';

interface CardDisplayProps {
  advice: string;
  onNext: () => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ advice, onNext }) => {
  const [animating, setAnimating] = useState(false);
  const [displayAdvice, setDisplayAdvice] = useState(advice);

  // Handle advice updates with a smooth transition
  useEffect(() => {
    if (advice !== displayAdvice) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setDisplayAdvice(advice);
        setAnimating(false);
      }, 300); // Wait for fade out
      return () => clearTimeout(timer);
    }
  }, [advice, displayAdvice]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto px-4 relative">
      
      {/* The Stack Effect (Background Cards) */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[400px]">
        {/* Deepest Card */}
        <div className="absolute inset-0 bg-white border border-stone-200 rounded-2xl shadow-sm transform scale-[0.92] -translate-y-6 opacity-60 transition-transform duration-500 ease-out"></div>
        
        {/* Middle Card */}
        <div className="absolute inset-0 bg-white border border-stone-200 rounded-2xl shadow-sm transform scale-[0.96] -translate-y-3 opacity-80 transition-transform duration-500 ease-out"></div>
        
        {/* Main Card */}
        <div className="absolute inset-0 bg-white border border-stone-200 rounded-2xl shadow-xl flex items-center justify-center p-8 md:p-16 transform transition-all duration-500 z-10">
          <p 
            className={`
              text-xl md:text-3xl text-stone-800 font-serif leading-relaxed text-center transition-opacity duration-300 ease-in-out
              ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
            `}
          >
            {displayAdvice}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-12 md:mt-16 w-full max-w-lg">
        <button
          onClick={onNext}
          className="w-full bg-[#1c1c1c] text-stone-100 hover:bg-black active:scale-[0.98] transition-all duration-200 py-4 px-8 rounded-lg text-sm md:text-base font-medium shadow-lg tracking-wide"
        >
          Press the spacebar to see a new card
        </button>
      </div>
    </div>
  );
};

export default CardDisplay;
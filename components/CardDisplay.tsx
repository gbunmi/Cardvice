import React, { useEffect, useState, useRef } from 'react';

interface CardDisplayProps {
  advice: string;
  onNext: () => void;
}

type AnimationState = 'idle' | 'leaving' | 'entering';

const CardDisplay: React.FC<CardDisplayProps> = ({ advice, onNext }) => {
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [displayAdvice, setDisplayAdvice] = useState(advice);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // When advice prop changes, start the exit animation sequence
    if (advice !== displayAdvice) {
      setAnimationState('leaving');
    }
  }, [advice, displayAdvice]);

  const handleAnimationEnd = () => {
    if (animationState === 'leaving') {
      // Phase 1 Complete: Card has flown out.
      // Now update text invisibly and start entry.
      setDisplayAdvice(advice);
      setAnimationState('entering');
    } else if (animationState === 'entering') {
      // Phase 2 Complete: Card has popped in.
      // Reset to idle.
      setAnimationState('idle');
    }
  };

  // Main card animation classes
  const getMainCardClasses = () => {
    switch (animationState) {
      case 'leaving':
        return 'animate-throw-out';
      case 'entering':
        return 'animate-pop-in';
      default:
        return '';
    }
  };

  // Background cards animation: When leaving, they move UP to fill the gap.
  // When entering (or idle), they are at their pushed-down positions.
  const getMiddleCardClasses = () => {
    return animationState === 'leaving' 
      ? 'translate-y-0 scale-100 opacity-100 transition-all duration-300 ease-out' // Moves up to top position
      : 'scale-[0.96] -translate-y-3 opacity-80 transition-all duration-500 ease-out'; // Default/Reset position
  };

  const getDeepestCardClasses = () => {
    return animationState === 'leaving'
      ? 'translate-y-[-12px] scale-[0.96] opacity-80 transition-all duration-300 ease-out' // Moves up to middle position
      : 'scale-[0.92] -translate-y-6 opacity-60 transition-all duration-500 ease-out'; // Default/Reset position
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto px-4 relative">
      <style>{`
        @keyframes throw-out {
          0% { transform: translateX(0) rotate(0); opacity: 1; }
          100% { transform: translateX(120%) rotate(12deg); opacity: 0; }
        }
        @keyframes pop-in {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          60% { transform: scale(1.02) translateY(0); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-throw-out {
          animation: throw-out 0.4s ease-in forwards;
        }
        .animate-pop-in {
          animation: pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* The Stack Effect (Background Cards) */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[400px]">
        {/* Deepest Card */}
        <div className={`absolute inset-0 bg-white border border-stone-200 rounded-2xl shadow-sm transform ${getDeepestCardClasses()}`}></div>
        
        {/* Middle Card */}
        <div className={`absolute inset-0 bg-white border border-stone-200 rounded-2xl shadow-sm transform ${getMiddleCardClasses()}`}></div>
        
        {/* Main Card */}
        <div 
          className={`absolute inset-0 bg-white border border-stone-200 rounded-2xl shadow-xl flex items-center justify-center p-8 md:p-16 transform z-10 ${getMainCardClasses()}`}
          onAnimationEnd={handleAnimationEnd}
        >
          <p className="text-xl md:text-3xl text-stone-800 font-serif leading-relaxed text-center select-none">
            {displayAdvice}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-12 md:mt-16 w-full max-w-lg">
        <button
          onClick={onNext}
          disabled={animationState !== 'idle'}
          className="w-full bg-[#1c1c1c] text-stone-100 hover:bg-black active:scale-[0.98] transition-all duration-200 py-4 px-8 rounded-lg text-sm md:text-base font-medium shadow-lg tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Press the spacebar to see a new card
        </button>
      </div>
    </div>
  );
};

export default CardDisplay;
import React, { useEffect, useState, useRef } from 'react';

interface CardDisplayProps {
  advice: string;
  onNext: () => void;
  trigger: number;
}

type AnimationState = 'idle' | 'leaving' | 'entering';

const CardDisplay: React.FC<CardDisplayProps> = ({ advice, onNext, trigger }) => {
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [displayAdvice, setDisplayAdvice] = useState(advice);
  const isFirstRender = useRef(true);
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    // Skip animation on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Check if trigger has changed (indicating a user request for new card)
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      // Start animation regardless of whether advice text changed
      setAnimationState('leaving');
    }
  }, [trigger, advice]); // We depend on trigger primarily for the action

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

  return (
    <div className="flex flex-col items-center justify-end w-full max-w-4xl mx-auto relative">
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

      {/* The Image Card Container - Uses flex to center content and constraints */}
      <div 
        className={`relative flex justify-center ${getMainCardClasses()}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="relative">
            {/* The Image Asset - Constrained by height to fit viewport */}
            <img 
              src="https://raw.githubusercontent.com/gbunmi/images/main/Group%203%20(1).png" 
              alt="Hands holding an advice card"
              className="w-auto h-auto max-w-full max-h-[60dvh] md:max-h-[85dvh] select-none object-contain block"
              draggable={false}
            />
            
            {/* Content Overlay */}
            <div 
              onClick={onNext}
              className="absolute inset-0 flex flex-col items-center justify-center px-10 pb-12 md:px-24 md:pb-48 text-center cursor-pointer group"
            >
              
              <p className="text-lg md:text-3xl lg:text-4xl text-stone-800 font-serif leading-relaxed select-none max-w-[80%] md:max-w-xl">
                {displayAdvice}
              </p>

              {/* Instruction text positioned at the bottom of the paper area */}
              <p className="hidden md:block absolute bottom-[15%] md:bottom-44 text-stone-400 text-xs md:text-sm font-sans tracking-wide opacity-80 select-none group-hover:text-stone-500 transition-colors">
                press spacebar to shuffle
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
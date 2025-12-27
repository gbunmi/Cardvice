import { Category } from '../types';
import { CATEGORY_EMOJI_CODES } from '../constants';
import React, { useEffect, useState, useRef } from 'react';

interface CardDisplayProps {
  advice: string;
  category: Category;
  onNext: () => void;
  trigger: number;
}

type AnimationState = 'idle' | 'leaving' | 'entering';

const CardDisplay: React.FC<CardDisplayProps> = ({ advice, category, onNext, trigger }) => {
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [displayAdvice, setDisplayAdvice] = useState(advice);
  const [displayCategory, setDisplayCategory] = useState(category);
  const isFirstRender = useRef(true);
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      setAnimationState('leaving');
    }
  }, [trigger]);

  const handleAnimationEnd = () => {
    if (animationState === 'leaving') {
      setDisplayAdvice(advice);
      setDisplayCategory(category);
      setAnimationState('entering');
    } else if (animationState === 'entering') {
      setAnimationState('idle');
    }
  };

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

  const emojiUrl = displayCategory ? `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/64/${CATEGORY_EMOJI_CODES[displayCategory]}.png` : '';

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

      <div 
        className={`relative flex justify-center ${getMainCardClasses()}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="relative">
            <img 
              src="https://raw.githubusercontent.com/gbunmi/images/main/Group%203%20(1).png" 
              alt="Hands holding an advice card"
              className="w-auto h-auto max-w-full max-h-[60dvh] md:max-h-[85dvh] select-none object-contain block"
              draggable={false}
            />
            
            <div 
              onClick={onNext}
              className="absolute inset-0 flex flex-col items-center justify-center px-10 pb-12 md:px-24 md:pb-48 text-center cursor-pointer group"
            >
              {emojiUrl && (
                <img 
                  src={emojiUrl} 
                  alt="" 
                  className="w-10 h-10 md:w-14 md:h-14 mb-6 md:mb-10 object-contain select-none pointer-events-none opacity-90" 
                  draggable={false} 
                />
              )}
              
              <p className="text-lg md:text-3xl lg:text-4xl text-stone-800 font-serif leading-relaxed select-none max-w-[80%] md:max-w-xl">
                {displayAdvice}
              </p>

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
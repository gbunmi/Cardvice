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
  const [isCapturing, setIsCapturing] = useState(false);
  const isFirstRender = useRef(true);
  const prevTrigger = useRef(trigger);
  const captureRef = useRef<HTMLDivElement>(null);

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

  const handleCapture = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCapturing || !captureRef.current) return;
    
    setIsCapturing(true);
    
    try {
      // Ensure everything is settled
      await new Promise(r => setTimeout(r, 600));

      // @ts-ignore
      const canvas = await window.html2canvas(captureRef.current, {
        useCORS: true,
        allowTaint: false,
        scale: 2, // High resolution for download
        backgroundColor: '#FAFAF9',
        width: 1080,
        height: 1080,
        logging: false,
        imageTimeout: 15000,
      });
      
      const link = document.createElement('a');
      link.download = `cardvice-${displayCategory.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Failed to capture card:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const emojiUrl = displayCategory ? `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/64/${CATEGORY_EMOJI_CODES[displayCategory]}.png` : '';

  const libreStack = "'Libre Baskerville', serif";

  return (
    <div className="flex flex-col items-center justify-end w-full max-w-4xl mx-auto relative h-full">
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

      {/* 
        PRECISE 1080x1080 CAPTURE TEMPLATE
      */}
      <div id="capture-area">
        <div 
          ref={captureRef}
          style={{ 
            width: '1080px', 
            height: '1080px', 
            backgroundColor: '#FAFAF9', 
            position: 'relative', 
            overflow: 'hidden',
            fontFamily: libreStack,
            WebkitFontSmoothing: 'antialiased'
          }}
        >
          {/* Layer 1: Background Illustration */}
          <img 
            src="https://raw.githubusercontent.com/gbunmi/images/main/cardvice%20BG%204%20(1).png"
            alt=""
            crossOrigin="anonymous"
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '1080px', 
                height: '1080px', 
                objectFit: 'cover' 
            }}
          />
          
          {/* Layer 2: Hands + White Card Asset */}
          <img 
            src="https://raw.githubusercontent.com/gbunmi/images/main/Group%203%20(1).png" 
            alt=""
            crossOrigin="anonymous"
            style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: '40px', 
                width: '1000px', 
                height: 'auto', 
                zIndex: 10 
            }}
          />

          {/* Layer 3: Content Overlay */}
          <div style={{ position: 'absolute', top: '265px', left: '190px', width: '700px', height: '600px', zIndex: 20 }}>
             
             {/* 1. Emoji */}
             <div style={{ position: 'absolute', top: '105px', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
               <img 
                 src={emojiUrl} 
                 alt="" 
                 crossOrigin="anonymous"
                 style={{ width: '56px', height: '56px', objectFit: 'contain' }}
               />
             </div>

             {/* 2. Category Badge */}
             <div style={{ position: 'absolute', top: '185px', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
               <div style={{ 
                   backgroundColor: '#F5F5F4', 
                   color: '#78716C', 
                   padding: '6px 14px', 
                   borderRadius: '100px', 
                   fontSize: '13px', 
                   fontWeight: 700, 
                   textTransform: 'uppercase', 
                   letterSpacing: '0.12em',
                   fontFamily: libreStack,
                   opacity: 0.9
               }}>
                 {displayCategory}
               </div>
             </div>

             {/* 3. Advice Text */}
             <div style={{ 
                 position: 'absolute', 
                 top: '235px', 
                 bottom: '150px', 
                 left: '65px', 
                 right: '65px', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center' 
             }}>
                <p 
                  style={{ 
                    fontSize: '40px', 
                    lineHeight: '1.45', 
                    color: '#1C1917', 
                    fontWeight: 400,
                    textAlign: 'center',
                    margin: 0,
                    letterSpacing: '-0.02em',
                    fontStyle: 'normal',
                    fontFamily: libreStack
                  }}
                >
                  {displayAdvice}
                </p>
             </div>

             {/* 4. Watermark - Increased font size slightly as requested */}
             <div style={{ position: 'absolute', bottom: '102px', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                <p 
                  style={{ 
                    fontSize: '20px', 
                    color: '#78716C', 
                    fontWeight: 400,
                    letterSpacing: '0.05em', 
                    opacity: 0.8,
                    fontFamily: libreStack
                  }}
                >
                  cardvice.app
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Interactive UI */}
      <div 
        className={`relative flex justify-center mb-0 ${getMainCardClasses()}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="relative">
            {/* The Hands Image for UI */}
            <img 
              src="https://raw.githubusercontent.com/gbunmi/images/main/Group%203%20(1).png" 
              alt="Hands holding an advice card"
              className="w-auto h-auto max-w-full max-h-[60dvh] md:max-h-[85dvh] select-none object-contain block"
              draggable={false}
            />
            
            {/* Advice Content Area - Interactive UI */}
            <div 
              onClick={onNext}
              className="absolute inset-0 flex flex-col items-center justify-center px-10 pb-12 md:px-24 md:pb-48 text-center cursor-pointer"
            >
              {/* Emoji */}
              {emojiUrl && (
                <img 
                  src={emojiUrl} 
                  alt="" 
                  className="w-10 h-10 md:w-14 md:h-14 mb-4 md:mb-8 object-contain select-none pointer-events-none opacity-90" 
                  draggable={false} 
                />
              )}

              {/* Category Pill Badge */}
              <div 
                className="mb-4 md:mb-7 px-3 py-1 rounded-full bg-stone-100/80 text-stone-500 text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase border border-stone-200/50 font-serif"
              >
                {displayCategory}
              </div>
              
              <p className="text-xl md:text-3xl lg:text-4xl text-stone-800 font-serif leading-relaxed select-none max-w-[85%] md:max-w-xl">
                {displayAdvice}
              </p>

              {/* Spacebar Hint */}
              <p className="hidden md:block absolute bottom-[15%] md:bottom-44 text-stone-400 text-xs md:text-sm font-serif tracking-wide opacity-80 select-none hover:text-stone-500 transition-colors">
                press spacebar to shuffle
              </p>
            </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3">
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className={`
            p-2.5 md:p-3.5 rounded-xl bg-[#1E1E1E] border border-[#1E1E1E]
            ring-1 ring-inset ring-stone-400/30
            shadow-xl text-white hover:bg-black transition-all active:scale-95
            ${isCapturing ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
          `}
          aria-label="Download Square Shot"
        >
          {isCapturing ? (
            <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-[22px] md:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default CardDisplay;
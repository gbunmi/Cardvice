import { Category } from '../types';
import { CATEGORY_EMOJI_CODES } from '../constants';
import React, { useEffect, useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';

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

  const handleCapture = async () => {
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

             {/* 2. Category Badge - Improved visual style */}
             <div style={{ position: 'absolute', top: '185px', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
               <div style={{ 
                   backgroundColor: 'rgba(245, 245, 244, 0.85)', 
                   color: '#78716C', 
                   padding: '10px 22px', 
                   borderRadius: '100px', 
                   fontSize: '15px', 
                   fontWeight: 700, 
                   textTransform: 'uppercase', 
                   letterSpacing: '0.15em',
                   fontFamily: libreStack,
                   border: '1px solid rgba(231, 229, 228, 0.6)',
                   display: 'inline-flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   lineHeight: 1
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

             {/* 4. Watermark */}
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
                  cardvice
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
              className="absolute inset-x-0 top-0 bottom-[24%] flex flex-col items-center justify-center px-6 sm:px-12 md:px-16 text-center cursor-pointer select-none"
            >
              {/* Emoji */}
              {emojiUrl && (
                <img 
                  src={emojiUrl} 
                  alt="" 
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mb-3 sm:mb-4 md:mb-5 lg:mb-6 object-contain select-none pointer-events-none opacity-90" 
                  draggable={false} 
                />
              )}

              {/* Category Pill Badge */}
              <div 
                className="mb-4 sm:mb-5 md:mb-6 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-stone-100/80 text-stone-500 text-[7.5px] sm:text-[9px] md:text-xs font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase border border-stone-200/50 font-serif"
              >
                {displayCategory}
              </div>
              
              <p 
                className="text-stone-900 font-serif select-none max-w-[76%] md:max-w-xl text-[14.5px] sm:text-[17px] md:text-[20px] lg:text-[24px] xl:text-[28px] font-normal leading-[1.5] text-center"
              >
                {displayAdvice}
              </p>

              {/* Spacebar Hint */}
              <p className="hidden md:block absolute bottom-3 text-stone-400 text-[10px] md:text-xs font-serif tracking-wide opacity-80 select-none hover:text-stone-500 transition-colors">
                press spacebar to shuffle
              </p>
            </div>
        </div>
      </div>

      {/* Floating Action Button - Snap and Download */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8 md:right-8 z-50">
        <button
          id="btn-download-shot"
          onClick={handleCapture}
          disabled={isCapturing}
          className={`
            group flex items-center gap-1.5 md:gap-2.5 px-3.5 py-2 md:px-5 md:py-3.5 rounded-full 
            bg-stone-900 text-stone-50 border border-stone-800 
            shadow-xl hover:bg-stone-800 hover:shadow-2xl hover:-translate-y-0.5
            transition-all duration-250 active:scale-95 active:translate-y-0
            ${isCapturing ? 'opacity-75 cursor-wait' : 'cursor-pointer'}
          `}
          aria-label="Download Card Shot"
        >
          {isCapturing ? (
            <>
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-stone-400" />
              <span className="text-[11px] md:text-xs font-semibold uppercase tracking-widest font-sans text-stone-400">Saving...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 md:w-5 md:h-5 text-stone-200 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-[11px] md:text-xs font-bold font-sans text-stone-200 tracking-wide whitespace-nowrap">Save card</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CardDisplay;
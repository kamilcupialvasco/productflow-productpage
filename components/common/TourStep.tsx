import React, { useEffect, useRef } from 'react';
import { useTour } from '../../context/TourContext';

interface TourStepProps {
  target: string; // The CSS selector for the element to highlight
  title: string;
  content: string;
  children: React.ReactElement;
}

const TourStep: React.FC<TourStepProps> = ({ target, title, content, children }) => {
  const { isTourActive, currentStep, steps, nextStep, stopTour } = useTour();
  const stepConfig = steps.find(s => s.target === target);
  const isCurrentStep = isTourActive && stepConfig && steps[currentStep] === stepConfig;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCurrentStep && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrentStep]);

  if (!isTourActive || steps.length === 0) {
    return children;
  }
  
  const popover = isCurrentStep && (
    <div className="absolute z-[10001] w-72 bg-card border border-primary shadow-2xl rounded-lg p-4 top-full mt-3 left-1/2 -translate-x-1/2" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <h3 className="font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary">{content}</p>
        <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-text-secondary">{currentStep + 1} / {steps.length}</span>
            <div>
                 <button onClick={stopTour} className="text-xs px-3 py-1 mr-2 rounded-md hover:bg-zinc-800">Skip</button>
                <button onClick={nextStep} className="text-xs px-3 py-1 rounded-md bg-primary text-white">{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-primary"></div>
    </div>
  );

  return (
    <div ref={ref} className={`relative ${isCurrentStep ? 'z-[10000] tour-highlight' : ''}`}>
      {children}
      {popover}
      <style>{`
          .tour-highlight {
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
              border-radius: 8px;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default TourStep;

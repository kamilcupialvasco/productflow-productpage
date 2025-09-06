import React from 'react';

interface AIAnalysisModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card rounded-lg border border-border w-full max-w-xl transform transition-all animate-slide-up">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M6.343 18.343l-.707.707m12.728 0l-.707-.707M6.343 5.657l-.707-.707M12 21a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
            AI Analysis: {title}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-background text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans bg-zinc-800/50 p-4 rounded-md">{content}</pre>
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition">Close</button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        @keyframes slide-up { 0% { transform: translateY(20px); } 100% { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AIAnalysisModal;

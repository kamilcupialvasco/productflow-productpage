
import React, { useState } from 'react';

const ChatbotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-8 right-8 z-40">
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="bg-vasco-primary text-white rounded-full p-4 shadow-lg hover:bg-vasco-primary-hover transition-transform transform hover:scale-110"
                    aria-label="Toggle AI Assistant"
                >
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="fixed bottom-24 right-8 z-50 w-96 h-[60vh] bg-vasco-dark-card rounded-lg border border-vasco-dark-border shadow-2xl flex flex-col animate-slide-up-fade">
                    <header className="p-4 border-b border-vasco-dark-border flex justify-between items-center">
                        <h3 className="font-semibold text-vasco-text-primary">AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-vasco-text-secondary hover:text-vasco-text-primary">&times;</button>
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto space-y-4">
                        {/* Chat messages */}
                        <div className="flex">
                            <div className="bg-vasco-dark-bg rounded-lg p-3 max-w-xs">
                                <p className="text-sm">Hello! How can I help you analyze the feedback data today?</p>
                            </div>
                        </div>
                         <div className="flex justify-end">
                            <div className="bg-vasco-primary rounded-lg p-3 max-w-xs">
                                <p className="text-sm text-white">Show me all negative feedback related to battery life.</p>
                            </div>
                        </div>
                         <div className="flex">
                            <div className="bg-vasco-dark-bg rounded-lg p-3 max-w-xs flex items-center space-x-2">
                                <span className="animate-spin h-4 w-4 border-2 border-transparent border-t-vasco-primary rounded-full"></span>
                                <p className="text-sm text-vasco-text-secondary">Thinking...</p>
                            </div>
                        </div>
                    </main>
                    <footer className="p-4 border-t border-vasco-dark-border">
                        <div className="relative">
                             <input 
                                type="text" 
                                placeholder="Ask a question..." 
                                className="w-full bg-vasco-dark-bg border border-vasco-dark-border rounded-md pl-4 pr-10 py-2 text-sm focus:ring-vasco-primary focus:border-vasco-primary"
                            />
                            <button className="absolute inset-y-0 right-0 px-3 text-vasco-text-secondary hover:text-vasco-primary">
                               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </footer>
                </div>
            )}
             <style>{`
                @keyframes slide-up-fade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-slide-up-fade { animation: slide-up-fade 0.3s ease-out forwards; }
            `}</style>
        </>
    );
};

export default ChatbotWidget;

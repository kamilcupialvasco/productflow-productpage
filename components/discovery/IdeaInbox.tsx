

import React, { useState } from 'react';
import Header from '../common/Header';
import { Idea, Page } from '../../types';
// FIX: Correct import of `useAppContext` which is now properly exported from `AppContext.tsx`.
import { useAppContext } from '../../context/AppContext';

const StatusBadge: React.FC<{ status: Idea['status'] }> = ({ status }) => {
    const colors = {
        'New': 'bg-blue-500/20 text-blue-300',
        'Processing': 'bg-yellow-500/20 text-yellow-300',
        'Processed': 'bg-green-500/20 text-green-300',
        'Archived': 'bg-slate-500/20 text-slate-400',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>{status}</span>;
}

const IdeaCard: React.FC<{ idea: Idea, onSelect: () => void, isSelected: boolean }> = ({ idea, onSelect, isSelected }) => (
    <div 
        onClick={onSelect}
        className={`p-4 border-l-4 cursor-pointer transition-colors ${isSelected ? 'bg-vasco-primary/10 border-vasco-primary' : 'bg-vasco-dark-card/50 border-vasco-dark-border hover:bg-vasco-dark-card'}`}
    >
        <div className="flex justify-between items-start">
            <h4 className="font-semibold text-vasco-text-primary">{idea.title}</h4>
            <StatusBadge status={idea.status} />
        </div>
        <p className="text-xs text-vasco-text-secondary mt-1">Source: {idea.source}</p>
    </div>
);

interface IdeaDetailPanelProps {
    idea: Idea;
    navigateTo: (page: Page) => void;
}

const IdeaDetailPanel: React.FC<IdeaDetailPanelProps> = ({ idea, navigateTo }) => (
    <div className="p-6 bg-vasco-dark-card/30 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{idea.title}</h3>
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-vasco-primary mb-2">AI Summary</h4>
                <p className="text-sm p-3 bg-vasco-dark-bg rounded-md">{idea.aiSummary || 'AI analysis pending...'}</p>
            </div>
             <div>
                <h4 className="font-semibold text-vasco-primary mb-2">Potential Risks (AI Generated)</h4>
                {idea.aiRisks ? (
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {idea.aiRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                    </ul>
                ) : <p className="text-sm p-3 bg-vasco-dark-bg rounded-md">AI analysis pending...</p>}
            </div>
             <div>
                <h4 className="font-semibold text-vasco-primary mb-2">Next Steps</h4>
                 <div className="flex flex-wrap gap-2">
                    <button onClick={() => navigateTo('upstream/initiatives')} className="text-sm px-3 py-1.5 rounded-md bg-vasco-dark-border hover:bg-vasco-dark-border/70">Create Initiative</button>
                    <button className="text-sm px-3 py-1.5 rounded-md bg-vasco-dark-border hover:bg-vasco-dark-border/70">Link to Existing</button>
                    <button className="text-sm px-3 py-1.5 rounded-md bg-green-500/20 text-green-300 hover:bg-green-500/40">Mark as Processed</button>
                    <button className="text-sm px-3 py-1.5 rounded-md bg-slate-500/20 text-slate-300 hover:bg-slate-500/40">Archive</button>
                 </div>
            </div>
        </div>
    </div>
);

interface IdeaInboxProps {
    navigateTo: (page: Page, filters?: Record<string, any> | null) => void;
}

const IdeaInbox: React.FC<IdeaInboxProps> = ({ navigateTo }) => {
    const { ideas: initialIdeas } = useAppContext();
    const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(ideas[0] || null);
    
    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Idea Inbox" subtitle="Capture and triage all incoming product ideas." />
            <div className="flex-1 flex p-8 gap-8 overflow-hidden">
                <div className="w-1/3 flex-shrink-0 flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Inbox ({ideas.length})</h3>
                        <button className="px-3 py-1.5 text-sm rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover">Add Idea</button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {ideas.map(idea => (
                            <IdeaCard 
                                key={idea.id} 
                                idea={idea} 
                                onSelect={() => setSelectedIdea(idea)} 
                                isSelected={selectedIdea?.id === idea.id}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-2/3 flex-1 overflow-y-auto">
                    {selectedIdea ? (
                        <IdeaDetailPanel idea={selectedIdea} navigateTo={navigateTo} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-vasco-text-secondary">Select an idea to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IdeaInbox;
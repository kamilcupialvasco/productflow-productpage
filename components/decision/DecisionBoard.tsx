import React, { useState } from 'react';
import Header from '../common/Header';
import { mockDiscoveryItems } from '../../services/mockData';
import { DiscoveryItem, DiscoveryItemStatus } from '../../types';
import DecisionDetailModal from './DecisionDetailModal';

const columns: DiscoveryItemStatus[] = ['Idea', 'Under Consideration', 'Data Gathering', 'Approved', 'Rejected'];

const RiskBadge: React.FC<{ score: number }> = ({ score }) => {
    const color = score > 70 ? 'bg-red-500/50 text-red-300' : score > 40 ? 'bg-yellow-500/50 text-yellow-300' : 'bg-green-500/50 text-green-300';
    return <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>Risk: {score}</span>
};

const DecisionCard: React.FC<{ decision: DiscoveryItem, onClick: () => void }> = ({ decision, onClick }) => (
    <div onClick={onClick} className="bg-background p-3 rounded-md border border-border/50 cursor-pointer hover:border-primary transition-all">
        <h4 className="font-semibold text-sm text-text-primary">{decision.title}</h4>
        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{decision.summary}</p>
        <div className="flex justify-between items-center mt-3">
            <RiskBadge score={decision.riskPoints} />
            <span className="text-xs font-mono px-1.5 py-0.5 bg-border rounded">Conf: {decision.confidence}%</span>
        </div>
    </div>
);

const AddDecisionModal: React.FC<{ onClose: () => void, onSave: (title: string, summary: string, risk: number) => void }> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [riskPoints, setRiskPoints] = useState(50);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg border border-border w-full max-w-lg">
                 <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">New Decision Idea</h3></div>
                 <div className="p-6 space-y-4">
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Decision Title" className="w-full bg-background p-2 rounded"/>
                    <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Brief summary..." className="w-full bg-background p-2 rounded" rows={3}/>
                    <div>
                        <label className="text-sm">Initial Risk Score</label>
                        <input type="range" min="0" max="100" value={riskPoints} onChange={e => setRiskPoints(parseInt(e.target.value))} className="w-full mt-1"/>
                    </div>
                 </div>
                 <div className="p-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-border">Cancel</button>
                    <button onClick={() => { onSave(title, summary, riskPoints); onClose(); }} className="px-4 py-2 rounded bg-primary text-white">Add Idea</button>
                 </div>
            </div>
        </div>
    )
}

const DecisionBoard: React.FC = () => {
    const [decisions, setDecisions] = useState<DiscoveryItem[]>(mockDiscoveryItems);
    const [selectedDecision, setSelectedDecision] = useState<DiscoveryItem | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSaveDecision = (updatedDecision: DiscoveryItem) => {
        setDecisions(prev => prev.map(d => d.id === updatedDecision.id ? updatedDecision : d));
        setSelectedDecision(null);
    };

    const handleAddDecision = (title: string, summary: string, riskPoints: number) => {
        const newDecision: DiscoveryItem = {
            id: `d-${Date.now()}`,
            title,
            summary,
            status: 'Idea',
            confidence: 50,
            riskPoints,
            unknowns: [],
            history: [{ user: 'Current User', date: new Date().toISOString(), change: 'Created' }]
        };
        setDecisions(prev => [newDecision, ...prev]);
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Decision Board" subtitle="Track and manage key product decisions." />
            <div className="px-8 pt-4">
                <button onClick={() => setIsAdding(true)} className="px-4 py-2 rounded-md bg-primary text-white">Add Decision</button>
            </div>
            <div className="flex-1 p-8 pt-4 overflow-x-auto">
                <div className="flex space-x-6">
                    {columns.map(col => (
                        <div key={col} className="w-80 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-text-primary mb-4 px-2">{col} ({decisions.filter(d=>d.status === col).length})</h3>
                            <div className="space-y-3 p-2 rounded-lg bg-card/50 min-h-[500px]">
                                {decisions
                                    .filter(d => d.status === col)
                                    .map(d => <DecisionCard key={d.id} decision={d} onClick={() => setSelectedDecision(d)} />)
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedDecision && (
                <DecisionDetailModal 
                    decision={selectedDecision}
                    onClose={() => setSelectedDecision(null)}
                    onSave={handleSaveDecision}
                />
            )}
            {isAdding && <AddDecisionModal onClose={() => setIsAdding(false)} onSave={handleAddDecision} />}
        </div>
    );
};

export default DecisionBoard;
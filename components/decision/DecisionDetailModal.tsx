import React, { useState, useEffect } from 'react';
import { DiscoveryItem, DiscoveryItemStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';

const columns: DiscoveryItemStatus[] = ['Idea', 'Under Consideration', 'Data Gathering', 'Approved', 'Rejected'];

interface DecisionDetailModalProps {
  decision: DiscoveryItem;
  onClose: () => void;
  onSave: (decision: DiscoveryItem) => void;
}

const DecisionDetailModal: React.FC<DecisionDetailModalProps> = ({ decision, onClose, onSave }) => {
  const { objectives } = useAppContext();
  const [editedDecision, setEditedDecision] = useState(decision);
  const [activeTab, setActiveTab] = useState('notes');
  const [editableUnknowns, setEditableUnknowns] = useState(decision.unknowns.join('\n'));
  const [editableAiAnalysis, setEditableAiAnalysis] = useState(decision.aiAnalysis || '');

  useEffect(() => {
    setEditableUnknowns(decision.unknowns.join('\n'));
    setEditableAiAnalysis(decision.aiAnalysis || `AI analysis for "${decision.title}" has not been generated yet.`);
  }, [decision]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedDecision(prev => ({ ...prev, [name]: ['confidence', 'riskPoints'].includes(name) ? parseInt(value) : value }));
  };
  
  const handleSave = () => {
      const updatedUnknowns = editableUnknowns.split('\n').filter(u => u.trim() !== '');
      const newHistory = { user: 'Current User', date: new Date().toISOString(), change: 'Details updated' };
      onSave({...editedDecision, unknowns: updatedUnknowns, aiAnalysis: editableAiAnalysis, history: [...(editedDecision.history || []), newHistory]});
  };

  const handleGenerateUnknowns = () => {
      const mockNewUnknowns = [
          ...editableUnknowns.split('\n').filter(u => u.trim()),
          "What is the estimated impact on user satisfaction (NPS)?",
          "Are there any legal or compliance considerations?",
      ].filter((v, i, a) => a.indexOf(v) === i);
      setEditableUnknowns(mockNewUnknowns.join('\n'));
  }

  return (
    <>
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card rounded-lg border border-border w-full max-w-3xl transform transition-all animate-slide-up flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Decision Details</h3>
              <input type="text" name="title" value={editedDecision.title} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold focus:outline-none" />
            </div>
            <div className="flex items-center space-x-2">
                <button className="text-sm px-3 py-1 rounded-md bg-border hover:bg-zinc-600">Export to PDF</button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-background text-2xl leading-none">&times;</button>
            </div>
        </div>
        <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="text-sm text-text-secondary">Status</label>
                    <select name="status" value={editedDecision.status} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-1.5 mt-1">
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-text-secondary">Risk Points ({editedDecision.riskPoints})</label>
                    <input type="range" name="riskPoints" value={editedDecision.riskPoints} onChange={handleChange} min="0" max="100" className="w-full mt-1" />
                </div>
                 <div>
                    <label className="text-sm text-text-secondary">Confidence (%)</label>
                    <input type="number" name="confidence" value={editedDecision.confidence} onChange={handleChange} min="0" max="100" className="w-full bg-background border border-border rounded-md px-3 py-1.5 mt-1" />
                </div>
                 <div>
                    <label className="text-sm text-text-secondary">Linked Strategy</label>
                     <select name="linkedStrategyId" value={editedDecision.linkedStrategyId || ''} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-1.5 mt-1">
                        <option value="">None</option>
                        {objectives.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                    </select>
                </div>
            </div>
             <div>
                <label className="text-sm text-text-secondary">Summary</label>
                <textarea name="summary" value={editedDecision.summary} onChange={handleChange} rows={2} className="w-full bg-background border border-border rounded-md px-3 py-1.5 mt-1" />
            </div>

            <div className="border-t border-border pt-4">
                 <div className="flex border-b border-border">
                    <button onClick={() => setActiveTab('notes')} className={`px-4 py-2 text-sm ${activeTab === 'notes' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>Notes</button>
                    <button onClick={() => setActiveTab('unknowns')} className={`px-4 py-2 text-sm ${activeTab === 'unknowns' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>Unknowns</button>
                    <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>History</button>
                </div>
                <div className="pt-4 min-h-[150px]">
                    {activeTab === 'notes' && (
                        <textarea name="notes" value={editedDecision.notes || ''} onChange={handleChange} rows={5} placeholder="Add detailed notes and justification..." className="w-full bg-background border border-border rounded-md px-3 py-1.5" />
                    )}
                    {activeTab === 'unknowns' && (
                        <div>
                            <p className="text-xs text-text-secondary mb-2">List of questions and information gaps that need to be addressed to reduce risk and increase confidence. Use the AI assistant to get started.</p>
                            <textarea value={editableUnknowns} onChange={e => setEditableUnknowns(e.target.value)} rows={5} className="w-full bg-background border border-border rounded-md px-3 py-1.5" />
                            <div className="flex justify-between items-center mt-2">
                                <button onClick={handleGenerateUnknowns} className="text-sm px-3 py-1 rounded-md bg-primary/20 text-primary">Regenerate with AI</button>
                                <button onClick={() => setEditedDecision({...editedDecision, unknowns: editableUnknowns.split('\n').filter(u => u.trim())})} className="text-sm px-3 py-1 rounded-md bg-primary/20 text-primary">Save Unknowns</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <ul className="space-y-2 text-sm">
                            {editedDecision.history?.map((h, i) => (
                                <li key={i} className="flex justify-between p-2 bg-background rounded-md">
                                    <span>{h.change} by <span className="font-semibold">{h.user}</span></span>
                                    <span className="text-text-secondary">{new Date(h.date).toLocaleString()}</span>
                                </li>
                            )).reverse()}
                        </ul>
                    )}
                </div>
            </div>
        </div>
        <div className="p-4 border-t border-border flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-border text-text-primary hover:bg-zinc-600 transition">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition">Save Decision</button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        @keyframes slide-up { 0% { transform: translateY(20px); } 100% { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.2s ease-out forwards; }
      `}</style>
    </div>
    </>
  );
};

export default DecisionDetailModal;
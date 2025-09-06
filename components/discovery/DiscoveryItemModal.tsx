import React, { useState, useEffect } from 'react';
import { DiscoveryItem, DiscoveryItemStatus } from '../../types';
import { mockObjectives } from '../../services/mockData';

const columns: DiscoveryItemStatus[] = ['Idea', 'Under Consideration', 'Data Gathering', 'Approved', 'Rejected'];

interface DiscoveryItemModalProps {
  item: DiscoveryItem;
  onClose: () => void;
  onSave: (item: DiscoveryItem) => void;
}

const DiscoveryItemModal: React.FC<DiscoveryItemModalProps> = ({ item, onClose, onSave }) => {
  const [editedItem, setEditedItem] = useState(item);
  const [activeTab, setActiveTab] = useState('notes');
  const [editableUnknowns, setEditableUnknowns] = useState(item.unknowns.join('\n'));
  
  useEffect(() => {
    setEditableUnknowns(item.unknowns.join('\n'));
  }, [item]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({ ...prev, [name]: ['confidence', 'riskPoints'].includes(name) ? parseInt(value) : value }));
  };
  
  const handleSave = () => {
      const updatedUnknowns = editableUnknowns.split('\n').filter(u => u.trim() !== '');
      const newHistory = { user: 'Current User', date: new Date().toISOString(), change: 'Details updated' };
      onSave({...editedItem, unknowns: updatedUnknowns, history: [...(editedItem.history || []), newHistory]});
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
      <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border w-full max-w-3xl transform transition-all animate-slide-up flex flex-col">
        <div className="p-4 border-b border-vasco-dark-border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Decision Details</h3>
              <input type="text" name="title" value={editedItem.title} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold focus:outline-none" />
            </div>
            <div className="flex items-center space-x-2">
                <button className="text-sm px-3 py-1 rounded-md bg-vasco-dark-border hover:bg-vasco-dark-border/70">Export to PDF</button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-vasco-dark-bg text-2xl leading-none">&times;</button>
            </div>
        </div>
        <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="text-sm text-vasco-text-secondary">Status</label>
                    <select name="status" value={editedItem.status} onChange={handleChange} className="w-full bg-vasco-dark-bg border border-vasco-dark-border rounded-md px-3 py-1.5 mt-1">
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-vasco-text-secondary">Risk Points ({editedItem.riskPoints})</label>
                    <input type="range" name="riskPoints" value={editedItem.riskPoints} onChange={handleChange} min="0" max="100" className="w-full mt-1" />
                </div>
                 <div>
                    <label className="text-sm text-vasco-text-secondary">Confidence (%)</label>
                    <input type="number" name="confidence" value={editedItem.confidence} onChange={handleChange} min="0" max="100" className="w-full bg-vasco-dark-bg border border-vasco-dark-border rounded-md px-3 py-1.5 mt-1" />
                </div>
                 <div>
                    <label className="text-sm text-vasco-text-secondary">Linked Strategy</label>
                     <select name="linkedStrategyId" value={editedItem.linkedStrategyId || ''} onChange={handleChange} className="w-full bg-vasco-dark-bg border border-vasco-dark-border rounded-md px-3 py-1.5 mt-1">
                        <option value="">None</option>
                        {mockObjectives.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                    </select>
                </div>
            </div>
             <div>
                <label className="text-sm text-vasco-text-secondary">Summary</label>
                <textarea name="summary" value={editedItem.summary} onChange={handleChange} rows={2} className="w-full bg-vasco-dark-bg border border-vasco-dark-border rounded-md px-3 py-1.5 mt-1" />
            </div>

            <div className="border-t border-vasco-dark-border pt-4">
                 <div className="flex border-b border-vasco-dark-border">
                    <button onClick={() => setActiveTab('notes')} className={`px-4 py-2 text-sm ${activeTab === 'notes' ? 'border-b-2 border-vasco-primary text-vasco-primary' : 'text-vasco-text-secondary'}`}>Notes</button>
                    <button onClick={() => setActiveTab('unknowns')} className={`px-4 py-2 text-sm ${activeTab === 'unknowns' ? 'border-b-2 border-vasco-primary text-vasco-primary' : 'text-vasco-text-secondary'}`}>Unknowns</button>
                    <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm ${activeTab === 'history' ? 'border-b-2 border-vasco-primary text-vasco-primary' : 'text-vasco-text-secondary'}`}>History</button>
                </div>
                <div className="pt-4 min-h-[150px]">
                    {activeTab === 'notes' && (
                        <textarea name="notes" value={editedItem.notes || ''} onChange={handleChange} rows={5} placeholder="Add detailed notes and justification..." className="w-full bg-vasco-dark-bg border border-vasco-dark-border rounded-md px-3 py-1.5" />
                    )}
                    {activeTab === 'unknowns' && (
                        <div>
                            <p className="text-xs text-vasco-text-secondary mb-2">List of questions and information gaps that need to be addressed to reduce risk and increase confidence. Use the AI assistant to get started.</p>
                            <textarea value={editableUnknowns} onChange={e => setEditableUnknowns(e.target.value)} rows={5} className="w-full bg-vasco-dark-bg border border-vasco-dark-border rounded-md px-3 py-1.5" />
                            <div className="flex justify-between items-center mt-2">
                                <button onClick={handleGenerateUnknowns} className="text-sm px-3 py-1 rounded-md bg-vasco-primary/20 text-vasco-primary">Regenerate with AI</button>
                                <button onClick={() => setEditedItem({...editedItem, unknowns: editableUnknowns.split('\n').filter(u => u.trim())})} className="text-sm px-3 py-1 rounded-md bg-vasco-primary/20 text-vasco-primary">Save Unknowns</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <ul className="space-y-2 text-sm">
                            {editedItem.history?.map((h, i) => (
                                <li key={i} className="flex justify-between p-2 bg-vasco-dark-bg rounded-md">
                                    <span>{h.change} by <span className="font-semibold">{h.user}</span></span>
                                    <span className="text-vasco-text-secondary">{new Date(h.date).toLocaleString()}</span>
                                </li>
                            )).reverse()}
                        </ul>
                    )}
                </div>
            </div>
        </div>
        <div className="p-4 border-t border-vasco-dark-border flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-vasco-dark-border text-vasco-text-primary hover:bg-vasco-dark-border/70 transition">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover transition">Save</button>
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

export default DiscoveryItemModal;



import React, { useState, useEffect } from 'react';
import { UpstreamInitiative, UpstreamStatus, ChecklistItem, Feedback } from '../../types';
// FIX: Correct import of `useAppContext` which is now properly exported from `AppContext.tsx`.
import { useAppContext } from '../../context/AppContext';
import AIWizardModal from './AIWizardModal';
import LinkItemModal from '../common/LinkItemModal';

const columns: UpstreamStatus[] = ['Backlog', 'Analysing Opportunity', 'Initial Research', 'Deep Research', 'Input for Discussion', 'Parked', 'Waiting for Development', 'In Development', 'Released', 'Done'];

interface InitiativeDetailModalProps {
  item: UpstreamInitiative;
  onClose: () => void;
  onSave: (item: UpstreamInitiative) => void;
}

const InitiativeDetailModal: React.FC<InitiativeDetailModalProps> = ({ item, onClose, onSave }) => {
  const { objectives, feedbackClusters, updateUpstreamInitiative } = useAppContext();
  const [editedItem, setEditedItem] = useState(item);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('checklist');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isLinkingFeedback, setIsLinkingFeedback] = useState(false);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({ ...prev, [name]: value }));
  };

  const handleChecklistItemToggle = (id: string) => {
      const newChecklist = editedItem.checklist?.map(ci => ci.id === id ? {...ci, isDone: !ci.isDone} : ci);
      setEditedItem(prev => ({...prev, checklist: newChecklist}));
  }
  
  const handleAddChecklistItem = () => {
    if(!newChecklistItem.trim()) return;
    const newItem: ChecklistItem = { id: `manual-${Date.now()}`, text: newChecklistItem, isDone: false, isAiGenerated: false };
    setEditedItem(prev => ({ ...prev, checklist: [...(prev.checklist || []), newItem]}));
    setNewChecklistItem('');
  }

  const handleSave = () => {
      onSave(editedItem);
  };
  
  const handleWizardSave = (generatedContent: { summary: string }) => {
    setEditedItem(prev => ({ ...prev, summary: prev.summary + "\n\n--- AI Generated Content ---\n" + generatedContent.summary }));
    setIsWizardOpen(false);
  };
  
  const handleFeedbackLink = (newLinkedIds: string[]) => {
      setEditedItem(prev => ({...prev, linkedFeedbackIds: newLinkedIds}));
  }


  const TraceabilityTab: React.FC = () => {
      const linkedFeedback = feedbackClusters.filter(fb => editedItem.linkedFeedbackIds?.includes(fb.id));
      const linkedOkr = objectives.flatMap(o => o.keyResults).find(kr => kr.id === editedItem.linkedOKRId);

      return (
          <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Linked OKR</h4>
                {linkedOkr ? <div className="p-2 bg-vasco-dark-bg rounded-md">{linkedOkr.text}</div> : <p className="text-sm text-vasco-text-secondary">None</p>}
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Linked Feedback Clusters ({linkedFeedback.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {linkedFeedback.map(fb => <div key={fb.id} className="p-2 bg-vasco-dark-bg rounded-md text-sm">{fb.title}</div>)}
                </div>
              </div>
          </div>
      )
  };


  return (
    <>
    {isWizardOpen && <AIWizardModal item={editedItem} onClose={() => setIsWizardOpen(false)} onSave={handleWizardSave} />}
    {isLinkingFeedback && (
        <LinkItemModal 
            isOpen={true}
            onClose={() => setIsLinkingFeedback(false)}
            title="Link Feedback Clusters"
            items={feedbackClusters}
            linkedIds={editedItem.linkedFeedbackIds || []}
            onLink={handleFeedbackLink}
        />
    )}
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border w-full max-w-3xl transform transition-all animate-slide-up flex flex-col h-[90vh]">
        <div className="p-4 border-b border-vasco-dark-border flex justify-between items-center">
            <input value={editedItem.title} name="title" onChange={handleChange} className="bg-transparent text-lg font-semibold w-full focus:outline-none" />
            <button onClick={onClose} className="p-2 rounded-full hover:bg-vasco-dark-bg text-2xl leading-none">&times;</button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {/* ... form fields ... */}
            <div className="border-b border-vasco-dark-border">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('checklist')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'checklist' ? 'border-vasco-primary text-vasco-primary' : 'border-transparent text-vasco-text-secondary'}`}>Checklist</button>
                    <button onClick={() => setActiveTab('links')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'links' ? 'border-vasco-primary text-vasco-primary' : 'border-transparent text-vasco-text-secondary'}`}>Linked Items</button>
                    <button onClick={() => setActiveTab('traceability')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'traceability' ? 'border-vasco-primary text-vasco-primary' : 'border-transparent text-vasco-text-secondary'}`}>Traceability</button>
                    <button onClick={() => setActiveTab('history')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'history' ? 'border-vasco-primary text-vasco-primary' : 'border-transparent text-vasco-text-secondary'}`}>History</button>
                </nav>
            </div>
            <div className="py-4">
                {activeTab === 'checklist' && (
                    <div className="space-y-2">
                        {editedItem.checklist?.map(check => (
                             <div key={check.id} className="flex items-start space-x-3 p-2 bg-vasco-dark-bg/50 rounded-md">
                                <input type="checkbox" checked={check.isDone} onChange={() => handleChecklistItemToggle(check.id)} className="mt-1 h-4 w-4"/>
                                <label className={`flex-1 text-sm ${check.isDone ? 'line-through text-vasco-text-secondary' : ''}`}>{check.text}</label>
                            </div>
                        ))}
                         <div className="flex space-x-2 pt-2">
                            <input value={newChecklistItem} onChange={e => setNewChecklistItem(e.target.value)} placeholder="Add new checklist item..." className="flex-1 bg-vasco-dark-bg p-2 rounded text-sm"/>
                            <button onClick={handleAddChecklistItem} className="px-3 py-1 rounded bg-vasco-dark-border text-sm">Add</button>
                        </div>
                    </div>
                )}
                 {activeTab === 'links' && (
                     <div className="space-y-4">
                        <button onClick={() => setIsLinkingFeedback(true)} className="text-sm px-3 py-1.5 rounded-md bg-vasco-dark-border">Link Feedback ({editedItem.linkedFeedbackIds?.length || 0})...</button>
                        {/* Add Solution linking here when available */}
                    </div>
                 )}
                  {activeTab === 'traceability' && <TraceabilityTab />}
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
        <div className="p-4 border-t border-vasco-dark-border flex justify-between items-center">
            <div>
                 <button onClick={() => alert("Review requested!")} className="px-3 py-1.5 rounded-md bg-vasco-dark-border text-vasco-text-primary hover:bg-vasco-dark-border/70 transition text-sm mr-2">Request Review</button>
            </div>
            <div className="flex space-x-2">
                <button onClick={onClose} className="px-4 py-2 rounded-md bg-vasco-dark-border">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-md bg-vasco-primary text-white">Save</button>
            </div>
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

export default InitiativeDetailModal;


import React, { useState, useMemo } from 'react';
import { Hypothesis, HypothesisStatus, Feedback, Objective } from '../../types';
// FIX: Correct import of `useAppContext` which is now properly exported from `AppContext.tsx`.
import { useAppContext } from '../../context/AppContext';

const TagInput: React.FC<{ tags: string[]; onChange: (tags: string[]) => void }> = ({ tags, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                onChange([...tags, newTag]);
            }
            setInputValue('');
        }
    };
    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };
    return (
        <div>
            <div className="flex flex-wrap gap-2 p-2 bg-vasco-dark-bg border border-vasco-dark-border rounded-md">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center bg-vasco-primary/20 text-vasco-primary text-xs px-2 py-1 rounded">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1.5 text-vasco-primary/70 hover:text-vasco-primary">&times;</button>
                    </span>
                ))}
                <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tags..."
                    className="flex-1 bg-transparent focus:outline-none text-sm"
                />
            </div>
        </div>
    );
};

interface HypothesisDetailModalProps {
    hypothesis: Hypothesis | null;
    onClose: () => void;
    onSave: (hypothesis: Hypothesis) => void;
}

const HypothesisDetailModal: React.FC<HypothesisDetailModalProps> = ({ hypothesis, onClose, onSave }) => {
    const { feedbackClusters, objectives } = useAppContext();
    const [edited, setEdited] = useState<Hypothesis | null>(hypothesis);

    if (!edited) return null;

    const handleMultiSelectChange = (field: 'linkedFeedbackIds' | 'linkedOutcomeIds', selectedOptions: any) => {
        const selectedIds = Array.from(selectedOptions, (option: any) => option.value);
        setEdited({ ...edited, [field]: selectedIds });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border w-full max-w-2xl transform transition-all animate-slide-up flex flex-col">
                <div className="p-4 border-b border-vasco-dark-border">
                    <input value={edited.title} onChange={e => setEdited({ ...edited, title: e.target.value })} className="w-full bg-transparent text-lg font-semibold focus:outline-none" />
                </div>
                <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm">Status</label>
                            <select value={edited.status} onChange={e => setEdited({...edited, status: e.target.value as HypothesisStatus})} className="w-full bg-vasco-dark-bg p-2 rounded mt-1">
                                {['New', 'Validating', 'Proven', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">Certainty ({edited.certainty})</label>
                            <input type="range" value={edited.certainty} onChange={e => setEdited({...edited, certainty: parseInt(e.target.value)})} className="w-full mt-1" />
                        </div>
                        <div>
                            <label className="text-sm">Impact ({edited.impact})</label>
                            <input type="range" value={edited.impact} onChange={e => setEdited({...edited, impact: parseInt(e.target.value)})} className="w-full mt-1" />
                        </div>
                        <div>
                            <label className="text-sm">Difficulty ({edited.difficulty})</label>
                            <input type="range" value={edited.difficulty} onChange={e => setEdited({...edited, difficulty: parseInt(e.target.value)})} className="w-full mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm">Description</label>
                        <textarea value={edited.description} onChange={e => setEdited({...edited, description: e.target.value})} rows={3} className="w-full bg-vasco-dark-bg p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="text-sm">Tags</label>
                        <TagInput tags={edited.tags || []} onChange={tags => setEdited({...edited, tags})} />
                    </div>
                    <div>
                        <label className="text-sm">Linked Feedback</label>
                        <select multiple value={edited.linkedFeedbackIds} onChange={e => handleMultiSelectChange('linkedFeedbackIds', e.target.selectedOptions)} className="w-full h-24 bg-vasco-dark-bg p-2 rounded mt-1">
                            {feedbackClusters.map(fb => <option key={fb.id} value={fb.id}>{fb.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm">Linked Expected Outcomes (KRs)</label>
                         <select multiple value={edited.linkedOutcomeIds || []} onChange={e => handleMultiSelectChange('linkedOutcomeIds', e.target.selectedOptions)} className="w-full h-24 bg-vasco-dark-bg p-2 rounded mt-1">
                            {objectives.flatMap(o => o.keyResults).map(kr => <option key={kr.id} value={kr.id}>{kr.text}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 border-t border-vasco-dark-border flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-vasco-dark-border">Cancel</button>
                    <button onClick={() => onSave(edited)} className="px-4 py-2 rounded-md bg-vasco-primary text-white">Save</button>
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

export default HypothesisDetailModal;
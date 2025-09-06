
import React, { useState } from 'react';
import Header from '../../components/common/Header';
import { mockContexts, mockPersonas } from '../../services/mockData';
import { TranslationContext, Persona } from '../../types';

const ContextModal: React.FC<{
    context: TranslationContext | null;
    onClose: () => void;
    onSave: (context: TranslationContext) => void;
}> = ({ context, onClose, onSave }) => {
    const [formData, setFormData] = useState(context || { id: '', name: '', description: '', linkedPersonaIds: [] });

    const handlePersonaToggle = (id: string) => {
        const currentIds = formData.linkedPersonaIds;
        if (currentIds.includes(id)) {
            setFormData({...formData, linkedPersonaIds: currentIds.filter(pId => pId !== id)});
        } else {
            setFormData({...formData, linkedPersonaIds: [...currentIds, id]});
        }
    }

    const handleSave = () => {
        onSave(formData.id ? formData : {...formData, id: `ctx-${Date.now()}`});
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-card rounded-lg w-full max-w-lg">
                <div className="p-4 border-b border-border"><h3>{context ? 'Edit' : 'Add'} Context</h3></div>
                <div className="p-6 space-y-4">
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Context Name" className="w-full bg-background p-2 rounded"/>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description..." className="w-full bg-background p-2 rounded h-24"/>
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Linked Personas</h4>
                        <div className="flex flex-wrap gap-2">
                            {mockPersonas.map(p => (
                                <button 
                                    key={p.id} 
                                    onClick={() => handlePersonaToggle(p.id)}
                                    className={`px-3 py-1.5 text-xs rounded-full border ${formData.linkedPersonaIds.includes(p.id) ? 'bg-primary border-primary text-white' : 'border-border hover:bg-border'}`}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="p-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-border">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded bg-primary text-white">Save</button>
                 </div>
            </div>
        </div>
    )
}

const Contexts: React.FC = () => {
    const [contexts, setContexts] = useState<TranslationContext[]>(mockContexts);
    const [editingContext, setEditingContext] = useState<TranslationContext | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = (context: TranslationContext) => {
        if (contexts.find(c => c.id === context.id)) {
            setContexts(contexts.map(c => c.id === context.id ? context : c));
        } else {
            setContexts([...contexts, context]);
        }
        setEditingContext(null);
        setIsAdding(false);
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Translation Contexts" subtitle="Manage common situations and scenarios for product use." />
            <div className="p-8">
                <div className="flex justify-end mb-6">
                    <button onClick={() => setIsAdding(true)} className="px-4 py-2 rounded-md bg-primary text-white">Add Context</button>
                </div>
                <div className="space-y-4">
                    {contexts.map(ctx => (
                        <div key={ctx.id} className="p-4 bg-card rounded-lg border border-border flex justify-between items-start">
                           <div>
                             <h3 className="font-semibold text-lg text-text-primary">{ctx.name}</h3>
                             <p className="text-sm text-text-secondary mt-1">{ctx.description}</p>
                             <div className="mt-3 flex flex-wrap gap-2">
                                {ctx.linkedPersonaIds.map(pId => {
                                    const persona = mockPersonas.find(p => p.id === pId);
                                    return <span key={pId} className="px-2 py-1 text-xs rounded-full bg-background flex items-center">
                                        <img src={persona?.avatarUrl} className="w-4 h-4 rounded-full mr-1.5" />
                                        {persona?.name}
                                    </span>
                                })}
                             </div>
                           </div>
                           <button onClick={() => setEditingContext(ctx)} className="text-sm text-primary hover:underline">Edit</button>
                        </div>
                    ))}
                </div>
            </div>
            {(editingContext || isAdding) && (
                <ContextModal 
                    context={editingContext}
                    onClose={() => { setEditingContext(null); setIsAdding(false); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Contexts;
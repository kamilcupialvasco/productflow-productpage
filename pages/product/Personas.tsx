
import React, { useState } from 'react';
import Header from '../../components/common/Header';
import { mockPersonas, mockInsightData } from '../../services/mockData';
import { Persona, PersonaPoint, Page } from '../../types';

const PersonaCard: React.FC<{ persona: Persona, onEdit: () => void, navigateTo: (page: Page) => void }> = ({ persona, onEdit, navigateTo }) => (
    <div className="bg-card rounded-lg border border-border p-6 text-center flex flex-col transition-shadow hover:shadow-xl hover:border-primary/50">
        <div className="relative">
            <img src={persona.avatarUrl} alt={persona.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-border" />
            <button onClick={onEdit} className="absolute top-0 right-1/2 translate-x-12 p-1.5 bg-primary rounded-full text-xs leading-none hover:bg-primary-hover transition-transform hover:scale-110">✎</button>
        </div>
        <h3 className="text-xl font-semibold text-text-primary">{persona.name}</h3>
        <p className="text-primary font-medium">{persona.role}</p>
        <div className="my-4 flex justify-around text-sm border-y border-border py-2">
            <div><span className="font-bold text-lg">{persona.metrics.customerPercentage}%</span> <span className="text-xs text-text-secondary">Customers</span></div>
            <div><span className="font-bold text-lg">{persona.metrics.userPercentage}%</span> <span className="text-xs text-text-secondary">Users</span></div>
        </div>
        <div className="text-left mt-2 flex-1">
            <h4 className="font-semibold text-sm mb-1">Pain Points:</h4>
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                {persona.painPoints.slice(0,2).map(p => <li key={p.id}>{p.text}</li>)}
            </ul>
             <h4 className="font-semibold text-sm mt-3 mb-1">Gain Points:</h4>
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                {persona.gainPoints.slice(0,1).map(g => <li key={g.id}>{g.text}</li>)}
            </ul>
        </div>
         <button onClick={() => navigateTo('product/contexts')} className="text-xs text-primary mt-4 hover:underline">View Usage Contexts</button>
    </div>
);

const EditablePoint: React.FC<{ point: PersonaPoint, onChange: (id: string, text: string) => void, onRemove: (id: string) => void }> = ({ point, onChange, onRemove }) => (
    <div className="flex items-center space-x-2">
        <input value={point.text} onChange={e => onChange(point.id, e.target.value)} className="flex-1 bg-background p-2 rounded text-sm"/>
        <button onClick={() => onRemove(point.id)} className="text-red-500 hover:text-red-400">&times;</button>
    </div>
);

const PersonaModal: React.FC<{
    persona: Persona | null;
    onClose: () => void;
    onSave: (persona: Persona) => void;
}> = ({ persona, onClose, onSave }) => {
    const [formData, setFormData] = useState(persona || { id: '', name: '', role: '', avatarUrl: 'https://i.pravatar.cc/150', goals: [], painPoints: [], gainPoints: [], metrics: { customerPercentage: 0, userPercentage: 0 } });
    const [aiSuggestions, setAiSuggestions] = useState<PersonaPoint[]>([]);

    const handlePointChange = (type: 'painPoints' | 'gainPoints', id: string, text: string) => {
        setFormData(prev => ({ ...prev, [type]: prev[type].map(p => p.id === id ? { ...p, text } : p) }));
    };
    const handleRemovePoint = (type: 'painPoints' | 'gainPoints', id: string) => {
        setFormData(prev => ({ ...prev, [type]: prev[type].filter(p => p.id !== id) }));
    };
    const handleAddPoint = (type: 'painPoints' | 'gainPoints', point?: PersonaPoint) => {
        const newPoint: PersonaPoint = point ? {...point} : { id: `p-${Date.now()}`, text: '', sourceInsightIds: [] };
        setFormData(prev => ({ ...prev, [type]: [...prev[type], newPoint] }));
    };
    
    const handleSave = () => {
        const personaToSave = formData.id ? formData : { ...formData, id: `p-${Date.now()}`};
        onSave(personaToSave);
    };

    const generateAiSuggestions = () => {
        // Mock AI analysis of feedback
        const suggestions: PersonaPoint[] = [
            { id: 'sugg-1', text: mockInsightData[3].content, sourceInsightIds: [mockInsightData[3].id] },
            { id: 'sugg-2', text: mockInsightData[12].content, sourceInsightIds: [mockInsightData[12].id] },
        ];
        setAiSuggestions(suggestions);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-card rounded-lg w-full max-w-lg">
                <div className="p-4 border-b border-border"><h3>{persona ? 'Edit' : 'Add'} Persona</h3></div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <input name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="w-full bg-background p-2 rounded"/>
                    <input name="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Role" className="w-full bg-background p-2 rounded"/>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center"><h4 className="font-semibold">Pain Points</h4><button onClick={() => handleAddPoint('painPoints')} className="text-xs bg-border px-2 py-1 rounded">+</button></div>
                        {formData.painPoints.map(p => <EditablePoint key={p.id} point={p} onChange={(id, text) => handlePointChange('painPoints', id, text)} onRemove={(id) => handleRemovePoint('painPoints', id)} />)}
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center"><h4 className="font-semibold">Gain Points</h4><button onClick={() => handleAddPoint('gainPoints')} className="text-xs bg-border px-2 py-1 rounded">+</button></div>
                        {formData.gainPoints.map(p => <EditablePoint key={p.id} point={p} onChange={(id, text) => handlePointChange('gainPoints', id, text)} onRemove={(id) => handleRemovePoint('gainPoints', id)} />)}
                    </div>

                    <div className="border-t border-border pt-4">
                        <button onClick={generateAiSuggestions} className="text-sm px-3 py-1 rounded-md bg-primary/20 text-primary">Generate AI Suggestions</button>
                        <div className="mt-2 space-y-2">
                            {aiSuggestions.map(sugg => (
                                <div key={sugg.id} className="p-2 bg-background/50 rounded flex justify-between items-center text-sm">
                                    <p className="line-clamp-1">"{sugg.text}"</p>
                                    <div className="flex space-x-1 flex-shrink-0 ml-2">
                                        <button onClick={() => handleAddPoint('painPoints', sugg)} className="text-xs bg-border px-2 py-1 rounded">Pain</button>
                                        <button onClick={() => handleAddPoint('gainPoints', sugg)} className="text-xs bg-border px-2 py-1 rounded">Gain</button>
                                    </div>
                                </div>
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
    );
};


const Personas: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
    const [personas, setPersonas] = useState<Persona[]>(mockPersonas);
    const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = (persona: Persona) => {
        if (personas.find(p => p.id === persona.id)) {
            setPersonas(personas.map(p => p.id === persona.id ? persona : p));
        } else {
            setPersonas([...personas, persona]);
        }
        setEditingPersona(null);
        setIsAdding(false);
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Personas" subtitle="Understand the key user archetypes for your products." />
            <div className="p-8">
                <div className="flex justify-end mb-6">
                    <button onClick={() => setIsAdding(true)} className="px-4 py-2 rounded-md bg-primary text-white">Add Persona</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {personas.map(p => <PersonaCard key={p.id} persona={p} onEdit={() => setEditingPersona(p)} navigateTo={navigateTo} />)}
                </div>
            </div>
            {(editingPersona || isAdding) && (
                <PersonaModal 
                    persona={editingPersona} 
                    onClose={() => { setEditingPersona(null); setIsAdding(false); }} 
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Personas;

import React, { useState } from 'react';
import { Hardware } from '../../types';

interface HardwareSpecConfigModalProps {
  hardware: Hardware;
  onClose: () => void;
  onSave: (newSpecs: Record<string, string>) => void;
}

const HardwareSpecConfigModal: React.FC<HardwareSpecConfigModalProps> = ({ hardware, onClose, onSave }) => {
    const [specs, setSpecs] = useState(Object.entries(hardware.specifications).map(([key, value], i) => ({ id: i, key, value })));

    const handleSpecChange = (id: number, field: 'key' | 'value', text: string) => {
        setSpecs(specs.map(s => s.id === id ? { ...s, [field]: text } : s));
    };

    const handleAddSpec = () => {
        setSpecs([...specs, { id: Date.now(), key: '', value: '' }]);
    };

    const handleRemoveSpec = (id: number) => {
        setSpecs(specs.filter(s => s.id !== id));
    };
    
    const handleSave = () => {
        const newSpecsObject = specs.reduce((acc, spec) => {
            if(spec.key.trim()) {
                acc[spec.key.trim()] = spec.value.trim();
            }
            return acc;
        }, {} as Record<string, string>);
        onSave(newSpecsObject);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border w-full max-w-lg">
                <div className="p-4 border-b border-vasco-dark-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Configure Specifications for {hardware.name}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-vasco-dark-bg text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                    {specs.map(spec => (
                        <div key={spec.id} className="flex items-center space-x-2">
                            <input
                                value={spec.key}
                                onChange={e => handleSpecChange(spec.id, 'key', e.target.value)}
                                placeholder="Attribute (e.g., CPU)"
                                className="flex-1 bg-vasco-dark-bg border border-vasco-dark-border rounded-md px-3 py-1.5 text-sm"
                            />
                            <input
                                value={spec.value}
                                onChange={e => handleSpecChange(spec.id, 'value', e.target.value)}
                                placeholder="Value (e.g., MTK 6762)"
                                className="flex-1 bg-vasco-dark-bg border border-vasco-dark-border rounded-md px-3 py-1.5 text-sm"
                            />
                            <button onClick={() => handleRemoveSpec(spec.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    <button onClick={handleAddSpec} className="w-full text-sm py-2 mt-2 rounded-md bg-vasco-dark-border/50 hover:bg-vasco-dark-border">
                        + Add Field
                    </button>
                </div>
                <div className="p-4 border-t border-vasco-dark-border flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-vasco-dark-border text-vasco-text-primary hover:bg-vasco-dark-border/70 transition">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover transition">Save Specifications</button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default HardwareSpecConfigModal;

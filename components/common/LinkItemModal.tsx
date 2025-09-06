import React, { useState, useMemo } from 'react';

interface LinkableItem {
    id: string;
    title: string;
    description?: string;
}

interface LinkItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items: LinkableItem[];
    linkedIds: string[];
    onLink: (newLinkedIds: string[]) => void;
}

const LinkItemModal: React.FC<LinkItemModalProps> = ({ isOpen, onClose, title, items, linkedIds, onLink }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(linkedIds));

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    const handleToggle = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };
    
    const handleSave = () => {
        onLink(Array.from(selectedIds));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-card rounded-lg border border-border w-full max-w-lg flex flex-col h-[70vh]">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-background text-2xl leading-none">&times;</button>
                </div>
                <div className="p-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search items..."
                        className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm"
                    />
                </div>
                <div className="flex-1 p-4 pt-0 overflow-y-auto space-y-2">
                    {filteredItems.map(item => (
                        <label key={item.id} className="flex items-center p-3 bg-zinc-800/50 rounded-md cursor-pointer hover:bg-zinc-800">
                            <input
                                type="checkbox"
                                checked={selectedIds.has(item.id)}
                                onChange={() => handleToggle(item.id)}
                                className="h-4 w-4 rounded bg-background border-border text-primary"
                            />
                            <div className="ml-3">
                                <p className="font-medium text-sm">{item.title}</p>
                                {item.description && <p className="text-xs text-text-secondary line-clamp-1">{item.description}</p>}
                            </div>
                        </label>
                    ))}
                </div>
                <div className="p-4 border-t border-border flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-zinc-700">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-white">Link {selectedIds.size} items</button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default LinkItemModal;



import React, { useState } from 'react';
import Header from '../common/Header';
import { UpstreamInitiative, UpstreamStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';
import InitiativeDetailModal from './InitiativeDetailModal';
import InitiativesTable from './InitiativesTable';

const columns: UpstreamStatus[] = ['Backlog', 'Analysing Opportunity', 'Initial Research', 'Deep Research', 'Input for Discussion', 'Parked', 'Waiting for Development', 'In Development', 'Released', 'Done'];

const InitiativeCard: React.FC<{ item: UpstreamInitiative, onClick: () => void }> = ({ item, onClick }) => (
    <div onClick={onClick} className="bg-vasco-dark-bg p-3 rounded-md border border-vasco-dark-border/50 cursor-pointer hover:border-vasco-primary transition-all duration-200 shadow-sm hover:shadow-lg">
        <h4 className="font-semibold text-sm text-vasco-text-primary">{item.title}</h4>
        <p className="text-xs text-vasco-text-secondary mt-1 line-clamp-2">{item.summary}</p>
        <div className="flex justify-between items-center mt-3">
             <span className="text-xs font-mono px-1.5 py-0.5 bg-vasco-dark-border rounded">{item.jiraId || 'No Jira ID'}</span>
             <span className="text-xs">{item.linkedInsights} insights</span>
        </div>
    </div>
);


const InitiativesWork: React.FC = () => {
    const { upstreamInitiatives, updateUpstreamInitiative, addUpstreamInitiative } = useAppContext();
    const [selectedItem, setSelectedItem] = useState<UpstreamInitiative | null>(null);
    const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

    const handleSave = (updatedItem: UpstreamInitiative) => {
        updateUpstreamInitiative(updatedItem.id, updatedItem);
        setSelectedItem(null);
    };

    const handleAddNew = async () => {
        const newItem = await addUpstreamInitiative({
            title: 'New Initiative',
            summary: '',
            linkedInsights: 0
        });
        setSelectedItem(newItem);
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Initiatives Work" subtitle="Manage product opportunities from idea to completion." />
            <div className="p-8 pb-0">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">View:</span>
                        <button onClick={() => setViewMode('board')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'board' ? 'bg-vasco-primary text-white' : 'hover:bg-vasco-dark-bg'}`}>Board</button>
                        <button onClick={() => setViewMode('table')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'table' ? 'bg-vasco-primary text-white' : 'hover:bg-vasco-dark-bg'}`}>Table</button>
                    </div>
                    <button onClick={handleAddNew} className="px-4 py-2 rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover">Add New Initiative</button>
                </div>
            </div>

            {viewMode === 'board' ? (
                <div className="flex-1 p-8 pt-0 overflow-x-auto">
                    <div className="flex space-x-6">
                        {columns.map(col => (
                            <div key={col} className="w-80 flex-shrink-0">
                                <h3 className="text-lg font-semibold text-vasco-text-primary mb-4 px-2">{col} ({upstreamInitiatives.filter(d=>d.status === col).length})</h3>
                                <div className="space-y-3 p-2 rounded-lg bg-vasco-dark-card/50 min-h-[60vh]">
                                    {upstreamInitiatives
                                        .filter(d => d.status === col)
                                        .map(d => <InitiativeCard key={d.id} item={d} onClick={() => setSelectedItem(d)} />)
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-8 pt-0">
                    <InitiativesTable 
                        initiatives={upstreamInitiatives}
                        onSelectInitiative={setSelectedItem}
                    />
                </div>
            )}
            
            {selectedItem && (
                <InitiativeDetailModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default InitiativesWork;
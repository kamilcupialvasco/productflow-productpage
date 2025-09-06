
import React, { useState, useMemo } from 'react';
import Header from '../../components/common/Header';
import { Hypothesis, HypothesisStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';
import HypothesisDetailModal from '../../components/hypothesis/HypothesisDetailModal';
import AdvancedTable, { Column } from '../../components/common/AdvancedTable';

const HypothesisBoard: React.FC = () => {
    const { hypotheses, updateHypothesis, addHypothesis } = useAppContext();
    const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null);

    const handleSave = (item: Hypothesis) => {
        if (hypotheses.some(h => h.id === item.id)) {
            updateHypothesis(item.id, item);
        } else {
            addHypothesis(item);
        }
        setSelectedHypothesis(null);
    };

    const handleAddNew = () => {
        const newHypothesis: Omit<Hypothesis, 'id'> = {
            title: 'New Hypothesis Title',
            description: '',
            status: 'New',
            certainty: 50,
            impact: 50,
            difficulty: 50,
            severity: 'Medium',
            linkedFeedbackIds: [],
            tags: [],
            linkedOutcomeIds: []
        };
        addHypothesis(newHypothesis).then(newlyCreated => {
            setSelectedHypothesis(newlyCreated);
        })
    };

    const columns = useMemo((): Column<Hypothesis>[] => [
        { Header: 'Hypothesis', accessor: 'title', className: 'font-medium text-text-primary max-w-sm' },
        { Header: 'Status', accessor: 'status' },
        { Header: 'Certainty', accessor: 'certainty', Cell: ({ value }: { value: number }) => <>{value}%</> },
        { Header: 'Impact', accessor: 'impact' },
        { Header: 'Difficulty', accessor: 'difficulty' },
        {
            Header: 'Tags',
            accessor: 'tags',
            Cell: ({ value }: { value?: string[] }) => (
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {value?.map(tag => <span key={tag} className="text-xs bg-background px-2 py-1 rounded">{tag}</span>)}
                </div>
            )
        },
        {
            Header: 'Links',
            accessor: 'id',
            Cell: ({ row }: { row: { original: Hypothesis } }) => (
                <div className="text-xs">
                    {row.original.linkedFeedbackIds.length > 0 && <div>🔗 {row.original.linkedFeedbackIds.length} Feedback</div>}
                    {row.original.linkedOutcomeIds && row.original.linkedOutcomeIds.length > 0 && <div>🎯 {row.original.linkedOutcomeIds.length} Outcomes</div>}
                </div>
            )
        }
    ], []);


    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Hypotheses" subtitle="Manage and validate your product hypotheses." />
            <div className="p-8">
                <AdvancedTable<Hypothesis>
                    columns={columns}
                    data={hypotheses}
                    title="All Hypotheses"
                    onRowClick={(item) => setSelectedHypothesis(item)}
                    renderActions={() => (
                         <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm">View:</span>
                                <button className="px-3 py-1 text-sm rounded-md bg-primary text-white">Table</button>
                            </div>
                             <button onClick={handleAddNew} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover">New Hypothesis</button>
                        </div>
                    )}
                />
            </div>
            {selectedHypothesis && (
                <HypothesisDetailModal
                    hypothesis={selectedHypothesis}
                    onClose={() => setSelectedHypothesis(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default HypothesisBoard;




import React, { useState, useMemo } from 'react';
import Header from '../common/Header';
import { Feedback, FeedbackStatus, Page } from '../../types';
import { useAppContext } from '../../context/AppContext';
import FeedbackDetailPanel from './FeedbackDetailPanel';
import AdvancedTable, { Column } from '../common/AdvancedTable';

const StatusBadge: React.FC<{ status: FeedbackStatus }> = ({ status }) => {
  const colorClasses = {
    [FeedbackStatus.New]: 'bg-blue-500/20 text-blue-400',
    [FeedbackStatus.UnderReview]: 'bg-yellow-500/20 text-yellow-400',
    [FeedbackStatus.Actioned]: 'bg-green-500/20 text-green-400',
    [FeedbackStatus.Archived]: 'bg-slate-500/20 text-slate-400',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>{status}</span>;
};

const FeedbackHub: React.FC<{ onViewInsight: (insightId: string) => void, navigateTo: (page: Page, filters?: Record<string, any> | null) => void }> = ({ onViewInsight, navigateTo }) => {
    const { feedbackClusters, products, updateFeedbackCluster, addCommentToFeedback, addFeedbackCluster } = useAppContext();
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

    const handleAddNew = async () => {
        const newCluster = await addFeedbackCluster({
            title: 'New Feedback Cluster',
            description: '',
            problemDescription: '',
        });
        setSelectedFeedback(newCluster);
    }
    
    const columns = useMemo((): Column<Feedback>[] => [
        {
            Header: 'Title',
            accessor: 'title',
            Cell: ({ value, row }: { value: string, row: { original: Feedback }}) => (
                <div className="font-medium text-vasco-text-primary max-w-xs">
                    {row.original.isNew && <span className="inline-block h-2 w-2 rounded-full bg-vasco-primary mr-2 animate-pulse"></span>}
                    {value}
                </div>
            )
        },
        { Header: 'Impact', accessor: 'impact', className: 'text-center font-bold' },
        { Header: 'Problem', accessor: 'problemDescription', className: 'text-xs max-w-sm' },
        {
            Header: 'Products',
            accessor: 'productIds',
            Cell: ({ value }: { value: string[] }) => (
                <div className="flex flex-col items-start gap-1">
                    {value.map(pid => {
                        const product = products.find(p => p.id === pid);
                        const isHardware = product?.category === 'Hardware';
                        return (
                            <button key={pid} onClick={(e) => { e.stopPropagation(); navigateTo(`product/detail/${pid}`) }} className="text-xs bg-vasco-dark-bg px-2 py-1 rounded-full hover:bg-vasco-primary/50 flex items-center">
                                {isHardware ? '💻' : '📦'} <span className="ml-1.5">{product?.name || pid}</span>
                            </button>
                        )
                    })}
                </div>
            )
        },
        {
            Header: 'Tags',
            accessor: 'tags',
            Cell: ({ value }: { value: string[] }) => (
                <div className="flex flex-wrap gap-1">
                    {value.map(tag => <span key={tag} className="text-xs bg-vasco-dark-bg px-2 py-1 rounded">{tag}</span>)}
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }: { value: FeedbackStatus }) => <StatusBadge status={value} />
        }
    ], [products, navigateTo]);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Feedback Hub" subtitle="Analyze and manage aggregated feedback themes." />
            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 p-8 overflow-y-auto">
                     <AdvancedTable<Feedback>
                        columns={columns}
                        data={feedbackClusters}
                        title="All Feedback"
                        onRowClick={(item) => setSelectedFeedback(item)}
                        renderActions={() => (
                             <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm">View:</span>
                                    <button className="px-3 py-1 text-sm rounded-md bg-vasco-primary text-white">Table</button>
                                    <button onClick={() => navigateTo('feedback/board')} className="px-3 py-1 text-sm rounded-md hover:bg-vasco-dark-bg">Board</button>
                                </div>
                                <button onClick={handleAddNew} className="px-4 py-2 rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover">Add New Cluster</button>
                            </div>
                        )}
                    />
                </main>
                {selectedFeedback && (
                    <FeedbackDetailPanel
                        key={selectedFeedback.id}
                        feedback={selectedFeedback}
                        onClose={() => setSelectedFeedback(null)}
                        onViewInsight={onViewInsight}
                        onSave={updateFeedbackCluster}
                        onAddComment={addCommentToFeedback}
                    />
                )}
            </div>
        </div>
    );
};

export default FeedbackHub;
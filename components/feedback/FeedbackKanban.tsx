

import React, { useState } from 'react';
import Header from '../common/Header';
import { Feedback, FeedbackStatus, Page } from '../../types';
import { useAppContext } from '../../context/AppContext';
import FeedbackDetailPanel from './FeedbackDetailPanel';

const FeedbackCard: React.FC<{ item: Feedback; onClick: () => void }> = ({ item, onClick }) => (
    <div onClick={onClick} className="bg-vasco-dark-bg p-3 rounded-md border border-vasco-dark-border/50 cursor-pointer hover:border-vasco-primary transition-all">
        <h4 className="font-semibold text-sm text-vasco-text-primary">{item.title}</h4>
        <p className="text-xs text-vasco-text-secondary mt-1 line-clamp-2">{item.problemDescription}</p>
        <div className="flex justify-between items-center mt-3">
             <span className="text-xs font-mono px-1.5 py-0.5 bg-vasco-dark-border rounded">{item.impact} impact</span>
             <span className="text-xs">{item.insightIds.length} insights</span>
        </div>
    </div>
);

const FeedbackKanban: React.FC<{ onViewInsight: (insightId: string) => void; navigateTo: (page: Page) => void }> = ({ onViewInsight, navigateTo }) => {
    const { feedbackClusters, updateFeedbackCluster, addCommentToFeedback } = useAppContext();
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    
    const columns: FeedbackStatus[] = [FeedbackStatus.New, FeedbackStatus.UnderReview, FeedbackStatus.Actioned, FeedbackStatus.Archived];

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Feedback Board" subtitle="Manage feedback clusters through their lifecycle." />
            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 p-8 overflow-x-auto">
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">View:</span>
                            <button onClick={() => navigateTo('feedback/hub')} className="px-3 py-1 text-sm rounded-md hover:bg-vasco-dark-bg">Table</button>
                            <button className="px-3 py-1 text-sm rounded-md bg-vasco-primary text-white">Board</button>
                        </div>
                    </div>
                    <div className="flex space-x-6 h-full">
                        {columns.map(col => (
                            <div key={col} className="w-80 flex-shrink-0">
                                <h3 className="text-lg font-semibold text-vasco-text-primary mb-4 px-2">{col} ({feedbackClusters.filter(d=>d.status === col).length})</h3>
                                <div className="space-y-3 p-2 rounded-lg bg-vasco-dark-card/50 h-[calc(100%-4rem)] overflow-y-auto">
                                    {feedbackClusters
                                        .filter(d => d.status === col)
                                        .map(d => <FeedbackCard key={d.id} item={d} onClick={() => setSelectedFeedback(d)} />)
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
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

export default FeedbackKanban;
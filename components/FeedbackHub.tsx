

import React, { useState } from 'react';
import Header from './Header';
import { Feedback, FeedbackStatus, Sentiment } from '../types';
import { useAppContext } from '../context/AppContext';

const StatusBadge: React.FC<{ status: FeedbackStatus }> = ({ status }) => {
  const colorClasses = {
    [FeedbackStatus.New]: 'bg-blue-500/20 text-blue-400',
    [FeedbackStatus.UnderReview]: 'bg-yellow-500/20 text-yellow-400',
    [FeedbackStatus.Actioned]: 'bg-green-500/20 text-green-400',
    [FeedbackStatus.Archived]: 'bg-slate-500/20 text-slate-400',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>{status}</span>;
};

const SentimentIndicator: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
    const icon = {
        [Sentiment.Positive]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        [Sentiment.Negative]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        [Sentiment.Neutral]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    }
    const color = {
        [Sentiment.Positive]: 'text-green-400',
        [Sentiment.Negative]: 'text-red-400',
        [Sentiment.Neutral]: 'text-slate-400',
    }
    return <svg className={`h-6 w-6 ${color[sentiment]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon[sentiment]}</svg>;
}


const FeedbackHub: React.FC<{ onViewInsight: (insightId: string) => void }> = ({ onViewInsight }) => {
    const { feedbackClusters } = useAppContext();
    const [feedback, setFeedback] = useState<Feedback[]>(feedbackClusters);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Feedback Hub" subtitle="Analyze and manage aggregated feedback themes." />
            <div className="p-8">
                 <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border overflow-hidden">
                    <div className="p-4 border-b border-vasco-dark-border flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-vasco-text-primary">All Feedback</h3>
                        {/* Add filters here later */}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-vasco-text-secondary">
                        <thead className="text-xs text-vasco-text-secondary uppercase bg-vasco-dark-bg">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-12"></th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Insights</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Products</th>
                                <th scope="col" className="px-6 py-3">Date Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.map(item => (
                                <tr key={item.id} className="border-b border-vasco-dark-border hover:bg-vasco-dark-bg/50">
                                    <td className="px-6 py-4"><SentimentIndicator sentiment={item.sentiment} /></td>
                                    <td className="px-6 py-4 font-medium text-vasco-text-primary">{item.title}</td>
                                    <td className="px-6 py-4 text-center">{item.insightIds.length}</td>
                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                    <td className="px-6 py-4">{item.productIds.join(', ')}</td>
                                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackHub;

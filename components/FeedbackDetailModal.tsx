

import React from 'react';
import { Insight, Sentiment } from '../types';

const SentimentBadge: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center';
  const colorClasses = {
    [Sentiment.Positive]: 'bg-green-500/20 text-green-400',
    [Sentiment.Negative]: 'bg-red-500/20 text-red-400',
    [Sentiment.Neutral]: 'bg-slate-500/20 text-slate-400',
  };
  return <span className={`${baseClasses} ${colorClasses[sentiment]}`}>{sentiment}</span>;
};

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-vasco-text-secondary">{label}</p>
    <p className="text-base text-vasco-text-primary font-medium">{value}</p>
  </div>
);

const InsightDetailModal: React.FC<{
  insight: Insight;
  onClose: () => void;
}> = ({ insight, onClose }) => {
  if (!insight) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border w-full max-w-2xl transform transition-all animate-slide-up">
        <div className="p-4 border-b border-vasco-dark-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">Insight Details</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-vasco-dark-bg text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="mb-6">
            <p className="text-lg text-vasco-text-primary leading-relaxed">"{insight.content}"</p>
             <p className="text-sm text-vasco-text-secondary mt-2">Reported by user <span className="font-medium text-vasco-text-primary">{insight.user.id}</span> ({insight.user.segment})</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-vasco-dark-border pt-6">
            <DetailItem label="Sentiment" value={<SentimentBadge sentiment={insight.sentiment} />} />
            <DetailItem label="Source" value={insight.source} />
            <DetailItem label="Type" value={insight.type} />
            <DetailItem label="Product" value={insight.productId} />
            <DetailItem label="Version" value={insight.version} />
            <DetailItem label="Category" value={insight.category} />
            <DetailItem label="Date" value={new Date(insight.date).toLocaleString()} />
            <DetailItem label="Frequency" value={insight.frequency} />
            <DetailItem label="Jira Ticket" value={insight.jiraTicket || 'N/A'} />
          </div>
        </div>
        <div className="p-4 border-t border-vasco-dark-border flex justify-between items-center">
            <div>
                 <button className="px-4 py-2 rounded-md bg-vasco-dark-border text-vasco-text-primary hover:bg-vasco-dark-border/70 transition text-sm">Link to Opportunity</button>
            </div>
            <div className="flex space-x-2">
                <button className="px-4 py-2 rounded-md bg-vasco-dark-border text-vasco-text-primary hover:bg-vasco-dark-border/70 transition">Add to Feedback...</button>
                <button className="px-4 py-2 rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover transition">Create Jira Ticket</button>
            </div>
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

export default InsightDetailModal;

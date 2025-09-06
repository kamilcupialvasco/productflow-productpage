
import React from 'react';
import { Insight, Sentiment, Page } from '../../types';
import { mockFeedbackClusters } from '../../services/mockData';

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
    <p className="text-sm text-text-secondary">{label}</p>
    <p className="text-base text-text-primary font-medium">{value}</p>
  </div>
);

const InsightDetailModal: React.FC<{
  insight: Insight;
  onClose: () => void;
  navigateTo: (page: Page) => void;
}> = ({ insight, onClose, navigateTo }) => {
  const parentFeedback = mockFeedbackClusters.find(f => f.id === insight.feedbackId);

  if (!insight) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card rounded-lg border border-border w-full max-w-3xl transform transition-all animate-slide-up flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">Insight Details</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-background text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="mb-6">
            <p className="text-lg text-text-primary leading-relaxed">"{insight.content}"</p>
            <p className="text-sm text-text-secondary mt-2">Reported by user <span className="font-medium text-text-primary">{insight.user.id}</span> ({insight.user.segment})</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-border pt-6">
            <DetailItem label="Sentiment" value={<SentimentBadge sentiment={insight.sentiment} />} />
            <DetailItem label="Detailed Sentiment" value={insight.sentimentDetail} />
            <DetailItem label="Source" value={insight.source} />
            <DetailItem label="Type" value={insight.type} />
            <DetailItem label="Product ID" value={insight.productId} />
            <DetailItem label="Version" value={insight.version} />
            <DetailItem label="Category" value={insight.category} />
            <DetailItem label="Date" value={new Date(insight.date).toLocaleString()} />
            <DetailItem label="Jira Ticket" value={insight.jiraTicket || 'N/A'} />
          </div>

          {parentFeedback && (
              <div className="border-t border-border pt-6 mt-6">
                  <h4 className="text-base font-semibold mb-3">Parent Feedback Cluster</h4>
                  <div className="p-3 bg-background/50 rounded-md flex justify-between items-center">
                    <p className="font-medium">{parentFeedback.title}</p>
                    <button onClick={() => { onClose(); navigateTo('feedback/hub'); }} className="px-3 py-1.5 rounded-md bg-primary/20 text-primary text-sm hover:bg-primary/40 transition">View Cluster</button>
                  </div>
              </div>
          )}

          <div className="border-t border-border pt-6 mt-6">
              <h4 className="text-base font-semibold mb-3">Metadata & Logs</h4>
              <div className="p-3 bg-background/50 rounded-md text-xs font-mono text-text-secondary whitespace-pre-wrap">
                  {`{\n  "timestamp": "${insight.date}",\n  "source_system": "${insight.source}",\n  "user_id": "${insight.user.id}",\n  "user_segment": "${insight.user.segment}",\n  "product_id": "${insight.productId}",\n  "raw_content_length": ${insight.content.length}\n}`}
              </div>
          </div>

        </div>
        <div className="p-4 border-t border-border flex justify-end space-x-2 bg-background/50">
            <button className="px-4 py-2 rounded-md bg-border text-text-primary hover:bg-zinc-600 transition">Change Cluster...</button>
            <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition">Create Jira Ticket</button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        @keyframes slide-up { 0% { transform: translateY(20px); } 100% { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.2s ease-out forwards; }
      `}</style>
    </div>
    </>
  );
};

export default InsightDetailModal;

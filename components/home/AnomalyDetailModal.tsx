
import React from 'react';
import { Anomaly, Insight } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface AnomalyDetailModalProps {
  anomaly: Anomaly;
  onClose: () => void;
  onViewInsight: (insightId: string) => void;
}

const InsightCard: React.FC<{ insight: Insight; onClick: () => void }> = ({ insight, onClick }) => (
    <div onClick={onClick} className="p-2 bg-background/50 rounded-md border border-border/50 cursor-pointer hover:border-primary transition-colors">
        <p className="text-xs text-text-primary line-clamp-1">"{insight.content}"</p>
    </div>
);

const AnomalyDetailModal: React.FC<AnomalyDetailModalProps> = ({ anomaly, onClose, onViewInsight }) => {
    const { insights } = useAppContext();
    const relatedInsights = insights.filter(i => anomaly.relatedInsightIds.includes(i.id));

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-card rounded-lg w-full max-w-2xl border border-border animate-slide-up">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Anomaly Details</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-background text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                    <div>
                        <h4 className="font-bold text-xl text-text-primary">{anomaly.title}</h4>
                        <p className="text-text-secondary mt-1">{anomaly.description}</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                        <h5 className="font-semibold text-primary mb-2">AI Summary & Analysis</h5>
                        <p className="text-sm text-text-primary">{anomaly.aiSummary || 'No AI summary available.'}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold mb-2">Related Insights ({relatedInsights.length})</h5>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {relatedInsights.map(insight => (
                                <InsightCard key={insight.id} insight={insight} onClick={() => onViewInsight(insight.id)} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h5 className="font-semibold mb-2">Suggested Actions</h5>
                        <div className="space-y-2">
                             {anomaly.suggestedActions?.map((action, idx) => (
                                 <div key={idx} className="flex items-center space-x-3 p-3 bg-background/50 rounded-md">
                                    <input type="checkbox" className="h-4 w-4 rounded bg-background border-border text-primary" />
                                    <label className="text-sm">{action}</label>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-border flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-border">Acknowledge</button>
                    <button className="px-4 py-2 rounded-md bg-primary text-white">Create Initiative</button>
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

export default AnomalyDetailModal;

import React, { useState, useEffect, useMemo } from 'react';
// FIX: Add Page to types import to support navigateTo prop
import { Insight, Sentiment, FeedbackType, FeedbackSource, SentimentDetail, Page } from '../../types';
import { mockInsightData, mockHardwareData, mockSoftwareData, mockFeedbackClusters } from '../../services/mockData';
import MetricCard from '../common/MetricCard';
import SentimentChart from './SentimentChart';
import InsightsTable from './InsightsTable';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import Header from '../common/Header';

const ManualImportModal: React.FC<{ onClose: () => void, onSave: (insight: Insight) => void }> = ({ onClose, onSave }) => {
    const [content, setContent] = useState('');
    const [productId, setProductId] = useState(mockHardwareData[0].id);

    const handleSave = () => {
        if (!content || !productId) return;
        const newInsight: Insight = {
            id: `manual-${Date.now()}`,
            source: FeedbackSource.Manual,
            content,
            sentiment: Sentiment.Neutral, // Should be analyzed by AI
            sentimentDetail: SentimentDetail.Suggestion,
            category: 'General',
            type: FeedbackType.Remark,
            productId,
            version: 'N/A',
            frequency: 1,
            date: new Date().toISOString(),
            user: { id: 'current-user', segment: 'Internal' }
        };
        onSave(newInsight);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-vasco-dark-card rounded-lg w-full max-w-lg">
                <div className="p-4 border-b border-vasco-dark-border"><h3>Manually Import Insight</h3></div>
                <div className="p-6 space-y-4">
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Enter user feedback here..." className="w-full bg-vasco-dark-bg p-2 h-32 rounded"/>
                    <select value={productId} onChange={e => setProductId(e.target.value)} className="w-full bg-vasco-dark-bg p-2 rounded">
                        {[...mockHardwareData, ...mockSoftwareData].map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                 <div className="p-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-vasco-dark-border">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded bg-vasco-primary text-white">Save Insight</button>
                 </div>
            </div>
        </div>
    );
};


interface FeedbackDashboardProps {
  onViewInsight: (insightId: string) => void;
  // FIX: Added navigateTo prop to satisfy InsightsTable's requirement
  navigateTo: (page: Page, options?: { selectedId?: string; filters?: Record<string, any> }) => void;
}

const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({ onViewInsight, navigateTo }) => {
  const [insightData, setInsightData] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInsightData(mockInsightData);
      setLoading(false);
    }, 500);
  }, []);
  
  const metrics = useMemo(() => {
    if (insightData.length === 0) return { total: 0, newIdeas: 0, avgTriage: 0, avgAction: 0 };
    const triageTimes = mockFeedbackClusters.map(f => f.timeToTriage || 0).filter(t => t > 0);
    const actionTimes = mockFeedbackClusters.map(f => f.timeToAction || 0).filter(t => t > 0);
    return {
        total: insightData.length,
        newIdeas: insightData.filter(i => i.type === FeedbackType.Idea).length,
        avgTriage: triageTimes.length > 0 ? triageTimes.reduce((a, b) => a + b, 0) / triageTimes.length : 0,
        avgAction: actionTimes.length > 0 ? actionTimes.reduce((a, b) => a + b, 0) / actionTimes.length : 0,
    }
  }, [insightData]);

  const handleSaveImport = (newInsight: Insight) => {
    setInsightData(prev => [newInsight, ...prev]);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><p>Loading Dashboard...</p></div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <Header title="Feedback Dashboard" subtitle="An overview of incoming insights and process efficiency."/>
      <div className="p-8 space-y-8">
        <div className="flex justify-end">
            <button onClick={() => setIsImporting(true)} className="px-4 py-2 rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover">Manual Import</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Total Insights" value={metrics.total.toString()} />
          <MetricCard title="New Ideas Submitted" value={metrics.newIdeas.toString()} />
          <MetricCard title="Avg. Time to Triage" value={`${metrics.avgTriage.toFixed(1)} hrs`} />
          <MetricCard title="Avg. Time to Action" value={`${metrics.avgAction.toFixed(1)} days`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SentimentChart data={insightData} onSliceClick={() => {}} />
          </div>
          <div className="lg:col-span-2">
            <CategoryBreakdownChart data={insightData} onBarClick={() => {}} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-vasco-text-primary">Recent Insights</h3>
          <InsightsTable 
            data={insightData} 
            onViewDetails={(insight) => onViewInsight(insight.id)}
            // FIX: Pass the required 'navigateTo' prop to InsightsTable.
            navigateTo={navigateTo}
           />
        </div>
      </div>
      {isImporting && <ManualImportModal onClose={() => setIsImporting(false)} onSave={handleSaveImport} />}
    </div>
  );
};

export default FeedbackDashboard;
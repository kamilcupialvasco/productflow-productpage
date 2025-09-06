import React, { useState, useEffect, useMemo } from 'react';
// FIX: Add Page to types import to support navigateTo prop
import { Insight, Sentiment, FeedbackType, FeedbackSource, SentimentDetail, Page } from '../../types';
import { mockInsightData, mockHardwareData, mockSoftwareData } from '../../services/mockData';
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

type Filter = {
    type: 'sentiment' | 'type' | 'product' | 'category' | null;
    value: string | null;
}

interface InsightsDashboardProps {
  onViewInsight: (insightId: string) => void;
  // FIX: Added navigateTo prop to satisfy InsightsTable's requirement
  navigateTo: (page: Page, options?: { selectedId?: string; filters?: Record<string, any> }) => void;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onViewInsight, navigateTo }) => {
  const [insightData, setInsightData] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>({ type: null, value: null });
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInsightData(mockInsightData);
      setLoading(false);
    }, 1000);
  }, []);
  
  const filteredData = useMemo(() => {
    if (!filter.type || !filter.value) {
        return insightData;
    }
    return insightData.filter(item => {
        if (filter.type === 'sentiment') return item.sentiment === filter.value;
        if (filter.type === 'type') return item.type === filter.value;
        if (filter.type === 'product') return item.productId === filter.value;
        if (filter.type === 'category') return item.category === filter.value;
        return true;
    });
  }, [insightData, filter]);

  const totalInsights = insightData.length;
  const positiveSentiment = totalInsights > 0 ?
    (insightData.filter((item) => item.sentiment === Sentiment.Positive)
      .length / totalInsights) *
    100 : 0;
  
  const newIdeas = insightData.filter(item => item.type === FeedbackType.Idea).length;

  const mostReportedProduct = insightData.reduce((acc, item) => {
    acc[item.productId] = (acc[item.productId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProduct = Object.entries(mostReportedProduct).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
  
  const clearFilter = () => setFilter({ type: null, value: null });
  
  const handleSaveImport = (newInsight: Insight) => {
    setInsightData(prev => [newInsight, ...prev]);
  };

  if (loading) {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Insights Dashboard" subtitle="Welcome back, here's a summary of the latest user insights."/>
            <div className="flex-1 p-8 flex items-center justify-center">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-vasco-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg text-vasco-text-secondary">Loading Insight Data...</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <Header title="Insights Dashboard" subtitle="Welcome back, here's a summary of the latest user insights."/>
      <div className="p-8 space-y-8">
        <div className="flex justify-end">
            <button onClick={() => setIsImporting(true)} className="px-4 py-2 rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover">Manual Import</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Total Insights" value={totalInsights.toString()} onClick={clearFilter} />
          <MetricCard title="Positive Sentiment" value={`${positiveSentiment.toFixed(1)}%`} onClick={() => setFilter({type: 'sentiment', value: Sentiment.Positive})}/>
          <MetricCard title="New Ideas Submitted" value={newIdeas.toString()} onClick={() => setFilter({type: 'type', value: FeedbackType.Idea})} />
          <MetricCard title="Top Reported Product" value={topProduct} onClick={() => setFilter({type: 'product', value: topProduct})} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SentimentChart data={insightData} onSliceClick={(sentiment) => setFilter({type: 'sentiment', value: sentiment})} />
          </div>
          <div className="lg:col-span-2">
            <CategoryBreakdownChart data={insightData} onBarClick={(category) => setFilter({type: 'category', value: category})} />
          </div>
        </div>

        <div>
          <InsightsTable 
            data={filteredData} 
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

export default InsightsDashboard;
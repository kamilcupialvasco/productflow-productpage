
import React, { useState, useMemo } from 'react';
import { Insight, Sentiment, FeedbackSource, FeedbackType, Page } from '../../types';
import { useAppContext } from '../../context/AppContext';

const ITEMS_PER_PAGE = 10;

const SentimentBadge: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  const colorClasses = {
    [Sentiment.Positive]: 'bg-green-500/20 text-green-400',
    [Sentiment.Negative]: 'bg-red-500/20 text-red-400',
    [Sentiment.Neutral]: 'bg-slate-500/20 text-slate-400',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[sentiment]}`}>{sentiment}</span>;
};

const FilterDropdown: React.FC<{ label: string; options: {value: string, label: string}[]; selected: string; onChange: (value: string) => void }> = ({ label, options, selected, onChange }) => (
    <div>
        <label className="text-xs text-text-secondary">{label}</label>
        <select value={selected} onChange={e => onChange(e.target.value)} className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm mt-1 focus:ring-primary focus:border-primary">
            <option value="">All</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

interface InsightsTableProps {
    data: Insight[];
    onViewDetails: (item: Insight) => void;
    navigateTo: (page: Page, options?: { selectedId?: string, filters?: Record<string, any> }) => void;
}

const InsightsTable: React.FC<InsightsTableProps> = ({ data, onViewDetails, navigateTo }) => {
  const { products, feedbackClusters } = useAppContext();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ product: '', sentiment: '', source: '', type: '' });

  const filteredData = useMemo(() => {
    return data.filter(item => {
        return (filters.product ? item.productId === filters.product : true) &&
               (filters.sentiment ? item.sentiment === filters.sentiment : true) &&
               (filters.source ? item.source === filters.source : true) &&
               (filters.type ? item.type === filters.type : true);
    });
  }, [data, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);
  
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedData.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };
  
  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
      setFilters(prev => ({...prev, [filterName]: value}));
      setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setFilters({ product: '', sentiment: '', source: '', type: '' });
    setCurrentPage(1);
  }

  const productOptions = products.map(p => ({ value: p.id, label: p.name }));

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
             <h3 className="text-lg font-semibold text-text-primary">All Insights</h3>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <FilterDropdown label="Product" options={productOptions} selected={filters.product} onChange={v => handleFilterChange('product', v)} />
                <FilterDropdown label="Sentiment" options={Object.values(Sentiment).map(s => ({value: s, label: s}))} selected={filters.sentiment} onChange={v => handleFilterChange('sentiment', v)} />
                <FilterDropdown label="Source" options={Object.values(FeedbackSource).map(s => ({value: s, label: s}))} selected={filters.source} onChange={v => handleFilterChange('source', v)} />
                <FilterDropdown label="Type" options={Object.values(FeedbackType).map(t => ({value: t, label: t}))} selected={filters.type} onChange={v => handleFilterChange('type', v)} />
                 <div className="flex items-end">
                    <button onClick={clearFilters} className="w-full h-[38px] px-3 py-1.5 rounded-md bg-border text-text-primary text-sm hover:bg-zinc-600 transition">Clear</button>
                </div>
             </div>
        </div>
        
        {selectedIds.size > 0 && (
             <div className="p-2 border-b border-border bg-background flex items-center justify-between">
                <span className="text-sm">{selectedIds.size} items selected</span>
                <div className="flex space-x-2">
                    <button className="text-sm px-3 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/40">Add Tags...</button>
                    <button className="text-sm px-3 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/40">Create Feedback...</button>
                </div>
            </div>
        )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-text-secondary">
          <thead className="text-xs text-text-secondary uppercase bg-zinc-900">
            <tr>
              <th className="px-4 py-3"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.size > 0 && selectedIds.size === paginatedData.length} className="bg-background border-border rounded" /></th>
              <th className="px-6 py-3">Insight</th>
              <th className="px-6 py-3">Sentiment</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Cluster</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => {
                const product = products.find(p => p.id === item.productId);
                const cluster = feedbackClusters.find(c => c.id === item.feedbackId);
                return (
              <tr key={item.id} className={`border-b border-border ${selectedIds.has(item.id) ? 'bg-primary/10' : 'hover:bg-zinc-900/50'}`}>
                <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => handleSelectOne(item.id)} className="bg-background border-border rounded"/></td>
                <td className="px-6 py-4"><p className="max-w-xs truncate" title={item.content}>{item.content}</p><span className="text-xs text-text-secondary">{item.source} - {new Date(item.date).toLocaleDateString()}</span></td>
                <td className="px-6 py-4"><SentimentBadge sentiment={item.sentiment} /><p className="text-xs mt-1">{item.sentimentDetail}</p></td>
                <td className="px-6 py-4 font-medium text-text-primary">{product?.name || item.productId}</td>
                <td className="px-6 py-4 text-xs">
                    {cluster ? (
                        <button onClick={() => navigateTo('feedback/hub', { selectedId: cluster.id })} className="bg-background px-2 py-1 rounded-full hover:underline">{cluster.title}</button>
                    ) : (
                        <span className="text-text-secondary italic">N/A</span>
                    )}
                </td>
                <td className="px-6 py-4"><button onClick={() => onViewDetails(item)} className="text-primary hover:underline">Details</button></td>
              </tr>
            )})}
             {paginatedData.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8">No insights found for the current filters.</td></tr>
             )}
          </tbody>
        </table>
      </div>
       <div className="p-4 flex justify-between items-center text-sm">
            <span className="text-text-secondary">Showing {paginatedData.length} of {filteredData.length} results</span>
            <div className="flex space-x-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 rounded disabled:opacity-50">&laquo;</button>
                <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded disabled:opacity-50">&raquo;</button>
            </div>
        </div>
    </div>
  );
};

export default InsightsTable;

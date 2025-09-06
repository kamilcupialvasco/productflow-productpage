
import React, { useState, useMemo } from 'react';
import Header from '../../components/common/Header';
import { Feedback, Insight, Page } from '../../types';
import Heatmap from '../../components/common/Heatmap';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useAppContext } from '../../context/AppContext';

const matrixOptions = [
    { value: 'product', label: 'Product' },
    { value: 'severity', label: 'Severity' },
    { value: 'sentiment', label: 'Sentiment' },
    { value: 'category', label: 'Category' },
];

const CustomMatrixModal: React.FC<{
    onClose: () => void;
    onCreate: (row: string, col: string) => void;
}> = ({ onClose, onCreate }) => {
    const [rowDim, setRowDim] = useState('product');
    const [colDim, setColDim] = useState('severity');

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-card rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-border"><h3>Create Custom Matrix</h3></div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm">Rows (Y-axis)</label>
                        <select value={rowDim} onChange={e => setRowDim(e.target.value)} className="w-full bg-background p-2 rounded mt-1">
                            {matrixOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm">Columns (X-axis)</label>
                        <select value={colDim} onChange={e => setColDim(e.target.value)} className="w-full bg-background p-2 rounded mt-1">
                            {matrixOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-border">Cancel</button>
                    <button onClick={() => onCreate(rowDim, colDim)} className="px-4 py-2 rounded bg-primary text-white">Create</button>
                </div>
            </div>
        </div>
    );
};

const FeedbackAnalysis: React.FC<{ initialFilters?: Record<string, any> | null }> = ({ initialFilters }) => {
    const { feedbackClusters, products, insights } = useAppContext();
    const [filters, setFilters] = useState(initialFilters || {
        severity: '',
        impactMin: 0,
        productCategory: '',
    });
    const [isCreatingMatrix, setIsCreatingMatrix] = useState(false);
    const [customMatrix, setCustomMatrix] = useState<{ rows: string, cols: string } | null>(null);

    const filteredData = useMemo(() => {
        return feedbackClusters.filter(fb => {
            const productCategory = products.find(p => fb.productIds.includes(p.id))?.category;
            return (filters.severity ? fb.severity === filters.severity : true) &&
                   (fb.impact >= filters.impactMin) &&
                   (filters.productCategory ? productCategory === filters.productCategory : true);
        });
    }, [filters, feedbackClusters, products]);
    
    const scatterData = filteredData.map(fb => ({
        x: fb.insightIds.length,
        y: fb.impact || 0,
        z: fb.uncertaintyScore,
        name: fb.title
    }));
    
    const handleCreateMatrix = (rowDim: string, colDim: string) => {
        setCustomMatrix({ rows: rowDim, cols: colDim });
        setIsCreatingMatrix(false);
    };

    const getKeysForDimension = (dimension: string): string[] => {
        switch(dimension) {
            case 'product': return [...new Set<string>(products.map(p => p.name))];
            case 'severity': return ['Low', 'Medium', 'High', 'Critical'];
            case 'sentiment': return ['Positive', 'Negative', 'Neutral'];
            case 'category': return [...new Set<string>(insights.map(i => i.category))];
            default: return [];
        }
    };
    
    const getInsightValueForDimension = (insight: Insight, dimension: string) => {
        switch(dimension) {
            case 'product': return products.find(p => p.id === insight.productId)?.name;
            case 'severity': return feedbackClusters.find(fb => fb.id === insight.feedbackId)?.severity;
            case 'sentiment': return insight.sentiment;
            case 'category': return insight.category;
            default: return undefined;
        }
    }

    const customMatrixData = useMemo(() => {
        if (!customMatrix) return null;
        return insights.reduce((acc, insight) => {
            const rowKey = getInsightValueForDimension(insight, customMatrix.rows);
            const colKey = getInsightValueForDimension(insight, customMatrix.cols);
            if(rowKey && colKey) {
                if (!acc[rowKey]) acc[rowKey] = {};
                acc[rowKey][colKey] = (acc[rowKey][colKey] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, Record<string, number>>);
    }, [customMatrix, insights, products, feedbackClusters]);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Advanced Analysis" subtitle="Deep dive into feedback with custom reports and matrices." />
            <div className="p-8 space-y-8">
                <section className="bg-card rounded-lg border border-border p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-text-primary">Analysis & Filtering</h3>
                        <div className="flex space-x-2">
                            <button id="custom-matrix-btn" onClick={() => setIsCreatingMatrix(true)} className="px-3 py-1.5 text-sm rounded-md bg-primary/20 text-primary hover:bg-primary/40">
                                Create Custom Matrix
                            </button>
                            <button className="px-3 py-1.5 text-sm rounded-md bg-primary/20 text-primary hover:bg-primary/40">
                               Save View
                            </button>
                        </div>
                    </div>
                </section>
                
                {customMatrix && customMatrixData && (
                    <section className="bg-card rounded-lg border border-border p-6">
                        <h3 className="text-xl font-semibold mb-4 text-text-primary capitalize">Custom Matrix: {customMatrix.rows} vs. {customMatrix.cols}</h3>
                        <Heatmap 
                            data={customMatrixData} 
                            rows={getKeysForDimension(customMatrix.rows)} 
                            cols={getKeysForDimension(customMatrix.cols)} 
                            rowLabel={customMatrix.rows} 
                            colLabel={customMatrix.cols} 
                        />
                    </section>
                )}
                
                <section className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-xl font-semibold mb-4 text-text-primary">Impact vs. Frequency Matrix</h3>
                    <div style={{width: '100%', height: 400}}>
                        <ResponsiveContainer>
                             <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid stroke="#3f3f46" strokeDasharray="3 3"/>
                                <XAxis type="number" dataKey="x" name="Insight Count" unit=" insights" />
                                <YAxis type="number" dataKey="y" name="Impact" unit=" pts" />
                                <ZAxis type="number" dataKey="z" range={[100, 500]} name="Uncertainty" unit="pts" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#171717', borderColor: '#3f3f46' }} />
                                <Legend/>
                                <Scatter name="Feedback Clusters" data={scatterData} fill="#2563eb" shape="circle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
            {isCreatingMatrix && <CustomMatrixModal onClose={() => setIsCreatingMatrix(false)} onCreate={handleCreateMatrix} />}
        </div>
    );
}

export default FeedbackAnalysis;

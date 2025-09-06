import React from 'react';
import Header from '../common/Header';
import { RiceFeature } from '../../types';
import { useAppContext } from '../../context/AppContext';

const calculateRice = (f: RiceFeature) => (f.reach * f.impact * f.confidence) / f.effort;

const ProductPriorities: React.FC = () => {
    const { upstreamInitiatives: initiatives } = useAppContext();
    // Assuming initiatives are RICE features for this mock.
    // The mock data for UpstreamInitiative is missing RICE properties, so we add them here for demonstration.
    const mockRiceFeatures: RiceFeature[] = initiatives.map((initiative, index) => ({
        ...initiative,
        reach: [500, 1000, 200, 800][index % 4],
        impact: [3, 2, 1, 2][index % 4],
        confidence: [0.8, 0.9, 0.7, 0.95][index % 4],
        effort: [2, 4, 1, 3][index % 4],
    }));
    const sortedFeatures = [...mockRiceFeatures].sort((a, b) => calculateRice(b) - calculateRice(a));

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Product Priorities" subtitle="Prioritize features and initiatives with the RICE framework." />
            <div className="p-8">
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-semibold text-lg">RICE Scoring</h3>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-text-secondary uppercase bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-3 text-left">Feature</th>
                                    <th className="px-6 py-3 text-center">Reach</th>
                                    <th className="px-6 py-3 text-center">Impact</th>
                                    <th className="px-6 py-3 text-center">Confidence</th>
                                    <th className="px-6 py-3 text-center">Effort</th>
                                    <th className="px-6 py-3 text-center font-bold">RICE Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedFeatures.map(f => (
                                    <tr key={f.id} className="border-t border-border hover:bg-zinc-900/50">
                                        <td className="px-6 py-4 font-medium text-text-primary">{f.title}</td>
                                        <td className="px-6 py-4 text-center">{f.reach}</td>
                                        <td className="px-6 py-4 text-center">{f.impact}</td>
                                        <td className="px-6 py-4 text-center">{f.confidence * 100}%</td>
                                        <td className="px-6 py-4 text-center">{f.effort}</td>
                                        <td className="px-6 py-4 text-center font-bold text-lg text-primary">{calculateRice(f).toFixed(2)}</td>
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

export default ProductPriorities;

import React from 'react';
import Header from '../common/Header';
import { mockUpstreamInitiatives as mockInitiatives } from '../../services/mockData';
import { UpstreamInitiative as Initiative, UpstreamStatus } from '../../types';

const StatusBadge: React.FC<{ status: UpstreamStatus }> = ({ status }) => {
    // A simplified mapping for display purposes
    const colorMap: Record<string, string> = {
        'Backlog': 'bg-slate-500/20 text-slate-400',
        'Analysing Opportunity': 'bg-purple-500/20 text-purple-400',
        'Initial Research': 'bg-yellow-500/20 text-yellow-400',
        'Deep Research': 'bg-amber-500/20 text-amber-400',
        'Input for Discussion': 'bg-cyan-500/20 text-cyan-400',
        'Parked': 'bg-gray-500/20 text-gray-400',
        'Waiting for Development': 'bg-orange-500/20 text-orange-400',
        'In Development': 'bg-blue-500/20 text-blue-400',
        'Released': 'bg-teal-500/20 text-teal-400',
        'Done': 'bg-green-500/20 text-green-400',
    };
    const color = colorMap[status] || 'bg-gray-500/20 text-gray-400';
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{status}</span>;
};

const ProductInitiatives: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Product Initiatives" subtitle="Track major epics and initiatives linked to feedback." />
            <div className="p-8">
                <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border overflow-hidden">
                    <div className="p-4"><h3 className="font-semibold">Jira Integration (Mock)</h3></div>
                    <table className="w-full text-sm">
                        <thead className="text-xs text-vasco-text-secondary uppercase bg-vasco-dark-bg">
                            <tr>
                                <th className="px-6 py-3">Jira ID</th>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Linked Insights</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockInitiatives.map(i => (
                                <tr key={i.id} className="border-t border-vasco-dark-border hover:bg-vasco-dark-bg/50">
                                    <td className="px-6 py-4 font-mono text-vasco-primary hover:underline cursor-pointer">{i.jiraId}</td>
                                    <td className="px-6 py-4 font-medium">{i.title}</td>
                                    <td className="px-6 py-4"><StatusBadge status={i.status} /></td>
                                    <td className="px-6 py-4 text-center">{i.linkedInsights}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductInitiatives;

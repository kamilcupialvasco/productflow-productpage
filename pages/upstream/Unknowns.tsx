
import React, { useState } from 'react';
import Header from '../../components/common/Header';
import { Unknown } from '../../types';
import { useAppContext } from '../../context/AppContext';

const StatusBadge: React.FC<{ status: Unknown['status'] }> = ({ status }) => {
    const colors = {
        'New': 'bg-blue-500/20 text-blue-300',
        'Investigating': 'bg-yellow-500/20 text-yellow-300',
        'Resolved': 'bg-green-500/20 text-green-300',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>{status}</span>;
}

const Unknowns: React.FC = () => {
    const { unknowns, feedbackClusters, discoveryItems } = useAppContext();

    const getSourceName = (source: Unknown['source']) => {
        if (source.type === 'decision') {
            return discoveryItems.find(d => d.id === source.id)?.title || source.id;
        }
        return feedbackClusters.find(f => f.id === source.id)?.title || source.id;
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Unknowns" subtitle="Your central research backlog for open questions." />
            <div className="p-8">
                 <div className="flex justify-end mb-4">
                    <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover">Add Unknown</button>
                </div>
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-semibold text-lg">All Unknowns</h3>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-text-secondary uppercase bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-3 text-left">Question</th>
                                    <th className="px-6 py-3 text-left">Source</th>
                                    <th className="px-6 py-3 text-left">Owner</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unknowns.map(item => (
                                    <tr key={item.id} className="border-t border-border hover:bg-zinc-900/50">
                                        <td className="px-6 py-4 font-medium max-w-md">{item.question}</td>
                                        <td className="px-6 py-4 text-xs">
                                            <p className="font-semibold capitalize">{item.source.type}</p>
                                            <p className="text-text-secondary truncate max-w-xs">{getSourceName(item.source)}</p>
                                        </td>
                                        <td className="px-6 py-4">{item.owner}</td>
                                        <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:underline">View Details</button>
                                        </td>
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

export default Unknowns;

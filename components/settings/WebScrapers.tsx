

import React, { useState } from 'react';
import { WebScraper, UserRole } from '../../types';
// FIX: Correct import of `useAppContext` which is now properly exported from `AppContext.tsx`.
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const StatusBadge: React.FC<{ status: WebScraper['status'] }> = ({ status }) => {
    const colors = {
        'Active': 'bg-green-500/20 text-green-400',
        'Paused': 'bg-yellow-500/20 text-yellow-400',
        'Error': 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>{status}</span>;
};

const AddScraperModal: React.FC<{ onClose: () => void, onSave: (scraper: Omit<WebScraper, 'id'>) => void }> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

    const handleSave = () => {
        if (!name || !url) return;
        onSave({
            name,
            targetUrl: url,
            status: 'Paused',
            lastRun: 'Never',
            frequency,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-vasco-dark-card rounded-lg w-full max-w-lg">
                <div className="p-4 border-b border-vasco-dark-border"><h3>Add New Web Scraper</h3></div>
                <div className="p-6 space-y-4">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Scraper Name (e.g., 'Amazon DE Reviews')" className="w-full bg-vasco-dark-bg p-2 rounded"/>
                    <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Target URL" className="w-full bg-vasco-dark-bg p-2 rounded"/>
                    <select value={frequency} onChange={e => setFrequency(e.target.value as any)} className="w-full bg-vasco-dark-bg p-2 rounded">
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div>
                 <div className="p-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-vasco-dark-border">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded bg-vasco-primary text-white">Add Scraper</button>
                 </div>
            </div>
        </div>
    );
};

const WebScrapers: React.FC = () => {
    const { webScrapers, addWebScraper } = useAppContext();
    const { currentUser } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const canEdit = currentUser.role === UserRole.Admin;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Web Scrapers</h2>
                    <p className="text-vasco-text-secondary">Manage custom data sources from around the web.</p>
                </div>
                <button onClick={() => setIsAdding(true)} disabled={!canEdit} className="px-4 py-2 text-sm rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover disabled:opacity-50">Add Scraper</button>
            </div>
             <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border overflow-hidden">
                 <table className="w-full text-sm">
                    <thead className="text-xs text-vasco-text-secondary uppercase bg-vasco-dark-bg">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Target URL</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Last Run</th>
                            {canEdit && <th className="px-6 py-3 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {webScrapers.map(scraper => (
                             <tr key={scraper.id} className="border-t border-vasco-dark-border hover:bg-vasco-dark-bg/50">
                                <td className="px-6 py-4 font-medium">{scraper.name}</td>
                                <td className="px-6 py-4 text-vasco-text-secondary max-w-sm truncate"><a href={scraper.targetUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{scraper.targetUrl}</a></td>
                                <td className="px-6 py-4"><StatusBadge status={scraper.status} /></td>
                                <td className="px-6 py-4">{scraper.lastRun}</td>
                                {canEdit && (
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="text-vasco-primary hover:underline text-xs">Run Now</button>
                                        <button className="text-vasco-primary hover:underline text-xs">Edit</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isAdding && <AddScraperModal onClose={() => setIsAdding(false)} onSave={addWebScraper} />}
        </div>
    );
};

export default WebScrapers;
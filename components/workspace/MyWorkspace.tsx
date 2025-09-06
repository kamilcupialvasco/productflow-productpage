

import React, { useState } from 'react';
import Header from '../common/Header';
import { Page, Notification, UpstreamInitiative as Initiative } from '../../types';
// FIX: Correct import of `useAppContext` which is now properly exported from `AppContext.tsx`.
import { useAppContext } from '../../context/AppContext';

const AIWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Workspace Setup Assistant</h3>
            <p className="text-sm text-vasco-text-secondary mb-4">
                Let's personalize your workspace. What is your primary focus for this quarter?
            </p>
            <textarea 
                placeholder="e.g., 'Improving the onboarding experience for the V4 translator and reducing connectivity bugs on the W1 watch...'"
                className="w-full bg-vasco-dark-bg p-2 rounded-md h-24 text-sm"
            />
            <div className="flex justify-end space-x-2 mt-4">
                <button onClick={onClose} className="px-4 py-2 rounded-md bg-vasco-dark-border">Skip</button>
                <button onClick={onClose} className="px-4 py-2 rounded-md bg-vasco-primary text-white">Generate Workspace</button>
            </div>
        </div>
    </div>
);

const NotificationCard: React.FC<{ item: Notification; onClick: () => void }> = ({ item, onClick }) => (
    <div onClick={onClick} className={`flex items-start space-x-3 p-3 rounded-md cursor-pointer hover:bg-vasco-dark-bg/50 ${item.read ? 'opacity-60' : ''}`}>
        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${item.read ? 'bg-transparent' : 'bg-vasco-primary'}`}></div>
        <div>
            <p className="text-sm text-vasco-text-primary">{item.text}</p>
            <p className="text-xs text-vasco-text-secondary">{new Date(item.date).toLocaleString()}</p>
        </div>
    </div>
);

const PriorityCard: React.FC<{ initiative: Initiative }> = ({ initiative }) => (
     <div className="p-3 bg-vasco-dark-bg rounded-md">
        <p className="font-medium">{initiative.title}</p>
        <div className="text-xs text-vasco-text-secondary mt-1">Jira: {initiative.jiraId || 'N/A'} - {initiative.status}</div>
    </div>
);

interface MyWorkspaceProps {
    setActivePage: (page: Page, filters?: Record<string, any>) => void;
}

const MyWorkspace: React.FC<MyWorkspaceProps> = ({ setActivePage }) => {
    const { workspaceConfig, upstreamInitiatives: initiatives, loading } = useAppContext();
    const [showWizard, setShowWizard] = useState(false);
    const [activeTab, setActiveTab] = useState('priorities');
    
    if (loading || !workspaceConfig) {
        return <div className="flex-1 flex items-center justify-center">Loading workspace...</div>
    }

    const myPriorities = initiatives.filter(i => workspaceConfig.myPriorities.includes(i.id));

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="My Workspace" subtitle="Your personalized product management dashboard." />
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="border-b border-vasco-dark-border">
                        <nav className="-mb-px flex space-x-8">
                           <button onClick={() => setActiveTab('priorities')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'priorities' ? 'border-vasco-primary text-vasco-primary' : 'border-transparent text-vasco-text-secondary'}`}>My Priorities</button>
                           <button onClick={() => setActiveTab('reports')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'reports' ? 'border-vasco-primary text-vasco-primary' : 'border-transparent text-vasco-text-secondary'}`}>Saved Reports</button>
                           <button onClick={() => setActiveTab('notifications')} className={`py-2 px-1 border-b-2 text-sm relative ${activeTab === 'notifications' ? 'border-vasco-primary text-vasco-primary' : 'border-transparent text-vasco-text-secondary'}`}>
                               Notifications
                               {workspaceConfig.notifications.some(n => !n.read) && <span className="absolute top-1 -right-3 h-2 w-2 rounded-full bg-vasco-primary"></span>}
                            </button>
                        </nav>
                    </div>
                    <button onClick={() => setShowWizard(true)} className="px-4 py-2 text-sm rounded-md bg-vasco-primary/20 text-vasco-primary hover:bg-vasco-primary/40">
                        Run AI Setup Wizard
                    </button>
                </div>
                
                {activeTab === 'priorities' && (
                    <section className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border p-6">
                        <h3 className="text-xl font-semibold mb-4">My Priorities</h3>
                        <div className="space-y-3">
                            {myPriorities.map(p => <PriorityCard key={p.id} initiative={p} />)}
                        </div>
                    </section>
                )}
                
                {activeTab === 'reports' && (
                     <section className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border p-6">
                        <h3 className="text-xl font-semibold mb-4">Saved Reports</h3>
                        <div className="space-y-3">
                            {workspaceConfig.savedReports.map(report => (
                                <div key={report.id} onClick={() => setActivePage(report.page, report.filters)} className="p-3 bg-vasco-dark-bg rounded-md cursor-pointer hover:bg-vasco-dark-bg/50 transition-colors">
                                    <p className="font-medium">{report.name}</p>
                                    <p className="text-xs text-vasco-text-secondary">Navigates to {report.page} with preset filters.</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                 {activeTab === 'notifications' && (
                     <section className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border p-6">
                        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                        <div className="space-y-2">
                            {workspaceConfig.notifications.map(n => <NotificationCard key={n.id} item={n} onClick={() => setActivePage(n.page)} />)}
                        </div>
                    </section>
                )}

            </div>
            {showWizard && <AIWizard onClose={() => setShowWizard(false)} />}
        </div>
    );
};

export default MyWorkspace;

import React from 'react';
import Header from '../common/Header';
import { Page } from '../../types';

interface SettingsLayoutProps {
    activeTab: string;
    navigateTo: (page: Page) => void;
    children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ activeTab, navigateTo, children }) => {
    
    const getPageForTab = (tab: string): Page => `settings/${tab}`;
    const navLinks = [
        { id: 'users', label: 'Users & Permissions' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'scrapers', label: 'Web Scrapers'},
        { id: 'api', label: 'API & Webhooks' },
        { id: 'documentation', label: 'Documentation'},
        { id: 'changelog', label: 'Changelog'}
    ];

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Settings" subtitle="Manage your workspace and integrations." />
            <div className="border-b border-border px-8">
                <nav className="-mb-px flex space-x-8">
                    {navLinks.map(link => (
                         <button 
                            key={link.id}
                            onClick={() => navigateTo(getPageForTab(link.id))}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === link.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                            }`}
                         >
                             {link.label}
                         </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default SettingsLayout;
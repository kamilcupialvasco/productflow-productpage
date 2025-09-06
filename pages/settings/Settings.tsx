
import React from 'react';
import { Page } from '../../types';
import Integrations from './Integrations';
import Users from './Users';
import Api from './Api';
import WebScrapers from './WebScrapers';
import Documentation from './Documentation';
import SettingsLayout from '../../components/settings/SettingsLayout';
import Changelog from './Changelog';

interface SettingsProps {
    activeTab: string;
    navigateTo: (page: Page) => void;
}

const Settings: React.FC<SettingsProps> = ({ activeTab, navigateTo }) => {
    
    const renderContent = () => {
        switch(activeTab) {
            case 'integrations': return <Integrations />;
            case 'users': return <Users />;
            case 'api': return <Api />;
            case 'scrapers': return <WebScrapers />;
            case 'documentation': return <Documentation />;
            case 'changelog': return <Changelog />;
            default: return <Users />;
        }
    };
    
    return (
        <SettingsLayout activeTab={activeTab} navigateTo={navigateTo}>
            {renderContent()}
        </SettingsLayout>
    );
};

export default Settings;

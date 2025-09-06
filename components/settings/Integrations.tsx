import React, { useState } from 'react';

interface IntegrationCardProps {
    name: string;
    description: string;
    logo: string;
    connected: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ name, description, logo, connected: initialConnected }) => {
    const [connected, setConnected] = useState(initialConnected);

    return (
        <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border p-6 flex flex-col">
            <div className="flex items-center mb-4">
                <img src={logo} alt={`${name} logo`} className="h-10 w-10 mr-4" />
                <h3 className="text-xl font-semibold text-vasco-text-primary">{name}</h3>
            </div>
            <p className="text-vasco-text-secondary text-sm flex-1 mb-6">{description}</p>
            <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${connected ? 'text-green-400' : 'text-slate-400'}`}>
                    {connected ? 'Connected' : 'Not Connected'}
                </span>
                 <label htmlFor={`toggle-${name}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input id={`toggle-${name}`} type="checkbox" className="sr-only" checked={connected} onChange={() => setConnected(!connected)} />
                        <div className={`block w-14 h-8 rounded-full ${connected ? 'bg-vasco-primary' : 'bg-vasco-dark-bg'}`}></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
                    </div>
                </label>
            </div>
             <style>{`
                input:checked ~ .dot { transform: translateX(100%); }
             `}</style>
        </div>
    );
};


const Integrations: React.FC = () => {
    const integrationList: Omit<IntegrationCardProps, 'connected'>[] = [
        { name: 'Jira', description: 'Create and link Jira tickets directly from feedback insights.', logo: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg' },
        { name: 'Slack', description: 'Send notifications about new high-priority feedback to a Slack channel.', logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' },
        { name: 'Trustpilot', description: 'Automatically pull in new reviews and ratings from Trustpilot.', logo: 'https://cdn.worldvectorlogo.com/logos/trustpilot-2.svg' },
        { name: 'Amazon', description: 'Sync product reviews from your Amazon Seller Central account.', logo: 'https://cdn.worldvectorlogo.com/logos/amazon-icon.svg' },
        { name: 'Google Sheets', description: 'Import feedback from shared Google Sheets used by various teams.', logo: 'https://cdn.worldvectorlogo.com/logos/google-sheets.svg' },
        { name: 'Zendesk', description: 'Connect customer support tickets from Zendesk to analyze trends.', logo: 'https://cdn.worldvectorlogo.com/logos/zendesk.svg' },
    ];
    
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Integrations</h2>
            <p className="text-vasco-text-secondary mb-6">Connect your tools to centralize feedback.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard {...integrationList[0]} connected={true} />
                <IntegrationCard {...integrationList[1]} connected={true} />
                <IntegrationCard {...integrationList[2]} connected={false} />
                <IntegrationCard {...integrationList[3]} connected={false} />
                <IntegrationCard {...integrationList[4]} connected={true} />
                <IntegrationCard {...integrationList[5]} connected={false} />
            </div>
        </div>
    );
};

export default Integrations;
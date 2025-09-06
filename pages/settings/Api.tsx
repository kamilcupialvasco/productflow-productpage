
import React, { useState } from 'react';

const Api: React.FC = () => {
    const [apiKey, setApiKey] = useState('pf_live_********************' + Math.random().toString(36).substring(2, 8));
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">API & Webhooks</h2>
            <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-xl font-semibold">API Keys</h3>
                <p className="mt-2 text-text-secondary text-sm">Use API keys to integrate your internal tools with productflow.online.</p>
                <div className="mt-4 bg-background p-4 rounded-md flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold">Default API Key</p>
                        <p className="font-mono text-text-secondary text-sm">{apiKey}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleCopy} className="px-3 py-1.5 rounded-md bg-border text-sm hover:bg-zinc-600">
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                         <button className="px-3 py-1.5 rounded-md bg-red-500/20 text-red-400 text-sm hover:bg-red-500/40">Revoke</button>
                    </div>
                </div>
                 <button className="mt-4 px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary-hover">Generate New Key</button>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 mt-8">
                <h3 className="text-xl font-semibold">Webhooks</h3>
                 <p className="mt-2 text-text-secondary text-sm">Configure webhooks to receive real-time updates for events like new insights.</p>
                 <div className="mt-4 p-4 border-2 border-dashed border-border rounded-md h-32 flex items-center justify-center">
                    <p className="text-text-secondary">No webhooks configured.</p>
                 </div>
                 <button className="mt-4 px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary-hover">Add Webhook</button>
            </div>
        </div>
    );
};

export default Api;

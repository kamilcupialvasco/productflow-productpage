
import React, { useMemo } from 'react';
import { Page, IntegrationStatus, Anomaly, Insight, Sentiment } from '../../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import Hint from '../../components/common/Hint';
import TourStep from '../../components/common/TourStep';
import Header from '../../components/common/Header';


const StatusIndicator: React.FC<{ status: 'ok' | 'error' }> = ({ status }) => {
    const isOk = status === 'ok';
    return (
        <span className={`flex items-center text-xs ${isOk ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`h-2 w-2 rounded-full mr-2 ${isOk ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isOk ? 'Connected' : 'Error'}
        </span>
    );
};

const IntegrationStatusCard: React.FC<{ item: IntegrationStatus }> = ({ item }) => (
    <div className="flex items-center justify-between p-3 bg-background/50 rounded-md">
        <div>
            <p className="font-medium text-sm">{item.id}</p>
            <p className="text-xs text-text-secondary">Last sync: {item.lastSync}</p>
        </div>
        <div className="text-right">
            <StatusIndicator status={item.status} />
            <p className="text-xs text-text-secondary">{item.newInsights} new insights</p>
        </div>
    </div>
);

const AnomalyCard: React.FC<{ item: Anomaly; onClick: () => void }> = ({ item, onClick }) => {
    const severityClasses = {
        High: 'border-red-500 bg-red-500/10',
        Medium: 'border-yellow-500 bg-yellow-500/10',
        Low: 'border-blue-500 bg-blue-500/10',
    };
    return (
        <div onClick={onClick} className={`p-4 rounded-lg border-l-4 cursor-pointer hover:bg-background ${severityClasses[item.severity]}`}>
            <h4 className="font-semibold text-text-primary">{item.title}</h4>
            <p className="text-sm text-text-secondary mt-1">{item.description}</p>
        </div>
    );
};

interface HomeProps {
    setActivePage: (page: Page) => void;
    onViewAnomaly: (anomalyId: string) => void;
    startTour: () => void;
}

const Home: React.FC<HomeProps> = ({ setActivePage, onViewAnomaly, startTour }) => {
    const { insights, integrationStatus, anomalies, loading } = useAppContext();

    const last24hInsights = useMemo(() => 
        insights.filter(i => new Date(i.date) > new Date(Date.now() - 24 * 60 * 60 * 1000)),
        [insights]
    );
    
    const trendData = useMemo(() => last24hInsights
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .reduce((acc, item) => {
            const hour = new Date(item.date).getHours();
            const existing = acc.find(x => x.hour === hour);
            if(existing) {
                existing.count++;
            } else {
                acc.push({ hour, count: 1 });
            }
            return acc;
    }, [] as { hour: number; count: number }[]), [last24hInsights]);

    if (loading) {
        return <div className="flex-1 flex items-center justify-center text-lg">Loading Workspace...</div>
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Home" subtitle="Welcome back! Here's your daily briefing." />
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-card rounded-lg border border-border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Daily Briefing: Last 24 Hours</h3>
                            <button onClick={startTour} className="text-sm text-primary hover:underline">Start Tutorial</button>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                                    <XAxis dataKey="hour" unit=":00" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#3f3f46' }} />
                                    <Line type="monotone" dataKey="count" name="New Insights" stroke="#2563eb" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <TourStep
                        target="#home-anomalies"
                        title="Anomaly Detection"
                        content="Our AI automatically detects unusual trends in your feedback data. Click on a card to investigate further."
                    >
                        <section id="home-anomalies" className="bg-card rounded-lg border border-border p-6">
                             <div className="flex items-center mb-4">
                                <h3 className="text-xl font-semibold">Anomalies Detected</h3>
                                <Hint content="AI scans for sudden spikes, drops, or changes in sentiment that deviate from the norm." />
                            </div>
                            <div className="space-y-4">
                                {anomalies.map(item => (
                                    <AnomalyCard key={item.id} item={item} onClick={() => onViewAnomaly(item.id)} />
                                ))}
                            </div>
                        </section>
                    </TourStep>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="bg-card rounded-lg border border-border p-6">
                        <h3 className="text-xl font-semibold mb-4">Integration Status</h3>
                        <div className="space-y-3">
                            {integrationStatus.map(item => (
                                <IntegrationStatusCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                     <section className="bg-card rounded-lg border border-border p-6">
                        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-primary">{last24hInsights.length}</p>
                                <p className="text-sm text-text-secondary">New Insights (24h)</p>
                            </div>
                             <div className="text-center">
                                <p className="text-4xl font-bold text-red-400">{last24hInsights.filter(i => i.sentiment === Sentiment.Negative).length}</p>
                                <p className="text-sm text-text-secondary">Negative Insights (24h)</p>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
};

export default Home;

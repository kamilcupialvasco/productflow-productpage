
import React, { useState } from 'react';
import Header from '../../components/common/Header';
import { mockUserJourneys, mockInsightData } from '../../services/mockData';
import { UserJourney, Insight, JourneyStage } from '../../types';

const InsightCard: React.FC<{ insight: Insight; onClick: () => void }> = ({ insight, onClick }) => (
    <div onClick={onClick} className="p-3 bg-background rounded-md border border-border/50 cursor-pointer hover:border-primary transition-colors">
        <p className="text-xs text-text-primary line-clamp-2" title={insight.content}>"{insight.content}"</p>
        <p className="text-xs text-text-secondary mt-1">{insight.source} - {insight.sentiment}</p>
    </div>
)

const JourneyStageColumn: React.FC<{ stage: JourneyStage; onViewInsight: (id: string) => void }> = ({ stage, onViewInsight }) => {
    // This is a mockup of filtering logic
    const insightsForStage = mockInsightData
        .filter(i => stage.productIds.includes(i.productId) || (stage.productIds.length === 0 && Math.random() < 0.1))
        .slice(0, 5);

    return (
        <div className="w-72 flex-shrink-0 bg-card rounded-lg p-3">
            <h4 className="font-semibold text-text-primary text-center pb-2">{stage.name}</h4>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto p-1">
                {insightsForStage.length > 0 
                    ? insightsForStage.map(i => <InsightCard key={i.id} insight={i} onClick={() => onViewInsight(i.id)} />)
                    : <p className="text-xs text-center text-text-secondary py-4">No insights for this stage.</p>
                }
            </div>
        </div>
    )
};

interface UserJourneyProps {
    onViewInsight: (insightId: string) => void;
}

const UserJourney: React.FC<UserJourneyProps> = ({ onViewInsight }) => {
    const [journeys, setJourneys] = useState<UserJourney[]>(mockUserJourneys);
    const [selectedJourneyId, setSelectedJourneyId] = useState<string>(journeys[0]?.id);

    const selectedJourney = journeys.find(j => j.id === selectedJourneyId);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="User Journey Feedback" subtitle="Map insights to key stages in the user lifecycle." />
            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <label htmlFor="journey-select" className="text-sm text-text-secondary mr-2">Select Journey:</label>
                        <select
                            id="journey-select"
                            value={selectedJourneyId}
                            onChange={(e) => setSelectedJourneyId(e.target.value)}
                             className="bg-card border border-border rounded-md px-3 py-1.5 text-sm focus:ring-primary focus:border-primary"
                        >
                            {journeys.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                        </select>
                    </div>
                    <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-white hover:bg-primary-hover">Create New Journey</button>
                </div>

                {selectedJourney ? (
                    <div className="flex-1 overflow-x-auto pb-4">
                        <div className="inline-flex items-start space-x-6">
                            {selectedJourney.stages.map((stage, index) => (
                                <React.Fragment key={stage.id}>
                                    <JourneyStageColumn stage={stage} onViewInsight={onViewInsight} />
                                    {index < selectedJourney.stages.length - 1 && (
                                        <div className="self-center -mx-3">
                                            <svg className="h-8 w-8 text-border" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-text-secondary">No journey selected. Please create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserJourney;

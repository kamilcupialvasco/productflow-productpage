

import React from 'react';
import Header from '../common/Header';
import { Objective, KeyResult, Page } from '../../types';
// FIX: Correct import of `useAppContext` which is now properly exported from `AppContext.tsx`.
import { useAppContext } from '../../context/AppContext';

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-vasco-dark-bg rounded-full h-2.5">
        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
);

const KeyResultItem: React.FC<{ kr: KeyResult }> = ({ kr }) => {
    const { hypotheses } = useAppContext();
    const linkedHypotheses = hypotheses.filter(h => h.linkedOutcomeIds?.includes(kr.id));
    return (
    <div className="p-3 bg-vasco-dark-bg/50 rounded-md">
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-vasco-text-primary flex-1">{kr.text}</p>
            <span className="text-sm font-semibold ml-4">{kr.progress}%</span>
        </div>
        <ProgressBar progress={kr.progress} />
        {linkedHypotheses.length > 0 && (
            <div className="mt-2 text-xs">
                <span className="font-semibold">Validating Hypotheses: </span>
                <span className="text-vasco-text-secondary">{linkedHypotheses.map(h => `"${h.title}"`).join(', ')}</span>
            </div>
        )}
    </div>
)};

const ObjectiveCard: React.FC<{ objective: Objective }> = ({ objective }) => {
    const { companyStrategy } = useAppContext();
    const overallProgress = objective.keyResults.length > 0
        ? Math.round(objective.keyResults.reduce((acc, kr) => acc + kr.progress, 0) / objective.keyResults.length)
        : 0;
    const linkedPillar = companyStrategy?.pillars.find(p => p.id === objective.linkedPillarId);

    return (
        <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-vasco-text-primary">{objective.title}</h3>
                    {linkedPillar && <p className="text-xs text-vasco-primary font-medium mt-1">Supports Pillar: {linkedPillar.title}</p>}
                </div>
                <div className="text-right">
                    <p className="font-bold text-2xl text-green-400">{overallProgress}%</p>
                    <p className="text-xs text-vasco-text-secondary">Overall Progress</p>
                </div>
            </div>
            <div className="space-y-3">
                {objective.keyResults.map(kr => <KeyResultItem key={kr.id} kr={kr} />)}
            </div>
        </div>
    );
};


const ExpectedOutcomes: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
    const { objectives } = useAppContext();
    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Expected Outcomes (OKRs)" subtitle="Define and track key business and user outcomes." />
            <div className="p-8">
                 <div className="flex justify-end mb-4">
                    <button className="px-4 py-2 rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover">New Objective</button>
                </div>
                <div className="space-y-8">
                    {objectives.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)}
                </div>
            </div>
        </div>
    );
};

export default ExpectedOutcomes;
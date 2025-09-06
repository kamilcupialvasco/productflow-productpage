
import React, { useState } from 'react';
import Header from '../../components/common/Header';

const checklistItems = [
    { id: 'c1', category: 'Clarity & Alignment', question: 'Is our product vision clearly defined and understood by the entire team?' },
    { id: 'c2', category: 'Clarity & Alignment', question: 'Does our product strategy directly support the overall company vision?' },
    { id: 'c3', category: 'Customer Focus', question: 'Are our strategic pillars directly addressing validated customer problems or needs?' },
    { id: 'c4', category: 'Customer Focus', question: 'Have we validated our key assumptions with real user research in the last 3 months?' },
    { id: 'c5', 'category': 'Measurability', question: 'Are our OKRs ambitious yet achievable, and are they directly measurable?' },
    { id: 'c6', 'category': 'Measurability', question: 'Can we directly link our prioritized initiatives back to specific Key Results?' },
    { id: 'c7', 'category': 'Viability', question: 'Does the team have the resources and skills necessary to execute on this strategy?' },
];

const ChecklistItem: React.FC<{ item: typeof checklistItems[0] }> = ({ item }) => {
    const [checked, setChecked] = useState(false);
    return (
        <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-md">
            <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} className="mt-1 h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary" />
            <label className="flex-1">
                <p className={`text-sm ${checked ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{item.question}</p>
                <p className="text-xs text-text-secondary">{item.category}</p>
            </label>
        </div>
    )
}


const StrategyHealthcheck: React.FC = () => {
    const [aiQuestions, setAiQuestions] = useState<string[]>([]);
    
    const generateAiQuestions = () => {
        setAiQuestions([
            "Based on recent feedback about 'build quality', how does our 'User-Centric Design' pillar address hardware satisfaction?",
            "Recent anomaly detection shows a drop in Photo Translator usage. Does any current OKR address engagement for this feature?",
            "Given the high number of feature requests for 'Cloud Sync', does our current roadmap reflect its strategic importance?"
        ]);
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Strategy Healthcheck" subtitle="Periodically review and strengthen your product strategy." />
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-card rounded-lg border border-border p-6">
                        <h3 className="text-xl font-semibold mb-4">Core Checklist</h3>
                        <div className="space-y-3">
                            {checklistItems.map(item => <ChecklistItem key={item.id} item={item} />)}
                        </div>
                    </section>
                </div>
                <div className="lg:col-span-1">
                     <section className="bg-card rounded-lg border border-border p-6 sticky top-8">
                        <h3 className="text-xl font-semibold mb-4">AI Strategy Assistant</h3>
                        <p className="text-sm text-text-secondary mb-4">Let AI analyze your current data to generate critical questions you might be missing.</p>
                        <button onClick={generateAiQuestions} className="w-full px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition">Generate Questions</button>
                        {aiQuestions.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold mb-2">Generated Questions:</h4>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    {aiQuestions.map((q, i) => <li key={i}>{q}</li>)}
                                </ul>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StrategyHealthcheck;
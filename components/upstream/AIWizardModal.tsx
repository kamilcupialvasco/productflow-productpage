
import React, { useState } from 'react';
import { UpstreamInitiative } from '../../types';

interface AIWizardModalProps {
  item: UpstreamInitiative;
  onClose: () => void;
  onSave: (generatedContent: { summary: string }) => void;
}

type WizardStep = 'problem' | 'solution' | 'risks' | 'metrics';

const AIWizardModal: React.FC<AIWizardModalProps> = ({ item, onClose, onSave }) => {
    const [activeStep, setActiveStep] = useState<WizardStep>('problem');
    const [generatedContent, setGeneratedContent] = useState<Record<WizardStep, string>>({
        problem: '',
        solution: '',
        risks: '',
        metrics: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const prompts: Record<WizardStep, string> = {
        problem: `Based on the initiative "${item.title}" (${item.summary}), write a detailed Problem Statement from the user's perspective. Use the "Problem/Solution Fit" framework.`,
        solution: `For the initiative "${item.title}", propose a high-level solution. Describe the core user-facing features and how they address the problem statement.`,
        risks: `Identify at least 3 potential risks (business, technical, user) for the initiative "${item.title}". For each, suggest a mitigation strategy.`,
        metrics: `Suggest 3-4 key success metrics (KPIs) to measure the impact of the initiative "${item.title}". Include both lagging and leading indicators.`
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        // Mock AI Call
        const mockResponses: Record<WizardStep, string> = {
            problem: `**Problem:** Users find the current photo translation feature slow and unreliable, especially in low-light conditions. This leads to frustration when trying to translate menus or signs while traveling, diminishing the value of the device as a travel companion.\n\n**Target Audience:** Travelers who rely on instant translation for navigation and daily interactions.`,
            solution: `**Proposed Solution:** We will implement a new on-device OCR engine with enhanced low-light processing. Key features include:\n1. **Instant Text Capture:** Faster recognition of text from the camera feed.\n2. **Low-Light Mode:** An AI-powered image enhancement filter that activates automatically.\n3. **Offline Capability:** Core functionality will work without an internet connection.`,
            risks: `1. **Technical Risk:** The new OCR engine may have high battery consumption. Mitigation: Perform extensive battery performance testing.\n2. **User Risk:** Users might find the new UI confusing. Mitigation: Conduct A/B testing with a small user group before full rollout.\n3. **Business Risk:** Licensing costs for the new engine could be high. Mitigation: Evaluate open-source alternatives and negotiate pricing.`,
            metrics: `1. **Success Metric (Lagging):** Increase in Photo Translator NPS by 15 points within 3 months post-launch.\n2. **Adoption Rate (Leading):** 25% of Monthly Active Users (MAU) use the feature at least once a week.\n3. **Performance Metric (Leading):** Reduce average text recognition time from 3.5s to under 1.5s.`
        };
        
        await new Promise(res => setTimeout(res, 1000));
        setGeneratedContent(prev => ({ ...prev, [activeStep]: mockResponses[activeStep] }));
        setIsLoading(false);
    };
    
    const handleSave = () => {
        const fullSummary = `
## Problem Statement
${generatedContent.problem}

## Proposed Solution
${generatedContent.solution}

## Risks & Mitigations
${generatedContent.risks}

## Success Metrics
${generatedContent.metrics}
        `;
        onSave({ summary: fullSummary.trim() });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center animate-fade-in">
            <div className="bg-vasco-dark-card rounded-lg border border-vasco-dark-border w-full max-w-3xl flex flex-col h-[80vh]">
                 <div className="p-4 border-b border-vasco-dark-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                        <span role="img" aria-label="AI Assistant">💡</span>
                        <span>AI Assistant: {item.title}</span>
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-vasco-dark-bg text-2xl leading-none">&times;</button>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <aside className="w-1/4 border-r border-vasco-dark-border p-4">
                        <nav className="space-y-2">
                            {(Object.keys(prompts) as WizardStep[]).map(step => (
                                <button key={step} onClick={() => setActiveStep(step)} className={`w-full text-left px-3 py-2 rounded-md text-sm capitalize ${activeStep === step ? 'bg-vasco-primary text-white' : 'hover:bg-vasco-dark-bg'}`}>
                                    {step.replace('_', ' ')}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="w-3/4 flex flex-col p-6">
                        <h4 className="font-semibold text-lg capitalize">{activeStep}</h4>
                        <p className="text-sm text-vasco-text-secondary mb-2">{prompts[activeStep]}</p>
                        <button onClick={handleGenerate} disabled={isLoading} className="px-3 py-1.5 text-sm rounded-md bg-vasco-primary/20 text-vasco-primary self-start mb-2 disabled:opacity-50">
                            {isLoading ? 'Generating...' : 'Generate with AI'}
                        </button>
                        <textarea
                            value={generatedContent[activeStep]}
                            onChange={e => setGeneratedContent({...generatedContent, [activeStep]: e.target.value})}
                            className="w-full flex-1 bg-vasco-dark-bg p-3 rounded-md text-sm resize-none"
                        />
                    </main>
                </div>
                 <div className="p-4 border-t border-vasco-dark-border flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-vasco-dark-border">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-vasco-primary text-white">Copy Content to Initiative</button>
                 </div>
            </div>
        </div>
    );
};

export default AIWizardModal;
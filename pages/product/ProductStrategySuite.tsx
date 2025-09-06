
import React, { useState } from 'react';
import Header from '../../components/common/Header';
import { mockCompanyStrategy, mockObjectives, mockUpstreamInitiatives } from '../../services/mockData';
import { Objective, RiceFeature, StrategicPillar, CompanyStrategy, UpstreamInitiative as Initiative } from '../../types';

const calculateRice = (f: RiceFeature) => (f.reach * f.impact * f.confidence) / f.effort;

const ExpandableSection: React.FC<{title: string, statement: string, explanation: string}> = ({title, statement, explanation}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="p-4 bg-background/50 rounded-lg">
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-primary">{title}</h3>
                    <p className="text-text-primary">{statement}</p>
                </div>
                <span className="text-xl">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="mt-3 pt-3 border-t border-border">
                    <h4 className="text-sm font-semibold text-text-secondary mb-1">What we understand by that:</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>
    );
};

const PillarCard: React.FC<{pillar: StrategicPillar}> = ({pillar}) => {
     const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="p-4 bg-background rounded-md">
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                <h4 className="font-semibold text-primary">{pillar.title}</h4>
                <p className="text-sm text-text-secondary mt-1">{pillar.description}</p>
            </div>
             {isOpen && (
                <div className="mt-3 pt-3 border-t border-border">
                     <div className="prose prose-invert prose-sm max-w-none p-2 bg-background/50 rounded-md border border-border">
                        <p>{pillar.longDescription || 'No detailed description available.'}</p>
                        {/* Mock rich text editor */}
                        <p>You could <strong>edit</strong> this with a <em>rich text editor</em>.</p>
                     </div>
                </div>
            )}
        </div>
    )
}

const ProductStrategySuite: React.FC = () => {
    const [strategy, setStrategy] = useState<CompanyStrategy>(mockCompanyStrategy);
    const [objectives, setObjectives] = useState<Objective[]>(mockObjectives);
    const [initiatives, setInitiatives] = useState<Initiative[]>(mockUpstreamInitiatives);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Product Strategy Suite" subtitle="The golden thread from company vision to daily priorities." />
            <div className="p-8 space-y-6">
                 {/* Top Level */}
                 <div className="p-6 bg-card/50 rounded-lg border border-border space-y-4">
                     <ExpandableSection title="Company Vision" statement={strategy.companyVision.statement} explanation={strategy.companyVision.explanation} />
                     <ExpandableSection title="Product Department Mission" statement={strategy.productDepartmentMission.statement} explanation={strategy.productDepartmentMission.explanation} />
                </div>
                
                {/* Main Flow */}
                <div className="space-y-4">
                    <div className="p-6 bg-card/50 rounded-lg border border-border">
                        <h2 className="text-2xl font-bold mb-4">Strategic Pillars</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {strategy.pillars.map(p => <PillarCard key={p.id} pillar={p} />)}
                        </div>
                    </div>
                    
                    <div className="flex justify-center h-8 items-center"><div className="w-px h-full bg-border"></div></div>
                    
                    <div className="p-6 bg-card/50 rounded-lg border border-border">
                        <h2 className="text-2xl font-bold mb-4">Outcomes (OKRs)</h2>
                        <div className="space-y-4">
                        {objectives.map(obj => {
                            const linkedPillar = strategy.pillars.find(p => p.id === obj.linkedPillarId);
                            return (
                                <div key={obj.id} className="p-4 bg-background rounded-md border-l-4 border-primary">
                                    <p className="text-xs text-primary font-semibold">{linkedPillar?.title}</p>
                                    <h4 className="font-semibold text-text-primary">{obj.title}</h4>
                                    {obj.keyResults.map(kr => {
                                        const linkedInitiatives = initiatives.filter(i => kr.linkedInitiativeIds?.includes(i.id));
                                        return (
                                            <div key={kr.id} className="mt-3">
                                                <div className="flex justify-between items-center text-sm mb-1"><p>{kr.text}</p><p>{kr.progress}%</p></div>
                                                <div className="w-full bg-border rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${kr.progress}%` }}></div></div>
                                                {linkedInitiatives.length > 0 && (
                                                    <div className="mt-2 text-xs flex items-center space-x-2">
                                                        <span>🔗</span>
                                                        {linkedInitiatives.map(li => <span key={li.id} className="bg-border px-1.5 py-0.5 rounded-full">{li.title}</span>)}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductStrategySuite;
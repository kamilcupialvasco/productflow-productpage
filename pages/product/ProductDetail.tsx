
import React, { useState } from 'react';
import { Product, Hardware, Software, Page } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import HardwareSpecConfigModal from '../../components/product/HardwareSpecConfigModal';

interface ProductDetailProps {
    product: Product;
    onBack: () => void;
    onViewInsight: (insightId: string) => void;
    navigateTo: (page: Page) => void;
}

const SoftwareFeatureManagement: React.FC<{ software: Software }> = ({ software }) => {
    return (
        <div className="space-y-4">
            {software.features.map(feature => (
                <div key={feature.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-text-primary">{feature.name}</p>
                            <p className="text-sm text-text-secondary mt-1">{feature.description}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">{feature.status}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const HardwareSpecManagement: React.FC<{ hardware: Hardware, onSave: (updates: Partial<Hardware>) => void }> = ({ hardware, onSave }) => {
     const { products } = useAppContext();
     const softwareProducts = products.filter(p => p.category === 'Software') as Software[];
     const [isConfiguring, setIsConfiguring] = useState(false);
     
     const handleSaveSpecs = (newSpecs: Record<string, string>) => {
        onSave({ specifications: newSpecs });
        setIsConfiguring(false);
     };

     return (
        <div className="space-y-8">
            {isConfiguring && <HardwareSpecConfigModal hardware={hardware} onClose={() => setIsConfiguring(false)} onSave={handleSaveSpecs} />}
            {hardware.mediaGallery.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-3 text-lg">Image Gallery</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {hardware.mediaGallery.map((media, idx) => (
                            <img key={idx} src={media.url} alt={`${hardware.name} ${media.type}`} className="rounded-lg w-full h-auto object-cover" />
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between items-center mb-3">
                         <h4 className="font-semibold text-lg">Core Specifications</h4>
                         <button onClick={() => setIsConfiguring(true)} className="text-xs px-3 py-1 rounded-md bg-border hover:bg-zinc-700">Configure</button>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(hardware.specifications).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-2 gap-2 items-center">
                                <span className="text-sm text-text-secondary text-right pr-4">{key}</span>
                                <span className="col-span-1 bg-background border border-border rounded px-3 py-1.5 text-sm">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3 text-lg">Color Variants</h4>
                        <div className="flex flex-wrap gap-2">
                            {hardware.colorVariants.map(color => <span key={color} className="px-3 py-1 rounded-full bg-background text-sm">{color}</span>)}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-lg">Bundled Software</h4>
                        <ul className="space-y-2">
                            {hardware.bundledSoftware.map(sw => {
                                const software = softwareProducts.find(s => s.id === sw.softwareId);
                                return (
                                    <li key={sw.softwareId} className="flex justify-between items-center p-2 bg-background rounded-md text-sm">
                                        <span>{software?.name || sw.softwareId}</span>
                                        <span className="font-mono bg-border px-2 py-1 rounded-md text-xs">{sw.version}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
     )
};

const FeedbackSummary: React.FC<{ productId: string, onViewInsight: (id: string) => void }> = ({ productId, onViewInsight }) => {
    const { insights } = useAppContext();
    const relatedInsights = insights.filter(i => i.productId === productId);
    
    const sentimentData = relatedInsights.reduce((acc, item) => {
        acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const chartData = Object.entries(sentimentData).map(([name, value]) => ({name, value}));
    
    return (
        <div className="space-y-6">
            <div className="p-4 bg-background/50 rounded-lg text-center">
                <p className="text-4xl font-bold">{relatedInsights.length}</p>
                <p className="text-text-secondary">Total Insights</p>
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#3f3f46' }} />
                        <Bar dataKey="value" fill="#2563eb" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h4 className="font-semibold mb-2">Recent Insights</h4>
                <div className="space-y-2">
                    {relatedInsights.slice(0, 5).map(i => (
                        <div key={i.id} onClick={() => onViewInsight(i.id)} className="p-2 bg-background rounded-md text-xs cursor-pointer hover:bg-border">{i.content}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProductStrategyTab: React.FC<{ product: Product }> = ({ product }) => {
    const { personas } = useAppContext();
    const linkedPersonas = personas.filter(p => product.linkedPersonaIds?.includes(p.id));
    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold mb-2">Product Vision</h4>
                <p className="p-3 bg-background rounded-md text-sm">{product.strategy?.vision || "Not defined."}</p>
            </div>
             <div>
                <h4 className="text-lg font-semibold mb-2">Linked Personas</h4>
                <div className="flex space-x-4">
                    {linkedPersonas.map(p => (
                        <div key={p.id} className="text-center">
                            <img src={p.avatarUrl} className="w-16 h-16 rounded-full mx-auto"/>
                            <p className="text-sm mt-1">{p.name}</p>
                        </div>
                    ))}
                     {linkedPersonas.length === 0 && <p className="text-sm text-text-secondary">No personas linked.</p>}
                </div>
            </div>
        </div>
    )
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onViewInsight, navigateTo }) => {
    const { updateProduct } = useAppContext();
    const TABS_SW = ['Features', 'Feedback', 'Strategy'];
    const TABS_HW = ['Specifications', 'Feedback', 'KPIs', 'Strategy'];
    const TABS = product.category === 'Software' ? TABS_SW : TABS_HW;

    const [activeTab, setActiveTab] = useState(TABS[0]);
    
    const handleSaveProduct = (updates: Partial<Product>) => {
        updateProduct(product.id, updates);
    };

    const renderContent = () => {
        if (product.category === 'Software') {
            switch(activeTab) {
                case 'Features':
                    return <SoftwareFeatureManagement software={product as Software} />;
                case 'Feedback':
                    return <FeedbackSummary productId={product.id} onViewInsight={onViewInsight} />;
                case 'Strategy':
                    return <ProductStrategyTab product={product} />;
                default:
                    return null;
            }
        } else {
            switch(activeTab) {
                case 'Specifications':
                    return <HardwareSpecManagement hardware={product as Hardware} onSave={handleSaveProduct} />;
                case 'Feedback':
                    return <FeedbackSummary productId={product.id} onViewInsight={onViewInsight} />;
                case 'KPIs':
                     return <button onClick={() => navigateTo(`product/kpis/${product.id}`)} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover">View Full KPI Dashboard</button>;
                case 'Strategy':
                    return <ProductStrategyTab product={product} />;
                default:
                    return null;
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="flex-shrink-0 h-16 bg-card border-b border-border flex items-center px-8 justify-between">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-background">&larr;</button>
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">{product.name}</h2>
                        <p className="text-sm text-text-secondary">{product.subCategory} - Owner: {product.owner}</p>
                    </div>
                </div>
                 <div className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full flex items-center animate-pulse">
                    <span className="mr-2">⚠️</span> Strategy Misalignment Detected
                </div>
            </header>
            <div className="flex-1 flex overflow-hidden">
                <aside className="w-56 p-4 border-r border-border">
                    <nav className="space-y-2">
                        {TABS.map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeTab === tab ? 'bg-primary text-white font-semibold' : 'hover:bg-background text-text-secondary hover:text-text-primary'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    )
};

export default ProductDetail;
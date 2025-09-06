
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Product, Hardware } from '../../types';

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-card p-6 rounded-lg border border-border transition-shadow hover:shadow-xl">
        <h4 className="text-lg font-semibold text-text-primary mb-4">{title}</h4>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

const KPIStatCard: React.FC<{ kpi: { name: string; value: string; target: string; trend: 'up' | 'down' | 'stable' } }> = ({ kpi }) => {
    const isTargetMet = parseFloat(kpi.value) >= parseFloat(kpi.target);
    const color = isTargetMet ? 'text-green-400' : 'text-yellow-400';
    
    return (
        <div className="bg-card p-6 rounded-lg border border-border text-center">
            <p className="text-sm text-text-secondary">{kpi.name}</p>
            <p className={`text-4xl font-bold my-2 ${color}`}>{kpi.value}</p>
            <div className="flex justify-center items-center text-xs text-text-secondary">
                <span>Target: {kpi.target}</span>
                <span className={`ml-2 h-3 w-3 rounded-full ${isTargetMet ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            </div>
        </div>
    );
};

const COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#c026d3', '#db2777'];

const isHardware = (product: Product): product is Hardware => {
    return product.category === 'Hardware';
}

const ProductKPIs: React.FC<{ product: Product; onBack: () => void }> = ({ product, onBack }) => {
    
    if (!isHardware(product) || !product.kpis) {
        return (
             <div className="flex-1 flex flex-col">
                <header className="flex-shrink-0 h-16 bg-card border-b border-border flex items-center px-8">
                    <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-background">&larr;</button>
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">Product KPIs</h2>
                        <p className="text-sm text-text-secondary">No KPIs defined for {product.name}</p>
                    </div>
                </header>
                <div className="p-8">No data available for this product.</div>
             </div>
        )
    }

    const { kpis } = product;

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
             <header className="flex-shrink-0 h-16 bg-card border-b border-border flex items-center px-8">
                <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-background">&larr;</button>
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">Product KPIs</h2>
                    <p className="text-sm text-text-secondary">Performance metrics for {product.name}</p>
                </div>
            </header>
            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {kpis.keyMetrics.map(kpi => <KPIStatCard key={kpi.id} kpi={kpi} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartContainer title="Sales (Units per Month)">
                        <ResponsiveContainer>
                            <LineChart data={kpis.sales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleString('default', { month: 'short' })} />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#3f3f46' }} />
                                <Legend />
                                <Line type="monotone" dataKey="units" stroke="#2563eb" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer title="Monthly Active Users (MAU)">
                        <ResponsiveContainer>
                            <BarChart data={kpis.userActivity} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleString('default', { month: 'short' })} />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#3f3f46' }} />
                                <Legend />
                                <Bar dataKey="mau" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
                
                <ChartContainer title="Language Usage Trends">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={kpis.languageTrends} dataKey="usage" nameKey="lang" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                                {kpis.languageTrends.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#3f3f46' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    );
};

export default ProductKPIs;
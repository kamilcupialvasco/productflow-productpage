
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ChangelogEntry } from '../../types';

const ChangeListItem: React.FC<{ items: string[]; type: 'feature' | 'improvement' | 'fix' }> = ({ items, type }) => {
    if (!items || items.length === 0) return null;

    const typeConfig = {
        feature: { label: 'New', color: 'bg-blue-500/20 text-blue-300' },
        improvement: { label: 'Improved', color: 'bg-emerald-500/20 text-emerald-300' },
        fix: { label: 'Fixed', color: 'bg-yellow-500/20 text-yellow-300' },
    };

    return (
        <div>
            <h4 className={`inline-block px-2 py-1 text-xs font-semibold rounded-md mb-2 ${typeConfig[type].color}`}>{typeConfig[type].label}</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
                {items.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>') }} />)}
            </ul>
        </div>
    );
};

const ChangelogEntryCard: React.FC<{ entry: ChangelogEntry }> = ({ entry }) => (
    <div className="p-6 bg-card rounded-lg border border-border">
        <div className="flex items-baseline space-x-4 mb-4">
            <h2 className="text-2xl font-bold text-text-primary">{entry.version}</h2>
            <p className="text-sm text-text-secondary">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="space-y-4">
            <ChangeListItem items={entry.newFeatures} type="feature" />
            <ChangeListItem items={entry.improvements} type="improvement" />
            <ChangeListItem items={entry.bugFixes} type="fix" />
        </div>
    </div>
);


const Changelog: React.FC = () => {
    const { changelog } = useAppContext();

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-text-primary">Changelog</h1>
                    <p className="mt-2 text-text-secondary">See what's new and what's improved in productflow.online.</p>
                </div>

                <div className="space-y-8">
                    {changelog.map(entry => <ChangelogEntryCard key={entry.id} entry={entry} />).sort((a,b) => new Date(b.props.entry.date).getTime() - new Date(a.props.entry.date).getTime())}
                </div>
            </div>
        </div>
    );
};

export default Changelog;

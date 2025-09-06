
import React, { useState } from 'react';
import Header from './Header';

interface TreeNodeData {
    id: string;
    label: string;
    type: 'outcome' | 'opportunity' | 'solution' | 'experiment';
    children: TreeNodeData[];
}

const initialTreeData: TreeNodeData = {
    id: '1',
    label: 'Increase User Retention by 15% in Q4',
    type: 'outcome',
    children: [
        {
            id: '2',
            label: 'Users forget to use the translator when traveling',
            type: 'opportunity',
            children: [
                {
                    id: '3',
                    label: 'Proactive travel mode reminders',
                    type: 'solution',
                    children: [
                         { id: '4', label: 'Test push notification reminders', type: 'experiment', children: [] }
                    ]
                },
                 { id: '5', label: 'Smartwatch companion app', type: 'solution', children: [] }
            ]
        },
        {
            id: '6',
            label: 'Users struggle with translating complex menus',
            type: 'opportunity',
            children: []
        }
    ]
};

const typeColors = {
    outcome: 'bg-indigo-500/20 text-indigo-300 border-indigo-500',
    opportunity: 'bg-amber-500/20 text-amber-300 border-amber-500',
    solution: 'bg-sky-500/20 text-sky-300 border-sky-500',
    experiment: 'bg-green-500/20 text-green-300 border-green-500',
}

const TreeNode: React.FC<{ node: TreeNodeData, onUpdate: (node: TreeNodeData) => void }> = ({ node, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(node.label);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value);
    
    const handleSave = () => {
        onUpdate({ ...node, label });
        setIsEditing(false);
    }
    
    const addChild = () => {
        const childTypes: Record<string, 'opportunity' | 'solution' | 'experiment'> = {
            outcome: 'opportunity',
            opportunity: 'solution',
            solution: 'experiment',
        };
        const childType = childTypes[node.type];
        if (!childType) return;
        
        const newChild: TreeNodeData = {
            id: Date.now().toString(),
            label: `New ${childType}`,
            type: childType,
            children: [],
        };
        onUpdate({ ...node, children: [...node.children, newChild] });
    };

    const handleChildUpdate = (updatedChild: TreeNodeData) => {
        const updatedChildren = node.children.map(child => child.id === updatedChild.id ? updatedChild : child);
        onUpdate({ ...node, children: updatedChildren });
    }

    return (
        <div className="relative pl-8 group">
             {/* Vertical line from parent */}
             <div className="absolute top-0 left-4 w-px h-full bg-vasco-dark-border"></div>
             {/* Horizontal line to node */}
             <div className="absolute top-6 left-4 w-4 h-px bg-vasco-dark-border"></div>
            
            <div className={`relative min-w-[200px] bg-vasco-dark-card border-l-4 p-3 rounded-r-md mb-4 ${typeColors[node.type]}`}>
                 {isEditing ? (
                    <input type="text" value={label} onChange={handleLabelChange} onBlur={handleSave} onKeyPress={e => e.key === 'Enter' && handleSave()} autoFocus className="bg-vasco-dark-bg border border-vasco-primary rounded px-2 py-1 text-sm w-full" />
                 ) : (
                    <p className="text-sm cursor-pointer" onClick={() => setIsEditing(true)}>{node.label}</p>
                 )}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={addChild} className="bg-vasco-primary h-5 w-5 rounded-full text-white text-xs leading-none hover:bg-vasco-primary-hover">+</button>
                </div>
            </div>

            <div className="flex flex-col">
                {node.children.map(child => <TreeNode key={child.id} node={child} onUpdate={handleChildUpdate} />)}
            </div>
        </div>
    )
}


const OpportunityTree: React.FC = () => {
    const [treeData, setTreeData] = useState(initialTreeData);

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <Header title="Opportunity Solution Tree" subtitle="Visually map and manage your product strategy." />
            <div className="p-8">
                <div className="inline-block">
                     <TreeNode node={treeData} onUpdate={setTreeData} />
                </div>
            </div>
        </div>
    );
};

export default OpportunityTree;

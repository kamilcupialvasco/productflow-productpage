
import React, { useState } from 'react';
import Header from '../common/Header';
import { mockUpstreamInitiatives as mockRiceFeatures, mockObjectives, mockFeedbackClusters } from '../../services/mockData';
import { OpportunityNode, OpportunityNodeType } from '../../types';
import RichPopover from '../common/RichPopover';
import { useAppContext } from '../../context/AppContext';

const typeColors: Record<OpportunityNodeType, string> = {
    outcome: 'border-indigo-500',
    opportunity: 'border-amber-500',
    solution: 'border-sky-500',
    experiment: 'border-green-500',
};

const statusColors: Record<OpportunityNode['status'], string> = {
    'On Track': 'bg-green-500',
    'At Risk': 'bg-yellow-500',
    'On Hold': 'bg-slate-500',
    'Completed': 'bg-blue-500',
};

const LinkedItem: React.FC<{ node: OpportunityNode }> = ({ node }) => {
    if (!node.linkedId) return null;
    let item: any;
    let type = '';
    
    switch(node.type) {
        case 'outcome': item = mockObjectives.find(o => o.id === node.linkedId); type = 'Objective'; break;
        case 'opportunity': item = mockFeedbackClusters.find(f => f.id === node.linkedId); type = 'Feedback Cluster'; break;
        case 'solution': item = mockRiceFeatures.find(r => r.id === node.linkedId); type = 'Initiative'; break;
        default: return null;
    }

    if (!item) return <div className="text-xs mt-1 text-red-400">🔗 Link broken</div>;

    const trigger = <span className="text-indigo-400 cursor-pointer">🔗 {item.title}</span>;
    const content = <p className="line-clamp-3">{item.description || item.title}</p>;
    
    return (
        <div className="text-xs mt-2">
            <RichPopover 
                trigger={trigger} 
                title={type} 
                content={content} 
                actionButton={{ label: 'View', onClick: () => console.log('Navigate to', item.id)}}
            />
        </div>
    )
}

const EditNodeModal: React.FC<{
    node: OpportunityNode;
    onSave: (updatedNode: OpportunityNode) => void;
    onClose: () => void;
}> = ({ node, onSave, onClose }) => {
    const [formData, setFormData] = useState(node);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getLinkableItems = () => {
        switch(node.type) {
            case 'outcome': return mockObjectives.map(o => ({id: o.id, label: o.title}));
            case 'opportunity': return mockFeedbackClusters.map(f => ({id: f.id, label: f.title}));
            case 'solution': return mockRiceFeatures.map(r => ({id: r.id, label: r.title}));
            default: return [];
        }
    };
    const linkableItems = getLinkableItems();

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg border border-border w-full max-w-lg">
                <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Edit {node.type}</h3></div>
                <div className="p-6 space-y-4">
                    <input name="label" value={formData.label} onChange={handleChange} className="w-full bg-background p-2 rounded"/>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-background p-2 rounded" />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="owner" value={formData.owner} onChange={handleChange} placeholder="Owner" className="w-full bg-background p-2 rounded"/>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background p-2 rounded">
                            {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {linkableItems.length > 0 && (
                        <div>
                            <label className="text-sm">Link to existing item</label>
                            <select name="linkedId" value={formData.linkedId || ''} onChange={handleChange} className="w-full bg-background p-2 rounded mt-1">
                                <option value="">None</option>
                                {linkableItems.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                            </select>
                        </div>
                    )}
                </div>
                <div className="p-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-border">Cancel</button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 rounded bg-primary text-white">Save</button>
                </div>
            </div>
        </div>
    );
};


const TreeNode: React.FC<{ node: OpportunityNode, onUpdate: (node: OpportunityNode) => void, onAddChild: (parentId: string) => void }> = ({ node, onUpdate, onAddChild }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const handleChildUpdate = (updatedChild: OpportunityNode) => {
        onUpdate({ ...node, children: node.children.map(child => child.id === updatedChild.id ? updatedChild : child) });
    };

    return (
        <div className="relative pl-12 group">
             <div className="absolute top-0 left-6 w-px h-full bg-border/50"></div>
             <div className="absolute top-8 left-6 w-6 h-px bg-border/50"></div>
            
            <div className={`relative min-w-[250px] max-w-sm bg-card border-l-4 p-3 rounded-md mb-4 shadow-md ${typeColors[node.type]}`}>
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-text-primary">{node.label}</p>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{node.description}</p>
                    </div>
                     <div className={`flex-shrink-0 ml-2 h-2.5 w-2.5 rounded-full mt-1 ${statusColors[node.status]}`} title={node.status}></div>
                 </div>
                 <div className="text-xs text-text-secondary mt-2">Owner: {node.owner}</div>
                 <LinkedItem node={node} />
                <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsEditing(true)} className="bg-border h-5 w-5 rounded-full text-white text-xs leading-none hover:bg-zinc-600">✎</button>
                    <button onClick={() => onAddChild(node.id)} className="bg-primary h-5 w-5 rounded-full text-white text-xs leading-none hover:bg-primary-hover">+</button>
                </div>
            </div>

            <div className="flex flex-col">
                {node.children.map(child => <TreeNode key={child.id} node={child} onUpdate={handleChildUpdate} onAddChild={onAddChild} />)}
            </div>
            {isEditing && <EditNodeModal node={node} onClose={() => setIsEditing(false)} onSave={(updated) => { onUpdate(updated); setIsEditing(false); }} />}
        </div>
    )
}

const findAndUpdateNode = (root: OpportunityNode, updatedNode: OpportunityNode): OpportunityNode => {
    if (root.id === updatedNode.id) return updatedNode;
    return { ...root, children: root.children.map(child => findAndUpdateNode(child, updatedNode)) };
};

const findAndAddChildNode = (root: OpportunityNode, parentId: string): OpportunityNode => {
    if (root.id === parentId) {
        const childTypes: Partial<Record<OpportunityNodeType, OpportunityNodeType>> = {
            outcome: 'opportunity',
            opportunity: 'solution',
            solution: 'experiment'
        };
        const newChildType = childTypes[root.type];
        if (!newChildType) return root; // Cannot add child to experiment

        const newChild: OpportunityNode = {
            id: Date.now().toString(),
            label: `New ${newChildType}`,
            type: newChildType,
            children: [],
            description: '',
            owner: 'Unassigned',
            status: 'On Hold'
        };
        return { ...root, children: [...root.children, newChild] };
    }
    return { ...root, children: root.children.map(child => findAndAddChildNode(child, parentId)) };
};

const OpportunityTree: React.FC = () => {
    const { initialTreeData } = useAppContext();
    const [treeData, setTreeData] = useState(initialTreeData);

    const handleUpdate = (updatedNode: OpportunityNode) => {
        if (treeData) {
            setTreeData(findAndUpdateNode(treeData, updatedNode));
        }
    };

    const handleAddChild = (parentId: string) => {
        if (treeData) {
            setTreeData(findAndAddChildNode(treeData, parentId));
        }
    };

    if (!treeData) {
        return <div>Loading tree data...</div>
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <Header title="Opportunity Solution Tree" subtitle="Visually map and manage your product strategy." />
            <div className="p-8">
                <div className="inline-block">
                     <TreeNode node={treeData} onUpdate={handleUpdate} onAddChild={handleAddChild}/>
                </div>
            </div>
        </div>
    );
};

export default OpportunityTree;

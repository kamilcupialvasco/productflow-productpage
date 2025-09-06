import React, { useState, useEffect } from 'react';
import { Feedback, FeedbackStatus, Insight, User } from '../../types';
import { useAppContext } from '../../context/AppContext';

const InsightCard: React.FC<{ insight: Insight; onClick: () => void }> = ({ insight, onClick }) => (
    <div onClick={onClick} className="p-2 bg-zinc-800/50 rounded-md border border-border/50 cursor-pointer hover:border-primary transition-colors">
        <p className="text-xs text-text-primary line-clamp-2">"{insight.content}"</p>
        <div className="text-xs text-text-secondary mt-1">{insight.source} - {insight.user.segment}</div>
    </div>
);

const AIAnalysisItem: React.FC<{ title: string; content: string; }> = ({ title, content }) => (
    <div className="relative group">
        <h5 className="font-semibold text-sm text-text-primary/80 mb-1">{title}</h5>
        <p className="text-xs p-2 bg-zinc-800/50 rounded">{content}</p>
    </div>
)

const CommentItem: React.FC<{ comment: { id: string, userId: string, text: string, createdAt: string }, user: User | undefined }> = ({ comment, user }) => (
    <div className="flex items-start space-x-3">
        <img src={user?.avatar} alt={user?.name} className="h-8 w-8 rounded-full flex-shrink-0" />
        <div>
            <div className="flex items-baseline space-x-2">
                <p className="font-semibold text-sm text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-secondary">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-sm p-2 bg-background rounded-md mt-1">{comment.text}</p>
        </div>
    </div>
)

const FeedbackDetailPanel: React.FC<{
    feedback: Feedback;
    onClose: () => void;
    onSave: (feedbackId: string, updates: Partial<Feedback>) => void;
    onAddComment: (feedbackId: string, comment: { userId: string, text: string }) => void;
    onViewInsight: (insightId: string) => void;
}> = ({ feedback, onClose, onSave, onAddComment, onViewInsight }) => {
    const { insights, users } = useAppContext();
    const [editedFeedback, setEditedFeedback] = useState(feedback);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setEditedFeedback(feedback);
    }, [feedback]);

    const linkedInsights = insights.filter(i => editedFeedback.insightIds.includes(i.id));

    const handleSave = () => {
        onSave(editedFeedback.id, { status: editedFeedback.status, owner: editedFeedback.owner });
        onClose();
    }
    
    const handleAddComment = () => {
        if (!newComment.trim()) return;
        // Using first user as current user for mock
        onAddComment(editedFeedback.id, { userId: users[0].id, text: newComment });
        setNewComment('');
    }

    return (
        <div 
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border flex flex-col animate-slide-in-right z-50 lg:relative lg:max-w-sm"
        >
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-semibold">Feedback Details</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-background text-2xl leading-none">&times;</button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div>
                    <h4 className="font-semibold text-lg">{editedFeedback.title}</h4>
                    <p className="text-sm text-text-secondary">{editedFeedback.problemDescription}</p>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-text-secondary">Status</label>
                        <select value={editedFeedback.status} onChange={e => setEditedFeedback({...editedFeedback, status: e.target.value as FeedbackStatus})}  className="w-full bg-background border border-border rounded px-2 py-1.5 mt-1">
                            {Object.values(FeedbackStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary">Owner</label>
                         <select value={editedFeedback.owner || ''} onChange={e => setEditedFeedback({...editedFeedback, owner: e.target.value})} className="w-full bg-background border border-border rounded px-2 py-1.5 mt-1">
                            <option value="">Unassigned</option>
                            {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                         </select>
                    </div>
                </div>

                <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-text-primary mb-2">Comments</h4>
                    <div className="space-y-4">
                        {editedFeedback.comments?.map(c => <CommentItem key={c.id} comment={c} user={users.find(u => u.id === c.userId)} />)}
                         <div className="flex items-start space-x-3">
                            <img src={users[0].avatar} alt={users[0].name} className="h-8 w-8 rounded-full" />
                            <div className="flex-1">
                                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment... Type @ to mention" className="w-full bg-background p-2 rounded text-sm border border-border focus:border-primary"></textarea>
                                <button onClick={handleAddComment} className="text-xs px-3 py-1.5 rounded-md bg-primary text-white mt-1">Comment</button>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-text-primary mb-2">Linked Insights ({linkedInsights.length})</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto p-1">
                        {linkedInsights.map(i => <InsightCard key={i.id} insight={i} onClick={() => onViewInsight(i.id)} />)}
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end space-x-2">
                <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition">Save Changes</button>
            </div>
            <style>{`
            @keyframes slide-in-right { 0% { transform: translateX(100%); } 100% { transform: translateX(0); } }
            .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
        `}</style>
        </div>
    );
};

export default FeedbackDetailPanel;

import React from 'react';

interface RichPopoverProps {
    trigger: React.ReactNode;
    title: string;
    content: React.ReactNode;
    actionButton?: {
        label: string;
        onClick: () => void;
    }
}

const RichPopover: React.FC<RichPopoverProps> = ({ trigger, title, content, actionButton }) => {
    return (
        <div className="group/popover relative">
            {trigger}
            <div className="absolute z-20 bottom-full mb-2 w-72 bg-background p-3 rounded-lg border border-border shadow-2xl opacity-0 group-hover/popover:opacity-100 transition-opacity pointer-events-none group-hover/popover:pointer-events-auto animate-fade-in-up">
                <h4 className="font-bold text-text-primary border-b border-border pb-2 mb-2">{title}</h4>
                <div className="text-sm text-text-secondary space-y-1">
                    {content}
                </div>
                {actionButton && (
                    <div className="mt-3 text-right">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                actionButton.onClick();
                            }}
                            className="text-xs px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-hover"
                        >
                            {actionButton.label}
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in-up { 
                    0% { opacity: 0; transform: translateY(5px); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }
                .animate-fade-in-up { animation: fade-in-up 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default RichPopover;

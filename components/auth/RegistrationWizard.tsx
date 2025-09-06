
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';

interface RegistrationWizardProps {
    onClose: () => void;
}

const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onClose }) => {
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', workspace: 'My Company Hub' });

    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const handleFinish = () => {
        // Create a new mock user and log in
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: formData.name,
            avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
            role: UserRole.Admin,
            segment: 'Internal'
        };
        login(newUser);
        onClose();
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Account Details
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Create your account</h4>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full bg-background p-2 rounded-md" />
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email Address" className="w-full bg-background p-2 rounded-md" />
                        <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Password" className="w-full bg-background p-2 rounded-md" />
                    </div>
                );
            case 2: // Workspace Setup
                return (
                     <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Setup your workspace</h4>
                        <input type="text" value={formData.workspace} onChange={e => setFormData({...formData, workspace: e.target.value})} placeholder="Workspace Name" className="w-full bg-background p-2 rounded-md" />
                        <p className="text-sm text-text-secondary">This is the name of your company or product team.</p>
                    </div>
                );
            case 3: // Connect Data
                 return (
                     <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Connect your data (optional)</h4>
                        <p className="text-sm text-text-secondary">We'll start with some sample data. You can connect your real sources like Jira and Trustpilot later in settings.</p>
                         <div className="p-3 bg-background/50 rounded-md text-center text-sm">
                            Your hub will be pre-populated with Vasco Electronics sample data.
                         </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-card rounded-lg border border-border w-full max-w-md">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Get Started</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-background text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 min-h-[300px]">
                    {renderStep()}
                </div>
                 <div className="p-4 border-t border-border flex justify-between items-center">
                    <div>
                        {step > 1 && <button onClick={handlePrev} className="px-4 py-2 rounded-md bg-border">Back</button>}
                    </div>
                     <div>
                        {step < 3 ? (
                             <button onClick={handleNext} className="px-4 py-2 rounded-md bg-primary text-white">Next</button>
                        ) : (
                            <button onClick={handleFinish} className="px-4 py-2 rounded-md bg-primary text-white">Finish Setup</button>
                        )}
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default RegistrationWizard;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
    onClose: () => void;
    onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToRegister }) => {
    const { login, users } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login: just find the first user to log in as.
        if (users.length > 0) {
            login(users[0]);
            onClose();
        } else {
            setError('No users available to log in.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-card rounded-lg border border-border w-full max-w-sm">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Login to your Hub</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-background text-2xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleLogin} className="p-6 space-y-4">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="Email (any email will work)"
                        className="w-full bg-background p-2 rounded-md border border-border"
                    />
                    <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password (any password)"
                        className="w-full bg-background p-2 rounded-md border border-border"
                    />
                     {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button type="submit" className="w-full px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover">
                        Login
                    </button>
                    <p className="text-center text-sm text-text-secondary">
                        Don't have an account? <button type="button" onClick={onSwitchToRegister} className="text-primary hover:underline">Get started</button>
                    </p>
                </form>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default LoginModal;
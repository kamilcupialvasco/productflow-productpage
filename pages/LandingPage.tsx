
import React, { useState } from 'react';
import LoginModal from '../components/auth/LoginModal';
import RegistrationWizard from '../components/auth/RegistrationWizard';

const LandingPage: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="bg-background min-h-screen text-text-primary">
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />}
            {showRegister && <RegistrationWizard onClose={() => setShowRegister(false)} />}
            
            {/* Header */}
            <header className="p-4 flex justify-between items-center container mx-auto">
                 <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.08V15c0-.55.45-1 1-1s1 .45 1 1v1.08c1.36-.58 2.38-1.93 2.38-3.58 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 1.65 1.02 3 2.38 3.58zM12 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
                    </svg>
                    <h1 className="ml-2 text-xl font-bold">Vasco PM Hub</h1>
                </div>
                <div>
                    <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-text-secondary hover:text-text-primary mr-4">Login</button>
                    <button onClick={() => setShowRegister(true)} className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary-hover">Get Started</button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                    The Command Center for <span className="text-primary">Product Excellence</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-text-secondary">
                    From raw feedback to strategic initiatives, the Vasco Product Management Hub centralizes your workflow, supercharges your analysis with AI, and aligns your team around a single source of truth.
                </p>
                <div className="mt-8">
                    <button onClick={() => setShowRegister(true)} className="px-8 py-3 text-lg rounded-md bg-primary text-white hover:bg-primary-hover shadow-lg">
                        Create Your Hub
                    </button>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-20 bg-card/50">
                 <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">All Your Product Intelligence in One Place</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Centralize Feedback</h3>
                            <p className="text-text-secondary">Aggregate user insights from any source—reviews, support tickets, social media—into one actionable hub.</p>
                        </div>
                         <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                            <p className="text-text-secondary">Automatically detect anomalies, summarize feedback clusters, and generate critical questions to validate your strategy.</p>
                        </div>
                         <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Traceability by Design</h3>
                            <p className="text-text-secondary">Visualize the "golden thread" from a single piece of feedback to a strategic pillar, ensuring every decision is justified.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Social Proof */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                     <figure>
                        <blockquote className="text-center text-xl italic text-text-primary">
                            <p>"The Vasco PM Hub transformed our process. We now make decisions with clarity and confidence, backed by data, not just intuition. It's our single source of truth."</p>
                        </blockquote>
                        <figcaption className="mt-6 text-center">
                            <div className="font-semibold">Alicja Nowak</div>
                            <div className="text-text-secondary">Head of Product, Vasco Electronics</div>
                        </figcaption>
                    </figure>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
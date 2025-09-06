
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatbotWidget from './components/common/ChatbotWidget';
import InsightDetailModal from './components/feedback/InsightDetailModal';
import AnomalyDetailModal from './components/home/AnomalyDetailModal';

// Contexts
import { useAuth } from './context/AuthContext';
import { useTour } from './context/TourContext';
import { useAppContext } from './context/AppContext';

// Pages
import Home from './pages/home/Home';
import MyWorkspace from './pages/workspace/MyWorkspace';
import ProductPortfolio from './pages/product/ProductPortfolio';
import Personas from './pages/product/Personas';
import ProductStrategySuite from './pages/product/ProductStrategySuite';
import ProductDetail from './pages/product/ProductDetail';
import ProductKPIs from './pages/product/ProductKPIs';
import Contexts from './pages/product/Contexts';
import FeedbackDashboard from './pages/feedback/FeedbackDashboard';
import FeedbackHub from './pages/feedback/FeedbackHub';
import FeedbackAnalysis from './pages/feedback/FeedbackAnalysis';
import UserJourney from './pages/feedback/UserJourney';
import IdeaInbox from './pages/discovery/IdeaInbox';
import Settings from './pages/settings/Settings';
import HypothesisBoard from './pages/hypothesis/HypothesisBoard';
import InitiativesWork from './pages/upstream/InitiativesWork';
import ExpectedOutcomes from './pages/product/ExpectedOutcomes';
import FeedbackKanban from './pages/feedback/FeedbackKanban';
import Unknowns from './pages/upstream/Unknowns';

import { Page, Insight, Anomaly } from './types';

const Router: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [viewingInsight, setViewingInsight] = useState<Insight | null>(null);
  const [viewingAnomaly, setViewingAnomaly] = useState<Anomaly | null>(null);
  const [pageOptions, setPageOptions] = useState<{ selectedId?: string, filters?: Record<string, any> } | null>(null);

  const { currentUser, switchUser, users } = useAuth();
  const { startTour } = useTour();
  const { insights, products, anomalies, loading } = useAppContext();
  
  const handleViewInsight = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (insight) setViewingInsight(insight);
  };
  
  const handleViewAnomaly = (anomalyId: string) => {
    const anomaly = anomalies.find(a => a.id === anomalyId);
    if (anomaly) setViewingAnomaly(anomaly);
  };

  const navigateTo = (page: Page, options: { selectedId?: string, filters?: Record<string, any> } | null = null) => {
    setPageOptions(options);
    setActivePage(page);
  }
  
  useEffect(() => {
    // Clear page options after navigation to prevent re-triggering
    if (pageOptions) {
        setPageOptions(null);
    }
  }, [activePage]);

  if (loading || !currentUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-text-primary">
          <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg text-text-secondary">Loading Product Flow...</p>
          </div>
      </div>
    );
  }

  const renderPage = () => {
    if (activePage.startsWith('product/detail/')) {
        const productId = activePage.split('/')[2];
        const viewingProduct = products.find(p => p.id === productId);
        if (viewingProduct) {
            return <ProductDetail product={viewingProduct} onBack={() => navigateTo('product/portfolio')} onViewInsight={handleViewInsight} navigateTo={navigateTo} />;
        }
    }
     if (activePage.startsWith('product/kpis/')) {
        const productId = activePage.split('/')[2];
        const viewingProduct = products.find(p => p.id === productId);
        if (viewingProduct) {
            return <ProductKPIs product={viewingProduct} onBack={() => navigateTo(`product/detail/${productId}`)} />;
        }
    }

    const [section, page] = activePage.split('/');
    
    switch (section) {
      case 'home':
        return <Home onViewAnomaly={handleViewAnomaly} startTour={startTour} setActivePage={navigateTo} />;
      case 'workspace':
        return <MyWorkspace setActivePage={navigateTo} />;
      case 'product':
        switch (page) {
          case 'portfolio': return <ProductPortfolio onViewProduct={(id) => navigateTo(`product/detail/${id}`)} />;
          case 'strategy-suite': return <ProductStrategySuite />;
          case 'outcomes': return <ExpectedOutcomes navigateTo={navigateTo} />;
          case 'personas': return <Personas navigateTo={navigateTo} />;
          case 'contexts': return <Contexts />;
          default: return <ProductPortfolio onViewProduct={(id) => navigateTo(`product/detail/${id}`)} />;
        }
      case 'feedback':
        switch (page) {
            case 'dashboard': return <FeedbackDashboard onViewInsight={handleViewInsight} navigateTo={navigateTo} />;
            case 'hub': return <FeedbackHub onViewInsight={handleViewInsight} navigateTo={navigateTo} initialSelectedId={pageOptions?.selectedId} />;
            case 'board': return <FeedbackKanban onViewInsight={handleViewInsight} navigateTo={navigateTo} />;
            case 'analysis': return <FeedbackAnalysis initialFilters={pageOptions?.filters} />;
            case 'journey': return <UserJourney onViewInsight={handleViewInsight}/>;
            default: return <FeedbackDashboard onViewInsight={handleViewInsight} navigateTo={navigateTo}/>;
        }
      case 'hypothesis':
        return <HypothesisBoard />;
      case 'upstream':
        switch (page) {
            case 'inbox': return <IdeaInbox navigateTo={navigateTo} />;
            case 'initiatives': return <InitiativesWork />;
            case 'unknowns': return <Unknowns />;
            default: return <IdeaInbox navigateTo={navigateTo} />;
        }
      case 'settings':
        return <Settings activeTab={page || 'users'} navigateTo={navigateTo} />;
      default:
        return <Home onViewAnomaly={handleViewAnomaly} startTour={startTour} setActivePage={navigateTo} />;
    }
  };

  return (
    <>
      <Sidebar activePage={activePage} setActivePage={navigateTo} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </main>
      <ChatbotWidget />
      {viewingInsight && (
        <InsightDetailModal 
            insight={viewingInsight}
            onClose={() => setViewingInsight(null)}
            navigateTo={navigateTo}
        />
      )}
       {viewingAnomaly && (
        <AnomalyDetailModal
          anomaly={viewingAnomaly}
          onClose={() => setViewingAnomaly(null)}
          onViewInsight={handleViewInsight}
        />
       )}
       {currentUser && (
        <div id="user-switcher-container" className="fixed bottom-4 right-24 z-50 bg-card p-2 rounded-md border border-border text-xs">
            <label htmlFor="user-switcher" className="mr-2">Viewing as:</label>
            <select id="user-switcher" value={currentUser.id} onChange={(e) => switchUser(e.target.value)} className="bg-background border-none rounded">
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
        </div>
       )}
    </>
  );
};

export default Router;

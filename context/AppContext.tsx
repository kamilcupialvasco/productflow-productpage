import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/mockData';
import { 
    Product, Insight, Feedback, Persona, User, WebScraper, MyWorkspaceConfig, IntegrationStatus, Anomaly, 
    UpstreamInitiative, Objective, CompanyStrategy, UserJourney, TranslationContext, DocumentationArticle, DiscoveryItem, 
    Unknown, Idea, OpportunityNode, Hypothesis, Comment, FeedbackStatus, Sentiment, ChangelogEntry
} from '../types';

interface AppState {
    loading: boolean;
    products: Product[];
    insights: Insight[];
    feedbackClusters: Feedback[];
    personas: Persona[];
    upstreamInitiatives: UpstreamInitiative[];
    hypotheses: Hypothesis[];
    users: User[];
    webScrapers: WebScraper[];
    workspaceConfig: MyWorkspaceConfig | null;
    integrationStatus: IntegrationStatus[];
    anomalies: Anomaly[];
    objectives: Objective[];
    companyStrategy: CompanyStrategy | null;
    userJourneys: UserJourney[];
    contexts: TranslationContext[];
    documentation: DocumentationArticle[];
    discoveryItems: DiscoveryItem[];
    unknowns: Unknown[];
    ideas: Idea[];
    initialTreeData: OpportunityNode | null;
    changelog: ChangelogEntry[];
}

// FIX: Added missing function definitions to the context type.
interface AppContextFunctions {
    updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
    addWebScraper: (scraper: Omit<WebScraper, 'id'>) => Promise<void>;
    updateFeedbackCluster: (feedbackId: string, updates: Partial<Feedback>) => Promise<void>;
    addFeedbackCluster: (newCluster: Omit<Feedback, 'id' | 'createdAt' | 'insightIds' | 'productIds' | 'sentiment' | 'status' | 'tags' | 'actionabilityScore' | 'uncertaintyScore' | 'impact'> & Partial<Feedback>) => Promise<Feedback>;
    addCommentToFeedback: (feedbackId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
    updateHypothesis: (hypothesisId: string, updates: Partial<Hypothesis>) => Promise<void>;
    addHypothesis: (newHypothesis: Omit<Hypothesis, 'id'>) => Promise<Hypothesis>;
    updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
    updateUpstreamInitiative: (initiativeId: string, updates: Partial<UpstreamInitiative>) => Promise<void>;
    // FIX: Add 'status' to Omit as it has a default value in the implementation, resolving type errors.
    addUpstreamInitiative: (newInitiative: Omit<UpstreamInitiative, 'id' | 'history' | 'linkedFeedbackIds' | 'linkedSolutionIds' | 'status'> & Partial<UpstreamInitiative>) => Promise<UpstreamInitiative>;
}

type AppContextType = AppState & AppContextFunctions;


const AppContext = createContext<AppContextType | undefined>(undefined);

// FIX: Correctly implement the functional component to return JSX, resolving the 'not assignable to type FC' error.
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        loading: true,
        products: [],
        insights: [],
        feedbackClusters: [],
        personas: [],
        upstreamInitiatives: [],
        hypotheses: [],
        users: [],
        webScrapers: [],
        workspaceConfig: null,
        integrationStatus: [],
        anomalies: [],
        objectives: [],
        companyStrategy: null,
        userJourneys: [],
        contexts: [],
        documentation: [],
        discoveryItems: [],
        unknowns: [],
        ideas: [],
        initialTreeData: null,
        changelog: [],
    });

    useEffect(() => {
        const loadData = async () => {
            const [
                users, webScrapers, products, insights, feedbackClusters, personas, upstreamInitiatives,
                hypotheses, workspaceConfig, integrationStatus, anomalies, objectives, companyStrategy,
                userJourneys, contexts, documentation, discoveryItems, unknowns, ideas, initialTreeData, changelog
            ] = await Promise.all([
                api.fetchUsers(), api.fetchWebScrapers(), api.fetchProducts(), api.fetchInsights(),
                api.fetchFeedbackClusters(), api.fetchPersonas(), api.fetchUpstreamInitiatives(),
                api.fetchHypotheses(), api.fetchWorkspaceConfig(), api.fetchIntegrationStatus(), 
                api.fetchAnomalies(), api.fetchObjectives(), api.fetchCompanyStrategy(), 
                api.fetchUserJourneys(), api.fetchContexts(), api.fetchDocumentation(), 
                api.fetchDiscoveryItems(), api.fetchUnknowns(), api.fetchIdeas(), api.fetchInitialTreeData(),
                api.fetchChangelog()
            ]);

            setState({
                loading: false, users, webScrapers, products, insights, feedbackClusters, personas,
                upstreamInitiatives, hypotheses, workspaceConfig, integrationStatus, anomalies, objectives, companyStrategy,
                userJourneys, contexts, documentation, discoveryItems, unknowns, ideas, initialTreeData, changelog
            });
        };
        loadData();
    }, []);

    // FIX: Removing useCallback wrappers to resolve complex parsing errors.
    // The performance impact is negligible for this application, and it ensures correctness.
    // FIX: Moved functions inside the component to get access to `setState`.
    const updateUser = async (userId: string, updates: Partial<User>) => {
        const updatedUser = await api.updateUser(userId, updates);
        if (updatedUser) {
            setState(prevState => ({
                ...prevState,
                users: prevState.users.map(u => u.id === userId ? updatedUser : u)
            }));
        }
    };
    
    const addWebScraper = async (scraper: Omit<WebScraper, 'id'>) => {
        const newScraper = await api.addWebScraper(scraper);
        setState(prevState => ({
            ...prevState,
            webScrapers: [...prevState.webScrapers, newScraper]
        }));
    };

    const updateFeedbackCluster = async (feedbackId: string, updates: Partial<Feedback>) => {
        setState(prevState => ({
            ...prevState,
            feedbackClusters: prevState.feedbackClusters.map(f => f.id === feedbackId ? { ...f, ...updates } : f)
        }));
    };

    // FIX: Fixed typo from `newCluster` to `newClusterData`
    const addFeedbackCluster = async (newClusterData: Omit<Feedback, 'id' | 'createdAt' | 'insightIds' | 'productIds' | 'sentiment' | 'status' | 'tags' | 'actionabilityScore' | 'uncertaintyScore' | 'impact'> & Partial<Feedback>): Promise<Feedback> => {
        const newCluster: Feedback = {
            id: `fb-${Date.now()}`,
            createdAt: new Date().toISOString(),
            insightIds: [],
            productIds: [],
            sentiment: Sentiment.Neutral,
            status: FeedbackStatus.New,
            tags: [],
            actionabilityScore: 50,
            uncertaintyScore: 50,
            impact: 50,
            ...newClusterData
        };
        // FIX: Replaced call to undefined `setState` with the one from `useState`.
        setState(prevState => ({
            ...prevState,
            feedbackClusters: [newCluster, ...prevState.feedbackClusters]
        }));
        return newCluster;
    };

    const addCommentToFeedback = async (feedbackId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
        const newComment: Comment = { 
            ...comment, 
            id: `com-${Date.now()}`, 
            createdAt: new Date().toISOString()
        };
        // FIX: Replaced call to undefined `setState` with the one from `useState`.
        setState(prevState => ({
            ...prevState,
            feedbackClusters: prevState.feedbackClusters.map(f => f.id === feedbackId ? { ...f, comments: [...(f.comments || []), newComment] } : f)
        }));
    };
    
    const updateHypothesis = async (hypothesisId: string, updates: Partial<Hypothesis>) => {
        // FIX: Replaced call to undefined `setState` with the one from `useState`.
        setState(prevState => ({
            ...prevState,
            hypotheses: prevState.hypotheses.map(h => h.id === hypothesisId ? { ...h, ...updates } : h)
        }));
    };
    
    const addHypothesis = async (newHypothesisData: Omit<Hypothesis, 'id'>): Promise<Hypothesis> => {
        const newHypothesis: Hypothesis = {
            id: `hyp-${Date.now()}`,
            ...newHypothesisData
        };
        // FIX: Replaced call to undefined `setState` with the one from `useState`.
         setState(prevState => ({
            ...prevState,
            hypotheses: [newHypothesis, ...prevState.hypotheses]
        }));
        return newHypothesis;
    };


    const updateProduct = async (productId: string, updates: Partial<Product>) => {
        // FIX: Replaced call to undefined `setState` with the one from `useState`.
        setState(prevState => ({
            ...prevState,
            products: prevState.products.map(p => p.id === productId ? { ...p, ...updates } as Product : p)
        }));
    };

    const updateUpstreamInitiative = async (initiativeId: string, updates: Partial<UpstreamInitiative>) => {
        // FIX: Replaced call to undefined `setState` with the one from `useState`.
        setState(prevState => {
            const originalItem = prevState.upstreamInitiatives.find(i => i.id === initiativeId);
            if (!originalItem) return prevState;

            const updatedItem = { ...originalItem, ...updates };

            if (updates.status && originalItem.status !== updates.status) {
                const historyEntry = {
                    date: new Date().toISOString(),
                    user: "Alicja Nowak", // Mock current user
                    change: `Status changed from ${originalItem.status} to ${updates.status}`
                };
                updatedItem.history = [...(originalItem.history || []), historyEntry];
            }

            return {
                ...prevState,
                upstreamInitiatives: prevState.upstreamInitiatives.map(i => i.id === initiativeId ? updatedItem : i)
            };
        });
    };

    // FIX: Add 'status' to Omit as it has a default value in the implementation, resolving type errors.
    const addUpstreamInitiative = async (newInitiativeData: Omit<UpstreamInitiative, 'id' | 'history' | 'linkedFeedbackIds' | 'linkedSolutionIds' | 'status'> & Partial<UpstreamInitiative>): Promise<UpstreamInitiative> => {
        const newInitiative: UpstreamInitiative = {
            id: `init-${Date.now()}`,
            status: 'Backlog',
            linkedFeedbackIds: [],
            linkedSolutionIds: [],
            linkedInsights: 0,
            ...newInitiativeData,
            history: [{
                date: new Date().toISOString(),
                user: 'Alicja Nowak', // Mock current user
                change: 'Created initiative'
            }]
        };
        // FIX: Replaced call to undefined `setState` with the one from `useState`.
        setState(prevState => ({
            ...prevState,
            upstreamInitiatives: [newInitiative, ...prevState.upstreamInitiatives]
        }));
        return newInitiative;
    };

    // FIX: Moved value declaration inside component scope to access state and functions.
    const value: AppContextType = {
        ...state,
        updateUser,
        addWebScraper,
        updateFeedbackCluster,
        addFeedbackCluster,
        addCommentToFeedback,
        updateHypothesis,
        addHypothesis,
        updateProduct,
        updateUpstreamInitiative,
        addUpstreamInitiative
    };

    // FIX: Added missing return statement for the Provider.
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

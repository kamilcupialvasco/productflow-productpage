import { 
    User, UserRole, WebScraper, TourStep, Product, Insight, Feedback, Persona, DiscoveryItem, Idea, UpstreamInitiative, 
    Objective, CompanyStrategy, UserJourney, MyWorkspaceConfig, IntegrationStatus, Anomaly, TranslationContext, 
    DocumentationArticle, Hardware, Software, FeedbackSource, Sentiment, SentimentDetail, FeedbackType, 
    FeedbackStatus, RiceFeature, OpportunityNode, Unknown, Notification, SavedReport, Hypothesis, Comment, ChangelogEntry
} from '../types';

// This file is now a MOCK API SERVICE.
// All data is encapsulated here. Components should not import this file directly,
// but rather use the AppContext which calls these API functions.

const apiDelay = 50; // ms

// --- MOCK DATABASE ---

export let mockUsers: User[] = [
    { id: 'user-1', name: 'Alicja Nowak', avatar: 'https://i.pravatar.cc/150?u=alice', role: UserRole.Admin, segment: 'Internal' },
    { id: 'user-2', name: 'Bartosz Kowalski', avatar: 'https://i.pravatar.cc/150?u=bob', role: UserRole.Editor, segment: 'Internal' },
    { id: 'user-3', name: 'Celina Wiśniewska', avatar: 'https://i.pravatar.cc/150?u=charlie', role: UserRole.Viewer, segment: 'Internal' },
    { id: 'user-4', name: 'David Lee', avatar: 'https://i.pravatar.cc/150?u=david', role: UserRole.Editor, segment: 'Internal' },
];

export let mockHardwareData: Hardware[] = [
    { id: 'hw-1', name: 'Vasco Translator M3', category: 'Hardware', subCategory: 'Handhelds', owner: 'Alicja Nowak', specifications: { "CPU": "MTK 6739", "RAM": "1GB", "Storage": "16GB", "Display": "2.0-inch IPS" }, mediaGallery: [], colorVariants: ["Arctic White", "Mint Leaf"], bundledSoftware: [{softwareId: 'sw-1', version: '2.5.1'}] },
    { id: 'hw-2', name: 'Vasco Translator V4', category: 'Hardware', subCategory: 'Handhelds', owner: 'Bartosz Kowalski', specifications: { "CPU": "MTK 6762", "RAM": "2GB", "Storage": "32GB", "Display": "5.0-inch IPS HD" }, mediaGallery: [{type: 'image', url: 'https://vasco-electronics.com/img/translator/vasco-translator-v4/black/vasco-translator-v4-black-1.jpg'}], colorVariants: ["Black Onyx", "Sapphire Blue"], bundledSoftware: [{softwareId: 'sw-1', version: '3.1.0'}, {softwareId: 'sw-2', version: '1.2.0'}], kpis: { keyMetrics: [{id: 'kpi-1', name: 'NPS', value: '45', target: '50', trend: 'up'}], sales: [{date: '2023-01-01', units: 1200}], userActivity: [{date: '2023-01-01', mau: 800}], languageTrends: [{lang: 'Spanish', usage: 40}] } },
    { id: 'hw-3', name: 'Vasco Watch E1', category: 'Hardware', subCategory: 'Wearables', owner: 'Alicja Nowak', specifications: { "CPU": "Apollo 3", "RAM": "512MB", "Display": "1.4-inch AMOLED" }, mediaGallery: [], colorVariants: ["Midnight Black"], bundledSoftware: [] },
];

export let mockSoftwareData: Software[] = [
    { id: 'sw-1', name: 'Vasco Voice Translator', category: 'Software', subCategory: 'Translator Apps', owner: 'Celina Wiśniewska', versions: ["2.5.0", "2.5.1", "3.0.0", "3.1.0"], features: [{id: 'f-1', name: 'Real-time voice translation', description: 'Translate spoken language in real-time.', status: 'Released', media: [], versionHistory: []}] },
    { id: 'sw-2', name: 'Vasco Photo Translator', category: 'Software', subCategory: 'Translator Apps', owner: 'Bartosz Kowalski', versions: ["1.0.0", "1.1.0", "1.2.0"], features: [] },
    { id: 'sw-3', name: 'Vasco API', category: 'Software', subCategory: 'Internal Products', owner: 'Alicja Nowak', versions: ["1.0", "1.1"], features: [] },
    { id: 'sw-4', name: 'Vasco Connect (Mobile)', category: 'Software', subCategory: 'Mobile Apps', owner: 'Bartosz Kowalski', versions: ["1.0"], features: [] },
];

export let mockProducts: Product[] = [...mockHardwareData, ...mockSoftwareData];

export let mockInsightData: Insight[] = [
  { id: 'in-1', source: FeedbackSource.Amazon, content: 'The battery life on my V4 is amazing, lasted my whole trip!', sentiment: Sentiment.Positive, sentimentDetail: SentimentDetail.Praise, category: 'Hardware', type: FeedbackType.Remark, productId: 'hw-2', version: '3.1.0', frequency: 1, date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), user: { id: 'cust-101', segment: 'Power User' }, feedbackId: 'fb-1' },
  { id: 'in-2', source: FeedbackSource.Amazon, content: 'The battery drains so fast on my V4, barely lasts half a day!', sentiment: Sentiment.Negative, sentimentDetail: SentimentDetail.Frustration, category: 'Hardware', type: FeedbackType.Bug, productId: 'hw-2', version: '3.1.0', frequency: 1, date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), user: { id: 'cust-108', segment: 'New User' }, feedbackId: 'fb-1-counter' },
  { id: 'in-3', source: FeedbackSource.Trustpilot, content: "The photo translator is a bit slow to recognize text on menus.", sentiment: Sentiment.Negative, sentimentDetail: SentimentDetail.Frustration, category: 'Software', type: FeedbackType.Bug, productId: 'sw-2', version: '1.2.0', frequency: 5, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), user: { id: 'cust-102', segment: 'New User' }, feedbackId: 'fb-2'},
  { id: 'in-12', source: FeedbackSource.Manual, content: 'It would be great if I could save a list of favorite phrases.', sentiment: Sentiment.Neutral, sentimentDetail: SentimentDetail.Suggestion, category: 'Feature Request', type: FeedbackType.Idea, productId: 'sw-1', version: '3.1.0', frequency: 2, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), user: {id: 'user-2', segment: 'Internal'}, feedbackId: 'fb-4'},
  { id: 'in-13', source: FeedbackSource.Facebook, content: "Why can't the M3 connect to 5GHz WiFi? It's really annoying.", sentiment: Sentiment.Negative, sentimentDetail: SentimentDetail.Confusion, category: 'Hardware', type: FeedbackType.Question, productId: 'hw-1', version: '1.0', frequency: 10, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), user: {id: 'cust-201', segment: 'New User'}, feedbackId: 'fb-5'},
  { id: 'in-14', source: FeedbackSource.Youtube, content: "The Vasco Watch E1 looks sleek, but the screen is too dim outdoors.", sentiment: Sentiment.Negative, sentimentDetail: SentimentDetail.Frustration, category: 'Hardware', type: FeedbackType.Bug, productId: 'hw-3', version: '1.0', frequency: 3, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), user: {id: 'cust-202', segment: 'Power User'}, feedbackId: 'fb-6'},
];

export let mockFeedbackClusters: Feedback[] = [
  { id: 'fb-1', title: 'Positive comments on V4 battery life', description: 'Users are consistently praising the battery performance of the V4 translator.', insightIds: ['in-1'], productIds: ['hw-2'], sentiment: Sentiment.Positive, status: FeedbackStatus.Actioned, tags: ['battery', 'v4'], createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), owner: 'Bartosz Kowalski', trend: 'stable', actionabilityScore: 30, uncertaintyScore: 10, impact: 20, severity: 'Low', timeToTriage: 8, timeToAction: 14, problemDescription: 'Users are happy with the battery longevity of the V4 device.', isNew: true, counterClusterId: 'fb-1-counter' },
  { id: 'fb-1-counter', title: 'Negative comments on V4 battery life', description: 'Some users are reporting poor battery performance on the V4.', insightIds: ['in-2'], productIds: ['hw-2'], sentiment: Sentiment.Negative, status: FeedbackStatus.UnderReview, tags: ['battery', 'v4', 'bug'], createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), owner: 'Bartosz Kowalski', trend: 'rising', actionabilityScore: 80, uncertaintyScore: 30, impact: 75, severity: 'High', problemDescription: 'A segment of users is experiencing rapid battery drain on the V4 device, which contradicts general positive feedback.', isNew: true, counterClusterId: 'fb-1' },
  { id: 'fb-2', title: 'Performance issues with Photo Translator', description: 'Multiple users report slowness and inaccuracy with the photo translation feature, especially in low light.', insightIds: ['in-3'], productIds: ['sw-2'], sentiment: Sentiment.Negative, status: FeedbackStatus.UnderReview, tags: ['performance', 'ocr', 'bug'], createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), owner: 'Celina Wiśniewska', trend: 'rising', actionabilityScore: 85, uncertaintyScore: 40, impact: 70, severity: 'High', timeToTriage: 2, problemDescription: 'The photo translator feature is underperforming, causing user frustration due to slow text recognition.', comments: [ { id: 'com-1', userId: 'user-1', text: '@Bartosz Kowalski can you take a look at the latest performance logs?', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() } ] },
  { id: 'fb-4', title: 'Request for "Favorites" or "Saved Phrases" feature', description: 'Users want a way to save frequently used translations for quick access.', insightIds: ['in-12'], productIds: ['sw-1'], sentiment: Sentiment.Neutral, status: FeedbackStatus.New, tags: ['feature-request', 'ux'], createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), actionabilityScore: 90, uncertaintyScore: 20, impact: 60, severity: 'Medium', problemDescription: 'Users lack a method to store and quickly recall important or frequent translations.' },
  { id: 'fb-5', title: 'Vasco M3 WiFi Connectivity Issues', description: 'Users are complaining that the M3 model does not support 5GHz WiFi networks, which are becoming standard.', insightIds: ['in-13'], productIds: ['hw-1'], sentiment: Sentiment.Negative, status: FeedbackStatus.New, tags: ['connectivity', 'hardware-limitation'], createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), actionabilityScore: 60, uncertaintyScore: 10, impact: 40, severity: 'Medium', problemDescription: 'The lack of 5GHz WiFi support in the M3 is a point of friction for users in modern network environments.' },
  { id: 'fb-6', title: 'Screen brightness on Vasco Watch E1', description: 'Users report the screen on the E1 watch is not bright enough for comfortable outdoor use.', insightIds: ['in-14'], productIds: ['hw-3'], sentiment: Sentiment.Negative, status: FeedbackStatus.UnderReview, tags: ['display', 'hardware', 'wearables'], createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), actionabilityScore: 75, uncertaintyScore: 25, impact: 65, severity: 'High', problemDescription: 'The Watch E1 display is not sufficiently visible in bright sunlight, impacting core usability.' },
];

export const mockHypotheses: Hypothesis[] = [
    { id: 'hyp-1', title: 'Improving Photo Translator speed by 30% will increase feature satisfaction by 15 points.', description: 'Based on feedback cluster FB-2, we believe that optimizing the OCR engine will lead to a measurable increase in user satisfaction.', status: 'Validating', certainty: 70, difficulty: 60, impact: 80, severity: 'High', linkedFeedbackIds: ['fb-2'], linkedInitiativeId: 'init-1', tags: ['performance', 'ocr'], linkedOutcomeIds: ['kr-1'] },
    { id: 'hyp-2', title: 'Adding a "Favorites" feature will increase daily active users by 5%.', description: 'Users are requesting a way to save phrases. We believe this will encourage more frequent use of the app.', status: 'New', certainty: 80, difficulty: 30, impact: 50, severity: 'Medium', linkedFeedbackIds: ['fb-4'], tags: ['engagement', 'new-feature'], linkedOutcomeIds: [] },
    { id: 'hyp-3', title: 'A brighter screen on the next-gen watch will reduce negative feedback about outdoor usability by 50%.', description: 'Directly addresses feedback in cluster FB-6. This is a hardware change for a future product version.', status: 'New', certainty: 95, difficulty: 80, impact: 70, severity: 'High', linkedFeedbackIds: ['fb-6'], tags: ['hardware', 'next-gen'], linkedOutcomeIds: [] }
];

export let mockWebScrapers: WebScraper[] = [
    { id: 'ws-1', name: 'Amazon DE Reviews - V4', targetUrl: 'https://www.amazon.de/Vasco-Translator-V4/product-reviews/...', status: 'Active', lastRun: '2 hours ago', frequency: 'Daily' },
    { id: 'ws-2', name: 'TechCrunch Translator Articles', targetUrl: 'https://techcrunch.com/tag/translators/', status: 'Paused', lastRun: '3 days ago', frequency: 'Weekly' },
];
export const mockPersonas: Persona[] = [
    { id: 'p-1', name: 'Gabby the Globetrotter', avatarUrl: 'https://i.pravatar.cc/150?u=gabby', role: 'Frequent international traveler', goals: ['Navigate foreign countries with ease', 'Connect with locals authentically'], painPoints: [{id: 'pp-1', text: 'Slow, unreliable translations in remote areas', sourceInsightIds: []}], gainPoints: [{id: 'gp-1', text: 'A device that feels like a travel essential, not a gadget', sourceInsightIds: []}], metrics: { customerPercentage: 35, userPercentage: 40 } },
];
export const mockObjectives: Objective[] = [
    { id: 'obj-1', title: 'Achieve Market Leadership in Handheld Translators', description: 'Become the #1 choice for travelers seeking a dedicated translation device.', keyResults: [{id: 'kr-1', text: 'Increase V4 market share from 15% to 25%', progress: 60, linkedInitiativeIds: ['init-1']}, {id: 'kr-2', text: 'Achieve an average rating of 4.8 stars on Amazon', progress: 90}], linkedPillarId: 'pillar-1' },
];

export const mockUpstreamInitiatives: UpstreamInitiative[] = [
    { id: 'init-1', jiraId: 'PROD-123', title: 'Improve Photo Translator Accuracy', status: 'Deep Research', summary: 'Based on user feedback, the photo translator is slow and inaccurate. This initiative will investigate and implement solutions to improve its performance.', linkedInsights: 5, linkedOKRId: 'kr-1', history: [], linkedFeedbackIds: ['fb-2'], linkedSolutionIds: [] },
    { id: 'init-2', jiraId: 'PROD-124', title: 'Implement "Favorite Phrases"', status: 'Analysing Opportunity', summary: 'Users want to save common phrases. This initiative is to define and scope this feature.', linkedInsights: 2, history: [], linkedFeedbackIds: ['fb-4'], linkedSolutionIds: [] },
    { id: 'init-3', jiraId: 'PROD-125', title: 'Cloud Sync for User Data', status: 'Backlog', summary: 'Explore options for syncing user data (like favorites, history) across devices.', linkedInsights: 0, history: [], linkedFeedbackIds: [], linkedSolutionIds: [] },
    { id: 'init-4', jiraId: 'PROD-126', title: 'New Onboarding Flow for V4', status: 'Parked', summary: 'Redesign the first-time user experience for the V4 translator to improve initial adoption.', linkedInsights: 10, history: [], linkedFeedbackIds: [], linkedSolutionIds: [] },
    { id: 'init-5', jiraId: 'PROD-127', title: 'Next-Gen Wearable Display Tech', status: 'Initial Research', summary: 'Research and prototype a new, brighter display for the next generation of Vasco Watch.', linkedInsights: 3, history: [], linkedFeedbackIds: ['fb-6'], linkedSolutionIds: [] },
];

export const mockCompanyStrategy: CompanyStrategy = {
    companyVision: { statement: "To break down language barriers, making communication effortless for everyone, anywhere.", explanation: "We aim to be the definitive leader in personal translation technology." },
    productDepartmentMission: { statement: "We create intuitive, reliable, and innovative translation technology that empowers people to connect and understand each other.", explanation: "Our focus is on the end-to-end user experience, from purchase to daily use." },
    pillars: [{id: 'pillar-1', title: 'Unmatched Accuracy & Speed', description: 'Core focus on delivering the most accurate and fastest translations.'}]
};
export const mockUserJourneys: UserJourney[] = [
    { id: 'journey-1', name: 'First-Time Traveler Onboarding', description: 'From unboxing to their first successful translation abroad.', stages: [{id: 'stage-1', name: 'Awareness', productIds: []}, {id: 'stage-2', name: 'Purchase', productIds: []}, {id: 'stage-3', name: 'Onboarding', productIds: ['hw-2']}] }
];
export const mockWorkspaceConfig: MyWorkspaceConfig = {
    savedReports: [{id: 'rep-1', name: 'Negative Feedback on V4', page: 'feedback/analysis', filters: { productId: 'hw-2', sentiment: 'Negative'}}],
    projectFolders: [],
    myPriorities: ['init-1', 'init-5'],
    notifications: [{id: 'not-1', text: 'New anomaly detected: Spike in negative feedback for Photo Translator', date: new Date().toISOString(), read: false, page: 'home'}]
};
export const mockIntegrationStatus: IntegrationStatus[] = [
    { id: FeedbackSource.Amazon, lastSync: '2 hours ago', status: 'ok', newInsights: 5 },
];
export const mockAnomalies: Anomaly[] = [
    { id: 'anom-1', title: 'Spike in "Connectivity Issue" reports for V4', description: 'A 200% increase in feedback mentioning "no connection" or "can\'t connect" over the last 48 hours for the V4 model.', severity: 'High', relatedPage: 'feedback/hub', relatedInsightIds: ['in-3'], aiSummary: 'The sudden increase suggests a potential server-side issue or a bug in a recent OTA update affecting network connectivity for V4 users.' },
];
export const mockContexts: TranslationContext[] = [
    { id: 'ctx-1', name: 'Ordering Food at a Restaurant', description: 'User needs to translate a menu and communicate with waitstaff.', linkedPersonaIds: ['p-1'] }
];
export const mockDocumentation: DocumentationArticle[] = [
    { 
        id: 'doc-arch', 
        title: 'Architecture Overview', 
        category: 'Technical Docs', 
        content: `
productflow.online is a Single Page Application (SPA) built with React and TypeScript.

Key architectural principles:
- **Component-Based:** The UI is composed of reusable React components.
- **State Management:** Global state is managed via React's Context API for simplicity and performance. We have a main AppContext for data and an AuthContext for user session management.
- **Static Typing:** TypeScript is used throughout the application to ensure type safety and improve developer experience.
- **Mock API Layer:** All data is currently provided by a mock API service (\`services/mockData.ts\`) that simulates asynchronous data fetching.
- **Styling:** Tailwind CSS is used for all styling, configured globally in \`app.html\`.
` 
    },
    { 
        id: 'doc-models', 
        title: 'Core Data Models', 
        category: 'Technical Docs', 
        content: `
The application revolves around a few key data abstractions that form "The Golden Thread":

- **Insight:** The smallest piece of raw user feedback (e.g., a single tweet or review).
- **Feedback (Cluster):** A theme or problem synthesized from multiple similar Insights. This is where analysis happens.
- **Hypothesis:** A testable assumption derived from a Feedback cluster. E.g., "If we fix X, then Y metric will improve."
- **Upstream Initiative:** A large piece of work or project designed to act on a validated Hypothesis or a strategic goal. It moves through the Kanban board.
- **Objective (OKR):** A high-level strategic goal that an Initiative is meant to impact.

These models are all interconnected, allowing full traceability from a single user comment up to a company-wide objective.
` 
    },
     { 
        id: 'doc-tech', 
        title: 'Technology Stack', 
        category: 'Technical Docs', 
        content: `
- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charting:** Recharts
- **Build/Dev Environment:** Vite-based (simulated via import maps)
- **Dependencies:** Served via esm.sh CDN.
` 
    },
];

export const mockChangelogData: ChangelogEntry[] = [
    {
        id: 'cl-3',
        version: 'v2.0.0 "Phoenix"',
        date: new Date().toISOString(),
        newFeatures: [
            '**Complete Rebranding:** The application has been rebranded to "productflow.online" with a new logo and a professional black/green color scheme.',
            '**New High-Converting Landing Page:** A new static `index.html` has been created, focusing on benefits, use cases, and testimonials.',
            '**Application Separation:** The main application now lives at `app.html`, fully separating it from the public-facing product page.',
            '**"Real" Documentation & Changelog:** The data for these sections is now detailed and reflects the actual state of the application, serving as a living reference.',
        ],
        improvements: [
            '**Massively Expanded Mock Data:** The application now feels "alive" with a significant increase in mock data across all modules.',
            '**Performance Optimizations:** All state update functions in the core AppContext are now wrapped in `useCallback` to prevent unnecessary re-renders.',
        ],
        bugFixes: [
            '**CRITICAL: Fixed Application Rendering Failure:** Resolved the persistent `Uncaught SyntaxError: Unexpected token ">"` by correcting the `importmap` configuration in all HTML files, ensuring reliable loading of all libraries.',
        ]
    },
    {
        id: 'cl-1',
        version: 'v1.2.0',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        newFeatures: [
            'Introduced the new "Strategy Healthcheck" module to periodically review strategic alignment.',
            'Added a "Changelog" page so you can track updates just like this one!',
        ],
        improvements: [
            'The Advanced Table now supports multi-column sorting and remembers column visibility.',
            'AI-generated problem descriptions in the Feedback Hub are now more concise.'
        ],
        bugFixes: [
            'Fixed an issue where the user journey map would not load for products with no feedback.',
            'Resolved a bug causing incorrect calculations in the KPI dashboard.'
        ]
    },
     {
        id: 'cl-2',
        version: 'v1.1.0',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        newFeatures: [
            'Launched the "Initiatives Work" Kanban board to replace the old discovery process.',
        ],
        improvements: [
            'Improved performance of the Feedback Hub table when loading over 10,000 insights.'
        ],
        bugFixes: [
            'Fixed a visual glitch in the Sentiment Chart.'
        ]
    }
];

export const mockDiscoveryItems: DiscoveryItem[] = [
    { id: 'di-1', title: 'Implement offline translation for top 10 languages', status: 'Under Consideration', summary: 'Allow users to perform translations without an internet connection.', confidence: 70, riskPoints: 60, unknowns: ['What is the required storage space?', 'How will it impact battery life?'] },
];
export const mockUnknowns: Unknown[] = [
    { id: 'unk-1', question: 'What is the required storage space for offline language packs?', source: { type: 'decision', id: 'di-1' }, status: 'Investigating', owner: 'Bartosz Kowalski' }
];
export const mockIdeas: Idea[] = [
    { id: 'idea-1', title: 'Group conversation mode', source: 'From insight #in-12', status: 'New', createdAt: new Date().toISOString(), aiSummary: 'A feature allowing multiple people speaking different languages to participate in a single, translated conversation.' }
];
export const initialTreeData: OpportunityNode = { id: '1', label: 'Increase User Retention by 15% in Q4', type: 'outcome', description: 'The primary goal for the product team this quarter.', owner: 'Alicja Nowak', status: 'On Track', children: [] };
export const mockTourSteps: TourStep[] = [
    { target: '#my-workspace-nav', title: 'Your Personal Hub', content: "This is your personalized workspace. Find your saved reports, notifications, and priorities here." },
];

const createApi = () => {
    return {
        async fetchUsers(): Promise<User[]> { return new Promise(resolve => setTimeout(() => resolve([...mockUsers]), apiDelay)); },
        async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
            let userToUpdate = mockUsers.find(u => u.id === userId);
            if (userToUpdate) {
                Object.assign(userToUpdate, updates);
                mockUsers = mockUsers.map(u => u.id === userId ? userToUpdate! : u);
                return new Promise(resolve => setTimeout(() => resolve(userToUpdate!), apiDelay));
            }
            return Promise.resolve(null);
        },
        async fetchWebScrapers(): Promise<WebScraper[]> { return new Promise(resolve => setTimeout(() => resolve([...mockWebScrapers]), apiDelay)); },
        async addWebScraper(scraper: Omit<WebScraper, 'id'>): Promise<WebScraper> {
            const newScraper: WebScraper = { ...scraper, id: `ws-${Date.now()}` };
            mockWebScrapers.push(newScraper);
            return new Promise(resolve => setTimeout(() => resolve(newScraper), apiDelay));
        },
        async fetchProducts(): Promise<Product[]> { return new Promise(resolve => setTimeout(() => resolve([...mockProducts]), apiDelay)); },
        async fetchInsights(): Promise<Insight[]> { return new Promise(resolve => setTimeout(() => resolve([...mockInsightData]), apiDelay)); },
        async fetchFeedbackClusters(): Promise<Feedback[]> { return new Promise(resolve => setTimeout(() => resolve([...mockFeedbackClusters]), apiDelay)); },
        async fetchPersonas(): Promise<Persona[]> { return new Promise(resolve => setTimeout(() => resolve([...mockPersonas]), apiDelay)); },
        async fetchUpstreamInitiatives(): Promise<UpstreamInitiative[]> { return new Promise(resolve => setTimeout(() => resolve([...mockUpstreamInitiatives]), apiDelay)); },
        async fetchHypotheses(): Promise<Hypothesis[]> { return new Promise(resolve => setTimeout(() => resolve([...mockHypotheses]), apiDelay)); },
        async fetchWorkspaceConfig(): Promise<MyWorkspaceConfig> { return new Promise(resolve => setTimeout(() => resolve(mockWorkspaceConfig), apiDelay)); },
        async fetchIntegrationStatus(): Promise<IntegrationStatus[]> { return new Promise(resolve => setTimeout(() => resolve(mockIntegrationStatus), apiDelay)); },
        async fetchAnomalies(): Promise<Anomaly[]> { return new Promise(resolve => setTimeout(() => resolve(mockAnomalies), apiDelay)); },
        async fetchObjectives(): Promise<Objective[]> { return new Promise(resolve => setTimeout(() => resolve(mockObjectives), apiDelay)); },
        async fetchCompanyStrategy(): Promise<CompanyStrategy> { return new Promise(resolve => setTimeout(() => resolve(mockCompanyStrategy), apiDelay)); },
        async fetchUserJourneys(): Promise<UserJourney[]> { return new Promise(resolve => setTimeout(() => resolve(mockUserJourneys), apiDelay)); },
        async fetchContexts(): Promise<TranslationContext[]> { return new Promise(resolve => setTimeout(() => resolve(mockContexts), apiDelay)); },
        async fetchDocumentation(): Promise<DocumentationArticle[]> { return new Promise(resolve => setTimeout(() => resolve(mockDocumentation), apiDelay)); },
        async fetchDiscoveryItems(): Promise<DiscoveryItem[]> { return new Promise(resolve => setTimeout(() => resolve(mockDiscoveryItems), apiDelay)); },
        async fetchUnknowns(): Promise<Unknown[]> { return new Promise(resolve => setTimeout(() => resolve(mockUnknowns), apiDelay)); },
        async fetchIdeas(): Promise<Idea[]> { return new Promise(resolve => setTimeout(() => resolve(mockIdeas), apiDelay)); },
        async fetchInitialTreeData(): Promise<OpportunityNode> { return new Promise(resolve => setTimeout(() => resolve(initialTreeData), apiDelay)); },
        async fetchTourSteps(): Promise<TourStep[]> { return new Promise(resolve => setTimeout(() => resolve(mockTourSteps), apiDelay)); },
        async fetchChangelog(): Promise<ChangelogEntry[]> { return new Promise(resolve => setTimeout(() => resolve([...mockChangelogData]), apiDelay)); },
    };
};

export const api = createApi();
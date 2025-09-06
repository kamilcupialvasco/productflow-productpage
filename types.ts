
export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export enum SentimentDetail {
    Delight = 'Delight',
    Frustration = 'Frustration',
    Confusion = 'Confusion',
    Suggestion = 'Suggestion',
    Praise = 'Praise',
    BugReport = 'Bug Report'
}

export enum FeedbackType {
  Remark = 'Remark',
  Idea = 'Idea',
  Bug = 'Bug',
  Question = 'Question',
}

export enum FeedbackSource {
  Trustpilot = 'Trustpilot',
  GoogleSheet = 'Google Sheet',
  Amazon = 'Amazon',
  PowerBI = 'PowerBI',
  Facebook = 'Facebook',
  Freshdesk = 'Freshdesk',
  Youtube = 'Youtube',
  Manual = 'Manual Import'
}

export enum UserRole {
  Admin = 'Admin',
  Editor = 'Editor',
  Viewer = 'Viewer'
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    segment: 'New User' | 'Power User' | 'Internal' | 'Anonymous';
    role: UserRole;
}

export interface Insight {
  id: string;
  source: FeedbackSource;
  content: string;
  sentiment: Sentiment;
  sentimentDetail: SentimentDetail;
  category: string;
  type: FeedbackType;
  productId: string;
  version: string;
  frequency: number;
  jiraTicket?: string;
  date: string;
  user: { id: string, segment: User['segment'] };
  tags?: string[];
  feedbackId?: string;
}

export enum FeedbackStatus {
    New = 'New',
    UnderReview = 'Under Review',
    Actioned = 'Actioned',
    Archived = 'Archived'
}

export type FeedbackSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Comment {
    id: string;
    userId: string;
    text: string;
    createdAt: string;
}

export interface Feedback {
    id: string;
    title: string;
    description: string;
    insightIds: string[];
    productIds: string[];
    sentiment: Sentiment; 
    status: FeedbackStatus;
    tags: string[];
    createdAt: string;
    owner?: string; 
    trend?: 'rising' | 'falling' | 'stable';
    actionabilityScore: number; // 0-100
    uncertaintyScore: number; // 0-100
    impact: number; // 0-100, new field
    severity?: FeedbackSeverity;
    timeToTriage?: number; // hours
    timeToAction?: number; // days
    problemDescription?: string; // AI generated
    isNew?: boolean;
    counterClusterId?: string;
    aiAnalysis?: { [key: string]: string };
    comments?: Comment[];
}

export interface FeatureVersion {
    version: string;
    changes: string;
    releaseDate: string;
}

export interface Feature {
    id: string;
    name: string;
    description: string;
    status: 'Idea' | 'In Development' | 'Released' | 'Deprecated';
    media: string[]; // URLs to screenshots or videos
    versionHistory: FeatureVersion[];
}

export interface KPI {
    id: string;
    name: string;
    value: string;
    target: string;
    trend: 'up' | 'down' | 'stable';
}

export interface ProductKPIs {
    keyMetrics: KPI[];
    sales: { date: string, units: number }[];
    userActivity: { date: string, mau: number }[];
    languageTrends: { lang: string, usage: number }[];
}

interface ProductBase {
    id: string;
    name: string;
    category: 'Hardware' | 'Software';
    subCategory: string;
    owner: string;
    strategy?: {
        vision?: string;
        mission?: string;
        pillars: { id: string, title: string, description: string }[];
    };
    linkedPersonaIds?: string[];
    kpiId?: string;
    linkedContextIds?: string[];
}

export interface Software extends ProductBase {
    category: 'Software';
    versions: string[];
    features: Feature[];
}

export interface Hardware extends ProductBase {
    category: 'Hardware';
    specifications: Record<string, string>;
    mediaGallery: { type: 'image' | 'render', url: string }[];
    colorVariants: string[];
    bundledSoftware: { softwareId: string, version: string }[];
    kpis?: ProductKPIs;
}

export type Product = Hardware | Software;

export type OpportunityNodeType = 'outcome' | 'opportunity' | 'solution' | 'experiment';

export interface OpportunityNode {
    id: string;
    label: string;
    description: string;
    owner: string;
    status: 'On Track' | 'At Risk' | 'On Hold' | 'Completed';
    type: OpportunityNodeType;
    children: OpportunityNode[];
    linkedId?: string;
}

export interface PersonaPoint {
    id: string;
    text: string;
    sourceInsightIds: string[];
}

export interface Persona {
    id: string;
    name: string;
    avatarUrl: string;
    role: string;
    goals: string[];
    painPoints: PersonaPoint[];
    gainPoints: PersonaPoint[];
    metrics: {
        customerPercentage: number;
        userPercentage: number;
    };
}

export type DiscoveryItemStatus = 'Idea' | 'Under Consideration' | 'Data Gathering' | 'Approved' | 'Rejected';
export type VersionHistoryItem = { date: string; change: string; user: string; };

export interface DiscoveryItem {
    id: string;
    title: string;
    status: DiscoveryItemStatus;
    summary: string;
    linkedStrategyId?: string; 
    confidence: number;
    riskPoints: number;
    unknowns: string[];
    aiAnalysis?: string;
    notes?: string;
    linkedInsightIds?: string[];
    history?: VersionHistoryItem[];
}

export interface Idea {
    id: string;
    title: string;
    source: string; // e.g., "From insight #123", "Manual entry"
    status: 'New' | 'Processing' | 'Processed' | 'Archived';
    aiSummary?: string;
    aiRisks?: string[];
    aiImpact?: string;
    createdAt: string;
}

export type UpstreamStatus = 
    | 'Backlog' 
    | 'Analysing Opportunity' 
    | 'Initial Research' 
    | 'Deep Research' 
    | 'Input for Discussion' 
    | 'Parked' 
    | 'Waiting for Development' 
    | 'In Development' 
    | 'Released' 
    | 'Done';

export interface ChecklistItem {
    id: string;
    text: string;
    isDone: boolean;
    isAiGenerated: boolean;
}

export interface UpstreamInitiative {
    id: string;
    jiraId?: string;
    title: string;
    status: UpstreamStatus;
    summary: string;
    checklist?: ChecklistItem[];
    linkedInsights: number;
    linkedOKRId?: string;
    // New fields for traceability
    linkedFeedbackIds?: string[];
    linkedSolutionIds?: string[]; // Note: Solution type not yet in the system
    history?: VersionHistoryItem[];
}

export interface RiceFeature extends UpstreamInitiative {
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
    linkedObjectiveId?: string;
}

export interface KeyResult {
    id: string;
    text: string;
    progress: number;
    linkedInitiativeIds?: string[];
}
export interface Objective {
    id: string;
    title: string;
    description: string;
    keyResults: KeyResult[];
    linkedPillarId?: string;
    history?: VersionHistoryItem[];
}

export interface StrategicPillar {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
}

export interface CompanyStrategy {
    companyVision: { statement: string, explanation: string };
    productDepartmentMission: { statement: string, explanation: string };
    pillars: StrategicPillar[];
}

export interface JourneyStage {
    id: string;
    name: string;
    productIds: string[];
}

export interface UserJourney {
    id: string;
    name: string;
    description: string;
    stages: JourneyStage[];
}

export type HypothesisStatus = 'New' | 'Validating' | 'Proven' | 'Rejected';

export interface Hypothesis {
    id: string;
    title: string;
    description: string;
    status: HypothesisStatus;
    certainty: number; // 0-100
    difficulty: number; // 0-100
    impact: number; // 0-100
    severity: FeedbackSeverity;
    linkedFeedbackIds: string[];
    linkedInitiativeId?: string;
    tags?: string[];
    linkedOutcomeIds?: string[];
}

export type Page = 
  | 'home'
  | 'workspace'
  | `product/portfolio` | `product/strategy-suite` | `product/personas` | `product/strategy-healthcheck` | `product/kpis/${string}` | 'product/contexts' | 'product/outcomes'
  | 'feedback/dashboard' | 'feedback/hub' | 'feedback/analysis' | 'feedback/journey' | 'feedback/board'
  | 'hypothesis/board'
  | 'upstream/inbox' | 'upstream/initiatives' | 'upstream/unknowns'
  | 'settings/users' | 'settings/integrations' | 'settings/api' | 'settings/scrapers' | 'settings/documentation' | 'settings/changelog'
  | string; 

export interface SavedReport {
    id: string;
    name: string;
    page: Page;
    filters: Record<string, any>;
}
export interface ProjectFolder {
    id: string;
    name: string;
    initiative: string;
    linkedItems: { type: string, id: string }[];
}
export interface Unknown {
    id: string;
    question: string;
    source: { type: 'decision' | 'feedback', id: string };
    status: 'New' | 'Investigating' | 'Resolved';
    notes?: string;
    owner?: string;
}
export interface Notification {
    id: string;
    text: string;
    date: string;
    read: boolean;
    page: Page;
}
export interface MyWorkspaceConfig {
    savedReports: SavedReport[];
    projectFolders: ProjectFolder[];
    myPriorities: string[]; // List of initiative IDs
    notifications: Notification[];
}

export interface IntegrationStatus {
    id: FeedbackSource;
    lastSync: string;
    status: 'ok' | 'error';
    newInsights: number;
}

export interface Anomaly {
    id:string;
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
    relatedPage: Page;
    relatedInsightIds: string[];
    aiSummary?: string;
    suggestedActions?: string[];
}

export interface TranslationContext {
    id: string;
    name: string;
    description: string;
    linkedPersonaIds: string[];
}

export interface DocumentationArticle {
    id: string;
    title: string;
    category: 'User Guide' | 'Technical Docs' | 'Jira' | 'Slack' | 'General' | 'Web Scrapers';
    content: string;
}

export interface WebScraper {
    id: string;
    name: string;
    targetUrl: string;
    status: 'Active' | 'Paused' | 'Error';
    lastRun: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
}

export interface Hint {
    id: string;
    content: string;
}

export interface TourStep {
    target: string; // CSS selector
    content: string;
    title: string;
}

export interface ChangelogEntry {
    id: string;
    version: string;
    date: string;
    newFeatures: string[];
    improvements: string[];
    bugFixes: string[];
}
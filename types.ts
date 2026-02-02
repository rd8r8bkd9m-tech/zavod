
export enum ContentStatus {
  IDEA = 'Идея', // Backlog
  DRAFT = 'Черновик', // Production
  REVIEW = 'На проверке', // Approval 1
  APPROVED = 'Утверждено', // Approval 2
  SCHEDULED = 'Запланировано',
  PUBLISHED = 'Опубликовано'
}

export enum Platform {
  TELEGRAM = 'Telegram',
  VK = 'ВКонтакте',
  DZEN = 'Dzen (Yandex)',
  YOUTUBE = 'YouTube',
  RUTUBE = 'RuTube',
  TENCHAT = 'TenChat',
  VC = 'VC.ru',
  INSTAGRAM = 'Instagram',
  TWITTER = 'X (Twitter)',
  FACEBOOK = 'Facebook',
  OK = 'Одноклассники',
  LINKEDIN = 'LinkedIn',
  WORDPRESS = 'WordPress'
}

export interface BrandProfile {
  companyName: string;
  description: string;
  targetAudience: string;
  toneOfVoice: string;
  usp: string; // Unique Selling Proposition
  forbiddenWords: string; // Comma separated
  websiteUrl: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  endDate?: string;
  contentIds: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  body: string;
  platform: Platform;
  status: ContentStatus;
  createdAt: string;
  scheduledAt?: string; // ISO Date string
  tags: string[];
  campaignId?: string; // Link to Campaign
  sourceUrl?: string; // For ideas derived from videos/articles
  generatedBy?: 'manual' | 'autopilot';
}

export interface GenerationRequest {
  topic: string;
  tone: string;
  platforms: Platform[];
  campaignId?: string;
}

export interface AutoPilotTask {
  id: string;
  name: string;
  topic: string; // The query or focus area
  platforms: Platform[];
  interval: 'daily' | 'weekly';
  isActive: boolean;
  autoPublish: boolean; // If true, status = SCHEDULED/PUBLISHED. If false, status = REVIEW
  lastRun?: string;
  campaignId?: string;
}

export interface Integration {
  id: Platform;
  name: string;
  isConnected: boolean;
  apiKey?: string;
  settings?: Record<string, string>;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface AnalyticsMetric {
  date: string;
  views: number;
  clicks: number;
  cost: number;
  revenue: number; // Derived from CRM/UTM
}

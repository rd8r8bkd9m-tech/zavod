
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContentItem, ContentStatus, Platform, Integration, AutoPilotTask, BrandProfile, Campaign } from '../types';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  credits: number;
  library: ContentItem[];
  campaigns: Campaign[];
  notifications: Notification[];
  brandProfile: BrandProfile;
  integrations: Integration[];
  autoPilotTasks: AutoPilotTask[];
  
  // Actions
  setTheme: (theme: Theme) => void;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => boolean;
  addToLibrary: (items: ContentItem[]) => void;
  updateContentStatus: (id: string, status: ContentStatus) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  removeContent: (id: string) => void;
  
  // Brand Actions
  updateBrandProfile: (updates: Partial<BrandProfile>) => void;
  
  // Campaign Actions
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // AutoPilot Actions
  addAutoPilotTask: (task: AutoPilotTask) => void;
  toggleAutoPilotTask: (id: string) => void;
  deleteAutoPilotTask: (id: string) => void;
  updateAutoPilotLastRun: (id: string, date: string) => void;

  // Integrations
  toggleIntegration: (platform: Platform, apiKey?: string, settings?: Record<string, string>) => void;
  
  // Toast Logic
  addNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
}

// Initial Mock Data
const initialLibrary: ContentItem[] = [
    { id: '1', title: 'Анонс летней распродажи', body: 'Текст поста...', platform: Platform.VK, status: ContentStatus.PUBLISHED, createdAt: new Date().toISOString(), tags: ['#sale'], generatedBy: 'manual', campaignId: 'c1' },
    { id: '2', title: '5 советов по продуктивности', body: 'Текст поста...', platform: Platform.TELEGRAM, status: ContentStatus.REVIEW, createdAt: new Date().toISOString(), tags: ['#productivity'], generatedBy: 'manual' },
];

const initialCampaigns: Campaign[] = [
    {
        id: 'c1',
        name: 'Летний запуск 2024',
        description: 'Масштабная кампания по продвижению летней коллекции',
        status: 'active',
        startDate: new Date().toISOString(),
        contentIds: ['1']
    }
];

const initialIntegrations: Integration[] = [
    { id: Platform.TELEGRAM, name: 'Telegram Bot', isConnected: false },
    { id: Platform.VK, name: 'ВКонтакте API', isConnected: true },
    { id: Platform.DZEN, name: 'Dzen (Yandex)', isConnected: false },
    { id: Platform.YOUTUBE, name: 'YouTube Studio', isConnected: false },
    { id: Platform.RUTUBE, name: 'RuTube API', isConnected: false },
    { id: Platform.INSTAGRAM, name: 'Instagram Graph API', isConnected: false },
    { id: Platform.TWITTER, name: 'X (Twitter)', isConnected: false },
    { id: Platform.FACEBOOK, name: 'Facebook Pages', isConnected: false },
    { id: Platform.OK, name: 'Одноклассники', isConnected: false },
    { id: Platform.TENCHAT, name: 'TenChat', isConnected: false },
    { id: Platform.VC, name: 'VC.ru', isConnected: false },
    { id: Platform.WORDPRESS, name: 'WordPress', isConnected: false },
];

const initialAutoPilotTasks: AutoPilotTask[] = [
    {
        id: '1',
        name: 'Утренние новости IT',
        topic: 'Главные новости технологий и AI за последние 24 часа',
        platforms: [Platform.TELEGRAM, Platform.TWITTER],
        interval: 'daily',
        isActive: true,
        autoPublish: false,
    }
];

const initialBrandProfile: BrandProfile = {
    companyName: '',
    description: '',
    targetAudience: '',
    toneOfVoice: 'Экспертный, уверенный',
    usp: '',
    forbiddenWords: '',
    websiteUrl: ''
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark', 
      credits: 150,
      library: initialLibrary,
      campaigns: initialCampaigns,
      notifications: [],
      brandProfile: initialBrandProfile,
      integrations: initialIntegrations,
      autoPilotTasks: initialAutoPilotTasks,

      setTheme: (theme) => set({ theme }),

      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      
      deductCredits: (amount) => {
        const current = get().credits;
        if (current >= amount) {
          set({ credits: current - amount });
          return true;
        }
        return false;
      },

      addToLibrary: (items) => set((state) => {
        // If items belong to a campaign, update campaign contentIds
        const newLibrary = [...items, ...state.library];
        let newCampaigns = [...state.campaigns];
        
        items.forEach(item => {
            if (item.campaignId) {
                newCampaigns = newCampaigns.map(c => 
                    c.id === item.campaignId 
                    ? { ...c, contentIds: [...c.contentIds, item.id] }
                    : c
                );
            }
        });

        return { library: newLibrary, campaigns: newCampaigns };
      }),

      updateContentStatus: (id, status) => set((state) => ({
        library: state.library.map(item => item.id === id ? { ...item, status } : item)
      })),

      updateContent: (id, updates) => set((state) => ({
        library: state.library.map(item => item.id === id ? { ...item, ...updates } : item)
      })),

      removeContent: (id) => set((state) => ({
        library: state.library.filter(item => item.id !== id),
        // Remove from campaigns too
        campaigns: state.campaigns.map(c => ({
            ...c,
            contentIds: c.contentIds.filter(cid => cid !== id)
        }))
      })),
      
      updateBrandProfile: (updates) => set((state) => ({
          brandProfile: { ...state.brandProfile, ...updates }
      })),

      addCampaign: (campaign) => set((state) => ({
          campaigns: [campaign, ...state.campaigns]
      })),

      updateCampaign: (id, updates) => set((state) => ({
          campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...updates } : c)
      })),

      deleteCampaign: (id) => set((state) => ({
          campaigns: state.campaigns.filter(c => c.id !== id),
          // Optional: Remove campaignId from posts or delete posts? Keeping posts for now.
          library: state.library.map(item => item.campaignId === id ? { ...item, campaignId: undefined } : item)
      })),

      addAutoPilotTask: (task) => set((state) => ({
          autoPilotTasks: [...state.autoPilotTasks, task]
      })),

      toggleAutoPilotTask: (id) => set((state) => ({
          autoPilotTasks: state.autoPilotTasks.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t)
      })),

      deleteAutoPilotTask: (id) => set((state) => ({
          autoPilotTasks: state.autoPilotTasks.filter(t => t.id !== id)
      })),

      updateAutoPilotLastRun: (id, date) => set((state) => ({
          autoPilotTasks: state.autoPilotTasks.map(t => t.id === id ? { ...t, lastRun: date } : t)
      })),

      toggleIntegration: (platform, apiKey, settings) => set((state) => ({
        integrations: state.integrations.map(i => 
            i.id === platform 
                ? { 
                    ...i, 
                    isConnected: !i.isConnected, 
                    apiKey: apiKey || i.apiKey,
                    settings: settings || i.settings
                  } 
                : i
        )
      })),

      addNotification: (type, message) => {
        const id = crypto.randomUUID();
        set((state) => ({
          notifications: [...state.notifications, { id, type, message }]
        }));
        
        setTimeout(() => {
          get().removeNotification(id);
        }, 4000);
      },

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }))
    }),
    {
      name: 'content-factory-storage-v2', // Changed version to clear old state if needed
      partialize: (state) => ({ 
          theme: state.theme,
          credits: state.credits, 
          library: state.library, 
          brandProfile: state.brandProfile, // Persisting new profile
          campaigns: state.campaigns, // Persisting campaigns
          integrations: state.integrations,
          autoPilotTasks: state.autoPilotTasks
      }),
    }
  )
);

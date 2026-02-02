
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { Platform, BrandProfile } from '../types';
import { validateTelegramToken } from '../services/telegramService';

export const Settings: React.FC = () => {
  const { integrations, toggleIntegration, addNotification, brandProfile, updateBrandProfile, theme, setTheme } = useAppStore();
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [chatIds, setChatIds] = useState<Record<string, string>>({}); 
  const [isValidating, setIsValidating] = useState<string | null>(null);

  // Local state for brand profile form
  const [profileForm, setProfileForm] = useState<BrandProfile>(brandProfile);

  const handleBrandSave = () => {
      updateBrandProfile(profileForm);
      addNotification('success', 'Память бренда обновлена');
  };

  const handleConnect = async (platform: Platform) => {
    const integration = integrations.find(i => i.id === platform);
    
    if (integration?.isConnected) {
        toggleIntegration(platform);
        addNotification('info', `${platform} отключен`);
    } else {
        const token = tokens[platform];
        
        if (platform === Platform.TELEGRAM) {
             const chatId = chatIds[platform];
             if (!token || !chatId) {
                 addNotification('error', 'Для Telegram нужны Token и Chat ID');
                 return;
             }
             
             setIsValidating(platform);
             const isValid = await validateTelegramToken(token);
             setIsValidating(null);

             if (!isValid) {
                 addNotification('error', 'Неверный Telegram Bot Token');
                 return;
             }

             toggleIntegration(platform, token, { chatId });
             addNotification('success', `${platform} успешно подключен!`);
             return;
        }

        if (!token && platform !== Platform.VK) {
             addNotification('error', 'Введите API токен');
             return;
        }
        
        toggleIntegration(platform, token);
        addNotification('success', `${platform} успешно подключен!`);
    }
  };

  const updateToken = (platform: string, value: string) => {
      setTokens(prev => ({ ...prev, [platform]: value }));
  };

  const updateChatId = (platform: string, value: string) => {
      setChatIds(prev => ({ ...prev, [platform]: value }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Настройки</h1>
        <p className="text-slate-500 dark:text-zinc-400">Управление интеграциями, внешним видом и памятью бренда.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              
              {/* Brand Memory Settings (New Structured Form) */}
              <Card title="Память Бренда (Brand DNA)">
                  <div className="space-y-4">
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-2">
                          Заполните эти данные подробно. ИИ будет использовать их как "системный промпт" для каждой генерации.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Название Компании</label>
                              <input 
                                  type="text" 
                                  value={profileForm.companyName} 
                                  onChange={e => setProfileForm({...profileForm, companyName: e.target.value})} 
                                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-slate-900 dark:text-white"
                                  placeholder="SuperCorp Inc."
                              />
                          </div>
                          
                          <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Описание деятельности</label>
                              <textarea 
                                  value={profileForm.description} 
                                  onChange={e => setProfileForm({...profileForm, description: e.target.value})} 
                                  className="w-full h-20 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-slate-900 dark:text-white resize-none"
                                  placeholder="Чем вы занимаетесь?"
                              />
                          </div>

                          <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Целевая Аудитория</label>
                              <input 
                                  type="text" 
                                  value={profileForm.targetAudience} 
                                  onChange={e => setProfileForm({...profileForm, targetAudience: e.target.value})} 
                                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-slate-900 dark:text-white"
                                  placeholder="Мужчины 25-40 лет, IT..."
                              />
                          </div>
                          
                          <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Tone of Voice</label>
                              <input 
                                  type="text" 
                                  value={profileForm.toneOfVoice} 
                                  onChange={e => setProfileForm({...profileForm, toneOfVoice: e.target.value})} 
                                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-slate-900 dark:text-white"
                                  placeholder="Дерзкий, дружелюбный..."
                              />
                          </div>

                          <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Уникальное Торговое Предложение (USP)</label>
                              <input 
                                  type="text" 
                                  value={profileForm.usp} 
                                  onChange={e => setProfileForm({...profileForm, usp: e.target.value})} 
                                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-slate-900 dark:text-white"
                                  placeholder="Мы делаем X быстрее всех за счет Y..."
                              />
                          </div>

                          <div>
                               <label className="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Запрещенные слова (Стоп-слова)</label>
                               <input 
                                  type="text" 
                                  value={profileForm.forbiddenWords} 
                                  onChange={e => setProfileForm({...profileForm, forbiddenWords: e.target.value})} 
                                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-slate-900 dark:text-white"
                                  placeholder="Дешево, скидка, халява..."
                               />
                          </div>
                          
                          <div>
                               <label className="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Веб-сайт</label>
                               <input 
                                  type="text" 
                                  value={profileForm.websiteUrl} 
                                  onChange={e => setProfileForm({...profileForm, websiteUrl: e.target.value})} 
                                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-slate-900 dark:text-white"
                                  placeholder="https://mysite.com"
                               />
                          </div>
                      </div>

                      <div className="flex justify-end pt-2">
                          <Button onClick={handleBrandSave}>Сохранить ДНК Бренда</Button>
                      </div>
                  </div>
              </Card>

              <Card title="Подключенные платформы">
                  <div className="space-y-4">
                      {integrations.map(integration => (
                          <div key={integration.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800">
                              <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold shadow-sm dark:shadow-none
                                      ${integration.id === Platform.TELEGRAM ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500' : 
                                        integration.id === Platform.VK ? 'bg-blue-100 dark:bg-blue-700/20 text-blue-700 dark:text-blue-400' : 
                                        'bg-white dark:bg-zinc-800 text-slate-400 dark:text-zinc-400'
                                      }`}>
                                      {integration.id.slice(0, 1)}
                                  </div>
                                  <div>
                                      <h3 className="font-medium text-slate-900 dark:text-white">{integration.name}</h3>
                                      <p className="text-sm text-slate-500 dark:text-zinc-500">
                                          {integration.isConnected ? 'Активно • Авто-постинг' : 'Не подключено'}
                                      </p>
                                      {integration.isConnected && integration.settings?.chatId && (
                                          <p className="text-xs text-slate-400 mt-1">Chat ID: {integration.settings.chatId}</p>
                                      )}
                                  </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 w-full sm:w-auto">
                                  {!integration.isConnected && (
                                      <>
                                        <input 
                                            type="password" 
                                            placeholder="API Token" 
                                            className="bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 w-full sm:w-48"
                                            value={tokens[integration.id] || ''}
                                            onChange={(e) => updateToken(integration.id, e.target.value)}
                                        />
                                        {integration.id === Platform.TELEGRAM && (
                                            <input 
                                                type="text" 
                                                placeholder="Chat ID (e.g. @mychannel)" 
                                                className="bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 w-full sm:w-48"
                                                value={chatIds[integration.id] || ''}
                                                onChange={(e) => updateChatId(integration.id, e.target.value)}
                                            />
                                        )}
                                      </>
                                  )}
                                  <Button 
                                      variant={integration.isConnected ? 'secondary' : 'primary'}
                                      size="sm"
                                      isLoading={isValidating === integration.id}
                                      onClick={() => handleConnect(integration.id as Platform)}
                                  >
                                      {integration.isConnected ? 'Отключить' : 'Подключить'}
                                  </Button>
                              </div>
                          </div>
                      ))}
                  </div>
              </Card>
          </div>

          <div className="space-y-6">
              <Card title="Внешний вид">
                  <div className="flex items-center gap-4">
                      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg w-full">
                          <button 
                              onClick={() => setTheme('light')}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${theme === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                          >
                              Светлая
                          </button>
                          <button 
                              onClick={() => setTheme('dark')}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${theme === 'dark' ? 'bg-zinc-800 shadow-sm text-white' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`}
                          >
                              Тёмная
                          </button>
                      </div>
                  </div>
              </Card>

              <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/10">
                  <h4 className="text-yellow-800 dark:text-yellow-500 font-medium text-sm mb-2">Безопасность</h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-500/80 leading-relaxed">
                      API ключи хранятся только в локальном хранилище вашего браузера (LocalStorage) для целей демонстрации MVP.
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

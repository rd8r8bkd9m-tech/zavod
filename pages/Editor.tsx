import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ContentStatus, Platform } from '../types';
import { generateContentBatch } from '../services/geminiService';
import { sendTelegramMessage } from '../services/telegramService';

export const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { library, updateContent, addNotification, integrations, addToLibrary, brandInfo } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [isScheduleMode, setIsScheduleMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [showUtmModal, setShowUtmModal] = useState(false);
  const [utmCampaign, setUtmCampaign] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  const item = library.find(i => i.id === id);
  const integration = integrations.find(int => int.id === item?.platform);
  const isConnected = integration?.isConnected;

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setBody(item.body);
      if (item.scheduledAt) {
          const dt = new Date(item.scheduledAt);
          dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
          setScheduleDate(dt.toISOString().slice(0, 16));
      }
    } else {
      navigate('/library');
    }
  }, [item, navigate]);

  if (!item) return null;

  const handleSave = () => {
    updateContent(item.id, { title, body });
    addNotification('success', 'Изменения сохранены');
  };

  const handleGenerateFromIdea = async () => {
      setIsGenerating(true);
      try {
          const platforms = [Platform.TELEGRAM, Platform.VK, Platform.DZEN];
          
          const newContent = await generateContentBatch({
              topic: item.title,
              sourceContent: item.body,
              tone: 'Экспертный',
              platforms: platforms,
              brandInfo: brandInfo
          });
          
          addToLibrary(newContent);
          updateContent(item.id, { status: ContentStatus.APPROVED }); 
          addNotification('success', `Идея превращена в ${newContent.length} единиц контента!`);
          navigate('/library');
      } catch (e) {
          addNotification('error', 'Ошибка генерации');
      } finally {
          setIsGenerating(false);
      }
  };

  const handleApproveContent = () => {
      updateContent(item.id, { status: ContentStatus.APPROVED });
      addNotification('success', 'Контент утвержден. Готов к публикации.');
  };

  const handleInsertUTM = () => {
      if (!targetUrl || !utmCampaign) return;
      
      const source = item.platform.toLowerCase().replace(' ', '_');
      const medium = 'social';
      const finalUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}utm_source=${source}&utm_medium=${medium}&utm_campaign=${utmCampaign}&utm_content=${item.id}`;
      
      setBody(prev => prev + `\n\n🔗 ${finalUrl}`);
      setShowUtmModal(false);
      addNotification('success', 'UTM ссылка добавлена в текст');
  };

  const handlePublish = async () => {
    if (!isConnected) {
        addNotification('error', `Ошибка: ${item.platform} не подключен в Настройках`);
        return;
    }

    setIsLoading(true);
    
    try {
        if (isScheduleMode && scheduleDate) {
             // Mock Schedule
             setTimeout(() => {
                updateContent(item.id, { status: ContentStatus.SCHEDULED, scheduledAt: new Date(scheduleDate).toISOString() });
                addNotification('success', `Запланировано на ${new Date(scheduleDate).toLocaleString()}`);
                setIsLoading(false);
                navigate('/calendar');
             }, 1000);
        } else {
            // REAL PUBLISHING LOGIC
            if (item.platform === Platform.TELEGRAM && integration.apiKey && integration.settings?.chatId) {
                await sendTelegramMessage(integration.apiKey, integration.settings.chatId, body, item.id);
            } else {
                // Mock for other platforms
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            updateContent(item.id, { status: ContentStatus.PUBLISHED, scheduledAt: undefined });
            addNotification('success', `Опубликовано в ${item.platform}`);
            setIsLoading(false);
            navigate('/library');
        }
    } catch (e: any) {
        console.error(e);
        addNotification('error', `Ошибка публикации: ${e.message}`);
        setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/library')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500 dark:text-zinc-400 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                 <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Редактор</h1>
                 <p className="text-slate-500 dark:text-zinc-400 text-sm flex items-center gap-2">
                    {item.platform} 
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-600"></span>
                    <span className={`uppercase font-bold text-xs ${item.status === ContentStatus.IDEA ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-300'}`}>{item.status}</span>
                 </p>
            </div>
        </div>
        
        {/* Workflow Buttons */}
        <div className="flex gap-2">
            <Button variant="secondary" onClick={handleSave}>Сохранить</Button>
            
            {item.status === ContentStatus.IDEA && (
                <Button onClick={handleGenerateFromIdea} isLoading={isGenerating} className="bg-indigo-600 hover:bg-indigo-700">
                    ⚡ Разработать контент
                </Button>
            )}

            {(item.status === ContentStatus.DRAFT || item.status === ContentStatus.REVIEW) && (
                 <Button onClick={handleApproveContent} className="bg-green-600 hover:bg-green-700">Утвердить контент</Button>
            )}

            {(item.status === ContentStatus.APPROVED || item.status === ContentStatus.SCHEDULED) && (
                <>
                    <div className="flex bg-slate-200 dark:bg-zinc-800 rounded-lg p-1 border border-slate-300 dark:border-zinc-700">
                        <button onClick={() => setIsScheduleMode(false)} className={`px-3 py-1 rounded text-sm ${!isScheduleMode ? 'bg-white dark:bg-zinc-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`}>Сейчас</button>
                        <button onClick={() => setIsScheduleMode(true)} className={`px-3 py-1 rounded text-sm ${isScheduleMode ? 'bg-white dark:bg-zinc-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`}>Позже</button>
                    </div>
                    <Button onClick={handlePublish} isLoading={isLoading} disabled={!isConnected || (isScheduleMode && !scheduleDate)}>
                        {isScheduleMode ? 'Запланировать' : 'Опубликовать'}
                    </Button>
                </>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-full">
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800 pb-2 focus:border-indigo-600 focus:outline-none w-full placeholder:text-slate-300 dark:placeholder:text-zinc-700"
                placeholder="Заголовок..."
            />
            <div className="flex-1 relative">
                 <textarea 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full h-full bg-white dark:bg-zinc-900/30 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 resize-none focus:ring-2 focus:ring-indigo-600 focus:outline-none leading-relaxed font-mono text-sm shadow-sm dark:shadow-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                    placeholder="Текст контента..."
                />
                <button 
                    onClick={() => setShowUtmModal(true)}
                    className="absolute bottom-4 right-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs px-3 py-1.5 rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all flex items-center gap-2 text-slate-700 dark:text-zinc-300"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    UTM Ссылка
                </button>
            </div>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6 overflow-y-auto">
            {isScheduleMode && (
                <Card title="Дата публикации">
                    <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded p-2 text-slate-900 dark:text-white text-sm" />
                </Card>
            )}
            
            {/* Context Helper */}
            {item.status === ContentStatus.IDEA && (
                 <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900/50 rounded-lg text-indigo-800 dark:text-indigo-200 text-sm">
                    💡 <b>Режим Идеи</b><br/>
                    Нажмите "⚡ Разработать контент", чтобы ИИ автоматически создал посты для Telegram, VK и Dzen на основе этой идеи.
                 </div>
            )}
            
            {item.sourceUrl && (
                <Card title="Источник">
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all">
                        {item.sourceUrl}
                    </a>
                </Card>
            )}

            <Card title="Чек-лист">
                <div className="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-indigo-600" /> <span>Заголовок цепляет?</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-indigo-600" /> <span>UTM метки добавлены?</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-indigo-600" /> <span>Tone of Voice соблюден?</span></label>
                </div>
            </Card>
        </div>
      </div>

      {/* UTM Modal */}
      {showUtmModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-6 w-96 shadow-2xl">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Генератор UTM</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs text-slate-500 dark:text-zinc-500 mb-1">Целевой URL</label>
                          <input type="text" placeholder="https://mysite.com/offer" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded p-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600" />
                      </div>
                      <div>
                          <label className="block text-xs text-slate-500 dark:text-zinc-500 mb-1">Название кампании (utm_campaign)</label>
                          <input type="text" placeholder="spring_sale_2024" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded p-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600" />
                      </div>
                      <div className="flex gap-2 pt-2">
                          <Button className="flex-1" onClick={handleInsertUTM}>Вставить</Button>
                          <Button variant="secondary" onClick={() => setShowUtmModal(false)}>Отмена</Button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
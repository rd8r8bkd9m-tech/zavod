
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Platform, ContentItem, AutoPilotTask, ContentStatus } from '../types';
import { generateContentBatch, analyzeVideoContent } from '../services/geminiService';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const Factory: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'semi' | 'auto'>('semi');
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <div>
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Конвейер Контента <span className="text-indigo-600 dark:text-indigo-500 text-sm align-top ml-2">v2.1</span></h1>
                 <p className="text-slate-500 dark:text-zinc-400">Выберите режим работы системы.</p>
            </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-zinc-800 mb-6">
             <button 
                onClick={() => setActiveMode('semi')}
                className={`pb-3 px-1 text-sm font-medium transition-all ${activeMode === 'semi' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white'}`}
             >
                Полу-Автоматический (Ручной запуск)
             </button>
             <button 
                onClick={() => setActiveMode('auto')}
                className={`pb-3 px-1 text-sm font-medium transition-all ${activeMode === 'auto' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white'}`}
             >
                Полный Автопилот (Агенты)
             </button>
        </div>

        {activeMode === 'semi' ? <SemiAutomaticMode /> : <FullyAutomaticMode />}
    </div>
  );
};

const SemiAutomaticMode: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Экспертный');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.TELEGRAM, Platform.VK]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  const [lastGeneratedIds, setLastGeneratedIds] = useState<string[]>([]);
  
  const { deductCredits, addNotification, addToLibrary, library, brandProfile, campaigns } = useAppStore();
  const navigate = useNavigate();

  const isUrl = (text: string) => {
      return text.trim().startsWith('http://') || text.trim().startsWith('https://');
  };

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const runPipelineVisuals = (isVideo = false) => {
      const states = isVideo 
        ? [
            "Скачивание транскрипции видео...",
            "Выделение ключевых смыслов (Key Points)...",
            "Анализ структуры и хуков...",
            "Адаптация под Tone of Voice...",
            "Генерация контента для платформ..."
          ]
        : [
            "Анализ контекста и аудитории...",
            "Загрузка ДНК Бренда...",
            "Выбор маркетинговых фреймворков (AIDA/PAS)...",
            "Генерация черновиков...",
            "Финальная полировка..."
          ];
      let i = 0;
      setLoadingState(states[0]);
      const interval = setInterval(() => {
          i++;
          if (i < states.length) setLoadingState(states[i]);
      }, 1200);
      return interval;
  };

  const handleGenerate = async () => {
    if (!topic) return;
    
    const isVideoInput = isUrl(topic);
    const cost = isVideoInput ? 20 : 12; // Video analysis costs more
    const canAfford = deductCredits(cost);
    
    if (!canAfford) {
        addNotification('error', 'Недостаточно токенов! Пополните баланс.');
        return;
    }

    setIsGenerating(true);
    const intervalId = runPipelineVisuals(isVideoInput);

    try {
      let finalTopic = topic;
      let sourceContent = undefined;

      // Pipeline for Video
      if (isVideoInput) {
          const videoAnalysis = await analyzeVideoContent(topic);
          finalTopic = videoAnalysis.title;
          sourceContent = videoAnalysis.summary;
          addNotification('info', 'Видео успешно проанализировано!');
      }

      const data = await generateContentBatch({
        topic: finalTopic,
        sourceContent: sourceContent,
        tone,
        platforms: selectedPlatforms,
        brandProfile,
        campaignId: selectedCampaignId || undefined
      });
      
      const enrichedData = data.map(d => ({ ...d, generatedBy: 'manual' as const }));

      addToLibrary(enrichedData);
      setLastGeneratedIds(enrichedData.map(d => d.id));
      setStep(2);
      addNotification('success', `Успешно создано ${data.length} материалов. Списано ${cost} токенов.`);
    } catch (e) {
      addNotification('error', "Ошибка генерации. Токены возвращены (симуляция).");
    } finally {
      clearInterval(intervalId);
      setIsGenerating(false);
      setLoadingState('');
    }
  };

  const handleReset = () => {
    setStep(1);
    setTopic('');
    setLastGeneratedIds([]);
  };

  const results = library.filter(item => lastGeneratedIds.includes(item.id));

  return (
    <div className="flex flex-col h-full">
        {step === 2 && (
            <div className="flex justify-end mb-4">
                <Button variant="secondary" onClick={handleReset} size="sm">
                    Создать ещё
                </Button>
            </div>
        )}

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-y-auto">
          <div className="lg:col-span-2 space-y-6">
            <Card title="1. Входящие данные">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                             <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400">Источник контента</label>
                             {isUrl(topic) && <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded font-medium animate-pulse">🎥 Ссылка обнаружена. Включен режим Repurposing.</span>}
                        </div>
                        <textarea 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Опишите идею, новость ИЛИ вставьте ссылку на YouTube видео..." 
                            className="w-full h-24 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                        />
                         <p className="text-xs text-slate-400 mt-1">
                            Совет: Вставьте ссылку на ваше YouTube видео, чтобы система автоматически нарезала его на посты для всех соцсетей.
                        </p>
                    </div>
                    
                    {/* Campaign Selection */}
                    <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
                         <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Привязать к Кампании (Опционально)</label>
                         <select 
                            value={selectedCampaignId}
                            onChange={(e) => setSelectedCampaignId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                         >
                             <option value="">-- Без кампании --</option>
                             {campaigns.map(c => (
                                 <option key={c.id} value={c.id}>{c.name}</option>
                             ))}
                         </select>
                    </div>
                </div>
            </Card>

            <Card title="2. Настройки производства">
                <div className="space-y-6">
                     <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Тональность (Tone of Voice)</label>
                        <p className="text-xs text-slate-400 mb-2">Базовая тональность берется из настроек Бренда. Здесь можно уточнить настроение для конкретного поста.</p>
                        <div className="flex gap-2 flex-wrap">
                            {['Экспертный', 'Дружелюбный', 'Продающий', 'Дерзкий', 'Официальный'].map((t) => (
                                <button 
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${tone === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-400 dark:hover:border-zinc-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Целевые платформы</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.values(Platform).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => togglePlatform(p)}
                                    className={`flex items-center justify-center p-3 rounded-lg border transition-all ${selectedPlatforms.includes(p) ? 'bg-indigo-50 dark:bg-indigo-600/10 border-indigo-600 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-b from-slate-100 to-white dark:from-zinc-900 dark:to-zinc-950 border-slate-200 dark:border-zinc-800 relative overflow-hidden">
                 {/* Visual Processing Overlay */}
                 {isGenerating && (
                    <div className="absolute inset-0 bg-white/90 dark:bg-zinc-950/90 z-10 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
                         <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mb-4"></div>
                         <h3 className="text-slate-900 dark:text-white font-medium text-lg animate-pulse">{loadingState}</h3>
                         <p className="text-slate-500 dark:text-zinc-500 text-sm mt-2">
                             {isUrl(topic) ? 'Работает модуль Video-to-Text...' : 'ИИ анализирует контекст бренда...'}
                         </p>
                    </div>
                 )}

                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isUrl(topic) ? (
                            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {isUrl(topic) ? 'Запустить переработку видео?' : 'Запустить "Мозг"?'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">Стоимость: {isUrl(topic) ? '20' : '12'} токенов</p>
                    <Button 
                        size="lg" 
                        className="w-full" 
                        onClick={handleGenerate} 
                        isLoading={isGenerating}
                        disabled={!topic || selectedPlatforms.length === 0}
                    >
                        {isUrl(topic) ? 'Анализировать и создать' : 'Сгенерировать'}
                    </Button>
                </div>
            </Card>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-10">
          {results.map((item) => (
            <Card key={item.id} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-zinc-800 pb-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                        ${item.platform === Platform.TELEGRAM ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 
                          item.platform === Platform.VK ? 'bg-blue-100 dark:bg-blue-700/10 text-blue-700 dark:text-blue-300' :
                          item.platform === Platform.INSTAGRAM ? 'bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400' :
                          'bg-slate-100 dark:bg-zinc-500/10 text-slate-500 dark:text-zinc-400'}`}>
                        {item.platform}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/library')} className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-400 dark:text-zinc-500 transition-colors" title="Открыть в библиотеке">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </button>
                    </div>
                </div>
                <div className="flex-1 space-y-3">
                    {item.title && <h4 className="font-medium text-slate-900 dark:text-white">{item.title}</h4>}
                    <p className="text-sm text-slate-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">{item.body}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex gap-2">
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/library')}>В библиотеку</Button>
                </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const FullyAutomaticMode: React.FC = () => {
    const { autoPilotTasks, addAutoPilotTask, toggleAutoPilotTask, deleteAutoPilotTask, updateAutoPilotLastRun, addNotification, addToLibrary, deductCredits, brandProfile } = useAppStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newTask, setNewTask] = useState<Partial<AutoPilotTask>>({ 
        name: '', 
        topic: '', 
        interval: 'daily', 
        platforms: [],
        autoPublish: false 
    });
    const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);

    const handleCreate = () => {
        if (!newTask.name || !newTask.topic || !newTask.platforms?.length) {
            addNotification('error', 'Заполните все поля');
            return;
        }
        addAutoPilotTask({
            id: crypto.randomUUID(),
            name: newTask.name,
            topic: newTask.topic,
            interval: newTask.interval as 'daily'|'weekly',
            platforms: newTask.platforms,
            isActive: true,
            autoPublish: newTask.autoPublish || false,
            lastRun: undefined
        });
        setIsCreating(false);
        setNewTask({ name: '', topic: '', interval: 'daily', platforms: [], autoPublish: false });
        addNotification('success', 'Агент создан и запущен');
    };

    const togglePlatform = (p: Platform) => {
        setNewTask(prev => ({
            ...prev,
            platforms: prev.platforms?.includes(p) 
                ? prev.platforms.filter(x => x !== p) 
                : [...(prev.platforms || []), p]
        }));
    };

    const handleForceRun = async (task: AutoPilotTask) => {
        if (!deductCredits(10)) {
            addNotification('error', 'Недостаточно токенов для запуска');
            return;
        }

        setProcessingTaskId(task.id);
        addNotification('info', `Агент "${task.name}" начал работу...`);

        try {
            const data = await generateContentBatch({
                topic: task.topic,
                tone: 'Экспертный (Авто)',
                platforms: task.platforms,
                brandProfile: brandProfile
            });

            const status = task.autoPublish ? ContentStatus.SCHEDULED : ContentStatus.REVIEW;

            const enrichedData = data.map(d => ({
                ...d,
                status: status,
                generatedBy: 'autopilot' as const,
                title: `[Auto] ${d.title}`,
                scheduledAt: task.autoPublish ? new Date(Date.now() + 3600 * 1000).toISOString() : undefined 
            }));

            addToLibrary(enrichedData);
            updateAutoPilotLastRun(task.id, new Date().toISOString());
            addNotification('success', `Агент создал ${data.length} постов. Статус: ${status}`);

        } catch (e) {
            addNotification('error', 'Ошибка работы агента');
        } finally {
            setProcessingTaskId(null);
        }
    };

    const getPlatformIcon = (p: Platform) => {
        return (
            <div key={p} className={`w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold shadow-sm
                ${p === Platform.TELEGRAM ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' : 
                  p === Platform.VK ? 'bg-blue-50 text-blue-700 dark:bg-blue-800/50 dark:text-blue-200' :
                  p === Platform.YOUTUBE ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300' :
                  'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`} 
                title={p}
            >
                {p.charAt(0)}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
             {isCreating ? (
                 <div className="max-w-2xl mx-auto w-full overflow-y-auto pb-10">
                     <Card title="Настройка нового Агента">
                         <div className="space-y-6">
                             <div>
                                 <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">Название агента</label>
                                 <input type="text" value={newTask.name} onChange={e => setNewTask({...newTask, name: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-slate-900 dark:text-white" placeholder="Например: Утренний дайджест" />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">Задача / Тема / Источник</label>
                                 <textarea value={newTask.topic} onChange={e => setNewTask({...newTask, topic: e.target.value})} className="w-full h-20 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-slate-900 dark:text-white" placeholder="Опишите, что искать и о чем писать. Например: Мониторь новости про React 19 и пиши саммари." />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Куда публиковать?</label>
                                 <div className="flex flex-wrap gap-2">
                                     {Object.values(Platform).slice(0, 6).map(p => (
                                         <button key={p} onClick={() => togglePlatform(p)} className={`px-3 py-1 text-xs rounded-full border ${newTask.platforms?.includes(p) ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'border-slate-300 dark:border-zinc-700 text-slate-500'}`}>
                                             {p}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                             <div className="flex items-center gap-4 border-t border-slate-100 dark:border-zinc-800 pt-4">
                                 <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="checkbox" checked={newTask.autoPublish} onChange={e => setNewTask({...newTask, autoPublish: e.target.checked})} className="rounded bg-slate-200 dark:bg-zinc-800 text-indigo-600" />
                                     <span className="text-sm text-slate-700 dark:text-zinc-300">Полный автомат (Сразу в график)</span>
                                 </label>
                             </div>
                             <div className="flex justify-end gap-2">
                                 <Button variant="ghost" onClick={() => setIsCreating(false)}>Отмена</Button>
                                 <Button onClick={handleCreate}>Создать Агента</Button>
                             </div>
                         </div>
                     </Card>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
                     {/* Add New Card */}
                     <button onClick={() => setIsCreating(true)} className="flex flex-col items-center justify-center h-full min-h-[300px] rounded-xl border-2 border-dashed border-slate-300 dark:border-zinc-800 text-slate-400 dark:text-zinc-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors bg-slate-50 dark:bg-zinc-900/30 group">
                         <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                         </div>
                         <span className="font-medium text-lg">Создать Агента</span>
                         <span className="text-xs mt-2 opacity-70">Автоматический сбор и постинг</span>
                     </button>

                     {autoPilotTasks.map(task => (
                         <Card key={task.id} className={`relative group transition-all border-l-4 ${task.isActive ? 'border-l-green-500' : 'border-l-slate-300 dark:border-l-zinc-700'}`}>
                             <div className="flex justify-between items-start mb-3">
                                 <div>
                                     <h3 className="font-bold text-slate-900 dark:text-white text-lg">{task.name}</h3>
                                     <div className="flex items-center gap-2 mt-1">
                                         <span className={`w-2 h-2 rounded-full ${task.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300 dark:bg-zinc-600'}`}></span>
                                         <span className="text-xs text-slate-500 dark:text-zinc-500">{task.isActive ? 'Активен' : 'На паузе'} • {task.interval === 'daily' ? 'Ежедневно' : 'Еженедельно'}</span>
                                     </div>
                                 </div>
                                 <button 
                                    onClick={() => toggleAutoPilotTask(task.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${task.isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-zinc-700'}`}
                                 >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${task.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                 </button>
                             </div>

                             <div className="mb-4 bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-slate-100 dark:border-zinc-800/50">
                                 <p className="text-xs text-slate-400 dark:text-zinc-500 uppercase font-bold mb-1">Фокус / Тема</p>
                                 <p className="text-sm text-slate-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">{task.topic}</p>
                             </div>
                             
                             <div className="space-y-3 mb-4">
                                 <div className="flex items-center justify-between">
                                     <span className="text-xs text-slate-400 dark:text-zinc-500">Платформы</span>
                                     <div className="flex -space-x-1 pl-1">
                                         {task.platforms.map(p => getPlatformIcon(p))}
                                     </div>
                                 </div>
                                 <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-2">
                                      <span className="text-xs text-slate-400 dark:text-zinc-500">Последний запуск</span>
                                      <span className="text-xs font-mono text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                         {task.lastRun ? new Date(task.lastRun).toLocaleString('ru-RU', { day:'numeric', month:'numeric', hour:'2-digit', minute:'2-digit'}) : '—'}
                                      </span>
                                 </div>
                                 <div className="flex items-center justify-between">
                                     <span className="text-xs text-slate-400 dark:text-zinc-500">Режим публикации</span>
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${task.autoPublish ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                                         {task.autoPublish ? '🔥 Авто-постинг' : '🛡 Премодерация'}
                                      </span>
                                 </div>
                             </div>

                             <div className="flex gap-2 mt-auto pt-2">
                                 <Button 
                                    size="sm" 
                                    variant="primary" 
                                    className="flex-1"
                                    onClick={() => handleForceRun(task)}
                                    isLoading={processingTaskId === task.id}
                                 >
                                     <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                     Запустить сейчас
                                 </Button>
                                 <button 
                                    onClick={() => deleteAutoPilotTask(task.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors border border-slate-200 dark:border-zinc-700 rounded-lg hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/10"
                                    title="Удалить агента"
                                 >
                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </button>
                             </div>
                         </Card>
                     ))}
                 </div>
             )}
        </div>
    );
};

import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { ContentStatus, Platform } from '../types';
import { useNavigate } from 'react-router-dom';
import { analyzeVideoContent } from '../services/geminiService';

export const Research: React.FC = () => {
  const { addToLibrary, addNotification } = useAppStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'search' | 'video'>('search');
  const [query, setQuery] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!query) return;
    setIsSearching(true);
    setResults([]);

    setTimeout(() => {
        setIsSearching(false);
        setResults([
            { id: 1, title: 'Как использовать AI в маркетинге 2024', views: '250K', er: '4.5%', platform: 'YouTube', sentiment: 'Positive', summary: 'Обзор основных трендов...' },
            { id: 2, title: 'Топ 5 ошибок при запуске рекламы', views: '120K', er: '3.2%', platform: 'YouTube', sentiment: 'Neutral', summary: 'Разбор кейсов с бюджетом...' },
            { id: 3, title: 'Почему ваш контент не продает?', views: '85K', er: '5.1%', platform: 'YouTube', sentiment: 'Negative (Pain point)', summary: 'Психология продаж...' },
        ]);
    }, 2000);
  };

  const handleVideoAnalysis = async () => {
    if (!videoUrl) return;
    setIsSearching(true);
    try {
        const analysis = await analyzeVideoContent(videoUrl);
        setIsSearching(false);
        const ideaId = crypto.randomUUID();
        addToLibrary([{
            id: ideaId,
            title: `Idea from Video: ${analysis.title}`,
            body: `SUMMARY:\n${analysis.summary}\n\nHOOKS:\n${analysis.hooks.join('\n- ')}\n\nSOURCE:\n${videoUrl}`,
            platform: Platform.YOUTUBE, 
            status: ContentStatus.IDEA,
            createdAt: new Date().toISOString(),
            tags: ['#repurpose', '#video_analysis'],
            sourceUrl: videoUrl
        }]);
        addNotification('success', 'Видео проанализировано и сохранено как Идея!');
        navigate(`/editor/${ideaId}`);
    } catch (e) {
        setIsSearching(false);
        addNotification('error', 'Ошибка анализа видео');
    }
  };

  const createIdea = (result: any) => {
    addToLibrary([{
        id: crypto.randomUUID(),
        title: `Идея: ${result.title}`,
        body: `Референс: ${result.title}\nМетрики: ${result.views} просмотров, ER ${result.er}\n\nСделать свою версию с упором на наш кейс.`,
        platform: Platform.TELEGRAM,
        status: ContentStatus.IDEA,
        createdAt: new Date().toISOString(),
        tags: ['#idea', '#research', '#competitor']
    }]);
    addNotification('success', 'Идея добавлена в бэклог');
    navigate('/library');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Исследования и Переработка</h1>
        <p className="text-slate-500 dark:text-zinc-400">Находите тренды или перерабатывайте существующие видео в контент-план.</p>
      </div>

      <div className="flex space-x-4 mb-6 border-b border-slate-200 dark:border-zinc-800 pb-2">
          <button 
            onClick={() => setActiveTab('search')}
            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'search' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Поиск Трендов
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'video' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Анализ Видео (Repurposing)
          </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'search' ? (
          <div className="flex gap-4">
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введите тему или ссылку на канал конкурента..." 
                className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm dark:shadow-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
            />
            <Button onClick={handleSearch} isLoading={isSearching} size="lg">
                Анализировать
            </Button>
          </div>
      ) : (
          <div className="flex gap-4">
            <input 
                type="text" 
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Вставьте ссылку на YouTube видео..." 
                className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm dark:shadow-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
            />
            <Button onClick={handleVideoAnalysis} isLoading={isSearching} size="lg">
                Превратить в посты
            </Button>
          </div>
      )}

      {isSearching && (
          <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 dark:text-zinc-500">{activeTab === 'search' ? 'Сканируем соцсети...' : 'Смотрим видео, выписываем таймкоды...'}</p>
          </div>
      )}

      {/* Results List */}
      {!isSearching && results.length > 0 && activeTab === 'search' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {results.map((res) => (
                  <Card key={res.id} className="border-l-4 border-l-indigo-600">
                      <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-bold bg-red-100 dark:bg-red-600/10 text-red-600 dark:text-red-500 px-2 py-1 rounded">YouTube</span>
                          <span className="text-xs text-green-600 dark:text-green-400 font-mono">ER: {res.er}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{res.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">{res.summary}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800">
                          <span className="text-xs text-slate-400 dark:text-zinc-500">{res.views} просмотров</span>
                          <Button size="sm" variant="secondary" onClick={() => createIdea(res)}>
                              Создать идею
                          </Button>
                      </div>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
};
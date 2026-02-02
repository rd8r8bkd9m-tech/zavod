import React from 'react';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { ContentStatus } from '../types';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { credits, library, addCredits } = useAppStore();
  const navigate = useNavigate();

  // Derived Stats
  const totalPosts = library.length;
  const publishedPosts = library.filter(i => i.status === ContentStatus.PUBLISHED).length;
  const scheduledPosts = library.filter(i => i.status === ContentStatus.REVIEW).length;
  
  // Fake Engagement Logic based on published posts
  const baseER = 2.4;
  const engagement = (baseER + (publishedPosts * 0.1)).toFixed(1) + "%";

  const handleRefill = () => {
      addCredits(50);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Обзор рабочего пространства</h1>
        <p className="text-slate-500 dark:text-zinc-400">С возвращением, Алексей. Вот сводка за сегодня.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Опубликовано" value={publishedPosts.toString()} change={`из ${totalPosts}`} />
        <StatCard title="На проверке" value={scheduledPosts.toString()} change="Активно" />
        <StatCard title="Вовлеченность (ER)" value={engagement} change="+0.5%" />
        
        <Card>
            <div className="flex flex-col">
            <span className="text-slate-500 dark:text-zinc-500 text-sm font-medium">Баланс токенов</span>
            <div className="flex items-end justify-between mt-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{credits}</span>
                <button 
                    onClick={handleRefill}
                    className="text-xs font-medium px-2 py-1 rounded bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    +50 Бесплатно
                </button>
            </div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Активность публикаций (7 дней)" className="lg:col-span-2">
            <div className="h-48 flex items-end justify-between gap-2 mt-4 px-2">
                {[45, 60, 30, 85, 55, 40, 70].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                         <div 
                            className="w-full bg-indigo-100 dark:bg-indigo-600/20 rounded-t transition-all group-hover:bg-indigo-500 dark:group-hover:bg-indigo-600/50 relative"
                            style={{ height: `${h}%` }}
                         >
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                                 {Math.floor(h * 3.5)} просмотров
                             </div>
                         </div>
                         <span className="text-xs text-slate-400 dark:text-zinc-500">
                             {new Date(Date.now() - (6 - i) * 86400000).getDate()}
                         </span>
                    </div>
                ))}
            </div>
        </Card>

        <Card title="Быстрый старт">
            <div className="flex flex-col h-full justify-between">
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">Начните создание контента в один клик.</p>
                <div className="space-y-3">
                    <button 
                        onClick={() => navigate('/factory')}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left group bg-white dark:bg-zinc-900/50 shadow-sm dark:shadow-none"
                    >
                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </span>
                        <div>
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">Тред для Telegram</span>
                            <span className="block text-xs text-slate-500 dark:text-zinc-500">На основе темы</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => navigate('/factory')}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left group bg-white dark:bg-zinc-900/50 shadow-sm dark:shadow-none"
                    >
                        <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-500 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                        </span>
                        <div>
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">Статья на VC.ru</span>
                            <span className="block text-xs text-slate-500 dark:text-zinc-500">Из ссылки</span>
                        </div>
                    </button>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; change: string; isAction?: boolean }> = ({ title, value, change, isAction }) => (
  <Card>
    <div className="flex flex-col">
      <span className="text-slate-500 dark:text-zinc-500 text-sm font-medium">{title}</span>
      <div className="flex items-end justify-between mt-2">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${isAction ? 'bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700' : 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500'}`}>
          {change}
        </span>
      </div>
    </div>
  </Card>
);
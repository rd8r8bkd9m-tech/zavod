import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useAppStore } from '../store/useAppStore';
import { ContentStatus, Platform } from '../types';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { credits, library, addCredits, campaigns } = useAppStore();
  const navigate = useNavigate();

  // Derived Stats
  const totalPosts = library.length;
  const publishedPosts = library.filter(i => i.status === ContentStatus.PUBLISHED).length;
  const reviewPosts = library.filter(i => i.status === ContentStatus.REVIEW).length;
  const scheduledPosts = library.filter(i => i.status === ContentStatus.SCHEDULED).length;
  
  // Fake Engagement Logic based on published posts
  const baseER = 2.4;
  const engagement = parseFloat((baseER + (publishedPosts * 0.1)).toFixed(1));

  // Calculate progress
  const progressPercent = totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;

  const handleRefill = () => {
    addCredits(50);
  };

  // Recent activity mock data
  const recentActivity = [
    { id: 1, action: 'Опубликован', item: 'Пост в Telegram', time: '5 минут назад', icon: '📱', color: 'text-blue-500' },
    { id: 2, action: 'Сгенерирован', item: 'Статья для VC.ru', time: '23 минуты назад', icon: '✨', color: 'text-purple-500' },
    { id: 3, action: 'Утверждён', item: 'Тред для X', time: '1 час назад', icon: '✅', color: 'text-green-500' },
    { id: 4, action: 'Создана', item: 'Новая кампания', time: '2 часа назад', icon: '🎯', color: 'text-orange-500' },
  ];

  // Platform stats
  const platformStats = [
    { platform: 'Telegram', posts: 12, icon: '💬', growth: '+23%', color: 'from-blue-500 to-cyan-400' },
    { platform: 'VK', posts: 8, icon: '🔵', growth: '+15%', color: 'from-blue-600 to-blue-400' },
    { platform: 'Dzen', posts: 5, icon: '🟡', growth: '+8%', color: 'from-yellow-500 to-orange-400' },
    { platform: 'YouTube', posts: 3, icon: '🔴', growth: '+45%', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header with Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Добро пожаловать! 
            <span className="text-2xl md:text-3xl">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Вот обзор вашей контент-империи за сегодня.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/factory')}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Создать контент
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Published Stats */}
        <Card gradient="green" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Опубликовано</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter value={publishedPosts} />
                </span>
                <Badge variant="success">из {totalPosts}</Badge>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Review Stats */}
        <Card gradient="blue" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">На проверке</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter value={reviewPosts} />
                </span>
                <Badge variant="info" pulse={reviewPosts > 0}>активно</Badge>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/10">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Engagement Rate */}
        <Card gradient="purple" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Вовлечённость</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter value={engagement} decimals={1} suffix="%" />
                </span>
                <Badge variant="success">+0.5%</Badge>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-500/10">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Token Balance */}
        <Card gradient="orange" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">AI Токены</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter value={credits} />
                </span>
              </div>
            </div>
            <button 
              onClick={handleRefill}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all"
            >
              +50 🎁
            </button>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <Card title="Активность публикаций" className="lg:col-span-2" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        }>
          <div className="h-52 flex items-end justify-between gap-2 px-2 pb-2">
            {[45, 60, 30, 85, 55, 40, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative w-full flex flex-col justify-end h-44">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-pink-500 relative overflow-hidden"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-zinc-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg whitespace-nowrap z-10 font-medium">
                      {Math.floor(h * 3.5)} просмотров
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-zinc-800"></div>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">
                  {new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }).slice(0, 5)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Progress Ring Card */}
        <Card title="Прогресс публикаций" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        }>
          <div className="flex flex-col items-center justify-center h-52">
            <ProgressRing progress={progressPercent} size={120} strokeWidth={10}>
              <div className="text-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{progressPercent}%</span>
                <span className="block text-xs text-slate-500 dark:text-zinc-500 mt-0.5">готово</span>
              </div>
            </ProgressRing>
            <div className="mt-4 flex gap-4 text-center">
              <div>
                <span className="block text-lg font-bold text-slate-900 dark:text-white">{publishedPosts}</span>
                <span className="text-xs text-slate-500 dark:text-zinc-500">Опубликовано</span>
              </div>
              <div className="w-px bg-slate-200 dark:bg-zinc-800"></div>
              <div>
                <span className="block text-lg font-bold text-slate-900 dark:text-white">{totalPosts - publishedPosts}</span>
                <span className="text-xs text-slate-500 dark:text-zinc-500">В работе</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card title="Последняя активность" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    <span className={activity.color}>{activity.action}</span> {activity.item}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Performance */}
        <Card title="Производительность платформ" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }>
          <div className="space-y-3">
            {platformStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="text-xl">{stat.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{stat.platform}</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{stat.growth}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-700`}
                      style={{ width: `${(stat.posts / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{stat.posts}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Быстрые действия" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/factory')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-gradient-to-r hover:from-indigo-50 dark:hover:from-indigo-500/5 hover:to-transparent transition-all text-left group"
            >
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </span>
              <div>
                <span className="block text-sm font-medium text-slate-900 dark:text-white">Тред для Telegram</span>
                <span className="block text-xs text-slate-500 dark:text-zinc-500">Генерация на основе темы</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/factory')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-50 dark:hover:from-purple-500/5 hover:to-transparent transition-all text-left group"
            >
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              </span>
              <div>
                <span className="block text-sm font-medium text-slate-900 dark:text-white">Статья на VC.ru</span>
                <span className="block text-xs text-slate-500 dark:text-zinc-500">Из ссылки или видео</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/research')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-50 dark:hover:from-emerald-500/5 hover:to-transparent transition-all text-left group"
            >
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <div>
                <span className="block text-sm font-medium text-slate-900 dark:text-white">Найти тренды</span>
                <span className="block text-xs text-slate-500 dark:text-zinc-500">Исследование конкурентов</span>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <Card title="Активные кампании" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.slice(0, 3).map((campaign) => {
              const campaignPosts = library.filter(l => campaign.contentIds.includes(l.id));
              const published = campaignPosts.filter(p => p.status === ContentStatus.PUBLISHED).length;
              const progress = campaignPosts.length > 0 ? Math.round((published / campaignPosts.length) * 100) : 0;
              
              return (
                <div 
                  key={campaign.id}
                  onClick={() => navigate('/campaigns')}
                  className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all cursor-pointer group bg-gradient-to-br from-transparent to-slate-50/50 dark:to-zinc-800/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={campaign.status === 'active' ? 'success' : 'default'}>
                      {campaign.status === 'active' ? '🟢 Активна' : campaign.status}
                    </Badge>
                    <span className="text-xs text-slate-400">{new Date(campaign.startDate).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{campaign.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 line-clamp-2 mb-3">{campaign.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mr-3">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">{progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useAppStore } from '../store/useAppStore';

export const Analytics: React.FC = () => {
  const { library } = useAppStore();
  
  const data = [
    { date: '01.03', views: 1200, clicks: 45, cost: 10, revenue: 150 },
    { date: '02.03', views: 1500, clicks: 60, cost: 12, revenue: 200 },
    { date: '03.03', views: 900, clicks: 30, cost: 8, revenue: 90 },
    { date: '04.03', views: 2100, clicks: 95, cost: 15, revenue: 350 },
    { date: '05.03', views: 1800, clicks: 70, cost: 14, revenue: 280 },
    { date: '06.03', views: 2400, clicks: 110, cost: 18, revenue: 420 },
    { date: '07.03', views: 2800, clicks: 125, cost: 20, revenue: 500 },
  ];

  const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalViews = data.reduce((acc, curr) => acc + curr.views, 0);
  const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0);
  const romi = ((totalRevenue - totalCost) / totalCost) * 100;
  const ctr = ((totalClicks / totalViews) * 100).toFixed(2);
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  // Platform breakdown mock data
  const platformData = [
    { name: 'Telegram', views: 4500, clicks: 180, revenue: 890, color: 'from-blue-500 to-cyan-400', icon: '💬' },
    { name: 'VK', views: 3200, clicks: 145, revenue: 650, color: 'from-blue-600 to-blue-400', icon: '🔵' },
    { name: 'Dzen', views: 2100, clicks: 85, revenue: 380, color: 'from-yellow-500 to-orange-400', icon: '🟡' },
    { name: 'YouTube', views: 2900, clicks: 125, revenue: 480, color: 'from-red-500 to-pink-500', icon: '🔴' },
  ];

  const totalPlatformViews = platformData.reduce((acc, p) => acc + p.views, 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Аналитика Эффективности
            <Badge variant="gradient">Pro</Badge>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Отслеживайте ROI, охваты и вовлеченность ваших кампаний.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            7 дней
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25">
            30 дней
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            Выбрать
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card gradient="green" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">ROMI (ROI)</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  <AnimatedCounter value={romi} decimals={0} suffix="%" />
                </span>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">↑ Отличный результат</span>
            </div>
            <ProgressRing progress={Math.min(romi, 100)} size={50} strokeWidth={5} color="#10b981">
              <span className="text-xs font-bold text-emerald-600">✓</span>
            </ProgressRing>
          </div>
        </Card>

        <Card gradient="blue" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Охват (Views)</span>
              <div className="mt-2">
                <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter value={totalViews / 1000} decimals={1} suffix="K" />
                </span>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">+12% vs прошлая неделя</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/10">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card gradient="purple" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">CTR (Клики)</span>
              <div className="mt-2">
                <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  {ctr}%
                </span>
              </div>
              <span className="text-xs text-purple-600 dark:text-purple-400 mt-1">{totalClicks} переходов</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-500/10">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          </div>
        </Card>

        <Card gradient="orange" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Выручка</span>
              <div className="mt-2">
                <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  $<AnimatedCounter value={totalRevenue} />
                </span>
              </div>
              <span className="text-xs text-orange-600 dark:text-orange-400 mt-1">Затраты: ${totalCost}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-500/10">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Cost Chart */}
        <Card title="Динамика Выручки vs Расходов" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        }>
          <div className="h-64 flex items-end justify-between gap-3 px-2 pb-2">
            {data.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <div className="w-full flex gap-1 items-end justify-center flex-1">
                  {/* Revenue Bar */}
                  <div className="relative flex-1 flex justify-center">
                    <div 
                      style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} 
                      className="w-full max-w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:from-emerald-500 group-hover:to-emerald-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-emerald-600 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg font-medium z-10 whitespace-nowrap">
                      +${d.revenue}
                    </div>
                  </div>
                  {/* Cost Bar */}
                  <div className="relative flex-1 flex justify-center">
                    <div 
                      style={{ height: `${(d.cost / maxRevenue) * 100}%` }} 
                      className="w-full max-w-8 bg-gradient-to-t from-red-500/60 to-red-400/60 rounded-t-lg transition-all duration-500"
                    >
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-red-500 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg font-medium z-10 whitespace-nowrap">
                      -${d.cost}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">{d.date}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
              <span className="text-xs text-slate-500 dark:text-zinc-500">Выручка</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500/60 to-red-400/60"></div>
              <span className="text-xs text-slate-500 dark:text-zinc-500">Расходы</span>
            </div>
          </div>
        </Card>

        {/* Conversion Funnel */}
        <Card title="Воронка Конверсии" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        }>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700 dark:text-zinc-300 font-medium">👁 Просмотры</span>
                <span className="text-slate-900 dark:text-white font-bold">{(totalViews / 1000).toFixed(1)}K</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full w-full rounded-full transition-all duration-700 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700 dark:text-zinc-300 font-medium">🖱 Клики</span>
                <span className="text-slate-900 dark:text-white font-bold">{totalClicks} <span className="text-slate-400 font-normal">({ctr}%)</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-500 h-full rounded-full transition-all duration-700" style={{ width: '35%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700 dark:text-zinc-300 font-medium">📋 Лиды</span>
                <span className="text-slate-900 dark:text-white font-bold">145 <span className="text-slate-400 font-normal">(27%)</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full transition-all duration-700" style={{ width: '18%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700 dark:text-zinc-300 font-medium">💰 Продажи</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">42 <span className="text-slate-400 font-normal">(29%)</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all duration-700" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card title="Разбивка по платформам" icon={
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformData.map((platform, i) => (
            <div 
              key={i} 
              className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all group cursor-pointer bg-gradient-to-br from-transparent to-slate-50/50 dark:to-zinc-800/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-lg shadow-lg`}>
                  {platform.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{platform.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500">{((platform.views / totalPlatformViews) * 100).toFixed(0)}% охвата</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-zinc-500">Просмотры</span>
                  <span className="font-medium text-slate-900 dark:text-white">{(platform.views / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-zinc-500">Клики</span>
                  <span className="font-medium text-slate-900 dark:text-white">{platform.clicks}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-zinc-500">Выручка</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">${platform.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Content Performance */}
      <Card title="Топ контент по эффективности" icon={
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-zinc-500 text-xs uppercase">
                <th className="pb-3 font-semibold">#</th>
                <th className="pb-3 font-semibold">Контент</th>
                <th className="pb-3 font-semibold">Платформа</th>
                <th className="pb-3 font-semibold text-right">Просмотры</th>
                <th className="pb-3 font-semibold text-right">CTR</th>
                <th className="pb-3 font-semibold text-right">Выручка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {[
                { title: '10 способов повысить продуктивность', platform: '💬 Telegram', views: '2.4K', ctr: '5.2%', revenue: '$340' },
                { title: 'Как мы увеличили конверсию на 200%', platform: '📝 VC.ru', views: '1.8K', ctr: '4.8%', revenue: '$280' },
                { title: 'Секреты успешного маркетинга', platform: '🔵 VK', views: '1.5K', ctr: '3.9%', revenue: '$210' },
                { title: 'Полный гайд по AI-инструментам', platform: '🔴 YouTube', views: '1.2K', ctr: '6.1%', revenue: '$180' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                  <td className="py-3">
                    <Badge variant={i === 0 ? 'gradient' : i === 1 ? 'purple' : i === 2 ? 'info' : 'default'}>
                      #{i + 1}
                    </Badge>
                  </td>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{item.title}</td>
                  <td className="py-3 text-slate-600 dark:text-zinc-400">{item.platform}</td>
                  <td className="py-3 text-right font-medium">{item.views}</td>
                  <td className="py-3 text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{item.ctr}</span>
                  </td>
                  <td className="py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
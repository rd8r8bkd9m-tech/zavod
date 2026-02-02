import React from 'react';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';

export const Analytics: React.FC = () => {
  const data = [
      { date: '01.03', views: 1200, clicks: 45, cost: 10, revenue: 150 },
      { date: '02.03', views: 1500, clicks: 60, cost: 12, revenue: 200 },
      { date: '03.03', views: 900, clicks: 30, cost: 8, revenue: 90 },
      { date: '04.03', views: 2100, clicks: 95, cost: 15, revenue: 350 },
      { date: '05.03', views: 1800, clicks: 70, cost: 14, revenue: 280 },
  ];

  const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const romi = ((totalRevenue - totalCost) / totalCost) * 100;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Аналитика Эффективности</h1>
        <p className="text-slate-500 dark:text-zinc-400">Отслеживайте ROI, охваты и вовлеченность ваших кампаний.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
              <span className="text-slate-500 dark:text-zinc-500 text-sm">ROMI (ROI)</span>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{romi.toFixed(0)}%</div>
          </Card>
          <Card>
              <span className="text-slate-500 dark:text-zinc-500 text-sm">Охват (Views)</span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{(data.reduce((a,c) => a + c.views, 0) / 1000).toFixed(1)}K</div>
          </Card>
          <Card>
              <span className="text-slate-500 dark:text-zinc-500 text-sm">Клики (Traffic)</span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{data.reduce((a,c) => a + c.clicks, 0)}</div>
          </Card>
          <Card>
              <span className="text-slate-500 dark:text-zinc-500 text-sm">Выручка (Attrib.)</span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${totalRevenue}</div>
          </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Динамика Выручки vs Расходов">
              <div className="h-64 flex items-end justify-between gap-4 mt-4 px-2">
                  {data.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div className="w-full flex gap-1 items-end h-full justify-center">
                              <div style={{ height: `${(d.revenue / 400) * 100}%` }} className="w-4 bg-green-500/80 rounded-t transition-all hover:bg-green-500 relative group">
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 dark:bg-zinc-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md">${d.revenue}</div>
                              </div>
                              <div style={{ height: `${(d.cost / 400) * 100}%` }} className="w-4 bg-red-500/50 rounded-t transition-all hover:bg-red-500 relative group">
                                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 dark:bg-zinc-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md">-${d.cost}</div>
                              </div>
                          </div>
                          <span className="text-xs text-slate-400 dark:text-zinc-500">{d.date}</span>
                      </div>
                  ))}
              </div>
          </Card>

          <Card title="Воронка Конверсии (Охват -> Клики)">
               <div className="h-64 flex flex-col justify-center space-y-4 px-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400"><span>Просмотры</span><span>7,500</span></div>
                        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden"><div className="bg-blue-600 h-full w-full"></div></div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400"><span>Клики</span><span>300 (4%)</span></div>
                        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden"><div className="bg-blue-500 h-full w-[40%]"></div></div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400"><span>Лиды</span><span>45 (15%)</span></div>
                        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden"><div className="bg-blue-400 h-full w-[15%]"></div></div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400"><span>Продажи</span><span>12 (26%)</span></div>
                        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden"><div className="bg-green-500 h-full w-[8%]"></div></div>
                    </div>
               </div>
          </Card>
      </div>
    </div>
  );
};
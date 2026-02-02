import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { ContentStatus, Platform } from '../types';
import { useNavigate } from 'react-router-dom';

export const Calendar: React.FC = () => {
  const { library } = useAppStore();
  const navigate = useNavigate();
  
  // Simple Mock Calendar Logic for current month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // 0 is Sunday
  
  // Adjust for Monday start
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const empties = Array.from({ length: startOffset }, (_, i) => i);

  const getPostsForDay = (day: number) => {
    return library.filter(item => {
        const itemDate = item.scheduledAt ? new Date(item.scheduledAt) : new Date(item.createdAt);
        return itemDate.getDate() === day && 
               itemDate.getMonth() === today.getMonth() &&
               (item.status === ContentStatus.SCHEDULED || item.status === ContentStatus.PUBLISHED);
    });
  };

  const monthName = today.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{monthName}</h1>
        <div className="flex gap-2">
            <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Опубликовано
            </span>
            <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Запланировано
            </span>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                <div key={d} className="p-3 text-center text-sm font-medium text-slate-500 dark:text-zinc-500">
                    {d}
                </div>
            ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-white dark:bg-zinc-900">
            {empties.map(e => (
                <div key={`empty-${e}`} className="border-b border-r border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-950/30"></div>
            ))}
            
            {days.map(day => {
                const posts = getPostsForDay(day);
                const isToday = day === today.getDate();

                return (
                    <div key={day} className={`border-b border-r border-slate-100 dark:border-zinc-800/50 p-2 min-h-[100px] relative group hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}`}>
                        <span className={`text-sm font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full' : 'text-slate-500 dark:text-zinc-500'}`}>
                            {day}
                        </span>
                        
                        <div className="mt-2 space-y-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                            {posts.map(post => (
                                <div 
                                    key={post.id}
                                    onClick={() => navigate(`/editor/${post.id}`)}
                                    className={`text-[10px] px-1.5 py-1 rounded truncate cursor-pointer transition-opacity hover:opacity-80
                                        ${post.status === ContentStatus.PUBLISHED ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'}
                                    `}
                                >
                                    {post.platform}: {post.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};
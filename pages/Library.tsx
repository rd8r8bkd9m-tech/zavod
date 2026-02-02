import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Platform, ContentStatus } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const Library: React.FC = () => {
  const { library, removeContent, addNotification } = useAppStore();
  const [filterPlatform, setFilterPlatform] = useState<string>('Все платформы');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredItems = library.filter(item => {
    const matchesPlatform = filterPlatform === 'Все платформы' || item.platform === filterPlatform;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.body.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click
    if(confirm('Вы уверены, что хотите удалить этот материал?')) {
        removeContent(id);
        addNotification('info', 'Материал удален');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Библиотека контента</h1>
        <div className="flex gap-2">
             <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск..." 
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder:text-slate-400 dark:placeholder:text-zinc-600 shadow-sm dark:shadow-none"
            />
            <select 
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm dark:shadow-none"
            >
                <option>Все платформы</option>
                {Object.values(Platform).map(p => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm dark:shadow-none">
        <table className="w-full text-left text-sm text-slate-500 dark:text-zinc-400">
          <thead className="bg-slate-50 dark:bg-zinc-900/50 text-slate-700 dark:text-zinc-500 uppercase font-medium border-b border-slate-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4">Заголовок</th>
              <th className="px-6 py-4">Платформа</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {filteredItems.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                onClick={() => navigate(`/editor/${item.id}`)}
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-xs truncate" title={item.title || item.body}>
                    {item.title || '(Без заголовка)'}
                </td>
                <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                        {item.platform}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${item.status === ContentStatus.PUBLISHED ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500' :
                          item.status === ContentStatus.REVIEW ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-500' :
                          item.status === ContentStatus.APPROVED ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500' :
                          'bg-slate-100 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-500'}`}>
                        {item.status}
                    </span>
                </td>
                <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                    <button 
                        onClick={(e) => handleDelete(e, item.id)}
                        className="text-slate-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <span className="ml-2 text-indigo-600 dark:text-indigo-500 text-xs opacity-0 group-hover:opacity-100 font-medium">Ред.</span>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-zinc-500">
                        Ничего не найдено. Попробуйте изменить фильтры или создать новый контент.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
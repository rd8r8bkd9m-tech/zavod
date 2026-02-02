import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Platform, ContentStatus } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const Library: React.FC = () => {
  const { library, removeContent, addNotification } = useAppStore();
  const [filterPlatform, setFilterPlatform] = useState<string>('Все платформы');
  const [filterStatus, setFilterStatus] = useState<string>('Все статусы');
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  const filteredItems = library.filter(item => {
    const matchesPlatform = filterPlatform === 'Все платформы' || item.platform === filterPlatform;
    const matchesStatus = filterStatus === 'Все статусы' || item.status === filterStatus;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.body.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch && matchesStatus;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm('Вы уверены, что хотите удалить этот материал?')) {
      removeContent(id);
      addNotification('info', 'Материал удален');
    }
  };

  const toggleSelectItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if(confirm(`Удалить ${selectedItems.length} материалов?`)) {
      selectedItems.forEach(id => removeContent(id));
      setSelectedItems([]);
      addNotification('info', `Удалено ${selectedItems.length} материалов`);
    }
  };

  const getStatusBadge = (status: ContentStatus) => {
    const variants: Record<ContentStatus, 'success' | 'info' | 'warning' | 'default' | 'purple'> = {
      [ContentStatus.PUBLISHED]: 'success',
      [ContentStatus.REVIEW]: 'info',
      [ContentStatus.APPROVED]: 'warning',
      [ContentStatus.SCHEDULED]: 'purple',
      [ContentStatus.DRAFT]: 'default',
      [ContentStatus.IDEA]: 'default'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getPlatformIcon = (platform: Platform) => {
    const icons: Record<string, string> = {
      [Platform.TELEGRAM]: '💬',
      [Platform.VK]: '🔵',
      [Platform.DZEN]: '🟡',
      [Platform.YOUTUBE]: '🔴',
      [Platform.RUTUBE]: '🟣',
      [Platform.INSTAGRAM]: '📸',
      [Platform.TWITTER]: '𝕏',
      [Platform.FACEBOOK]: '📘',
      [Platform.TENCHAT]: '💼',
      [Platform.VC]: '📝',
      [Platform.WORDPRESS]: '🌐',
      [Platform.OK]: '🟠',
      [Platform.LINKEDIN]: '💼',
    };
    return icons[platform] || '📄';
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Библиотека контента
            <Badge variant="purple">{library.length} материалов</Badge>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Управляйте всем вашим контентом в одном месте.</p>
        </div>
        <Button variant="gradient" onClick={() => navigate('/factory')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать новый
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по заголовку или тексту..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-zinc-600 transition-all"
            />
          </div>
          
          {/* Platform Filter */}
          <select 
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[160px]"
          >
            <option>Все платформы</option>
            {Object.values(Platform).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[160px]"
          >
            <option>Все статусы</option>
            {Object.values(ContentStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl flex items-center justify-between animate-slide-in-up">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Выбрано: {selectedItems.length}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedItems([])}>
                Отменить
              </Button>
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                Удалить выбранные
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Content Grid/Table */}
      <div className="bg-white dark:bg-zinc-900/80 rounded-2xl border border-slate-200 dark:border-zinc-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-zinc-900/50 text-slate-600 dark:text-zinc-400 uppercase text-xs font-semibold border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-zinc-900"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={(e) => setSelectedItems(e.target.checked ? filteredItems.map(i => i.id) : [])}
                  />
                </th>
                <th className="px-6 py-4">Контент</th>
                <th className="px-6 py-4">Платформа</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4">Дата</th>
                <th className="px-6 py-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/editor/${item.id}`)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-zinc-900"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.stopPropagation();
                        setSelectedItems(prev => 
                          prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                        );
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/10 dark:to-purple-500/10 flex items-center justify-center text-lg shrink-0">
                        {getPlatformIcon(item.platform)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate max-w-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.title || '(Без заголовка)'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 truncate max-w-xs mt-0.5">
                          {item.body.slice(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 text-sm">
                      {item.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-500">
                    {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/editor/${item.id}`); }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Редактировать"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Удалить"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-slate-900 dark:text-white font-medium mb-1">Ничего не найдено</p>
                      <p className="text-slate-500 dark:text-zinc-500 text-sm">Попробуйте изменить фильтры или создайте новый контент.</p>
                      <Button variant="primary" className="mt-4" onClick={() => navigate('/factory')}>
                        Создать контент
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-zinc-500">
        <span>Всего: <strong className="text-slate-900 dark:text-white">{library.length}</strong></span>
        <span>•</span>
        <span>Опубликовано: <strong className="text-emerald-600">{library.filter(i => i.status === ContentStatus.PUBLISHED).length}</strong></span>
        <span>•</span>
        <span>На проверке: <strong className="text-blue-600">{library.filter(i => i.status === ContentStatus.REVIEW).length}</strong></span>
        <span>•</span>
        <span>Черновики: <strong className="text-slate-600 dark:text-zinc-400">{library.filter(i => i.status === ContentStatus.DRAFT).length}</strong></span>
      </div>
    </div>
  );
};
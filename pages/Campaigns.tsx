
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { Campaign, ContentStatus } from '../types';
import { useNavigate } from 'react-router-dom';

export const Campaigns: React.FC = () => {
  const { campaigns, addCampaign, library, deleteCampaign } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({ name: '', description: '', status: 'active' });
  const navigate = useNavigate();

  const handleCreate = () => {
    if(!newCampaign.name) return;
    
    addCampaign({
        id: crypto.randomUUID(),
        name: newCampaign.name,
        description: newCampaign.description || '',
        status: 'active',
        startDate: new Date().toISOString(),
        contentIds: []
    });
    setIsCreating(false);
    setNewCampaign({ name: '', description: '', status: 'active' });
  };

  const getCampaignProgress = (c: Campaign) => {
      const posts = library.filter(l => c.contentIds.includes(l.id));
      const total = posts.length;
      if (total === 0) return 0;
      const published = posts.filter(p => p.status === ContentStatus.PUBLISHED).length;
      return Math.round((published / total) * 100);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
       <div className="flex items-center justify-between">
            <div>
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Кампании</h1>
                 <p className="text-slate-500 dark:text-zinc-400">Группируйте контент по маркетинговым целям.</p>
            </div>
            <Button onClick={() => setIsCreating(true)}>+ Новая кампания</Button>
       </div>

       {isCreating && (
           <Card className="animate-in fade-in slide-in-from-top-4">
               <div className="space-y-4 max-w-lg">
                   <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Название кампании</label>
                       <input type="text" value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-slate-900 dark:text-white" placeholder="Летняя распродажа" />
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Описание</label>
                       <textarea value={newCampaign.description} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-2 text-slate-900 dark:text-white h-20" placeholder="Цель: увеличить продажи на 20%..." />
                   </div>
                   <div className="flex gap-2 justify-end">
                       <Button variant="secondary" onClick={() => setIsCreating(false)}>Отмена</Button>
                       <Button onClick={handleCreate}>Создать</Button>
                   </div>
               </div>
           </Card>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {campaigns.map(c => {
               const progress = getCampaignProgress(c);
               const postCount = library.filter(l => c.contentIds.includes(l.id)).length;
               
               return (
                   <Card key={c.id} className="hover:border-indigo-500 transition-colors cursor-pointer group relative">
                       <div onClick={() => navigate('/library')}> 
                           <div className="flex justify-between items-start mb-2">
                               <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${c.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                                   {c.status}
                               </span>
                               <span className="text-xs text-slate-400">
                                   {new Date(c.startDate).toLocaleDateString()}
                               </span>
                           </div>
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{c.name}</h3>
                           <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 mb-4 h-10">{c.description}</p>
                           
                           <div className="space-y-2">
                               <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-500">
                                   <span>Прогресс</span>
                                   <span>{progress}%</span>
                               </div>
                               <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                   <div style={{ width: `${progress}%` }} className="h-full bg-indigo-600 transition-all"></div>
                               </div>
                               <div className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
                                   {postCount} материалов
                               </div>
                           </div>
                       </div>
                       
                       <button 
                            onClick={(e) => { e.stopPropagation(); deleteCampaign(c.id); }}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                   </Card>
               );
           })}
           
           {campaigns.length === 0 && (
               <div className="col-span-full text-center py-12 text-slate-500">
                   Нет активных кампаний. Создайте первую!
               </div>
           )}
       </div>
    </div>
  );
};

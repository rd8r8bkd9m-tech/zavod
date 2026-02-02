
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Toaster } from './components/ui/Toaster';
import { Dashboard } from './pages/Dashboard';
import { Factory } from './pages/Factory';
import { Library } from './pages/Library';
import { Editor } from './pages/Editor';
import { Settings } from './pages/Settings';
import { Calendar } from './pages/Calendar';
import { Research } from './pages/Research';
import { Analytics } from './pages/Analytics';
import { Campaigns } from './pages/Campaigns';
import { useAppStore } from './store/useAppStore';

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="flex h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-200 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
          <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
          
          <main className="flex-1 overflow-auto relative">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20">
              <span className="font-bold text-lg text-slate-900 dark:text-white">Контент-Завод</span>
              <button 
                  className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/research" element={<Research />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/factory" element={<Factory />} />
              <Route path="/library" element={<Library />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/editor/:id" element={<Editor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <Toaster />
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

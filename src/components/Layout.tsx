import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Home, FileText, Plus, Search, Map, Folder, Image, BarChart3, 
  Bell, Settings, Menu, X, Globe
} from 'lucide-react';
import { Language } from '@/lib/i18n';
import { getTranslation } from '@/lib/i18n';

interface LayoutProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ language, onLanguageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: getTranslation(language, 'home') },
    { path: '/cases', icon: FileText, label: getTranslation(language, 'cases') },
    { path: '/complaint/new', icon: Plus, label: getTranslation(language, 'newComplaint') },
    { path: '/search', icon: Search, label: getTranslation(language, 'search') },
    { path: '/gis-map', icon: Map, label: getTranslation(language, 'gisMap') },
    { path: '/documents', icon: Folder, label: getTranslation(language, 'documents') },
    { path: '/gallery', icon: Image, label: getTranslation(language, 'gallery') },
    { path: '/reports', icon: BarChart3, label: getTranslation(language, 'reports') },
    { path: '/statistics', icon: BarChart3, label: getTranslation(language, 'statistics') },
    { path: '/notifications', icon: Bell, label: getTranslation(language, 'notifications') },
    { path: '/admin', icon: Settings, label: getTranslation(language, 'administration') },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={cn(
        'bg-card border-r border-border transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className={cn('font-bold text-lg', !sidebarOpen && 'hidden')}>
            LDR System
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Icon className="w-4 h-4" />
                  {sidebarOpen && <span className="ml-2">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Land Dispute Resolution System</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLanguageChange(language === 'en' ? 'am' : 'en')}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'ዓ.ም' : 'EN'}
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet context={{ language }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;

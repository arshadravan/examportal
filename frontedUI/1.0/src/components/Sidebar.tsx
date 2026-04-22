import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  HelpCircle, 
  BarChart3, 
  Settings,
  LogOut,
  Layers,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { View } from '@/types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  role: 'admin' | 'student';
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, role, userName, isOpen, onClose }) => {
  const adminLinks = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'exams', label: 'Exams', icon: FileText },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
    { id: 'embed-generator', label: 'Embed Code', icon: Code },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const studentLinks = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'results', label: 'My Results', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-surface-container-low flex flex-col py-8 z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-8 mb-12 flex items-center justify-between">
          <h1 className="font-headline text-2xl font-extrabold text-primary tracking-tight">
            ExamIntel
          </h1>
        </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentView === link.id;
          
          return (
            <button
              key={link.id}
              onClick={() => onViewChange(link.id as View)}
              className={cn(
                "w-full flex items-center px-8 py-3 transition-all duration-200 group relative",
                isActive 
                  ? "text-primary font-bold" 
                  : "text-secondary hover:text-on-surface hover:bg-white/50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
              <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-secondary group-hover:text-on-surface")} />
              <span className="font-headline font-semibold tracking-tight">
                {link.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-4 bg-surface-container-lowest rounded-xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
            <img 
              src={role === 'admin' 
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBfsDAdJZkKnNkYZDDFfKnezqEHLpk4RSe1kCFY98JZqi-83cG9hSG_es2kq7BlftVefYrZm0GTaXPL4HBHSYt2T7aMhaeWQtygbKP5_pHVTFEo14eBne3NuJ7MEd5P_KtUJtDCTFX5oPBm_1hA9clx2m_gexm-VpNZ5BCoPW90hwhrRoD_9xHi90X1PV24iCCwtKjIIOjwSnb3pN79nOHYM9EzZDPzl1kCoOYGv01P7bbMnfGKxZA1Tc4M2866Ts19QZMBUaa5kmOx"
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuDnLJGR9HWBJ81CmYWb-IbBOJHpjs8dFVExtd92qeMpgTTl1jQBTNERCM7icbPHqW2LOLq5MHypqs1SbTk4GJmEyQ7-AumZujTxlVZojBBguriThz_Tgq3QZ1qICgwlwLwRrvCUcyJK1UpAWdJGejmMD-7H50Chbc3x6gqob3jxxz4OOpSbfwMmqZzwk9gGzV60q5Ugwtu4LpOknXqEDLKc8ypmhZ5qddZaOPBg8Vg83fpTvgouEX5hliEN8G6kLLj54OUkIre-Qop0"
              } 
              alt="User" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate">
              {userName || (role === 'admin' ? 'Alex Thompson' : 'Johnathan Doe')}
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              {role === 'admin' ? 'Administrator' : 'Student'}
            </span>
          </div>
          <button 
            onClick={() => onViewChange('login')}
            className="ml-auto text-secondary hover:text-error transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  </>
);
};

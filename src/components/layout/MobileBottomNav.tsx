import React from 'react';
import { Home, GraduationCap, Users, FlaskConical, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppPage } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, navigate } = useApp();

  const items: { id: AppPage; label: string; icon: React.FC<{ className?: string }>; match?: AppPage[] }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'academy', label: 'Courses', icon: GraduationCap, match: ['course-detail', 'lesson-reader'] },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'labs', label: 'Labs', icon: FlaskConical, match: ['lab-detail'] },
    { id: 'profile', label: 'Profile', icon: User, match: ['settings'] },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0A1224]/95 backdrop-blur-md border-t border-[rgba(120,150,210,0.18)] pb-safe"
    >
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id || item.match?.includes(currentPage);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${
                active ? 'text-[#08D9E8]' : 'text-[#A5B1C8]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

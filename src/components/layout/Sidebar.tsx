import React from 'react';
import {
  Home,
  Users,
  GraduationCap,
  Terminal,
  FlaskConical,
  Wrench,
  HelpCircle,
  Award,
  Gift,
  Crown,
  User,
  Settings,
  LifeBuoy,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppPage } from '../../types';
import { CyberLogo } from '../ui/Primitives';
import { t } from '../../data/i18n';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentPage, navigate, language, user } = useApp();

  const mainNav: { id: AppPage; label: string; icon: React.FC<{ className?: string }>; match?: AppPage[] }[] = [
    { id: 'dashboard', label: t(language, 'navHome'), icon: Home },
    { id: 'community', label: t(language, 'navCommunity'), icon: Users },
    { id: 'academy', label: t(language, 'navAcademy'), icon: GraduationCap, match: ['course-detail', 'lesson-reader'] },
    { id: 'terminal', label: t(language, 'navTerminal'), icon: Terminal },
    { id: 'labs', label: t(language, 'navLabs'), icon: FlaskConical, match: ['lab-detail'] },
    { id: 'tools', label: t(language, 'navTools'), icon: Wrench, match: ['tool-detail'] },
    { id: 'quizzes', label: t(language, 'navQuizzes'), icon: HelpCircle },
    { id: 'certificates', label: t(language, 'navCertificates'), icon: Award },
    { id: 'referral', label: t(language, 'navReferral'), icon: Gift },
    { id: 'pricing', label: t(language, 'navPremium'), icon: Crown },
  ];

  const accountNav: { id: AppPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'profile', label: t(language, 'navProfile'), icon: User },
    { id: 'settings', label: t(language, 'navSettings'), icon: Settings },
    { id: 'help', label: t(language, 'navHelp'), icon: LifeBuoy },
    ...(user.isAdmin ? [{ id: 'admin' as AppPage, label: t(language, 'navAdmin'), icon: ShieldCheck }] : []),
  ];

  const handleNav = (id: AppPage) => {
    navigate(id);
    onCloseMobile();
  };

  const renderContent = () => (
    <div className="flex flex-col h-full bg-[#0A1224] border-r border-[rgba(120,150,210,0.18)] w-64 select-none">
      {/* Brand header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[rgba(120,150,210,0.12)]">
        <button
          onClick={() => handleNav('dashboard')}
          className="text-left focus:outline-none"
        >
          <CyberLogo />
        </button>
        <button
          onClick={onCloseMobile}
          aria-label="Close navigation drawer"
          className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#14213B]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation scroll area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <nav aria-label="Main navigation" className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id || item.match?.includes(currentPage);
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[42px] ${
                  active
                    ? 'bg-gradient-to-r from-[#713BFF] to-[#1677FF] text-white shadow-md shadow-[#713BFF]/20'
                    : 'text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#101A30]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#A5B1C8]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-3 border-t border-[rgba(120,150,210,0.14)]">
          <div className="px-3.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#A5B1C8]/60">
            Account
          </div>
          <nav aria-label="Account navigation" className="space-y-1">
            {accountNav.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[42px] ${
                    active
                      ? 'bg-[#14213B] text-[#F5F7FF] border border-[rgba(120,150,210,0.28)]'
                      : 'text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#101A30]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Upgrade Card + Copyright */}
      <div className="p-3.5 border-t border-[rgba(120,150,210,0.14)] space-y-3">
        <div className="rounded-2xl p-4 bg-gradient-to-b from-[#14213B] to-[#101A30] border border-[rgba(120,150,210,0.22)] text-center">
          <div className="w-9 h-9 rounded-xl bg-[#FF9F43]/15 text-[#FF9F43] flex items-center justify-center mx-auto mb-2">
            <Crown className="w-5 h-5" />
          </div>
          <div className="text-sm font-semibold text-[#F5F7FF]">
            {user.membership === 'Premium' ? 'Premium Active' : t(language, 'upgradeToPremium')}
          </div>
          <p className="text-xs text-[#A5B1C8] mt-0.5">
            {user.membership === 'Premium' ? 'Full Academy, Labs & Tools unlocked' : 'Unlock full access!'}
          </p>
          <div className="text-base font-bold text-[#12D69A] mt-2 tabular-nums">$10 / Year</div>
          <button
            onClick={() => handleNav('pricing')}
            className="mt-3 w-full py-2 px-3 rounded-xl cyber-gradient-btn text-white text-xs font-semibold min-h-[38px]"
          >
            {user.membership === 'Premium' ? 'Manage Plan' : 'Upgrade'}
          </button>
        </div>
        <div className="text-[11px] text-[#A5B1C8]/60 text-center">
          © 2026 CyberHub
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64">
        {renderContent()}
      </aside>

      {/* Tablet / Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#050B18]/75 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{renderContent()}</div>
        </div>
      )}
    </>
  );
};

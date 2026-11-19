/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { PublicHeader, PublicFooter } from './components/layout/PublicLayout';
import { AIAssistantDrawer } from './components/layout/AIAssistantDrawer';
import { LandingPage } from './components/public/LandingPage';
import { AuthPages } from './components/public/AuthPages';
import { PublicInfoPages } from './components/public/PublicInfoPages';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { CommunityView } from './components/community/CommunityView';
import { AcademyView } from './components/academy/AcademyView';
import { LessonReaderView } from './components/academy/LessonReaderView';
import { TerminalView } from './components/terminal/TerminalView';
import { ToolsLibraryView } from './components/tools/ToolsLibraryView';
import { CyberLabsView } from './components/labs/CyberLabsView';
import { QuizzesView } from './components/quizzes/QuizzesView';
import { CertificatesView } from './components/certificates/CertificatesView';
import { ReferralView } from './components/referral/ReferralView';
import { PricingView } from './components/pricing/PricingView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/profile/SettingsView';
import { SearchView } from './components/search/SearchView';
import { AdminView } from './components/admin/AdminView';

const CyberHubShell: React.FC = () => {
  const { currentPage, isAuthenticated } = useApp();
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

  const isAuthPage = currentPage.startsWith('auth-');
  const isPublicLandingOrInfo =
    currentPage === 'landing' ||
    ((currentPage === 'about' || currentPage === 'contact' || currentPage === 'docs') && !isAuthenticated);

  const renderPageContent = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth-login':
      case 'auth-signup':
      case 'auth-forgot':
      case 'auth-reset':
      case 'auth-verify':
      case 'auth-onboarding':
        return <AuthPages />;
      case 'about':
      case 'contact':
      case 'docs':
      case 'help':
        return <PublicInfoPages />;
      case 'dashboard':
        return <DashboardHome />;
      case 'community':
        return <CommunityView />;
      case 'academy':
      case 'course-detail':
        return <AcademyView />;
      case 'lesson-reader':
        return <LessonReaderView />;
      case 'terminal':
        return <TerminalView />;
      case 'tools':
      case 'tool-detail':
        return <ToolsLibraryView />;
      case 'labs':
      case 'lab-detail':
        return <CyberLabsView />;
      case 'quizzes':
        return <QuizzesView />;
      case 'certificates':
        return <CertificatesView />;
      case 'referral':
        return <ReferralView />;
      case 'pricing':
        return <PricingView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'search':
        return <SearchView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardHome />;
    }
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#050B18] text-[#F5F7FF]">
        <PublicHeader />
        {renderPageContent()}
      </div>
    );
  }

  if (isPublicLandingOrInfo || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050B18] text-[#F5F7FF] flex flex-col">
        <PublicHeader />
        <main className="flex-1">{renderPageContent()}</main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B18] text-[#F5F7FF]">
      <Sidebar mobileOpen={sidebarDrawerOpen} onCloseMobile={() => setSidebarDrawerOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        <TopBar onOpenSidebar={() => setSidebarDrawerOpen(true)} />
        <main className="flex-1 w-full px-2 sm:px-3 lg:px-4 py-3 sm:py-4 pb-24 md:pb-6">
          {renderPageContent()}
        </main>
      </div>

      <MobileBottomNav />
      <AIAssistantDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <CyberHubShell />
    </AppProvider>
  );
}

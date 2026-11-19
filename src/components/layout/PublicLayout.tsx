import React, { useState } from 'react';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CyberLogo } from '../ui/Primitives';
import { AppPage } from '../../types';

export const PublicHeader: React.FC = () => {
  const { navigate, isAuthenticated, language, setLanguage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: AppPage; scrollId?: string }[] = [
    { label: 'Home', page: 'landing' },
    { label: 'Community', page: 'community' },
    { label: 'Academy', page: 'academy' },
    { label: 'Cyber Labs', page: 'labs' },
    { label: 'Tools', page: 'tools' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'About', page: 'about' },
  ];

  const handleLink = (link: { page: AppPage }) => {
    setMobileMenuOpen(false);
    navigate(link.page);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050B18]/90 backdrop-blur-md border-b border-[rgba(120,150,210,0.16)]">
      <div className="w-full px-3 sm:px-5 h-16 flex items-center justify-between gap-4">
        <button onClick={() => navigate('landing')} className="focus:outline-none">
          <CyberLogo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLink(item)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#101A30] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={() => setLanguage(language === 'en' ? 'so' : 'en')}
            className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-xs font-semibold text-[#A5B1C8] hover:text-[#F5F7FF]"
          >
            <Globe className="w-3.5 h-3.5 text-[#08D9E8]" />
            {language.toUpperCase()}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => navigate('dashboard')}
              className="px-4 h-10 rounded-xl cyber-gradient-btn text-white text-sm font-semibold flex items-center gap-1.5"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('auth-login')}
                className="px-4 h-10 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.2)] text-sm font-medium text-[#F5F7FF] hover:bg-[#14213B]"
              >
                Login
              </button>
              <button
                onClick={() => navigate('auth-signup')}
                className="px-4 h-10 rounded-xl cyber-gradient-btn text-white text-sm font-semibold"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle public navigation"
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#101A30]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1224] border-t border-[rgba(120,150,210,0.16)] px-4 py-4 space-y-2">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLink(item)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#101A30]"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[rgba(120,150,210,0.14)] flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('dashboard');
                }}
                className="w-full py-2.5 rounded-xl cyber-gradient-btn text-white text-sm font-semibold"
              >
                Open Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('auth-login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.2)] text-sm font-medium text-[#F5F7FF]"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('auth-signup');
                  }}
                  className="w-full py-2.5 rounded-xl cyber-gradient-btn text-white text-sm font-semibold"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const PublicFooter: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-[#0A1224] border-t border-[rgba(120,150,210,0.16)] mt-12">
      <div className="w-full px-3 sm:px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <CyberLogo />
            <p className="text-xs text-[#A5B1C8] leading-relaxed">
              Global cybersecurity community & AI-powered learning platform. Practice safely inside simulated labs and build verified security skills.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F7FF] mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-[#A5B1C8]">
              <li><button onClick={() => navigate('academy')} className="hover:text-[#08D9E8]">AI Academy</button></li>
              <li><button onClick={() => navigate('labs')} className="hover:text-[#08D9E8]">Cyber Labs</button></li>
              <li><button onClick={() => navigate('tools')} className="hover:text-[#08D9E8]">Pentest Tools</button></li>
              <li><button onClick={() => navigate('pricing')} className="hover:text-[#08D9E8]">Pricing ($10/Year)</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F7FF] mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-[#A5B1C8]">
              <li><button onClick={() => navigate('docs')} className="hover:text-[#08D9E8]">Documentation</button></li>
              <li><button onClick={() => navigate('help')} className="hover:text-[#08D9E8]">Help Center</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-[#08D9E8]">About CyberHub</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-[#08D9E8]">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F7FF] mb-3">Legal & Policies</h4>
            <ul className="space-y-2 text-xs text-[#A5B1C8]">
              <li><button onClick={() => navigate('help')} className="hover:text-[#08D9E8]">Privacy Policy</button></li>
              <li><button onClick={() => navigate('help')} className="hover:text-[#08D9E8]">Terms of Service</button></li>
              <li><button onClick={() => navigate('help')} className="hover:text-[#08D9E8]">Community Guidelines</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(120,150,210,0.14)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A5B1C8]">
          <span>© 2026 CyberHub. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#github" onClick={(e) => { e.preventDefault(); navigate('docs'); }} className="hover:text-[#F5F7FF]">GitHub</a>
            <a href="#discord" onClick={(e) => { e.preventDefault(); navigate('community'); }} className="hover:text-[#F5F7FF]">Community</a>
            <a href="#x" onClick={(e) => { e.preventDefault(); navigate('contact'); }} className="hover:text-[#F5F7FF]">X / Twitter</a>
            <a href="#linkedin" onClick={(e) => { e.preventDefault(); navigate('about'); }} className="hover:text-[#F5F7FF]">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

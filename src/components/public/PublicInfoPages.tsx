import React, { useState } from 'react';
import { ShieldCheck, Mail, BookOpen, LifeBuoy, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicInfoPages: React.FC = () => {
  const { currentPage, navigate, isAuthenticated } = useApp();
  const [contactSent, setContactSent] = useState(false);
  const [helpTab, setHelpTab] = useState<'faq' | 'privacy' | 'terms' | 'guidelines'>('faq');

  return (
    <div className="w-full px-2 sm:px-4 py-5 space-y-6">
      <button
        onClick={() => navigate(isAuthenticated ? 'dashboard' : 'landing')}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#A5B1C8] hover:text-[#F5F7FF]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {isAuthenticated ? 'Dashboard' : 'Home'}
      </button>

      {currentPage === 'about' && (
        <div className="cyber-card p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#713BFF]/20 text-[#08D9E8] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F5F7FF]">About CyberHub</h1>
              <p className="text-xs text-[#A5B1C8]">Learn • Build • Secure</p>
            </div>
          </div>
          <p className="text-sm text-[#A5B1C8] leading-relaxed">
            CyberHub is an accessible, community-driven cybersecurity education platform built to help learners around the world master Linux, networking, defensive security, and ethical penetration testing through structured text lessons, simulated terminals, and guided labs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
              <div className="text-sm font-semibold text-[#F5F7FF]">Ethical Focus</div>
              <p className="text-xs text-[#A5B1C8] mt-1">All labs and tools emphasize authorized scoping, defensive hardening, and responsible disclosure.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
              <div className="text-sm font-semibold text-[#F5F7FF]">Bilingual Support</div>
              <p className="text-xs text-[#A5B1C8] mt-1">Supports English and Somali interface and AI Tutor explanations so more students can learn effectively.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
              <div className="text-sm font-semibold text-[#F5F7FF]">Affordable Access</div>
              <p className="text-xs text-[#A5B1C8] mt-1">Free community tier plus an accessible $10/year Premium membership or 5-friend referral unlock.</p>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'contact' && (
        <div className="cyber-card p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1677FF]/20 text-[#08D9E8] flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F5F7FF]">Contact CyberHub</h1>
              <p className="text-xs text-[#A5B1C8]">Questions about courses, community groups, or partnerships</p>
            </div>
          </div>

          {contactSent ? (
            <div className="p-6 rounded-xl bg-[#12D69A]/15 border border-[#12D69A]/40 text-sm text-[#12D69A] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Message recorded in demo preview. Support email delivery will activate once a mail backend is connected.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSent(true);
              }}
              className="space-y-4 max-w-xl"
            >
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Your Name</label>
                <input required type="text" placeholder="Ahmed Ali" className="w-full h-11 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]" />
              </div>
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Email Address</label>
                <input required type="email" placeholder="you@example.com" className="w-full h-11 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]" />
              </div>
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Message</label>
                <textarea required rows={4} placeholder="How can we help?" className="w-full p-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]" />
              </div>
              <button type="submit" className="px-6 py-3 rounded-xl cyber-gradient-btn text-white text-sm font-semibold">
                Send Message
              </button>
            </form>
          )}
        </div>
      )}

      {currentPage === 'docs' && (
        <div className="cyber-card p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#08D9E8]/15 text-[#08D9E8] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F5F7FF]">Platform Documentation</h1>
              <p className="text-xs text-[#A5B1C8]">Architecture, simulated lab safety, and certificate scope</p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-[#A5B1C8] leading-relaxed">
            <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
              <h3 className="font-semibold text-[#F5F7FF] mb-1">1. Simulated Terminal Sandbox</h3>
              <p className="text-xs">The Virtual Terminal module runs deterministic frontend simulations of Ubuntu, Kali Linux, Debian, Alpine, Fedora, and PowerShell commands so learners can study command syntax safely without executing commands against real hosts.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
              <h3 className="font-semibold text-[#F5F7FF] mb-1">2. AI Tutor & Assistant</h3>
              <p className="text-xs">When a server-side Gemini API key is configured, CyberHub AI routes requests through `/api/ai/agent`; otherwise it cleanly uses built-in structured cybersecurity explanations.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
              <h3 className="font-semibold text-[#F5F7FF] mb-1">3. Certificates</h3>
              <p className="text-xs">CyberHub completion certificates validate coursework completed inside CyberHub. They are platform-issued learning credentials and are not externally accredited industry certifications.</p>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'help' && (
        <div className="cyber-card p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#12D69A]/15 text-[#12D69A] flex items-center justify-center">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F5F7FF]">Help Center & Policies</h1>
              <p className="text-xs text-[#A5B1C8]">FAQ, Privacy Policy, Terms of Service, and Community Guidelines</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'faq', label: 'FAQ' },
              { id: 'privacy', label: 'Privacy Policy' },
              { id: 'terms', label: 'Terms of Service' },
              { id: 'guidelines', label: 'Community Guidelines' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setHelpTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  helpTab === tab.id ? 'bg-[#713BFF] text-white' : 'bg-[#0A1224] text-[#A5B1C8] hover:text-[#F5F7FF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {helpTab === 'faq' && (
            <div className="space-y-3 text-xs text-[#A5B1C8]">
              <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
                <div className="font-semibold text-[#F5F7FF] mb-1">Are the Virtual Terminals connected to real servers?</div>
                No — they run in safe frontend demonstration mode for studying syntax and simulated outputs.
              </div>
              <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
                <div className="font-semibold text-[#F5F7FF] mb-1">How does the 5-friend referral reward work?</div>
                When 5 referred learners upgrade to Premium ($10/year) and pass backend verification, your account unlocks 1 year of Premium free.
              </div>
              <div className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]">
                <div className="font-semibold text-[#F5F7FF] mb-1">Can I switch the interface to Somali?</div>
                Yes! Use the EN/SO toggle in the top bar or visit Settings to switch between English and Somali.
              </div>
            </div>
          )}

          {helpTab === 'privacy' && (
            <div className="text-xs text-[#A5B1C8] space-y-2 leading-relaxed">
              <p className="text-[#F5F7FF] font-semibold">Privacy Policy Summary</p>
              <p>In this frontend preview, user preferences (such as selected language and profile edits) are stored only in your browser&apos;s local storage. No external third-party tracking or payment processing occurs without backend configuration.</p>
            </div>
          )}

          {helpTab === 'terms' && (
            <div className="text-xs text-[#A5B1C8] space-y-2 leading-relaxed">
              <p className="text-[#F5F7FF] font-semibold">Terms of Service & Ethical Use</p>
              <p>All cybersecurity concepts, penetration testing documentation, and terminal labs on CyberHub are provided strictly for educational and authorized defensive purposes. Unauthorized testing of external networks or systems is strictly prohibited.</p>
            </div>
          )}

          {helpTab === 'guidelines' && (
            <div className="text-xs text-[#A5B1C8] space-y-2 leading-relaxed">
              <p className="text-[#F5F7FF] font-semibold">Community Guidelines</p>
              <p>Keep discussions constructive, respectful, and focused on security learning. Never post live malware, leaked credentials, or requests to target unauthorized systems.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

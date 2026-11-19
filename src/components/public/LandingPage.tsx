import React from 'react';
import {
  ArrowRight,
  GraduationCap,
  Terminal,
  Wrench,
  FlaskConical,
  Users,
  Award,
  Gift,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../ui/Primitives';

export const LandingPage: React.FC = () => {
  const { navigate, isAuthenticated } = useApp();

  const demoStats = [
    { label: 'Community Members', value: '12,450' },
    { label: 'Active Learners', value: '4,820' },
    { label: 'Learning Paths', value: '80+' },
    { label: 'Cyber Labs', value: '200+' },
    { label: 'Security Tools', value: '50+' },
  ];

  const features = [
    {
      title: 'AI Cybersecurity Academy',
      desc: 'Step-by-step text lessons with diagrams, code blocks, and an AI Tutor supporting English & Somali explanations.',
      icon: GraduationCap,
      color: 'text-[#08D9E8] bg-[#08D9E8]/10',
      page: 'academy' as const,
    },
    {
      title: 'Virtual Linux Terminals',
      desc: 'Practice inside safe frontend-simulated Ubuntu, Kali, Debian, Alpine, Fedora, and PowerShell environments.',
      icon: Terminal,
      color: 'text-[#12D69A] bg-[#12D69A]/10',
      page: 'terminal' as const,
    },
    {
      title: 'Penetration Testing Tools',
      desc: 'Explore 21 industry tools including Nmap, Wireshark, OWASP ZAP, Burp Suite, SQLMap, Semgrep, and Wazuh.',
      icon: Wrench,
      color: 'text-[#FF9F43] bg-[#FF9F43]/10',
      page: 'tools' as const,
    },
    {
      title: 'Interactive Cyber Labs',
      desc: 'Complete hands-on troubleshooting, SQLi, XSS, forensics, and Capture The Flag (CTF) challenges.',
      icon: FlaskConical,
      color: 'text-[#1677FF] bg-[#1677FF]/10',
      page: 'labs' as const,
    },
    {
      title: 'Cybersecurity Community',
      desc: 'Share write-ups, ask Q&A questions, join topic groups, and connect directly with global learners.',
      icon: Users,
      color: 'text-[#713BFF] bg-[#713BFF]/10',
      page: 'community' as const,
    },
    {
      title: 'Quizzes & Certificates',
      desc: 'Validate your recall with timed MCQ & code assessments and earn CyberHub completion certificates.',
      icon: Award,
      color: 'text-[#08D9E8] bg-[#08D9E8]/10',
      page: 'quizzes' as const,
    },
    {
      title: 'Referral Rewards',
      desc: 'Invite 5 friends who upgrade to Premium and unlock 1 full year of CyberHub Premium free.',
      icon: Gift,
      color: 'text-[#12D69A] bg-[#12D69A]/10',
      page: 'referral' as const,
    },
  ];

  const steps = [
    { num: '01', title: 'Create a free account', desc: 'Join in seconds with your learning profile and security interest.' },
    { num: '02', title: 'Join the cybersecurity community', desc: 'Connect with peers, browse discussions, and ask questions.' },
    { num: '03', title: 'Explore learning materials & terminals', desc: 'Read Academy lessons and test simulated terminal commands.' },
    { num: '04', title: 'Upgrade to Premium', desc: 'Unlock full AI Tutor, labs, pentest tools, and exams for $10/year.' },
    { num: '05', title: 'Learn, practice and earn certificates', desc: 'Complete courses & labs to earn verifiable CyberHub certificates.' },
  ];

  const comparisonRows = [
    { feature: 'Community Access (Posts, Comments & Groups)', free: true, premium: true },
    { feature: 'User Profile & Direct Connections', free: true, premium: true },
    { feature: 'Limited Terminal Demonstration', free: true, premium: true },
    { feature: 'Full AI Academy & AI Learning Assistant', free: false, premium: true },
    { feature: 'Advanced Multi-OS Terminal Access', free: false, premium: true },
    { feature: 'Full Penetration Testing Tools Library', free: false, premium: true },
    { feature: 'Interactive Cyber Labs & CTF Challenges', free: false, premium: true },
    { feature: 'Full Quizzes, Exams & Certificates', free: false, premium: true },
  ];

  return (
    <div className="w-full px-2 sm:px-4 py-5 sm:py-6 space-y-12">
      {/* Hero Section */}
      <section className="cyber-card overflow-hidden p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#0A1224] via-[#101A30] to-[#14213B]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#08D9E8] tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" />
              CyberHub · Learn • Build • Secure
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F7FF] leading-tight tracking-tight">
              Master Cybersecurity with AI-Powered Learning
            </h1>
            <p className="text-sm sm:text-base text-[#A5B1C8] leading-relaxed max-w-2xl">
              Learn cybersecurity step by step, practice in virtual labs, explore professional security tools, and connect with a global cybersecurity community.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => navigate(isAuthenticated ? 'academy' : 'auth-signup')}
                className="px-6 py-3 rounded-xl cyber-gradient-btn text-white text-sm font-semibold flex items-center gap-2 min-h-[44px]"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('labs')}
                className="px-6 py-3 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.28)] text-[#F5F7FF] hover:bg-[#14213B] text-sm font-semibold min-h-[44px] transition-colors"
              >
                Explore Cyber Labs
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[rgba(120,150,210,0.24)] shadow-2xl">
              <SafeImage
                src="/src/assets/images/cyberhub_hero_banner_1794945376019.jpg"
                alt="CyberHub Cybersecurity Learning Platform"
                className="w-full h-60 sm:h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Demo Statistics */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#A5B1C8] uppercase tracking-wider">
            Platform Overview (Sample Demo Data)
          </h2>
          <span className="text-xs text-[#A5B1C8]/80">Editable demonstration metrics</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {demoStats.map((stat) => (
            <div key={stat.label} className="cyber-card p-5">
              <div className="text-2xl font-bold text-[#F5F7FF] tabular-nums">{stat.value}</div>
              <div className="text-xs text-[#A5B1C8] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Feature Sections */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF]">
            Everything You Need to Grow in Cybersecurity
          </h2>
          <p className="text-sm text-[#A5B1C8] mt-1">
            Structured learning paths paired with hands-on labs, simulated terminals, and community mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.title}
                onClick={() => navigate(feat.page)}
                className="cyber-card p-6 text-left hover:border-[#713BFF]/60 hover:bg-[#14213B] transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl ${feat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F5F7FF] group-hover:text-[#08D9E8] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#A5B1C8] mt-2 leading-relaxed">{feat.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF]">How CyberHub Works</h2>
          <p className="text-sm text-[#A5B1C8] mt-1">Five clear steps from beginner onboarding to verified practice.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s) => (
            <div key={s.num} className="cyber-card p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-[#08D9E8] mb-2">STEP {s.num}</div>
                <h3 className="text-sm font-semibold text-[#F5F7FF]">{s.title}</h3>
                <p className="text-xs text-[#A5B1C8] mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF]">Simple, Accessible Membership</h2>
          <p className="text-sm text-[#A5B1C8] mt-2">
            Start free with community access and limited terminal demos, or unlock the entire platform for $10 per year.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cyber-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#A5B1C8]">Free Account</div>
              <div className="text-3xl font-bold text-[#F5F7FF] mt-2 tabular-nums">$0</div>
              <p className="text-xs text-[#A5B1C8] mt-1">Forever free community membership</p>
              <ul className="mt-6 space-y-3 text-sm text-[#F5F7FF]">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#12D69A]" /> Community access (Posts & Comments)</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#12D69A]" /> User profile & direct connections</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#12D69A]" /> Limited terminal demonstration</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('auth-signup')}
              className="mt-8 w-full py-3 rounded-xl bg-[#14213B] border border-[rgba(120,150,210,0.28)] text-sm font-semibold text-[#F5F7FF] hover:bg-[#1A2B4D]"
            >
              Create Free Account
            </button>
          </div>

          <div className="cyber-card-elevated p-6 sm:p-8 border-[#713BFF]/50 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#08D9E8]">Premium Account</div>
              <div className="text-3xl font-bold text-[#F5F7FF] mt-2 tabular-nums">
                $10 <span className="text-sm font-normal text-[#A5B1C8]">/ Year</span>
              </div>
              <p className="text-xs text-[#A5B1C8] mt-1">Full AI Academy, labs, tools, exams & certificates</p>
              <ul className="mt-6 space-y-3 text-sm text-[#F5F7FF]">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#12D69A]" /> Full AI Academy & AI learning assistant</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#12D69A]" /> Advanced multi-OS terminal access</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#12D69A]" /> Penetration testing tools & interactive labs</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#12D69A]" /> Full quizzes, exams, progress & certificates</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('pricing')}
              className="mt-8 w-full py-3 rounded-xl cyber-gradient-btn text-white text-sm font-semibold"
            >
              View Premium Membership
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="cyber-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(120,150,210,0.16)] bg-[#0A1224]">
                <th className="py-3.5 px-5 font-semibold text-[#F5F7FF]">Platform Feature</th>
                <th className="py-3.5 px-5 font-semibold text-[#A5B1C8] text-center">Free ($0)</th>
                <th className="py-3.5 px-5 font-semibold text-[#08D9E8] text-center">Premium ($10/Year)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(120,150,210,0.12)]">
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-5 text-xs sm:text-sm text-[#F5F7FF]">{row.feature}</td>
                  <td className="py-3 px-5 text-center">
                    {row.free ? (
                      <Check className="w-4 h-4 text-[#12D69A] inline" />
                    ) : (
                      <X className="w-4 h-4 text-[#A5B1C8]/40 inline" />
                    )}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <Check className="w-4 h-4 text-[#12D69A] inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Referral Section */}
      <section className="rounded-2xl p-6 sm:p-10 bg-gradient-to-r from-[#713BFF]/25 via-[#1677FF]/20 to-[#101A30] border border-[#713BFF]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#08D9E8]">Referral Rewards</div>
          <h2 className="text-2xl font-bold text-[#F5F7FF]">
            Invite 5 Friends. Get 1 Year of Premium Free.
          </h2>
          <p className="text-sm text-[#A5B1C8]">
            Share your unique referral link. When five new users successfully purchase Premium, unlock one free year of Premium membership.
          </p>
        </div>
        <button
          onClick={() => navigate('referral')}
          className="px-6 py-3 rounded-xl cyber-gradient-btn text-white text-sm font-semibold shrink-0 flex items-center gap-2 min-h-[44px]"
        >
          Start Inviting Friends
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};

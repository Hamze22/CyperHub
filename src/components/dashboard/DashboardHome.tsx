import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Terminal,
  FlaskConical,
  HelpCircle,
  Wrench,
  Users,
  GraduationCap,
  Rocket,
  Star,
  Gift,
  Heart,
  MessageSquare,
  Check,
  Crown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProgressRing, SafeImage } from '../ui/Primitives';
import { t } from '../../data/i18n';
import { TERMINAL_ENVIRONMENTS, runSimulatedCommand } from '../../data/terminal';
import { TerminalEnvironment } from '../../types';

export const DashboardHome: React.FC = () => {
  const {
    language,
    navigate,
    courses,
    completedLessonIds,
    completedLabIds,
    quizScores,
    posts,
    toggleLikePost,
    openCourseDetail,
    openTerminalWithEnv,
    paidReferralCount,
    user,
  } = useApp();

  const [feedTab, setFeedTab] = useState<'Latest' | 'Popular' | 'Following'>('Latest');
  const [quickEnv, setQuickEnv] = useState<TerminalEnvironment['id']>('ubuntu');
  const [quickCmd, setQuickCmd] = useState('whoami');
  const [quickHistory, setQuickHistory] = useState<{ cmd: string; out: string }[]>([
    { cmd: 'whoami', out: 'user (simulated sandbox)' },
  ]);

  const totalLessons = courses.reduce(
    (sum, c) => sum + c.modules.reduce((mSum, m) => mSum + m.lessons.length, 0),
    0
  );
  const completedLessonsCount = completedLessonIds.length;
  const quizCompletedCount = Object.keys(quizScores).length;
  const overallProgress = Math.min(
    100,
    Math.round(
      ((completedLessonsCount / Math.max(1, totalLessons)) * 45 +
        (completedLabIds.length / 8) * 35 +
        (quizCompletedCount / 6) * 20)
    )
  );

  const quickAccessTiles = [
    {
      title: 'Open Terminal',
      subtitle: 'Ubuntu · Kali · Linux',
      icon: Terminal,
      gradient: 'from-[#4B3BFF] to-[#2667FF]',
      onClick: () => navigate('terminal'),
    },
    {
      title: 'Try Cyber Labs',
      subtitle: 'Hands-on Practice',
      icon: FlaskConical,
      gradient: 'from-[#F97316] to-[#EA580C]',
      onClick: () => navigate('labs'),
    },
    {
      title: 'Take a Quiz',
      subtitle: 'Test Your Skills',
      icon: HelpCircle,
      gradient: 'from-[#08D9E8] to-[#12D69A]',
      onClick: () => navigate('quizzes'),
    },
    {
      title: 'Browse Tools',
      subtitle: 'Pentest Toolkit',
      icon: Wrench,
      gradient: 'from-[#713BFF] to-[#4338CA]',
      onClick: () => navigate('tools'),
    },
  ];

  const feedPosts = [...posts]
    .sort((a, b) => (feedTab === 'Popular' ? b.likes - a.likes : 0))
    .slice(0, 3);

  const handleQuickExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCmd.trim()) return;
    const res = runSimulatedCommand(quickCmd, quickEnv);
    if (res.clear) {
      setQuickHistory([]);
    } else {
      setQuickHistory((prev) => [...prev.slice(-3), { cmd: quickCmd.trim(), out: res.output.split('\n').slice(0, 4).join('\n') }]);
    }
    setQuickCmd('');
  };

  const selectedEnvObj = TERMINAL_ENVIRONMENTS.find((e) => e.id === quickEnv) || TERMINAL_ENVIRONMENTS[0];

  return (
    <div className="space-y-6">
      {/* Top Hero + Your Progress Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Hero Card */}
        <div className="xl:col-span-8 cyber-card overflow-hidden relative p-6 sm:p-8 flex flex-col justify-between min-h-[240px] bg-gradient-to-br from-[#0A1224] via-[#101A30] to-[#14213B]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
            <div className="md:col-span-7 space-y-3.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] leading-tight">
                {t(language, 'heroTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">
                {t(language, 'heroSubtitle')}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => navigate('academy')}
                  className="px-5 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs sm:text-sm font-semibold flex items-center gap-2 min-h-[42px]"
                >
                  {t(language, 'startLearning')}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('labs')}
                  className="px-5 py-2.5 rounded-xl bg-[#0A1224]/90 border border-[rgba(120,150,210,0.28)] text-[#F5F7FF] hover:bg-[#14213B] text-xs sm:text-sm font-semibold min-h-[42px] transition-colors"
                >
                  {t(language, 'exploreLabs')}
                </button>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-xl overflow-hidden border border-[rgba(120,150,210,0.22)]">
                <SafeImage
                  src="/src/assets/images/cyberhub_hero_banner_1794945376019.jpg"
                  alt="CyberHub Hero Banner"
                  className="w-full h-40 sm:h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Your Progress Widget */}
        <div className="xl:col-span-4 cyber-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#F5F7FF]">{t(language, 'yourProgress')}</h2>
            <button onClick={() => navigate('profile')} className="text-xs text-[#08D9E8] hover:underline">
              Details
            </button>
          </div>
          <div className="flex items-center gap-5">
            <ProgressRing percentage={overallProgress} size={108} strokeWidth={10} />
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#F5F7FF] tabular-nums">
                <CheckCircle2 className="w-4 h-4 text-[#12D69A] shrink-0" />
                <span>{completedLessonsCount} / {totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F7FF] tabular-nums">
                <CheckCircle2 className="w-4 h-4 text-[#12D69A] shrink-0" />
                <span>{completedLabIds.length} / 12 Labs</span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F7FF] tabular-nums">
                <CheckCircle2 className="w-4 h-4 text-[#12D69A] shrink-0" />
                <span>{quizCompletedCount} / 8 Quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Platform Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Community Members (Demo)', value: '12,450', icon: Users, color: 'text-[#08D9E8] bg-[#08D9E8]/15' },
          { label: 'Active Learners (Demo)', value: '4,820', icon: GraduationCap, color: 'text-[#1677FF] bg-[#1677FF]/15' },
          { label: 'Hands-on Labs (Demo)', value: '200+', icon: Rocket, color: 'text-[#713BFF] bg-[#713BFF]/15' },
          { label: 'Community Rating (Demo)', value: '4.9/5', icon: Star, color: 'text-[#FF9F43] bg-[#FF9F43]/15' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="cyber-card p-4 flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-[#F5F7FF] tabular-nums">{stat.value}</div>
                <div className="text-[11px] text-[#A5B1C8] truncate">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content + Right Contextual Column */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left/Center 8 cols */}
        <div className="xl:col-span-8 space-y-5">
          {/* Quick Access */}
          <div className="cyber-card p-5 space-y-4">
            <h2 className="text-base font-semibold text-[#F5F7FF]">{t(language, 'quickAccess')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {quickAccessTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.title}
                    onClick={tile.onClick}
                    className={`rounded-2xl p-4 bg-gradient-to-br ${tile.gradient} text-white text-left hover:opacity-95 transition-all active:scale-[0.98] min-h-[116px] flex flex-col justify-between shadow-lg`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold leading-snug">{tile.title}</div>
                      <div className="text-[11px] text-white/80 mt-0.5">{tile.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Courses */}
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F5F7FF]">{t(language, 'featuredCourses')}</h2>
              <button
                onClick={() => navigate('academy')}
                className="text-xs font-semibold text-[#08D9E8] hover:underline flex items-center gap-1"
              >
                {t(language, 'viewAll')}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.slice(0, 3).map((course) => {
                const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
                const doneCount = lessonIds.filter((id) => completedLessonIds.includes(id)).length;
                const pct = Math.round((doneCount / Math.max(1, lessonIds.length)) * 100);
                return (
                  <button
                    key={course.id}
                    onClick={() => openCourseDetail(course)}
                    className="rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)] overflow-hidden text-left hover:border-[#713BFF]/60 transition-colors group"
                  >
                    <SafeImage
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-28 object-cover"
                    />
                    <div className="p-3.5 space-y-2">
                      <div className="text-xs font-semibold text-[#F5F7FF] group-hover:text-[#08D9E8] line-clamp-1">
                        {course.title}
                      </div>
                      <div className="text-[11px] text-[#A5B1C8] flex items-center justify-between">
                        <span>{course.difficulty} · {course.duration}</span>
                        <span className="text-[#FF9F43] font-semibold tabular-nums">{course.rating} ★</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#14213B] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#713BFF] to-[#08D9E8]"
                          style={{ width: `${Math.max(10, pct)}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Referral + Free vs Premium Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Referral Card */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#713BFF]/30 via-[#1677FF]/20 to-[#101A30] border border-[#713BFF]/40 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF9F43]/20 text-[#FF9F43] flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FF]">{t(language, 'inviteFriendsTitle')}</h3>
                  <p className="text-xs text-[#A5B1C8] mt-1">{paidReferralCount} / 5 Paid Referrals</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-[#050B18] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#12D69A] to-[#08D9E8]"
                    style={{ width: `${(paidReferralCount / 5) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => navigate('referral')}
                  className="w-full py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  {t(language, 'inviteNow')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Free vs Premium Snapshot */}
            <div className="cyber-card p-5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F5F7FF]">{t(language, 'freeVsPremium')}</h3>
                <span className="text-xs font-semibold text-[#08D9E8] tabular-nums">$10 / Year</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px] text-[#A5B1C8]">
                <div className="space-y-1.5">
                  <div className="font-semibold text-[#F5F7FF]">Free</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#12D69A]" /> Community</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#12D69A]" /> Terminal Demo</div>
                </div>
                <div className="space-y-1.5">
                  <div className="font-semibold text-[#08D9E8] flex items-center gap-1"><Crown className="w-3.5 h-3.5 text-[#FF9F43]" /> Premium</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#12D69A]" /> AI Academy</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#12D69A]" /> Labs & Certs</div>
                </div>
              </div>
              <button
                onClick={() => navigate('pricing')}
                className="w-full py-2 rounded-xl bg-[#14213B] border border-[rgba(120,150,210,0.22)] text-xs font-semibold text-[#F5F7FF] hover:bg-[#1A2B4D]"
              >
                {user.membership === 'Premium' ? 'Manage Membership' : 'Compare Plans'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Contextual Widgets (4 cols) */}
        <div className="xl:col-span-4 space-y-5">
          {/* Community Feed Widget */}
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F5F7FF]">{t(language, 'communityFeed')}</h2>
              <button onClick={() => navigate('community')} className="text-xs text-[#08D9E8] hover:underline">
                Open Feed
              </button>
            </div>
            <div className="flex gap-1.5">
              {(['Latest', 'Popular', 'Following'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFeedTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    feedTab === tab ? 'bg-[#713BFF] text-white' : 'bg-[#0A1224] text-[#A5B1C8] hover:text-[#F5F7FF]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {feedPosts.map((post) => (
                <div key={post.id} className="p-3 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.14)] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <SafeImage src={post.authorAvatar} alt={post.authorName} className="w-7 h-7 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#F5F7FF] truncate">{post.authorName}</div>
                      <div className="text-[11px] text-[#A5B1C8]">{post.createdAt} · {post.category}</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#A5B1C8] line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-[11px] text-[#A5B1C8]">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1 hover:text-[#FF9F43] ${post.likedByMe ? 'text-[#FF9F43]' : ''}`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => navigate('community')}
                      className="flex items-center gap-1 hover:text-[#08D9E8]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{post.comments.length}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Terminal Widget */}
          <div className="cyber-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F5F7FF]">{t(language, 'quickTerminal')}</h2>
              <button onClick={() => openTerminalWithEnv(quickEnv)} className="text-xs text-[#08D9E8] hover:underline">
                Full Screen
              </button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['ubuntu', 'kali', 'debian'] as const).map((envId) => (
                <button
                  key={envId}
                  onClick={() => setQuickEnv(envId)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                    quickEnv === envId ? 'bg-[#1677FF] text-white' : 'bg-[#0A1224] text-[#A5B1C8]'
                  }`}
                >
                  {envId}
                </button>
              ))}
              <button
                onClick={() => navigate('terminal')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0A1224] text-[#08D9E8]"
              >
                More
              </button>
            </div>

            <div className="rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.18)] p-3 font-mono text-[11px] space-y-1.5">
              <div className="text-[#A5B1C8]/70 text-[10px]">Simulated mode · Try help, ls, nmap</div>
              {quickHistory.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-[#12D69A]">
                    {selectedEnvObj.prompt} <span className="text-[#F5F7FF]">{item.cmd}</span>
                  </div>
                  <div className="text-[#A5B1C8] whitespace-pre-wrap">{item.out}</div>
                </div>
              ))}
              <form onSubmit={handleQuickExec} className="flex items-center gap-1.5 pt-1">
                <span className="text-[#12D69A] shrink-0">{selectedEnvObj.prompt}</span>
                <input
                  type="text"
                  value={quickCmd}
                  onChange={(e) => setQuickCmd(e.target.value)}
                  placeholder="type command..."
                  className="w-full bg-transparent text-[#F5F7FF] focus:outline-none"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

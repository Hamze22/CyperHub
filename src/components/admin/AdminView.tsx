import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  MessageSquareWarning,
  BookOpen,
  FileText,
  Sparkles,
  Terminal,
  FlaskConical,
  Wrench,
  HelpCircle,
  Award,
  Crown,
  Gift,
  CreditCard,
  Bell,
  Flag,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TERMINAL_ENVIRONMENTS } from '../../data/terminal';
import { AcademyCourse, CyberQuiz, ExperienceLevel } from '../../types';

type AdminTab =
  | 'overview'
  | 'users'
  | 'moderation'
  | 'courses'
  | 'lessons'
  | 'ai'
  | 'terminals'
  | 'labs'
  | 'tools'
  | 'quizzes'
  | 'certificates'
  | 'subscriptions'
  | 'referrals'
  | 'payments'
  | 'notifications'
  | 'reports'
  | 'settings';

export const AdminView: React.FC = () => {
  const {
    courses,
    addCourse,
    posts,
    deletePostAdmin,
    communityUsers,
    labs,
    tools,
    quizzes,
    addQuiz,
    certificates,
    referrals,
    payments,
    notifications,
    user,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminToast, setAdminToast] = useState('');

  // Add Course form state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Ethical Hacking');
  const [courseDiff, setCourseDiff] = useState<ExperienceLevel>('Beginner');

  // Add Quiz form state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState<CyberQuiz['category']>('Networking');

  const notifyAdmin = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 2500);
  };

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'moderation', label: 'Moderation', icon: MessageSquareWarning },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'lessons', label: 'Lessons', icon: FileText },
    { id: 'ai', label: 'AI Content', icon: Sparkles },
    { id: 'terminals', label: 'Terminals', icon: Terminal },
    { id: 'labs', label: 'Labs', icon: FlaskConical },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
    { id: 'referrals', label: 'Referrals', icon: Gift },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    const newCourse: AcademyCourse = {
      id: `course-${Date.now()}`,
      title: courseTitle.trim(),
      category: courseCategory,
      difficulty: courseDiff,
      duration: '4h 00m',
      rating: 4.9,
      studentsCount: 1,
      thumbnail: '/src/assets/images/course_ethical_hacking_1794945376978.jpg',
      description: 'Created via CyberHub Admin Console.',
      instructor: {
        name: user.fullName,
        role: 'Platform Instructor',
        avatar: user.avatar,
      },
      learningObjectives: ['Understand core principles', 'Apply safe defensive techniques'],
      isFeatured: true,
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1: Foundations',
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: '1.1 Overview & Security Context',
              duration: '15 min',
              introduction: `Introduction to ${courseTitle.trim()}.`,
              objectives: ['Define core workflow'],
              explanation: ['This starter lesson was added from the CyberHub Admin Console.'],
              keyTerms: [{ term: 'Least Privilege', definition: 'Granting minimum access required.' }],
              diagramTitle: 'Core Security Loop',
              diagramNodes: [
                { step: '01', label: 'Identify', detail: 'Map assets' },
                { step: '02', label: 'Protect', detail: 'Harden controls' },
                { step: '03', label: 'Verify', detail: 'Audit logs' },
              ],
              practicalExample: 'Review open ports and configuration baselines.',
              codeExample: { language: 'bash', filename: 'audit.sh', code: 'ss -tuln' },
              exercisePrompt: 'Run ss -tuln in the Terminal simulator.',
              knowledgeCheck: {
                id: `kc-${Date.now()}`,
                question: 'Why enforce least privilege?',
                options: ['Reduce blast radius if an account is compromised', 'Disable logging'],
                correctIndex: 0,
                explanation: 'Least privilege limits damage from compromised accounts.',
              },
            },
          ],
        },
      ],
    };
    addCourse(newCourse);
    setCourseTitle('');
    notifyAdmin('New course added to AI Academy!');
  };

  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;
    const newQuiz: CyberQuiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle.trim(),
      category: quizCategory,
      difficulty: 'Beginner',
      timeLimitMinutes: 10,
      passingScore: 70,
      description: 'Created from CyberHub Admin Console.',
      recommendedCourseId: courses[0]?.id || 'course-ethical-hacking',
      questions: [
        {
          id: `q-${Date.now()}`,
          type: 'multiple-choice',
          question: `Which security practice best supports ${quizTitle.trim()}?`,
          options: ['Input validation & least privilege', 'Disabling TLS certificates'],
          correctIndex: 0,
          explanation: 'Input validation and least privilege mitigate common attacks.',
        },
      ],
    };
    addQuiz(newQuiz);
    setQuizTitle('');
    notifyAdmin('New quiz published to Quizzes module!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FF]">Admin Management Console</h1>
          <p className="text-xs text-[#A5B1C8] mt-1">
            Frontend demonstration management interface across all 17 platform modules (Sample Data).
          </p>
        </div>
      </div>

      {adminToast && (
        <div className="p-3 rounded-xl bg-[#12D69A]/15 border border-[#12D69A]/40 text-xs text-[#12D69A] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {adminToast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 17-item Admin Sub-Navigation */}
        <aside className="lg:col-span-3 cyber-card p-3 space-y-1 max-h-[540px] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  active ? 'bg-[#713BFF] text-white font-semibold' : 'text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#0A1224]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Admin Panel Content */}
        <div className="lg:col-span-9 space-y-5">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="cyber-card p-4">
                  <div className="text-xl font-bold text-[#F5F7FF] tabular-nums">{communityUsers.length + 1}</div>
                  <div className="text-xs text-[#A5B1C8]">Sample Users</div>
                </div>
                <div className="cyber-card p-4">
                  <div className="text-xl font-bold text-[#08D9E8] tabular-nums">{courses.length}</div>
                  <div className="text-xs text-[#A5B1C8]">Academy Courses</div>
                </div>
                <div className="cyber-card p-4">
                  <div className="text-xl font-bold text-[#12D69A] tabular-nums">{labs.length}</div>
                  <div className="text-xs text-[#A5B1C8]">Cyber Labs</div>
                </div>
                <div className="cyber-card p-4">
                  <div className="text-xl font-bold text-[#FF9F43] tabular-nums">{posts.length}</div>
                  <div className="text-xs text-[#A5B1C8]">Community Posts</div>
                </div>
              </div>
              <div className="cyber-card p-5 text-xs text-[#A5B1C8] leading-relaxed">
                Select any section on the left to manage courses, add quizzes, moderate community posts, review user records, or inspect subscription & referral data in this frontend demo console.
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-5">
              <form onSubmit={handleAddCourse} className="cyber-card p-5 space-y-3">
                <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#08D9E8]" />
                  Add New Academy Course
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="Course title..."
                    className="h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                  />
                  <input
                    type="text"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    placeholder="Category..."
                    className="h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                  />
                  <select
                    value={courseDiff}
                    onChange={(e) => setCourseDiff(e.target.value as ExperienceLevel)}
                    className="h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 rounded-xl cyber-gradient-btn text-white text-xs font-semibold">
                  Publish Course
                </button>
              </form>

              <div className="cyber-card divide-y divide-[rgba(120,150,210,0.12)]">
                {courses.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#F5F7FF]">{c.title}</div>
                      <div className="text-[#A5B1C8]">{c.category} · {c.difficulty} · {c.duration}</div>
                    </div>
                    <span className="text-[#12D69A] font-medium">Published</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-5">
              <form onSubmit={handleAddQuiz} className="cyber-card p-5 space-y-3">
                <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#08D9E8]" />
                  Create New Quiz
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Quiz title..."
                    className="h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                  />
                  <select
                    value={quizCategory}
                    onChange={(e) => setQuizCategory(e.target.value as CyberQuiz['category'])}
                    className="h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                  >
                    <option value="Networking">Networking</option>
                    <option value="Linux">Linux</option>
                    <option value="Web Security">Web Security</option>
                    <option value="Ethical Hacking">Ethical Hacking</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 rounded-xl cyber-gradient-btn text-white text-xs font-semibold">
                  Create Quiz
                </button>
              </form>

              <div className="cyber-card divide-y divide-[rgba(120,150,210,0.12)]">
                {quizzes.map((qz) => (
                  <div key={qz.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#F5F7FF]">{qz.title}</div>
                      <div className="text-[#A5B1C8]">{qz.category} · {qz.questions.length} questions</div>
                    </div>
                    <span className="text-[#08D9E8]">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="cyber-card divide-y divide-[rgba(120,150,210,0.12)]">
              <div className="p-4 text-sm font-bold text-[#F5F7FF]">Community Post Moderation ({posts.length})</div>
              {posts.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-[#F5F7FF] truncate">{p.title}</div>
                    <div className="text-[#A5B1C8]">@{p.authorUsername} · {p.category}</div>
                  </div>
                  <button
                    onClick={() => {
                      deletePostAdmin(p.id);
                      notifyAdmin('Post removed from feed.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#FF9F43]/15 text-[#FF9F43] font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="cyber-card divide-y divide-[rgba(120,150,210,0.12)]">
              <div className="p-4 text-sm font-bold text-[#F5F7FF]">Community Users (Sample Records)</div>
              {communityUsers.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#F5F7FF]">{u.fullName} (@{u.username})</div>
                    <div className="text-[#A5B1C8]">{u.country} · {u.experienceLevel}</div>
                  </div>
                  <span className="text-[#08D9E8] tabular-nums">{u.coursesCompleted} courses</span>
                </div>
              ))}
            </div>
          )}

          {!['overview', 'courses', 'quizzes', 'moderation', 'users'].includes(activeTab) && (
            <div className="cyber-card p-6 space-y-4">
              <h2 className="text-base font-bold text-[#F5F7FF] capitalize">{activeTab} Management (Sample Data)</h2>
              <div className="text-xs text-[#A5B1C8] space-y-2">
                {activeTab === 'lessons' && <p>Total active structured text lessons across courses: {courses.reduce((s, c) => s + c.modules.reduce((ms, m) => ms + m.lessons.length, 0), 0)}.</p>}
                {activeTab === 'ai' && <p>AI Tutor & AI Terminal Assistant route via `/api/ai/agent` with bilingual EN/SO support and offline intelligence fallback.</p>}
                {activeTab === 'terminals' && <p>Configured simulated environments ({TERMINAL_ENVIRONMENTS.length}): {TERMINAL_ENVIRONMENTS.map((e) => e.shortName).join(', ')}.</p>}
                {activeTab === 'labs' && <p>{labs.length} interactive Cyber Labs & CTF challenges configured with answer validation.</p>}
                {activeTab === 'tools' && <p>{tools.length} penetration testing tools documented across 10 security categories.</p>}
                {activeTab === 'certificates' && <p>{certificates.length} platform completion certificates issued in current demo session.</p>}
                {activeTab === 'subscriptions' && <p>Active membership tier: {user.membership} · Standard Premium price: $10 / Year.</p>}
                {activeTab === 'referrals' && <p>{referrals.length} tracked referral entries (backend verification required before live payouts).</p>}
                {activeTab === 'payments' && <p>{payments.length} billing log entries (checkout integration ready; no real charges).</p>}
                {activeTab === 'notifications' && <p>{notifications.length} system & community alerts queued in session.</p>}
                {activeTab === 'reports' && <p>Moderation queue clear. Community reporting modal routes directly into admin queue.</p>}
                {activeTab === 'settings' && <p>Platform branding: CyberHub (Learn • Build • Secure) · Supported languages: EN, SO.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

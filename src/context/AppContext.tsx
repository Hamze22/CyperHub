import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppPage,
  Language,
  UserProfile,
  AcademyCourse,
  AcademyLesson,
  CommunityPost,
  CommunityGroup,
  CommunityUserSummary,
  DirectMessage,
  SecurityTool,
  CyberLab,
  CyberQuiz,
  CertificateItem,
  ReferralRecord,
  NotificationEntry,
  TerminalEnvironment,
  PaymentRecord,
} from '../types';
import { ACADEMY_COURSES } from '../data/courses';
import { INITIAL_POSTS, COMMUNITY_GROUPS, COMMUNITY_USERS, INITIAL_DMS } from '../data/community';
import { PENTEST_TOOLS } from '../data/tools';
import { CYBER_LABS } from '../data/labs';
import { CYBER_QUIZZES } from '../data/quizzes';

interface AppContextValue {
  // Navigation & Auth
  currentPage: AppPage;
  navigate: (page: AppPage) => void;
  isAuthenticated: boolean;
  loginDemo: (email?: string, name?: string) => void;
  logoutDemo: () => void;

  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // User Profile & Settings
  user: UserProfile;
  updateUserProfile: (patch: Partial<UserProfile>) => void;
  accentTheme: 'purple-blue' | 'cyan-blue';
  setAccentTheme: (theme: 'purple-blue' | 'cyan-blue') => void;

  // Academy
  courses: AcademyCourse[];
  addCourse: (course: AcademyCourse) => void;
  enrolledCourseIds: string[];
  enrollCourse: (courseId: string) => void;
  completedLessonIds: string[];
  markLessonComplete: (lessonId: string, courseId: string) => void;
  selectedCourse: AcademyCourse;
  setSelectedCourse: (course: AcademyCourse) => void;
  selectedLesson: AcademyLesson;
  setSelectedLesson: (lesson: AcademyLesson) => void;
  openCourseDetail: (course: AcademyCourse) => void;
  openLessonReader: (course: AcademyCourse, lesson?: AcademyLesson) => void;

  // Community
  posts: CommunityPost[];
  createPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>) => void;
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  deletePostAdmin: (postId: string) => void;
  groups: CommunityGroup[];
  toggleJoinGroup: (groupId: string) => void;
  communityUsers: CommunityUserSummary[];
  toggleFollowUser: (userId: string) => void;
  dms: DirectMessage[];
  sendDM: (dmId: string, text: string) => void;

  // Terminal
  activeTerminalEnv: TerminalEnvironment['id'];
  setActiveTerminalEnv: (env: TerminalEnvironment['id']) => void;
  openTerminalWithEnv: (env: TerminalEnvironment['id']) => void;

  // Tools Library
  tools: SecurityTool[];
  selectedTool: SecurityTool;
  setSelectedTool: (tool: SecurityTool) => void;
  openToolDetail: (tool: SecurityTool) => void;

  // Cyber Labs
  labs: CyberLab[];
  selectedLab: CyberLab;
  setSelectedLab: (lab: CyberLab) => void;
  openLabDetail: (lab: CyberLab) => void;
  completedLabIds: string[];
  activeLabIds: string[];
  startLab: (labId: string) => void;
  submitLabAnswer: (labId: string, answer: string) => boolean;

  // Quizzes & Certificates
  quizzes: CyberQuiz[];
  addQuiz: (quiz: CyberQuiz) => void;
  quizScores: Record<string, number>;
  recordQuizScore: (quizId: string, scorePct: number) => void;
  certificates: CertificateItem[];
  issueCertificate: (courseName: string, score: number) => CertificateItem;

  // Referral & Subscription
  referrals: ReferralRecord[];
  paidReferralCount: number;
  simulateReferralConversion: () => void;
  upgradeToPremiumDemo: () => void;
  payments: PaymentRecord[];

  // Notifications
  notifications: NotificationEntry[];
  unreadNotificationsCount: number;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentSearches: string[];
  runGlobalSearch: (q: string) => void;

  // AI Drawer shortcut
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'u-ahmed-ali',
  fullName: 'Ahmed Ali',
  username: 'ahmed_sec',
  email: 'ahmed.ali@cyberhub.demo',
  avatar: '/src/assets/images/avatar_cyber_user_1794945378440.jpg',
  country: 'Somalia',
  bio: 'Cybersecurity learner building hands-on offensive & defensive skills across Linux, networking, and OWASP Web Security.',
  experienceLevel: 'Intermediate',
  learningInterest: 'Ethical Hacking & Web Security',
  skills: ['Linux', 'Nmap', 'Bash', 'OWASP Top 10', 'Python'],
  membership: 'Free',
  planStartDate: 'Nov 01, 2026',
  planExpiryDate: '—',
  githubUrl: 'https://github.com/cyberhub-demo',
  linkedinUrl: 'https://linkedin.com/in/cyberhub-demo',
  followersCount: 245,
  followingCount: 180,
  isAdmin: true,
};

const INITIAL_NOTIFICATIONS: NotificationEntry[] = [
  {
    id: 'n-1',
    type: 'like',
    title: 'Abdirahman Crypto liked your post',
    body: 'Your Linux log triage breakdown received a like in Community.',
    timestamp: '12m ago',
    read: false,
    targetPage: 'community',
  },
  {
    id: 'n-2',
    type: 'comment',
    title: 'Fartun Ahmed commented on your post',
    body: '"Count me in for the weekend CTF Web Security challenges!"',
    timestamp: '45m ago',
    read: false,
    targetPage: 'community',
  },
  {
    id: 'n-3',
    type: 'lab',
    title: 'Lab Completed: Network Scanning',
    body: 'You earned +120 points for completing Network Scanning & Port Discovery.',
    timestamp: '3h ago',
    read: false,
    targetPage: 'labs',
  },
  {
    id: 'n-4',
    type: 'course',
    title: 'New Course Available: AI Security',
    body: 'Explore Prompt Injection Defense & OWASP LLM Top 10 in AI Academy.',
    timestamp: '1d ago',
    read: true,
    targetPage: 'academy',
  },
  {
    id: 'n-5',
    type: 'certificate',
    title: 'Certificate Unlocked',
    body: 'Your CyberHub completion certificate for Ethical Hacking is ready to preview.',
    timestamp: '2d ago',
    read: true,
    targetPage: 'certificates',
  },
];

const INITIAL_REFERRALS: ReferralRecord[] = [
  { id: 'ref-1', friendName: 'Hodan Yusuf', friendEmail: 'hodan@example.com', joinedDate: 'Nov 03, 2026', status: 'Paid Premium', rewardEligible: true },
  { id: 'ref-2', friendName: 'Liban Farah', friendEmail: 'liban@example.com', joinedDate: 'Nov 08, 2026', status: 'Paid Premium', rewardEligible: true },
  { id: 'ref-3', friendName: 'Nadia Omar', friendEmail: 'nadia@example.com', joinedDate: 'Nov 12, 2026', status: 'Paid Premium', rewardEligible: true },
  { id: 'ref-4', friendName: 'Yusuf Warsame', friendEmail: 'yusuf@example.com', joinedDate: 'Nov 15, 2026', status: 'Registered', rewardEligible: false },
];

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('cyberhub_lang');
    return saved === 'en' ? 'en' : 'so';
  });
  const [accentTheme, setAccentTheme] = useState<'purple-blue' | 'cyan-blue'>('purple-blue');

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('cyberhub_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [courses, setCourses] = useState<AcademyCourse[]>(ACADEMY_COURSES);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([
    'course-baro-ethical-hacking',
    'course-ethical-hacking',
    'course-linux',
    'course-web-security',
    'course-fundamentals',
  ]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([
    'les-eh-1',
    'les-lin-1',
    'les-fun-1',
  ]);
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse>(ACADEMY_COURSES[0]);
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson>(ACADEMY_COURSES[0].modules[0].lessons[0]);

  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [groups, setGroups] = useState<CommunityGroup[]>(COMMUNITY_GROUPS);
  const [communityUsers, setCommunityUsers] = useState<CommunityUserSummary[]>(COMMUNITY_USERS);
  const [dms, setDms] = useState<DirectMessage[]>(INITIAL_DMS);

  const [activeTerminalEnv, setActiveTerminalEnv] = useState<TerminalEnvironment['id']>('ubuntu');

  const [tools] = useState<SecurityTool[]>(PENTEST_TOOLS);
  const [selectedTool, setSelectedTool] = useState<SecurityTool>(PENTEST_TOOLS[0]);

  const [labs] = useState<CyberLab[]>(CYBER_LABS);
  const [selectedLab, setSelectedLab] = useState<CyberLab>(CYBER_LABS[0]);
  const [completedLabIds, setCompletedLabIds] = useState<string[]>(['lab-network-scan', 'lab-ctf-crypto']);
  const [activeLabIds, setActiveLabIds] = useState<string[]>(['lab-web-vuln', 'lab-sqli-lab']);

  const [quizzes, setQuizzes] = useState<CyberQuiz[]>(CYBER_QUIZZES);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({
    'quiz-networking': 100,
    'quiz-linux': 85,
    'quiz-general': 100,
  });

  const [certificates, setCertificates] = useState<CertificateItem[]>([
    {
      id: 'CH-CERT-2026-4108',
      studentName: DEFAULT_USER.fullName,
      courseName: 'Linux Fundamentals & Server Hardening',
      completionDate: 'Nov 10, 2026',
      verificationCode: 'CH-VER-94A2-F81C',
      score: 94,
      isPlatformCertificate: true,
    },
    {
      id: 'CH-CERT-2026-3892',
      studentName: DEFAULT_USER.fullName,
      courseName: 'Introduction to Cybersecurity & Defense Mindset',
      completionDate: 'Nov 02, 2026',
      verificationCode: 'CH-VER-71B9-C02E',
      score: 98,
      isPlatformCertificate: true,
    },
  ]);

  const [referrals, setReferrals] = useState<ReferralRecord[]>(INITIAL_REFERRALS);
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: 'PAY-DEMO-001',
      date: 'Nov 01, 2026',
      description: 'CyberHub Free Community Account Activation',
      amount: '$0.00',
      method: 'No Payment Required',
      status: 'Demo Record',
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationEntry[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Nmap', 'SQL Injection', 'Linux Permissions', 'Kali']);
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('cyberhub_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cyberhub_user', JSON.stringify(user));
  }, [user]);

  const navigate = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginDemo = (email?: string, name?: string) => {
    if (email || name) {
      setUser((prev) => ({
        ...prev,
        email: email || prev.email,
        fullName: name || prev.fullName,
      }));
    }
    setIsAuthenticated(true);
    navigate('dashboard');
  };

  const logoutDemo = () => {
    setIsAuthenticated(false);
    navigate('landing');
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  };

  const addCourse = (course: AcademyCourse) => {
    setCourses((prev) => [course, ...prev]);
  };

  const enrollCourse = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds((prev) => [...prev, courseId]);
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          type: 'course',
          title: 'Course Enrolled',
          body: 'You enrolled in a new CyberHub Academy course.',
          timestamp: 'Just now',
          read: false,
          targetPage: 'academy',
        },
        ...prev,
      ]);
    }
  };

  const markLessonComplete = (lessonId: string, courseId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
    }
    enrollCourse(courseId);
  };

  const openCourseDetail = (course: AcademyCourse) => {
    setSelectedCourse(course);
    setSelectedLesson(course.modules[0]?.lessons[0]);
    navigate('course-detail');
  };

  const openLessonReader = (course: AcademyCourse, lesson?: AcademyLesson) => {
    setSelectedCourse(course);
    setSelectedLesson(lesson || course.modules[0]?.lessons[0]);
    enrollCourse(course.id);
    navigate('lesson-reader');
  };

  const createPost = (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: 'Just now',
      likes: 1,
      likedByMe: true,
      bookmarkedByMe: false,
      comments: [],
      shares: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: p.likedByMe ? Math.max(0, p.likes - 1) : p.likes + 1,
            }
          : p
      )
    );
  };

  const toggleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, bookmarkedByMe: !p.bookmarkedByMe } : p))
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c-${Date.now()}`,
                  authorName: user.fullName,
                  authorUsername: user.username,
                  authorAvatar: user.avatar,
                  content: content.trim(),
                  createdAt: 'Just now',
                },
              ],
            }
          : p
      )
    );
  };

  const deletePostAdmin = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const toggleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              joined: !g.joined,
              membersCount: g.joined ? g.membersCount - 1 : g.membersCount + 1,
            }
          : g
      )
    );
  };

  const toggleFollowUser = (userId: string) => {
    setCommunityUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              isFollowing: !u.isFollowing,
              followersCount: u.isFollowing ? u.followersCount - 1 : u.followersCount + 1,
            }
          : u
      )
    );
  };

  const sendDM = (dmId: string, text: string) => {
    if (!text.trim()) return;
    setDms((prev) =>
      prev.map((dm) =>
        dm.id === dmId
          ? {
              ...dm,
              messages: [
                ...dm.messages,
                {
                  sender: 'me',
                  text: text.trim(),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            }
          : dm
      )
    );
  };

  const openTerminalWithEnv = (env: TerminalEnvironment['id']) => {
    setActiveTerminalEnv(env);
    navigate('terminal');
  };

  const openToolDetail = (tool: SecurityTool) => {
    setSelectedTool(tool);
    navigate('tool-detail');
  };

  const openLabDetail = (lab: CyberLab) => {
    setSelectedLab(lab);
    navigate('lab-detail');
  };

  const startLab = (labId: string) => {
    if (!activeLabIds.includes(labId)) {
      setActiveLabIds((prev) => [...prev, labId]);
    }
  };

  const submitLabAnswer = (labId: string, answer: string): boolean => {
    const lab = labs.find((l) => l.id === labId);
    if (!lab) return false;
    if (answer.trim().toLowerCase() === lab.expectedAnswer.trim().toLowerCase()) {
      if (!completedLabIds.includes(labId)) {
        setCompletedLabIds((prev) => [...prev, labId]);
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            type: 'lab',
            title: `Lab Completed: ${lab.title}`,
            body: `Verified completion (+${lab.points} pts).`,
            timestamp: 'Just now',
            read: false,
            targetPage: 'labs',
          },
          ...prev,
        ]);
      }
      return true;
    }
    return false;
  };

  const addQuiz = (quiz: CyberQuiz) => {
    setQuizzes((prev) => [quiz, ...prev]);
  };

  const recordQuizScore = (quizId: string, scorePct: number) => {
    setQuizScores((prev) => ({
      ...prev,
      [quizId]: Math.max(prev[quizId] || 0, scorePct),
    }));
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: 'quiz',
        title: 'Quiz Result Available',
        body: `You scored ${scorePct}% on your latest assessment.`,
        timestamp: 'Just now',
        read: false,
        targetPage: 'quizzes',
      },
      ...prev,
    ]);
  };

  const issueCertificate = (courseName: string, score: number): CertificateItem => {
    const existing = certificates.find((c) => c.courseName === courseName);
    if (existing) return existing;
    const cert: CertificateItem = {
      id: `CH-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: user.fullName,
      courseName,
      completionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      verificationCode: `CH-VER-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      score,
      isPlatformCertificate: true,
    };
    setCertificates((prev) => [cert, ...prev]);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: 'certificate',
        title: 'Certificate Unlocked',
        body: `Your completion certificate for ${courseName} is ready.`,
        timestamp: 'Just now',
        read: false,
        targetPage: 'certificates',
      },
      ...prev,
    ]);
    return cert;
  };

  const paidReferralCount = referrals.filter((r) => r.status === 'Paid Premium' && r.rewardEligible).length;

  const simulateReferralConversion = () => {
    if (paidReferralCount >= 5) return;
    const nextIdx = referrals.findIndex((r) => r.status !== 'Paid Premium');
    let updated: ReferralRecord[];
    if (nextIdx >= 0) {
      updated = referrals.map((r, i) =>
        i === nextIdx ? { ...r, status: 'Paid Premium', rewardEligible: true } : r
      );
    } else {
      updated = [
        ...referrals,
        {
          id: `ref-${Date.now()}`,
          friendName: `Learner #${referrals.length + 1}`,
          friendEmail: `friend${referrals.length + 1}@example.com`,
          joinedDate: 'Nov 17, 2026',
          status: 'Paid Premium',
          rewardEligible: true,
        },
      ];
    }
    setReferrals(updated);
    const newPaidCount = updated.filter((r) => r.status === 'Paid Premium' && r.rewardEligible).length;
    if (newPaidCount >= 5) {
      setUser((prev) => ({
        ...prev,
        membership: 'Premium',
        planStartDate: 'Nov 17, 2026',
        planExpiryDate: 'Nov 17, 2027',
      }));
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          type: 'referral',
          title: 'Referral Reward Unlocked: 1 Year Premium!',
          body: '5/5 eligible paid referrals reached. Your demo Premium status is unlocked.',
          timestamp: 'Just now',
          read: false,
          targetPage: 'referral',
        },
        ...prev,
      ]);
    }
  };

  const upgradeToPremiumDemo = () => {
    setPayments((prev) => [
      {
        id: `PAY-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        date: 'Nov 17, 2026',
        description: 'Premium Annual Plan ($10/year) — Pending Payment Gateway Integration',
        amount: '$10.00',
        method: 'Payment Gateway Not Connected',
        status: 'Pending Integration',
      },
      ...prev,
    ]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const runGlobalSearch = (q: string) => {
    setSearchQuery(q);
    const trimmed = q.trim();
    if (trimmed && !recentSearches.includes(trimmed)) {
      setRecentSearches((prev) => [trimmed, ...prev].slice(0, 6));
    }
    navigate('search');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        isAuthenticated,
        loginDemo,
        logoutDemo,
        language,
        setLanguage,
        user,
        updateUserProfile,
        accentTheme,
        setAccentTheme,
        courses,
        addCourse,
        enrolledCourseIds,
        enrollCourse,
        completedLessonIds,
        markLessonComplete,
        selectedCourse,
        setSelectedCourse,
        selectedLesson,
        setSelectedLesson,
        openCourseDetail,
        openLessonReader,
        posts,
        createPost,
        toggleLikePost,
        toggleBookmarkPost,
        addComment,
        deletePostAdmin,
        groups,
        toggleJoinGroup,
        communityUsers,
        toggleFollowUser,
        dms,
        sendDM,
        activeTerminalEnv,
        setActiveTerminalEnv,
        openTerminalWithEnv,
        tools,
        selectedTool,
        setSelectedTool,
        openToolDetail,
        labs,
        selectedLab,
        setSelectedLab,
        openLabDetail,
        completedLabIds,
        activeLabIds,
        startLab,
        submitLabAnswer,
        quizzes,
        addQuiz,
        quizScores,
        recordQuizScore,
        certificates,
        issueCertificate,
        referrals,
        paidReferralCount,
        simulateReferralConversion,
        upgradeToPremiumDemo,
        payments,
        notifications,
        unreadNotificationsCount,
        markAllNotificationsRead,
        markNotificationRead,
        searchQuery,
        setSearchQuery,
        recentSearches,
        runGlobalSearch,
        aiDrawerOpen,
        setAiDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export type Language = 'en' | 'so';

export type MembershipTier = 'Free' | 'Premium';

export type AppPage =
  | 'landing'
  | 'auth-login'
  | 'auth-signup'
  | 'auth-forgot'
  | 'auth-reset'
  | 'auth-verify'
  | 'auth-onboarding'
  | 'dashboard'
  | 'community'
  | 'academy'
  | 'course-detail'
  | 'lesson-reader'
  | 'terminal'
  | 'tools'
  | 'tool-detail'
  | 'labs'
  | 'lab-detail'
  | 'quizzes'
  | 'certificates'
  | 'referral'
  | 'pricing'
  | 'profile'
  | 'settings'
  | 'help'
  | 'about'
  | 'contact'
  | 'docs'
  | 'search'
  | 'admin';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  country: string;
  bio: string;
  experienceLevel: ExperienceLevel;
  learningInterest: string;
  skills: string[];
  membership: MembershipTier;
  planStartDate: string;
  planExpiryDate: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  followersCount: number;
  followingCount: number;
  isAdmin: boolean;
}

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AcademyLesson {
  id: string;
  title: string;
  duration: string;
  introduction: string;
  objectives: string[];
  explanation: string[];
  keyTerms: { term: string; definition: string }[];
  diagramTitle: string;
  diagramNodes: { step: string; label: string; detail: string }[];
  practicalExample: string;
  codeExample: {
    language: string;
    filename: string;
    code: string;
  };
  exercisePrompt: string;
  knowledgeCheck: LessonQuizQuestion;
  additionalQuizzes?: LessonQuizQuestion[];
  imageUrl?: string;
  imageCaption?: string;
  imageSourceUrl?: string;
  imageAttribution?: string;
  levelTag?: 'Bilow (From Scratch)' | 'Dhexe (Intermediate)' | 'Heer Sare (Advanced)';
  commandBreakdown?: { flag: string; meaning: string }[];
  videoScript?: { chapter: string; duration: string; narration: string }[];
  labSteps?: string[];
  references?: { title: string; url: string }[];
}

export interface AcademyModule {
  id: string;
  title: string;
  lessons: AcademyLesson[];
}

export type AcademyLevel =
  | 'LEVEL 01 – BEGINNER'
  | 'LEVEL 02 – INTERMEDIATE'
  | 'LEVEL 03 – ADVANCED'
  | 'LEVEL 04 – EXPERT';

export interface AcademyCourse {
  id: string;
  title: string;
  category: string;
  difficulty: ExperienceLevel;
  academyLevel?: AcademyLevel;
  duration: string;
  rating: number;
  studentsCount: number;
  thumbnail: string;
  description: string;
  prerequisites?: string[];
  capstoneProject?: string;
  references?: { title: string; url: string }[];
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  learningObjectives: string[];
  modules: AcademyModule[];
  isFeatured?: boolean;
  isRecommended?: boolean;
  isPremium?: boolean;
  videoUrl?: string;
  pdfUrl?: string;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  replies?: {
    id: string;
    authorName: string;
    authorUsername: string;
    content: string;
    createdAt: string;
  }[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: string;
  authorCountry: string;
  type: 'Discussion' | 'Question' | 'Achievement' | 'Announcement' | 'Challenge';
  category: string;
  tags: string[];
  title: string;
  content: string;
  codeSnippet?: string;
  imagePreview?: string;
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  comments: CommunityComment[];
  shares: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  topic: string;
  membersCount: number;
  description: string;
  joined: boolean;
}

export interface CommunityUserSummary {
  id: string;
  fullName: string;
  username: string;
  avatar: string;
  country: string;
  bio: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
  coursesCompleted: number;
  certificatesCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface DirectMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  messages: { sender: 'me' | 'them'; text: string; time: string }[];
}

export interface TerminalEnvironment {
  id: 'ubuntu' | 'kali' | 'debian' | 'alpine' | 'fedora' | 'powershell';
  name: string;
  shortName: string;
  osFamily: string;
  version: string;
  description: string;
  envType: string;
  resources: string;
  prompt: string;
  welcomeBanner: string;
  status: 'Ready' | 'Active' | 'Idle';
  isPremium?: boolean;
}

export interface SecurityTool {
  id: string;
  name: string;
  category:
    | 'Network Scanning'
    | 'Web Security'
    | 'Password Auditing'
    | 'Vulnerability Assessment'
    | 'Cloud Security'
    | 'Code Security'
    | 'Digital Forensics'
    | 'Wireless Security'
    | 'MITM & Sniffing'
    | 'Mobile Security'
    | 'OSINT & Recon'
    | 'Cryptography'
    | 'Security Monitoring';
  skillLevel: ExperienceLevel;
  executionMode: 'Simulated Lab Sandbox' | 'Educational Documentation';
  description: string;
  overview: string;
  features: string[];
  installation: string;
  usageGuide: string;
  exampleCommands: { label: string; command: string }[];
  officialDocsUrl: string;
  relatedCourseIds: string[];
  relatedLabIds: string[];
}

export interface CyberLab {
  id: string;
  title: string;
  category:
    | 'Linux Practice'
    | 'Networking'
    | 'Web Security'
    | 'SQL Injection'
    | 'XSS'
    | 'API Security'
    | 'Password Auditing'
    | 'Log Analysis'
    | 'Digital Forensics'
    | 'Cloud Security'
    | 'Secure Coding'
    | 'Capture The Flag';
  difficulty: ExperienceLevel;
  duration: string;
  points: number;
  isFeatured?: boolean;
  isCTF?: boolean;
  description: string;
  overview: string;
  objectives: string[];
  instructions: string[];
  requiredTools: string[];
  environmentSpec: string;
  hints: string[];
  checklist: string[];
  expectedAnswer: string;
  sampleCommand: string;
}

export interface QuizQuestionItem {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'code-interpretation';
  question: string;
  codeBlock?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CyberQuiz {
  id: string;
  title: string;
  category:
    | 'Networking'
    | 'Linux'
    | 'Ethical Hacking'
    | 'Web Security'
    | 'Cloud Security'
    | 'Cryptography'
    | 'Digital Forensics'
    | 'General Cybersecurity';
  difficulty: ExperienceLevel;
  timeLimitMinutes: number;
  passingScore: number;
  description: string;
  recommendedCourseId: string;
  questions: QuizQuestionItem[];
}

export interface CertificateItem {
  id: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  verificationCode: string;
  score: number;
  isPlatformCertificate: true;
}

export interface ReferralRecord {
  id: string;
  friendName: string;
  friendEmail: string;
  joinedDate: string;
  status: 'Invited' | 'Registered' | 'Paid Premium';
  rewardEligible: boolean;
}

export interface NotificationEntry {
  id: string;
  type:
    | 'like'
    | 'comment'
    | 'follow'
    | 'message'
    | 'course'
    | 'lab'
    | 'quiz'
    | 'certificate'
    | 'referral'
    | 'subscription';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  targetPage: AppPage;
}

export interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: string;
  method: string;
  status: 'Demo Record' | 'Pending Integration';
}

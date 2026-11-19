import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Star,
  Users,
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  Lock,
  Search,
  Video,
  FileText,
  Layers,
  Award,
  ExternalLink,
  ListChecks,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ACADEMY_CATEGORIES, ACADEMY_CATEGORIES_SO } from '../../data/courses';
import { Modal, SafeImage } from '../ui/Primitives';
import { AcademyLevel, ExperienceLevel } from '../../types';

const DIFFICULTY_SO: Record<'All' | ExperienceLevel, string> = {
  All: 'Dhammaan',
  Beginner: 'Bilow',
  Intermediate: 'Dhexe',
  Advanced: 'Sare',
};

const FILTER_TAB_SO: Record<'All' | 'Featured' | 'Recommended' | 'My Learning', string> = {
  All: 'Dhammaan',
  Featured: 'La Soo Xulay',
  Recommended: 'Lagula Taliyay',
  'My Learning': 'Waxbarashadayda',
};

const ACADEMY_LEVELS: {
  id: 'All' | AcademyLevel;
  badge: string;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'All',
    badge: 'DHAMMAAN',
    title: 'Dhammaan Heerarka',
    subtitle: 'Eeg manhajka oo dhan bilow ilaa khabiir',
  },
  {
    id: 'LEVEL 01 – BEGINNER',
    badge: 'HEERKA 01',
    title: 'Bilow (Foundations)',
    subtitle: 'Aasaaska Amniga, Shabakadaha, OSI & TCP/IP',
  },
  {
    id: 'LEVEL 02 – INTERMEDIATE',
    badge: 'HEERKA 02',
    title: 'Dhexe (Technical & Ethical Hacking)',
    subtitle: 'Linux, Kali Linux, Nmap, Web & OWASP Top 10',
  },
  {
    id: 'LEVEL 03 – ADVANCED',
    badge: 'HEERKA 03',
    title: 'Heer Sare (Takhasusyo)',
    subtitle: 'Pentesting, Red Team, SOC, DFIR, Malware, Cloud & DevSecOps',
  },
  {
    id: 'LEVEL 04 – EXPERT',
    badge: 'HEERKA 04',
    title: 'Khabiir (Architecture & GRC)',
    subtitle: 'PKI, NIST CSF 2.0, Shahaadooyin, Shaqo & AI Security',
  },
];

function getCourseLevel(course: { academyLevel?: AcademyLevel; difficulty: ExperienceLevel }): AcademyLevel {
  if (course.academyLevel) return course.academyLevel;
  if (course.difficulty === 'Beginner') return 'LEVEL 01 – BEGINNER';
  if (course.difficulty === 'Intermediate') return 'LEVEL 02 – INTERMEDIATE';
  return 'LEVEL 03 – ADVANCED';
}

export const AcademyView: React.FC = () => {
  const {
    currentPage,
    courses,
    enrolledCourseIds,
    completedLessonIds,
    selectedCourse,
    openCourseDetail,
    openLessonReader,
    navigate,
    user,
  } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<'All' | AcademyLevel>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterTab, setFilterTab] = useState<'All' | 'Featured' | 'Recommended' | 'My Learning'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | ExperienceLevel>('All');
  const [query, setQuery] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  if (currentPage === 'course-detail' && selectedCourse) {
    const allLessonIds = selectedCourse.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const completedCount = allLessonIds.filter((id) => completedLessonIds.includes(id)).length;
    const progressPct = Math.round((completedCount / Math.max(1, allLessonIds.length)) * 100);
    const isEnrolled = enrolledCourseIds.includes(selectedCourse.id);
    const courseLevel = getCourseLevel(selectedCourse);

    return (
      <div className="space-y-6 w-full">
        <button
          onClick={() => navigate('academy')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A5B1C8] hover:text-[#F5F7FF]"
        >
          <ArrowLeft className="w-4 h-4" />
          Dib ugu noqo Akadeemiyada
        </button>

        <div className="cyber-card overflow-hidden p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-[#713BFF]/20 border border-[#713BFF]/40 text-[#08D9E8]">
                {courseLevel}
              </span>
              <span className="text-[#08D9E8]">
                {ACADEMY_CATEGORIES_SO[selectedCourse.category] || selectedCourse.category} ·{' '}
                {DIFFICULTY_SO[selectedCourse.difficulty]} · {selectedCourse.duration}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF]">{selectedCourse.title}</h1>
            <p className="text-sm text-[#A5B1C8] leading-relaxed">{selectedCourse.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#A5B1C8]">
              <span className="flex items-center gap-1 text-[#FF9F43] font-semibold">
                <Star className="w-4 h-4" /> {selectedCourse.rating}
              </span>
              <span className="flex items-center gap-1 tabular-nums">
                <Users className="w-4 h-4" /> {selectedCourse.studentsCount.toLocaleString()} arday
              </span>
              <span>
                Macallinka: {selectedCourse.instructor.name} ({selectedCourse.instructor.role})
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openLessonReader(selectedCourse)}
                className="px-6 py-3 rounded-xl cyber-gradient-btn text-white text-sm font-semibold flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                {isEnrolled ? 'Sii Wad Slides-ka' : 'Bilow Slides-ka'}
              </button>

              {selectedCourse.videoUrl && (
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-[#14213B] border border-[#08D9E8]/40 hover:border-[#08D9E8] text-xs sm:text-sm font-semibold text-[#08D9E8] flex items-center gap-2 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Daawo Muuqaalka Koorsada ({selectedCourse.duration})
                </button>
              )}

              {selectedCourse.pdfUrl && (
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-[#14213B] border border-[#713BFF]/40 hover:border-[#713BFF] text-xs sm:text-sm font-semibold text-[#F5F7FF] flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#08D9E8]" />
                  Akhri Buugga (PDF)
                </button>
              )}

              <div className="text-xs text-[#A5B1C8] tabular-nums">
                Horumarka: <strong className="text-[#12D69A]">{progressPct}%</strong> ({completedCount}/
                {allLessonIds.length} cashar)
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[rgba(120,150,210,0.2)]">
              <SafeImage src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-56 object-cover" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <div className="cyber-card p-6 space-y-4">
              <h2 className="text-base font-bold text-[#F5F7FF]">Ujeeddooyinka Waxbarashada</h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#A5B1C8]">
                {selectedCourse.learningObjectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#12D69A] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
              <div className="cyber-card p-6 space-y-3">
                <h2 className="text-base font-bold text-[#F5F7FF] flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-[#08D9E8]" />
                  Shuruudaha Hore (Prerequisites)
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-[#A5B1C8]">
                  {selectedCourse.prerequisites.map((req) => (
                    <li key={req} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#08D9E8] shrink-0 mt-2" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedCourse.capstoneProject && (
              <div className="cyber-card p-6 space-y-2.5 border-[#12D69A]/30">
                <h2 className="text-base font-bold text-[#12D69A] flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Mashruuca Dhammaystirka (Capstone Project)
                </h2>
                <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">
                  {selectedCourse.capstoneProject}
                </p>
              </div>
            )}

            {selectedCourse.references && selectedCourse.references.length > 0 && (
              <div className="cyber-card p-6 space-y-3">
                <h2 className="text-base font-bold text-[#F5F7FF]">Xigashooyinka Rasmiga ah</h2>
                <div className="flex flex-col gap-2">
                  {selectedCourse.references.map((ref) => (
                    <a
                      key={ref.url}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)] text-xs text-[#A5B1C8] hover:text-[#08D9E8] hover:border-[#08D9E8]/40 transition-colors"
                    >
                      <span className="truncate">{ref.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 cyber-card p-6 space-y-4">
            <h2 className="text-base font-bold text-[#F5F7FF]">Manhajka Koorsada & Casharrada</h2>
            <div className="space-y-4">
              {selectedCourse.modules.map((mod) => (
                <div key={mod.id} className="rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[rgba(120,150,210,0.12)] text-xs font-semibold text-[#F5F7FF]">
                    {mod.title}
                  </div>
                  <div className="divide-y divide-[rgba(120,150,210,0.1)]">
                    {mod.lessons.map((lesson) => {
                      const done = completedLessonIds.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => openLessonReader(selectedCourse, lesson)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#14213B] transition-colors gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${done ? 'text-[#12D69A]' : 'text-[#A5B1C8]/40'}`} />
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm text-[#F5F7FF] truncate">{lesson.title}</div>
                              <div className="text-[11px] text-[#A5B1C8] truncate mt-0.5">
                                {lesson.explanation.length >= 2 ? '8–9 Slides' : '7 Slides'} · Terminaal + Imtixaan
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-[#A5B1C8] shrink-0 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal
          open={videoModalOpen && Boolean(selectedCourse.videoUrl)}
          onClose={() => setVideoModalOpen(false)}
          title={`${selectedCourse.title} — Muuqaalka Koorsada`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-3">
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[rgba(120,150,210,0.2)] bg-[#050B18]">
              {selectedCourse.videoUrl && (
                <iframe
                  src={selectedCourse.videoUrl}
                  title={selectedCourse.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#A5B1C8]">
              <span>
                Xigasho: <strong className="text-[#F5F7FF]">{selectedCourse.instructor.name}</strong> —{' '}
                {selectedCourse.instructor.role}
              </span>
              <span>Muddada: {selectedCourse.duration}</span>
            </div>
          </div>
        </Modal>

        <Modal
          open={pdfModalOpen && Boolean(selectedCourse.pdfUrl)}
          onClose={() => setPdfModalOpen(false)}
          title={`${selectedCourse.title} — Buugga PDF`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-3">
            <div className="h-[70vh] w-full rounded-xl overflow-hidden border border-[rgba(120,150,210,0.2)] bg-[#050B18]">
              {selectedCourse.pdfUrl && (
                <iframe
                  src={selectedCourse.pdfUrl}
                  title={selectedCourse.title}
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // ACADEMY HOMEPAGE (AF-SOOMAALI · 4 LEVELS)
  const filteredCourses = courses.filter((c) => {
    const courseLevel = getCourseLevel(c);
    if (selectedLevel !== 'All' && courseLevel !== selectedLevel) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (filterTab === 'Featured' && !c.isFeatured) return false;
    if (filterTab === 'Recommended' && !c.isRecommended) return false;
    if (filterTab === 'My Learning' && !enrolledCourseIds.includes(c.id)) return false;
    if (difficultyFilter !== 'All' && c.difficulty !== difficultyFilter) return false;
    const catSomali = (ACADEMY_CATEGORIES_SO[c.category] || c.category).toLowerCase();
    if (
      query.trim() &&
      !c.title.toLowerCase().includes(query.toLowerCase()) &&
      !c.category.toLowerCase().includes(query.toLowerCase()) &&
      !catSomali.includes(query.toLowerCase()) &&
      !c.description.toLowerCase().includes(query.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FF]">Akadeemiyada Amniga Cyber-ka (4 Heer)</h1>
          <p className="text-xs sm:text-sm text-[#A5B1C8] mt-1">
            Waxbarasho si fudud loo fahmi karo oo ka kooban 4 heer (Bilow ilaa Khabiir), slides muuqaal ah oo ballaaran, jaantusyo farsamo oo la xaqiijiyay, terminaal is qoraya, iyo imtixaan.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#A5B1C8] absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Raadi koorsooyin..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
          />
        </div>
      </div>

      {/* 4-Level Master Academy Roadmap Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ACADEMY_LEVELS.map((lvl) => {
          const count =
            lvl.id === 'All'
              ? courses.length
              : courses.filter((c) => getCourseLevel(c) === lvl.id).length;
          const active = selectedLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2 ${
                active
                  ? 'bg-gradient-to-br from-[#713BFF]/25 to-[#1677FF]/20 border-[#08D9E8] shadow-lg shadow-[#08D9E8]/10'
                  : 'bg-[#101A30] border-[rgba(120,150,210,0.16)] hover:border-[#713BFF]/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-[#08D9E8] tracking-wider">
                  {lvl.badge}
                </span>
                <span className="text-[11px] font-semibold text-[#12D69A] tabular-nums">
                  {count} koorso
                </span>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#F5F7FF] leading-snug">{lvl.title}</div>
                <div className="text-[11px] text-[#A5B1C8] mt-0.5 line-clamp-2">{lvl.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Primary View Tabs & Difficulty Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Featured', 'Recommended', 'My Learning'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                filterTab === tab
                  ? 'bg-gradient-to-r from-[#713BFF] to-[#1677FF] text-white'
                  : 'bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-[#A5B1C8] hover:text-[#F5F7FF]'
              }`}
            >
              {FILTER_TAB_SO[tab]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficultyFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                difficultyFilter === lvl
                  ? 'bg-[#14213B] text-[#08D9E8] border border-[#08D9E8]/40'
                  : 'bg-[#0A1224] text-[#A5B1C8]'
              }`}
            >
              {DIFFICULTY_SO[lvl]}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Horizontal Scrollable Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {ACADEMY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-[#713BFF] text-white'
                : 'bg-[#101A30] border border-[rgba(120,150,210,0.16)] text-[#A5B1C8] hover:text-[#F5F7FF]'
            }`}
          >
            {ACADEMY_CATEGORIES_SO[cat] || cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="cyber-card p-10 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-[#08D9E8] mx-auto" />
          <div className="text-sm font-semibold text-[#F5F7FF]">Ma jirto koorso u dhiganta shaandhayntaada</div>
          <button
            onClick={() => {
              setSelectedLevel('All');
              setSelectedCategory('All');
              setFilterTab('All');
              setDifficultyFilter('All');
              setQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#14213B] text-xs font-semibold text-[#08D9E8]"
          >
            Dib u Deji Shaandhaynta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
            const doneCount = lessonIds.filter((id) => completedLessonIds.includes(id)).length;
            const pct = Math.round((doneCount / Math.max(1, lessonIds.length)) * 100);
            const lockedPreview = course.isPremium && user.membership === 'Free';
            const courseLevel = getCourseLevel(course);

            return (
              <div
                key={course.id}
                className="cyber-card overflow-hidden flex flex-col justify-between hover:border-[#713BFF]/50 transition-colors"
              >
                <div>
                  <SafeImage src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-[#08D9E8] font-semibold truncate">
                        {ACADEMY_CATEGORIES_SO[course.category] || course.category}
                      </span>
                      <span className="text-[#FF9F43] font-semibold tabular-nums shrink-0">{course.rating} ★</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#12D69A]">
                      <Layers className="w-3 h-3" />
                      <span>{courseLevel}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#F5F7FF] leading-snug">{course.title}</h3>
                    <p className="text-xs text-[#A5B1C8] line-clamp-2">{course.description}</p>
                    <div className="text-[11px] text-[#A5B1C8] pt-1 flex items-center justify-between gap-2">
                      <span>
                        {DIFFICULTY_SO[course.difficulty]} · {course.duration} · {lessonIds.length} cashar
                      </span>
                      {course.videoUrl && (
                        <span className="text-[#12D69A] font-semibold inline-flex items-center gap-1">
                          <Video className="w-3 h-3" /> 58m Video
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#A5B1C8] tabular-nums">
                      <span>Horumarka</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#050B18] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#713BFF] to-[#12D69A]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openCourseDetail(course)}
                      className="flex-1 py-2.5 rounded-xl bg-[#14213B] hover:bg-[#1A2B4D] text-xs font-semibold text-[#F5F7FF]"
                    >
                      Eeg Manhajka
                    </button>
                    <button
                      onClick={() => openLessonReader(course)}
                      className="flex-1 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      {lockedPreview && <Lock className="w-3.5 h-3.5" />}
                      Bilow Slides-ka
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

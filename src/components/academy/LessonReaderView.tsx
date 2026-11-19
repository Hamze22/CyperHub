import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Terminal as TerminalIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  FlaskConical,
  Video,
  FileText,
  ExternalLink,
  Lightbulb,
  ShieldCheck,
  HelpCircle,
  Mic,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Modal, SafeImage } from '../ui/Primitives';
import { runSimulatedCommand } from '../../data/terminal';
import { LessonQuizQuestion } from '../../types';

interface VideoCommandStep {
  caption?: string;
  command: string;
  output: string;
}

interface DynamicSlideMeta {
  id:
    | 'intro'
    | 'concept-1'
    | 'concept-2'
    | 'diagram'
    | 'script'
    | 'terms'
    | 'commands'
    | 'lab-steps'
    | 'terminal-video'
    | 'exercise';
  shortLabel: string;
}

function parseCodeToVideoSteps(rawCode: string): VideoCommandStep[] {
  const lines = rawCode.split('\n');
  const steps: VideoCommandStep[] = [];
  let pendingCaption: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) {
      pendingCaption = trimmed.replace(/^#+\s*/, '');
      continue;
    }
    const simResult = runSimulatedCommand(trimmed, 'kali');
    const output = !simResult.isError
      ? simResult.output
      : `[Tusaale la Duubay] Waxaa si nadiif ah loo fuliyay:\n  ${trimmed}`;

    steps.push({ caption: pendingCaption, command: trimmed, output });
    pendingCaption = undefined;
  }

  if (steps.length === 0) {
    steps.push({
      caption: 'Hubi xogta nidaamka Linux',
      command: 'whoami && pwd && uname -a',
      output: runSimulatedCommand('whoami && pwd && uname -a', 'kali').output,
    });
  }
  return steps;
}

const SLIDE_IMAGES = [
  '/src/assets/images/course_linux_security_1794945375555.jpg',
  '/src/assets/images/cyberhub_hero_banner_1794945376019.jpg',
  '/src/assets/images/course_ethical_hacking_1794945376978.jpg',
  '/src/assets/images/course_web_security_1794945377421.jpg',
];

const isSvgAsset = (url?: string) => Boolean(url && url.toLowerCase().split('?')[0].endsWith('.svg'));

export const LessonReaderView: React.FC = () => {
  const {
    selectedCourse,
    selectedLesson,
    setSelectedLesson,
    completedLessonIds,
    markLessonComplete,
    navigate,
  } = useApp();

  const [slideIndex, setSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [autoAdvanceSlides, setAutoAdvanceSlides] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  // Video-like Auto-Typing Terminal state
  const videoSteps = useMemo(
    () => parseCodeToVideoSteps(selectedLesson.codeExample.code),
    [selectedLesson.id, selectedLesson.codeExample.code]
  );
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoSpeed, setVideoSpeed] = useState<1 | 1.5 | 2>(1);
  const [stepIdx, setStepIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showOutputLines, setShowOutputLines] = useState(0);
  const [completedVideoSteps, setCompletedVideoSteps] = useState<VideoCommandStep[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // End-of-lesson interactive Exercise & Multi-Quiz state
  const [exerciseCmd, setExerciseCmd] = useState('');
  const [exerciseLogs, setExerciseLogs] = useState<{ cmd: string; out: string; ok: boolean }[]>([]);
  const [exerciseTerminalPassed, setExerciseTerminalPassed] = useState(false);
  const [quizSelections, setQuizSelections] = useState<Record<string, number>>({});
  const [quizSubmittedMap, setQuizSubmittedMap] = useState<Record<string, boolean>>({});

  const allLessons = selectedCourse.modules.flatMap((m) => m.lessons);
  const currentLessonIdx = allLessons.findIndex((l) => l.id === selectedLesson.id);
  const nextLesson =
    currentLessonIdx >= 0 && currentLessonIdx < allLessons.length - 1 ? allLessons[currentLessonIdx + 1] : null;
  const isCompleted = completedLessonIds.includes(selectedLesson.id);

  // Dynamic slides adapted to the exact richness & length of each lesson
  const slides = useMemo<DynamicSlideMeta[]>(() => {
    const items: DynamicSlideMeta[] = [
      { id: 'intro', shortLabel: 'Hordhac & Sawir' },
      { id: 'concept-1', shortLabel: 'Fahamka Fudud' },
    ];

    if (selectedLesson.explanation.length >= 2) {
      items.push({ id: 'concept-2', shortLabel: 'Faahfaahin Dheeraad ah' });
    }

    items.push({ id: 'diagram', shortLabel: 'Jaantuska & Habka' });
    items.push({ id: 'script', shortLabel: 'Sharaxaadda Macallinka' });
    items.push({ id: 'terms', shortLabel: 'Erey-bixinta' });

    if (selectedLesson.commandBreakdown && selectedLesson.commandBreakdown.length >= 3) {
      items.push({ id: 'commands', shortLabel: 'Calammada Amarka' });
    }

    if ((selectedLesson.labSteps && selectedLesson.labSteps.length > 0) || videoSteps.length > 0) {
      items.push({ id: 'lab-steps', shortLabel: 'Tallaabooyinka Lab-ka' });
    }

    items.push({ id: 'terminal-video', shortLabel: 'Terminaalka Is Qoraya' });
    items.push({ id: 'exercise', shortLabel: 'Layliga & Imtixaanka' });

    return items;
  }, [selectedLesson.id, selectedLesson.explanation.length, selectedLesson.commandBreakdown, selectedLesson.labSteps, videoSteps.length]);

  const currentSlide = slides[slideIndex] || slides[0];

  const allQuizzes = useMemo<LessonQuizQuestion[]>(() => {
    return [selectedLesson.knowledgeCheck, ...(selectedLesson.additionalQuizzes || [])];
  }, [selectedLesson.knowledgeCheck, selectedLesson.additionalQuizzes]);

  const lectureChapters = useMemo(() => {
    if (selectedLesson.videoScript && selectedLesson.videoScript.length > 0) {
      return selectedLesson.videoScript;
    }
    return [
      {
        chapter: 'Qaybta 1aad: Soo Dhaweynta & Ujeeddada',
        duration: '00:00 – 02:30',
        narration: `Ku soo dhawoow casharka "${selectedLesson.title}". ${selectedLesson.introduction}`,
      },
      {
        chapter: 'Qaybta 2aad: Fikradaha & Jaantuska Farsamada',
        duration: '02:30 – 06:00',
        narration:
          selectedLesson.explanation[0] ||
          `Waxaan eegaynaa qaabka ${selectedLesson.diagramTitle} u shaqeeyo tallaabo-tallaabo.`,
      },
      {
        chapter: 'Qaybta 3aad: Dhaqan-gelinta & Soo Koobidda',
        duration: '06:00 – 09:30',
        narration: `${selectedLesson.practicalExample} Markaad dhammayso terminalka iyo layliga, waxaad diyaar u tahay casharka xiga.`,
      },
    ];
  }, [selectedLesson]);

  const derivedLabSteps = useMemo(() => {
    if (selectedLesson.labSteps && selectedLesson.labSteps.length > 0) {
      return selectedLesson.labSteps;
    }
    return [
      'Hubi inaad ku jirto jawi tababar oo la oggol yahay (Kali Linux ama Ubuntu Sandbox).',
      `Akhri ujeeddada layliga: ${selectedLesson.exercisePrompt}`,
      `Ku tijaabi amarka aasaasiga ah (\`${videoSteps[0]?.command || 'whoami'}\`) gudaha Console-ka Tababarka.`,
      'Ka jawaab su’aalaha hubinta fahamka si casharku u xirmo.',
    ];
  }, [selectedLesson.labSteps, selectedLesson.exercisePrompt, videoSteps]);

  const combinedReferences = useMemo(() => {
    const map = new Map<string, { title: string; url: string }>();
    for (const r of selectedLesson.references || []) map.set(r.url, r);
    for (const r of selectedCourse.references || []) map.set(r.url, r);
    return Array.from(map.values());
  }, [selectedLesson.references, selectedCourse.references]);

  // Reset states when switching lessons
  useEffect(() => {
    setSlideIndex(0);
    setSlideDirection(1);
    setStepIdx(0);
    setCharIdx(0);
    setShowOutputLines(0);
    setCompletedVideoSteps([]);
    setVideoPlaying(true);
    setExerciseCmd('');
    setExerciseLogs([]);
    setExerciseTerminalPassed(false);
    setQuizSelections({});
    setQuizSubmittedMap({});
  }, [selectedLesson.id]);

  // Ensure playback starts cleanly when entering Terminal Demo slide
  useEffect(() => {
    if (currentSlide?.id === 'terminal-video' && completedVideoSteps.length === 0 && charIdx === 0) {
      setVideoPlaying(true);
    }
  }, [currentSlide?.id, completedVideoSteps.length, charIdx]);

  // Character-by-character video typing engine
  useEffect(() => {
    if (currentSlide?.id !== 'terminal-video' || !videoPlaying) return;
    if (stepIdx >= videoSteps.length) return;

    const currentStep = videoSteps[stepIdx];
    const outputLines = currentStep.output.split('\n');
    const baseDelay = Math.round(40 / videoSpeed);

    if (charIdx < currentStep.command.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), baseDelay);
      return () => clearTimeout(t);
    }

    if (showOutputLines < outputLines.length) {
      const t = setTimeout(() => setShowOutputLines((l) => l + 1), Math.round(130 / videoSpeed));
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setCompletedVideoSteps((prev) => [...prev, currentStep]);
      setStepIdx((s) => s + 1);
      setCharIdx(0);
      setShowOutputLines(0);
    }, Math.round(850 / videoSpeed));

    return () => clearTimeout(t);
  }, [currentSlide?.id, videoPlaying, videoSpeed, stepIdx, charIdx, showOutputLines, videoSteps]);

  // Optional auto-advance slideshow (pauses on Terminal Video & Final Exercise)
  useEffect(() => {
    if (
      !autoAdvanceSlides ||
      currentSlide?.id === 'terminal-video' ||
      currentSlide?.id === 'exercise' ||
      slideIndex >= slides.length - 1
    ) {
      return;
    }
    const t = setTimeout(() => {
      goToSlide(slideIndex + 1);
    }, 6500);
    return () => clearTimeout(t);
  }, [autoAdvanceSlides, slideIndex, currentSlide?.id, slides.length]);

  const goToSlide = (targetIdx: number) => {
    const bounded = Math.max(0, Math.min(slides.length - 1, targetIdx));
    setSlideDirection(bounded >= slideIndex ? 1 : -1);
    setSlideIndex(bounded);
  };

  // Keyboard arrow navigation between slides (ignored while typing in inputs)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' && slideIndex < slides.length - 1) {
        goToSlide(slideIndex + 1);
      } else if (e.key === 'ArrowLeft' && slideIndex > 0) {
        goToSlide(slideIndex - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slideIndex, slides.length]);

  const replayVideo = () => {
    setStepIdx(0);
    setCharIdx(0);
    setShowOutputLines(0);
    setCompletedVideoSteps([]);
    setVideoPlaying(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(selectedLesson.codeExample.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  // Validate End-of-Lesson Practice Terminal command (skipping 'sudo' prefix if present)
  const expectedPrimaryCmd = videoSteps[0]?.command || 'ls -la';
  const expectedTokens = expectedPrimaryCmd.toLowerCase().split(/\s+/);
  const expectedKeyword = expectedTokens[0] === 'sudo' && expectedTokens[1] ? expectedTokens[1] : expectedTokens[0];

  const handleRunExerciseCmd = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const res = runSimulatedCommand(trimmed, 'kali');
    const lower = trimmed.toLowerCase();
    const matchesLesson =
      lower.includes(expectedKeyword) ||
      (selectedLesson.exercisePrompt.toLowerCase().includes('auth.log') && lower.includes('auth.log')) ||
      (selectedLesson.exercisePrompt.toLowerCase().includes('nmap') && lower.includes('nmap')) ||
      (selectedLesson.exercisePrompt.toLowerCase().includes('chmod') && lower.includes('chmod')) ||
      !res.isError;

    setExerciseLogs((prev) => [...prev, { cmd: trimmed, out: res.output, ok: matchesLesson && !res.isError }]);
    if (matchesLesson && !res.isError) {
      setExerciseTerminalPassed(true);
    }
    setExerciseCmd('');
  };

  const allQuizzesPassed = allQuizzes.every(
    (q) => quizSubmittedMap[q.id] && quizSelections[q.id] === q.correctIndex
  );
  const bothExercisePartsDone = exerciseTerminalPassed && allQuizzesPassed;

  useEffect(() => {
    if (bothExercisePartsDone && !isCompleted) {
      markLessonComplete(selectedLesson.id, selectedCourse.id);
    }
  }, [bothExercisePartsDone, isCompleted, selectedLesson.id, selectedCourse.id, markLessonComplete]);

  const slideVisualImage =
    selectedLesson.imageUrl ||
    (slideIndex === 0
      ? selectedCourse.thumbnail || SLIDE_IMAGES[0]
      : SLIDE_IMAGES[(currentLessonIdx + slideIndex) % SLIDE_IMAGES.length]);
  const visualIsSvg = isSvgAsset(slideVisualImage);

  const totalVideoUnits = videoSteps.reduce(
    (acc, st) => acc + st.command.length + st.output.split('\n').length,
    0
  );
  const doneVideoUnits =
    completedVideoSteps.reduce(
      (acc, st) => acc + st.command.length + st.output.split('\n').length,
      0
    ) +
    (stepIdx < videoSteps.length ? charIdx + showOutputLines : 0);
  const videoProgressPct =
    stepIdx >= videoSteps.length
      ? 100
      : Math.min(100, Math.round((doneVideoUnits / Math.max(1, totalVideoUnits)) * 100));

  const renderLessonVisualCard = (heightClass = 'h-56 sm:h-72') => (
    <div className="space-y-2">
      <div
        className={`rounded-2xl overflow-hidden border border-[rgba(120,150,210,0.25)] shadow-2xl ${
          visualIsSvg ? 'bg-[#F8FAFC] p-3' : 'bg-[#050B18]'
        }`}
      >
        <SafeImage
          src={slideVisualImage}
          alt={selectedLesson.imageCaption || selectedLesson.title}
          fallbackLabel={selectedLesson.title}
          className={`w-full ${heightClass} ${visualIsSvg ? 'object-contain' : 'object-cover'}`}
        />
      </div>
      {(selectedLesson.imageCaption || selectedLesson.imageSourceUrl) && (
        <div className="text-[11px] text-[#A5B1C8] text-center px-2 space-y-1">
          {selectedLesson.imageCaption && <div>{selectedLesson.imageCaption}</div>}
          {selectedLesson.imageSourceUrl && (
            <div>
              <a
                href={selectedLesson.imageSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#08D9E8] hover:underline"
              >
                <span>{selectedLesson.imageAttribution || 'Xigashada Sawirka'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 w-full">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate('course-detail')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A5B1C8] hover:text-[#F5F7FF]"
        >
          <ArrowLeft className="w-4 h-4" />
          Dib ugu noqo {selectedCourse.title}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {selectedCourse.pdfUrl && (
            <button
              onClick={() => setPdfModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#101A30] border border-[#713BFF]/40 text-xs font-semibold text-[#F5F7FF] hover:bg-[#14213B] flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#08D9E8]" />
              Akhri Buugga (PDF)
            </button>
          )}

          {selectedCourse.videoUrl && (
            <button
              onClick={() => setVideoModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#101A30] border border-[#08D9E8]/40 text-xs font-semibold text-[#08D9E8] hover:bg-[#14213B] flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              Daawo Muuqaalka ({selectedCourse.duration})
            </button>
          )}

          <button
            onClick={() => setAutoAdvanceSlides((v) => !v)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              autoAdvanceSlides
                ? 'bg-[#08D9E8]/15 border-[#08D9E8] text-[#08D9E8]'
                : 'bg-[#101A30] border-[rgba(120,150,210,0.2)] text-[#A5B1C8] hover:text-[#F5F7FF]'
            }`}
          >
            {autoAdvanceSlides ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoAdvanceSlides ? 'Muuqaal Slides: SOCDA' : 'Daawo Sida Muuqaal'}
          </button>

          <button
            onClick={() => goToSlide(slides.length - 1)}
            className="px-3.5 py-2 rounded-xl bg-[#14213B] border border-[#713BFF]/40 text-xs font-semibold text-[#F5F7FF] hover:border-[#713BFF] flex items-center gap-1.5"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#08D9E8]" />
            Layliga Ugu Dambeeya
          </button>

          {nextLesson && (
            <button
              onClick={() => setSelectedLesson(nextLesson)}
              className="px-4 py-2 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center gap-1.5"
            >
              Casharka Xiga
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Layout: Left Curriculum + Center Interactive Animated Slides Stage */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left: Curriculum Tree */}
        <aside className="xl:col-span-3 cyber-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#08D9E8]">
              <BookOpen className="w-4 h-4" />
              Manhajka Koorsada
            </div>
            <span className="text-[11px] text-[#A5B1C8] tabular-nums">
              {currentLessonIdx + 1}/{allLessons.length}
            </span>
          </div>

          {selectedCourse.academyLevel && (
            <div className="px-3 py-2 rounded-xl bg-[#0A1224] border border-[#713BFF]/30 text-[11px] font-semibold text-[#08D9E8]">
              {selectedCourse.academyLevel}
            </div>
          )}

          <div className="space-y-3">
            {selectedCourse.modules.map((mod) => (
              <div key={mod.id} className="space-y-1.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A5B1C8]">
                  {mod.title}
                </div>
                {mod.lessons.map((les) => {
                  const active = les.id === selectedLesson.id;
                  const done = completedLessonIds.includes(les.id);
                  return (
                    <button
                      key={les.id}
                      onClick={() => setSelectedLesson(les)}
                      className={`w-full px-3 py-2.5 rounded-xl text-left text-xs flex items-center gap-2 transition-colors ${
                        active
                          ? 'bg-gradient-to-r from-[#713BFF] to-[#1677FF] text-white font-semibold'
                          : 'bg-[#0A1224] text-[#A5B1C8] hover:text-[#F5F7FF]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${done ? 'text-[#12D69A]' : 'opacity-40'}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{les.title}</div>
                        {les.levelTag && (
                          <div className={`text-[10px] mt-0.5 ${active ? 'text-white/80' : 'text-[#08D9E8]/80'}`}>
                            {les.levelTag}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Animated Slides + Auto-Typing Terminal + End-of-Lesson Exercise Stage */}
        <main className="xl:col-span-9 space-y-4">
          {/* Dynamic Slide Stepper Navigation */}
          <div className="cyber-card p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F5F7FF]">
                <Layers className="w-4 h-4 text-[#08D9E8]" />
                <span>{selectedLesson.title}</span>
                {isCompleted && (
                  <span className="text-[#12D69A] flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Waa La Dhammeeyay
                  </span>
                )}
              </div>
              <span className="text-xs text-[#A5B1C8] tabular-nums">
                Slide {slideIndex + 1} ka mid ah {slides.length}
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    slideIndex === idx
                      ? 'bg-[#713BFF] text-white shadow-md shadow-[#713BFF]/25'
                      : idx < slideIndex
                      ? 'bg-[#12D69A]/15 text-[#12D69A] border border-[#12D69A]/30'
                      : 'bg-[#0A1224] text-[#A5B1C8] hover:text-[#F5F7FF]'
                  }`}
                >
                  {idx + 1}. {s.shortLabel}
                </button>
              ))}
            </div>

            <div className="h-1.5 rounded-full bg-[#050B18] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#713BFF] via-[#1677FF] to-[#08D9E8]"
                animate={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>

          {/* Animated Slide Viewport */}
          <div className="cyber-card p-5 sm:p-8 min-h-[480px] overflow-hidden relative flex flex-col justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${selectedLesson.id}-${currentSlide.id}`}
                initial={{ opacity: 0, x: slideDirection * 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: slideDirection * -40, scale: 0.98 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* SLIDE: INTRO & ILLUSTRATION */}
                {currentSlide.id === 'intro' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-[#08D9E8] uppercase tracking-wider">
                          Slide {String(slideIndex + 1).padStart(2, '0')} · Hordhaca Casharka · {selectedLesson.duration}
                        </span>
                        {selectedLesson.levelTag && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#713BFF]/20 border border-[#713BFF]/40 text-[11px] font-semibold text-[#F5F7FF]">
                            {selectedLesson.levelTag}
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] leading-tight">
                        {selectedLesson.title}
                      </h1>
                      <p className="text-sm text-[#A5B1C8] leading-relaxed">
                        {selectedLesson.introduction}
                      </p>

                      <div className="p-4 rounded-2xl bg-[#0A1224] border border-[rgba(120,150,210,0.18)] space-y-2.5">
                        <div className="text-xs font-bold text-[#08D9E8] uppercase tracking-wider">
                          Waxa Aad Baran Doonto (Ujeeddooyinka)
                        </div>
                        {selectedLesson.objectives.map((obj, idx) => (
                          <motion.div
                            key={obj}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 + idx * 0.07 }}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F5F7FF]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#12D69A] shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.12 }}
                      className="lg:col-span-5"
                    >
                      {renderLessonVisualCard('h-56 sm:h-72')}
                    </motion.div>
                  </div>
                )}

                {/* SLIDE: CORE CONCEPT (SIMPLE BITE-SIZED PART 1) */}
                {currentSlide.id === 'concept-1' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="text-xs font-semibold text-[#08D9E8] uppercase tracking-wider">
                        Slide {String(slideIndex + 1).padStart(2, '0')} · Fahamka Aasaasiga ah
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF]">
                        Sidee U Shaqaysaa? (Sharaxaad Fudud)
                      </h2>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-[#0A1224] border border-[rgba(120,150,210,0.18)] text-sm text-[#F5F7FF] leading-relaxed"
                      >
                        {selectedLesson.explanation[0] || selectedLesson.introduction}
                      </motion.div>

                      <div className="p-4 rounded-2xl bg-[#12D69A]/10 border border-[#12D69A]/30 space-y-1.5">
                        <div className="text-xs font-bold text-[#12D69A] flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4" />
                          Xusuus Fudud
                        </div>
                        <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">
                          {selectedLesson.objectives[0] || selectedLesson.practicalExample}
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      {renderLessonVisualCard('h-52 sm:h-64')}
                    </div>
                  </div>
                )}

                {/* SLIDE: DEEP DIVE EXPLANATION (PART 2 WHEN MULTIPLE PARAGRAPHS EXIST) */}
                {currentSlide.id === 'concept-2' && (
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs font-semibold text-[#08D9E8] uppercase tracking-wider">
                        Slide {String(slideIndex + 1).padStart(2, '0')} · Faahfaahinta Dheeraadka ah
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] mt-1">
                        Qodobbo Muhiim ah oo Farsamo
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedLesson.explanation.slice(1).map((para, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-5 rounded-2xl bg-[#0A1224] border border-[#713BFF]/25 space-y-2"
                        >
                          <div className="text-[11px] font-mono font-bold text-[#08D9E8]">
                            QODOBKA 0{idx + 2}
                          </div>
                          <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">{para}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#14213B] border border-[rgba(120,150,210,0.2)] flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#08D9E8] shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-[#F5F7FF] leading-relaxed">
                        <strong className="text-[#08D9E8]">Isku Xirka Shaqada: </strong>
                        {selectedLesson.practicalExample}
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE: TECHNICAL FLOW DIAGRAM */}
                {currentSlide.id === 'diagram' && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-semibold text-[#08D9E8] uppercase tracking-wider">
                        Slide {String(slideIndex + 1).padStart(2, '0')} · Jaantuska Farsamada & Socodka Shaqada
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] mt-1">
                        {selectedLesson.diagramTitle}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {selectedLesson.diagramNodes.map((node, idx) => (
                        <motion.div
                          key={node.step}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + idx * 0.1 }}
                          className="p-5 rounded-2xl bg-[#14213B] border border-[#713BFF]/40 space-y-2 relative"
                        >
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-[#08D9E8]/15 text-[11px] font-mono font-bold text-[#08D9E8]">
                            TALLAABO {node.step}
                          </div>
                          <div className="text-base font-bold text-[#F5F7FF]">{node.label}</div>
                          <div className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">{node.detail}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#713BFF]/10 border border-[#713BFF]/35 space-y-1.5">
                      <div className="text-xs font-bold text-[#F5F7FF] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#08D9E8]" />
                        Tusaalaha Dhabta ah (Practical Context)
                      </div>
                      <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">
                        {selectedLesson.practicalExample}
                      </p>
                    </div>
                  </div>
                )}

                {/* SLIDE: GUIDED INSTRUCTOR NARRATION & CHAPTERS */}
                {currentSlide.id === 'script' && (
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs font-semibold text-[#08D9E8] uppercase tracking-wider flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5" />
                        Slide {String(slideIndex + 1).padStart(2, '0')} · Sharaxaadda Macallinka (Lecture Chapters)
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] mt-1">
                        Qaybaha Casharka & Hagista Macallinka
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {lectureChapters.map((chap, idx) => (
                        <motion.div
                          key={chap.chapter}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="p-4 rounded-2xl bg-[#0A1224] border border-[rgba(120,150,210,0.18)] space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-bold text-[#F5F7FF]">{chap.chapter}</span>
                            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#14213B] text-[#08D9E8]">
                              {chap.duration}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">
                            “{chap.narration}”
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SLIDE: KEY TERMS */}
                {currentSlide.id === 'terms' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="text-xs font-semibold text-[#08D9E8] uppercase tracking-wider">
                        Slide {String(slideIndex + 1).padStart(2, '0')} · Erey-bixinta Muhiimka ah
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF]">
                        Ereyada Farsamada ee Casharkan
                      </h2>

                      <div className="space-y-2.5">
                        {selectedLesson.keyTerms.map((kt, idx) => (
                          <motion.div
                            key={kt.term}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.07 * idx }}
                            className="p-4 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)]"
                          >
                            <div className="text-xs sm:text-sm font-bold text-[#08D9E8]">{kt.term}</div>
                            <div className="text-xs sm:text-sm text-[#A5B1C8] mt-1 leading-relaxed">{kt.definition}</div>
                          </motion.div>
                        ))}
                      </div>

                      {selectedLesson.commandBreakdown &&
                        selectedLesson.commandBreakdown.length > 0 &&
                        selectedLesson.commandBreakdown.length < 3 && (
                          <div className="p-4 rounded-2xl bg-[#0A1224] border border-[#08D9E8]/25 space-y-2.5">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#12D69A]">
                              Faahfaahinta Amarrada
                            </div>
                            <div className="space-y-2">
                              {selectedLesson.commandBreakdown.map((item) => (
                                <div
                                  key={item.flag}
                                  className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3 text-xs border-b border-[rgba(120,150,210,0.1)] pb-2 last:border-b-0 last:pb-0"
                                >
                                  <code className="font-mono font-bold text-[#08D9E8] shrink-0 sm:min-w-[140px]">
                                    {item.flag}
                                  </code>
                                  <span className="text-[#A5B1C8] leading-relaxed">{item.meaning}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                      {renderLessonVisualCard('h-44 sm:h-52')}
                    </div>
                  </div>
                )}

                {/* SLIDE: COMMAND FLAGS BREAKDOWN (WHEN >= 3 FLAGS) */}
                {currentSlide.id === 'commands' && selectedLesson.commandBreakdown && (
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs font-semibold text-[#12D69A] uppercase tracking-wider">
                        Slide {String(slideIndex + 1).padStart(2, '0')} · Faahfaahinta Amarrada & Calammada CLI
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] mt-1">
                        Mid Walba oo ka mid ah Flags-ka Muxuu Qabtaa?
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedLesson.commandBreakdown.map((item, idx) => (
                        <motion.div
                          key={item.flag}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className="p-4 rounded-2xl bg-[#0A1224] border border-[#08D9E8]/25 space-y-1.5"
                        >
                          <code className="inline-block px-2.5 py-1 rounded-lg bg-[#14213B] font-mono text-xs font-bold text-[#08D9E8]">
                            {item.flag}
                          </code>
                          <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">{item.meaning}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SLIDE: HANDS-ON LAB TUTORIAL STEPS */}
                {currentSlide.id === 'lab-steps' && (
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs font-semibold text-[#08D9E8] uppercase tracking-wider">
                        Slide {String(slideIndex + 1).padStart(2, '0')} · Hagaha Tababarka (Step-by-Step Lab)
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] mt-1">
                        Tallaabooyinka Lab-ka & Amniga Jawi-xiran
                      </h2>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#12D69A]/10 border border-[#12D69A]/30 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#12D69A] shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">
                        <strong className="text-[#F5F7FF]">Jawi La Oggol Yahay Keliya: </strong>
                        Ku fuli dhammaan tijaabooyinkan gudaha VirtualBox/VMware, Kali Linux, Ubuntu, ama Console-ka tababarka ee CyberHub (<code className="text-[#08D9E8]">10.10.10.x</code>).
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {derivedLabSteps.map((step, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="p-4 rounded-2xl bg-[#0A1224] border border-[rgba(120,150,210,0.18)] flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-lg bg-[#713BFF] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-[#F5F7FF] leading-relaxed">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SLIDE: VIDEO-LIKE AUTO-TYPING TERMINAL */}
                {currentSlide.id === 'terminal-video' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-[#08D9E8] uppercase tracking-wider">
                          Slide {String(slideIndex + 1).padStart(2, '0')} · Terminaal Is Qoraya Sida Muuqaal
                        </div>
                        <h2 className="text-xl font-bold text-[#F5F7FF] mt-0.5">
                          Daawo Amarrada Oo Tallaabo-Tallaabo U Socda
                        </h2>
                      </div>

                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1.5 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.2)] text-xs font-medium text-[#A5B1C8] hover:text-[#F5F7FF] flex items-center gap-1.5"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-[#12D69A]" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedCode ? 'La Koobiyeeyay' : 'Koobiyee Amarrada'}
                      </button>
                    </div>

                    {/* Video-style Terminal Frame */}
                    <div className="rounded-2xl overflow-hidden border border-[rgba(120,150,210,0.26)] bg-[#050B18] shadow-2xl">
                      <div className="px-4 py-2.5 bg-[#0A1224] border-b border-[rgba(120,150,210,0.16)] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-[#F5F7FF]">
                          <TerminalIcon className="w-4 h-4 text-[#12D69A]" />
                          <span>{selectedLesson.codeExample.filename}</span>
                          <span className="text-[11px] text-[#08D9E8]">
                            · {stepIdx >= videoSteps.length ? 'Dhammaaday' : videoPlaying ? 'Waa Socdaa' : 'Joogsaday'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (stepIdx >= videoSteps.length) {
                                replayVideo();
                              } else {
                                setVideoPlaying((p) => !p);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#713BFF] text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            {videoPlaying && stepIdx < videoSteps.length ? (
                              <>
                                <Pause className="w-3.5 h-3.5" /> Jooji
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" /> {stepIdx >= videoSteps.length ? 'Ku Celi' : 'Bilow'}
                              </>
                            )}
                          </button>

                          <button
                            onClick={replayVideo}
                            aria-label="Ku celi terminaalka"
                            className="p-1.5 rounded-lg bg-[#101A30] text-[#A5B1C8] hover:text-[#F5F7FF]"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex rounded-lg overflow-hidden border border-[rgba(120,150,210,0.2)] text-[11px]">
                            {([1, 1.5, 2] as const).map((spd) => (
                              <button
                                key={spd}
                                onClick={() => setVideoSpeed(spd)}
                                className={`px-2 py-1 font-mono ${
                                  videoSpeed === spd ? 'bg-[#1677FF] text-white' : 'bg-[#101A30] text-[#A5B1C8]'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 font-mono text-xs min-h-[270px] max-h-[340px] overflow-y-auto space-y-3">
                        {completedVideoSteps.map((st, idx) => (
                          <div key={idx} className="space-y-1">
                            {st.caption && <div className="text-[#A5B1C8]/70"># {st.caption}</div>}
                            <div className="text-[#12D69A]">
                              kali@cyberhub:~$ <span className="text-[#F5F7FF]">{st.command}</span>
                            </div>
                            <pre className="whitespace-pre-wrap text-[#A5B1C8] leading-relaxed">{st.output}</pre>
                          </div>
                        ))}

                        {stepIdx < videoSteps.length && (
                          <div className="space-y-1">
                            {videoSteps[stepIdx].caption && (
                              <div className="text-[#08D9E8]/80"># {videoSteps[stepIdx].caption}</div>
                            )}
                            <div className="text-[#12D69A]">
                              kali@cyberhub:~${' '}
                              <span className="text-[#F5F7FF]">
                                {videoSteps[stepIdx].command.slice(0, charIdx)}
                              </span>
                              <span className="inline-block w-2 h-4 bg-[#08D9E8] align-middle ml-0.5 animate-pulse" />
                            </div>
                            {showOutputLines > 0 && (
                              <pre className="whitespace-pre-wrap text-[#A5B1C8] leading-relaxed">
                                {videoSteps[stepIdx].output
                                  .split('\n')
                                  .slice(0, showOutputLines)
                                  .join('\n')}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="px-4 py-2.5 bg-[#0A1224] border-t border-[rgba(120,150,210,0.16)] flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-[#050B18] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#12D69A] to-[#08D9E8] transition-all duration-150"
                            style={{ width: `${videoProgressPct}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-[#A5B1C8] tabular-nums">
                          {videoProgressPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE: END-OF-LESSON INTERACTIVE EXERCISE, MULTI-QUIZ & REFERENCES */}
                {currentSlide.id === 'exercise' && (
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs font-semibold text-[#12D69A] uppercase tracking-wider">
                        Slide {String(slideIndex + 1).padStart(2, '0')} · Layliga & Imtixaanka Dhammaadka Casharka
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] mt-0.5">
                        Dhammaystir Labada Qaybood si Aad U Gudubto
                      </h2>
                      <p className="text-xs sm:text-sm text-[#A5B1C8] mt-1">
                        {selectedLesson.exercisePrompt}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* Part A: Interactive Practice Terminal */}
                      <div className="lg:col-span-6 rounded-2xl border border-[rgba(120,150,210,0.22)] bg-[#050B18] overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 bg-[#0A1224] border-b border-[rgba(120,150,210,0.16)] flex items-center justify-between gap-2">
                          <div className="text-xs font-semibold text-[#F5F7FF] flex items-center gap-2">
                            <TerminalIcon className="w-4 h-4 text-[#08D9E8]" />
                            Tallaabada 1aad: Console-ka Tababarka
                          </div>
                          {exerciseTerminalPassed ? (
                            <span className="text-xs font-semibold text-[#12D69A] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Waad Gudubtay
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setExerciseCmd(expectedPrimaryCmd)}
                              className="text-[11px] text-[#08D9E8] hover:underline font-mono"
                            >
                              Tusaale Buuxi (Hint)
                            </button>
                          )}
                        </div>

                        <div className="p-4 font-mono text-xs flex-1 min-h-[220px] max-h-[300px] overflow-y-auto space-y-2">
                          <div className="text-[#A5B1C8]/80">
                            Qor oo fuli amarka casharka (tijaabi: <span className="text-[#08D9E8]">{expectedPrimaryCmd}</span>)
                          </div>
                          {exerciseLogs.map((log, i) => (
                            <div key={i} className="space-y-1">
                              <div className="text-[#12D69A]">
                                kali@cyberhub:~$ <span className="text-[#F5F7FF]">{log.cmd}</span>
                              </div>
                              <pre className="whitespace-pre-wrap text-[#A5B1C8]">{log.out}</pre>
                            </div>
                          ))}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleRunExerciseCmd(exerciseCmd);
                            }}
                            className="flex items-center gap-2 pt-1"
                          >
                            <span className="text-[#12D69A] shrink-0">kali@cyberhub:~$</span>
                            <input
                              type="text"
                              value={exerciseCmd}
                              onChange={(e) => setExerciseCmd(e.target.value)}
                              placeholder="Qor amarka kadibna taabo Enter..."
                              className="w-full bg-transparent text-[#F5F7FF] focus:outline-none"
                            />
                          </form>
                        </div>
                      </div>

                      {/* Part B: Knowledge Check Verification (1 or Multiple Questions) */}
                      <div className="lg:col-span-6 space-y-4">
                        {allQuizzes.map((quiz, qIdx) => {
                          const chosenIdx = quizSelections[quiz.id];
                          const submitted = Boolean(quizSubmittedMap[quiz.id]);
                          const right = submitted && chosenIdx === quiz.correctIndex;

                          return (
                            <div
                              key={quiz.id}
                              className="p-4 rounded-2xl bg-[#0A1224] border border-[rgba(120,150,210,0.2)] space-y-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-[#08D9E8] flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  Su’aasha {qIdx + 1} / {allQuizzes.length}
                                </span>
                                {right && (
                                  <span className="text-xs font-semibold text-[#12D69A] flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Sax
                                  </span>
                                )}
                              </div>

                              <div className="text-sm font-medium text-[#F5F7FF]">{quiz.question}</div>

                              <div className="space-y-2">
                                {quiz.options.map((opt, idx) => {
                                  const chosen = chosenIdx === idx;
                                  const isRight = idx === quiz.correctIndex;
                                  let style = 'bg-[#101A30] border-[rgba(120,150,210,0.2)] text-[#A5B1C8]';
                                  if (submitted) {
                                    if (isRight) style = 'bg-[#12D69A]/15 border-[#12D69A] text-[#12D69A]';
                                    else if (chosen) style = 'bg-[#FF9F43]/15 border-[#FF9F43] text-[#FF9F43]';
                                  } else if (chosen) {
                                    style = 'bg-[#713BFF]/25 border-[#713BFF] text-[#F5F7FF]';
                                  }
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => {
                                        setQuizSelections((prev) => ({ ...prev, [quiz.id]: idx }));
                                        setQuizSubmittedMap((prev) => ({ ...prev, [quiz.id]: false }));
                                      }}
                                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors ${style}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              <button
                                onClick={() => {
                                  if (chosenIdx !== undefined) {
                                    setQuizSubmittedMap((prev) => ({ ...prev, [quiz.id]: true }));
                                  }
                                }}
                                disabled={chosenIdx === undefined}
                                className="w-full py-2 rounded-xl cyber-gradient-btn text-white text-xs font-semibold disabled:opacity-50"
                              >
                                Xaqiiji Jawaabta
                              </button>

                              {submitted && (
                                <div className="text-xs text-[#A5B1C8] leading-relaxed bg-[#101A30] p-3 rounded-xl">
                                  {quiz.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {combinedReferences.length > 0 && (
                      <div className="p-4 rounded-2xl bg-[#0A1224] border border-[rgba(120,150,210,0.16)] space-y-2">
                        <div className="text-xs font-bold text-[#08D9E8] uppercase tracking-wider">
                          Xigashooyin & Akhris Dheeraad ah
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {combinedReferences.map((ref) => (
                            <a
                              key={ref.url}
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.2)] text-xs text-[#A5B1C8] hover:text-[#08D9E8] hover:border-[#08D9E8]/40 transition-colors"
                            >
                              <span>{ref.title}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {bothExercisePartsDone && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-[#12D69A]/15 border border-[#12D69A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#12D69A]">
                          <Award className="w-5 h-5 shrink-0" />
                          <span>Hambalyo! Layligii waad dhammaystirtay, casharkana waa la diiwaangeliyay.</span>
                        </div>
                        {nextLesson && (
                          <button
                            onClick={() => setSelectedLesson(nextLesson)}
                            className="px-4 py-2 rounded-xl bg-[#12D69A] text-[#050B18] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
                          >
                            U Gudub Casharka Xiga
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Slide Navigation Bar */}
            <div className="mt-6 pt-4 border-t border-[rgba(120,150,210,0.16)] flex items-center justify-between gap-3">
              <button
                onClick={() => goToSlide(slideIndex - 1)}
                disabled={slideIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.2)] text-xs font-semibold text-[#F5F7FF] disabled:opacity-40 flex items-center gap-1.5 min-h-[42px]"
              >
                <ChevronLeft className="w-4 h-4" />
                Slide-kii Hore
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    aria-label={`U gudub ${s.shortLabel}`}
                    className={`h-2 rounded-full transition-all ${
                      slideIndex === idx ? 'w-7 bg-[#08D9E8]' : 'w-2 bg-[#A5B1C8]/40'
                    }`}
                  />
                ))}
              </div>

              {slideIndex < slides.length - 1 ? (
                <button
                  onClick={() => goToSlide(slideIndex + 1)}
                  className="px-5 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center gap-1.5 min-h-[42px]"
                >
                  Slide-ka Xiga
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    markLessonComplete(selectedLesson.id, selectedCourse.id);
                    if (nextLesson) setSelectedLesson(nextLesson);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#12D69A] text-[#050B18] text-xs font-bold flex items-center gap-1.5 min-h-[42px]"
                >
                  {nextLesson ? 'Dhammee & Casharka Xiga' : 'Dhammee Casharka'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </main>
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
};

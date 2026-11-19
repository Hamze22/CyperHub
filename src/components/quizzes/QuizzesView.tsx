import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CyberQuiz } from '../../types';

const QUIZ_CATEGORIES = [
  'All',
  'Networking',
  'Linux',
  'Ethical Hacking',
  'Web Security',
  'Cloud Security',
  'Cryptography',
  'Digital Forensics',
  'General Cybersecurity',
];

export const QuizzesView: React.FC = () => {
  const { quizzes, quizScores, recordQuizScore, courses, openCourseDetail, issueCertificate, navigate } = useApp();

  const [category, setCategory] = useState('All');
  const [activeQuiz, setActiveQuiz] = useState<CyberQuiz | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!activeQuiz || submitted) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuiz, submitted]);

  const startQuiz = (quiz: CyberQuiz) => {
    setActiveQuiz(quiz);
    setQIndex(0);
    setAnswers({});
    setSecondsLeft(quiz.timeLimitMinutes * 60);
    setSubmitted(false);
  };

  if (activeQuiz) {
    const total = activeQuiz.questions.length;
    const currentQ = activeQuiz.questions[qIndex];
    const correctCount = activeQuiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const scorePct = Math.round((correctCount / Math.max(1, total)) * 100);
    const passed = scorePct >= activeQuiz.passingScore;
    const recCourse = courses.find((c) => c.id === activeQuiz.recommendedCourseId);

    const handleSubmitQuiz = () => {
      setSubmitted(true);
      recordQuizScore(activeQuiz.id, scorePct);
    };

    if (submitted) {
      return (
        <div className="w-full space-y-6">
          <button
            onClick={() => setActiveQuiz(null)}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#A5B1C8] hover:text-[#F5F7FF]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Quizzes
          </button>

          <div className="cyber-card p-6 sm:p-8 text-center space-y-4">
            <div className={`text-4xl font-bold tabular-nums ${passed ? 'text-[#12D69A]' : 'text-[#FF9F43]'}`}>
              {scorePct}%
            </div>
            <h1 className="text-xl font-bold text-[#F5F7FF]">
              {passed ? 'Assessment Passed!' : 'Keep Practicing — Review Explanations Below'}
            </h1>
            <p className="text-xs text-[#A5B1C8] tabular-nums">
              Correct: {correctCount} / {total} · Passing threshold: {activeQuiz.passingScore}%
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => startQuiz(activeQuiz)}
                className="px-4 py-2.5 rounded-xl bg-[#14213B] text-xs font-semibold text-[#F5F7FF] flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Quiz
              </button>
              {passed && (
                <button
                  onClick={() => {
                    issueCertificate(activeQuiz.title, scorePct);
                    navigate('certificates');
                  }}
                  className="px-5 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  View Earned Certificate
                </button>
              )}
              {recCourse && (
                <button
                  onClick={() => openCourseDetail(recCourse)}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.22)] text-xs font-semibold text-[#08D9E8] flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  Recommended Lesson
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {activeQuiz.questions.map((q, idx) => {
              const userAns = answers[q.id];
              const isRight = userAns === q.correctIndex;
              return (
                <div key={q.id} className="cyber-card p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-[#F5F7FF]">
                      Q{idx + 1}. {q.question}
                    </div>
                    {isRight ? (
                      <CheckCircle2 className="w-5 h-5 text-[#12D69A] shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#FF9F43] shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-[#12D69A]">Correct answer: {q.options[q.correctIndex]}</div>
                  <p className="text-xs text-[#A5B1C8]">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const ss = String(secondsLeft % 60).padStart(2, '0');

    return (
      <div className="w-full space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveQuiz(null)}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#A5B1C8] hover:text-[#F5F7FF]"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Quiz
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-[#08D9E8] tabular-nums">
            <Clock className="w-4 h-4" />
            {mm}:{ss}
          </div>
        </div>

        {/* Question Navigator & Progress Bar */}
        <div className="cyber-card p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#A5B1C8]">
            <span>{activeQuiz.title}</span>
            <span className="tabular-nums">Question {qIndex + 1} of {total}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#050B18] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#713BFF] to-[#08D9E8]"
              style={{ width: `${((qIndex + 1) / total) * 100}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeQuiz.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setQIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold tabular-nums ${
                  qIndex === idx
                    ? 'bg-[#713BFF] text-white'
                    : answers[q.id] !== undefined
                    ? 'bg-[#12D69A]/20 text-[#12D69A]'
                    : 'bg-[#0A1224] text-[#A5B1C8]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="cyber-card p-6 space-y-4">
          <div className="text-[11px] uppercase tracking-wider text-[#08D9E8] font-semibold">
            {currentQ.type.replace('-', ' ')}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#F5F7FF]">{currentQ.question}</h2>

          {currentQ.codeBlock && (
            <pre className="p-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.18)] font-mono text-xs text-[#08D9E8] overflow-x-auto">
              {currentQ.codeBlock}
            </pre>
          )}

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const selected = answers[currentQ.id] === idx;
              return (
                <button
                  key={opt}
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }))}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-colors ${
                    selected
                      ? 'bg-[#713BFF]/25 border-[#713BFF] text-[#F5F7FF]'
                      : 'bg-[#0A1224] border-[rgba(120,150,210,0.18)] text-[#A5B1C8] hover:text-[#F5F7FF]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3">
            <button
              onClick={() => setQIndex((i) => Math.max(0, i - 1))}
              disabled={qIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#14213B] text-xs font-semibold text-[#F5F7FF] disabled:opacity-40"
            >
              Previous
            </button>
            {qIndex < total - 1 ? (
              <button
                onClick={() => setQIndex((i) => Math.min(total - 1, i + 1))}
                className="px-5 py-2 rounded-xl cyber-gradient-btn text-white text-xs font-semibold"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-5 py-2 rounded-xl bg-[#12D69A] text-[#050B18] text-xs font-bold"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredQuizzes = quizzes.filter((q) => category === 'All' || q.category === category);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F7FF]">Quizzes & Exams</h1>
        <p className="text-xs text-[#A5B1C8] mt-1">
          Test multiple-choice, true/false, and code interpretation security skills with instant explanations.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {QUIZ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 ${
              category === cat
                ? 'bg-[#713BFF] text-white'
                : 'bg-[#101A30] border border-[rgba(120,150,210,0.16)] text-[#A5B1C8] hover:text-[#F5F7FF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => {
          const bestScore = quizScores[quiz.id];
          return (
            <div key={quiz.id} className="cyber-card p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#08D9E8] font-semibold">{quiz.category}</span>
                  <span className="text-[#A5B1C8]">{quiz.difficulty}</span>
                </div>
                <h3 className="text-base font-bold text-[#F5F7FF]">{quiz.title}</h3>
                <p className="text-xs text-[#A5B1C8]">{quiz.description}</p>
                <div className="text-[11px] text-[#A5B1C8] tabular-nums pt-1">
                  {quiz.questions.length} questions · {quiz.timeLimitMinutes} min · Pass {quiz.passingScore}%
                </div>
                {bestScore !== undefined && (
                  <div className="text-xs font-semibold text-[#12D69A] tabular-nums">
                    Best Score: {bestScore}%
                  </div>
                )}
              </div>

              <button
                onClick={() => startQuiz(quiz)}
                className="w-full py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {bestScore !== undefined ? 'Retake Assessment' : 'Start Quiz'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

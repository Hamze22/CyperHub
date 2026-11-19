import React, { useState } from 'react';
import {
  FlaskConical,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Trophy,
  Lightbulb,
  Flag,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CTF_LEADERBOARD_SAMPLE } from '../../data/labs';
import { runSimulatedCommand } from '../../data/terminal';
import { ExperienceLevel } from '../../types';

const LAB_CATEGORIES = [
  'All',
  'Linux Practice',
  'Networking',
  'Web Security',
  'SQL Injection',
  'XSS',
  'API Security',
  'Password Auditing',
  'Log Analysis',
  'Digital Forensics',
  'Cloud Security',
  'Secure Coding',
  'Capture The Flag',
];

export const CyberLabsView: React.FC = () => {
  const {
    currentPage,
    labs,
    selectedLab,
    openLabDetail,
    completedLabIds,
    activeLabIds,
    startLab,
    submitLabAnswer,
    navigate,
    openTerminalWithEnv,
  } = useApp();

  const [category, setCategory] = useState('All');
  const [filterTab, setFilterTab] = useState<'All' | 'Featured' | 'Completed' | 'Active' | 'CTF'>('All');
  const [diffFilter, setDiffFilter] = useState<'All' | ExperienceLevel>('All');

  // Lab Detail local state
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<string[]>([]);
  const [labCmdInput, setLabCmdInput] = useState('');
  const [labConsoleLines, setLabConsoleLines] = useState<{ cmd: string; out: string }[]>([]);

  if (currentPage === 'lab-detail' && selectedLab) {
    const isCompleted = completedLabIds.includes(selectedLab.id);

    const handleRunLabCmd = (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      const res = runSimulatedCommand(cmd, 'kali');
      setLabConsoleLines((prev) => [...prev, { cmd, out: res.output }]);
      setLabCmdInput('');
    };

    const handleSubmitFlag = (e: React.FormEvent) => {
      e.preventDefault();
      if (!answerInput.trim()) return;
      const ok = submitLabAnswer(selectedLab.id, answerInput);
      setFeedback(
        ok
          ? { ok: true, msg: `Verified! Lab completed (+${selectedLab.points} pts awarded).` }
          : { ok: false, msg: 'Token did not match. Run the sample command or inspect Hints below.' }
      );
    };

    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('labs')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A5B1C8] hover:text-[#F5F7FF]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cyber Labs
        </button>

        <div className="cyber-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#08D9E8]">
              {selectedLab.category} · {selectedLab.difficulty} · {selectedLab.duration} · {selectedLab.points} pts
            </div>
            <h1 className="text-2xl font-bold text-[#F5F7FF] mt-1">{selectedLab.title}</h1>
            <p className="text-sm text-[#A5B1C8] mt-2 max-w-3xl">{selectedLab.overview}</p>
            <div className="text-xs text-[#A5B1C8] mt-2 font-mono">{selectedLab.environmentSpec}</div>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => openTerminalWithEnv('kali')}
              className="px-4 py-2.5 rounded-xl bg-[#14213B] text-xs font-semibold text-[#F5F7FF] flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4 text-[#12D69A]" />
              Full Terminal
            </button>
            <div
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                isCompleted ? 'bg-[#12D69A]/15 text-[#12D69A]' : 'bg-[#713BFF]/20 text-[#08D9E8]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Completed' : 'In Progress'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Instructions, Checklist, Hints & Submit Flag */}
          <div className="lg:col-span-6 space-y-5">
            <div className="cyber-card p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#F5F7FF]">Objectives & Instructions</h2>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#A5B1C8]">
                {selectedLab.instructions.map((inst) => (
                  <li key={inst}>{inst}</li>
                ))}
              </ol>
              <div className="pt-2 text-xs text-[#A5B1C8]">
                Required Tools: <span className="text-[#08D9E8]">{selectedLab.requiredTools.join(' · ')}</span>
              </div>
            </div>

            <div className="cyber-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-[#F5F7FF]">Progress Checklist</h3>
              {selectedLab.checklist.map((item) => {
                const checked = checkedSteps.includes(item) || isCompleted;
                return (
                  <label key={item} className="flex items-center gap-2.5 text-xs text-[#A5B1C8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setCheckedSteps((prev) =>
                          prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
                        )
                      }
                    />
                    <span className={checked ? 'line-through text-[#12D69A]' : ''}>{item}</span>
                  </label>
                );
              })}
            </div>

            <div className="cyber-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-[#08D9E8]" />
                  Submit Lab Flag / Answer
                </h3>
                <button
                  onClick={() => setShowHints((v) => !v)}
                  className="text-xs text-[#FF9F43] flex items-center gap-1 hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
              </div>

              {showHints && (
                <div className="p-3 rounded-xl bg-[#FF9F43]/10 border border-[#FF9F43]/30 text-xs text-[#FF9F43] space-y-1">
                  {selectedLab.hints.map((h) => (
                    <div key={h}>• {h}</div>
                  ))}
                  <div className="font-mono text-[11px] pt-1 text-[#08D9E8]">
                    Try running: {selectedLab.sampleCommand}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitFlag} className="flex gap-2">
                <input
                  type="text"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Enter discovered CyberHub{...} token"
                  className="flex-1 h-10 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] font-mono text-xs text-[#F5F7FF]"
                />
                <button type="submit" className="px-4 h-10 rounded-xl cyber-gradient-btn text-white text-xs font-semibold">
                  Submit Answer
                </button>
              </form>

              {feedback && (
                <div className={`text-xs font-medium ${feedback.ok ? 'text-[#12D69A]' : 'text-[#FF9F43]'}`}>
                  {feedback.msg}
                </div>
              )}
            </div>
          </div>

          {/* Embedded Quick Sandbox Console */}
          <div className="lg:col-span-6 cyber-card overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-[#0A1224] border-b border-[rgba(120,150,210,0.16)] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F5F7FF]">Lab Simulated Console</span>
              <button
                onClick={() => handleRunLabCmd(selectedLab.sampleCommand)}
                className="px-3 py-1 rounded-lg bg-[#14213B] text-[11px] font-mono text-[#08D9E8] hover:bg-[#1A2B4D]"
              >
                Run: {selectedLab.sampleCommand}
              </button>
            </div>
            <div className="p-4 bg-[#050B18] font-mono text-xs flex-1 min-h-[340px] space-y-2.5 overflow-y-auto">
              <div className="text-[#A5B1C8]/75">
                Simulated Lab Sandbox active · Target 10.10.10.15 · Type &quot;help&quot; or click Run above.
              </div>
              {labConsoleLines.map((l, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[#12D69A]">
                    kali@cyberhub:~$ <span className="text-[#F5F7FF]">{l.cmd}</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-[#A5B1C8]">{l.out}</pre>
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunLabCmd(labCmdInput);
                }}
                className="flex items-center gap-2 pt-1"
              >
                <span className="text-[#12D69A]">kali@cyberhub:~$</span>
                <input
                  type="text"
                  value={labCmdInput}
                  onChange={(e) => setLabCmdInput(e.target.value)}
                  placeholder="enter lab command..."
                  className="w-full bg-transparent text-[#F5F7FF] focus:outline-none"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredLabs = labs.filter((l) => {
    if (category !== 'All' && l.category !== category) return false;
    if (filterTab === 'Featured' && !l.isFeatured) return false;
    if (filterTab === 'Completed' && !completedLabIds.includes(l.id)) return false;
    if (filterTab === 'Active' && !activeLabIds.includes(l.id)) return false;
    if (filterTab === 'CTF' && !l.isCTF && l.category !== 'Capture The Flag') return false;
    if (diffFilter !== 'All' && l.difficulty !== diffFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F7FF]">Interactive Cyber Labs & CTF</h1>
        <p className="text-xs text-[#A5B1C8] mt-1">
          Hands-on simulated challenges across 12 security categories with step-by-step checklists and flag validation.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Featured', 'Active', 'Completed', 'CTF'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${
                filterTab === tab
                  ? 'bg-gradient-to-r from-[#713BFF] to-[#1677FF] text-white'
                  : 'bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-[#A5B1C8] hover:text-[#F5F7FF]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDiffFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                diffFilter === lvl ? 'bg-[#14213B] text-[#08D9E8] border border-[#08D9E8]/40' : 'bg-[#0A1224] text-[#A5B1C8]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {LAB_CATEGORIES.map((cat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLabs.map((lab) => {
            const completed = completedLabIds.includes(lab.id);
            return (
              <div key={lab.id} className="cyber-card p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#08D9E8] font-semibold">{lab.category}</span>
                    <span className="text-[#FF9F43] font-semibold tabular-nums">{lab.points} pts</span>
                  </div>
                  <h3 className="text-base font-bold text-[#F5F7FF]">{lab.title}</h3>
                  <p className="text-xs text-[#A5B1C8] line-clamp-2">{lab.description}</p>
                  <div className="text-[11px] text-[#A5B1C8] flex items-center gap-3 pt-1">
                    <span>{lab.difficulty}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lab.duration}</span>
                    {completed && <span className="text-[#12D69A] font-semibold">Completed</span>}
                  </div>
                </div>

                <button
                  onClick={() => {
                    startLab(lab.id);
                    openLabDetail(lab);
                  }}
                  className="w-full py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  {completed ? 'Review Lab' : 'Start Lab'}
                </button>
              </div>
            );
          })}
        </div>

        {/* CTF Leaderboard Sample */}
        <aside className="lg:col-span-4 cyber-card p-5 space-y-4 self-start">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FF9F43]" />
              CTF Leaderboard (Sample)
            </h2>
          </div>
          <div className="space-y-2.5">
            {CTF_LEADERBOARD_SAMPLE.map((row) => (
              <div key={row.rank} className="p-3 rounded-xl bg-[#0A1224] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-[#14213B] text-[#08D9E8] font-bold flex items-center justify-center tabular-nums">
                    {row.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-[#F5F7FF] truncate">{row.name}</div>
                    <div className="text-[11px] text-[#A5B1C8] tabular-nums">{row.solved} flags · {row.country}</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-[#12D69A] tabular-nums">{row.points}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

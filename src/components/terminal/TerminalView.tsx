import React, { useState, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  HelpCircle,
  Send,
  Loader2,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TERMINAL_ENVIRONMENTS, runSimulatedCommand } from '../../data/terminal';
import { Modal } from '../ui/Primitives';
import { askCyberHubAI } from '../../utils/aiClient';

export const TerminalView: React.FC = () => {
  const { activeTerminalEnv, setActiveTerminalEnv } = useApp();
  const activeEnv = TERMINAL_ENVIRONMENTS.find((e) => e.id === activeTerminalEnv) || TERMINAL_ENVIRONMENTS[0];

  const [histories, setHistories] = useState<Record<string, { cmd?: string; out: string; isError?: boolean }[]>>(() => {
    const init: Record<string, { cmd?: string; out: string }[]> = {};
    TERMINAL_ENVIRONMENTS.forEach((env) => {
      init[env.id] = [{ out: env.welcomeBanner }];
    });
    return init;
  });

  const [inputCmd, setInputCmd] = useState('');
  const [cmdHistoryList, setCmdHistoryList] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState(-1);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // AI Terminal Assistant
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'CyberHub AI Terminal Assistant ready. Execute a command in the console or select an action below.',
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentLines = histories[activeEnv.id] || [];
  const lastUserEntry = [...currentLines].reverse().find((l) => l.cmd);

  const execCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setCmdHistoryList((prev) => [trimmed, ...prev]);
    setHistoryCursor(-1);

    const res = runSimulatedCommand(trimmed, activeEnv.id);
    if (res.clear) {
      setHistories((prev) => ({ ...prev, [activeEnv.id]: [] }));
    } else {
      setHistories((prev) => ({
        ...prev,
        [activeEnv.id]: [...(prev[activeEnv.id] || []), { cmd: trimmed, out: res.output, isError: res.isError }],
      }));
    }
    setInputCmd('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cmdHistoryList.length - 1, historyCursor + 1);
      if (cmdHistoryList[next]) {
        setHistoryCursor(next);
        setInputCmd(cmdHistoryList[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyCursor - 1;
      if (next < 0) {
        setHistoryCursor(-1);
        setInputCmd('');
      } else {
        setHistoryCursor(next);
        setInputCmd(cmdHistoryList[next] || '');
      }
    }
  };

  const resetSession = () => {
    setHistories((prev) => ({ ...prev, [activeEnv.id]: [{ out: activeEnv.welcomeBanner }] }));
    setSecondsElapsed(0);
  };

  const copyOutput = () => {
    const text = currentLines.map((l) => (l.cmd ? `${activeEnv.prompt} ${l.cmd}\n${l.out}` : l.out)).join('\n\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const runAiAssistant = async (label: string, prompt: string) => {
    if (aiLoading) return;
    setAiMessages((prev) => [...prev, { role: 'user', text: label }]);
    setAiLoading(true);
    const res = await askCyberHubAI('terminal', prompt, {
      environment: activeEnv.name,
      lastCommand: lastUserEntry?.cmd || 'none',
      lastOutput: lastUserEntry?.out?.slice(0, 300) || '',
    });
    setAiMessages((prev) => [...prev, { role: 'ai', text: res.text }]);
    setAiLoading(false);
  };

  const assistantActions = [
    {
      label: 'Explain Command',
      prompt: `Explain the command "${lastUserEntry?.cmd || 'nmap -sV 10.10.10.15'}" in ${activeEnv.name}.`,
    },
    {
      label: 'Explain Output',
      prompt: `Explain this terminal output:\n${lastUserEntry?.out || activeEnv.welcomeBanner}`,
    },
    {
      label: 'Fix Error',
      prompt: `Help fix any command or syntax error for: ${lastUserEntry?.cmd || inputCmd || 'cat missing.txt'}`,
    },
    {
      label: 'Suggest Next Command',
      prompt: `Suggest the best next training command after "${lastUserEntry?.cmd || 'whoami'}" in ${activeEnv.name}.`,
    },
    {
      label: 'Generate Script',
      prompt: `Generate a safe bash learning script for port check in ${activeEnv.name}.`,
    },
    {
      label: 'Learn This Command',
      prompt: `Teach me how ${lastUserEntry?.cmd?.split(' ')[0] || 'nmap'} works with 3 safe examples.`,
    },
  ];

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* Header & Honest Simulation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FF]">Virtual OS Terminals</h1>
          <p className="text-xs text-[#A5B1C8] mt-1">
            Frontend-simulated Linux & PowerShell training environments. Safe syntax & command practice — no host execution.
          </p>
        </div>
        <button
          onClick={() => setHelpOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.2)] text-xs font-semibold text-[#F5F7FF] flex items-center gap-1.5 self-start"
        >
          <HelpCircle className="w-4 h-4 text-[#08D9E8]" />
          Command Cheat Sheet
        </button>
      </div>

      {/* 6 OS Environment Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TERMINAL_ENVIRONMENTS.map((env) => {
          const active = env.id === activeEnv.id;
          return (
            <button
              key={env.id}
              onClick={() => setActiveTerminalEnv(env.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                active
                  ? 'bg-[#14213B] border-[#713BFF] shadow-lg shadow-[#713BFF]/15'
                  : 'bg-[#101A30] border-[rgba(120,150,210,0.18)] hover:border-[rgba(120,150,210,0.35)]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-semibold ${active ? 'text-[#08D9E8]' : 'text-[#A5B1C8]'}`}>{env.shortName}</span>
                <span className="text-[#12D69A] font-medium">{active ? 'Active' : env.status}</span>
              </div>
              <div className="text-xs font-bold text-[#F5F7FF] mt-1 truncate">{env.name}</div>
              <div className="text-[10px] text-[#A5B1C8] mt-0.5 truncate">{env.osFamily}</div>
            </button>
          );
        })}
      </div>

      {/* Console + Right AI Terminal Assistant */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 cyber-card overflow-hidden">
          {/* Terminal Toolbar */}
          <div className="px-4 py-3 bg-[#0A1224] border-b border-[rgba(120,150,210,0.16)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <TerminalIcon className="w-4 h-4 text-[#12D69A] shrink-0" />
              <div className="text-xs font-semibold text-[#F5F7FF] truncate">
                {activeEnv.name} · <span className="text-[#A5B1C8] font-normal">{activeEnv.envType}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#A5B1C8]">
              <span className="hidden sm:flex items-center gap-1 tabular-nums">
                <Cpu className="w-3.5 h-3.5 text-[#08D9E8]" />
                {activeEnv.resources}
              </span>
              <span className="font-mono text-[#08D9E8] tabular-nums">{formatTime(secondsElapsed)}</span>
              <button onClick={copyOutput} className="px-2.5 py-1 rounded-lg bg-[#101A30] hover:text-[#F5F7FF] flex items-center gap-1">
                {copied ? <Check className="w-3.5 h-3.5 text-[#12D69A]" /> : <Copy className="w-3.5 h-3.5" />}
                Copy
              </button>
              <button
                onClick={() => setHistories((prev) => ({ ...prev, [activeEnv.id]: [] }))}
                className="px-2.5 py-1 rounded-lg bg-[#101A30] hover:text-[#F5F7FF] flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
              <button onClick={resetSession} className="px-2.5 py-1 rounded-lg bg-[#101A30] hover:text-[#F5F7FF] flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Quick sample commands bar */}
          <div className="px-4 py-2 bg-[#0A1224]/60 border-b border-[rgba(120,150,210,0.1)] flex gap-1.5 overflow-x-auto">
            {['help', 'neofetch', 'ls -la', 'nmap -sV 10.10.10.15', 'gobuster dir -u http://10.10.10.15:8080/', 'curl http://10.10.10.15', 'cat /var/log/auth.log'].map(
              (sample) => (
                <button
                  key={sample}
                  onClick={() => execCommand(sample)}
                  className="px-2.5 py-1 rounded-lg bg-[#101A30] border border-[rgba(120,150,210,0.16)] font-mono text-[11px] text-[#A5B1C8] hover:text-[#08D9E8] whitespace-nowrap shrink-0"
                >
                  {sample}
                </button>
              )
            )}
          </div>

          {/* Console Viewport */}
          <div className="p-4 bg-[#050B18] font-mono text-xs h-[420px] overflow-y-auto space-y-2.5">
            {currentLines.map((line, i) => (
              <div key={i} className="space-y-1">
                {line.cmd && (
                  <div className="text-[#12D69A]">
                    {activeEnv.prompt} <span className="text-[#F5F7FF]">{line.cmd}</span>
                  </div>
                )}
                {line.out && (
                  <pre className={`whitespace-pre-wrap break-words leading-relaxed ${line.isError ? 'text-[#FF9F43]' : 'text-[#A5B1C8]'}`}>
                    {line.out}
                  </pre>
                )}
              </div>
            ))}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                execCommand(inputCmd);
              }}
              className="flex items-center gap-2 pt-1"
            >
              <span className="text-[#12D69A] shrink-0">{activeEnv.prompt}</span>
              <input
                type="text"
                value={inputCmd}
                onChange={(e) => setInputCmd(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a simulated command (e.g. help, nmap -sV 10.10.10.15)..."
                className="w-full bg-transparent text-[#F5F7FF] focus:outline-none"
                autoFocus
              />
            </form>
          </div>
        </div>

        {/* Right: AI Terminal Assistant */}
        <aside className="xl:col-span-4 cyber-card p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#713BFF]/20 text-[#08D9E8] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F7FF]">AI Terminal Assistant</h2>
              <p className="text-[11px] text-[#A5B1C8]">Context-aware for {activeEnv.shortName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {assistantActions.map((act) => (
              <button
                key={act.label}
                onClick={() => runAiAssistant(act.label, act.prompt)}
                className="px-2.5 py-2 rounded-lg bg-[#0A1224] border border-[rgba(120,150,210,0.18)] text-[11px] font-medium text-[#A5B1C8] hover:text-[#F5F7FF] hover:border-[#713BFF] text-left"
              >
                {act.label}
              </button>
            ))}
          </div>

          <div className="h-64 overflow-y-auto space-y-2.5 pr-1">
            {aiMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[#713BFF] text-white ml-6'
                    : 'bg-[#0A1224] border border-[rgba(120,150,210,0.16)] text-[#F5F7FF] mr-2'
                }`}
              >
                {m.text}
              </div>
            ))}
            {aiLoading && (
              <div className="flex items-center gap-2 text-xs text-[#08D9E8]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing terminal context...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!aiQuery.trim()) return;
              const q = aiQuery.trim();
              setAiQuery('');
              runAiAssistant(q, q);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask about a command or error..."
              className="flex-1 h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
            />
            <button
              type="submit"
              disabled={aiLoading || !aiQuery.trim()}
              aria-label="Send terminal question"
              className="w-10 h-10 rounded-xl cyber-gradient-btn text-white flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>
      </div>

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Simulated Terminal Commands">
        <div className="space-y-3 text-xs text-[#A5B1C8]">
          <p>These simulated commands run safely in the browser against CyberHub training outputs:</p>
          <div className="font-mono bg-[#050B18] p-3.5 rounded-xl space-y-1 text-[#08D9E8]">
            <div>whoami / id / pwd / uname -a / neofetch</div>
            <div>ls -la / cat flag.txt / cat /var/log/auth.log</div>
            <div>ss -tuln / ip addr</div>
            <div>nmap -sV -Pn 10.10.10.15</div>
            <div>gobuster dir -u http://10.10.10.15:8080/</div>
            <div>sqlmap -u &quot;http://10.10.10.15/item?id=1&quot; --batch --dbs</div>
            <div>curl http://10.10.10.15</div>
            <div>Get-Process / Get-NetTCPConnection (PowerShell)</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

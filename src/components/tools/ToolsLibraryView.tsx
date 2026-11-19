import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  Terminal,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Award,
  Download,
  Wrench,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SecurityTool } from '../../types';
import { runSimulatedCommand } from '../../data/terminal';

const TOOL_CATEGORIES = [
  'All',
  'Network Scanning',
  'Wireless Security',
  'MITM & Sniffing',
  'Mobile Security',
  'Web Security',
  'Password Auditing',
  'OSINT & Recon',
  'Vulnerability Assessment',
  'Cloud Security',
  'Code Security',
  'Digital Forensics',
  'Cryptography',
  'Security Monitoring',
];

const TOOL_CATEGORY_SO: Record<string, string> = {
  All: 'Dhammaan',
  'Network Scanning': 'Baarista Shabakadda',
  'Wireless Security': 'Amniga Wi-Fi',
  'MITM & Sniffing': 'Dhexdhexaadinta (MITM)',
  'Mobile Security': 'Amniga Mobile-ka',
  'Web Security': 'Amniga Web-ka',
  'Password Auditing': 'Hubinta Password-yada',
  'OSINT & Recon': 'Xog-ururinta (OSINT)',
  'Vulnerability Assessment': 'Qiimaynta Dayacaadaha',
  'Cloud Security': 'Amniga Cloud-ka',
  'Code Security': 'Amniga Koodhka',
  'Digital Forensics': 'Baaritaanka Dijitaalka',
  Cryptography: 'Sirta & Qoraal-qarinta',
  'Security Monitoring': 'Kormeerka Amniga',
};

const SKILL_SO: Record<string, string> = {
  Beginner: 'Bilow',
  Intermediate: 'Dhexe',
  Advanced: 'Sare',
};

type ToolOsMode = 'kali' | 'ubuntu';

const UBUNTU_DEFAULT_TOOLS = new Set([
  'tool-tcpdump',
  'tool-zap',
  'tool-semgrep',
  'tool-bandit',
  'tool-trivy',
  'tool-sonarqube',
  'tool-openssl',
  'tool-wazuh',
  'tool-mitmproxy',
  'tool-mobsf',
]);

function getDefaultOsForTool(toolId: string): ToolOsMode {
  return UBUNTU_DEFAULT_TOOLS.has(toolId) ? 'ubuntu' : 'kali';
}

interface ToolVideoStep {
  caption: string;
  command: string;
  output: string;
}

function getToolBinaryName(tool: SecurityTool): string {
  if (tool.id === 'tool-zap') return 'zaproxy';
  if (tool.id === 'tool-sonarqube') return 'sonar-scanner';
  if (tool.id === 'tool-autopsy') return 'autopsy';
  if (tool.id === 'tool-wazuh') return 'systemctl';
  if (tool.id === 'tool-mobsf') return 'mobsf';
  const firstExampleCmd = tool.exampleCommands[0]?.command.trim() || '';
  const tokens = firstExampleCmd.split(/\s+/);
  const first = tokens[0] === 'sudo' ? tokens[1] || 'nmap' : tokens[0] || 'nmap';
  if (first === 'msf6') return 'msfconsole';
  return first;
}

function buildToolInstallSteps(tool: SecurityTool, osMode: ToolOsMode): ToolVideoStep[] {
  const binName = getToolBinaryName(tool);

  if (tool.id === 'tool-nmap') {
    return [
      {
        caption: 'Tallaabo 1: Soo deji oo fur koodhka asalka ah (Source Tarball) ee Nmap',
        command: 'wget https://nmap.org/dist/nmap-7.95.tar.bz2 && tar xjf nmap-7.95.tar.bz2',
        output: runSimulatedCommand(
          'wget https://nmap.org/dist/nmap-7.95.tar.bz2 && tar xjf nmap-7.95.tar.bz2',
          osMode
        ).output,
      },
      {
        caption: 'Tallaabo 2: Diyaari qaab-dhismeedka (./configure) — Daawo Nmap ASCII Banner',
        command: './configure',
        output: runSimulatedCommand('./configure', osMode).output,
      },
      {
        caption: 'Tallaabo 3: Dhis (Compile) oo ku rakib Nidaamka (make && make install)',
        command: 'make && make install',
        output: runSimulatedCommand('make && make install', osMode).output,
      },
      {
        caption: 'Tallaabo 4: Tijaabi Nmap adigoo baaraya target-ka tababarka',
        command: 'nmap -sV -sC -Pn 10.10.10.15',
        output: runSimulatedCommand('nmap -sV -sC -Pn 10.10.10.15', osMode).output,
      },
    ];
  }

  const installRaw = tool.installation.trim();
  const isShellInstaller =
    installRaw.startsWith('sudo ') ||
    installRaw.startsWith('apt') ||
    installRaw.startsWith('pip') ||
    installRaw.startsWith('docker ') ||
    installRaw.startsWith('curl ') ||
    installRaw.startsWith('git ');

  const installCmd = isShellInstaller
    ? installRaw
    : tool.id === 'tool-burp'
    ? 'sudo apt update && sudo apt install burpsuite'
    : tool.id === 'tool-autopsy'
    ? 'sudo apt update && sudo apt install autopsy sleuthkit'
    : `git clone https://github.com/cyberhub-lab/${binName}.git`;

  let verifyCmd = `which ${binName} && ${binName} --version`;
  if (tool.id === 'tool-zap' || tool.id === 'tool-mobsf') {
    verifyCmd = 'docker --version';
  } else if (tool.id === 'tool-openssl') {
    verifyCmd = 'which openssl && openssl version';
  } else if (tool.id === 'tool-nikto') {
    verifyCmd = 'which nikto && nikto -Version';
  } else if (tool.id === 'tool-netcat') {
    verifyCmd = 'which nc && nc -h';
  } else if (tool.id === 'tool-hydra') {
    verifyCmd = 'which hydra && hydra -h';
  } else if (tool.id === 'tool-sonarqube') {
    verifyCmd = 'which sonar-scanner && sonar-scanner --version';
  } else if (tool.id === 'tool-wazuh') {
    verifyCmd = 'which systemctl && systemctl --version';
  }

  const sampleCmd = tool.exampleCommands[0]?.command || `${binName} --help`;
  const cleanSampleCmd = sampleCmd.startsWith('msf6 >')
    ? 'msfconsole'
    : tool.id === 'tool-wireshark'
    ? 'wireshark'
    : sampleCmd.replace(/\s*&$/, '');

  return [
    {
      caption: `Tallaabo 1: Soo deji oo ku rakib ${tool.name} (${osMode === 'ubuntu' ? 'Ubuntu' : 'Kali Linux'})`,
      command: installCmd,
      output: runSimulatedCommand(installCmd, osMode).output,
    },
    {
      caption: `Tallaabo 2: Xaqiiji in ${tool.name} si sax ah u rakibmay`,
      command: verifyCmd,
      output: runSimulatedCommand(verifyCmd, osMode).output,
    },
    {
      caption: `Tallaabo 3: Fuli ${tool.name} si aad u aragto muuqaalkiisa rasmiga ah`,
      command: cleanSampleCmd,
      output: runSimulatedCommand(cleanSampleCmd, osMode).output,
    },
  ];
}

export const ToolsLibraryView: React.FC = () => {
  const {
    currentPage,
    tools,
    selectedTool,
    openToolDetail,
    navigate,
    openTerminalWithEnv,
    courses,
    openCourseDetail,
  } = useApp();

  const [category, setCategory] = useState('All');
  const [modeFilter, setModeFilter] = useState<'All' | 'Simulated Lab Sandbox' | 'Educational Documentation'>('All');
  const [query, setQuery] = useState('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [toolOsMode, setToolOsMode] = useState<ToolOsMode>(() => getDefaultOsForTool(selectedTool.id));

  // Terminal 1: Auto-Typing Video Installation & Setup Walkthrough state
  const installVideoSteps = useMemo(
    () => buildToolInstallSteps(selectedTool, toolOsMode),
    [selectedTool, toolOsMode]
  );
  const [vidPlaying, setVidPlaying] = useState(true);
  const [vidSpeed, setVidSpeed] = useState<1 | 1.5 | 2>(1);
  const [vidStepIdx, setVidStepIdx] = useState(0);
  const [vidCharIdx, setVidCharIdx] = useState(0);
  const [vidOutputLines, setVidOutputLines] = useState(0);
  const [vidDoneSteps, setVidDoneSteps] = useState<ToolVideoStep[]>([]);

  // Terminal 2: Interactive Learner Practice Exercise Terminal state (Re-download, Verify, Run)
  const [exCmd, setExCmd] = useState('');
  const [exLogs, setExLogs] = useState<{ cmd: string; out: string; ok: boolean }[]>([]);
  const [step1Installed, setStep1Installed] = useState(false);
  const [step2Verified, setStep2Verified] = useState(false);
  const [step3Executed, setStep3Executed] = useState(false);

  // Sync default OS whenever user picks a different tool
  useEffect(() => {
    setToolOsMode(getDefaultOsForTool(selectedTool.id));
  }, [selectedTool.id]);

  // Reset both terminals when switching tools, OS mode, or entering tool-detail
  useEffect(() => {
    setVidPlaying(true);
    setVidStepIdx(0);
    setVidCharIdx(0);
    setVidOutputLines(0);
    setVidDoneSteps([]);
    setExCmd('');
    setExLogs([]);
    setStep1Installed(false);
    setStep2Verified(false);
    setStep3Executed(false);
  }, [selectedTool.id, toolOsMode, currentPage]);

  // Video-like Auto-Typing Engine for Terminal 1
  useEffect(() => {
    if (currentPage !== 'tool-detail' || !vidPlaying) return;
    if (vidStepIdx >= installVideoSteps.length) return;

    const currentStep = installVideoSteps[vidStepIdx];
    const outLines = currentStep.output.split('\n');
    const delay = Math.round(35 / vidSpeed);

    if (vidCharIdx < currentStep.command.length) {
      const t = setTimeout(() => setVidCharIdx((c) => c + 1), delay);
      return () => clearTimeout(t);
    }

    if (vidOutputLines < outLines.length) {
      const t = setTimeout(() => setVidOutputLines((l) => l + 1), Math.round(75 / vidSpeed));
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setVidDoneSteps((prev) => [...prev, currentStep]);
      setVidStepIdx((s) => s + 1);
      setVidCharIdx(0);
      setVidOutputLines(0);
    }, Math.round(800 / vidSpeed));

    return () => clearTimeout(t);
  }, [currentPage, vidPlaying, vidSpeed, vidStepIdx, vidCharIdx, vidOutputLines, installVideoSteps]);

  const replayInstallVideo = () => {
    setVidStepIdx(0);
    setVidCharIdx(0);
    setVidOutputLines(0);
    setVidDoneSteps([]);
    setVidPlaying(true);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard?.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1600);
  };

  if (currentPage === 'tool-detail' && selectedTool) {
    const relatedCourses = courses.filter((c) => selectedTool.relatedCourseIds.includes(c.id));
    const binName = getToolBinaryName(selectedTool);
    const isUbuntu = toolOsMode === 'ubuntu';
    const srcFolder =
      selectedTool.id === 'tool-nmap'
        ? isUbuntu
          ? '~/src/nmap-7.95'
          : '/usr/local/src/nmap-7.95'
        : isUbuntu
        ? `~/tools/${binName}`
        : `/usr/local/src/${binName}`;

    const terminalBg = isUbuntu ? 'bg-[#300A24]' : 'bg-[#000000]';
    const terminalHeaderBg = isUbuntu ? 'bg-[#2B1022]' : 'bg-[#1E2433]';
    const terminalSubStripBg = isUbuntu ? 'bg-[#210719]' : 'bg-[#0E1420]';
    const promptTitle = isUbuntu ? `learner@ubuntu-sec: ${srcFolder}` : `root@kali2: ${srcFolder}`;

    const totalVidUnits = installVideoSteps.reduce(
      (acc, st) => acc + st.command.length + st.output.split('\n').length,
      0
    );
    const doneVidUnits =
      vidDoneSteps.reduce((acc, st) => acc + st.command.length + st.output.split('\n').length, 0) +
      (vidStepIdx < installVideoSteps.length ? vidCharIdx + vidOutputLines : 0);
    const vidProgressPct =
      vidStepIdx >= installVideoSteps.length
        ? 100
        : Math.min(100, Math.round((doneVidUnits / Math.max(1, totalVidUnits)) * 100));

    const nextExpectedHint =
      selectedTool.id === 'tool-nmap'
        ? !step1Installed
          ? './configure'
          : !step2Verified
          ? 'make && make install'
          : 'nmap -sV -sC -Pn 10.10.10.15'
        : !step1Installed
        ? installVideoSteps[0].command
        : !step2Verified
        ? installVideoSteps[1].command
        : installVideoSteps[2].command;

    const handleRunExercise = (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const res = runSimulatedCommand(trimmed, toolOsMode);
      const lower = trimmed.toLowerCase();

      let matched = false;
      if (
        lower.includes('apt') ||
        lower.includes('pip') ||
        lower.includes('docker pull') ||
        lower.includes('git clone') ||
        lower.includes('pkg install') ||
        lower.includes('curl ') ||
        lower.includes('wget ') ||
        lower.includes('./configure') ||
        (lower.includes('docker run') && selectedTool.id === 'tool-sonarqube')
      ) {
        setStep1Installed(true);
        matched = true;
      }
      if (
        lower.includes('--version') ||
        lower.includes('-version') ||
        lower.includes('openssl version') ||
        lower.includes('nc -h') ||
        lower.includes('hydra -h') ||
        lower.includes('which ') ||
        lower.includes('-v') ||
        lower.includes('make')
      ) {
        setStep2Verified(true);
        matched = true;
      }
      if (
        lower.startsWith(binName.toLowerCase()) ||
        lower.includes(` ${binName.toLowerCase()}`) ||
        lower.includes(selectedTool.name.toLowerCase().split(' ')[0]) ||
        lower.includes('zap-baseline') ||
        lower.includes('mobsf') ||
        lower.includes('tshark') ||
        lower.includes('sha256sum') ||
        lower.includes('wazuh-agent') ||
        lower.includes('setoolkit')
      ) {
        if (
          !lower.includes('install') &&
          !lower.includes('--version') &&
          !lower.includes('-version') &&
          !lower.includes('openssl version') &&
          !lower.includes('nc -h') &&
          !lower.includes('hydra -h') &&
          !lower.includes('which ') &&
          !lower.includes('wget') &&
          !lower.includes('docker pull')
        ) {
          setStep3Executed(true);
          matched = true;
        }
      }

      setExLogs((prev) => [...prev, { cmd: trimmed, out: res.output, ok: !res.isError || matched }]);
      setExCmd('');
    };

    const allToolStepsDone = step1Installed && step2Verified && step3Executed;

    const renderOsPrompt = () =>
      isUbuntu ? (
        <span className="shrink-0">
          <span className="text-[#4E9A06] font-semibold">learner@ubuntu-sec</span>
          <span className="text-[#E5E7EB]">:</span>
          <span className="text-[#3584E4] font-semibold">{srcFolder}</span>
          <span className="text-[#E5E7EB]">$</span>
        </span>
      ) : (
        <span className="shrink-0">
          <span className="text-[#E04F5F] font-semibold">root@kali2</span>
          <span className="text-[#E5E7EB]">:</span>
          <span className="text-[#3B82F6] font-semibold">{srcFolder}</span>
          <span className="text-[#E5E7EB]">#</span>
        </span>
      );

    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('tools')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A5B1C8] hover:text-[#F5F7FF]"
        >
          <ArrowLeft className="w-4 h-4" />
          Dib ugu noqo Maktabadda Qalabka (Pentest Tools)
        </button>

        {/* Tool Header Banner */}
        <div className="cyber-card p-6 sm:p-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#08D9E8]">
                {TOOL_CATEGORY_SO[selectedTool.category] || selectedTool.category} ·{' '}
                {SKILL_SO[selectedTool.skillLevel] || selectedTool.skillLevel} · {selectedTool.executionMode}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] mt-1">{selectedTool.name}</h1>
              <p className="text-sm text-[#A5B1C8] mt-2 max-w-3xl">{selectedTool.overview}</p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              {selectedTool.executionMode === 'Simulated Lab Sandbox' && (
                <button
                  onClick={() => openTerminalWithEnv(toolOsMode)}
                  className="px-4 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Terminal className="w-4 h-4" />
                  Ka Fur {isUbuntu ? 'Ubuntu' : 'Kali'} Sandbox Weyn
                </button>
              )}
              <a
                href={selectedTool.officialDocsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.22)] text-xs font-semibold text-[#F5F7FF] flex items-center gap-1.5"
              >
                Dukumeentiga Rasmiga ah
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-[#14213B] border border-[rgba(120,150,210,0.2)] px-4 py-3 text-xs text-[#A5B1C8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#FF9F43] shrink-0 mt-0.5" />
              <span>
                Habka Tababarka Rasmiga ah: Daawo sida {selectedTool.name} dhab ahaan ugu soo muuqdo{' '}
                <strong className="text-[#F5F7FF]">{isUbuntu ? 'Ubuntu 22.04 LTS' : 'Kali Linux'}</strong> (ASCII banner + output sax ah), kadibna adigu dib ugu rakib Terminal-ka 2aad.
              </span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-xl bg-[#0A1224] p-1 border border-[rgba(120,150,210,0.22)] shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setToolOsMode('kali')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  !isUbuntu ? 'bg-[#713BFF] text-white' : 'text-[#A5B1C8] hover:text-[#F5F7FF]'
                }`}
              >
                Kali Linux
              </button>
              <button
                type="button"
                onClick={() => setToolOsMode('ubuntu')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  isUbuntu ? 'bg-[#E95420] text-white' : 'text-[#A5B1C8] hover:text-[#F5F7FF]'
                }`}
              >
                Ubuntu 22.04
              </button>
            </div>
          </div>
        </div>

        {/* DUAL-TERMINAL WORKSHOP: 1. Video Auto-Typing Installer + 2. Interactive Exercise Console */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* TERMINAL 1: VIDEO-LIKE AUTO-TYPING INSTALLATION & EXECUTION */}
          <div className={`xl:col-span-6 rounded-2xl overflow-hidden border border-[rgba(120,150,210,0.3)] ${terminalBg} shadow-2xl flex flex-col`}>
            <div className={`px-3.5 py-2.5 ${terminalHeaderBg} border-b border-[rgba(255,255,255,0.12)] flex flex-wrap items-center justify-between gap-2`}>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#12D69A]" />
                <div>
                  <div className="text-xs font-mono font-bold text-[#F5F7FF]">
                    {promptTitle} — Muuqaal Terminal
                  </div>
                  <div className="text-[11px] text-[#08D9E8]">
                    {vidStepIdx >= installVideoSteps.length
                      ? 'Muuqaalku wuu dhammaaday'
                      : vidPlaying
                      ? 'Waa is qorayaa...'
                      : 'Waa la joojiyay'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (vidStepIdx >= installVideoSteps.length) {
                      replayInstallVideo();
                    } else {
                      setVidPlaying((p) => !p);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#713BFF] text-white text-xs font-semibold flex items-center gap-1"
                >
                  {vidPlaying && vidStepIdx < installVideoSteps.length ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Jooji
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> {vidStepIdx >= installVideoSteps.length ? 'Ku Celi' : 'Bilow'}
                    </>
                  )}
                </button>

                <button
                  onClick={replayInstallVideo}
                  aria-label="Ku celi terminaalka rakibidda"
                  className="p-1.5 rounded-lg bg-[#101A30] text-[#A5B1C8] hover:text-[#F5F7FF]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="flex rounded-lg overflow-hidden border border-[rgba(120,150,210,0.2)] text-[11px]">
                  {([1, 1.5, 2] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setVidSpeed(spd)}
                      className={`px-2 py-1 font-mono ${
                        vidSpeed === spd ? 'bg-[#1677FF] text-white' : 'bg-[#101A30] text-[#A5B1C8]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-4 ${terminalBg} font-mono text-xs flex-1 min-h-[340px] max-h-[450px] overflow-y-auto space-y-3`}>
              {vidDoneSteps.map((st, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[#08D9E8]/80"># {st.caption}</div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {renderOsPrompt()}
                    <span className="text-[#FFFFFF]">{st.command}</span>
                  </div>
                  <pre className="whitespace-pre text-[#D1D5DB] leading-tight overflow-x-auto">{st.output}</pre>
                </div>
              ))}

              {vidStepIdx < installVideoSteps.length && (
                <div className="space-y-1">
                  <div className="text-[#08D9E8]"># {installVideoSteps[vidStepIdx].caption}</div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {renderOsPrompt()}
                    <span className="text-[#FFFFFF]">
                      {installVideoSteps[vidStepIdx].command.slice(0, vidCharIdx)}
                    </span>
                    <span
                      className={`inline-block w-2.5 h-4 align-middle animate-pulse ${
                        isUbuntu ? 'bg-[#FFFFFF]' : 'bg-[#00FF66]'
                      }`}
                    />
                  </div>
                  {vidOutputLines > 0 && (
                    <pre className="whitespace-pre text-[#D1D5DB] leading-tight overflow-x-auto">
                      {installVideoSteps[vidStepIdx].output
                        .split('\n')
                        .slice(0, vidOutputLines)
                        .join('\n')}
                    </pre>
                  )}
                </div>
              )}

              {vidStepIdx >= installVideoSteps.length && (
                <div className="flex items-center gap-1.5 pt-1">
                  {renderOsPrompt()}
                  <span
                    className={`inline-block w-2.5 h-4 align-middle animate-pulse ${
                      isUbuntu ? 'bg-[#FFFFFF]' : 'bg-[#00FF66]'
                    }`}
                  />
                </div>
              )}
            </div>

            <div className={`px-4 py-2.5 ${terminalSubStripBg} border-t border-[rgba(255,255,255,0.1)] flex items-center gap-3`}>
              <div className="flex-1 h-1.5 rounded-full bg-[#050B18] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#12D69A] to-[#08D9E8] transition-all duration-150"
                  style={{ width: `${vidProgressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-[#A5B1C8] tabular-nums">{vidProgressPct}%</span>
            </div>
          </div>

          {/* TERMINAL 2: INTERACTIVE EXERCISE TERMINAL (RE-INSTALL, VERIFY & RUN TOOL) */}
          <div className={`xl:col-span-6 rounded-2xl overflow-hidden border border-[rgba(120,150,210,0.3)] ${terminalBg} shadow-2xl flex flex-col`}>
            <div className={`px-3.5 py-2.5 ${terminalHeaderBg} border-b border-[rgba(255,255,255,0.12)] flex flex-wrap items-center justify-between gap-2`}>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#00FF66]" />
                <div>
                  <div className="text-xs font-mono font-bold text-[#F5F7FF]">
                    {promptTitle} — Terminaalka Layliga
                  </div>
                  <div className="text-[11px] text-[#A5B1C8]">
                    Adigu qor amarrada si aad u dhisto / u soo dejiso una tijaabiso {selectedTool.name}
                  </div>
                </div>
              </div>

              {!allToolStepsDone ? (
                <button
                  type="button"
                  onClick={() => setExCmd(nextExpectedHint)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#14213B] border border-[#08D9E8]/40 text-[11px] font-semibold text-[#08D9E8] hover:bg-[#1A2B4D]"
                >
                  Tusaale Buuxi (Hint)
                </button>
              ) : (
                <span className="text-xs font-semibold text-[#12D69A] flex items-center gap-1">
                  <Award className="w-4 h-4" /> Waad Dhammaysay!
                </span>
              )}
            </div>

            {/* 3-Step Checklist Strip */}
            <div className={`px-4 py-2 ${terminalSubStripBg} border-b border-[rgba(255,255,255,0.08)] flex flex-wrap gap-2 text-[11px]`}>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                  step1Installed ? 'bg-[#12D69A]/15 text-[#12D69A]' : 'bg-[#101A30] text-[#A5B1C8]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> 1. {selectedTool.id === 'tool-nmap' ? 'Soo Deji / ./configure' : 'Soo Deji / Rakib'}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                  step2Verified ? 'bg-[#12D69A]/15 text-[#12D69A]' : 'bg-[#101A30] text-[#A5B1C8]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> 2. {selectedTool.id === 'tool-nmap' ? 'make && make install' : 'Xaqiiji (--version)'}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                  step3Executed ? 'bg-[#12D69A]/15 text-[#12D69A]' : 'bg-[#101A30] text-[#A5B1C8]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> 3. Tijaabi {selectedTool.name}
              </span>
            </div>

            <div className={`p-4 ${terminalBg} font-mono text-xs flex-1 min-h-[300px] max-h-[410px] overflow-y-auto space-y-2.5`}>
              <div className="text-[#A5B1C8]/80">
                Bilow adigoo ku qoraya: <span className="text-[#08D9E8]">{nextExpectedHint}</span>
              </div>

              {exLogs.map((log, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {renderOsPrompt()}
                    <span className="text-[#FFFFFF]">{log.cmd}</span>
                  </div>
                  <pre className="whitespace-pre text-[#D1D5DB] leading-tight overflow-x-auto">{log.out}</pre>
                </div>
              ))}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunExercise(exCmd);
                }}
                className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-1"
              >
                {renderOsPrompt()}
                <input
                  type="text"
                  value={exCmd}
                  onChange={(e) => setExCmd(e.target.value)}
                  placeholder="Ku qor amarka oo taabo Enter..."
                  className={`w-full bg-transparent text-[#FFFFFF] focus:outline-none ${
                    isUbuntu ? 'caret-[#FFFFFF]' : 'caret-[#00FF66]'
                  }`}
                />
              </form>
            </div>

            {allToolStepsDone && (
              <div className="px-4 py-2.5 bg-[#12D69A]/15 border-t border-[#12D69A]/40 text-xs font-semibold text-[#12D69A] flex items-center justify-between gap-2">
                <span>Hambalyo! {selectedTool.name} si guul leh ayaad u dhistay oo u tijaabisay.</span>
              </div>
            )}
          </div>
        </div>

        {/* Capabilities, Installation Reference & Usage Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 cyber-card p-6 space-y-4">
            <h2 className="text-base font-bold text-[#F5F7FF]">Awoodaha Muhiimka ah</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A5B1C8]">
              {selectedTool.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>

            <div className="pt-3 border-t border-[rgba(120,150,210,0.14)] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#08D9E8]">Amarka Rakibidda</h3>
                <button
                  onClick={() => copyCommand(selectedTool.installation)}
                  className="text-[11px] text-[#A5B1C8] hover:text-[#F5F7FF] flex items-center gap-1"
                >
                  {copiedCmd === selectedTool.installation ? (
                    <Check className="w-3.5 h-3.5 text-[#12D69A]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedCmd === selectedTool.installation ? 'La Koobiyeeyay' : 'Koobiyee'}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.18)] font-mono text-xs text-[#12D69A] overflow-x-auto">
                {selectedTool.installation}
              </pre>
            </div>
          </div>

          <div className="lg:col-span-7 cyber-card p-6 space-y-5">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#F5F7FF]">Hagaha Isticmaalka</h2>
              <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">{selectedTool.usageGuide}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#F5F7FF]">Tusaalooyinka Amarrada</h3>
              {selectedTool.exampleCommands.map((ex) => (
                <div key={ex.label} className="p-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.18)] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#A5B1C8]">
                    <span>{ex.label}</span>
                    <button onClick={() => copyCommand(ex.command)} className="flex items-center gap-1 hover:text-[#F5F7FF]">
                      {copiedCmd === ex.command ? <Check className="w-3.5 h-3.5 text-[#12D69A]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCmd === ex.command ? 'La Koobiyeeyay' : 'Koobiyee'}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-[#08D9E8] overflow-x-auto">{ex.command}</div>
                </div>
              ))}
            </div>

            {relatedCourses.length > 0 && (
              <div className="pt-3 border-t border-[rgba(120,150,210,0.14)] space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A5B1C8]">Koorsooyinka La Xiriira</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => openCourseDetail(c)}
                      className="px-3 py-2 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.18)] text-xs font-semibold text-[#F5F7FF] hover:border-[#713BFF] flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#08D9E8]" />
                      {c.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredTools = tools.filter((t) => {
    if (category !== 'All' && t.category !== category) return false;
    if (modeFilter !== 'All' && t.executionMode !== modeFilter) return false;
    if (query.trim() && !t.name.toLowerCase().includes(query.toLowerCase()) && !t.description.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FF]">Maktabadda Qalabka Amniga (Pentest Tools)</h1>
          <p className="text-xs text-[#A5B1C8] mt-1">
            {tools.length} qalab oo amniga cyber-ka ah (Wi-Fi, MITM, Mobile Hacking, Web & OSINT) — mid kasta waxaad gudaha ka helaysaa laba terminal: mid muuqaal ahaan ku tusaya sida loo soo dejiyo iyo mid layli ah oo aad adigu ku rakibayso.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#A5B1C8] absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Raadi qalab (Nmap, Bettercap, Wifite2, Frida, ADB)..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['All', 'Simulated Lab Sandbox', 'Educational Documentation'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setModeFilter(mode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${
              modeFilter === mode
                ? 'bg-gradient-to-r from-[#713BFF] to-[#1677FF] text-white'
                : 'bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-[#A5B1C8] hover:text-[#F5F7FF]'
            }`}
          >
            {mode === 'All' ? 'Dhammaan' : mode}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {TOOL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 ${
              category === cat
                ? 'bg-[#713BFF] text-white'
                : 'bg-[#101A30] border border-[rgba(120,150,210,0.16)] text-[#A5B1C8] hover:text-[#F5F7FF]'
            }`}
          >
            {TOOL_CATEGORY_SO[cat] || cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div key={tool.id} className="cyber-card p-5 flex flex-col justify-between space-y-4 hover:border-[#713BFF]/60 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#08D9E8] font-semibold">{TOOL_CATEGORY_SO[tool.category] || tool.category}</span>
                <span className="text-[#A5B1C8]">{SKILL_SO[tool.skillLevel] || tool.skillLevel}</span>
              </div>
              <h3 className="text-base font-bold text-[#F5F7FF]">{tool.name}</h3>
              <p className="text-xs text-[#A5B1C8] leading-relaxed">{tool.description}</p>
              <div className="text-[11px] font-medium text-[#12D69A] pt-1">
                {tool.executionMode} · 2 Terminal (Video + Layli)
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[rgba(120,150,210,0.12)]">
              <button
                onClick={() => openToolDetail(tool)}
                className="flex-1 py-2 rounded-xl bg-[#14213B] hover:bg-[#1A2B4D] text-xs font-semibold text-[#F5F7FF]"
              >
                Fur Terminallada Tool-ka
              </button>
              {tool.executionMode === 'Simulated Lab Sandbox' && (
                <button
                  onClick={() => openTerminalWithEnv('kali')}
                  className="px-3.5 py-2 rounded-xl cyber-gradient-btn text-white text-xs font-semibold"
                >
                  Sandbox
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

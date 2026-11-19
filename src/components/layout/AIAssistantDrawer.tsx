import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { askCyberHubAI } from '../../utils/aiClient';

export const AIAssistantDrawer: React.FC = () => {
  const { aiDrawerOpen, setAiDrawerOpen, user, language } = useApp();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text:
        language === 'so'
          ? `Ku soo dhawoow CyberHub AI Tutor, ${user.fullName}! I weydii wax kasta oo ku saabsan Linux, Networking, OWASP, ama amarrada Terminal-ka.`
          : `Welcome to CyberHub AI Tutor, ${user.fullName}! Ask any question about cybersecurity, Linux commands, OWASP vulnerabilities, or study roadmaps.`,
    },
  ]);

  if (!aiDrawerOpen) return null;

  const sendPrompt = async (customText?: string) => {
    const query = (customText ?? prompt).trim();
    if (!query || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    if (!customText) setPrompt('');
    setLoading(true);
    const res = await askCyberHubAI('tutor', query, {
      experienceLevel: user.experienceLevel,
      language,
    });
    setMessages((prev) => [...prev, { role: 'ai', text: res.text }]);
    setLoading(false);
  };

  const quickChips = [
    'Explain Nmap -sV vs -sS',
    'How to prevent SQL Injection?',
    'Translate networking basics to Somali',
    'Give me a beginner study plan',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#050B18]/70 backdrop-blur-sm"
        onClick={() => setAiDrawerOpen(false)}
      />
      <aside className="relative z-10 w-full max-w-md bg-[#0A1224] border-l border-[rgba(120,150,210,0.22)] flex flex-col h-full shadow-2xl">
        <div className="px-5 py-4 border-b border-[rgba(120,150,210,0.18)] flex items-center justify-between bg-[#101A30]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#713BFF]/20 text-[#08D9E8] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FF]">CyberHub AI Tutor</h3>
              <p className="text-[11px] text-[#A5B1C8]">Instant study & security explanations</p>
            </div>
          </div>
          <button
            onClick={() => setAiDrawerOpen(false)}
            aria-label="Close AI drawer"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#14213B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-2.5 border-b border-[rgba(120,150,210,0.12)] flex flex-wrap gap-1.5">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => sendPrompt(chip)}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-[#101A30] border border-[rgba(120,150,210,0.2)] text-[#A5B1C8] hover:text-[#F5F7FF] hover:border-[#713BFF]"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[#713BFF] text-white ml-8'
                  : 'bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-[#F5F7FF] mr-4'
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#A5B1C8] px-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#08D9E8]" />
              Thinking...
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendPrompt();
          }}
          className="p-4 border-t border-[rgba(120,150,210,0.18)] bg-[#101A30] flex items-center gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask CyberHub AI Tutor..."
            className="flex-1 h-10 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF] placeholder-[#A5B1C8]/60 focus:outline-none focus:border-[#713BFF]"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            aria-label="Send prompt"
            className="h-10 w-10 rounded-xl cyber-gradient-btn text-white flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </aside>
    </div>
  );
};

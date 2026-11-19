export interface AIResponse {
  text: string;
  source: 'gemini-api' | 'built-in-intelligence' | 'fallback-on-error' | 'client-fallback';
}

export async function askCyberHubAI(
  agentType: 'tutor' | 'terminal',
  prompt: string,
  context?: Record<string, unknown>
): Promise<AIResponse> {
  try {
    const res = await fetch('/api/ai/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType, prompt, context }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return {
      text: data.text || 'No response received.',
      source: data.source || 'built-in-intelligence',
    };
  } catch {
    return {
      text:
        agentType === 'terminal'
          ? `CyberHub AI Terminal Assistant (Offline Demo)\n\nCommand/Topic: "${prompt}"\n• Ensure you are testing only against the authorized lab target 10.10.10.15.\n• Try running "help", "ls -la", or "nmap -sV 10.10.10.15" in the console.`
          : `CyberHub AI Tutor (Offline Demo)\n\nTopic: "${prompt}"\n• Break down the concept into Identification, Vulnerability Analysis, and Remediation.\n• Apply least-privilege permissions and validate every user input.`,
      source: 'client-fallback',
    };
  }
}

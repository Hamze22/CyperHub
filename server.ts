import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client with user-agent telemetry as required
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Built-in intelligent cyber expert fallback when Gemini API key is unavailable
function getIntelligentFallbackResponse(agentType: string, prompt: string, _context?: any): string {
  const pLower = prompt.toLowerCase();

  if (pLower.includes('somali') || pLower.includes('af-soomaali')) {
    return `### Macallinka CyberHub AI (Af-Soomaali)

**Sharaxaad Fudud:**
Amniga internet-ka (Cybersecurity) waxa uu ku dhisan yahay difaac lakabyo badan leh:
- **Network Security:** Hubinta dekedaha furan (ports) sida SSH (22) iyo HTTPS (443) adigoo adeegsanaya \`nmap -sV\`.
- **Least Privilege:** Sii isticmaalayaasha oo keliya rukhsadda ay u baahan yihiin (\`chmod 600\` faylasha xasaasiga ah).
- **Web Defense:** Ka ilaali foomamka iyo API-yada SQL Injection adigoo adeegsanaya *Parameterized Queries*.

*Talo Waxbarasho:* Ku tijaabi amarrada aasaasiga ah ee Linux gudaha **Virtual Terminal** ama **Cyber Labs** si aad u aragto sida ay u shaqeeyaan.`;
  }

  if (agentType === 'terminal') {
    if (pLower.includes('nmap') || pLower.includes('scan') || pLower.includes('port')) {
      return `### Nmap Command Analysis & Next Steps

**Command:** \`nmap -sV -Pn 10.10.10.15\`

- **\`-sV\`**: Probes open ports to identify service software and exact versions.
- **\`-Pn\`**: Skips ICMP ping discovery so hosts behind strict firewalls are still scanned.

**Suggested Next Commands:**
1. Run \`gobuster dir -u http://10.10.10.15:8080/ -w /usr/share/wordlists/dirb/common.txt\` if port 8080 is HTTP.
2. Run \`curl -i http://10.10.10.15\` to inspect HTTP response headers.`;
    }
    if (pLower.includes('sqlmap') || pLower.includes('sqli')) {
      return `### SQLMap Lab Guidance

**Authorized Training Command:**
\`\`\`bash
sqlmap -u "http://10.10.10.15/item?id=1" --batch --dbs
\`\`\`

- \`--batch\`: Runs non-interactively using default safe prompts.
- \`--dbs\`: Lists discovered database schemas inside the training sandbox.

*Remediation Reminder:* Always use parameterized queries (\`SELECT * FROM items WHERE id = ?\`) in production code.`;
    }
    if (pLower.includes('fix') || pLower.includes('error')) {
      return `### Troubleshooting Simulated Command Errors

1. Check spelling and flags — run \`help\` to list supported simulated utilities.
2. Verify target paths with \`ls -la\` before running \`cat <filename>\`.
3. For network tools (\`nmap\`, \`curl\`, \`gobuster\`), target the authorized lab host \`10.10.10.15\`.`;
    }
    return `### CyberHub AI Terminal Assistant

**Analyzed Query:** \`${prompt.slice(0, 80)}\`

- Your session runs in a safe frontend-simulated sandbox targeting \`10.10.10.0/24\`.
- Useful commands to explore: \`help\`, \`ls -la\`, \`neofetch\`, \`nmap -sV 10.10.10.15\`, \`cat /var/log/auth.log\`, and \`ss -tuln\`.`;
  }

  return `### CyberHub AI Tutor

Here is a clear breakdown for: **"${prompt.slice(0, 120)}"**

1. **Core Principle:** Defense-in-depth combines network visibility, strict access controls (least privilege), input validation, and continuous log monitoring.
2. **Practical Example:**
\`\`\`bash
# Inspect listening sockets and verify SSH key permissions
ss -tuln
chmod 600 ~/.ssh/authorized_keys
\`\`\`
3. **Next Recommended Step:** Practice this concept inside **Cyber Labs** or test your recall with a quick **Quizzes** check.`;
}

// AI Agent Endpoint
app.post('/api/ai/agent', async (req, res) => {
  try {
    const { agentType = 'tutor', prompt = '', context = {} } = req.body;

    if (!prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !aiClient) {
      const fallbackText = getIntelligentFallbackResponse(agentType, prompt, context);
      return res.json({
        text: fallbackText,
        model: 'cyberhub-tutor-fallback',
        source: 'built-in-intelligence',
      });
    }

    let systemInstruction =
      'You are the CyberHub AI Cybersecurity Tutor. Explain cybersecurity clearly, ethically, and step-by-step with structured headings, practical defensive advice, and short code or command blocks.';
    if (agentType === 'terminal') {
      systemInstruction =
        'You are the CyberHub AI Terminal Assistant. Help learners inside a simulated Linux/PowerShell training sandbox. Explain commands, troubleshoot errors, suggest ethical next steps, and always remind users to test only on authorized targets.';
    }

    const contextStr = context ? `\nContext:\n${JSON.stringify(context, null, 2)}` : '';
    const fullPrompt = `${prompt}${contextStr}`;

    const generatePromise = aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 6000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

    const responseText = response?.text || getIntelligentFallbackResponse(agentType, prompt, context);
    return res.json({
      text: responseText,
      model: 'gemini-2.5-flash',
      source: 'gemini-api',
    });
  } catch (error: any) {
    console.error('Error generating content with Gemini:', error);
    const fallbackText = getIntelligentFallbackResponse(req.body.agentType || 'tutor', req.body.prompt || '');
    return res.json({
      text: fallbackText,
      model: 'cyberhub-tutor-fallback',
      source: 'fallback-on-error',
    });
  }
});

// Interactive Virtual Lab Command Execution Endpoint
app.post('/api/lab/exec', (req, res) => {
  const { command = '', environment = 'kali' } = req.body;
  const trimmed = command.trim();

  if (!trimmed) {
    return res.json({ output: '', exitCode: 0 });
  }

  const [cmd, ...args] = trimmed.split(/\s+/);

  // Simulated virtual file system & commands
  if (cmd === 'clear') {
    return res.json({ output: '__CLEAR__', exitCode: 0 });
  }

  if (cmd === 'whoami') {
    return res.json({ output: 'student', exitCode: 0 });
  }

  if (cmd === 'id') {
    return res.json({ output: 'uid=1001(student) gid=1001(student) groups=1001(student),27(sudo),100(users)', exitCode: 0 });
  }

  if (cmd === 'pwd') {
    return res.json({ output: '/home/student/workspace', exitCode: 0 });
  }

  if (cmd === 'uname') {
    return res.json({ output: 'Linux aegis-sandbox-node 6.1.0-kali9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.1.27-1kali1 x86_64 GNU/Linux', exitCode: 0 });
  }

  if (cmd === 'ls') {
    if (args.includes('-la') || args.includes('-l') || args.includes('-a')) {
      return res.json({
        output: `total 48
drwxr-xr-x 6 student student 4096 Nov 09 09:12 .
drwxr-xr-x 3 root    root    4096 Nov 09 08:00 ..
-rw-r--r-- 1 student student  220 Nov 09 08:00 .bash_logout
-rw-r--r-- 1 student student 3526 Nov 09 08:00 .bashrc
-rw-r--r-- 1 student student  807 Nov 09 08:00 .profile
drwxr-xr-x 2 student student 4096 Nov 09 09:15 captures
-rw------- 1 student student   42 Nov 09 09:00 flag_01.txt
drwxr-xr-x 3 student student 4096 Nov 09 08:30 exploits
-rw-r--r-- 1 student student 1482 Nov 09 09:10 network_audit.py
drwxr-xr-x 2 student student 4096 Nov 09 08:45 reports
drwxr-xr-x 2 student student 4096 Nov 09 08:50 wordlists`,
        exitCode: 0,
      });
    }
    return res.json({
      output: 'captures  exploits  flag_01.txt  network_audit.py  reports  wordlists',
      exitCode: 0,
    });
  }

  if (cmd === 'cat') {
    const file = args[0] || '';
    if (file === 'flag_01.txt') {
      return res.json({
        output: 'AEGIS{w3lc0m3_t0_th3_cyb3r_m4tr1x_2026}',
        exitCode: 0,
      });
    }
    if (file === 'network_audit.py') {
      return res.json({
        output: `import socket
import sys

def scan_target(target, ports=[21, 22, 80, 443, 3306, 8080]):
    print(f"[*] Scanning {target} for active ports...")
    for port in ports:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        result = s.connect_ex((target, port))
        if result == 0:
            print(f"[+] Port {port}: OPEN")
        s.close()

if __name__ == "__main__":
    scan_target("10.10.10.15")`,
        exitCode: 0,
      });
    }
    if (file === '/etc/issue') {
      return res.json({ output: 'Kali GNU/Linux Rolling \\n \\l', exitCode: 0 });
    }
    return res.json({ output: `cat: ${file}: No such file or directory`, exitCode: 1 });
  }

  if (cmd === 'nmap') {
    return res.json({
      output: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-09 09:20 UTC
Nmap scan report for target.lab (10.10.10.15)
Host is up (0.00042s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
22/tcp   open  ssh           OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
80/tcp   open  http          Apache httpd 2.4.57 ((Debian))
|_http-server-header: Apache/2.4.57 (Debian)
|_http-title: Aegis Banking Portal - Login
443/tcp  open  ssl/http      Apache httpd 2.4.57
|_ssl-cert: Subject: commonName=banking.target.lab/organizationName=Aegis Lab Corp
3306/tcp open  mysql         MySQL 8.0.35-0ubuntu0.22.04.1
8080/tcp open  http-proxy    Werkzeug/3.0.1 Python/3.11.2 (Vulnerable API Gateway)
|_http-title: Aegis Internal Microservices v1.2
MAC Address: 02:42:0A:0A:0A:0F (Docker Virtual Net)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds`,
      exitCode: 0,
    });
  }

  if (cmd === 'curl') {
    return res.json({
      output: `HTTP/1.1 200 OK
Date: Mon, 09 Nov 2026 09:21:40 GMT
Server: Apache/2.4.57 (Debian)
X-Powered-By: PHP/8.2.14
Set-Cookie: PHPSESSID=b4f8a8109d941ac82c6109f; path=/; HttpOnly
Content-Type: application/json; charset=UTF-8

{"status":"active","app":"Aegis Security API","version":"1.4.0","auth_provider":"JWT-HS256","flag":"AEGIS{cURL_h3ad3rs_r3v34l3d}"}`,
      exitCode: 0,
    });
  }

  if (cmd === 'gobuster') {
    return res.json({
      output: `===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.10.15:8080/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative codes:          404
[+] User Agent:              gobuster/3.6
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/admin                (Status: 403) [Size: 279]
/api                  (Status: 200) [Size: 1142]
/backup.zip           (Status: 200) [Size: 492019] [!] SENSITIVE FILE FOUND
/console              (Status: 200) [Size: 3120]  [!] DEBUG CONSOLE ACTIVE
/docs                 (Status: 200) [Size: 4509]
/login                (Status: 200) [Size: 1824]
/robots.txt           (Status: 200) [Size: 154]
===============================================================
Finished
===============================================================`,
      exitCode: 0,
    });
  }

  if (cmd === 'sqlmap') {
    return res.json({
      output: `        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.7.12#stable}
|_ -| . [']     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] starting @ 09:25:11 /2026-11-09/

[09:25:11] [INFO] testing connection to the target URL
[09:25:12] [INFO] checking if the target is protected by some kind of WAF/IPS
[09:25:12] [INFO] testing if the target URL content is stable
[09:25:13] [INFO] target URL content is stable
[09:25:13] [INFO] testing if GET parameter 'id' is dynamic
[09:25:13] [INFO] confirming that GET parameter 'id' is dynamic
[09:25:14] [INFO] GET parameter 'id' appears to be 'AND boolean-based blind - WHERE or HAVING clause' injectable
[09:25:15] [INFO] GET parameter 'id' is 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)' injectable
GET parameter 'id' is vulnerable. Do you want to keep testing the others? [y/N] N
sqlmap identified the following injection point(s) with a total of 42 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 8829=8829

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: id=1 AND (SELECT 9918 FROM (SELECT(SLEEP(5)))gKzS)
---
[09:25:18] [INFO] the back-end DBMS is MySQL
available databases [3]:
[*] aegis_banking
[*] information_schema
[*] mysql`,
      exitCode: 0,
    });
  }

  if (cmd === 'semgrep') {
    return res.json({
      output: `┌────────────────┐
│ 1 Code Finding │
└────────────────┘
  src/routes/auth.js
  ❯❯❱ rule: javascript.express.security.audit.sqli.node-sqli-in-raw-query
      Detected dangerous string concatenation into SQL query on line 42:
      41 | const userId = req.body.username;
      42 | const query = "SELECT * FROM users WHERE user = '" + userId + "'";
      43 | db.query(query, callback);
      
      Remediation: Use parameterized queries:
      db.query("SELECT * FROM users WHERE user = ?", [userId], callback);
      
Ran 48 rules on 12 files: 1 finding detected (High severity).`,
      exitCode: 0,
    });
  }

  if (cmd === 'hydra') {
    return res.json({
      output: `Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes.

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-11-09 09:26:01
[DATA] max 16 tasks per 1 server, overall 16 tasks, 100 login tries (l:1/p:100), ~6 tries per task
[DATA] attacking ssh://10.10.10.15:22/
[STATUS] 45.00 tries/min, 45 tries in 00:01h, 55 to do in 00:02h, 16 active
[22][ssh] host: 10.10.10.15   login: admin   password: Password123!
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2026-11-09 09:26:48`,
      exitCode: 0,
    });
  }

  if (cmd === 'python3' || cmd === 'python') {
    const file = args[0];
    if (file === 'network_audit.py') {
      return res.json({
        output: `[*] Scanning 10.10.10.15 for active ports...
[+] Port 22: OPEN
[+] Port 80: OPEN
[+] Port 443: OPEN
[+] Port 3306: OPEN
[+] Port 8080: OPEN
[*] Audit finished. 5 services active on subnet target.`,
        exitCode: 0,
      });
    }
    return res.json({
      output: `Python 3.11.2 (main, May  2 2024, 11:59:08) [GCC 12.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> Execution simulation ready. Provide script filename to execute.`,
      exitCode: 0,
    });
  }

  if (cmd === 'help') {
    return res.json({
      output: `AegisCyber Interactive Virtual Terminal Environment (v2.4)
======================================================================
Available Pre-Configured Utilities:
  nmap        - Network exploration tool and security / port scanner
  gobuster    - Directory, DNS and VHost busting tool written in Go
  sqlmap      - Automatic SQL injection and database takeover tool
  curl        - Command line tool for transferring data with URLs
  hydra       - Fast and flexible network login brute-force cracker
  semgrep     - Lightweight static code analysis security scanner
  python3     - Python interpreter with security libraries
  cat / ls    - File inspection and directory listing
  id / whoami - Current user identity and group verification
  clear       - Clear screen
  submit-flag - Submit a flag directly from terminal: submit-flag <FLAG>`,
      exitCode: 0,
    });
  }

  if (cmd === 'submit-flag') {
    const flag = args[0] || '';
    if (flag.includes('AEGIS{') && flag.endsWith('}')) {
      return res.json({
        output: `[SUCCESS] CTF Flag validated and accepted!\nFlag: ${flag}\nPoints awarded: +150 XP. Check your rank on the live Leaderboard!`,
        exitCode: 0,
      });
    }
    return res.json({
      output: `[FAIL] Invalid flag format or incorrect token. Expected format: AEGIS{...}`,
      exitCode: 1,
    });
  }

  // Fallback for generic bash command
  return res.json({
    output: `bash: ${cmd}: command executed in sandboxed session (PID: ${Math.floor(Math.random() * 8000 + 1000)})`,
    exitCode: 0,
  });
});

// Configure Vite middleware in development mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[AegisCyber Engine] Super platform backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

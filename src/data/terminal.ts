import { TerminalEnvironment } from '../types';

export const TERMINAL_ENVIRONMENTS: TerminalEnvironment[] = [
  {
    id: 'ubuntu',
    name: 'Ubuntu 22.04 LTS',
    shortName: 'Ubuntu',
    osFamily: 'Debian / Linux',
    version: '22.04.4 LTS (Jammy)',
    description: 'Clean Linux sandbox ideal for shell scripting, networking fundamentals, Python security scripts, and system hardening exercises.',
    envType: 'Simulated Linux Shell',
    resources: '2 vCPU · 2 GB RAM · 10 GB Scratch',
    prompt: 'user@ubuntu:~$',
    welcomeBanner: `Welcome to CyberHub Simulated Ubuntu 22.04 LTS Environment
Notice: Running in safe frontend demonstration mode (no host OS execution).
Type "help" to view available simulated commands or "neofetch" for system info.`,
    status: 'Ready',
    isPremium: false,
  },
  {
    id: 'kali',
    name: 'Kali Linux Rolling',
    shortName: 'Kali',
    osFamily: 'Penetration Testing Linux',
    version: '2026.2 Rolling',
    description: 'Pre-configured offensive security sandbox featuring simulated Nmap, Gobuster, SQLMap, Hydra, and Nikto outputs against authorized lab targets.',
    envType: 'Simulated Security Sandbox',
    resources: '4 vCPU · 4 GB RAM · Isolated Lab Net',
    prompt: 'kali@cyberhub:~$',
    welcomeBanner: `CyberHub Kali Linux Security Practice Sandbox (v2026.2)
Target Lab Subnet: 10.10.10.0/24 (Authorized Training Host: 10.10.10.15)
Notice: Outputs are safely simulated for training. Type "help" to start.`,
    status: 'Active',
    isPremium: true,
  },
  {
    id: 'debian',
    name: 'Debian 12 Bookworm',
    shortName: 'Debian',
    osFamily: 'Stable Server Linux',
    version: '12.6 (Bookworm)',
    description: 'Minimal server distribution suited for firewall configuration (ufw/iptables), SSH hardening, and log forensics practice.',
    envType: 'Simulated Server Shell',
    resources: '2 vCPU · 2 GB RAM · Isolated Subnet',
    prompt: 'admin@debian:~$',
    welcomeBanner: `Debian GNU/Linux 12 (Bookworm) — Server Hardening Sandbox
Simulated mode active. Try "cat /var/log/auth.log" or "ss -tuln".`,
    status: 'Ready',
    isPremium: false,
  },
  {
    id: 'alpine',
    name: 'Alpine Linux 3.20',
    shortName: 'Alpine',
    osFamily: 'Container Lightweight Linux',
    version: '3.20.2',
    description: 'Ultra-lightweight container OS environment for studying Docker container security, minimal attack surfaces, and Trivy image checks.',
    envType: 'Simulated Container Shell',
    resources: '1 vCPU · 512 MB RAM · Container Net',
    prompt: 'alpine:/workspace#',
    welcomeBanner: `Welcome to Alpine Linux 3.20 Container Security Sandbox
Ideal for container inspection and DevSecOps practice. Type "help" for commands.`,
    status: 'Ready',
    isPremium: true,
  },
  {
    id: 'fedora',
    name: 'Fedora Workstation 40',
    shortName: 'Fedora',
    osFamily: 'RHEL / SELinux Family',
    version: '40 Server/Workstation',
    description: 'Practice SELinux mandatory access controls, systemd service auditing, and enterprise Linux policy management.',
    envType: 'Simulated Enterprise Linux',
    resources: '2 vCPU · 2 GB RAM · SELinux Enforcing',
    prompt: 'secops@fedora:~$',
    welcomeBanner: `Fedora 40 Security Sandbox — SELinux Policy & Audit Training
Type "sestatus" or "help" to inspect simulated security policies.`,
    status: 'Idle',
    isPremium: true,
  },
  {
    id: 'powershell',
    name: 'Windows PowerShell 7',
    shortName: 'PowerShell',
    osFamily: 'Windows Administration Sim',
    version: 'PS 7.4 Simulation',
    description: 'Simulated Windows PowerShell console for practicing Event Log triage, Active Directory enumeration queries, and Defender status checks.',
    envType: 'Simulated Windows Shell',
    resources: '2 vCPU · 2 GB RAM · AD Lab Domain',
    prompt: 'PS C:\\CyberHub\\Lab>',
    welcomeBanner: `Windows PowerShell 7.4 Simulation — CyberHub AD & Forensics Lab
Simulated mode active. Try "Get-Process", "Get-NetTCPConnection", or "help".`,
    status: 'Ready',
    isPremium: true,
  },
];

export interface SimulatedCmdResult {
  output: string;
  isError?: boolean;
  clear?: boolean;
}

export function runSimulatedCommand(rawCmd: string, envId: TerminalEnvironment['id']): SimulatedCmdResult {
  const trimmed = rawCmd.trim();
  if (!trimmed) return { output: '' };

  if (trimmed.includes('&&')) {
    const parts = trimmed.split('&&').map((p) => p.trim()).filter(Boolean);
    const outputs: string[] = [];
    for (const part of parts) {
      const subRes = runSimulatedCommand(part, envId);
      outputs.push(subRes.output);
      if (subRes.isError) return { output: outputs.join('\n\n'), isError: true };
    }
    return { output: outputs.join('\n\n') };
  }

  const [cmd, ...args] = trimmed.split(/\s+/);
  const lower = cmd.toLowerCase();

  if (lower === 'sudo') {
    if (args.length === 0) {
      return { output: `[sudo] Fadlan raaci amarka la fulinayo, tusaale: sudo apt update`, isError: true };
    }
    return runSimulatedCommand(args.join(' '), envId);
  }

  if (lower === 'clear' || lower === 'cls') {
    return { output: '', clear: true };
  }

  if (lower === 'help') {
    return {
      output: `CyberHub Simulated Terminal (${envId.toUpperCase()}) — Available Commands:
  whoami          Display active sandbox user
  pwd / ls        Navigate and list simulated workspace files
  cat <file>      Inspect file contents (try: cat notes.txt, cat flag.txt, cat /var/log/auth.log)
  neofetch        Show simulated OS specifications & resource limits
  nmap <target>   Simulated port scan (authorized lab host: 10.10.10.15)
  gobuster        Simulated web directory discovery against lab target
  sqlmap          Simulated SQL injection check against intentionally vulnerable app
  curl <url>      Inspect simulated HTTP headers and API JSON responses
  ss / netstat    Inspect open listening sockets
  sestatus        Check simulated SELinux enforcement policy
  Get-Process     (PowerShell) List simulated Windows processes
  clear           Clear terminal output`,
    };
  }

  if (lower === 'whoami') {
    if (envId === 'powershell') return { output: 'cyberhub-lab\\learner' };
    if (envId === 'kali') return { output: 'kali' };
    if (envId === 'alpine') return { output: 'root' };
    return { output: 'user' };
  }

  if (lower === 'pwd') {
    return { output: envId === 'powershell' ? 'C:\\CyberHub\\Lab' : '/home/user/cyberhub-lab' };
  }

  if (lower === 'neofetch') {
    return {
      output: `        .-/+oossssoo+/-.               ${envId}@cyberhub-sandbox
    \`:+ssssssssssssssssss+:\`           -------------------------
  -+ssssssssssssssssssyyssss+-         OS: ${envId.toUpperCase()} (Simulated Training Sandbox)
.ossssssssssssssssssdMMMNysssso.       Kernel: 6.1.0-cyberhub-isolated
/ssssssssssshdmmNNmmyNMMMMhssssss/     Uptime: 14 mins
+ssssssssshmydMMMMMMMNddddyssssssss+   Packages: 1420 (sandboxed)
/sssssssshNMMMyhhyyyyhmNMMMNhssssssss/ Shell: bash 5.2 (frontend simulation)
.ssssssssdMMMNhsssssssssshNMMMdssssss. Memory: 512MiB / 2048MiB
+sssshhhyNMMNyssssssssssssyNMMMysssss+ Network: 10.10.10.0/24 (Isolated)`,
    };
  }

  if (lower === 'ls' || lower === 'dir') {
    return {
      output: `drwxr-xr-x  2 user user 4096 Nov 17 09:10 captures
-rw-r--r--  1 user user  184 Nov 17 09:05 notes.txt
-rw-r--r--  1 user user   44 Nov 17 09:08 flag.txt
-rw-r--r--  1 user user  920 Nov 17 09:12 port_scanner.py
drwxr-xr-x  2 user user 4096 Nov 17 09:14 wordlists`,
    };
  }

  if (lower === 'cat' || lower === 'type') {
    const file = args[0] || '';
    if (file === 'notes.txt') {
      return {
        output: `CyberHub Lab Briefing:
1. Target Host: 10.10.10.15 (Intentionally Vulnerable Practice App)
2. Enumerate open TCP ports using: nmap -sV 10.10.10.15
3. Inspect web directories with gobuster or check HTTP headers with curl.`,
      };
    }
    if (file === 'flag.txt') {
      return { output: 'CyberHub{w3lc0m3_t0_v1rtu4l_t3rm1n4l_2026}' };
    }
    if (file === '/var/log/auth.log') {
      return {
        output: `Nov 17 08:11:02 lab-srv sshd[2410]: Failed password for invalid user admin from 192.168.50.88 port 51204 ssh2
Nov 17 08:11:04 lab-srv sshd[2410]: Failed password for invalid user admin from 192.168.50.88 port 51205 ssh2
Nov 17 08:11:06 lab-srv sshd[2410]: Failed password for root from 192.168.50.88 port 51208 ssh2
Nov 17 08:12:19 lab-srv sshd[2492]: Accepted publickey for secops from 10.10.10.5 port 44120 ssh2`,
      };
    }
    if (file === 'port_scanner.py') {
      return {
        output: `import socket
for port in [22, 80, 443, 8080]:
    with socket.socket() as s:
        s.settimeout(0.5)
        if s.connect_ex(("10.10.10.15", port)) == 0:
            print(f"Port {port} is OPEN")`,
      };
    }
    return { output: `${cmd}: ${file || '(missing file)'}: No such file in simulated workspace`, isError: true };
  }

  if (lower === 'nmap') {
    const target = args[args.length - 1] || '10.10.10.15';
    if (args.includes('--version') || args.includes('-V')) {
      return {
        output: `Nmap version 7.95 ( https://nmap.org )
Platform: x86_64-pc-linux-gnu
Compiled with: liblua-5.4.6 openssl-3.0.13 libssh2-1.11.0 libz-1.3 libpcre2-10.42
Available nsock engines: epoll poll select`,
      };
    }
    if (!target.startsWith('10.10.') && !target.includes('lab') && !target.includes('localhost')) {
      return {
        output: `[POLICY BLOCK] CyberHub Lab restricts scanning strictly to authorized internal lab targets (10.10.10.0/24).`,
        isError: true,
      };
    }
    if (args.includes('-sn')) {
      return {
        output: `Starting Nmap 7.95 ( https://nmap.org ) at 2026-11-18 09:15 UTC
Nmap scan report for 10.10.10.1
Host is up (0.00031s latency).
Nmap scan report for 10.10.10.5
Host is up (0.00044s latency).
Nmap scan report for ${target === '10.10.10.0/24' ? '10.10.10.15' : target}
Host is up (0.00052s latency).
Nmap done: 256 IP addresses (3 hosts up) scanned in 2.18 seconds`,
      };
    }
    return {
      output: `Starting Nmap 7.95 ( https://nmap.org ) at 2026-11-18 09:16 UTC
Nmap scan report for cyberhub-target (${target})
Host is up (0.00051s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
| ssh-hostkey:
|   256 4e:7a:91:c2:8f:12:44:9a:b1:22:09:fe:18:4c:7d:11 (ECDSA)
|_  256 9d:11:a4:08:7e:31:5b:2c:80:4f:1a:9e:6d:33:8c:04 (ED25519)
80/tcp   open  http       nginx 1.24.0
|_http-title: CyberHub Training Portal
|_http-server-header: nginx/1.24.0
443/tcp  open  ssl/http   nginx 1.24.0
|_ssl-date: TLS randomness does not represent time
8080/tcp open  http-proxy CyberHub Vulnerable Lab API v1.0
MAC Address: 00:0C:29:4F:A1:8E (VMware)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.41 seconds`,
    };
  }

  if (lower === 'gobuster') {
    if (args.includes('version') || args.includes('--version') || args.includes('-v')) {
      return { output: `Gobuster v3.6.0 (Kali Linux rolling x86_64)` };
    }
    return {
      output: `===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.10.15:8080/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 153]
/.htaccess            (Status: 403) [Size: 153]
/api                  (Status: 200) [Size: 412]
/assets               (Status: 301) [Size: 169] [--> http://10.10.10.15:8080/assets/]
/backup-config.bak    (Status: 200) [Size: 2048]
/login                (Status: 200) [Size: 1840]
/robots.txt           (Status: 200) [Size: 94]
Progress: 4614 / 4614 (100.00%)
===============================================================
Finished
===============================================================`,
    };
  }

  if (lower === 'sqlmap') {
    if (args.includes('--version')) {
      return { output: `1.8.4#stable` };
    }
    return {
      output: `        ___
       __H__
 ___ ___[)]_____ ___ ___  {1.8.4#stable}
|_ -| . [(]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal.

[*] starting @ 09:18:04 /2026-11-18/

[09:18:04] [INFO] testing connection to the target URL
[09:18:05] [INFO] testing if the target URL content is stable
[09:18:05] [INFO] GET parameter 'id' appears to be dynamic
[09:18:06] [INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable (possible DBMS: 'PostgreSQL')
[09:18:06] [INFO] testing for SQL injection on GET parameter 'id'
[09:18:07] [INFO] GET parameter 'id' is 'PostgreSQL > 8.1 stacked queries (comment)' injectable
[09:18:08] [INFO] the back-end DBMS is PostgreSQL
web server operating system: Linux Debian 12
web application technology: Nginx 1.24.0, Node.js
back-end DBMS: PostgreSQL >= 15
[09:18:08] [INFO] fetching database names
available databases [2]:
[*] cyberhub_lab
[*] information_schema

[09:18:09] [INFO] fetched data logged to text files under '/root/.local/share/sqlmap/output/10.10.10.15'
[*] ending @ 09:18:09 /2026-11-18/`,
    };
  }

  if (lower === 'curl') {
    if (args.includes('--version')) {
      return { output: `curl 8.7.1 (x86_64-pc-linux-gnu) libcurl/8.7.1 OpenSSL/3.2.2 zlib/1.3` };
    }
    if (trimmed.includes('wazuh-install.sh')) {
      return {
        output: `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  218k  100  218k    0     0   842k      0 --:--:-- --:--:-- --:--:--  845k
18/11/2026 09:20:11 INFO: Starting Wazuh installation assistant. Wazuh version: 4.7.5
18/11/2026 09:20:14 INFO: Wazuh indexer, manager & dashboard installed and active [OK]`,
      };
    }
    return {
      output: `HTTP/1.1 200 OK
Server: nginx/1.24.0
X-Content-Type-Options: nosniff
Content-Type: application/json

{"service":"cyberhub-vuln-lab","status":"running","lab_token":"CyberHub{http_h34d3r_1nsp3ct3d}"}`,
    };
  }

  if (lower === 'ss' || lower === 'netstat') {
    return {
      output: `Netid  State   Local Address:Port   Peer Address:Port
tcp    LISTEN  0.0.0.0:22           0.0.0.0:*
tcp    LISTEN  0.0.0.0:80           0.0.0.0:*
tcp    LISTEN  127.0.0.1:5432       0.0.0.0:*`,
    };
  }

  if (lower === 'sestatus') {
    return {
      output: `SELinux status:                 enabled
Current mode:                   enforcing
Policy from config file:        targeted`,
    };
  }

  if (lower === 'get-process') {
    return {
      output: ` NPM(K)    PM(M)      WS(M)     CPU(s)      Id  ProcessName
 ------    -----      -----     ------      --  -----------
     18     14.2       22.4       0.84    1044  pwsh
     12      8.1       15.0       0.12    1488  svchost
     42     95.6      118.2       2.10    2012  MsMpEng (Defender)`,
    };
  }

  if (lower === 'get-nettcpconnection') {
    return {
      output: `LocalAddress        LocalPort RemoteAddress       RemotePort State
------------        --------- -------------       ---------- -----
10.10.10.22         49812     10.10.10.15         443        Established
0.0.0.0             3389      0.0.0.0             0          Listen`,
    };
  }

  if (lower === 'chmod') {
    return { output: `[OK] Permissions updated cleanly (${args.join(' ') || '600 ~/.ssh/id_ed25519'}).` };
  }

  if (lower === 'find') {
    return {
      output: `/usr/bin/sudo
/usr/bin/passwd
/usr/bin/su
/usr/lib/openssh/ssh-keysign`,
    };
  }

  if (lower === 'ping') {
    const target = args[args.length - 1] || '10.10.10.15';
    return {
      output: `PING ${target} (10.10.10.15) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.41 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.38 ms
--- ${target} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss`,
    };
  }

  if (lower === 'ip' || lower === 'ifconfig') {
    return {
      output: `1: lo: <LOOPBACK,UP> mtu 65536 inet 127.0.0.1/8
2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500 inet 10.10.10.22/24`,
    };
  }

  if (lower === 'uname') {
    return {
      output:
        envId === 'ubuntu'
          ? `Linux ubuntu-sec 6.5.0-44-generic #44~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`
          : `Linux kali2 6.8.11-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.8.11-1kali2 x86_64 GNU/Linux`,
    };
  }

  if (lower === 'id') {
    return {
      output:
        envId === 'kali'
          ? `uid=0(root) gid=0(root) groups=0(root)`
          : `uid=1000(learner) gid=1000(learner) groups=1000(learner),27(sudo)`,
    };
  }

  if (lower === 'semgrep') {
    if (args.includes('--version')) {
      return { output: `1.93.0` };
    }
    return {
      output: `┌──── ○○○ ────┐
│ Semgrep CLI │
└─────────────┘
Scanning 42 files with 186 Code rules (p/security-audit):

  src/routes/items.ts
    ❯❱ javascript.express.security.audit.sqli.node-postgres-sqli
       Detected untrusted user input flowing into PostgreSQL query string.
       Use parameterized queries ($1, $2) instead of template literals.
       14┆ const rows = await db.query(\`SELECT * FROM items WHERE id = \${req.query.id}\`);

┌──────────────┐
│ Scan Summary │
└──────────────┘
Ran 186 rules on 42 files: 1 finding.`,
    };
  }

  if (lower === 'trivy') {
    if (args.includes('--version') || args.includes('-v')) {
      return {
        output: `Version: 0.56.2
Vulnerability DB:
  Version: 2
  UpdatedAt: 2026-11-18 06:00:00 UTC`,
      };
    }
    return {
      output: `2026-11-18T09:21:04Z  INFO  Vulnerability scanning is enabled
2026-11-18T09:21:05Z  INFO  Detected OS  family="alpine" version="3.20.2"
2026-11-18T09:21:05Z  INFO  [alpine] Detecting vulnerabilities...

node:20-alpine (alpine 3.20.2)
=================================
Total: 2 (HIGH: 2, CRITICAL: 0)

┌──────────────┬────────────────┬──────────┬────────┬───────────────────┬───────────────┬────────────────────────────────────────┐
│   Library    │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version │                 Title                  │
├──────────────┼────────────────┼──────────┼────────┼───────────────────┼───────────────┼────────────────────────────────────────┤
│ libexpat     │ CVE-2024-45490 │ HIGH     │ fixed  │ 2.6.2-r0          │ 2.6.3-r0      │ expat: negative length in XML_Parse    │
│ openssl      │ CVE-2024-6119  │ HIGH     │ fixed  │ 3.3.1-r3          │ 3.3.2-r0      │ openssl: X.509 name check crash        │
└──────────────┴────────────────┴──────────┴────────┴───────────────────┴───────────────┴────────────────────────────────────────┘`,
    };
  }

  if (lower === 'bandit') {
    if (args.includes('--version')) {
      return { output: `bandit 1.7.10 (python 3.12)` };
    }
    return {
      output: `[main]  INFO    profile include tests: None
[main]  INFO    profile exclude tests: None
[main]  INFO    running on Python 3.12.3
Run started:2026-11-18 09:22:10.442190

Test results:
>> Issue: [B602:subprocess_popen_with_shell_equals_true] subprocess call with shell=True identified, security issue.
   Severity: High   Confidence: High
   CWE: CWE-78 (https://cwe.mitre.org/data/definitions/78.html)
   Location: ./app/utils/diag.py:24:8
23      def run_ping(host):
24          return subprocess.check_output(f"ping -c 1 {host}", shell=True)

--------------------------------------------------
Code scanned:
        Total lines of code: 418
        Total lines skipped (#nosec): 0
Run metrics:
        Total issues (by severity):
                Undefined: 0  Low: 0  Medium: 0  High: 1`,
    };
  }

  if (lower === 'sonar-scanner') {
    if (args.includes('--version') || args.includes('-v')) {
      return {
        output: `INFO: Scanner configuration file: /opt/sonar-scanner/conf/sonar-scanner.properties
INFO: SonarScanner 5.0.1.3006
INFO: Java 17.0.12 Eclipse Adoptium (64-bit)`,
      };
    }
    return {
      output: `INFO: Scanner configuration file: /opt/sonar-scanner/conf/sonar-scanner.properties
INFO: Project root configuration file: NONE
INFO: SonarScanner 5.0.1.3006
INFO: User cache: /home/learner/.sonar/cache
INFO: Analyzing on SonarQube server 10.6.0.92116
INFO: Indexing files...
INFO: 68 files indexed
INFO: Quality profile for ts: Sonar way
INFO: Sensor TypeScript analysis [javascript]
INFO: Sensor JaCoCo XML Report Importer [jacoco]
INFO: Quality Gate status: PASSED (0 Blocker, 1 Security Hotspot reviewed)
INFO: ANALYSIS SUCCESSFUL, you can find the results at: http://localhost:9000/dashboard?id=cyberhub-api
INFO: Total time: 6.412s`,
    };
  }

  if (lower === 'tshark' || lower === 'wireshark') {
    if (args.includes('--version') || args.includes('-v')) {
      return {
        output: `${lower === 'tshark' ? 'TShark (Wireshark)' : 'Wireshark'} 4.2.6 (Git v4.2.6 packaged as 4.2.6-1)
Running on Linux 6.8.11-amd64, with libpcap version 1.10.4, GnuTLS 3.8.6.`,
      };
    }
    if (lower === 'wireshark') {
      return {
        output: `    .--------.
   /  _    _  \\     Wireshark 4.2.6 (Kali Linux GUI/CLI Launcher)
  /  / \\__/ \\  \\    Interface: eth0 (10.10.10.22)
 |  |  /\\  /\\  |   Capture Filter: tcp port 80 or dns
  \\__\\/__\\/__/    Status: Ready — inspecting 142 packets in capture.pcapng

No.  Time        Source          Destination     Protocol Length Info
  1  0.000000    10.10.10.22     10.10.10.15     HTTP     284    POST /api/login HTTP/1.1
  2  0.004120    10.10.10.15     10.10.10.22     HTTP     412    HTTP/1.1 200 OK (application/json)
  3  0.012480    10.10.10.15     10.10.10.1      DNS      78     Standard query A auth.cyberhub.local`,
      };
    }
    return {
      output: `Capturing / Reading from 'capture.pcap'
    1   0.000000 10.10.10.22 → 10.10.10.15  HTTP 284 POST /api/login HTTP/1.1  (application/json)
    4   0.018920 10.10.10.22 → 10.10.10.15  HTTP 312 POST /api/v1/token HTTP/1.1  (application/json)
    9   0.044210 10.10.10.15 → 10.10.10.22  HTTP 520 HTTP/1.1 200 OK  (application/json)
3 packets matched display filter.`,
    };
  }

  if (lower === 'nc' || lower === 'netcat') {
    if (args.includes('--version') || args.includes('-h')) {
      return { output: `OpenBSD netcat (Debian patchlevel 1.226-1ubuntu2)` };
    }
    if (trimmed.includes('-l')) {
      return {
        output: `Listening on 0.0.0.0 4444
Connection received on 10.10.10.15 51920
cyberhub-lab@target:~$ id
uid=1001(labapp) gid=1001(labapp) groups=1001(labapp)`,
      };
    }
    return {
      output: `Connection to 10.10.10.15 22 port [tcp/ssh] succeeded!
nc: connect to 10.10.10.15 port 25 (tcp) failed: Connection refused
Connection to 10.10.10.15 80 port [tcp/http] succeeded!`,
    };
  }

  if (lower === 'tcpdump') {
    if (args.includes('--version')) {
      return {
        output: `tcpdump version 4.99.4
libpcap version 1.10.4 (with TPACKET_V3)
OpenSSL 3.0.13 30 Jan 2024`,
      };
    }
    return {
      output: `tcpdump: listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
09:24:01.114201 IP 10.10.10.22.54812 > 10.10.10.15.80: Flags [S], seq 381042190, win 64240, options [mss 1460], length 0
09:24:01.114590 IP 10.10.10.15.80 > 10.10.10.22.54812: Flags [S.], seq 190441200, ack 381042191, win 65160, length 0
09:24:01.114620 IP 10.10.10.22.54812 > 10.10.10.15.80: Flags [.], ack 1, win 502, length 0
09:24:01.115012 IP 10.10.10.22.54812 > 10.10.10.15.80: Flags [P.], seq 1:84, ack 1, win 502, length 83: HTTP: GET /api/health HTTP/1.1
50 packets captured
50 packets received by filter
0 packets dropped by kernel`,
    };
  }

  if (lower === 'burpsuite') {
    if (args.includes('--version')) {
      return { output: `Burp Suite Community Edition v2026.2.1 (OpenJDK 21.0.4)` };
    }
    return {
      output: `  ____                   ____        _ _
 | __ ) _   _ _ __ _ __ / ___| _   _(_) |_ ___
 |  _ \\| | | | '__| '_ \\\\___ \\| | | | | __/ _ \\
 | |_) | |_| | |  | |_) |___) | |_| | | ||  __/
 |____/ \\__,_|_|  | .__/|____/ \\__,_|_|\\__\\___|
                  |_|   Community Edition v2026.2

[INFO] Initializing Burp Runtime (JDK 21.0.4)...
[INFO] Loaded extensions: Logger++, Autorize
[INFO] Proxy service listening on 127.0.0.1:8080 (HTTP/1.1 & HTTP/2)
[READY] Open FoxyProxy -> 127.0.0.1:8080 to intercept lab requests in Repeater.`,
    };
  }

  if (lower === 'nikto') {
    if (args.includes('--version') || args.includes('-Version')) {
      return { output: `Nikto v2.5.0 (Kali Linux rolling)` };
    }
    return {
      output: `- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          10.10.10.15
+ Target Hostname:    10.10.10.15
+ Target Port:        8080
+ Start Time:         2026-11-18 09:25:10 (UTC)
---------------------------------------------------------------------------
+ Server: nginx/1.24.0
+ /: The anti-clickjacking X-Frame-Options header is not present.
+ /: The X-Content-Type-Options header is not set.
+ /robots.txt: Entry '/backup-config.bak' is listed in robots.txt.
+ /backup-config.bak: Exposed backup archive found (HTTP 200).
+ 7842 requests: 0 error(s) and 4 item(s) reported on remote host
+ End Time:           2026-11-18 09:25:24 (UTC) (14 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested`,
    };
  }

  if (lower === 'john') {
    if (args.includes('--version')) {
      return {
        output: `John the Ripper 1.9.0-jumbo-1 OMP [linux-gnu 64-bit x86_64 AVX2 AC]
Copyright (c) 1996-2019 by Solar Designer and others`,
      };
    }
    return {
      output: `Using default input encoding: UTF-8
Loaded 2 password hashes with 2 different salts (sha512crypt, crypt(3) $6$ [SHA512 256/256 AVX2 4x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
admin123         (testuser)
cybersec2026     (lab_ops)
2g 0:00:00:01 DONE (2026-11-18 09:26) 1.842g/s 2410p/s 2410c/s 4820C/s rockyou..cybersec2026
Use the "--show" option to display all of the cracked passwords reliably
Session completed.`,
    };
  }

  if (lower === 'sha256sum' || lower === 'autopsy') {
    if (args.includes('--version')) {
      return {
        output:
          lower === 'autopsy'
            ? `Autopsy 4.21.0 (The Sleuth Kit 4.12.1)`
            : `sha256sum (GNU coreutils) 9.4`,
      };
    }
    return {
      output: `7f8e91c4a20d5b8e31c49a7f2b0d84e19c30a5b4f7e2d18c90a1b2c3d4e5f607  evidence_disk.dd

[Sleuth Kit / Autopsy Integrity Check]
Partition Layout (mmls):
  000:  Meta      0000000000  0000000000  0000000001  Primary Table (#0)
  002:  000:000   0000002048  0002097151  0002095104  Linux (0x83) /ext4
Evidence hash verified (SHA-256 MATCH). Ready for read-only timeline analysis.`,
    };
  }

  if (lower === 'vol' || lower === 'volatility') {
    if (args.includes('--version') || args.includes('-v')) {
      return { output: `Volatility 3 Framework 2.7.0` };
    }
    return {
      output: `Volatility 3 Framework 2.7.0
Progress:  100.00               PDB scanning finished
PID     PPID    ImageFileName           Offset(V)          Threads  Handles  CreateTime
* 4     0       System                  0xfa80019b4040     96       512      2026-11-18 08:01:10.000000 UTC
** 312  4       smss.exe                0xfa8002b11b30     2        29       2026-11-18 08:01:10.000000 UTC
* 488   408     services.exe            0xfa800349a060     9        214      2026-11-18 08:01:12.000000 UTC
** 1844 488     svchost.exe             0xfa800412c890     18       402      2026-11-18 08:01:15.000000 UTC
** 2912 1844    powershell.exe          0xfa800592b010     12       318      2026-11-18 09:11:44.000000 UTC  [!] RWX VAD flagged`,
    };
  }

  if (lower === 'yara') {
    if (args.includes('--version') || args.includes('-v')) {
      return { output: `4.5.0` };
    }
    return {
      output: `CyberHub_Suspicious_Loader ./quarantine/payload_sample.bin
  0x4b0:$api_alloc: VirtualAlloc
  0x4d8:$c2_route: /beacon/v1/checkin
CyberHub_Packed_UPX ./quarantine/dropper_lab.exe
  0x104:$upx_sig: UPX0`,
    };
  }

  if (lower === 'aircrack-ng') {
    if (args.includes('--version')) {
      return { output: `Aircrack-ng 1.7  - (C) 2006-2022 Thomas d'Otreppe` };
    }
    return {
      output: `                               Aircrack-ng 1.7

      [00:00:01] 14820/25000 keys tested (14820.12 k/s)

      Time left: 0 seconds                                       59.28%

                           KEY FOUND! [ CyberHubLabWPA2! ]


      Master Key     : 4A 91 C2 0E 88 1B F4 73 2D 60 A1 5E 99 0C 3B 71
                       E2 54 19 8A C0 4F 62 B7 11 3E 8C 40 A9 22 7D 05

      Transient Key  : 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
                       1F 44 9C 82 10 3A 7B E5 92 01 4C 68 D3 20 8A F1

      EAPOL HMAC     : 9A 4B 18 7C D2 05 3E 81 66 F0 12 49 B3 8E 21 C7`,
    };
  }

  if (lower === 'openssl') {
    if (args.includes('version') || args.includes('--version')) {
      return { output: `OpenSSL 3.0.13 30 Jan 2024 (Library: OpenSSL 3.0.13 30 Jan 2024)` };
    }
    return {
      output: `CONNECTED(00000003)
depth=2 C = US, O = Internet Security Research Group, CN = ISRG Root X1
verify return:1
depth=1 C = US, O = Let's Encrypt, CN = R10
verify return:1
depth=0 CN = cyberhub-lab.local
verify return:1
---
Certificate chain
 0 s:CN = cyberhub-lab.local
   i:C = US, O = Let's Encrypt, CN = R10
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgISA8xK9CyberHubLabVerifiedX509CertChain...
-----END CERTIFICATE-----
subject=CN = cyberhub-lab.local
---
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Verify return code: 0 (ok)`,
    };
  }

  if (lower === 'systemctl') {
    if (args.includes('--version')) {
      return { output: `systemd 255 (255.4-1ubuntu8.4)` };
    }
    return {
      output: `● wazuh-agent.service - Wazuh agent
     Loaded: loaded (/lib/systemd/system/wazuh-agent.service; enabled; preset: enabled)
     Active: active (running) since Wed 2026-11-18 08:50:12 UTC; 34min ago
   Main PID: 1842 (wazuh-agentd)
      Tasks: 24 (limit: 4612)
     Memory: 48.2M (peak: 54.0M)
        CPU: 4.182s
     CGroup: /system.slice/wazuh-agent.service
             ├─1842 /var/ossec/bin/wazuh-agentd
             ├─1855 /var/ossec/bin/wazuh-syscheckd
             └─1871 /var/ossec/bin/wazuh-logcollector

Nov 18 09:20:18 ubuntu-sec wazuh-agentd[1842]: INFO: Connected to the server ([10.10.10.10]:1514/tcp).
Nov 18 09:21:02 ubuntu-sec wazuh-syscheckd[1855]: INFO: File integrity monitoring scan completed (0 unauthorized changes).`,
    };
  }

  if (lower === 'cd') {
    const dest = args[0] || '~';
    return { output: `[OK] Directory changed to ${dest === '~' ? '/home/user/cyberhub-lab' : dest}` };
  }

  if (lower === 'mkdir') {
    return { output: `[OK] Folder '${args[0] || 'cyber_lab'}' waa la abuuray (directory created).` };
  }

  if (lower === 'touch') {
    return { output: `[OK] Faylka '${args[0] || 'notes.txt'}' waa la abuuray (file created).` };
  }

  if (lower === 'cp' || lower === 'mv') {
    return { output: `[OK] ${lower === 'cp' ? 'La koobiyeeyay' : 'La raray'}: ${args.join(' ') || 'file1 -> file2'}` };
  }

  if (lower === 'rm') {
    return { output: `[OK] Faylka '${args[args.length - 1] || 'temp.txt'}' waa la tirtiray.` };
  }

  if (lower === 'grep') {
    return {
      output: `Nov 17 08:11:02 lab-srv sshd[2410]: Failed password for invalid user admin from 192.168.50.88 port 51204 ssh2
Nov 17 08:11:04 lab-srv sshd[2410]: Failed password for invalid user admin from 192.168.50.88 port 51205 ssh2
Nov 17 08:11:06 lab-srv sshd[2410]: Failed password for root from 192.168.50.88 port 51208 ssh2`,
    };
  }

  if (lower === 'chown') {
    return { output: `[OK] Lahaanshaha faylka waa la cusboonaysiiyay (${args.join(' ') || 'user:user notes.txt'}).` };
  }

  if (lower === 'pkg') {
    const sub = args[0] || 'update';
    if (sub === 'install') {
      const pkgName = args[1] || 'nmap';
      return {
        output: `Termux Package Manager (Android Sandbox):
Checking availability of ${pkgName}...
Unpacking ${pkgName} (aarch64)...
Setting up ${pkgName} ... [OK] Rakibidda way guulaysatay.`,
      };
    }
    return {
      output: `Termux pkg (Simulated Android CLI):
Hit:1 https://packages.termux.dev/apt/termux-main stable InRelease
All packages are up to date.`,
    };
  }

  if (lower === 'whois') {
    const domain = args[0] || 'cyberhub-lab.local';
    return {
      output: `WHOIS Record (Simulated Training Lookup) for ${domain}:
Domain Name: ${domain.toUpperCase()}
Registrar: CyberHub Training Registry
Creation Date: 2024-05-10T00:00:00Z
Name Server: ns1.cyberhub-lab.local
Admin Organization: CyberHub Security Education Lab
DNSSEC: signedDelegation`,
    };
  }

  if (lower === 'msfconsole') {
    if (args.includes('--version') || args.includes('-v')) {
      return { output: `Framework Version: 6.4.12-dev (Kali Linux Rolling)` };
    }
    return {
      output: `                 _---------,
             _--"           "-_
           ,"                   ".
         ,"     _           _     ".
        /      (_)         (_)      \\
       |    ____  _____  _____ ____  |
       |   |    \\|  ___||  ___|  __| |
       |   | | | |___  ||  ___| |__  |
        \\  |_|_|_|____/ |_|   |____/ /
         ".                        ,"
           "-_                  _-"
              "-______________-"

       =[ metasploit v6.4.12-dev                          ]
+ -- --=[ 2418 exploits - 1244 auxiliary - 422 post       ]
+ -- --=[ 1468 payloads - 47 encoders - 11 nops           ]
+ -- --=[ 9 evasion                                       ]

Metasploit Documentation: https://docs.metasploit.com/

msf6 > use exploit/multi/handler
[*] Using configured payload generic/shell_reverse_tcp
msf6 exploit(multi/handler) > set LHOST 10.10.10.22
LHOST => 10.10.10.22
msf6 exploit(multi/handler) > show options

Module options (exploit/multi/handler):
   Name  Current Setting  Required  Description
   ----  ---------------  --------  -----------
   LHOST 10.10.10.22      yes       The listen address (CyberHub Lab Subnet)
   LPORT 4444             yes       The listen port

msf6 exploit(multi/handler) > [*] Sandbox listener staged inside isolated training subnet (10.10.10.0/24).`,
    };
  }

  if (lower === 'msfvenom') {
    return {
      output: `[-] No platform selected explicitly, defaulting to linux/x64 (Simulated Sandbox)
Payload size: 130 bytes
[Sandbox Info] Educational payload blueprint generated for authorized lab verification only.`,
    };
  }

  // Strip leading "sudo" handled above; support package managers & tools
  if (lower === 'apt' || lower === 'apt-get') {
    const sub = (args[0] || '').toLowerCase();
    const isUbuntu = envId === 'ubuntu';
    const repoUrl = isUbuntu
      ? 'http://archive.ubuntu.com/ubuntu jammy InRelease'
      : 'http://http.kali.org/kali kali-rolling InRelease';
    const mirrorBase = isUbuntu
      ? 'http://archive.ubuntu.com/ubuntu jammy/universe amd64'
      : 'http://http.kali.org/kali kali-rolling/main amd64';

    if (sub === 'update') {
      return {
        output: `Hit:1 ${repoUrl}
${isUbuntu ? 'Hit:2 http://security.ubuntu.com/ubuntu jammy-security InRelease\n' : ''}Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
All packages are up to date.`,
      };
    }
    if (sub === 'install') {
      const pkgs = args.filter((a) => !a.startsWith('-') && a !== 'install');
      const targetPkg = pkgs.join(', ') || 'security-tool';
      return {
        output: `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  ${targetPkg}
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 4,812 kB of archives.
Get:1 ${mirrorBase} ${targetPkg} [4,812 kB]
Fetched 4,812 kB in 1s (4,620 kB/s)
Unpacking ${targetPkg} ...
Setting up ${targetPkg} ...
Processing triggers for man-db (2.12.0-4) ...
[OK] Rakibidda '${targetPkg}' way guulaysatay!`,
      };
    }
  }

  if (lower === 'pip' || lower === 'pip3') {
    const pkgName = args.filter((a) => !a.startsWith('-') && a !== 'install').join(' ') || 'tool';
    return {
      output: `Collecting ${pkgName}
  Downloading ${pkgName}-latest-py3-none-any.whl (2.4 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2.4/2.4 MB 8.1 MB/s eta 0:00:00
Installing collected packages: ${pkgName}
Successfully installed ${pkgName} [OK]`,
    };
  }

  if (lower === 'docker') {
    const sub = (args[0] || '').toLowerCase();
    if (args.includes('--version') || args.includes('-v')) {
      return { output: `Docker version 27.3.1, build ce12230` };
    }
    if (sub === 'pull') {
      return {
        output: `Using default tag: stable
Pulling from ${args[1] || 'ghcr.io/zaproxy/zaproxy'}
a2abf6c4d29d: Pull complete
8b4f12c9a11e: Pull complete
Digest: sha256:94e8c4f1d820b6a37490e1c289f5c2e94c8812d93c401a2f128c45608a124001
Status: Downloaded newer image for ${args[1] || 'ghcr.io/zaproxy/zaproxy:stable'} [OK]`,
      };
    }
    if (trimmed.includes('zaproxy') || trimmed.includes('zap-baseline')) {
      return {
        output: `   ______   ___   ______
  |___  /  / _ \\  | ___ \\
     / /  / /_\\ \\ | |_/ /
    / /   |  _  | |  __/
  ./ /___ | | | | | |
  \\_____/ \\_| |_/ \\_|     OWASP ZAP 2.15.0 (Baseline Docker Mode)

Using the Automation Framework
1420 [main] INFO  org.parosproxy.paros.Constant - Initializing ZAP
Total of 18 URLs spidered on http://10.10.10.15
PASS: Directory Browsing [0]
PASS: Vulnerable JS Library [10003]
WARN-NEW: Missing Anti-clickjacking Header [10020] x 3
  http://10.10.10.15/login
WARN-NEW: X-Content-Type-Options Header Missing [10021] x 4
FAIL-NEW: 0   FAIL-INPROG: 0   WARN-NEW: 2   PASS: 64`,
      };
    }
    if (trimmed.includes('sonarqube')) {
      return {
        output: `d4e89c120a4b887e12c9a55f31d84e9012f8a11c3b204e91f7a38c2b109d4402
[Docker] Container 'sonarqube' started cleanly on port 0.0.0.0:9000 -> 9000/tcp
Status: Up and healthy (http://localhost:9000)`,
      };
    }
    if (trimmed.includes('mobsf')) {
      return {
        output: `  __  __       _     ____  _____
 |  \\/  | ___ | |__ / ___||  ___|
 | |\\/| |/ _ \\| '_ \\\\___ \\| |_
 | |  | | (_) | |_) |___) |  _|
 |_|  |_|\\___/|_.__/|____/|_|    Mobile Security Framework v4.1.2

[INFO] Starting MobSF Static & Dynamic Analyzer on http://0.0.0.0:8000
[INFO] Scanning cyberhub_lab.apk (com.cyberhub.mobile)
[WARN] AndroidManifest: android:usesCleartextTraffic="true" (MASVS-NETWORK-1)
[HIGH] Hardcoded API Key found in res/values/strings.xml
[INFO] App Security Score: 42/100 — Full report ready on port 8000.`,
      };
    }
    return {
      output: `[Docker Sandbox] Container executed cleanly in isolated training mode (${args.join(' ')}).`,
    };
  }

  if (lower === 'git' && args[0] === 'clone') {
    const repo = args[1] || 'https://github.com/cyberhub-lab/tool.git';
    return {
      output: `Cloning into sandbox workspace from ${repo}...
remote: Enumerating objects: 142, done.
remote: Total 142 (delta 48), reused 139 (delta 45)
Receiving objects: 100% (142/142), 1.94 MiB | 4.20 MiB/s, done.
[OK] Repository cloned cleanly.`,
    };
  }

  if (lower === 'which') {
    const bin = args[0] || 'nmap';
    if (bin === 'nmap') return { output: `/usr/local/bin/nmap` };
    return { output: `/usr/bin/${bin}` };
  }

  if (args.includes('--version') || args.includes('-V') || args.includes('-v')) {
    return { output: `${cmd} v2026.2 (${envId === 'ubuntu' ? 'Ubuntu 22.04 LTS' : 'Kali Linux Rolling'} — Verified)` };
  }

  if (lower === 'wget' || lower === 'tar') {
    if (lower === 'wget') {
      const url = args[0] || 'https://nmap.org/dist/nmap-7.95.tar.bz2';
      const fileName = url.split('/').pop() || 'source.tar.bz2';
      return {
        output: `--2026-11-18 00:30:12--  ${url}
Resolving source mirror... 45.33.49.119
Connecting... connected.
HTTP request sent, awaiting response... 200 OK
Length: 10548224 (10.1M) [application/x-bzip2]
Saving to: '${fileName}'

${fileName}          100%[===================>]  10.06M  6.42MB/s    in 1.6s

2026-11-18 00:30:14 (6.42 MB/s) - '${fileName}' saved [10548224/10548224]`,
      };
    }
    return {
      output: `[OK] Extracted archive '${args[args.length - 1] || 'source.tar.bz2'}' cleanly into /usr/local/src/`,
    };
  }

  if (lower === './configure') {
    return {
      output: `checking build system type... x86_64-pc-linux-gnu
checking host system type... x86_64-pc-linux-gnu
checking for gcc... gcc
checking for g++... g++
Configuration complete.
                     (
                      \\_.=|____E
                 .-''''''''''-.
              .-'    /   .+.  \\    '-.
            .'      | -|-o-|- |       '.
           (  <O_    \\   '+'  /    _O>  )
            '.       '-.....-'        .'
              '-.                  .-'
                 '-..............-'

  _   _   __  __     _     ____
 | \\ | | |  \\/  |   / \\   |  _ \\
 |  \\| | | |\\/| |  / _ \\  | |_) |
 | |\\  | | |  | | / ___ \\ |  __/
 |_| \\_| |_|  |_|/_/   \\_\\|_|

 NMAP IS A POWERFUL TOOL -- USE CAREFULLY AND RESPONSIBLY
Configured with: ndiff zenmap nping lua ncat openssl
Type make (or gmake on some *BSD machines) to compile.`,
    };
  }

  if (lower === 'make') {
    if (args[0] === 'install') {
      return {
        output: `/usr/bin/install -c -d /usr/local/bin /usr/local/share/man/man1
/usr/bin/install -c -m 755 nmap /usr/local/bin/nmap
/usr/bin/install -c -m 755 nping /usr/local/bin/nping
NMAP SUCCESSFULLY INSTALLED -> /usr/local/bin/nmap`,
      };
    }
    return {
      output: `Compiling liblua / libpcre / nsock / nbase...
g++ -c -O2 -Wall nmap.cc -o nmap.o
g++ -c -O2 -Wall scan_engine.cc -o scan_engine.o
g++ -o nmap nmap.o scan_engine.o -lssl -lcrypto -lpcap
Build finished cleanly (0 errors). Run 'make install' next.`,
    };
  }

  if (lower === 'wifite') {
    if (args.includes('--version') || args.includes('-h')) {
      return { output: `wifite 2.7.0 (Kali Linux Wireless Auditor)` };
    }
    return {
      output: `   .               .
 .´  ·  .     .  ·  \`.      wifite 2.7.0
 :  :  :  (¯)  :  :  :      automated wireless auditor
 \`.  ·  \` / \\ ´  ·  .´      https://github.com/derv82/wifite2
   \`     /___\\     ´

 [+] option: using dictionary /usr/share/wordlists/rockyou.txt
 [+] looking for wireless interfaces...
 [+] enabling monitor mode on wlan0... enabled wlan0mon
 [+] scanning for wireless targets (CTRL+C to select)...

   NUM  ESSID                 CH  ENCR  POWER  WPS?  CLIENT
   ---  --------------------  --  ----  -----  ----  ------
     1  CyberHub_Lab_AP        6  WPA2   74db   no        2
     2  Lab_IoT_Guest         11  WPA2   58db   yes       1

 [+] selecting target #1: CyberHub_Lab_AP (00:11:22:33:44:55)
 [+] waiting for PMKID or WPA 4-way handshake...
 [+] captured handshake -> hs/handshake_CyberHubLabAP.cap
 [+] cracking with aircrack-ng -> KEY FOUND: [ CyberHubLabWPA2! ]`,
    };
  }

  if (lower === 'kismet') {
    if (args.includes('--version')) {
      return { output: `Kismet 2023-07-R2 (802.11 / Bluetooth / SDR Wireless Detector)` };
    }
    return {
      output: `INFO: Reading from /etc/kismet/kismet.conf
INFO: Starting Kismet web server on http://127.0.0.1:2501
INFO: Opening source 'wlan0mon' (Linux Wi-Fi nl80211)
INFO: Channel hopping enabled across 2.4GHz / 5GHz channels

BSSID              SSID                 CH  TYPE       PACKETS  SIGNAL
00:11:22:33:44:55  CyberHub_Lab_AP      6   WPA2-PSK   1420     -38 dBm
AA:BB:CC:11:22:33  <Hidden SSID>        11  WPA2-PSK   312      -54 dBm
DE:AD:BE:EF:00:01  Rogue_EvilTwin_AP    6   Open       84       -41 dBm  [!] ALERT: Rogue AP`,
    };
  }

  if (lower === 'reaver') {
    if (args.includes('--version')) {
      return { output: `Reaver v1.6.6 WiFi Protected Setup Attack Tool` };
    }
    return {
      output: `Reaver v1.6.6 WiFi Protected Setup Attack Tool
Copyright (c) 2011, Tactical Network Solutions, Craig Heffner

[+] Waiting for beacon from 00:11:22:33:44:55
[+] Switching wlan0mon to channel 6
[+] Associated with 00:11:22:33:44:55 (ESSID: Lab_IoT_Guest)
[+] Trying pin "12345670"
[+] Sending EAPOL START request
[+] Received identity request -> Sending M1/M2
[+] [Pixie-Dust] Running pixiewps offline check...
[+] WPS PIN: '48291043'
[+] WPA PSK: 'CyberHubLabWPA2!'
[+] AP SSID: 'Lab_IoT_Guest'`,
    };
  }

  if (lower === 'bettercap') {
    if (args.includes('--version') || args.includes('-version')) {
      return { output: `bettercap v2.33.0 (built for linux amd64 with go1.22)` };
    }
    return {
      output: ` _          _   _
| |__   ___| |_| |_ ___ _ __ ___ __ _ _ __
| '_ \\ / _ \\ __| __/ _ \\ '__/ __/ _\` | '_ \\
| |_) |  __/ |_| ||  __/ | | (_| (_| | |_) |
|_.__/ \\___|\\__|\\__\\___|_|  \\___\\__,_| .__/
                                     |_|   v2.33.0

[sys.log] [inf] net.probe starting net.recon as a requirement
[sys.log] [inf] endpoint.new 10.10.10.1 (Gateway) detected
[sys.log] [inf] endpoint.new 10.10.10.15 (cyberhub-target) detected
[sys.log] [inf] endpoint.new 10.10.10.30 (android-lab-pixel) detected
10.10.10.0/24 > 10.10.10.22 » net.probe on; arp.spoof on; net.sniff on
[10.10.10.15] [http.req] POST http://10.10.10.15/login -> cleartext session spotted`,
    };
  }

  if (lower === 'ettercap') {
    if (args.includes('--version') || args.includes('-V')) {
      return { output: `ettercap 0.8.3.1 (Kali Linux Rolling)` };
    }
    return {
      output: `ettercap 0.8.3.1 copyright 2001-2020 Ettercap Development Team

Listening on: eth0 -> 00:0C:29:4F:A1:8E   10.10.10.22/255.255.255.0

ARP poisoning victims:
 GROUP 1 : 10.10.10.1  00:50:56:C0:00:08
 GROUP 2 : 10.10.10.15 00:0C:29:91:3A:11

Starting Unified sniffing...
HTTP : 10.10.10.15:8080 -> USER: lab_tester  PASS: CyberLabDemo2026! (cleartext)`,
    };
  }

  if (lower === 'responder') {
    if (args.includes('--version')) {
      return { output: `Responder 3.1.4.0` };
    }
    return {
      output: `                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|    v3.1.4.0 (Kali Linux)

[+] Poisoners:
    LLMNR                      [ON]
    NBT-NS                     [ON]
    MDNS                       [ON]
    DNS                        [ON]

[+] Servers:
    HTTP server                [ON]
    SMB server                 [ON]
    LDAP server                [ON]

[+] Listening for events...
[LLMNR]  Poisoned answer sent to 10.10.10.15 for name filesrv-prod
[SMB] NTLMv2-SSP Client   : 10.10.10.15
[SMB] NTLMv2-SSP Username : CYBERHUB\\lab_ops
[SMB] NTLMv2-SSP Hash     : lab_ops::CYBERHUB:1122334455667788:9F4A...`,
    };
  }

  if (lower === 'mitmproxy' || lower === 'mitmdump') {
    if (args.includes('--version')) {
      return {
        output: `Mitmproxy: 11.0.0
Python:    3.12.3
OpenSSL:   3.3.1`,
      };
    }
    return {
      output: `[09:30:11] HTTP/HTTPS proxy listening at *:8080
[09:30:14] 10.10.10.30:54112: client connect (Android Lab Emulator)
[09:30:15] 10.10.10.30:54112: POST https://api.cyberhub.local/v1/mobile/auth
           << 200 OK application/json 428b
[09:30:16] 10.10.10.30:54112: GET https://api.cyberhub.local/v1/users/profile
           Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
           << 200 OK application/json 612b`,
    };
  }

  if (lower === 'adb') {
    if (args.includes('--version') || args.includes('version')) {
      return {
        output: `Android Debug Bridge version 1.0.41
Version 35.0.2-12147458
Installed as /usr/bin/adb`,
      };
    }
    return {
      output: `* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached
emulator-5554          device product:sdk_gphone64_x86_64 model:Pixel_7_Lab transport_id:1
10.10.10.30:5555       device product:cyberhub_android model:Lab_Device transport_id:2

[ADB Shell Verification]
cyberhub_android:/ $ id
uid=2000(shell) gid=2000(shell) groups=2000(shell),1004(input),1007(log),3003(inet)
cyberhub_android:/ $ getprop ro.build.version.release
14`,
    };
  }

  if (lower === 'frida') {
    if (args.includes('--version')) {
      return { output: `16.5.2` };
    }
    return {
      output: `     ____
    / _  |   Frida 16.5.2 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .
   . . . .   Connected to Android Emulator 5554 (USB)

Spawned \`com.cyberhub.mobile\`. Resuming main thread!
[Android Emulator::com.cyberhub.mobile]->
[*] Loading ssl_pinning_check.js ...
[+] javax.net.ssl.SSLContext.init hooked
[+] okhttp3.CertificatePinner.check bypassed inside lab environment
[+] Intercepted mobile API request cleanly in mitmproxy!`,
    };
  }

  if (lower === 'apktool') {
    if (args.includes('--version') || args.includes('-version')) {
      return { output: `2.9.3` };
    }
    return {
      output: `I: Using Apktool 2.9.3 on cyberhub_lab.apk
I: Loading resource table...
I: Decoding file-resources...
I: Decoding values */* XMLs...
I: Decoding AndroidManifest.xml with resources...
I: Baksmaling classes.dex...
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...

[Static Security Audit Notice]
  -> AndroidManifest.xml: android:debuggable="true"   [HIGH]
  -> AndroidManifest.xml: android:allowBackup="true"  [MEDIUM]`,
    };
  }

  if (lower === 'hydra') {
    if (args.includes('-h') || args.includes('--version')) {
      return { output: `Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak` };
    }
    return {
      output: `Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes.

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-11-18 09:33:12
[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344399 login tries
[DATA] attacking ssh://10.10.10.15:22/
[22][ssh] host: 10.10.10.15   login: labadmin   password: Password123!
1 of 1 target successfully completed, 1 valid password found
Hydra finished at 2026-11-18 09:33:14`,
    };
  }

  if (lower === 'hashcat') {
    if (args.includes('--version') || args.includes('-V')) {
      return { output: `v6.2.6` };
    }
    return {
      output: `hashcat (v6.2.6) starting

OpenCL API (OpenCL 3.0 PoCL 5.0) - Platform #1 [The pocl project]
==================================================================
* Device #1: CPU (x86_64), 4096/4096 MB, 4MCU

Minimum password length supported by kernel: 8
Maximum password length supported by kernel: 63

Hashes: 1 digests; 1 unique digests, 1 unique salts
6d2a8b19c4e0...841a:CyberHub_Lab_AP:001122334455:CyberHubLabWPA2!

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 22000 (WPA-PBKDF2-PMKID+EAPOL)
Speed.#1.........:   184.2 kH/s (2.10ms)
Recovered........: 1/1 (100.00%) Digests`,
    };
  }

  if (lower === 'theharvester') {
    if (args.includes('--version') || args.includes('-h')) {
      return { output: `theHarvester 4.6.0 (OSINT Reconnaissance Framework)` };
    }
    return {
      output: `*******************************************************************
*  _   _                                            _             *
* | |_| |__   ___    /\\  /\\__ _ _ ____   _____  ___| |_ ___ _ __  *
* | __| '_ \\ / _ \\  / /_/ / _\` | '__\\ \\ / / _ \\/ __| __/ _ \\ '__| *
* | |_| | | |  __/ / __  / (_| | |   \\ V /  __/\\__ \\ ||  __/ |    *
*  \\__|_| |_|\\___| \\/ /_/ \\__,_|_|    \\_/ \\___||___/\\__\\___|_|    *
*                                                                 *
* theHarvester 4.6.0                                              *
* Coded by Christian Martorella                                   *
*******************************************************************

[*] Target: cyberhub-lab.local

[*] Searching CRTsh.
[*] Searching Dnsdumpster.

[*] Emails found: 2
-------------------
secops@cyberhub-lab.local
admin@cyberhub-lab.local

[*] Hosts found: 4
------------------
api.cyberhub-lab.local:10.10.10.15
portal.cyberhub-lab.local:10.10.10.16
vpn.cyberhub-lab.local:10.10.10.18
mail.cyberhub-lab.local:10.10.10.20`,
    };
  }

  if (lower === 'setoolkit') {
    if (args.includes('--version')) {
      return { output: `Social-Engineer Toolkit (SET) v8.0.3` };
    }
    return {
      output: ` [---]        The Social-Engineer Toolkit (SET)         [---]
 [---]        Created by: David Kennedy (ReL1K)         [---]
 [---]        Version: 8.0.3 (Kali Linux Rolling)       [---]
 [---]        Training Sandbox Mode Only                [---]

 Select from the menu:

   1) Social-Engineering Attacks
   2) Penetration Testing (Fast-Track)
   3) Third Party Modules
   4) Update the Social-Engineer Toolkit
   99) Return to main menu

set> 1
   1) Spear-Phishing Attack Vectors (Awareness Drill)
   2) Website Attack Vectors (Lab Verification)
   5) SMS / QR-Code Awareness Generator
[Sandbox Info] Authorized phishing awareness training environment ready.`,
    };
  }

  return {
    output: `Simulated shell: '${cmd}' is not pre-loaded in this browser demo. Type "help" to list supported sandbox commands.`,
    isError: true,
  };
}

import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';

export const ProgressRing: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
}> = ({ percentage, size = 112, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="cyberProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#08D9E8" />
            <stop offset="50%" stopColor="#1677FF" />
            <stop offset="100%" stopColor="#12D69A" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(120, 150, 210, 0.16)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#cyberProgressGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-xl font-bold text-[#F5F7FF] tabular-nums">
        {percentage}%
      </span>
    </div>
  );
};

export const SafeImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}> = ({ src, alt, className = '', fallbackLabel }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#101A30] via-[#14213B] to-[#0A1224] border border-[rgba(120,150,210,0.18)] text-[#A5B1C8] ${className}`}
      >
        <Shield className="w-7 h-7 text-[#08D9E8] mb-1.5 opacity-80" />
        {fallbackLabel && <span className="text-xs font-medium px-2 text-center truncate max-w-full">{fallbackLabel}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ open, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B18]/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`w-full ${maxWidth} bg-[#101A30] border border-[rgba(120,150,210,0.22)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
      >
        <div className="px-5 py-4 border-b border-[rgba(120,150,210,0.18)] flex items-center justify-between bg-[#0A1224]">
          <h3 className="text-base font-semibold text-[#F5F7FF] truncate">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#14213B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const CyberLogo: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="flex items-center gap-2.5 shrink-0">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#713BFF] to-[#1677FF] flex items-center justify-center shadow-md shadow-[#713BFF]/20">
      <Shield className="w-5 h-5 text-white" />
    </div>
    {!compact && (
      <div className="leading-tight">
        <div className="text-base font-bold tracking-tight text-[#F5F7FF] whitespace-nowrap">
          Cyber<span className="text-[#08D9E8]">Hub</span>
        </div>
        <div className="text-[11px] text-[#A5B1C8] whitespace-nowrap">
          Learn · Build · Secure
        </div>
      </div>
    )}
  </div>
);

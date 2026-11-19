import React, { useState } from 'react';
import { Award, CheckCircle2, Search, Printer, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { Modal, CyberLogo } from '../ui/Primitives';

export const CertificatesView: React.FC = () => {
  const { certificates } = useApp();
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<CertificateItem | null | 'not-found'>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = verifyInput.trim().toLowerCase();
    if (!trimmed) return;
    const match = certificates.find(
      (c) => c.verificationCode.toLowerCase() === trimmed || c.id.toLowerCase() === trimmed
    );
    setVerifyResult(match || 'not-found');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F7FF]">Certificates & Verification</h1>
        <p className="text-xs text-[#A5B1C8] mt-1">
          Preview earned CyberHub course completion certificates and validate verification codes.
        </p>
      </div>

      {/* Honest accreditation notice */}
      <div className="rounded-xl bg-[#14213B] border border-[rgba(120,150,210,0.22)] px-4 py-3 text-xs text-[#A5B1C8] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#08D9E8] shrink-0 mt-0.5" />
        <span>
          Platform Completion Certificates: Certificates shown here are issued by CyberHub to recognize completed platform coursework and quizzes. They are not officially accredited industry certifications.
        </span>
      </div>

      {/* Verification Lookup */}
      <div className="cyber-card p-5 space-y-3">
        <h2 className="text-sm font-bold text-[#F5F7FF]">Public Verification Lookup</h2>
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2.5 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A5B1C8] absolute left-3.5 top-3" />
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="Enter code (e.g. CH-VER-94A2-F81C)..."
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] font-mono text-xs text-[#F5F7FF]"
            />
          </div>
          <button type="submit" className="px-5 h-10 rounded-xl cyber-gradient-btn text-white text-xs font-semibold">
            Verify Code
          </button>
        </form>
        {verifyResult === 'not-found' && (
          <div className="text-xs text-[#FF9F43]">No certificate found matching that verification code.</div>
        )}
        {verifyResult && verifyResult !== 'not-found' && (
          <div className="p-3 rounded-xl bg-[#12D69A]/15 border border-[#12D69A]/30 text-xs text-[#12D69A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Verified CyberHub Certificate for <strong>{verifyResult.studentName}</strong> — {verifyResult.courseName} ({verifyResult.completionDate})
          </div>
        )}
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {certificates.map((cert) => (
          <div key={cert.id} className="cyber-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#713BFF]/20 text-[#08D9E8] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-[#12D69A] tabular-nums">Score: {cert.score}%</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#F5F7FF]">{cert.courseName}</h3>
              <p className="text-xs text-[#A5B1C8] mt-1">
                Awarded to <strong className="text-[#F5F7FF]">{cert.studentName}</strong> · {cert.completionDate}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0A1224] text-xs font-mono text-[#A5B1C8] space-y-1">
              <div>Certificate ID: <span className="text-[#F5F7FF]">{cert.id}</span></div>
              <div>Verification Code: <span className="text-[#08D9E8]">{cert.verificationCode}</span></div>
            </div>

            <button
              onClick={() => setPreviewCert(cert)}
              className="w-full py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold"
            >
              Preview Certificate
            </button>
          </div>
        ))}
      </div>

      {/* Certificate Modal Preview */}
      <Modal
        open={!!previewCert}
        onClose={() => setPreviewCert(null)}
        title="CyberHub Certificate of Completion"
        maxWidth="max-w-2xl"
      >
        {previewCert && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#0A1224] via-[#101A30] to-[#14213B] border-2 border-[#713BFF]/50 space-y-6 text-center">
              <div className="flex justify-center">
                <CyberLogo />
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest text-[#08D9E8] font-semibold">
                  Certificate of Completion
                </div>
                <div className="text-xs text-[#A5B1C8]">This certifies that</div>
                <div className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] pt-1">
                  {previewCert.studentName}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-[#A5B1C8]">has successfully completed the CyberHub program</div>
                <div className="text-lg font-bold text-[#08D9E8]">{previewCert.courseName}</div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[rgba(120,150,210,0.18)] text-left text-[11px]">
                <div>
                  <div className="text-[#A5B1C8]">Date Issued</div>
                  <div className="font-semibold text-[#F5F7FF]">{previewCert.completionDate}</div>
                </div>
                <div>
                  <div className="text-[#A5B1C8]">Verification Code</div>
                  <div className="font-mono text-[#08D9E8]">{previewCert.verificationCode}</div>
                </div>
                <div className="flex justify-end items-center">
                  {/* Clean SVG QR placeholder */}
                  <svg width="44" height="44" viewBox="0 0 44 44" className="rounded bg-white p-1">
                    <rect x="2" y="2" width="12" height="12" fill="#050B18" />
                    <rect x="5" y="5" width="6" height="6" fill="#fff" />
                    <rect x="30" y="2" width="12" height="12" fill="#050B18" />
                    <rect x="33" y="5" width="6" height="6" fill="#fff" />
                    <rect x="2" y="30" width="12" height="12" fill="#050B18" />
                    <rect x="5" y="33" width="6" height="6" fill="#fff" />
                    <rect x="18" y="18" width="8" height="8" fill="#713BFF" />
                    <rect x="30" y="30" width="6" height="6" fill="#050B18" />
                    <rect x="20" y="6" width="5" height="5" fill="#050B18" />
                  </svg>
                </div>
              </div>

              <div className="text-[10px] text-[#A5B1C8] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#12D69A]" />
                Platform Completion Certificate · Issued by CyberHub Learning Platform (Not externally accredited)
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#14213B] text-xs font-semibold text-[#F5F7FF] flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

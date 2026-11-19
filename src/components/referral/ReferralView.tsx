import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Sparkles, Info, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReferralView: React.FC = () => {
  const { user, referrals, paidReferralCount, simulateReferralConversion } = useApp();
  const [copied, setCopied] = useState(false);
  const referralLink = `https://cyberhub.demo/join?ref=${user.username}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const invitedCount = referrals.length;
  const unlocked = paidReferralCount >= 5;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#713BFF]/30 via-[#1677FF]/25 to-[#101A30] border border-[#713BFF]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#08D9E8] uppercase tracking-wider">
            <Gift className="w-4 h-4" />
            Referral Rewards Program
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF]">
            Invite 5 Friends. Get 1 Year of Premium Free.
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B1C8] leading-relaxed">
            Share your unique referral link. When five new users successfully purchase Premium ($10/year), unlock one full year of Premium membership.
          </p>
        </div>

        <div className="shrink-0 space-y-2 w-full lg:w-80">
          <div className="text-xs font-semibold text-[#F5F7FF]">Your Unique Referral Link</div>
          <div className="flex gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] font-mono text-xs text-[#08D9E8]"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 h-10 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex gap-2 text-[11px]">
            <button onClick={handleCopy} className="px-2.5 py-1 rounded-lg bg-[#0A1224] text-[#A5B1C8] hover:text-[#F5F7FF] flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Share via X
            </button>
            <button onClick={handleCopy} className="px-2.5 py-1 rounded-lg bg-[#0A1224] text-[#A5B1C8] hover:text-[#F5F7FF] flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Share via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Progress Tracker 0/5 -> 5/5 */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#F5F7FF]">
              {unlocked ? '5/5 — 1 Year Premium Unlocked!' : `Progress: ${paidReferralCount} / 5 Eligible Paid Referrals`}
            </h2>
            <p className="text-xs text-[#A5B1C8] mt-0.5">
              Each step completes when an invited friend upgrades to Premium.
            </p>
          </div>

          {!unlocked && (
            <button
              onClick={simulateReferralConversion}
              className="px-4 py-2 rounded-xl bg-[#14213B] border border-[#08D9E8]/40 text-xs font-semibold text-[#08D9E8] hover:bg-[#1A2B4D] flex items-center gap-1.5 self-start"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Simulate Friend Upgrade (Demo)
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((step) => {
            const filled = paidReferralCount >= step;
            return (
              <div
                key={step}
                className={`p-3 rounded-xl border text-center transition-all ${
                  filled
                    ? 'bg-[#12D69A]/15 border-[#12D69A] text-[#12D69A]'
                    : 'bg-[#0A1224] border-[rgba(120,150,210,0.16)] text-[#A5B1C8]'
                }`}
              >
                <div className="text-xs font-bold tabular-nums">{step}/5</div>
                <div className="text-[10px] mt-0.5">{filled ? 'Paid' : 'Pending'}</div>
              </div>
            );
          })}
        </div>

        {unlocked && (
          <div className="p-3.5 rounded-xl bg-[#12D69A]/15 border border-[#12D69A]/40 text-xs text-[#12D69A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Congratulations! 5/5 paid referrals reached in this demo — your account has been elevated to Premium status.
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-4">
          <div className="text-xl font-bold text-[#F5F7FF] tabular-nums">{invitedCount}</div>
          <div className="text-xs text-[#A5B1C8]">Total Invited Friends</div>
        </div>
        <div className="cyber-card p-4">
          <div className="text-xl font-bold text-[#12D69A] tabular-nums">{paidReferralCount}</div>
          <div className="text-xs text-[#A5B1C8]">Successful Paid Referrals</div>
        </div>
        <div className="cyber-card p-4">
          <div className="text-xl font-bold text-[#FF9F43] tabular-nums">{Math.max(0, 5 - paidReferralCount)}</div>
          <div className="text-xs text-[#A5B1C8]">Remaining to Unlock</div>
        </div>
        <div className="cyber-card p-4">
          <div className="text-xl font-bold text-[#08D9E8]">{unlocked ? 'Unlocked' : 'In Progress'}</div>
          <div className="text-xs text-[#A5B1C8]">1-Year Reward Status</div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="cyber-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(120,150,210,0.16)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#F5F7FF]">Referral History</h3>
          <span className="text-[11px] text-[#A5B1C8] flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#08D9E8]" />
            Production referral rewards require backend verification.
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A1224] text-[#A5B1C8]">
              <tr>
                <th className="py-3 px-5 font-semibold">Friend</th>
                <th className="py-3 px-5 font-semibold">Joined Date</th>
                <th className="py-3 px-5 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold">Reward Eligible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(120,150,210,0.12)]">
              {referrals.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 px-5 text-[#F5F7FF] font-medium">{r.friendName}</td>
                  <td className="py-3 px-5 text-[#A5B1C8] tabular-nums">{r.joinedDate}</td>
                  <td className="py-3 px-5">
                    <span className={r.status === 'Paid Premium' ? 'text-[#12D69A] font-semibold' : 'text-[#FF9F43]'}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-[#A5B1C8]">{r.rewardEligible ? 'Yes' : 'Waiting for Upgrade'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

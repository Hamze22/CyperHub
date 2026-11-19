import React, { useState } from 'react';
import { Check, Crown, CreditCard, Info, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Primitives';

export const PricingView: React.FC = () => {
  const { user, payments, upgradeToPremiumDemo, navigate } = useApp();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('Card / Stripe (Planned)');
  const [requestLogged, setRequestLogged] = useState(false);

  const handleCheckoutSubmit = () => {
    upgradeToPremiumDemo();
    setRequestLogged(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F7FF]">Membership & Subscription</h1>
        <p className="text-xs text-[#A5B1C8] mt-1">
          Transparent Free vs $10/Year Premium plans, current membership status, and billing preparation.
        </p>
      </div>

      {/* Current Plan Status Card */}
      <div className="cyber-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#08D9E8]">Current Plan Status</div>
          <div className="text-xl font-bold text-[#F5F7FF] flex items-center gap-2">
            {user.membership === 'Premium' && <Crown className="w-5 h-5 text-[#FF9F43]" />}
            {user.membership} Account
          </div>
          <div className="text-xs text-[#A5B1C8] tabular-nums">
            Started: {user.planStartDate} · Expiration: {user.planExpiryDate}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => navigate('referral')}
            className="px-4 py-2.5 rounded-xl bg-[#14213B] border border-[rgba(120,150,210,0.22)] text-xs font-semibold text-[#F5F7FF]"
          >
            Earn Free Year via Referral
          </button>
          <button
            onClick={() => {
              setRequestLogged(false);
              setCheckoutOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold"
          >
            {user.membership === 'Premium' ? 'Renew Premium ($10/yr)' : 'Upgrade to Premium ($10/yr)'}
          </button>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cyber-card p-6 space-y-5">
          <div>
            <div className="text-xs font-semibold text-[#A5B1C8] uppercase">Free Account</div>
            <div className="text-3xl font-bold text-[#F5F7FF] mt-1 tabular-nums">$0</div>
            <p className="text-xs text-[#A5B1C8] mt-1">Core community & starter demos</p>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#F5F7FF]">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#12D69A]" /> Community posts, Q&A & comments</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#12D69A]" /> User profile & direct connections</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#12D69A]" /> Limited terminal demonstration</li>
          </ul>
        </div>

        <div className="cyber-card-elevated p-6 border-[#713BFF]/50 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-[#08D9E8] uppercase">Premium Account</div>
              <div className="text-3xl font-bold text-[#F5F7FF] mt-1 tabular-nums">
                $10 <span className="text-sm font-normal text-[#A5B1C8]">/ Year</span>
              </div>
              <p className="text-xs text-[#A5B1C8] mt-1">Full access to AI Academy, Labs, Tools & Certificates</p>
            </div>
            <Crown className="w-7 h-7 text-[#FF9F43]" />
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#F5F7FF]">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#12D69A]" /> Full AI Academy & AI Tutor (English & Somali)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#12D69A]" /> Advanced multi-OS simulated terminals</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#12D69A]" /> All 21 Penetration Testing Tools & 12 Lab tracks</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#12D69A]" /> Full Quizzes, Exams & Completion Certificates</li>
          </ul>
          <button
            onClick={() => {
              setRequestLogged(false);
              setCheckoutOpen(true);
            }}
            className="w-full py-3 rounded-xl cyber-gradient-btn text-white text-sm font-semibold"
          >
            Upgrade to Premium — $10 / Year
          </button>
        </div>
      </div>

      {/* Payment Methods & Honest Billing History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 cyber-card p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#08D9E8]" />
            Supported Payment Gateways (Integration Ready)
          </h3>
          <div className="space-y-2 text-xs text-[#A5B1C8]">
            <div className="p-3 rounded-xl bg-[#0A1224]">Visa / Mastercard (via future Stripe Checkout)</div>
            <div className="p-3 rounded-xl bg-[#0A1224]">Mobile Money (EVC Plus / Zaad / Sahal planned)</div>
            <div className="p-3 rounded-xl bg-[#0A1224]">PayPal Annual Billing (planned)</div>
          </div>
        </div>

        <div className="lg:col-span-7 cyber-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(120,150,210,0.16)] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F5F7FF]">Billing & Payment History</h3>
            <span className="text-[11px] text-[#A5B1C8]">No live card charges processed</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1224] text-[#A5B1C8]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(120,150,210,0.12)]">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 text-[#A5B1C8] tabular-nums">{p.date}</td>
                    <td className="py-3 px-4 text-[#F5F7FF]">{p.description}</td>
                    <td className="py-3 px-4 font-mono text-[#F5F7FF] tabular-nums">{p.amount}</td>
                    <td className="py-3 px-4 text-[#08D9E8]">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Honest Payment Integration Modal */}
      <Modal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title="Upgrade to CyberHub Premium ($10 / Year)"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-[#14213B] border border-[rgba(120,150,210,0.22)] p-3.5 text-xs text-[#A5B1C8] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#08D9E8] shrink-0 mt-0.5" />
            <span>
              Checkout UI Preview: Payment processor API keys are not connected in this frontend environment. Submitting below records an integration-pending billing entry without charging any card.
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#F5F7FF]">Select Preferred Payment Method</label>
            {['Card / Stripe (Planned)', 'EVC Plus / Mobile Money (Planned)', 'PayPal (Planned)'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium ${
                  selectedMethod === m
                    ? 'bg-[#713BFF]/20 border-[#713BFF] text-[#F5F7FF]'
                    : 'bg-[#0A1224] border-[rgba(120,150,210,0.18)] text-[#A5B1C8]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {requestLogged ? (
            <div className="p-3.5 rounded-xl bg-[#12D69A]/15 border border-[#12D69A]/40 text-xs text-[#12D69A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Upgrade intent recorded ({selectedMethod}). Ready to connect live checkout endpoint when backend billing is enabled.
            </div>
          ) : (
            <button
              onClick={handleCheckoutSubmit}
              className="w-full py-3 rounded-xl cyber-gradient-btn text-white text-xs font-semibold"
            >
              Confirm Upgrade Intent ($10 / Year)
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

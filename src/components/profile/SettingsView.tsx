import React, { useState } from 'react';
import { Globe, Lock, Bell, Shield, CheckCircle2, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../data/i18n';
import { Modal } from '../ui/Primitives';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, user, updateUserProfile, accentTheme, setAccentTheme, navigate, logoutDemo } = useApp();
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [savedToast, setSavedToast] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ fullName: name.trim() || user.fullName, email: email.trim() || user.email });
    setSavedToast('Preferences saved locally.');
    setTimeout(() => setSavedToast(''), 2500);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F7FF]">{t(language, 'settingsTitle')}</h1>
        <p className="text-xs text-[#A5B1C8] mt-1">
          Manage your CyberHub language (English / Somali), account info, notifications, and privacy controls.
        </p>
      </div>

      {savedToast && (
        <div className="p-3 rounded-xl bg-[#12D69A]/15 border border-[#12D69A]/40 text-xs text-[#12D69A] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {savedToast}
        </div>
      )}

      {/* Language Switcher */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#08D9E8]" />
          <div>
            <h2 className="text-sm font-bold text-[#F5F7FF]">{t(language, 'languageLabel')}</h2>
            <p className="text-xs text-[#A5B1C8]">Switch navigation and core labels between English and Somali.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3.5 rounded-xl border text-left text-xs font-semibold ${
              language === 'en' ? 'bg-[#713BFF]/20 border-[#713BFF] text-[#F5F7FF]' : 'bg-[#0A1224] border-[rgba(120,150,210,0.18)] text-[#A5B1C8]'
            }`}
          >
            English (EN)
          </button>
          <button
            onClick={() => setLanguage('so')}
            className={`p-3.5 rounded-xl border text-left text-xs font-semibold ${
              language === 'so' ? 'bg-[#713BFF]/20 border-[#713BFF] text-[#F5F7FF]' : 'bg-[#0A1224] border-[rgba(120,150,210,0.18)] text-[#A5B1C8]'
            }`}
          >
            Af-Soomaali (SO)
          </button>
        </div>
      </div>

      {/* Account Info */}
      <form onSubmit={handleSave} className="cyber-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#12D69A]" />
          Account Settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#A5B1C8] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#A5B1C8] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
            />
          </div>
        </div>
        <button type="submit" className="px-5 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold">
          {t(language, 'saveChanges')}
        </button>
      </form>

      {/* Notifications & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="cyber-card p-6 space-y-3">
          <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#08D9E8]" />
            Notification Preferences
          </h2>
          <label className="flex items-center justify-between text-xs text-[#A5B1C8] cursor-pointer">
            <span>Course & Lab updates</span>
            <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
          </label>
          <label className="flex items-center justify-between text-xs text-[#A5B1C8] cursor-pointer">
            <span>Community replies & likes</span>
            <input type="checkbox" checked={notifCommunity} onChange={(e) => setNotifCommunity(e.target.checked)} />
          </label>
        </div>

        <div className="cyber-card p-6 space-y-3">
          <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#FF9F43]" />
            Privacy & Accent Theme
          </h2>
          <label className="flex items-center justify-between text-xs text-[#A5B1C8] cursor-pointer">
            <span>Show profile in Community Directory</span>
            <input type="checkbox" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} />
          </label>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setAccentTheme('purple-blue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${accentTheme === 'purple-blue' ? 'bg-[#713BFF] text-white' : 'bg-[#0A1224] text-[#A5B1C8]'}`}
            >
              Purple / Electric Blue
            </button>
            <button
              onClick={() => setAccentTheme('cyan-blue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${accentTheme === 'cyan-blue' ? 'bg-[#08D9E8] text-[#050B18]' : 'bg-[#0A1224] text-[#A5B1C8]'}`}
            >
              Cyan Highlight
            </button>
          </div>
        </div>
      </div>

      {/* Subscription & Danger Zone */}
      <div className="cyber-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#F5F7FF]">Membership & Account Actions</div>
          <div className="text-xs text-[#A5B1C8] mt-0.5">Current plan: {user.membership}</div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => navigate('pricing')}
            className="px-4 py-2 rounded-xl bg-[#14213B] text-xs font-semibold text-[#F5F7FF]"
          >
            Manage Subscription
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#FF9F43]/15 border border-[#FF9F43]/40 text-xs font-semibold text-[#FF9F43] flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        </div>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Account Reset">
        <div className="space-y-4 text-xs text-[#A5B1C8]">
          <p>In this frontend preview, confirming will sign out of the demo session and return to the landing page.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 rounded-xl bg-[#14213B] text-[#F5F7FF]">
              Cancel
            </button>
            <button
              onClick={() => {
                setDeleteOpen(false);
                logoutDemo();
              }}
              className="px-4 py-2 rounded-xl bg-[#FF9F43] text-[#050B18] font-bold"
            >
              Confirm Demo Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

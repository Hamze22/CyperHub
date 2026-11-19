import React, { useState } from 'react';
import { Award, BookOpen, FlaskConical, Edit3, CheckCircle2, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage, Modal } from '../ui/Primitives';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    enrolledCourseIds,
    courses,
    completedLabIds,
    certificates,
    posts,
    navigate,
  } = useApp();

  const [editOpen, setEditOpen] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [country, setCountry] = useState(user.country);
  const [bio, setBio] = useState(user.bio);
  const [skillsText, setSkillsText] = useState(user.skills.join(', '));
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || '');

  const myPosts = posts.filter((p) => p.authorUsername === user.username);
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: fullName.trim() || user.fullName,
      country: country.trim() || user.country,
      bio: bio.trim(),
      skills: skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      githubUrl: githubUrl.trim(),
    });
    setEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="cyber-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <SafeImage src={user.avatar} alt={user.fullName} className="w-20 h-20 rounded-2xl object-cover border border-[rgba(120,150,210,0.3)]" />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#F5F7FF]">{user.fullName}</h1>
              <span className="text-xs font-semibold text-[#08D9E8]">{user.membership} Member</span>
            </div>
            <div className="text-xs text-[#A5B1C8]">
              @{user.username} · {user.country} · {user.experienceLevel}
            </div>
            <p className="text-xs sm:text-sm text-[#A5B1C8] max-w-2xl leading-relaxed">{user.bio}</p>
            <div className="text-xs text-[#08D9E8] pt-1">
              {user.skills.join('  ·  ')}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#14213B] border border-[rgba(120,150,210,0.22)] text-xs font-semibold text-[#F5F7FF] flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={() => navigate('settings')}
            className="px-4 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="cyber-card p-4">
          <div className="text-xl font-bold text-[#F5F7FF] tabular-nums">{user.followersCount}</div>
          <div className="text-xs text-[#A5B1C8]">Followers</div>
        </div>
        <div className="cyber-card p-4">
          <div className="text-xl font-bold text-[#F5F7FF] tabular-nums">{user.followingCount}</div>
          <div className="text-xs text-[#A5B1C8]">Following</div>
        </div>
        <div className="cyber-card p-4">
          <div className="text-xl font-bold text-[#12D69A] tabular-nums">{completedLabIds.length}</div>
          <div className="text-xs text-[#A5B1C8]">Labs Completed</div>
        </div>
        <div className="cyber-card p-4">
          <div className="text-xl font-bold text-[#08D9E8] tabular-nums">{certificates.length}</div>
          <div className="text-xs text-[#A5B1C8]">Certificates</div>
        </div>
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="cyber-card p-5 space-y-3">
          <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#08D9E8]" />
            Enrolled Courses ({enrolledCourses.length})
          </h2>
          <div className="space-y-2">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-[#0A1224] text-xs text-[#F5F7FF] flex items-center justify-between">
                <span className="truncate">{c.title}</span>
                <span className="text-[#A5B1C8] shrink-0">{c.difficulty}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('academy')} className="text-xs text-[#08D9E8] hover:underline">
            Go to AI Academy →
          </button>
        </div>

        <div className="cyber-card p-5 space-y-3">
          <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#12D69A]" />
            Earned Certificates ({certificates.length})
          </h2>
          <div className="space-y-2">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-3 rounded-xl bg-[#0A1224] text-xs space-y-0.5">
                <div className="font-semibold text-[#F5F7FF] truncate">{cert.courseName}</div>
                <div className="text-[#A5B1C8] font-mono text-[11px]">{cert.verificationCode}</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('certificates')} className="text-xs text-[#08D9E8] hover:underline">
            View Certificates →
          </button>
        </div>

        <div className="cyber-card p-5 space-y-3">
          <h2 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#FF9F43]" />
            Recent Community Posts ({myPosts.length})
          </h2>
          <div className="space-y-2">
            {myPosts.slice(0, 3).map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-[#0A1224] text-xs space-y-0.5">
                <div className="font-semibold text-[#F5F7FF] truncate">{p.title}</div>
                <div className="text-[#A5B1C8] text-[11px]">{p.createdAt} · {p.likes} likes</div>
              </div>
            ))}
          </div>
          {user.githubUrl && (
            <div className="text-xs text-[#A5B1C8] flex items-center gap-1.5 pt-1">
              <Globe className="w-3.5 h-3.5 text-[#08D9E8]" />
              <span className="truncate">{user.githubUrl}</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-xs text-[#A5B1C8] mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#A5B1C8] mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#A5B1C8] mb-1">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#A5B1C8] mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#A5B1C8] mb-1">GitHub URL</label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Save Profile
          </button>
        </form>
      </Modal>
    </div>
  );
};

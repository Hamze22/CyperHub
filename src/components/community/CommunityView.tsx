import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Flag,
  Send,
  Users,
  Search,
  Code2,
  Image as ImageIcon,
  UserPlus,
  UserCheck,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage, Modal } from '../ui/Primitives';
import { CommunityPost, CommunityUserSummary } from '../../types';

export const CommunityView: React.FC = () => {
  const {
    posts,
    createPost,
    toggleLikePost,
    toggleBookmarkPost,
    addComment,
    groups,
    toggleJoinGroup,
    communityUsers,
    toggleFollowUser,
    dms,
    sendDM,
    user,
  } = useApp();

  const [section, setSection] = useState<'feed' | 'groups' | 'members' | 'messages'>('feed');
  const [feedFilter, setFeedFilter] = useState<
    'Latest' | 'Popular' | 'Following' | 'Q&A' | 'Discussions' | 'Announcements' | 'Challenges'
  >('Latest');

  // Post composer
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<CommunityPost['type']>('Discussion');
  const [category, setCategory] = useState('Web Security');
  const [tagsText, setTagsText] = useState('owasp, learning');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [includeSampleImg, setIncludeSampleImg] = useState(false);

  // Interactions
  const [expandedPostId, setExpandedPostId] = useState<string | null>(posts[0]?.id || null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');
  const [reportModalPost, setReportModalPost] = useState<CommunityPost | null>(null);
  const [reportReason, setReportReason] = useState('Off-topic or spam');
  const [selectedMember, setSelectedMember] = useState<CommunityUserSummary | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [activeDmId, setActiveDmId] = useState(dms[0]?.id || '');
  const [dmInput, setDmInput] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    createPost({
      authorId: user.id,
      authorName: user.fullName,
      authorUsername: user.username,
      authorAvatar: user.avatar,
      authorRole: `${user.membership} Member`,
      authorCountry: user.country,
      type: postType,
      category,
      tags: tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      title: title.trim(),
      content: content.trim(),
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      imagePreview: includeSampleImg ? '/src/assets/images/course_web_security_1794945377421.jpg' : undefined,
    });
    setTitle('');
    setContent('');
    setCodeSnippet('');
    setShowCodeInput(false);
    setIncludeSampleImg(false);
    showToast('Post published to CyberHub Community!');
  };

  const filteredPosts = posts
    .filter((p) => {
      if (feedFilter === 'Q&A') return p.type === 'Question';
      if (feedFilter === 'Discussions') return p.type === 'Discussion';
      if (feedFilter === 'Announcements') return p.type === 'Announcement';
      if (feedFilter === 'Challenges') return p.type === 'Challenge';
      if (feedFilter === 'Following') {
        const followedNames = communityUsers.filter((u) => u.isFollowing).map((u) => u.username);
        return followedNames.includes(p.authorUsername) || p.authorUsername === user.username;
      }
      return true;
    })
    .sort((a, b) => (feedFilter === 'Popular' ? b.likes - a.likes : 0));

  const filteredMembers = communityUsers.filter(
    (m) =>
      m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.username.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  const activeDm = dms.find((d) => d.id === activeDmId) || dms[0];

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#12D69A] text-[#050B18] text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header & Top Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FF]">Cybersecurity Community</h1>
          <p className="text-xs text-[#A5B1C8] mt-1">Share write-ups, ask questions, join study groups, and connect with learners worldwide.</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'feed', label: 'Feed' },
            { id: 'groups', label: 'Groups' },
            { id: 'members', label: 'Members' },
            { id: 'messages', label: 'Direct Messages' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[38px] ${
                section === tab.id
                  ? 'bg-gradient-to-r from-[#713BFF] to-[#1677FF] text-white'
                  : 'bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-[#A5B1C8] hover:text-[#F5F7FF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FEED SECTION */}
      {section === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            {/* Post Composer */}
            <form onSubmit={handleCreatePost} className="cyber-card p-5 space-y-3.5">
              <div className="flex items-center gap-3">
                <SafeImage src={user.avatar} alt={user.fullName} className="w-9 h-9 rounded-full object-cover" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post headline (e.g., How I solved the SQLi lab)..."
                  className="flex-1 h-10 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-sm text-[#F5F7FF] focus:outline-none focus:border-[#713BFF]"
                />
              </div>

              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a tip, ask a cybersecurity question, or post your study progress..."
                className="w-full p-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-sm text-[#F5F7FF] focus:outline-none focus:border-[#713BFF]"
              />

              {showCodeInput && (
                <textarea
                  rows={3}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="Paste bash command or code snippet..."
                  className="w-full p-3 rounded-xl bg-[#050B18] border border-[#08D9E8]/40 font-mono text-xs text-[#08D9E8]"
                />
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as CommunityPost['type'])}
                    className="h-9 px-2.5 rounded-lg bg-[#0A1224] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                  >
                    <option value="Discussion">Discussion</option>
                    <option value="Question">Question</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Challenge">Challenge</option>
                  </select>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-9 px-2.5 rounded-lg bg-[#0A1224] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                  >
                    <option>Web Security</option>
                    <option>Linux</option>
                    <option>Networking</option>
                    <option>Ethical Hacking</option>
                    <option>CTF</option>
                  </select>
                  <input
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder="tags..."
                    className="h-9 w-32 px-2.5 rounded-lg bg-[#0A1224] border border-[rgba(120,150,210,0.2)] text-xs text-[#A5B1C8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCodeInput((v) => !v)}
                    className={`h-9 px-2.5 rounded-lg border text-xs flex items-center gap-1 ${
                      showCodeInput ? 'bg-[#713BFF]/20 border-[#713BFF] text-[#F5F7FF]' : 'bg-[#0A1224] border-[rgba(120,150,210,0.2)] text-[#A5B1C8]'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeSampleImg((v) => !v)}
                    className={`h-9 px-2.5 rounded-lg border text-xs flex items-center gap-1 ${
                      includeSampleImg ? 'bg-[#08D9E8]/20 border-[#08D9E8] text-[#F5F7FF]' : 'bg-[#0A1224] border-[rgba(120,150,210,0.2)] text-[#A5B1C8]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Image
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-4 h-9 rounded-xl cyber-gradient-btn text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish
                </button>
              </div>
            </form>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-1.5">
              {(['Latest', 'Popular', 'Following', 'Q&A', 'Discussions', 'Announcements', 'Challenges'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setFeedFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      feedFilter === tab
                        ? 'bg-[#713BFF] text-white'
                        : 'bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-[#A5B1C8] hover:text-[#F5F7FF]'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                return (
                  <article key={post.id} className="cyber-card p-5 space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => {
                          const found = communityUsers.find((u) => u.username === post.authorUsername);
                          if (found) setSelectedMember(found);
                        }}
                        className="flex items-center gap-3 text-left group"
                      >
                        <SafeImage src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="text-sm font-semibold text-[#F5F7FF] group-hover:text-[#08D9E8] transition-colors">
                            {post.authorName}
                          </div>
                          <div className="text-xs text-[#A5B1C8]">
                            @{post.authorUsername} · {post.createdAt} · {post.category} · {post.type}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => setReportModalPost(post)}
                        aria-label="Report post"
                        className="text-[#A5B1C8] hover:text-[#FF9F43] p-1.5 rounded-lg"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-[#F5F7FF]">{post.title}</h3>
                      <p className="text-xs sm:text-sm text-[#A5B1C8] mt-1.5 leading-relaxed">{post.content}</p>
                    </div>

                    {post.codeSnippet && (
                      <pre className="p-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.18)] text-xs font-mono text-[#08D9E8] overflow-x-auto">
                        {post.codeSnippet}
                      </pre>
                    )}

                    {post.imagePreview && (
                      <div className="rounded-xl overflow-hidden border border-[rgba(120,150,210,0.18)]">
                        <SafeImage src={post.imagePreview} alt={post.title} className="w-full max-h-56 object-cover" />
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="text-xs text-[#08D9E8] font-mono">
                        {post.tags.map((tag) => `#${tag}`).join('  ·  ')}
                      </div>
                    )}

                    <div className="pt-2 border-t border-[rgba(120,150,210,0.12)] flex items-center justify-between text-xs text-[#A5B1C8]">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => toggleLikePost(post.id)}
                          className={`flex items-center gap-1.5 hover:text-[#FF9F43] ${post.likedByMe ? 'text-[#FF9F43]' : ''}`}
                        >
                          <Heart className="w-4 h-4" />
                          <span className="tabular-nums">{post.likes}</span>
                        </button>
                        <button
                          onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                          className="flex items-center gap-1.5 hover:text-[#08D9E8]"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="tabular-nums">{post.comments.length}</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            showToast('Post link copied to clipboard!');
                          }}
                          className="flex items-center gap-1.5 hover:text-[#F5F7FF]"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="tabular-nums">{post.shares}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => toggleBookmarkPost(post.id)}
                        className={`flex items-center gap-1 hover:text-[#08D9E8] ${post.bookmarkedByMe ? 'text-[#08D9E8]' : ''}`}
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>{post.bookmarkedByMe ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-[rgba(120,150,210,0.12)] space-y-3">
                        {post.comments.map((c) => (
                          <div key={c.id} className="p-3 rounded-xl bg-[#0A1224] space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#F5F7FF]">{c.authorName}</span>
                              <span className="text-[#A5B1C8]">{c.createdAt}</span>
                            </div>
                            <p className="text-xs text-[#A5B1C8]">{c.content}</p>
                            {c.replies?.map((r) => (
                              <div key={r.id} className="mt-2 ml-4 pl-3 border-l border-[rgba(120,150,210,0.2)] text-xs">
                                <span className="font-semibold text-[#08D9E8]">{r.authorName}: </span>
                                <span className="text-[#A5B1C8]">{r.content}</span>
                              </div>
                            ))}
                          </div>
                        ))}

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const val = commentInputs[post.id] || '';
                            if (!val.trim()) return;
                            addComment(post.id, val);
                            setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
                          }}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write a helpful reply..."
                            className="flex-1 h-9 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                          />
                          <button type="submit" className="px-3.5 h-9 rounded-xl bg-[#713BFF] text-white text-xs font-semibold">
                            Reply
                          </button>
                        </form>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right sidebar: Groups & Top Members */}
          <div className="lg:col-span-4 space-y-5">
            <div className="cyber-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#F5F7FF]">Active Study Groups</h3>
                <button onClick={() => setSection('groups')} className="text-xs text-[#08D9E8] hover:underline">
                  All Groups
                </button>
              </div>
              <div className="space-y-2.5">
                {groups.slice(0, 3).map((g) => (
                  <div key={g.id} className="p-3 rounded-xl bg-[#0A1224] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#F5F7FF] truncate">{g.name}</div>
                      <div className="text-[11px] text-[#A5B1C8] tabular-nums">{g.membersCount} members · {g.topic}</div>
                    </div>
                    <button
                      onClick={() => toggleJoinGroup(g.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
                        g.joined ? 'bg-[#12D69A]/15 text-[#12D69A]' : 'bg-[#713BFF] text-white'
                      }`}
                    >
                      {g.joined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="cyber-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#F5F7FF]">Community Contributors</h3>
                <button onClick={() => setSection('members')} className="text-xs text-[#08D9E8] hover:underline">
                  Directory
                </button>
              </div>
              <div className="space-y-2.5">
                {communityUsers.slice(0, 4).map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-2">
                    <button onClick={() => setSelectedMember(m)} className="flex items-center gap-2.5 text-left min-w-0">
                      <SafeImage src={m.avatar} alt={m.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#F5F7FF] truncate">{m.fullName}</div>
                        <div className="text-[11px] text-[#A5B1C8] truncate">{m.experienceLevel} · {m.country}</div>
                      </div>
                    </button>
                    <button
                      onClick={() => toggleFollowUser(m.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${
                        m.isFollowing ? 'bg-[#14213B] text-[#08D9E8]' : 'bg-[#713BFF] text-white'
                      }`}
                    >
                      {m.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GROUPS SECTION */}
      {section === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g) => (
            <div key={g.id} className="cyber-card p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#08D9E8]">{g.topic}</span>
                  <span className="text-xs text-[#A5B1C8] tabular-nums">{g.membersCount} members</span>
                </div>
                <h3 className="text-base font-bold text-[#F5F7FF] mt-1">{g.name}</h3>
                <p className="text-xs text-[#A5B1C8] mt-1.5 leading-relaxed">{g.description}</p>
              </div>
              <button
                onClick={() => toggleJoinGroup(g.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold ${
                  g.joined
                    ? 'bg-[#12D69A]/15 text-[#12D69A] border border-[#12D69A]/30'
                    : 'cyber-gradient-btn text-white'
                }`}
              >
                {g.joined ? 'Joined Group' : 'Join Study Group'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MEMBERS SECTION */}
      {section === 'members' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#A5B1C8] absolute left-3.5 top-3" />
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search members by name, @username, or skill..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((m) => (
              <div key={m.id} className="cyber-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <SafeImage src={m.avatar} alt={m.fullName} className="w-12 h-12 rounded-full object-cover" />
                  <div className="min-w-0">
                    <button onClick={() => setSelectedMember(m)} className="text-sm font-bold text-[#F5F7FF] hover:text-[#08D9E8] truncate block">
                      {m.fullName}
                    </button>
                    <div className="text-xs text-[#A5B1C8]">@{m.username} · {m.country}</div>
                  </div>
                </div>
                <p className="text-xs text-[#A5B1C8] line-clamp-2">{m.bio}</p>
                <div className="text-[11px] text-[#08D9E8]">{m.skills.join(' · ')}</div>
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(120,150,210,0.12)] text-xs">
                  <span className="text-[#A5B1C8] tabular-nums">{m.followersCount} followers</span>
                  <button
                    onClick={() => toggleFollowUser(m.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 ${
                      m.isFollowing ? 'bg-[#14213B] text-[#08D9E8]' : 'bg-[#713BFF] text-white'
                    }`}
                  >
                    {m.isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    {m.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIRECT MESSAGES SECTION */}
      {section === 'messages' && (
        <div className="cyber-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[rgba(120,150,210,0.16)] bg-[#0A1224] p-3 space-y-1.5">
            <div className="px-2 py-1 text-xs font-semibold text-[#A5B1C8] uppercase">Conversations</div>
            {dms.map((dm) => (
              <button
                key={dm.id}
                onClick={() => setActiveDmId(dm.id)}
                className={`w-full p-2.5 rounded-xl flex items-center gap-2.5 text-left ${
                  activeDm?.id === dm.id ? 'bg-[#14213B] text-[#F5F7FF]' : 'text-[#A5B1C8] hover:bg-[#101A30]'
                }`}
              >
                <SafeImage src={dm.userAvatar} alt={dm.userName} className="w-9 h-9 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{dm.userName}</div>
                  <div className="text-[11px] opacity-70 truncate">
                    {dm.messages[dm.messages.length - 1]?.text}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-8 flex flex-col justify-between p-4">
            {activeDm ? (
              <>
                <div className="pb-3 border-b border-[rgba(120,150,210,0.14)] flex items-center gap-2.5">
                  <SafeImage src={activeDm.userAvatar} alt={activeDm.userName} className="w-8 h-8 rounded-full object-cover" />
                  <div className="text-sm font-semibold text-[#F5F7FF]">{activeDm.userName}</div>
                </div>
                <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-72">
                  {activeDm.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                        m.sender === 'me'
                          ? 'ml-auto bg-[#713BFF] text-white'
                          : 'bg-[#0A1224] border border-[rgba(120,150,210,0.16)] text-[#F5F7FF]'
                      }`}
                    >
                      <div>{m.text}</div>
                      <div className="text-[10px] opacity-70 mt-1">{m.time}</div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!dmInput.trim()) return;
                    sendDM(activeDm.id, dmInput);
                    setDmInput('');
                  }}
                  className="pt-3 border-t border-[rgba(120,150,210,0.14)] flex gap-2"
                >
                  <input
                    type="text"
                    value={dmInput}
                    onChange={(e) => setDmInput(e.target.value)}
                    placeholder={`Message ${activeDm.userName}...`}
                    className="flex-1 h-10 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
                  />
                  <button type="submit" className="px-4 h-10 rounded-xl cyber-gradient-btn text-white text-xs font-semibold">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="text-xs text-[#A5B1C8] flex items-center gap-2">
                <Users className="w-4 h-4" /> Select a conversation
              </div>
            )}
          </div>
        </div>
      )}

      {/* Member Profile Modal */}
      <Modal
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.fullName || 'Member Profile'}
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <SafeImage src={selectedMember.avatar} alt={selectedMember.fullName} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <div className="text-base font-bold text-[#F5F7FF]">{selectedMember.fullName}</div>
                <div className="text-xs text-[#A5B1C8]">
                  @{selectedMember.username} · {selectedMember.country} · {selectedMember.experienceLevel}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#A5B1C8] leading-relaxed">{selectedMember.bio}</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#0A1224]">
                <div className="text-base font-bold text-[#F5F7FF] tabular-nums">{selectedMember.coursesCompleted}</div>
                <div className="text-[11px] text-[#A5B1C8]">Courses</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1224]">
                <div className="text-base font-bold text-[#F5F7FF] tabular-nums">{selectedMember.certificatesCount}</div>
                <div className="text-[11px] text-[#A5B1C8]">Certificates</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1224]">
                <div className="text-base font-bold text-[#F5F7FF] tabular-nums">{selectedMember.followersCount}</div>
                <div className="text-[11px] text-[#A5B1C8]">Followers</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toggleFollowUser(selectedMember.id);
                  setSelectedMember({
                    ...selectedMember,
                    isFollowing: !selectedMember.isFollowing,
                    followersCount: selectedMember.isFollowing
                      ? selectedMember.followersCount - 1
                      : selectedMember.followersCount + 1,
                  });
                }}
                className="flex-1 py-2.5 rounded-xl cyber-gradient-btn text-white text-xs font-semibold"
              >
                {selectedMember.isFollowing ? 'Unfollow' : 'Follow Member'}
              </button>
              <button
                onClick={() => {
                  setSelectedMember(null);
                  setSection('messages');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#14213B] text-xs font-semibold text-[#F5F7FF] flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                Message
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Report Modal */}
      <Modal
        open={!!reportModalPost}
        onClose={() => setReportModalPost(null)}
        title="Report Community Post"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#A5B1C8]">
            Help keep CyberHub respectful and ethical. Select a reason for reporting this post:
          </p>
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.2)] text-xs text-[#F5F7FF]"
          >
            <option>Off-topic or spam</option>
            <option>Sharing malicious exploit against real targets</option>
            <option>Harassment or abusive language</option>
          </select>
          <button
            onClick={() => {
              setReportModalPost(null);
              showToast('Report logged for moderation review.');
            }}
            className="w-full py-2.5 rounded-xl bg-[#FF9F43] text-[#050B18] text-xs font-bold"
          >
            Submit Report
          </button>
        </div>
      </Modal>
    </div>
  );
};

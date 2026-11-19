import React, { useState } from 'react';
import { Search, BookOpen, Wrench, FlaskConical, HelpCircle, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SearchView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    recentSearches,
    courses,
    tools,
    labs,
    quizzes,
    posts,
    communityUsers,
    openCourseDetail,
    openToolDetail,
    openLabDetail,
    navigate,
  } = useApp();

  const [tab, setTab] = useState<'All' | 'Courses' | 'Tools' | 'Labs' | 'Quizzes' | 'Community'>('All');
  const q = searchQuery.trim().toLowerCase();

  const matchedCourses = courses.filter((c) => !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  const matchedTools = tools.filter((t) => !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  const matchedLabs = labs.filter((l) => !q || l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q));
  const matchedQuizzes = quizzes.filter((qz) => !q || qz.title.toLowerCase().includes(q) || qz.category.toLowerCase().includes(q));
  const matchedPosts = posts.filter((p) => !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
  const matchedUsers = communityUsers.filter((u) => !q || u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));

  const totalMatches =
    matchedCourses.length + matchedTools.length + matchedLabs.length + matchedQuizzes.length + matchedPosts.length + matchedUsers.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F7FF]">Global Search</h1>
        <p className="text-xs text-[#A5B1C8] mt-1">
          Search across CyberHub courses, lessons, tools, labs, quizzes, community posts, and members.
        </p>
      </div>

      <div className="cyber-card p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A5B1C8] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type keyword (e.g., Nmap, SQL, Linux, OWASP)..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#A5B1C8]">Recent:</span>
          {recentSearches.map((item) => (
            <button
              key={item}
              onClick={() => setSearchQuery(item)}
              className="px-2.5 py-1 rounded-lg bg-[#0A1224] text-[#08D9E8] hover:bg-[#14213B]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(['All', 'Courses', 'Tools', 'Labs', 'Quizzes', 'Community'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
              tab === t ? 'bg-[#713BFF] text-white' : 'bg-[#101A30] text-[#A5B1C8]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {totalMatches === 0 ? (
        <div className="cyber-card p-10 text-center space-y-2">
          <div className="text-sm font-bold text-[#F5F7FF]">No matching results for &quot;{searchQuery}&quot;</div>
          <p className="text-xs text-[#A5B1C8]">Try searching &quot;Nmap&quot;, &quot;SQL&quot;, &quot;Linux&quot;, or &quot;Ethical Hacking&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(tab === 'All' || tab === 'Courses') &&
            matchedCourses.map((c) => (
              <button
                key={c.id}
                onClick={() => openCourseDetail(c)}
                className="cyber-card p-4 text-left hover:border-[#713BFF] flex items-start gap-3"
              >
                <BookOpen className="w-5 h-5 text-[#08D9E8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#08D9E8] font-semibold">Course · {c.category}</div>
                  <div className="text-sm font-bold text-[#F5F7FF] mt-0.5">{c.title}</div>
                </div>
              </button>
            ))}

          {(tab === 'All' || tab === 'Tools') &&
            matchedTools.map((t) => (
              <button
                key={t.id}
                onClick={() => openToolDetail(t)}
                className="cyber-card p-4 text-left hover:border-[#713BFF] flex items-start gap-3"
              >
                <Wrench className="w-5 h-5 text-[#FF9F43] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#FF9F43] font-semibold">Tool · {t.category}</div>
                  <div className="text-sm font-bold text-[#F5F7FF] mt-0.5">{t.name}</div>
                </div>
              </button>
            ))}

          {(tab === 'All' || tab === 'Labs') &&
            matchedLabs.map((l) => (
              <button
                key={l.id}
                onClick={() => openLabDetail(l)}
                className="cyber-card p-4 text-left hover:border-[#713BFF] flex items-start gap-3"
              >
                <FlaskConical className="w-5 h-5 text-[#12D69A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#12D69A] font-semibold">Lab · {l.category}</div>
                  <div className="text-sm font-bold text-[#F5F7FF] mt-0.5">{l.title}</div>
                </div>
              </button>
            ))}

          {(tab === 'All' || tab === 'Quizzes') &&
            matchedQuizzes.map((qz) => (
              <button
                key={qz.id}
                onClick={() => navigate('quizzes')}
                className="cyber-card p-4 text-left hover:border-[#713BFF] flex items-start gap-3"
              >
                <HelpCircle className="w-5 h-5 text-[#713BFF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#08D9E8] font-semibold">Quiz · {qz.category}</div>
                  <div className="text-sm font-bold text-[#F5F7FF] mt-0.5">{qz.title}</div>
                </div>
              </button>
            ))}

          {(tab === 'All' || tab === 'Community') &&
            matchedPosts.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate('community')}
                className="cyber-card p-4 text-left hover:border-[#713BFF] flex items-start gap-3"
              >
                <Users className="w-5 h-5 text-[#1677FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#A5B1C8] font-semibold">Community Post · {p.authorName}</div>
                  <div className="text-sm font-bold text-[#F5F7FF] mt-0.5">{p.title}</div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

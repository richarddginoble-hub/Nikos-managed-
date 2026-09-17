import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Pin, 
  Search, 
  Plus, 
  CheckCircle2, 
  Tag, 
  Sparkles, 
  X,
  MessageCircle,
  Clock,
  Send
} from 'lucide-react';
import { CommunityPost, UserProfile } from '../types';

interface CommunityBoardProps {
  user: UserProfile;
}

export const CommunityBoard: React.FC<CommunityBoardProps> = ({ user }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('Fan Stories');
  const [newTags, setNewTags] = useState('');

  // Active reply box state
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const categories = ['All', 'YTON Live', 'Lyrics & Music', 'Tour & Meetups', 'Bouzouki & Band', 'Fan Stories'];

  // Fetch posts from backend
  const loadPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to load community posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Handle Like
  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: data.likes, likedByMe: data.likedByMe } : p))
        );
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe }
            : p
        )
      );
    }
  };

  // Handle Submit Reply
  const handleSubmitReply = async (postId: string) => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch(`/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: user.name,
          content: replyContent
        })
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, comments: [...p.comments, data.comment] } : p
          )
        );
        setReplyContent('');
        setReplyPostId(null);
      }
    } catch (err) {
      // Offline fallback
      const fallbackComment = {
        id: `c-${Date.now()}`,
        author: user.name,
        avatar: user.avatarUrl,
        badge: user.tier,
        content: replyContent,
        createdAt: 'Just now',
        likes: 0
      };
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, fallbackComment] } : p
        )
      );
      setReplyContent('');
      setReplyPostId(null);
    }
  };

  // Handle Create New Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          author: user.name,
          tags: tagsArray.length ? tagsArray : ['VertisFan', 'YTON']
        })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setShowCreateModal(false);
        setNewTitle('');
        setNewContent('');
        setNewTags('');
      }
    } catch (err) {
      const mockPost: CommunityPost = {
        id: `post-${Date.now()}`,
        title: newTitle,
        content: newContent,
        category: newCategory,
        author: user.name,
        avatar: user.avatarUrl,
        badge: user.tier,
        createdAt: 'Just now',
        likes: 1,
        likedByMe: true,
        comments: [],
        tags: tagsArray.length ? tagsArray : ['VertisFan']
      };
      setPosts([mockPost, ...posts]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#232733] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#e5c158] text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Verified Fan Club Community
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Discussion Board & Fan Hub
          </h2>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl">
            Connect with Nikos Vertis enthusiasts worldwide. Share live show experiences at YTON, analyze bouzouki chord progressions, and engage with verified official updates.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#e5c158] to-[#d4af37] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Start New Discussion</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex overflow-x-auto gap-2 w-full sm:w-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20'
                  : 'bg-[#11141d] text-stone-400 hover:text-white border border-[#232733]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions & tags..."
            className="w-full bg-[#11141d] border border-[#232733] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#d4af37]"
          />
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`rounded-2xl border transition-all duration-300 p-6 ${
              post.isPinned
                ? 'bg-gradient-to-r from-[#171b26] via-[#141824] to-[#1a1710] border-[#d4af37] shadow-xl shadow-[#d4af37]/10'
                : 'bg-[#11141d] border-[#232733] hover:border-stone-600'
            }`}
          >
            {/* Header: Author + Verified/Pinned status */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#d4af37]/40">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {post.isVerifiedArtist && (
                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] fill-[#0284c7]" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-white">
                      {post.author}
                    </strong>
                    {post.isVerifiedArtist ? (
                      <span className="bg-[#d4af37] text-black text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider">
                        Official Artist
                      </span>
                    ) : (
                      <span className="bg-[#1e2433] text-stone-400 text-[10px] px-2 py-0.2 rounded-full">
                        {post.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {post.createdAt} • Category: <strong className="text-stone-400">{post.category}</strong>
                  </span>
                </div>
              </div>

              {post.isPinned && (
                <div className="flex items-center gap-1 text-xs font-bold text-[#e5c158] bg-[#d4af37]/15 px-3 py-1 rounded-full border border-[#d4af37]/30">
                  <Pin className="w-3 h-3" />
                  <span>Pinned by Nikos Vertis</span>
                </div>
              )}
            </div>

            {/* Title & Body */}
            <h3 className="font-display font-bold text-lg text-white mb-2">
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line mb-4">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#181d2a] text-stone-400 text-[10px] px-2.5 py-0.5 rounded-full border border-[#262c3e]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions: Likes & Comments count */}
            <div className="pt-3 border-t border-[#232733] flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    post.likedByMe
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-[#0d0f15] border-[#232733] hover:text-white hover:border-stone-500'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes} Likes</span>
                </button>

                <button
                  onClick={() => setReplyPostId(replyPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d0f15] border border-[#232733] hover:text-white hover:border-stone-500 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post.comments.length} Comments</span>
                </button>
              </div>

              <span className="text-[11px] text-stone-500 hidden sm:inline">
                YTON Community Guidelines Protected
              </span>
            </div>

            {/* Comments Stream */}
            {post.comments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#1d2230] space-y-3">
                {post.comments.map((comm) => (
                  <div key={comm.id} className="flex items-start gap-3 bg-[#0b0d13] p-3 rounded-xl border border-[#1e2333]">
                    <img
                      src={comm.avatar}
                      alt={comm.author}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {comm.author}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {comm.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-0.5">
                        {comm.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            {replyPostId === post.id && (
              <div className="mt-4 pt-3 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a comment or greeting..."
                  className="flex-1 bg-[#0b0d13] border border-[#2b3144] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  onClick={() => handleSubmitReply(post.id)}
                  className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#e5c158] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE NEW DISCUSSION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-[#d4af37]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <h3 className="font-display font-bold text-lg text-white">
                Start a New Discussion
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full bg-[#202534] text-stone-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Discussion Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0b0d13] border border-[#282f42] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="e.g. Favorite moment from the YTON Saturday show"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#0b0d13] border border-[#282f42] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="YTON Live">YTON Live</option>
                  <option value="Lyrics & Music">Lyrics & Music</option>
                  <option value="Tour & Meetups">Tour & Meetups</option>
                  <option value="Bouzouki & Band">Bouzouki & Band</option>
                  <option value="Fan Stories">Fan Stories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Content / Your Thoughts *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#0b0d13] border border-[#282f42] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="Share your experience, review, question or concert memories..."
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-[#0b0d13] border border-[#282f42] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="e.g. YtonLive, Bouzouki, Saturday"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1a1e2b] text-stone-300 text-xs font-semibold hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs hover:bg-[#e5c158]"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

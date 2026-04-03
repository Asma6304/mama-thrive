import { useState } from "react";
import { useWellness } from "@/contexts/WellnessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageCircle,
  Heart,
  Plus,
  Users,
  TrendingUp,
  Clock,
  ThumbsUp,
  Reply,
  Search,
  Sparkles,
} from "lucide-react";

// Forum post interface
interface ForumReply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  category: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  replies: ForumReply[];
  pinned?: boolean;
}

// Categories for the forum
const CATEGORIES = [
  { value: "pregnancy", label: "🤰 Pregnancy Journey", color: "bg-coral-light text-coral-dark" },
  { value: "postnatal", label: "👶 Postnatal Care", color: "bg-sage-light text-sage-dark" },
  { value: "nutrition", label: "🍎 Diet & Nutrition", color: "bg-lavender-light text-lavender-dark" },
  { value: "mental-health", label: "🧘 Mental Wellness", color: "bg-accent text-accent-foreground" },
  { value: "baby-care", label: "🍼 Baby Care Tips", color: "bg-secondary text-secondary-foreground" },
  { value: "general", label: "💬 General Chat", color: "bg-muted text-muted-foreground" },
];

// Mock initial posts simulating a supportive mom community
const INITIAL_POSTS: ForumPost[] = [
  {
    id: "1",
    author: "Priya M.",
    avatar: "P",
    category: "pregnancy",
    title: "First trimester nausea tips that actually worked for me! 🌿",
    content:
      "Hi moms! I struggled so much with morning sickness during my first trimester. Here are some things that helped me: ginger tea in the morning, eating small meals every 2 hours, keeping dry crackers by the bedside, and sniffing lemon. Also, ajwain water was a lifesaver! Hope this helps someone. 💕",
    timestamp: "2 hours ago",
    likes: 24,
    liked: false,
    pinned: true,
    replies: [
      {
        id: "1-r1",
        author: "Meera K.",
        avatar: "M",
        content: "The ajwain water tip is amazing! My mom-in-law suggested the same thing and it works wonders. Thank you for sharing! 🙏",
        timestamp: "1 hour ago",
        likes: 8,
        liked: false,
      },
      {
        id: "1-r2",
        author: "Anita R.",
        avatar: "A",
        content: "I also found that coconut water helped a lot. Stay strong, mamas! We've got this! 💪",
        timestamp: "45 mins ago",
        likes: 5,
        liked: false,
      },
    ],
  },
  {
    id: "2",
    author: "Sunita D.",
    avatar: "S",
    category: "postnatal",
    title: "Recovery after C-section – my honest experience",
    content:
      "It's been 3 weeks since my C-section and I wanted to share my recovery journey. The first week was the hardest, but with proper rest, light walking, and family support, things got much better. Don't compare your recovery with others – everyone heals at their own pace. Be gentle with yourself! 🌸",
    timestamp: "5 hours ago",
    likes: 31,
    liked: false,
    replies: [
      {
        id: "2-r1",
        author: "Kavita S.",
        avatar: "K",
        content: "Sending you so much love! I had a C-section too and the recovery is tough but worth it. You're doing amazing, mama! ❤️",
        timestamp: "3 hours ago",
        likes: 12,
        liked: false,
      },
    ],
  },
  {
    id: "3",
    author: "Deepa L.",
    avatar: "D",
    category: "nutrition",
    title: "Iron-rich Indian recipes for pregnancy 🥗",
    content:
      "My hemoglobin was low during pregnancy and I was looking for natural ways to increase iron. Here are some recipes that helped: palak dal, beetroot halwa, dates and jaggery laddoo, ragi porridge, and pomegranate juice. All doctor-approved and tasty too! Will share detailed recipes if anyone is interested.",
    timestamp: "1 day ago",
    likes: 45,
    liked: false,
    replies: [],
  },
  {
    id: "4",
    author: "Rashmi P.",
    avatar: "R",
    category: "mental-health",
    title: "It's okay to not feel okay – postpartum emotions",
    content:
      "I want to remind all new moms that it's completely normal to feel overwhelmed, teary, or anxious after delivery. The 'baby blues' are real and you're not alone. Please don't hesitate to talk to your doctor or a counselor. We're all in this together. You're stronger than you know! 🤗",
    timestamp: "2 days ago",
    likes: 67,
    liked: false,
    replies: [
      {
        id: "4-r1",
        author: "Nisha T.",
        avatar: "N",
        content: "Thank you so much for saying this. I've been feeling guilty about not being happy all the time. This made me feel so much better. 😢💕",
        timestamp: "1 day ago",
        likes: 20,
        liked: false,
      },
      {
        id: "4-r2",
        author: "Fatima A.",
        avatar: "F",
        content: "Absolutely true! I spoke to a counselor and it made such a difference. No shame in asking for help. We're all human. 🌺",
        timestamp: "1 day ago",
        likes: 15,
        liked: false,
      },
    ],
  },
  {
    id: "5",
    author: "Lakshmi V.",
    avatar: "L",
    category: "baby-care",
    title: "Best baby massage oils – traditional Indian choices 🧴",
    content:
      "My grandmother taught me about traditional baby massage and I've been using coconut oil mixed with a little almond oil. The massage helps baby sleep better and strengthens bones. For winter, sesame oil is great. Always warm the oil slightly before use. Anyone else follow traditional massage routines?",
    timestamp: "3 days ago",
    likes: 38,
    liked: false,
    replies: [],
  },
];

const CommunityPage = () => {
  const { userName } = useWellness();
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  // New post form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Filter posts by category and search
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort: pinned first, then by likes
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.likes - a.likes;
  });

  // Handle creating a new post
  const handleCreatePost = () => {
    if (!newTitle.trim() || !newContent.trim() || !newCategory) return;

    const post: ForumPost = {
      id: Date.now().toString(),
      author: userName,
      avatar: userName.charAt(0).toUpperCase(),
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      timestamp: "Just now",
      likes: 0,
      liked: false,
      replies: [],
    };

    setPosts((prev) => [post, ...prev]);
    setNewTitle("");
    setNewContent("");
    setNewCategory("");
    setIsNewPostOpen(false);
  };

  // Handle liking a post
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  // Handle liking a reply
  const handleLikeReply = (postId: string, replyId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              replies: p.replies.map((r) =>
                r.id === replyId
                  ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                  : r
              ),
            }
          : p
      )
    );
  };

  // Handle adding a reply
  const handleAddReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const reply: ForumReply = {
      id: `${postId}-r${Date.now()}`,
      author: userName,
      avatar: userName.charAt(0).toUpperCase(),
      content: replyContent.trim(),
      timestamp: "Just now",
      likes: 0,
      liked: false,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
      )
    );
    setReplyContent("");
    setReplyingTo(null);
  };

  // Get category badge info
  const getCategoryInfo = (value: string) =>
    CATEGORIES.find((c) => c.value === value) || CATEGORIES[5];

  // Stats
  const totalPosts = posts.length;
  const totalReplies = posts.reduce((sum, p) => sum + p.replies.length, 0);
  const totalMembers = 128; // Mock number

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Mom Community
          </h1>
          <p className="text-muted-foreground mt-1">
            A safe space for moms to share, support, and grow together 💕
          </p>
        </div>
        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Share Your Story
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Share with the Community</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a topic" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Give your post a title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={120}
              />
              <Textarea
                placeholder="Share your experience, ask a question, or offer some advice to fellow moms..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                maxLength={2000}
              />
              <Button
                onClick={handleCreatePost}
                disabled={!newTitle.trim() || !newContent.trim() || !newCategory}
                className="w-full"
                variant="hero"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Post to Community
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="coral" className="text-center p-4">
          <p className="text-2xl font-bold text-foreground">{totalMembers}</p>
          <p className="text-xs text-muted-foreground">Moms</p>
        </Card>
        <Card variant="sage" className="text-center p-4">
          <p className="text-2xl font-bold text-foreground">{totalPosts}</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </Card>
        <Card variant="lavender" className="text-center p-4">
          <p className="text-2xl font-bold text-foreground">{totalReplies}</p>
          <p className="text-xs text-muted-foreground">Replies</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌟 All Topics</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No posts found. Be the first to share!</p>
          </Card>
        ) : (
          sortedPosts.map((post) => {
            const catInfo = getCategoryInfo(post.category);
            const isExpanded = expandedPost === post.id;

            return (
              <Card key={post.id} variant="elevated" className="overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  {/* Author row */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{post.author}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.timestamp}
                      </div>
                    </div>
                    <Badge className={catInfo.color + " text-xs"}>
                      {catInfo.label}
                    </Badge>
                  </div>

                  {/* Post content */}
                  <div>
                    <h3 className="font-semibold text-foreground leading-snug">
                      {post.pinned && <span className="text-primary mr-1">📌</span>}
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {isExpanded
                        ? post.content
                        : post.content.length > 180
                        ? post.content.slice(0, 180) + "..."
                        : post.content}
                    </p>
                    {post.content.length > 180 && !isExpanded && (
                      <button
                        onClick={() => setExpandedPost(post.id)}
                        className="text-xs text-primary font-medium mt-1 hover:underline"
                      >
                        Read more
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-1">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        post.liked
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${post.liked ? "fill-primary" : ""}`}
                      />
                      {post.likes}
                    </button>
                    <button
                      onClick={() => {
                        setExpandedPost(post.id);
                        setReplyingTo(replyingTo === post.id ? null : post.id);
                      }}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
                    </button>
                  </div>

                  {/* Replies section */}
                  {isExpanded && post.replies.length > 0 && (
                    <div className="border-t border-border pt-3 space-y-3 ml-4">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-xs shrink-0">
                            {reply.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {reply.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {reply.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                              {reply.content}
                            </p>
                            <button
                              onClick={() => handleLikeReply(post.id, reply.id)}
                              className={`flex items-center gap-1 text-xs mt-1 transition-colors ${
                                reply.liked
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground hover:text-primary"
                              }`}
                            >
                              <ThumbsUp
                                className={`w-3 h-3 ${reply.liked ? "fill-primary" : ""}`}
                              />
                              {reply.likes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input */}
                  {replyingTo === post.id && (
                    <div className="border-t border-border pt-3 flex gap-2">
                      <Input
                        placeholder="Write a supportive reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        maxLength={500}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddReply(post.id);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddReply(post.id)}
                        disabled={!replyContent.trim()}
                      >
                        <Reply className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Supportive footer note */}
      <Card variant="glass" className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          🌸 This is a safe, judgment-free space. Be kind, supportive, and respectful to all moms.
        </p>
      </Card>
    </div>
  );
};

export default CommunityPage;

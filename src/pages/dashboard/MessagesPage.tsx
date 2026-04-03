import { useState } from "react";
import { useWellness } from "@/contexts/WellnessContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Search,
  MessageSquare,
  Circle,
  Check,
  CheckCheck,
} from "lucide-react";

/* ── Types ── */
interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

/* ── Mock conversations ── */
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Priya M.",
    avatar: "P",
    lastMessage: "Thank you so much for the tips! 🙏",
    lastTime: "10 min ago",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", from: "Priya M.", text: "Hi! I saw your post about morning sickness remedies. Can you share the ginger tea recipe?", timestamp: "11:20 AM", read: true },
      { id: "m2", from: "me", text: "Of course! Just boil a small piece of fresh ginger in water for 5 mins, add a little honey and lemon. Works wonders! 🍋", timestamp: "11:25 AM", read: true },
      { id: "m3", from: "Priya M.", text: "That sounds easy! I'll try it tomorrow morning.", timestamp: "11:28 AM", read: true },
      { id: "m4", from: "Priya M.", text: "Also, how many weeks are you now?", timestamp: "11:30 AM", read: false },
      { id: "m5", from: "Priya M.", text: "Thank you so much for the tips! 🙏", timestamp: "11:32 AM", read: false },
    ],
  },
  {
    id: "c2",
    name: "Sunita D.",
    avatar: "S",
    lastMessage: "The baby massage oil you suggested is amazing!",
    lastTime: "1 hour ago",
    unread: 1,
    online: true,
    messages: [
      { id: "m1", from: "me", text: "Hey Sunita! How's recovery going after the C-section?", timestamp: "Yesterday", read: true },
      { id: "m2", from: "Sunita D.", text: "Getting better every day! The walking really helps. 🌸", timestamp: "Yesterday", read: true },
      { id: "m3", from: "me", text: "So glad to hear that! Try warm coconut + almond oil for baby massage too.", timestamp: "Yesterday", read: true },
      { id: "m4", from: "Sunita D.", text: "The baby massage oil you suggested is amazing!", timestamp: "1 hour ago", read: false },
    ],
  },
  {
    id: "c3",
    name: "Deepa L.",
    avatar: "D",
    lastMessage: "I'll share the ragi porridge recipe tomorrow!",
    lastTime: "3 hours ago",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", from: "Deepa L.", text: "Hi! Loved your comment on my iron-rich recipes post!", timestamp: "Yesterday", read: true },
      { id: "m2", from: "me", text: "Your palak dal recipe was so good! My family loved it 😊", timestamp: "Yesterday", read: true },
      { id: "m3", from: "Deepa L.", text: "I'll share the ragi porridge recipe tomorrow!", timestamp: "3 hours ago", read: true },
    ],
  },
  {
    id: "c4",
    name: "Rashmi P.",
    avatar: "R",
    lastMessage: "You're doing great, mama! 💕",
    lastTime: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", from: "me", text: "Your post about postpartum emotions really touched me. Thank you for being so open about it.", timestamp: "2 days ago", read: true },
      { id: "m2", from: "Rashmi P.", text: "It means so much that it helped someone! We need to talk about these things more openly. 🤗", timestamp: "2 days ago", read: true },
      { id: "m3", from: "me", text: "Absolutely. I spoke to a counselor after reading your post.", timestamp: "Yesterday", read: true },
      { id: "m4", from: "Rashmi P.", text: "You're doing great, mama! 💕", timestamp: "Yesterday", read: true },
    ],
  },
  {
    id: "c5",
    name: "Kavita S.",
    avatar: "K",
    lastMessage: "Let me know if you need anything!",
    lastTime: "2 days ago",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", from: "Kavita S.", text: "Welcome to the community! I'm also in my second trimester 😊", timestamp: "3 days ago", read: true },
      { id: "m2", from: "me", text: "That's wonderful! How are you feeling so far?", timestamp: "3 days ago", read: true },
      { id: "m3", from: "Kavita S.", text: "Let me know if you need anything!", timestamp: "2 days ago", read: true },
    ],
  },
];

const MessagesPage = () => {
  const { userName } = useWellness();
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeConvo = conversations.find((c) => c.id === activeConvoId) ?? null;

  /* ── Open a conversation & mark messages read ── */
  const openConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
    setActiveConvoId(id);
  };

  /* ── Send a message (with simulated auto-reply) ── */
  const handleSend = () => {
    if (!newMessage.trim() || !activeConvoId) return;

    const msg: Message = {
      id: `m-${Date.now()}`,
      from: "me",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvoId
          ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastTime: "Just now" }
          : c
      )
    );
    setNewMessage("");

    // Simulate a friendly auto-reply after a short delay
    const replyName = activeConvo?.name ?? "Mom";
    setTimeout(() => {
      const replies = [
        "That's so sweet of you! 💕",
        "I totally understand. You're doing amazing! 🌸",
        "Thank you for sharing! We moms need to stick together 🤗",
        "Sending you so much love and strength! ❤️",
        "That's great advice, I'll try that! 🙏",
      ];
      const autoReply: Message = {
        id: `m-${Date.now()}-reply`,
        from: replyName,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: true,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvoId
            ? { ...c, messages: [...c.messages, autoReply], lastMessage: autoReply.text, lastTime: "Just now" }
            : c
        )
      );
    }, 1500);
  };

  /* ── Filtered conversation list ── */
  const filteredConvos = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  /* ── Chat detail view ── */
  if (activeConvo) {
    return (
      <div className="flex flex-col h-[calc(100vh-5rem)] lg:h-screen">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setActiveConvoId(null)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
            {activeConvo.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">{activeConvo.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {activeConvo.online ? (
                <>
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" /> Online
                </>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
          {activeConvo.messages.map((msg) => {
            const isMe = msg.from === "me";
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border text-foreground rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                      isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp}
                    {isMe &&
                      (msg.read ? (
                        <CheckCheck className="w-3 h-3" />
                      ) : (
                        <Check className="w-3 h-3" />
                      ))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={1000}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  /* ── Conversation list view ── */
  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-primary" />
          Messages
          {totalUnread > 0 && (
            <Badge className="bg-primary text-primary-foreground ml-1">{totalUnread}</Badge>
          )}
        </h1>
        <p className="text-muted-foreground mt-1">Private conversations with fellow moms 💬</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Conversation list */}
      <div className="space-y-2">
        {filteredConvos.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No conversations yet.</p>
          </Card>
        ) : (
          filteredConvos.map((convo) => (
            <Card
              key={convo.id}
              variant="elevated"
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openConversation(convo.id)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                    {convo.avatar}
                  </div>
                  {convo.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold text-sm ${convo.unread > 0 ? "text-foreground" : "text-foreground/80"}`}>
                      {convo.name}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">{convo.lastTime}</span>
                  </div>
                  <p className={`text-sm truncate mt-0.5 ${convo.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {convo.lastMessage}
                  </p>
                </div>

                {/* Unread badge */}
                {convo.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground shrink-0">{convo.unread}</Badge>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card variant="glass" className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          🔒 Your conversations are private and only visible to you and the other mom.
        </p>
      </Card>
    </div>
  );
};

export default MessagesPage;

import React, { createContext, useCallback, useContext, useMemo, useRef, useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Minimize2, Sparkles } from "lucide-react";
import { getAIResponse } from "../lib/ai";

const LUMINA_RESPONSES = [
  "Welcome to Lumina! I can help you find the best pubs, cafes, workshops, and movie roles near you 🎉",
  "Looking for live music? Check out Bunkerzz in Hubli — they have amazing DJ nights every weekend! 🎵",
  "Bombay 63 in Hubli is perfect for a cozy evening with craft cocktails. Happy hours run 6–8 PM 🍹",
  "Ice Cube in Hubli is THE spot for rave parties. Next event is this Saturday! 🎶",
  "Want to book a workshop? We have pottery, painting, and tote bag workshops available this week 🎨",
  "For movie role auditions, check out our Hiring page — KGF Chapter 3 castings are open! 🎬",
  "Our Pubs & Cafes page has filters for cuisine, ambience, price range, and live music availability 🍻",
  "You can bookmark roles you like on the Movie Roles page and come back to them anytime! ❤️",
  "Need help booking? Click 'Book Now' on any event card and follow the checkout steps 🎟️",
  "Check out our Special Offers section on the Pubs & Cafes page for happy hour deals! 🎊",
  "The Countdown Timer on our Workshops page shows you exactly when the next session starts ⏱️",
  "Our AI Suggestions on the Movie Roles page recommends roles based on your profile! ✨",
];

let respIdx = 0;
const getResponse = (input) => {
  const lower = input.toLowerCase();
  if (lower.includes("bunkerzz") || lower.includes("hubli") || lower.includes("pub"))
    return LUMINA_RESPONSES[1];
  if (lower.includes("bombay") || lower.includes("cocktail") || lower.includes("happy hour"))
    return LUMINA_RESPONSES[2];
  if (lower.includes("ice cube") || lower.includes("rave"))
    return LUMINA_RESPONSES[3];
  if (lower.includes("workshop") || lower.includes("pottery") || lower.includes("paint"))
    return LUMINA_RESPONSES[4];
  if (lower.includes("movie") || lower.includes("role") || lower.includes("cast") || lower.includes("kgf"))
    return LUMINA_RESPONSES[5];
  if (lower.includes("filter"))
    return LUMINA_RESPONSES[6];
  if (lower.includes("bookmark"))
    return LUMINA_RESPONSES[7];
  if (lower.includes("book") || lower.includes("ticket"))
    return LUMINA_RESPONSES[8];
  if (lower.includes("offer") || lower.includes("deal"))
    return LUMINA_RESPONSES[9];
  if (lower.includes("timer") || lower.includes("countdown"))
    return LUMINA_RESPONSES[10];
  if (lower.includes("suggest") || lower.includes("ai") || lower.includes("recommend"))
    return LUMINA_RESPONSES[11];
  respIdx = (respIdx + 1) % LUMINA_RESPONSES.length;
  return LUMINA_RESPONSES[respIdx];
};

export function LuminaChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    const greeting = user 
      ? `Welcome back, ${user.name.split(' ')[0]}! How can I assist you in your cinematic journey today? 🎬`
      : LUMINA_RESPONSES[0];
    
    setMessages([{ id: 1, role: "ai", text: greeting, time: new Date() }]);
  }, [user]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const sendMessage = useCallback((e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), role: "user", text, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    scrollToBottom();

    setTimeout(async () => {
      // Try to get AI response
      const aiResponse = await getAIResponse(text);
      
      const aiMsg = { 
        id: Date.now() + 1, 
        role: "ai", 
        text: aiResponse || getResponse(text), // Fallback to hardcoded if AI fails or no key
        time: new Date() 
      };
      
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      scrollToBottom();
    }, 900 + Math.random() * 600);
  }, [input, scrollToBottom]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, fontFamily: "'Outfit', sans-serif" }}>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              width: "360px",
              height: "480px",
              marginBottom: "16px",
              borderRadius: "20px",
              background: "rgba(10, 10, 15, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(138, 43, 226, 0.4)",
              boxShadow: "0 24px 60px rgba(138, 43, 226, 0.3), 0 0 0 1px rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, rgba(138,43,226,0.3), rgba(255,0,127,0.2))",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, #8a2be2, #ff007f)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Sparkles size={18} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "#fff" }}>Lumina AI</div>
                <div style={{ fontSize: "0.75rem", color: "#00ff88", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff88", display: "inline-block", animation: "pulse 2s infinite" }} />
                  Online · Always here to help
                </div>
              </div>
              <button onClick={() => setIsMinimized(true)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", borderRadius: "8px", padding: "6px", display: "flex" }}>
                <Minimize2 size={15} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: "rgba(255,51,102,0.2)", border: "none", color: "#ff3366", cursor: "pointer", borderRadius: "8px", padding: "6px", display: "flex" }}>
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    gap: "8px",
                    alignItems: "flex-end",
                  }}
                >
                  {msg.role === "ai" && (
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #8a2be2, #ff007f)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Sparkles size={14} color="white" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: "76%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #8a2be2, #ff007f)"
                      : "rgba(255,255,255,0.06)",
                    border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
                    color: "#fff",
                    fontSize: "0.87rem",
                    lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #8a2be2, #ff007f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={14} color="white" />
                  </div>
                  <div style={{ padding: "10px 16px", borderRadius: "18px 18px 18px 4px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8a2be2", display: "block" }}
                        animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{
              padding: "12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              background: "rgba(0,0,0,0.2)",
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about events, workshops, roles..."
                style={{
                  flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "10px 14px", color: "#fff",
                  fontFamily: "'Outfit', sans-serif", fontSize: "0.87rem", outline: "none",
                }}
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.92 }}
                style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: "linear-gradient(135deg, #8a2be2, #ff007f)",
                  border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                }}
              >
                <Send size={17} color="white" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized pill */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            key="minimized-pill"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 20px", marginBottom: "16px",
              background: "linear-gradient(135deg, #8a2be2, #ff007f)",
              border: "none", borderRadius: "30px", color: "#fff",
              fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.9rem",
              cursor: "pointer", boxShadow: "0 4px 20px rgba(138,43,226,0.5)",
            }}
          >
            <Sparkles size={16} /> Lumina AI
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toggle FAB */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "linear-gradient(135deg, #8a2be2, #ff007f)",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 4px 24px rgba(138,43,226,0.6)",
            position: "relative",
          }}
          title="Chat with Lumina AI"
        >
          <Bot size={24} color="white" />
          <span style={{
            position: "absolute", top: "-2px", right: "-2px",
            width: "14px", height: "14px", borderRadius: "50%",
            background: "#00ff88", border: "2px solid #0a0a0f",
          }} />
        </motion.button>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your Get Taxi Kovai AI Trip Assistant. Ask me anything about Coimbatore cabs, rates to Ooty/Kodaikanal/Isha Yoga, local rides at ₹80 base & ₹28/km, or call 9043743777 for instant bookings!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        throw new Error('API route unavailable');
      }
    } catch {
      // Local smart fallback AI response generator
      let reply = `Based on Get Taxi Kovai official tariff rate card: `;
      const lower = userMsg.toLowerCase();

      if (lower.includes('ooty') || lower.includes('nilgiri')) {
        reply += `The distance from Coimbatore to Ooty is 86 km (~3 hours drive via Mettupalayam & Coonoor). One-way drop is charged at flat ₹26/km + ₹300 driver batta. Outstation round trips are ₹15/km + ₹400 driver batta per day. Call or WhatsApp 9043743777 to book!`;
      } else if (lower.includes('isha') || lower.includes('adiyogi') || lower.includes('dhyanalinga')) {
        reply += `Isha Yoga Center (Adiyogi 112ft statue) is located 30 km from Coimbatore Junction/Airport (~1 hour drive). Local ride fare starts at Base ₹80 + ₹28/km, or book a flat round-trip drop with driver waiting time.`;
      } else if (lower.includes('valparai') || lower.includes('hairpin')) {
        reply += `Valparai is 105 km from Coimbatore featuring 40 thrilling hairpin bends via Aliyar Dam. We recommend taking an Ertiga SUV or Innova Crysta for comfort. Round trips are ₹15/km + ₹400 driver batta!`;
      } else if (lower.includes('kodai') || lower.includes('kodaikanal')) {
        reply += `Coimbatore to Kodaikanal is 175 km (~4.5 hours drive). One-way drop is flat ₹26/km + ₹300 batta, or ₹15/km + ₹400 batta per day for multi-day tours.`;
      } else {
        reply += `Get Taxi Kovai provides Local Rides (Base ₹80 | ₹28/km), One-Way Drops (Flat ₹26/km + ₹300 batta), Round Trips (₹15/km + ₹400 batta), and Airport Drops (Base ₹100 | ₹30/km). Call 9043743777 for 24/7 instant dispatch!`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (q: string) => {
    setInput(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-900 flex flex-col h-[550px]">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">Kovai Taxi AI Trip Planner</h3>
              <p className="text-[11px] text-slate-500 font-medium">Ask about fares, destinations & routes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-950 p-1 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 text-xs sm:text-sm bg-white">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center text-amber-800 shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 font-bold rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-2.5 items-center text-xs text-slate-500 font-medium">
              <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>Kovai Taxi AI is calculating best rates...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleQuickPrompt('How much for cab to Ooty?')}
            className="bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 px-3 py-1 rounded-full shrink-0 border border-slate-300 font-semibold transition"
          >
            💡 Fare to Ooty?
          </button>
          <button
            onClick={() => handleQuickPrompt('How much to Isha Adiyogi?')}
            className="bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 px-3 py-1 rounded-full shrink-0 border border-slate-300 font-semibold transition"
          >
            💡 Isha Yoga drop?
          </button>
          <button
            onClick={() => handleQuickPrompt('Best vehicle for Valparai?')}
            className="bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 px-3 py-1 rounded-full shrink-0 border border-slate-300 font-semibold transition"
          >
            💡 Valparai trip advice?
          </button>
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Type your trip question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="taxi-yellow-btn text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center justify-center transition cursor-pointer border border-amber-400 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

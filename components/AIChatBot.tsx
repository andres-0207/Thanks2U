import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const aiResponse = await sendChatMessage(messages, userMsg);
    
    setMessages(prev => [...prev, aiResponse || "Error connecting to AI."]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-2xl flex items-center justify-center z-50 text-white transition-all transform hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-fade-in-up" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-navy p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <h3 className="text-white font-bold">Asistente Thanks2U</h3>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <p className="text-slate-400 text-sm text-center mt-10">
                ¡Hola! Soy la IA de Thanks2U. <br/> Pregúntame sobre las becas o cómo ayudar.
              </p>
            )}
            {messages.map((msg, idx) => {
              const isUser = idx % 2 === 0;
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[80%] p-3 rounded-2xl text-sm
                    ${isUser ? 'bg-navy text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}
                  `}>
                    {msg}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-200 p-3 rounded-2xl rounded-bl-none text-xs text-slate-500 italic animate-pulse">
                  Escribiendo...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu duda..."
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
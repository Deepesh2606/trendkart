'use client';
import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AI Market Assistant (powered by Groq). How can I help you optimize your inventory today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Send only user/assistant messages to the API (system prompt is handled in the route)
      const apiMessages = newMessages.map(({ role, content }) => ({ role, content }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `**Network Error:** ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-xl hover:shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all duration-300 custom-focus-ring flex items-center justify-center"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-stone-900 w-full sm:w-[400px] h-[550px] max-h-[80vh] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-stone-50 dark:bg-stone-950 p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                <Sparkles size={18} />
              </div>
              <h3 className="font-bold text-sm">Market Intelligence AI</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors p-1 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 custom-focus-ring"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-stone-50/50 dark:bg-stone-900/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 ml-3' 
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mr-3'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-sm prose prose-sm dark:prose-invert prose-p:leading-snug max-w-none ${
                    msg.role === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-tl-none shadow-sm'
                  }`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] flex-row">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mr-3 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-tl-none shadow-sm flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-orange-500" />
                    <span className="text-stone-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about margins, trends, products..."
                disabled={isLoading}
                className="w-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:hover:bg-orange-600 transition-colors custom-focus-ring"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
          
        </div>
      )}
    </div>
  );
}

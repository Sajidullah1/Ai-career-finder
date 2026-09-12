import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Trash2, 
  HelpCircle, 
  Briefcase, 
  BookOpen, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const { assistantMessages, sendAssistantMessage, isAssistantThinking, clearAssistantChat, analysisResult } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "How can I improve my CV for Junior Frontend roles?",
    "What projects should I build to learn Docker quickly?",
    "Why didn't I get a 100% match on the Apex Cloud role?",
    "Can you give me 5 behavioral and technical interview questions?",
    "How do I write an impactful bullet for my e-commerce project?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages, isAssistantThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAssistantThinking) return;

    const message = inputText.trim();
    setInputText('');
    await sendAssistantMessage(message);
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                AI Career Assistant
              </h1>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {analysisResult
                ? `Grounded in ${analysisResult.candidate.name}'s verified skills & project history`
                : 'General career advisor (Upload a CV for personalized grounding)'}
            </p>
          </div>
        </div>

        {assistantMessages.length > 1 && (
          <button
            onClick={clearAssistantChat}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-rose-600"
            title="Reset conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Suggested:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPrompt(prompt)}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="mt-4 flex min-h-[440px] max-h-[560px] flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 overflow-y-auto">
        <div className="space-y-4">
          {assistantMessages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-xs rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span className={`mt-2 block text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking animation bubble */}
          {isAssistantThinking && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs rounded-bl-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="mt-1 block text-[10px] text-slate-400">Thinking with Gemini...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about your CV, skill gaps, interview prep, or job matching score..."
            disabled={isAssistantThinking}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-4 pr-12 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
            id="assistant-input-field"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAssistantThinking}
            className={`absolute right-2 rounded-xl p-2 transition active:scale-95 ${
              !inputText.trim() || isAssistantThinking
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
            }`}
            id="assistant-send-btn"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Grounding Disclaimer */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
        <span>Advice is tailored to your profile. AI does not submit applications or offer employment guarantees.</span>
      </div>
    </div>
  );
};

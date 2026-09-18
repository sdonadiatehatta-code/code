import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
} from 'lucide-react';
import { LetterDocument, ChatMessage } from '../types';

interface AssistantPanelProps {
  document: LetterDocument;
  onDocumentChange: (updated: Partial<LetterDocument>) => void;
  messages: ChatMessage[];
  onSendMessage: (instruction: string) => void;
  isLoading: boolean;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
  document,
  onDocumentChange,
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Standard Indian English accent support

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
      }
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="w-full lg:w-[35%] bg-slate-50 border-r border-slate-200 flex flex-col h-full overflow-hidden shadow-xs shrink-0">
      {/* 
        DOCUMENT FIELDS — ONLY TWO USER-EDITABLE CONTROL FIELDS
        1. Memo No.
        2. Date
      */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center gap-3 shrink-0 shadow-xs z-10">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <label
            htmlFor="input-memo-no"
            className="text-xs font-semibold text-slate-700 whitespace-nowrap"
          >
            Memo No.
          </label>
          <input
            id="input-memo-no"
            type="text"
            value={document.memoNo || ''}
            onChange={(e) => onDocumentChange({ memoNo: e.target.value })}
            placeholder="e.g. 142/Dev/SDO"
            className="w-full text-xs px-2.5 py-1 rounded bg-slate-50 hover:bg-white border border-slate-300 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition font-mono"
            title="Document Memo Number"
          />
        </div>

        <div className="w-[160px] sm:w-[170px] flex items-center gap-2 shrink-0">
          <label
            htmlFor="input-date"
            className="text-xs font-semibold text-slate-700 whitespace-nowrap"
          >
            Date
          </label>
          <input
            id="input-date"
            type="text"
            value={document.date || ''}
            onChange={(e) => onDocumentChange({ date: e.target.value })}
            placeholder="DD/MM/YYYY"
            className="w-full text-xs px-2.5 py-1 rounded bg-slate-50 hover:bg-white border border-slate-300 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition font-mono"
            title="Document Issue Date"
          />
        </div>
      </div>

      {/* AI Conversation / Instruction Stream (No large technical headings) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs shadow-2xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 rounded-tl-none shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Drafting official changes...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Text and Speech/Microphone Controls */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSend} className="relative flex flex-col gap-2">
          <div className="relative flex items-center">
            <textarea
              ref={inputRef}
              id="assistant-instruction-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Type or speak instruction to draft, revise, or edit letter..."
              disabled={isLoading}
              className="w-full text-xs p-2.5 pr-18 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition resize-none leading-relaxed"
            />

            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {/* Microphone Voice Button */}
              {isSpeechSupported && (
                <button
                  type="button"
                  id="btn-voice-input"
                  onClick={toggleListening}
                  title={isListening ? 'Stop listening' : 'Speak instruction'}
                  className={`p-1.5 rounded transition ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-3.5 h-3.5" />
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              {/* Send Button */}
              <button
                type="submit"
                id="btn-send-instruction"
                disabled={!inputText.trim() || isLoading}
                className="p-1.5 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-emerald-700 text-white transition shadow-2xs"
                title="Send instruction to assistant"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {isListening && (
              <span className="text-rose-600 font-medium animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                Listening to voice...
              </span>
            )}
          </div>
        </form>
      </div>
    </aside>
  );
};

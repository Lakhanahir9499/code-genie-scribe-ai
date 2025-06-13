
import React, { useState } from 'react';
import { X, Send, Bot, Code, Sparkles } from 'lucide-react';
import { EditorFile } from '@/types/editor';

const GEMINI_API_KEY = 'AIzaSyCPezF6be0GtS76zM3j0_BSu0bVYIRTkpk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface AIAssistantProps {
  onClose: () => void;
  currentFile?: EditorFile;
  onCodeGenerate: (code: string) => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onClose,
  currentFile,
  onCodeGenerate
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI coding assistant. I can help you write, debug, and improve your code. What would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = currentFile ? 
        `Current file: ${currentFile.name} (${currentFile.language})\nCurrent content:\n${currentFile.content}\n\nUser request: ${input}` :
        input;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful coding assistant. ${context}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response.';

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Check if response contains code and offer to apply it
      if (aiResponse.includes('```') && currentFile) {
        const codeBlocks = aiResponse.match(/```[\s\S]*?```/g);
        if (codeBlocks && codeBlocks.length > 0) {
          // Extract first code block
          const code = codeBlocks[0].replace(/```\w*\n?/, '').replace(/```$/, '');
          if (code.trim()) {
            setTimeout(() => {
              if (window.confirm('Apply this code to the current file?')) {
                onCodeGenerate(code.trim());
              }
            }, 500);
          }
        }
      }
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      <div className="flex items-center justify-between p-3 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2">
          <Bot size={16} />
          <h2 className="text-sm font-medium">AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[#3c3c3c]"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-[#007acc] flex items-center justify-center flex-shrink-0">
                <Bot size={12} />
              </div>
            )}
            <div
              className={`max-w-[85%] p-2 rounded text-sm ${
                message.type === 'user'
                  ? 'bg-[#007acc] text-white'
                  : 'bg-[#3c3c3c] text-[#cccccc]'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
            </div>
            {message.type === 'user' && (
              <div className="w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center flex-shrink-0">
                <span className="text-xs">You</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-[#007acc] flex items-center justify-center flex-shrink-0">
              <Bot size={12} />
            </div>
            <div className="bg-[#3c3c3c] text-[#cccccc] p-2 rounded text-sm">
              <div className="flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#3c3c3c]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your code..."
            className="flex-1 bg-[#3c3c3c] text-white px-3 py-2 text-sm rounded border-none outline-none"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-3 py-2 bg-[#007acc] text-white rounded text-sm hover:bg-[#005a9e] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
        {currentFile && (
          <div className="text-xs text-[#888] mt-1">
            Working on: {currentFile.name}
          </div>
        )}
      </div>
    </div>
  );
};

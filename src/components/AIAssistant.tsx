
import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, Plus } from 'lucide-react';
import { EditorFile } from '@/types/editor';

const GEMINI_API_KEY = 'AIzaSyCPezF6be0GtS76zM3j0_BSu0bVYIRTkpk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface AIAssistantProps {
  onClose: () => void;
  currentFile?: EditorFile;
  onCodeGenerate: (code: string) => void;
  onNewFile: (name: string, content: string, language: string) => void;
  files: EditorFile[];
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
  onCodeGenerate,
  onNewFile,
  files
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI coding assistant. I can help you:\n• Generate new HTML, CSS, JS files\n• Edit existing code\n• Create complete web projects\n\nJust tell me what you want to create!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const detectFileType = (request: string): { type: string; language: string; extension: string } => {
    const lowerRequest = request.toLowerCase();
    
    if (lowerRequest.includes('css') || lowerRequest.includes('style')) {
      return { type: 'CSS', language: 'css', extension: 'css' };
    }
    if (lowerRequest.includes('javascript') || lowerRequest.includes('js') || lowerRequest.includes('script')) {
      return { type: 'JavaScript', language: 'javascript', extension: 'js' };
    }
    if (lowerRequest.includes('html') || lowerRequest.includes('webpage') || lowerRequest.includes('website')) {
      return { type: 'HTML', language: 'html', extension: 'html' };
    }
    
    // Default based on current file or HTML
    if (currentFile) {
      return { 
        type: currentFile.language.toUpperCase(), 
        language: currentFile.language, 
        extension: currentFile.name.split('.').pop() || 'js' 
      };
    }
    
    return { type: 'HTML', language: 'html', extension: 'html' };
  };

  const generatePrompt = (userInput: string, fileInfo: { type: string; language: string }) => {
    if (currentFile && currentFile.content.trim()) {
      return `You are editing a ${fileInfo.type} file named "${currentFile.name}".

Current code:
${currentFile.content}

User request: ${userInput}

Please provide the complete modified ${fileInfo.type} code based on the user's request. Only return the code without any explanations, markdown formatting, or comments. Make sure the code is syntactically correct and complete.`;
    } else {
      return `Generate complete ${fileInfo.type} code for: ${userInput}

Requirements:
- Create fully functional and complete code
- Use modern best practices
- Make it responsive if it's HTML/CSS
- Only return the code without explanations or markdown formatting
- Ensure the code is syntactically correct and ready to use`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const fileInfo = detectFileType(userInput);
      const promptText = generatePrompt(userInput, fileInfo);

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: promptText
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response.';

      // Clean the code - remove markdown formatting if present
      const cleanCode = aiResponse
        .replace(/```[\w]*\n?/g, '')
        .replace(/```$/g, '')
        .replace(/^`|`$/g, '')
        .trim();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Generated ${fileInfo.type} code and applied to editor!`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Auto-apply the generated code
      if (cleanCode && cleanCode.length > 10) {
        if (currentFile) {
          // Edit existing file
          onCodeGenerate(cleanCode);
        } else {
          // Create new file
          const fileName = `generated_${Date.now()}.${fileInfo.extension}`;
          onNewFile(fileName, cleanCode, fileInfo.language);
        }
      }

    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please check your internet connection and try again.',
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

  const quickActions = [
    { text: 'Create a landing page', action: () => setInput('Create a landing page') },
    { text: 'Add CSS styles', action: () => setInput('Add CSS styles') },
    { text: 'Add JavaScript functionality', action: () => setInput('Add JavaScript functionality') },
    { text: 'Make it responsive', action: () => setInput('Make it responsive') },
  ];

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
              <div className="whitespace-pre-wrap">{message.content}</div>
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
                <span>Generating code...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="p-3 border-t border-[#3c3c3c] border-b border-[#3c3c3c]">
          <div className="text-xs text-[#888] mb-2">Quick actions:</div>
          <div className="grid grid-cols-1 gap-1">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="text-left text-xs p-2 rounded bg-[#3c3c3c] hover:bg-[#4c4c4c] text-[#cccccc]"
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 border-t border-[#3c3c3c]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me what to code..."
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
        <div className="flex items-center justify-between text-xs text-[#888] mt-1">
          <div>
            {currentFile ? `Editing: ${currentFile.name}` : 'No file selected - will create new file'}
          </div>
          <div className="flex items-center gap-1">
            <span>Supports: HTML, CSS, JS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

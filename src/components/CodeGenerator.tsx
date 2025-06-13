
import React, { useState } from 'react';
import { Play, Code, Download, Eye, EyeOff } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyCPezF6be0GtS76zM3j0_BSu0bVYIRTkpk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface CodeGeneratorProps {
  onCodeGenerated: (code: string, language: string) => void;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ onCodeGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [language, setLanguage] = useState('html');

  const generateCode = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate ${language} code for: ${prompt}. Only return the code without any explanations or markdown formatting.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data = await response.json();
      const code = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Clean the code - remove markdown formatting if present
      const cleanCode = code.replace(/```[\w]*\n?/g, '').replace(/```$/g, '').trim();
      
      setGeneratedCode(cleanCode);
      onCodeGenerated(cleanCode, language);
    } catch (error) {
      console.error('Code generation error:', error);
      setGeneratedCode('// Error generating code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const runCode = () => {
    if (language === 'html' && generatedCode) {
      setShowPreview(true);
    }
  };

  const downloadCode = () => {
    if (!generatedCode) return;
    
    const extension = language === 'html' ? 'html' : language === 'css' ? 'css' : 'js';
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      <div className="p-3 border-b border-[#3c3c3c]">
        <h2 className="text-sm font-medium text-white mb-3">AI Code Generator</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#cccccc] mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#3c3c3c] text-white px-2 py-1 text-xs rounded border-none outline-none"
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="python">Python</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-[#cccccc] mb-1">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build..."
              className="w-full bg-[#3c3c3c] text-white px-2 py-1 text-xs rounded border-none outline-none resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={generateCode}
              disabled={!prompt.trim() || isGenerating}
              className="flex-1 bg-[#007acc] text-white px-3 py-1 text-xs rounded hover:bg-[#005a9e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <Code size={12} />
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
            
            {generatedCode && language === 'html' && (
              <button
                onClick={runCode}
                className="bg-[#28a745] text-white px-3 py-1 text-xs rounded hover:bg-[#218838] flex items-center justify-center gap-1"
              >
                <Play size={12} />
                Run
              </button>
            )}
            
            {generatedCode && (
              <button
                onClick={downloadCode}
                className="bg-[#6c757d] text-white px-3 py-1 text-xs rounded hover:bg-[#5a6268] flex items-center justify-center gap-1"
              >
                <Download size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {generatedCode && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-2 bg-[#2c2c2c] border-b border-[#3c3c3c] flex items-center justify-between">
            <span className="text-xs text-[#cccccc]">Generated Code</span>
            {language === 'html' && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-xs text-[#cccccc] hover:text-white"
              >
                {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            )}
          </div>
          
          <div className="flex-1 flex min-h-0">
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} min-h-0`}>
              <pre className="h-full overflow-auto bg-[#1e1e1e] text-[#cccccc] p-3 text-xs font-mono">
                {generatedCode}
              </pre>
            </div>
            
            {showPreview && language === 'html' && (
              <div className="w-1/2 border-l border-[#3c3c3c]">
                <div className="h-full bg-white">
                  <iframe
                    srcDoc={generatedCode}
                    className="w-full h-full border-none"
                    title="Live Preview"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

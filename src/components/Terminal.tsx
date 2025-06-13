
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2 } from 'lucide-react';

interface TerminalProps {
  onClose: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onClose }) => {
  const [commands, setCommands] = useState<Array<{ input: string; output: string }>>([
    { input: '', output: 'Welcome to VS Code Terminal\nType "help" for available commands.' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = '';

    switch (trimmedCmd) {
      case 'help':
        output = `Available commands:
  help    - Show this help message
  clear   - Clear terminal
  ls      - List files
  pwd     - Show current directory
  date    - Show current date
  echo    - Echo text
  version - Show version info`;
        break;
      case 'clear':
        setCommands([]);
        return;
      case 'ls':
        output = 'index.html  style.css  script.js  README.md';
        break;
      case 'pwd':
        output = '/workspace/project';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'version':
        output = 'VS Code Terminal v1.0.0\nNode.js v18.17.0\nnpm v9.6.7';
        break;
      default:
        if (trimmedCmd.startsWith('echo ')) {
          output = cmd.substring(5);
        } else if (trimmedCmd === '') {
          output = '';
        } else {
          output = `Command not found: ${cmd}\nType "help" for available commands.`;
        }
    }

    setCommands(prev => [...prev, { input: cmd, output }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      setCommandHistory(prev => [...prev, currentInput]);
      executeCommand(currentInput);
    } else {
      setCommands(prev => [...prev, { input: '', output: '' }]);
    }
    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : commandHistory.length - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#cccccc]">
      <div className="flex items-center justify-between p-2 bg-[#2c2c2c] border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} />
          <span className="text-xs font-medium">Terminal</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#3c3c3c]"
          >
            <Minimize2 size={12} />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#3c3c3c]"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-2 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {commands.map((cmd, index) => (
          <div key={index} className="mb-1">
            {cmd.input !== '' && (
              <div className="flex items-center">
                <span className="text-green-400">$</span>
                <span className="ml-2">{cmd.input}</span>
              </div>
            )}
            {cmd.output && (
              <div className="whitespace-pre-wrap text-[#cccccc] ml-4">
                {cmd.output}
              </div>
            )}
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ml-2 bg-transparent border-none outline-none flex-1 text-[#cccccc]"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

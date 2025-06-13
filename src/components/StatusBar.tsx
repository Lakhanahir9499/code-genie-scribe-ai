
import React from 'react';
import { GitBranch, Bell, Settings } from 'lucide-react';
import { EditorFile } from '@/types/editor';

interface StatusBarProps {
  file?: EditorFile;
  cursorPosition: { line: number; column: number };
  onTogglePanel?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  file,
  cursorPosition,
  onTogglePanel
}) => {
  return (
    <div className="h-6 bg-[#007acc] flex items-center justify-between px-2 text-white text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <span>No problems</span>
        {file && (
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {file && (
          <span>{file.language}</span>
        )}
        <span>UTF-8</span>
        <span>LF</span>
        <button 
          onClick={onTogglePanel}
          className="hover:bg-[#005a9e] px-1 rounded"
        >
          Terminal
        </button>
        <Bell size={12} />
        <Settings size={12} />
      </div>
    </div>
  );
};

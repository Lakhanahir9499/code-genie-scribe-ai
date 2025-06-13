
import React from 'react';
import { X } from 'lucide-react';
import { EditorFile } from '@/types/editor';

interface TabBarProps {
  files: EditorFile[];
  activeFileId: string;
  onTabSelect: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  files,
  activeFileId,
  onTabSelect,
  onTabClose
}) => {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'js': return '📜';
      case 'ts': return '📘';
      case 'json': return '📋';
      case 'md': return '📝';
      default: return '📄';
    }
  };

  if (files.length === 0) {
    return <div className="h-8 bg-[#2c2c2c] border-b border-[#3c3c3c]" />;
  }

  return (
    <div className="h-8 bg-[#2c2c2c] border-b border-[#3c3c3c] flex overflow-x-auto">
      {files.map((file) => (
        <div
          key={file.id}
          className={`flex items-center min-w-0 max-w-48 border-r border-[#3c3c3c] ${
            file.id === activeFileId 
              ? 'bg-[#1e1e1e] text-white' 
              : 'bg-[#2c2c2c] text-[#cccccc] hover:bg-[#3c3c3c]'
          }`}
        >
          <div
            onClick={() => onTabSelect(file.id)}
            className="flex items-center gap-2 px-3 py-1 flex-1 min-w-0 cursor-pointer"
          >
            <span className="text-xs">{getFileIcon(file.name)}</span>
            <span className="text-xs truncate">{file.name}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(file.id);
            }}
            className="p-1 hover:bg-[#3c3c3c] rounded-sm mr-1"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

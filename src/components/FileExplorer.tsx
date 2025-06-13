
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Download, Trash2 } from 'lucide-react';
import { EditorFile } from '@/types/editor';
import JSZip from 'jszip';

interface FileExplorerProps {
  files: EditorFile[];
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
  onNewFile: (name: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDownload: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onFileSelect,
  onNewFile,
  onDeleteFile,
  onDownload
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'js': return '📜';
      case 'ts': return '📘';
      case 'tsx': return '⚛️';
      case 'jsx': return '⚛️';
      case 'json': return '📋';
      case 'md': return '📝';
      case 'py': return '🐍';
      case 'java': return '☕';
      default: return '📄';
    }
  };

  const handleNewFile = () => {
    if (newFileName.trim()) {
      onNewFile(newFileName.trim());
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNewFile();
    } else if (e.key === 'Escape') {
      setShowNewFileInput(false);
      setNewFileName('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#252526] text-white">
      <div className="p-2 border-b border-[#3c3c3c]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[#cccccc]">Explorer</h3>
          <div className="flex gap-1">
            <button
              onClick={() => setShowNewFileInput(true)}
              className="p-1 rounded hover:bg-[#3c3c3c]"
              title="New File"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={onDownload}
              className="p-1 rounded hover:bg-[#3c3c3c]"
              title="Download Project"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-1">
          <div className="flex items-center gap-1 py-1 px-2 hover:bg-[#2a2d2e] rounded">
            <ChevronDown size={12} />
            <FolderOpen size={14} className="text-[#dcb67a]" />
            <span className="text-xs">PROJECT</span>
          </div>
          
          <div className="ml-4">
            {showNewFileInput && (
              <div className="flex items-center gap-1 py-1 px-2 ml-2">
                <File size={14} className="text-[#858585]" />
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={() => {
                    if (!newFileName.trim()) {
                      setShowNewFileInput(false);
                    }
                  }}
                  placeholder="filename.ext"
                  className="bg-[#3c3c3c] text-white text-xs px-1 py-0.5 border border-[#007acc] rounded outline-none flex-1"
                  autoFocus
                />
              </div>
            )}
            
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between gap-1 py-1 px-2 ml-2 hover:bg-[#2a2d2e] rounded cursor-pointer group ${
                  file.id === activeFileId ? 'bg-[#37373d]' : ''
                }`}
                onClick={() => onFileSelect(file.id)}
              >
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-xs">{getFileIcon(file.name)}</span>
                  <span className="text-xs truncate">{file.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#3c3c3c]"
                  title="Delete File"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

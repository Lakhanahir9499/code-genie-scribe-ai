
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Plus, 
  Download,
  Search,
  GitBranch,
  Settings,
  Folder,
  FolderOpen
} from 'lucide-react';
import { EditorFile } from '@/types/editor';

interface SidebarProps {
  view: 'explorer' | 'search' | 'git' | 'extensions';
  files: EditorFile[];
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
  onNewFile: (name: string) => void;
  onDownload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  files,
  activeFileId,
  onFileSelect,
  onNewFile,
  onDownload
}) => {
  const [expanded, setExpanded] = useState(true);
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const handleNewFile = () => {
    if (newFileName.trim()) {
      onNewFile(newFileName.trim());
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

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

  const renderExplorer = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-[#3c3c3c]">
        <h2 className="text-xs uppercase tracking-wide text-[#cccccc] font-medium">Explorer</h2>
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
      
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <div className="flex items-center mb-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm hover:bg-[#3c3c3c] px-1 py-0.5 rounded"
            >
              {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {expanded ? <FolderOpen size={14} /> : <Folder size={14} />}
              <span>PROJECT</span>
            </button>
          </div>
          
          {expanded && (
            <div className="ml-4">
              {showNewFileInput && (
                <div className="mb-2">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNewFile();
                      if (e.key === 'Escape') setShowNewFileInput(false);
                    }}
                    onBlur={handleNewFile}
                    className="w-full bg-[#3c3c3c] text-white px-2 py-1 text-sm rounded border-none outline-none"
                    placeholder="filename.ext"
                    autoFocus
                  />
                </div>
              )}
              
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onFileSelect(file.id)}
                  className={`flex items-center gap-2 p-1 text-sm cursor-pointer rounded ${
                    file.id === activeFileId 
                      ? 'bg-[#37373d] text-white' 
                      : 'text-[#cccccc] hover:bg-[#2a2a2a]'
                  }`}
                >
                  <span>{getFileIcon(file.name)}</span>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#3c3c3c]">
        <h2 className="text-xs uppercase tracking-wide text-[#cccccc] font-medium mb-2">Search</h2>
        <input
          type="text"
          className="w-full bg-[#3c3c3c] text-white px-3 py-2 text-sm rounded border-none outline-none"
          placeholder="Search files..."
        />
      </div>
      <div className="flex-1 p-3 text-sm text-[#cccccc]">
        No search results
      </div>
    </div>
  );

  const renderGit = () => (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#3c3c3c]">
        <h2 className="text-xs uppercase tracking-wide text-[#cccccc] font-medium">Source Control</h2>
      </div>
      <div className="flex-1 p-3 text-sm text-[#cccccc]">
        Initialize Repository
      </div>
    </div>
  );

  const renderExtensions = () => (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#3c3c3c]">
        <h2 className="text-xs uppercase tracking-wide text-[#cccccc] font-medium">Extensions</h2>
      </div>
      <div className="flex-1 p-3 text-sm text-[#cccccc]">
        No extensions installed
      </div>
    </div>
  );

  switch (view) {
    case 'explorer': return renderExplorer();
    case 'search': return renderSearch();
    case 'git': return renderGit();
    case 'extensions': return renderExtensions();
    default: return renderExplorer();
  }
};

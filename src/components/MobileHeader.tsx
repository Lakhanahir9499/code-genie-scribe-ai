
import React from 'react';
import { Menu, Download, Plus, Bot, Sparkles, Eye } from 'lucide-react';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  onDownload: () => void;
  onNewFile: (name: string) => void;
  onToggleAI?: () => void;
  onToggleCodeGenerator?: () => void;
  onToggleLivePreview?: () => void;
  showLivePreview?: boolean;
  activeFile?: any;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuToggle,
  onDownload,
  onNewFile,
  onToggleAI,
  onToggleCodeGenerator,
  onToggleLivePreview,
  showLivePreview,
  activeFile
}) => {
  return (
    <div className="h-12 bg-[#2c2c2c] flex items-center justify-between px-4 border-b border-[#3c3c3c]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1 rounded hover:bg-[#3c3c3c]"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-medium">Code Editor</span>
      </div>
      
      <div className="flex items-center gap-2">
        {onToggleCodeGenerator && (
          <button
            onClick={onToggleCodeGenerator}
            className="p-1 rounded hover:bg-[#3c3c3c]"
            title="AI Code Generator"
          >
            <Sparkles size={16} className="text-yellow-400" />
          </button>
        )}
        
        {onToggleAI && (
          <button
            onClick={onToggleAI}
            className="p-1 rounded hover:bg-[#3c3c3c]"
            title="AI Assistant"
          >
            <Bot size={16} />
          </button>
        )}
        
        {onToggleLivePreview && activeFile?.language === 'html' && (
          <button
            onClick={onToggleLivePreview}
            className={`p-1 rounded hover:bg-[#3c3c3c] ${showLivePreview ? 'bg-[#007acc]' : ''}`}
            title="Live Preview"
          >
            <Eye size={16} />
          </button>
        )}
        
        <button
          onClick={() => onNewFile(`file${Date.now()}.js`)}
          className="p-1 rounded hover:bg-[#3c3c3c]"
          title="New File"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={onDownload}
          className="p-1 rounded hover:bg-[#3c3c3c]"
          title="Download Project"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};

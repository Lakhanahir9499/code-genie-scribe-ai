
import React from 'react';
import { Menu, Download, Plus, Bot } from 'lucide-react';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  onDownload: () => void;
  onNewFile: (name: string) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuToggle,
  onDownload,
  onNewFile
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
        <button
          onClick={() => onNewFile(`file${Date.now()}.js`)}
          className="p-1 rounded hover:bg-[#3c3c3c]"
          title="New File"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={onDownload}
          className="p-1 rounded hover:bg-[#3c3c3c]"
          title="Download Project"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

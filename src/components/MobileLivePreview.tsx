
import React from 'react';
import { X } from 'lucide-react';

interface MobileLivePreviewProps {
  code: string;
  onClose: () => void;
}

export const MobileLivePreview: React.FC<MobileLivePreviewProps> = ({
  code,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-[#1e1e1e] z-50 flex flex-col">
      <div className="h-12 bg-[#2c2c2c] flex items-center justify-between px-4 border-b border-[#3c3c3c]">
        <span className="text-sm font-medium text-white">Live Preview</span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[#3c3c3c]"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 bg-white">
        <iframe
          srcDoc={code}
          className="w-full h-full border-none"
          title="Live Preview"
        />
      </div>
    </div>
  );
};

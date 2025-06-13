
import React from 'react';
import { 
  Files, 
  Search, 
  GitBranch, 
  Settings, 
  Bot,
  Menu
} from 'lucide-react';

interface ActivityBarProps {
  activeView: 'explorer' | 'search' | 'git' | 'extensions';
  onViewChange: (view: 'explorer' | 'search' | 'git' | 'extensions') => void;
  onToggleSidebar: () => void;
  onToggleAI: () => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeView,
  onViewChange,
  onToggleSidebar,
  onToggleAI
}) => {
  const activities = [
    { id: 'explorer' as const, icon: Files, label: 'Explorer' },
    { id: 'search' as const, icon: Search, label: 'Search' },
    { id: 'git' as const, icon: GitBranch, label: 'Source Control' },
    { id: 'extensions' as const, icon: Settings, label: 'Extensions' },
  ];

  return (
    <div className="w-12 bg-[#2c2c2c] flex flex-col items-center py-2 border-r border-[#3c3c3c]">
      <button
        onClick={onToggleSidebar}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3c3c3c] mb-4"
        title="Toggle Sidebar"
      >
        <Menu size={20} />
      </button>
      
      {activities.map((activity) => (
        <button
          key={activity.id}
          onClick={() => onViewChange(activity.id)}
          className={`w-8 h-8 flex items-center justify-center rounded mb-2 ${
            activeView === activity.id 
              ? 'bg-[#37373d] border-l-2 border-[#007acc]' 
              : 'hover:bg-[#3c3c3c]'
          }`}
          title={activity.label}
        >
          <activity.icon size={20} />
        </button>
      ))}
      
      <div className="flex-1" />
      
      <button
        onClick={onToggleAI}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3c3c3c] mb-2"
        title="AI Assistant"
      >
        <Bot size={20} />
      </button>
    </div>
  );
};

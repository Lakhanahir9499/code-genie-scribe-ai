
import React, { useState, useCallback } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Sidebar } from '@/components/Sidebar';
import { AIAssistant } from '@/components/AIAssistant';
import { TabBar } from '@/components/TabBar';
import { StatusBar } from '@/components/StatusBar';
import { ActivityBar } from '@/components/ActivityBar';
import { MobileHeader } from '@/components/MobileHeader';
import { EditorFile } from '@/types/editor';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [files, setFiles] = useState<EditorFile[]>([
    {
      id: '1',
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to your code editor</p>
</body>
</html>`,
      language: 'html',
      isActive: true
    }
  ]);

  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [sidebarView, setSidebarView] = useState<'explorer' | 'search' | 'git' | 'extensions'>('explorer');
  const [showAI, setShowAI] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(true);
  const isMobile = useIsMobile();

  const activeFile = files.find(f => f.id === activeFileId);

  const handleFileContentChange = useCallback((content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, content } : file
    ));
  }, [activeFileId]);

  const handleTabClose = useCallback((fileId: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      if (fileId === activeFileId && updated.length > 0) {
        setActiveFileId(updated[0].id);
      }
      return updated;
    });
  }, [activeFileId]);

  const handleNewFile = useCallback((name: string, content: string = '', language: string = 'javascript') => {
    const newFile: EditorFile = {
      id: Date.now().toString(),
      name,
      content,
      language,
      isActive: false
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  }, []);

  const downloadProject = useCallback(() => {
    const JSZip = require('jszip');
    const zip = new JSZip();
    
    files.forEach(file => {
      zip.file(file.name, file.content);
    });
    
    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }, [files]);

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
        <MobileHeader 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onDownload={downloadProject}
          onNewFile={handleNewFile}
        />
        
        {!sidebarCollapsed && (
          <div className="h-64 border-b border-[#3c3c3c]">
            <Sidebar
              view={sidebarView}
              files={files}
              activeFileId={activeFileId}
              onFileSelect={setActiveFileId}
              onNewFile={handleNewFile}
              onDownload={downloadProject}
            />
          </div>
        )}
        
        <TabBar
          files={files}
          activeFileId={activeFileId}
          onTabSelect={setActiveFileId}
          onTabClose={handleTabClose}
        />
        
        <div className="flex-1 min-h-0">
          <CodeEditor
            file={activeFile}
            onContentChange={handleFileContentChange}
          />
        </div>
        
        <StatusBar 
          file={activeFile}
          cursorPosition={{ line: 1, column: 1 }}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#1e1e1e] text-white overflow-hidden">
      <ActivityBar
        activeView={sidebarView}
        onViewChange={setSidebarView}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleAI={() => setShowAI(!showAI)}
      />
      
      {!sidebarCollapsed && (
        <div className="w-64 border-r border-[#3c3c3c] flex-shrink-0">
          <Sidebar
            view={sidebarView}
            files={files}
            activeFileId={activeFileId}
            onFileSelect={setActiveFileId}
            onNewFile={handleNewFile}
            onDownload={downloadProject}
          />
        </div>
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        <TabBar
          files={files}
          activeFileId={activeFileId}
          onTabSelect={setActiveFileId}
          onTabClose={handleTabClose}
        />
        
        <div className="flex-1 min-h-0">
          <CodeEditor
            file={activeFile}
            onContentChange={handleFileContentChange}
          />
        </div>
        
        {!panelCollapsed && (
          <div className="h-64 border-t border-[#3c3c3c]">
            <div className="h-full bg-[#252526] p-4">
              <h3 className="text-sm font-medium mb-2">Terminal</h3>
              <div className="bg-black p-2 rounded text-green-400 font-mono text-sm">
                $ Ready for commands...
              </div>
            </div>
          </div>
        )}
        
        <StatusBar 
          file={activeFile}
          cursorPosition={{ line: 1, column: 1 }}
          onTogglePanel={() => setPanelCollapsed(!panelCollapsed)}
        />
      </div>
      
      {showAI && (
        <div className="w-80 border-l border-[#3c3c3c] flex-shrink-0">
          <AIAssistant
            onClose={() => setShowAI(false)}
            currentFile={activeFile}
            onCodeGenerate={(code) => handleFileContentChange(code)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;

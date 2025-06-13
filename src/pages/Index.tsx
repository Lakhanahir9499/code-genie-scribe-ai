import React, { useState, useCallback } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Sidebar } from '@/components/Sidebar';
import { AIAssistant } from '@/components/AIAssistant';
import { TabBar } from '@/components/TabBar';
import { StatusBar } from '@/components/StatusBar';
import { ActivityBar } from '@/components/ActivityBar';
import { MobileHeader } from '@/components/MobileHeader';
import { MobileLivePreview } from '@/components/MobileLivePreview';
import { FileExplorer } from '@/components/FileExplorer';
import { Terminal } from '@/components/Terminal';
import { EditorFile } from '@/types/editor';
import { useIsMobile } from '@/hooks/use-mobile';
import JSZip from 'jszip';

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
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #007acc; }
        .container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to VS Code Editor!</h1>
        <p>This is a fully functional code editor with AI assistance.</p>
        <button onclick="alert('Hello from JavaScript!')">Click me!</button>
    </div>
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
  const [showTerminal, setShowTerminal] = useState(false);
  const [showMobileLivePreview, setShowMobileLivePreview] = useState(false);
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
    const ext = name.split('.').pop()?.toLowerCase();
    let detectedLanguage = language;
    
    switch (ext) {
      case 'html': detectedLanguage = 'html'; break;
      case 'css': detectedLanguage = 'css'; break;
      case 'js': detectedLanguage = 'javascript'; break;
      case 'ts': detectedLanguage = 'typescript'; break;
      case 'tsx': detectedLanguage = 'typescript'; break;
      case 'jsx': detectedLanguage = 'javascript'; break;
      case 'json': detectedLanguage = 'json'; break;
      case 'md': detectedLanguage = 'markdown'; break;
      case 'py': detectedLanguage = 'python'; break;
    }

    const newFile: EditorFile = {
      id: Date.now().toString(),
      name,
      content,
      language: detectedLanguage,
      isActive: false
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  }, []);

  const handleDeleteFile = useCallback((fileId: string) => {
    if (files.length === 1) return;
    
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      if (fileId === activeFileId && updated.length > 0) {
        setActiveFileId(updated[0].id);
      }
      return updated;
    });
  }, [activeFileId, files.length]);

  const downloadProject = useCallback(() => {
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

  const renderSidebarContent = () => {
    switch (sidebarView) {
      case 'explorer':
        return (
          <FileExplorer
            files={files}
            activeFileId={activeFileId}
            onFileSelect={setActiveFileId}
            onNewFile={handleNewFile}
            onDeleteFile={handleDeleteFile}
            onDownload={downloadProject}
          />
        );
      default:
        return (
          <Sidebar
            view={sidebarView}
            files={files}
            activeFileId={activeFileId}
            onFileSelect={setActiveFileId}
            onNewFile={handleNewFile}
            onDownload={downloadProject}
          />
        );
    }
  };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
        <MobileHeader 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onDownload={downloadProject}
          onNewFile={handleNewFile}
          onToggleAI={() => setShowAI(!showAI)}
          onToggleLivePreview={() => setShowMobileLivePreview(!showMobileLivePreview)}
          showLivePreview={showMobileLivePreview}
          activeFile={activeFile}
        />
        
        {!sidebarCollapsed && (
          <div className="h-64 border-b border-[#3c3c3c]">
            {renderSidebarContent()}
          </div>
        )}
        
        {showAI && (
          <div className="h-80 border-b border-[#3c3c3c]">
            <AIAssistant
              onClose={() => setShowAI(false)}
              currentFile={activeFile}
              onCodeGenerate={(code) => handleFileContentChange(code)}
              onNewFile={handleNewFile}
              files={files}
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
        
        {showMobileLivePreview && activeFile?.language === 'html' && (
          <MobileLivePreview
            code={activeFile.content}
            onClose={() => setShowMobileLivePreview(false)}
          />
        )}
        
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
          {renderSidebarContent()}
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
        
        {!panelCollapsed && showTerminal && (
          <div className="h-64 border-t border-[#3c3c3c]">
            <Terminal onClose={() => setShowTerminal(false)} />
          </div>
        )}
        
        <StatusBar 
          file={activeFile}
          cursorPosition={{ line: 1, column: 1 }}
          onTogglePanel={() => {
            setPanelCollapsed(!panelCollapsed);
            if (panelCollapsed) setShowTerminal(true);
          }}
        />
      </div>
      
      {showAI && (
        <div className="w-80 border-l border-[#3c3c3c] flex-shrink-0">
          <AIAssistant
            onClose={() => setShowAI(false)}
            currentFile={activeFile}
            onCodeGenerate={(code) => handleFileContentChange(code)}
            onNewFile={handleNewFile}
            files={files}
          />
        </div>
      )}
    </div>
  );
};

export default Index;

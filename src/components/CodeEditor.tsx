
import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { EditorFile } from '@/types/editor';

interface CodeEditorProps {
  file?: EditorFile;
  onContentChange: (content: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onContentChange }) => {
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      onContentChange(value);
    }
  }, [onContentChange]);

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1e1e1e] text-[#cccccc]">
        <div className="text-center">
          <h2 className="text-xl mb-2">Welcome to Code Editor</h2>
          <p className="text-sm opacity-70">Open a file to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={file.language}
        language={file.language}
        value={file.content}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          cursorBlinking: 'blink',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          contextmenu: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          parameterHints: { enabled: true },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

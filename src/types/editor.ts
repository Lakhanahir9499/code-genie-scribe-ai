
export interface EditorFile {
  id: string;
  name: string;
  content: string;
  language: string;
  isActive: boolean;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export type SidebarView = 'explorer' | 'search' | 'git' | 'extensions';

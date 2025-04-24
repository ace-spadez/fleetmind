export type SidebarItem = {
  id: string;
  icon: React.ReactNode;
  name: string;
  active?: boolean;
};

export type Module = 'home' | 'chat' | 'docs' | 'code' | 'chart' | 'organization' | 'budget' | 'settings';

export type Bot = {
  id: string;
  name: string;
  avatar?: string;
};

export type Channel = {
  id: string;
  name: string;
  botId?: string;
  type: 'primary' | 'directive';
  active?: boolean;
  botType?: string;
  isActive?: boolean;
};

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  botId?: string;
  timestamp: Date;
  userName?: string;
  botName?: string;
};

export type ChatData = {
  channelId: string;
  messages: Message[];
};

export type FileType = 'folder' | 'file';

export type File = {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  children?: File[];
  expanded?: boolean;
  active?: boolean;
  parentId?: string;
  extension?: string;
};

export type TreeNode = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  path: string;
  expanded?: boolean;
  active?: boolean;
  content?: string;
};

export type EditorTab = {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  active: boolean;
  isDirty?: boolean;
};

export type EditorPane = {
  id: string;
  tabs: EditorTab[];
  activeTabId: string | null;
  size?: number; // For flex sizing in split views
};

export type EditorLayout = {
  direction: 'horizontal' | 'vertical';
  panes: EditorPane[];
  sizes?: number[]; // Array of flex values for panes 
};

export type BotRole = 'ceo' | 'vp' | 'manager' | 'developer';

export type OrgBot = {
  id: string;
  name: string;
  role: BotRole;
  description?: string;
  position?: { x: number, y: number };
};

export type ConnectionType = 'directive' | 'communication';

export type BotConnection = {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
};

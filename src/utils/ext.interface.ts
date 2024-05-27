export interface ExtItem {
  id: string;
  name: string;
  icon: string | ArrayBuffer;
  description: string;
  installType: string;
  [key: string]: any;
}

export interface RecentlyItem {
  value?: string;
  icon?: string;
  extIds?: string[];
  name?: string;
  pendingUrl?: string;
  isCommand?: boolean;
}

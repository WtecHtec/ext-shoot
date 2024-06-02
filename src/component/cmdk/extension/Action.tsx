import { Command } from 'motion-cmdk';
import React from 'react';

import { CopyNameIcon, ExecuteIcon, ExtensionIcon, StoreIcon } from '~component/icons';

import { ExitAndClearSearch } from './command';
import { Shortcut, ShortCutKBD } from './ShortCut';
import withRun from './utils';

interface ActionPanelProps {
  value: string;
  keywords: string[];
  onSelect: () => void;
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
  cls?: string;
  Shortcut?: Shortcut;
}

const BaseAction = ({ value, keywords, onSelect, Shortcut, icon, cls = '' }: ActionPanelProps) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <ExtensionIcon base64={icon} />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
  };

  const handleSelect = () => {
    typeof onSelect === 'function' && onSelect();
  };

  const renderValue = () => {
    return value;
  };
  const renderShortcut = () => {
    return (
      <div cmdk-motionshot-submenu-shortcuts="">
        {Shortcut ? (
          <ShortCutKBD
            Shortcut={{
              key: Shortcut.key,
              modifiers: Shortcut.modifiers
            }}
          />
        ) : null}
      </div>
    );
  };
  return (
    <Command.Item
      className={cls ? cls : ''}
      value={value}
      keywords={keywords}
      onSelect={() => {
        handleSelect();
      }}>
      {renderIcon()}
      {renderValue()}
      {renderShortcut()}
    </Command.Item>
  );
};

interface OpenTabProps {
  url: string;
  title?: string;
}

const openNewTab = ({ url }) => {
  window.open(url, '_blank');
  ExitAndClearSearch();
};
const OpenTab = ({ title, url }: OpenTabProps) => {
  if (!title) {
    title = 'Open Tab';
  }
  return (
    <BaseAction value={title} keywords={['open', 'tab']} icon={<StoreIcon />} onSelect={() => openNewTab({ url })} />
  );
};

// 示例原有接口
interface GoToProps {
  url: string;
  title?: string;
}

const navigateToUrl = ({ url }) => {
  window.location.href = url;
};

const GoTo: React.FC<GoToProps> = ({ title = 'Go To', url }) => {
  return (
    <BaseAction value={title} keywords={['go', 'to']} icon={<StoreIcon />} onSelect={() => navigateToUrl({ url })} />
  );
};

interface CopyToClipboardProps {
  content: string;
  title?: string;
  shortcut?: Shortcut;
}
const CopyToClipboard = ({ content, title, shortcut }: CopyToClipboardProps) => {
  if (!title) {
    title = 'Copy to Clipboard';
  }
  return (
    <BaseAction
      value={title}
      keywords={['copy', 'clipboard']}
      icon={<CopyNameIcon />}
      Shortcut={shortcut}
      onSelect={() => {
        navigator.clipboard.writeText(content);
      }}
    />
  );
};
interface ExecuteCommandProps {
  handle: () => void;
}
const ExecuteCommand = ({ handle }: ExecuteCommandProps) => {
  return (
    <BaseAction
      value={'Execute Command'}
      keywords={['execute', 'command']}
      icon={<ExecuteIcon />}
      onSelect={() => {
        handle();
      }}
      Shortcut={{
        key: 'return'
      }}
    />
  );
};

const Action = {
  BaseAction,
  OpenTab: withRun(OpenTab, openNewTab),
  GoTo: withRun(GoTo, navigateToUrl),
  CopyToClipboard,
  ExecuteCommand
};

export { Action };

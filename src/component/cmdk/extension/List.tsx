/* eslint-disable react/no-unknown-property */

import { Command } from 'motion-cmdk';
import React, { useEffect, useId } from 'react';

import { ExtensionIcon } from '~component/icons';

import { actionManager } from '../action';
import { DEFAULT_AUTHOR } from '../core/constant';

interface ListItemProps {
  title: string;
  subtitle?: string;
  keywords?: string[];
  id?: string;
  type?: string;
  extension?: string | null;
  actions?: React.ReactNode;
  icon?: string | React.ReactNode;
  labels?: React.ReactNode[];
  children?: React.ReactNode;
  onSelect?: any;
  cls?: string;
  right?: string | React.ReactNode;
}

export function Item(props: ListItemProps) {
  const { title, extension, type, icon, labels, actions, children, onSelect, cls = '', ...etc } = props;

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <ExtensionIcon base64={icon} />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
  };

  const renderLabel = () => {
    if (!labels) return null;
    if (Array.isArray(labels)) {
      return labels.map((item, index) => (
        <span key={index} className="cmdk-motionsho-label-item">
          {item}
        </span>
      ));
    }
  };

  const renderExtensionName = () => {
    if (extension === null) return '';
    if (!extension) return DEFAULT_AUTHOR;
    return extension;
  };

  const renderKind = () => {
    if (!type) return 'Command';
    return type;
  };

  const handleSelect = () => {
    typeof onSelect === 'function' && onSelect();
  };

  const registerActionPanel = () => {
    actionManager.registerAction(id, actions);
    // actionManager.logAllActions();
  };
  useEffect(() => {
    registerActionPanel();
  }, []);

  const id = useId();

  return (
    <div
      className={cls ? cls : ''}
      {...etc}
      id={id}
      onSelect={() => {
        handleSelect();
      }}>
      {renderIcon()}
      <div>
        <h3>{title}</h3>
      </div>
      {children}
      <span cmdk-motionshot-sub="" style={{ flexShrink: 0 }}>
        {' '}
        {renderExtensionName()}
      </span>
      <span cmdk-motionshot-meta="" style={{ flexShrink: 0 }}>
        <span cmdk-motionshot-label="" style={{ flexShrink: 0 }}>
          {renderLabel()}
        </span>{' '}
        {renderKind()}
      </span>
    </div>
  );
}

export function CMDItem(props: ListItemProps) {
  const { title, extension, type, icon, labels, actions, children, onSelect, cls = '', ...etc } = props;

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <ExtensionIcon base64={icon} />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
  };

  const renderLabel = () => {
    if (!labels) return null;
    if (Array.isArray(labels)) {
      return labels.map((item, index) => (
        <span key={index} className="cmdk-motionsho-label-item">
          {item}
        </span>
      ));
    }
  };

  const renderExtensionName = () => {
    if (extension === null) return '';
    if (!extension) return DEFAULT_AUTHOR;
    return extension;
  };

  const renderKind = () => {
    if (!type) return 'Command';
    return type;
  };

  const handleSelect = () => {
    typeof onSelect === 'function' && onSelect();
  };

  const registerActionPanel = () => {
    actionManager.registerAction(id, actions);
    // actionManager.logAllActions();
  };
  useEffect(() => {
    registerActionPanel();
  }, []);

  const id = useId();

  return (
    <Command.Item
      className={cls ? cls : ''}
      {...etc}
      id={id}
      onSelect={() => {
        handleSelect();
      }}>
      {renderIcon()}
      <div>
        <h3>{title}</h3>
      </div>
      {children}
      <span cmdk-motionshot-sub="" style={{ flexShrink: 0 }}>
        {' '}
        {renderExtensionName()}
      </span>
      <span cmdk-motionshot-meta="" style={{ flexShrink: 0 }}>
        <span cmdk-motionshot-label="" style={{ flexShrink: 0 }}>
          {renderLabel()}
        </span>{' '}
        {renderKind()}
      </span>
    </Command.Item>
  );
}

const InfoItem = ({ id, onSelect, icon, title, right, subtitle, children }: ListItemProps) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <ExtensionIcon base64={icon} />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
  };
  const renderRight = () => {
    if (!right) return null;
    if (typeof right === 'string') {
      return (
        <div className="snap-seek-item-url" rel="noreferrer">
          {' '}
          {right}
        </div>
      );
    }
    if (React.isValidElement(right)) {
      return right;
    }
  };
  const handleSelect = () => {
    typeof onSelect === 'function' && onSelect();
  };
  const renderChildren = () => {
    if (!children && !subtitle) return null;
    if (React.isValidElement(children)) {
      return children;
    }
    if (subtitle) {
      return <div className="snap-seek-text-content">{subtitle}</div>;
    }
    return null;
  };
  return (
    <>
      <div key={id} onClick={handleSelect} snap-seek-cmdk-item="">
        <div className="snap-seek-item">
          {renderIcon()}
          <div className="snap-seek-item-title">{title}</div>
          {renderRight()}
        </div>
        {renderChildren()}
      </div>
    </>
  );
};

const Tag = ({ content }: { content: string | React.ReactNode }) => {
  return <div className="snap-seek-item-search-tag"> {content}</div>;
};

const List = { Item, InfoItem, Tag, CMDItem };

export default List;

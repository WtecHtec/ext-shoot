import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'motion-cmdk';
import React from 'react';

import { eventBus } from '~component/cmdk/panel/event-bus';
import { GlobeIcon } from '~component/icons';
import { getMutliLevelProperty } from '~utils/util';

export default function SnapshotCommand({
  inputRef,
  listRef,
  value,
  onChange,
  datas,
  extShootRef
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLElement>;
  extShootRef: React.RefObject<HTMLElement>;
  onChange?: any;
  datas?: any;
  value?: any;
}) {
  const [open, setOpen] = React.useState(false);
  const subCommandInputRef = React.useRef<HTMLInputElement>(null);
  const [refresh, setRefresh] = React.useState(0);
  const [showLabel, setShowLabel] = React.useState('All');
  const [snapshotDatas, setSnapshotDatas] = React.useState([]);
  const [valueId, setValueId] = React.useState('');
  React.useEffect(() => {
    if (!Array.isArray(datas)) return;
    const { name } = datas.find(({ id }) => id === value) || {};
    name && setShowLabel(name);
    setSnapshotDatas(datas);
    setValueId(value);
  }, [value, datas]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRefresh(Math.random());
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  React.useEffect(() => {
    function inputListener(event) {
      if ([27, 37, 38, 39, 40, 13].includes(event.keyCode) || (event.metaKey && event.key.toLocaleUpperCase() === 'K'))
        return;
      if (event.metaKey) return;
      // 阻止事件冒泡
      event.stopPropagation();
    }
    if (subCommandInputRef.current && open) {
      subCommandInputRef.current.autofocus = true;
      subCommandInputRef.current.focus();
      subCommandInputRef?.current?.addEventListener('keydown', inputListener);
    }
    return () => {
      if (subCommandInputRef && subCommandInputRef.current) {
        subCommandInputRef?.current?.removeEventListener('keydown', inputListener);
      }
    };
  }, [refresh, subCommandInputRef, open]);

  React.useEffect(() => {
    const el = extShootRef.current;
    function listener() {
      // if (e.key.toLocaleUpperCase() === 'K' &&  e.metaKey) {
      // 	e.preventDefault();
      // 	setOpen((o) => !o);
      // 	e.stopPropagation();
      // }
    }
    function escClose(state) {
      const dialogs = getMutliLevelProperty(state, 'dialogs', []);
      if (dialogs.length && dialogs[dialogs.length - 1] === 'snap_command') {
        eventBus.dispath('openSnapCommand');
        setOpen(false);
      }
    }
    el && el.addEventListener('keydown', listener);
    eventBus.on('close', escClose);
    return () => {
      el && el.removeEventListener('keydown', listener);
      eventBus.off('close', escClose);
    };
  }, [extShootRef]);

  React.useEffect(() => {
    const el = listRef.current;

    if (!el) return;

    if (open) {
      eventBus.dispath('openSnapCommand');
      el.style.overflow = 'hidden';
      el.style.pointerEvents = 'none';
    } else {
      eventBus.dispath('closeSnapCommand');
      el.style.overflow = '';
      el.style.pointerEvents = 'all';
    }
  }, [open, listRef]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger cmdk-motionshot-subcommand-trigger="" onClick={() => setOpen(true)} aria-expanded={open}>
        <div className="snap-picker">
          <label>{showLabel}</label>
          <ChevronDownIcon />
        </div>
      </Popover.Trigger>
      <Popover.Content
        side="top"
        align="end"
        className="motionshot-submenu"
        sideOffset={16}
        alignOffset={0}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          inputRef?.current?.focus();
        }}>
        <Command value={valueId} onValueChange={setValueId}>
          <Command.List>
            <Command.Empty>No Results</Command.Empty>
            {snapshotDatas && snapshotDatas.length
              ? snapshotDatas.map(({ id, name }) => (
                  <Command.Item
                    key={id}
                    value={id}
                    keywords={[name]}
                    onSelect={() => {
                      setShowLabel(name);
                      setOpen(false);
                      typeof onChange === 'function' && onChange(id);
                    }}>
                    <GlobeIcon></GlobeIcon>
                    {name}
                  </Command.Item>
                ))
              : null}
          </Command.List>
          <Command.Input autoFocus ref={subCommandInputRef} placeholder="Search for snapshot..." tabIndex={-2} />
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}

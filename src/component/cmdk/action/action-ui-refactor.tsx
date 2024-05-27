import * as Popover from '@radix-ui/react-popover';
import { Command } from 'motion-cmdk';
import React from 'react';

import { eventBus } from '~component/cmdk/panel/event-bus';
import { getMutliLevelProperty } from '~utils/util';

import { appManager } from '../app/app-manager';
import { actionManager } from './action-manager';

export default function ActionUi({
  inputRef,
  listRef,
  extShootRef,
  value
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLElement>;
  extShootRef: React.RefObject<HTMLElement>;
  value?: any;
}) {
  const [open, setOpen] = React.useState(false);
  const subCommandInputRef = React.useRef<HTMLInputElement>(null);
  const [refresh, setRefresh] = React.useState(0);
  const [title, setTitle] = React.useState(actionManager.title);
  const [placeholder, setPlaceholder] = React.useState(actionManager.placeholder);
  const [selectCmd, setSelectCmd] = React.useState(appManager.selectCmd);

  const [SelectActions, setSelectActions] = React.useState(actionManager.getAction(title) as any);

  React.useEffect(() => {
    const unsubscribe = actionManager.subscribe(({ title, placeholder }) => {
      setTitle(title);
      setPlaceholder(placeholder);
    });
    return () => {
      unsubscribe(); // Clean up the subscription when the component unmounts
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = appManager.subscribe(({ selectCmd }) => {
      setSelectActions(actionManager.getAction(selectCmd));
    });
    return () => {
      unsubscribe(); // Clean up the subscription when the component unmounts
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = appManager.subscribe(
      ({ selectCmd }) => {
        setSelectCmd(selectCmd);
      },
      {
        target: ['selectCmd']
      }
    );
    return () => {
      unsubscribe(); // Clean up the subscription when the component unmounts
    };
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRefresh(Math.random());
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const isCommand = getMutliLevelProperty(value, 'isCommand', true);
    const id = getMutliLevelProperty(value, 'id', '');
    if ((!value && isCommand) || !id) return;
  }, [value, open]);

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

    function listener(e: KeyboardEvent) {
      if (e.key.toLocaleUpperCase() === 'K' && e.metaKey) {
        e.preventDefault();
        setOpen((o) => !o);
        e.stopPropagation();
      }
    }

    function escClose(state) {
      const dialogs = getMutliLevelProperty(state, 'dialogs', []);
      console.log('dialogs', dialogs);
      if (dialogs.length && dialogs[dialogs.length - 1] === 'sub_command') {
        eventBus.dispath('closeSubCommand');
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
      eventBus.dispath('openSubCommand');
      el.style.overflow = 'hidden';
      el.style.pointerEvents = 'none';
    } else {
      eventBus.dispath('closeSubCommand');
      el.style.overflow = '';
      el.style.pointerEvents = 'all';
    }
  }, [open, listRef]);

  // const renderActionTitle = (title: string) => {
  //   return (
  //     <h1 className={"sub_command_title"}>{title}</h1>
  //   );
  // };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger cmdk-motionshot-subcommand-trigger="" onClick={() => setOpen(true)} aria-expanded={open}>
        Actions
        <kbd>⌘</kbd>
        <kbd>K</kbd>
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
        <Command>
          <h1 className={'sub_command_title'}>{title ?? selectCmd}</h1>
          <Command.List>
            <Command.Empty>No Results</Command.Empty>
            {SelectActions && React.cloneElement(SelectActions, { title: 'Actions' })}
          </Command.List>
          <Command.Input
            autoFocus
            ref={subCommandInputRef}
            placeholder={placeholder}
            tabIndex={-2}
            id="subCommandInput"
          />
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}

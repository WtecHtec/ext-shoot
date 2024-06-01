import React from 'react';

export type KeyModifier = 'cmd' | 'ctrl' | 'opt' | 'shift';

export type KeyEquivalent =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '.'
  | ','
  | ';'
  | '='
  | '+'
  | '-'
  | '['
  | ']'
  | '{'
  | '}'
  | '«'
  | '»'
  | '('
  | ')'
  | '/'
  | '\\'
  | "'"
  | '`'
  | '§'
  | '^'
  | '@'
  | '$'
  | 'return'
  | 'delete'
  | 'deleteForward'
  | 'tab'
  | 'arrowUp'
  | 'arrowDown'
  | 'arrowLeft'
  | 'arrowRight'
  | 'pageUp'
  | 'pageDown'
  | 'home'
  | 'end'
  | 'space'
  | 'escape'
  | 'enter'
  | 'backspace';

export interface Shortcut {
  /**
   * The modifier keys of the keyboard shortcut.
   */
  modifiers?: KeyModifier[];
  /**
   * The key of the keyboard shortcut.
   */
  key: KeyEquivalent;
}

const ShortCutKBD = ({ Shortcut }: { Shortcut: Shortcut }) => {
  // cmd ->⌘
  // ctrl -> ⌃
  // opt -> ⌥
  // shift -> ⇧
  const { modifiers, key } = Shortcut;
  const modifierMap = {
    cmd: '⌘',
    ctrl: '⌃',
    opt: '⌥',
    shift: '⇧'
  };

  const upercaseKey = (key: string) => {
    return key.toUpperCase();
  };

  const keyMap = {
    return: '⏎',
    delete: '⌫',
    deleteForward: '⌦',
    arrowUp: '↑',
    arrowDown: '↓',
    arrowLeft: '←',
    arrowRight: '→'
  };

  const keyRender = () => {
    if (keyMap[key]) {
      return keyMap[key];
    }
    return upercaseKey(key);
  };

  return (
    <>
      {modifiers &&
        modifiers.map((modifier) => {
          return <kbd key={modifier}>{modifierMap[modifier]}</kbd>;
        })}
      <kbd>{keyRender()}</kbd>
    </>
  );
};

export { ShortCutKBD };

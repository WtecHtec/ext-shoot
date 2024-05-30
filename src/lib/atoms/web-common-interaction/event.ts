// eventTypes.ts
export type EventType =
  | 'mouse-event'
  | 'focus-event'
  | 'touch-event'
  | 'keyboard-event'
  | 'wheel-event'
  | 'input-event'
  | 'event';

export const eventMap: { [key: string]: EventType } = {
  click: 'mouse-event',
  dblclick: 'mouse-event',
  mouseup: 'mouse-event',
  mousedown: 'mouse-event',
  mouseenter: 'mouse-event',
  mouseleave: 'mouse-event',
  mouseover: 'mouse-event',
  mouseout: 'mouse-event',
  mousemove: 'mouse-event',
  focus: 'focus-event',
  blur: 'focus-event',
  input: 'input-event',
  change: 'event',
  touchstart: 'touch-event',
  touchend: 'touch-event',
  touchmove: 'touch-event',
  touchcancel: 'touch-event',
  keydown: 'keyboard-event',
  keyup: 'keyboard-event',
  submit: 'event',
  wheel: 'wheel-event'
};

interface EventParams {
  [key: string]: any;
}

export function getEventObj(name: string, params: EventParams): Event {
  const eventType: EventType = eventMap[name] ?? 'event';
  let event: Event;

  switch (eventType) {
    case 'mouse-event':
      event = new MouseEvent(name, { ...params, view: window });
      break;
    case 'focus-event':
      event = new FocusEvent(name, params);
      break;
    case 'touch-event':
      event = new TouchEvent(name, params);
      break;
    case 'keyboard-event':
      event = new KeyboardEvent(name, params);
      break;
    case 'wheel-event':
      event = new WheelEvent(name, params);
      break;
    case 'input-event':
      event = new InputEvent(name, params);
      break;
    default:
      event = new Event(name, params);
  }

  return event;
}

export default function triggerEvent(element: HTMLElement, name: string, params: EventParams): void {
  const event = getEventObj(name, params);
  const useNativeMethods = ['focus', 'submit', 'blur'];

  if (useNativeMethods.includes(name) && typeof (element as any)[name] === 'function') {
    (element as any)[name]();
  } else {
    element.dispatchEvent(event);
  }
}

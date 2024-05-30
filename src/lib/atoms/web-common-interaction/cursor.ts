export function clickElement(element) {
  if (!element) return false;
  const eventOpts = { bubbles: true, view: window };
  if (!element.click) {
    element.dispatchEvent(new MouseEvent('mousedown', eventOpts));
    element.dispatchEvent(new MouseEvent('mouseup', eventOpts));
    element.dispatchEvent(new PointerEvent('click', eventOpts));
  } else {
    element.click();
  }
  element.focus?.();
  return true;
}

export function clickJQueryElement(element: JQuery<HTMLElement>) {
  return clickElement(element.get(0));
}

export const triggerFromCursor = {
  clickElement,
  clickJQueryElement
};

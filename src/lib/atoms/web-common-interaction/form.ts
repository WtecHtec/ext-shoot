import triggerEvent from './event';
import { sleep } from './utils';

interface TextFieldData {
  value: string;
  delay?: number;
  clearValue?: boolean;
}

interface CheckboxRadioData {
  selected: boolean;
}

interface SelectData {
  value: string;
  selectOptionBy?: 'first-option' | 'last-option' | 'custom-position';
  optionPosition?: number;
}

function formEvent(element: HTMLElement, eventType: string, inputType: string, value: string): void {
  const eventInit: EventInit = { bubbles: true, cancelable: true, composed: false };
  triggerEvent(element, eventType, { inputType, data: value, ...eventInit });
  element.dispatchEvent(new Event('change', eventInit));
}

export async function typeText(element: HTMLInputElement | HTMLTextAreaElement, data: TextFieldData): Promise<void> {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
    throw new Error(
      `Unsupported element type: ${element}. Only HTMLInputElement and HTMLTextAreaElement are supported.`
    );
  }

  element.focus();
  if (data.clearValue) {
    element.value = '';
    formEvent(element, 'input', 'deleteContentBackward', '');
  }

  for (const char of data.value) {
    element.value += char;
    formEvent(element, 'input', 'insertText', char);
    if (data.delay) await sleep(data.delay);
  }

  element.blur();
}

export function toggleCheck(element: HTMLInputElement, data: CheckboxRadioData): void {
  if (element.type !== 'checkbox' && element.type !== 'radio') {
    throw new Error(`Element is not a checkbox or radio button: ${element.type}`);
  }

  element.checked = data.selected;
  formEvent(element, 'change', 'change', data.selected.toString());
}

export function selectOption(element: HTMLSelectElement, data: SelectData): void {
  if (element.tagName !== 'SELECT') {
    throw new Error('Element is not a select dropdown');
  }

  const options = Array.from(element.options);
  let selectedOption: HTMLOptionElement | undefined;

  switch (data.selectOptionBy) {
    case 'first-option':
      selectedOption = options[0];
      break;
    case 'last-option':
      selectedOption = options.at(-1);
      break;
    case 'custom-position': {
      const index = Math.min(Math.max(0, data.optionPosition! - 1), options.length - 1);
      selectedOption = options[index];
      break;
    }
    default:
      selectedOption = options.find((option) => option.value === data.value);
      break;
  }

  if (selectedOption) {
    element.value = selectedOption.value;
    formEvent(element, 'change', 'change', selectedOption.value);
  } else {
    throw new Error('Selected option is undefined.');
  }
}

export const triggerFromElement = {
  typeText,
  toggleCheck,
  selectOption
};

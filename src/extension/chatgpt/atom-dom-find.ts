import $ from 'jquery';

export function shareBtn(): JQuery<HTMLElement> {
  return $('button[data-testid="fruit-juice-profile"]').parent().find('span').find('button');
}

export const atom = {
  chatgpt: {
    findShareBtn: shareBtn
  }
};

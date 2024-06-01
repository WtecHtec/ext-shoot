import $ from 'jquery';

export function shareBtn(): JQuery<HTMLElement> {
  return $('button[data-testid="fruit-juice-profile"]').parent().find('span').find('button');
}

export function lastChatBlock() {
  const chatMessages = $('[data-testid^="conversation-turn-"]');
  return chatMessages.last();
}

function btnActionsLastChatBlock() {
  return lastChatBlock()
    .find('div.flex.items-center')
    .filter(function () {
      return $(this).find('span > svg, div > svg').length >= 3;
    })
    .last();
}

export function regenerateBtn() {
  return btnActionsLastChatBlock().find('button').eq(2);
}

export function copyLastBtn() {
  return btnActionsLastChatBlock().find('button').eq(1);
}

export function readLastBtn() {
  return btnActionsLastChatBlock().find('button').eq(0);
}

export const atom = {
  chatgpt: {
    findShareBtn: shareBtn,
    findChatReloadBtn: regenerateBtn,
    findCopyBtn: copyLastBtn,
    findReadBtn: readLastBtn
  }
};

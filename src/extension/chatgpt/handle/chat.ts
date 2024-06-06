import $ from 'jquery';

export function totalChatMessages() {
  const chatMessages = $('[data-testid^="conversation-turn-"]');
  return chatMessages.length;
}

export function hasConversations() {
  return totalChatMessages() > 0;
}

export function getLastChatBlock() {
  const chatMessages = $('[data-testid^="conversation-turn-"]');
  return chatMessages.last();
}

export function getCodeCopyBtns(ChatBlock: JQuery<HTMLElement>) {
  return ChatBlock.find('pre button');
}

export function getLastChatCodeCopyBtn() {
  return getCodeCopyBtns(getLastChatBlock()).last();
}

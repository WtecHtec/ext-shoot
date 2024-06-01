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

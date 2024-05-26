import $ from 'jquery';
import toast from "~component/cmdk/toast";

/**
 * 提取消息信息
 * @param messageElement 消息元素
 * @returns 消息信息对象
 */
function extractMessageInfo(messageElement: JQuery<HTMLElement>): { sender: string, content: string, time: string } {
    const messageItem = messageElement.find('.js-message-item');
    const messageText = messageItem.find('.message-text .text-only').text();
    const systemText = messageItem.find('.system-text').text();
    const ariaLabel = messageElement.find('span[aria-label]').attr('aria-label') || '';

    // 提取时间和发送人
    const timeMatch = ariaLabel.match(/(\d{2}:\d{2}:\d{2})/);
    const senderMatch = ariaLabel.match(/(.*?)(?= sent:)/);

    const time = timeMatch ? timeMatch[0] : '未知时间';
    const sender = senderMatch ? senderMatch[1].trim() : '系统消息';
    const content = messageText || systemText;

    return { sender, content, time };
}
/**
 * 显示消息通知
 * @param messageInfo 消息信息对象
 */
function displayMessageNotification(messageInfo: { sender: string, content: string, time: string }): void {
    if (messageInfo.content) {
        toast(`发送者: ${messageInfo.sender}, 内容: ${messageInfo.content}, 时间: ${messageInfo.time}`);
    }
}

/**
 * 处理最新一条消息
 */
function processLatestMessage(): void {
    const messages = $('.messageItem-wrapper');
    const latestMessage = messages.last(); // 只处理最新的一条消息

    if (latestMessage.length > 0) {
        const messageInfo = extractMessageInfo(latestMessage);
        displayMessageNotification(messageInfo);
    }
}

/**
 * 初始化消息处理和观察者
 */
export async function initMessageProcessor(): Promise<void> {
    // 初次处理已经存在的消息
    processLatestMessage();

    // 创建 MutationObserver 实例
    const observer = new MutationObserver(function (mutations: MutationRecord[]) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                processLatestMessage();
            }
        });
    });

    // 配置 MutationObserver 监听添加子节点的变化
    const config: MutationObserverInit = { childList: true, subtree: true };

    // 监听 .chatMessages 元素的变化
    const chatMessagesElement = document.querySelector('.chatMessages');
    if (chatMessagesElement) {
        observer.observe(chatMessagesElement, config);
    }
}

import TabManager from "~lib/atoms/browser-tab-manager";
import $ from 'jquery';
import toast from "~component/cmdk/toast";

const tabAction = TabManager.action;

/**
 * 保存Memo
 * @label dom
 */
export const saveMemo = () => {
    if ((!isInMemoEditePage())) {
        toast('请在flomo编辑页面使用');
        return;
    }
    // Focus on the editor
    $('#fl_editor .tiptap.ProseMirror').focus();

    // Create a new KeyboardEvent object to simulate CMD+Enter key press event
    const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13, // Enter key code
        metaKey: true, // Command key pressed
        bubbles: true, // Ensure the event bubbles up
        cancelable: true // Allow the event to be cancelled
    });

    // Dispatch the event to the editor
    $('#fl_editor .tiptap.ProseMirror')[0].dispatchEvent(event);

};

/**
 * 判断是否在flomo的编辑页面
 * @label dom
 */
export const isInMemoEditePage = () => {
    const urlPattern = /^https:\/\/v\.flomoapp\.com\/mine/;
    return urlPattern.test(window.location.href);
};


/**
 * 同步数据
 */
export const syncData = async () => {
    $('.sync-icon').parent()[0].click();
};

/**
 * 切换子页面
 * @label dom tab
 */
export const goto = {
    wechat: () => {
        tabAction.changeCurrentTabUrl("https://v.flomoapp.com/mine?source=wechat");
    },
    all: () => {
        tabAction.changeCurrentTabUrl("https://v.flomoapp.com/mine");
    },
    recycle: () => {
        tabAction.changeCurrentTabUrl("https://v.flomoapp.com/mine?source=recycle");
    }
};


export function readClipboard() {
    return new Promise((resolve, reject) => {
        if (!navigator.clipboard) {
            reject("该浏览器不支持 Clipboard API");
            return;
        }

        navigator.clipboard.readText().then(
            clipText => {
                resolve(clipText);
            },
            err => {
                reject("无法读取剪贴板内容：" + err);
            }
        );
    });
}


function formatTextToHTML(text: string): string {
    const lines: string[] = text.split('\n');
    let html: string = '';
    for (let i = 0; i < lines.length; i++) {
        html += `<p>${lines[i]}</p>`;
    }
    return html;
}

function appendToContentEditable(html: string): void {
    $('.editor-content .ProseMirror').append(html);
}

export function replaceStateToContentEditable(html: string): void {
    $('.editor-content .ProseMirror').html(html);
}

export async function saveClipboardToFlomo() {
    const text = await readClipboard();
    if (!text) {
        toast('剪贴板为空');
        return;
    }
    const html = formatTextToHTML(text as string);
    await appendToContentEditable(html);
    await saveMemo();

}

export async function saveTextToFlomo(text) {
    if (!text) {
        toast('文本为空');
        return;
    }
    const html = formatTextToHTML(text);
    await appendToContentEditable(html);
    await saveMemo();

}

export async function testIt() {
    await saveTextToFlomo('Hello, Flomo!');
}
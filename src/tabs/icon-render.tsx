import React from 'react';


// 创建一个函数，接收 icon url 返回 base64 对象
function getBase64FromIconUrl(iconUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', iconUrl, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                const blob = xhr.response;
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    resolve(base64data as string);
                };
                reader.onerror = () => {
                    reject(new Error('Failed to convert blob to base64'));
                };
                reader.readAsDataURL(blob);
            } else {
                reject(new Error(`Failed to fetch icon: ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Network error'));
        };
        xhr.send();
    });
}


// 接收来自bg的消息

// Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'get_extension_icon_blob') {
        console.log(request);
        const { iconURL } = request;
        getBase64FromIconUrl(iconURL).then((base64data) => {
            sendResponse({ iconDataUrl: base64data});
        }).catch((err) => {
            sendResponse({ error: err.message });
        });
        return true;
    }
});
export default function iconRender() {

    return (
        <div
            style={ {
                display: 'flex',
                flexDirection: 'column',
                padding: 16,
            } }>
            <h2>IconRender</h2>
            <img src="chrome://extension-icon/onnepejgdiojhiflfoemillegpgpabdm/128/0"
                 style={ {
                     width: 16,
                     height: 16,
                 } }
            ></img>
        </div>
    );
}

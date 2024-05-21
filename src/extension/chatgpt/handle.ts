
// import TabManager from "~lib/atoms/browser-tab-manager";
import { postTask } from "~lib/exec-task-to-web";

// const tabAction = TabManager.action;

/**
 * 
 * @returns {
 * screenName: string,
 * username: string,
 * }
 */

export async function getCurrentUserProfile() {
    // alert(`当前用户是：${name}`);
    const result = await postTask('(function() { return window.__NEXT_DATA__.props.pageProps.user.email; })()',) as any;
    // filter
    return result;
}

export async function testIt() {
    const result = await getCurrentUserProfile();
    console.log('result', result);
}


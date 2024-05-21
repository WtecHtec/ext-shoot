
// import TabManager from "~lib/atoms/browser-tab-manager";
import toast from "~component/cmdk/toast";
import ScriptInjector from "~lib/script-Injector";

// const tabAction = TabManager.action;

export async function safeInjectJQuery() {
    const execInjector = ScriptInjector.getInstance(chrome.runtime.getURL('jquery.js'));
    // Ensure the script is loaded before posting the task
    await new Promise<void>((resolve, reject) => {
        execInjector.inject({
            async: true,
            onLoad: () => {
                toast('JQuery loaded successfully!');
                resolve();
            },
            onError: (error) => {
                toast.error('Error loading JQuery ~');
                reject(error);
            }
        });
    });

}


export async function testIt() {
    await safeInjectJQuery();
}
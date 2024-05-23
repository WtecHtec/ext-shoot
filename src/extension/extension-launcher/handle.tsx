import axios from "axios";
import { ExtShootSeverHost } from "~config/config";
import { handlePluginStatus } from "~utils/management";
import { toast } from "sonner/dist";
/**
 * 禁用、启用插件
 * @param status
 */
export const onHanldePulginStatus = async ({ id, status }) => {
    await handlePluginStatus(id, status);
    // getExtensionDatas();
    toast(status ? "Enable Plugin Success" : "Disable Plugin Success", {
        duration: 1000
    });
    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

// 激活插件 /activeExtention name
export const onHandleActiveExtension = ({ id, name, enabled }: { id: string, name: string, enabled: boolean }) => {
    if (!enabled) {
        // 激活插件前，先启用插件
        onHanldePulginStatus({ id, status: true });
        // 刷新当前网页 才能注入插件
        window.location.reload();
    }
    axios
        .post(`${ExtShootSeverHost}/active-extension`, {
            extId: id,
            name: name
        })
        .then((response) => {
            console.log(response.data);
            toast("Active Plugin Success", {
                duration: 2000
            });
        })
        .catch((error) => {
            console.error(error);
            toast("Need Start Local Server", {
                description: "npx extss start",
                action: {
                    label: "Copy",
                    onClick: () => {
                        navigator.clipboard.writeText("npx extss start");
                    }
                },
                duration: 8000,
                closeButton: true
            });
        });
};


/**
 * 打开插件文件夹路径
 */
export const onHandleShowInFinder = ({ id, name }) => {
    axios
        .post(`${ExtShootSeverHost}/open-extension`, {
            extId: id,
            name: encodeURIComponent(name)
        })
        .then((response) => {
            console.log(response.data);
            toast("Open Plugin Folder Success", {
                duration: 2000
            });
        })
        .catch((error) => {
            console.error(error);
            toast("Need Start Local Server", {
                description: "npx extss start",
                action: {
                    label: "Copy",
                    onClick: () => {
                        navigator.clipboard.writeText("npx extss start");
                    }
                },
                duration: 8000,
                closeButton: true
            });
        });
};

import { getJikeToken } from "./handle";
import { JikeClient } from "jike-api";

// https://jike-api.vercel.app/
const apiConfig = {
    endpointId: 'jike',
    endpointUrl: 'https://api.ruguoapp.com/',
    bundleId: 'com.ruguoapp.jike',
    buildNo: '2961',
    appVersion: '7.56.2',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Jike/7.56.2 /sa-sdk-ios/sensors-verify/tr.ruguoapp.com?jike',
    accessToken: ''
};

// 单例模式保证JikeClient实例全局唯一
let clientInstance = null as JikeClient;

const getToken = async (tokenType) => {
    const tokenMap = await getJikeToken();
    return tokenMap.get(tokenType);
};

export const updateApiConfig = async () => {
    apiConfig.accessToken = await getToken("x-jike-access-token");
    console.log('apiConfig', apiConfig);
};

const initJikeClient = async () => {
    if (!clientInstance) {
        clientInstance = new JikeClient({
            ...apiConfig,
            refreshToken: await getToken("x-jike-refresh-token"),
        });
    }
    return clientInstance;
};

export const getUser = async () => {
    const client = await initJikeClient();
    const list = await client.apiClient.personalUpdate.single('27BF807A-FA4D-4B01-AAFD-05FAAA674335', {
        limit: 100,
    });
    console.log('list', list.data.data);
};

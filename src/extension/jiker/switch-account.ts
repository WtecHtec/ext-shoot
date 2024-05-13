
// 第一步 获取当前账户的用户名  getCurrentUserName
import $ from 'jquery';
import { getCurrentUserName } from "./handle";

// 第二部点击切换按钮
// $("#user-menu-downshift-toggle-button").click();

// 第三部 读取所有的账户

// $("li").has("img").each(function () {
//     console.log($(this).text().trim()); // 输出每个包含 img 的 li 元素的文本内容
// });

// 第四 找到不是当前账户的账户

// 第五部 点击切换账户


export const switchAccount = async () => {
    const currentUserName = await getCurrentUserName();
    $("#user-menu-downshift-toggle-button").click();
    const accounts = [];
    $("li").has("img").each(function () {
        const account = $(this).text().trim();
        if (account !== currentUserName) {
            accounts.push(account);
        }
    });
    const account = accounts[0];
    $(`li:contains(${account})`).click();
    return account;
};
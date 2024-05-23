
// 第一步 获取当前账户的用户名  getCurrentUserName
import $ from 'jquery';
import toast from '~component/cmdk/toast';

// todo: edge case 
export const switchTheme = async () => {
    $("#user-menu-downshift-toggle-button").click();
    $("#user-menu-downshift-menu li:first").click();
    toast("切换主题成功");

    return null;
};
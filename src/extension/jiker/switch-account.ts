// 第一步 获取当前账户的用户名  getCurrentUserName
import $ from 'jquery';
import { toast } from 'sonner/dist';

import { getCurrentUserName } from './handle';

// todo: edge case
export const switchAccount = async () => {
  const currentUserName = await getCurrentUserName();
  $('#user-menu-downshift-toggle-button').click();
  const accounts = [];
  $('li')
    .has('img')
    .each(function () {
      const account = $(this).text().trim();
      if (account !== currentUserName) {
        accounts.push(account);
      }
    });
  if (accounts.length === 0) {
    toast('没有其他账户可以切换');
    $('#user-menu-downshift-toggle-button').click();
    return;
  }
  const account = accounts[0];
  $(`li:contains(${account})`).click();
  return account;
};

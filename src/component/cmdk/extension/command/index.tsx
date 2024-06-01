// ExitAndClearSearch 函数
// ExitAndClearSearch 函数
import { PlaceholderCommand, SimpleCommand } from '~component/cmdk/extension/command/base';
import { exitPanel } from '~component/cmdk/panel';
import { searchManager } from '~component/cmdk/search/search-manager';

export const ExitAndClearSearch = () => {
  searchManager.clearSearch();
  exitPanel();
};
// 导出 CommandPanel 和 Command 组件
const Command = {
  SimpleCommand,
  PlaceholderCommand
};
export { Command };

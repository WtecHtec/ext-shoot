import { Navigator, PlaceholderCommand, SimpleCommand } from '~component/cmdk/extension/command/base';
import { exitPanel } from '~component/cmdk/panel';
import { searchManager } from '~component/cmdk/search/search-manager';

export const ExitAndClearSearch = () => {
  searchManager.clearSearch();
  exitPanel();
};

const Command = {
  SimpleCommand,
  PlaceholderCommand,
  Navigator
};
export { Command };

import { Navigator, PlaceholderCommand, Simple } from '~component/cmdk/extension/command/base';
import { exitPanel } from '~component/cmdk/panel';
import { searchManager } from '~component/cmdk/search/search-manager';

export const ExitAndClearSearch = () => {
  searchManager.clearSearch();
  exitPanel();
};

const Command = {
  Simple,
  PlaceholderCommand,
  Navigator
};
export { Command };

export const Motion = Command;

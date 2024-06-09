import { Navigator, PlaceholderCommand, Simple } from '~component/cmdk/extension/motion/base';
import { exitPanel } from '~component/cmdk/panel';
import { searchManager } from '~component/cmdk/search/search-manager';

export const ExitAndClearSearch = () => {
  searchManager.clearSearch();
  exitPanel();
};

export const Motion = {
  Simple,
  PlaceholderCommand,
  Navigator
};

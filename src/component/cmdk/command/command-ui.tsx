import { Command as CommandCMDK } from "cmdk";
import React, { useEffect, useState } from "react";

// import { ExtensionManagerCommand } from "~extension";
import ChromeStoreSearch from "~extension/chrome-store-search";
import ChromeStoreWebSearch from "~extension/chrome-store-web-search";
import HistorySearch from "~extension/history-search";
import InstantOpen from "~extension/instant-open";
import TableManager from "~extension/tab-manager";
import WindowsManager from "~extension/window-agent";
import CacheAgent from "~extension/cache-agent";
import QuickOpen from "~extension/quick-open";
import Jiker from "~extension/jiker";
import WebTraffic from "~extension/web-traffic";
import Flomor from "~extension/flomor";
import X from "~extension/x";
import ChatGPT from "~extension/chatgpt";
import DevTools from "~extension/devtools";

import { Command } from "../common/Command";
import { searchManager } from "../search/search-manager";
import { ExtensionLauncher } from "~extension";
// import { ExtensionLauncher, ExtensionManagerCommand } from "~extension";

function ExtensionWithSearchLoader() {
  const [search, setSearch] = useState(searchManager.content);
  useEffect(() => {
    const unsubscribe = searchManager.subscribe(
      ({ search }) => {
        setSearch(search);
      },
      {
        target: ["search"]
      }
    );
    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    search && (
      <CommandCMDK.Group heading={`Use "${search}" with ... `}>
        <HistorySearch search={search}></HistorySearch>
        <ChromeStoreSearch search={search}></ChromeStoreSearch>
        <ChromeStoreWebSearch search={search}></ChromeStoreWebSearch>
        <InstantOpen search={search}></InstantOpen>
      </CommandCMDK.Group>
    )
  );
}

const ExtensionLoader = () => {
  return (
    <CommandCMDK.Group heading={"Results"}>
      <Command.PlaceholderCommand />
      <Jiker />
      <X />
      <DevTools />
      <ChatGPT />
      <Flomor />
      <WebTraffic />
      <ExtensionLauncher />
      {/* <ExtensionManagerCommand /> */}
      <TableManager />
      <WindowsManager />
      <CacheAgent />
      <QuickOpen />
    </CommandCMDK.Group>
  );
};

const CommandUI = () => {
  return (
    <>
      <ExtensionLoader />
      <ExtensionWithSearchLoader />
    </>
  );
};

export { CommandUI };

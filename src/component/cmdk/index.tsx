/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable */
import { Command } from "motion-cmdk";
import React, { useEffect, useState } from "react";

import FooterTip from "~component/cmdk/tip/tip-ui";

import Action from "./action/action-ui-refactor";
import { appManager } from "./app/app-manager";
import AppUI from "./app/app-ui";
import NotFound from "./common/NotFound";
import { searchManager } from "./search/search-manager";
import SearchComponent from "./search/search-ui";
import { CommandUI } from "./command/command-ui";
import { initEscControl } from "./panel/esc-control";
import { topicManager } from "./topic/topic-manager";

export function MotionShotCMDK() {
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef(null);
  const [search, setSearch] = useState(searchManager.content);
  const extShootRef = React.useRef(null);
  const [inAppMode, setInAppMode] = React.useState(searchManager.ifInApp);


  useEffect(() => {
    const unsubscribe = searchManager.subscribe(({ search }) => { setSearch(search); }, { target: ["search"] })
      ; return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = appManager.subscribe(({ inAppMode }) => {
      setInAppMode(inAppMode);
    });
    return unsubscribe;
  }, []);



  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [search]);


  const onCommandFilter = (value, search, keywords) => {
    const topics = topicManager.activeKeywords;

    if (!search && topics) {
      const foundTopic = topics.some(topic => keywords.includes(topic));
      return foundTopic ? 10 : 1;
    }

    if (!search) return 1;

    const found = keywords.find(item => item.toLowerCase().includes(search.toLowerCase()));
    return found ? 1 : 0;
  };

  const handleChangeSelectCmd = (value) => {
    appManager.changeSelectCmd(value);
    setValue(value);
  };

  useEffect(() => {
    initEscControl();
  })

  return (
    <div className="super-motion" ref={extShootRef}>
      <Command
        value={value}
        onValueChange={(v) => handleChangeSelectCmd(v)}
        vimBindings={true}
        filter={onCommandFilter}>
        <div cmdk-motionshot-top-shine="" />
        <div className="flex items-center justify-start">
          <SearchComponent inputRef={inputRef} />
        </div>
        <hr cmdk-motionshot-loader="" />
        <>
          {
            <Command.List ref={listRef} hidden={inAppMode}>
              <NotFound.NotFoundWithIcon />
              <CommandUI />
            </Command.List>
          }
          {
            <>
              <AppUI />
            </>
          }
        </>
        <div cmdk-motionshot-footer="">
          <FooterTip />
          <hr />
          <button
            cmdk-motionshot-open-trigger=""
            onClick={() => { }}>
            Execute Motion
            <kbd>↵</kbd>
          </button>
          <hr />
          <Action
            listRef={listRef}
            inputRef={inputRef}
            extShootRef={extShootRef}
          />
        </div>
      </Command>
    </div>
  );
}

import ExtensionLogo from "data-base64:./icon.png";
import React from "react";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import { gotoJqueryGPTs } from "./goto";
import { testIt } from "./handle";


const TabManagerComand = () => {

  return (
    <CommandPanel title="GPTs" icon={ExtensionLogo}>


      <Command.SimpleCommand
        name="test"
        title="获取当前用户信息"
        keywords={["test"]}
        description="test"
        endAfterRun
        handle={async () => {
          await testIt();
        }}
      />
      {/* gotoJqueryGPTs */}
      <Command.SimpleCommand
        name="jquery-coding-boy"
        title="Jquery Coding Boy"
        keywords={["gotoJqueryGPTs"]}
        description="gotoJqueryGPTs"
        endAfterRun
        handle={async () => {
          await gotoJqueryGPTs();
        }}
      />

    </CommandPanel>
  );


};

export default TabManagerComand;

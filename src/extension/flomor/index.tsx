import ExtensionLogo from "data-base64:./icon.png";
import React, { useEffect } from "react";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import { saveClipboardToFlomo, testIt } from "./handle";


// export const loadFlomoAction = () => {

//   window.saveClipboardToFlomo = saveClipboardToFlomo;
//   window.testIt = testIt;
//   console.log("flomor loaded");
//   console.log("window.saveClipboardToFlomo", window.saveClipboardToFlomo);
// };

const TabManagerComand = () => {
  useEffect(() => {
    // loadFlomoAction();
  }, []);
  return (
    <CommandPanel title="flomor" icon={ExtensionLogo}>


      <Command.SimpleCommand
        name="test"
        title="test"
        keywords={["test"]}
        description="test"
        endAfterRun
        handle={async () => {
          await testIt();
        }}
      />
      <Command.SimpleCommand
        name="saveClipboardToFlomo"
        title="把剪贴板的内容保存为Memo"
        keywords={["save", "clipboard", "flomo"]}
        description="将剪贴板的内容保存到Flomo"
        endAfterRun
        handle={async () => {
          await saveClipboardToFlomo();
        }}
      />
    </CommandPanel>
  );


};

export default TabManagerComand;

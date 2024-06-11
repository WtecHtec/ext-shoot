import React, { useEffect, useState } from 'react';

import { Motion, MotionPack } from '~component/cmdk/extension';

const SuperInputTest = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };
  return (
    <MotionPack title="SuperInput">
      <Motion.Simple
        name="inputTranslate"
        title="将当前输入内容翻译成英文"
        keywords={['翻译', 'translate', 'search', 'input', 'keywords']}
        description="将当前内容翻译成英文"
        endAfterRun
        handle={async () => {
          await handleClick();
        }}
      />
      {/* <Motion.Simple
        name="inputTranslate2"
        title="将当前输入内容翻译成英文"
        keywords={['翻译', 'translate', 'search', 'input', 'keywords']}
        description="将当前内容翻译成英文"
        endAfterRun
        handle={async () => {
          await handleClick();
        }}
      /> */}
    </MotionPack>
  );
};

export { SuperInputTest };

// 示例组件，使用了 Hooks
export function SuperInputTest2({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // 组件挂载后的逻辑
  }, []);

  return <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />;
}

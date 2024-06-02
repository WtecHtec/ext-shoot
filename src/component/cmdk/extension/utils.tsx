import React from 'react';

export interface PureProps {
  pure?: boolean;
  [key: string]: any;
}

type WithPureProps<P> = P & PureProps; // 将任何传入类型 P 与 PureProps 结合

function withRun<T extends PureProps>(
  Component: React.ComponentType<T>,
  executeFunction: (props: Omit<T, 'pure'>) => void
) {
  const WrapperComponent = function (props: T) {
    const { pure, ...restProps } = props;
    if (pure) {
      executeFunction(restProps as Omit<T, 'pure'>);
      return null;
    }
    return <Component {...(props as WithPureProps<T>)} />;
  };
  WrapperComponent.run = (props: Omit<T, 'pure'>) => executeFunction(props);
  return WrapperComponent;
}

export default withRun;

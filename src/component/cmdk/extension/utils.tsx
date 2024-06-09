import React from 'react';

export interface PureProps {
  pure?: boolean;
  [key: string]: any;
}

type WithPureProps<P> = P & PureProps;

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
    return <Component {...(props as WithPureProps<T>)} execute={executeFunction} />;
  };
  WrapperComponent.run = (props: Omit<T, 'pure'>) => executeFunction(props);
  return WrapperComponent;
}

export default withRun;

import * as React from 'react';

export interface AppConsumerProps {
  width?: number;
  height?: number;
}

export const AppContext = React.createContext<AppConsumerProps>({
  width: 0,
  height: 0,
});

export function appConsumer<T>(comp: T): T {
  return function AppConsumerComp(props: any) {
    const C: any = comp;
    return <AppContext.Consumer>{value => <C {...value} {...props} />}</AppContext.Consumer>;
  } as any;
}

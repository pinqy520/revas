// For image assets
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}
declare module '*.mp4' {
  const src: string;
  export default src;
}

// If you have other asset types like SVG, add them here
// declare module '*.svg' {
//   import * as React from 'react';
//   export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
//   const src: string;
//   export default src;
// }

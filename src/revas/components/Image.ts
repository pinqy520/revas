import * as React from 'react';
import * as imageLoader from './common/imageLoader';
import drawImage from './common/drawImage';
import { NodeProps } from '../core/Node';

export type ImageViewProps = {
  src: string;
} & NodeProps;

const DEFAULT_STYLE = { path: true };

export default function ImageView(props: ImageViewProps) {
  const { src, style } = props;
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (src) {
      const onReady = () => setReady(true);
      imageLoader.get(src, onReady);
      return () => imageLoader.remove(src, onReady);
    }
  }, [src]);

  return React.createElement('Image', {
    customDrawer: ready ? drawImage : void 0,
    ...props,
    style: [DEFAULT_STYLE, style],
    $ready: ready,
  });
}

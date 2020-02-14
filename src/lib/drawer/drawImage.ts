import { Node } from '../core/Node'
import * as imageLoader from '../imageLoader'
import { getStyleAndFrameFromNode, clamp } from '../core/utils'

export default function drawImage(ctx: CanvasRenderingContext2D, node: Node) {
  const image = imageLoader.get(node.props.src)
  if (image.naturalHeight === 0) return
  const [style, frame] = getStyleAndFrameFromNode(node)

  const { width, height, x, y } = frame

  const actualSize = {
    width: image.naturalWidth,
    height: image.naturalHeight
  };

  const scale = Math.max(
    width / actualSize.width,
    height / actualSize.height
  ) || 1;

  const scaledSize = {
    width: actualSize.width * scale,
    height: actualSize.height * scale
  };

  const focusPoint = style.focusPoint || {
    x: actualSize.width * 0.5,
    y: actualSize.height * 0.5
  };

  // Clip the image to rectangle (sx, sy, sw, sh).
  const sx = Math.round(clamp(width * 0.5 - focusPoint.x * scale, width - scaledSize.width, 0)) * (-1 / scale);
  const sy = Math.round(clamp(height * 0.5 - focusPoint.y * scale, height - scaledSize.height, 0)) * (-1 / scale);
  const sw = Math.round(actualSize.width - (sx * 2));
  const sh = Math.round(actualSize.height - (sy * 2));

  // Scale the image to dimensions (dw, dh).
  const dw = Math.round(width);
  const dh = Math.round(height);

  // Draw the image on the canvas at coordinates (dx, dy).
  const dx = Math.round(x);
  const dy = Math.round(y);

  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}
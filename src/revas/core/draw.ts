import { Node } from "./Node";
import { getStyleFromNode, getFrameFromNode, sortByZIndexAscending } from "./utils";

export function drawNode(ctx: CanvasRenderingContext2D, node: Node) {
  const style = getStyleFromNode(node)
  const frame = getFrameFromNode(node)

  if (style.opacity <= 0) return

  ctx.save()   // Area Range
  // Opacity:
  if (style.opacity !== null && style.opacity < 1) {
    ctx.globalAlpha = style.opacity;
  }

  // Translation:
  if (style.translateX || style.translateY) {
    ctx.translate(style.translateX || 0, style.translateY || 0);
    // TODO: tranform: rotate scale...
  }

  const radius = style.borderRadius || 0
  ctx.beginPath();
  ctx.moveTo(frame.x + radius, frame.y);
  ctx.arcTo(frame.x + frame.width, frame.y, frame.x + frame.width, frame.y + frame.height, radius);
  ctx.arcTo(frame.x + frame.width, frame.y + frame.height, frame.x, frame.y + frame.height, radius);
  ctx.arcTo(frame.x, frame.y + frame.height, frame.x, frame.y, radius);
  ctx.arcTo(frame.x, frame.y, frame.x + frame.width, frame.y, radius);
  ctx.closePath();

  if (style.overflow === 'hidden')
    ctx.clip()

  const background = style.backgroundColor || 'transparent'

  ctx.save()   // Draw Self Start
  // Background color & Shadow
  if (background !== 'transparent') {
    // Shadow:
    ctx.shadowBlur = style.shadowBlur;
    ctx.shadowColor = style.shadowColor;
    ctx.shadowOffsetX = style.shadowOffsetX;
    ctx.shadowOffsetY = style.shadowOffsetY;
    ctx.fillStyle = background;
    ctx.fill();
  }

  // Border with border radius:
  if (style.borderColor && style.borderWidth > 0) {
    ctx.lineWidth = style.borderWidth;
    ctx.strokeStyle = style.borderColor;
    ctx.stroke();
  }
  ctx.restore() // Draw Self  End

  if (node.props.customDrawer) {
    ctx.save() // Draw Inner
    node.props.customDrawer(ctx, node);
    ctx.restore()
  }

  // Draw child layers, sorted by their z-index.
  node.children
    .slice()
    .sort(sortByZIndexAscending)
    .forEach(child => {
      drawNode(ctx, child);
    });

  ctx.restore()
}
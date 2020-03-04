import { Node } from "./Node";
import { getStyleFromNode, getFrameFromNode, sortByZIndexAscending } from "./utils";
import { observeAnimatedValue } from "./Animated";
import { Container } from "./Container";

function getRadius(style: any) {
  return {
    tl: style.borderTopLeftRadius || style.borderRadius || 0,
    tr: style.borderTopRightRadius || style.borderRadius || 0,
    bl: style.borderBottomLeftRadius || style.borderRadius || 0,
    br: style.borderBottomRightRadius || style.borderRadius || 0,
  }
}

export function drawNode(ctx: CanvasRenderingContext2D, node: Node, root: Container) {
  const style = getStyleFromNode(node)
  const frame = getFrameFromNode(node)

  if (style.opacity <= 0) return

  ctx.save()   // Area Range

  // Animated Styles
  const opacity = observeAnimatedValue(root.draw, style.opacity)
  const translateX = observeAnimatedValue(root.draw, style.translateX, 0)
  const translateY = observeAnimatedValue(root.draw, style.translateY, 0)
  const scale = observeAnimatedValue(root.draw, style.scale)
  const scaleX = observeAnimatedValue(root.draw, style.scaleX, scale)
  const scaleY = observeAnimatedValue(root.draw, style.scaleY, scale)
  const rotate = observeAnimatedValue(root.draw, style.rotate)

  // Opacity:
  if (opacity !== null && opacity < 1) {
    ctx.globalAlpha = opacity;
  }
  // Translation:
  if (translateX || translateY) {
    ctx.translate(translateX, translateY);
  }
  // Rotate && Scale
  if (rotate || scaleX || scaleY) {
    // Origin Center
    const originX = frame.x + frame.width / 2
    const originY = frame.y + frame.height / 2
    ctx.translate(originX, originY);
    if (rotate)
      ctx.rotate(rotate);
    if (scaleX || scaleY)
      ctx.scale(scaleX, scaleY);
    ctx.translate(-originX, -originY);
  }


  // Draw Path
  const radius = getRadius(style)
  ctx.beginPath();
  ctx.moveTo(frame.x + radius.tl, frame.y);
  ctx.arcTo(frame.x + frame.width, frame.y, frame.x + frame.width, frame.y + frame.height, radius.tr);
  ctx.arcTo(frame.x + frame.width, frame.y + frame.height, frame.x, frame.y + frame.height, radius.br);
  ctx.arcTo(frame.x, frame.y + frame.height, frame.x, frame.y, radius.bl);
  ctx.arcTo(frame.x, frame.y, frame.x + frame.width, frame.y, radius.tl);
  ctx.closePath();

  if (style.overflow === 'hidden')
    ctx.clip()

  ctx.save()   // Draw Self Start
  // Background color & Shadow
  const background = style.backgroundColor || 'transparent'
  if (background !== 'transparent') {
    // Shadow:
    if (style.shadowColor) {
      ctx.shadowBlur = style.shadowBlur;
      ctx.shadowColor = style.shadowColor;
      ctx.shadowOffsetX = style.shadowOffsetX;
      ctx.shadowOffsetY = style.shadowOffsetY;
    }
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
      drawNode(ctx, child, root);
    });

  ctx.restore()
}
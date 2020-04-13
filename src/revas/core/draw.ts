import { Node } from "./Node";
import { getMergedStyleFromNode, getFrameFromNode, sortByZIndexAscending, setShadow, pushOpacity } from "./utils";
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
  const style = getMergedStyleFromNode(node, root.draw)
  const frame = getFrameFromNode(node)

  if (style.opacity <= 0) return

  // flags
  const hasTransform = style.translateX || style.translateY
    || style.rotate || style.scaleX || style.scaleY || style.scale
  const hasBG = style.backgroundColor && style.backgroundColor !== 'transparent'
  const hasBorder = style.borderColor && style.borderWidth > 0
  const hasRadius = style.borderRadius
    || style.borderTopLeftRadius
    || style.borderTopRightRadius
    || style.borderBottomLeftRadius
    || style.borderBottomRightRadius
  const hasClip = style.overflow === 'hidden'

  const useFrame = hasBG || hasBorder || hasClip || style.path
  const usePath = hasRadius || hasClip || style.path
  const useSave = hasTransform || hasClip

  if (useSave)
    ctx.save()   // Area Range

  // Opacity:
  const popOpacity = pushOpacity(ctx, style.opacity)

  // Translation:
  if (style.translateX || style.translateY) {
    ctx.translate(style.translateX || 0, style.translateY || 0);
  }
  // Rotate && Scale
  if (style.rotate || style.scaleX || style.scaleY || style.scale) {
    // Origin Center
    const originX = frame.x + frame.width / 2
    const originY = frame.y + frame.height / 2
    ctx.translate(originX, originY);
    if (style.rotate)
      ctx.rotate(style.rotate);
    if (style.scaleX || style.scaleY || style.scale)
      ctx.scale(style.scaleX || style.scale, style.scaleY || style.scale);
    ctx.translate(-originX, -originY);
  }


  if (useFrame) {

    if (usePath) {
      // Draw Path
      ctx.beginPath();
      if (hasRadius) {
        const radius = getRadius(style)
        ctx.moveTo(frame.x + radius.tl, frame.y);
        ctx.arcTo(frame.x + frame.width, frame.y, frame.x + frame.width, frame.y + frame.height, radius.tr);
        ctx.arcTo(frame.x + frame.width, frame.y + frame.height, frame.x, frame.y + frame.height, radius.br);
        ctx.arcTo(frame.x, frame.y + frame.height, frame.x, frame.y, radius.bl);
        ctx.arcTo(frame.x, frame.y, frame.x + frame.width, frame.y, radius.tl);
      } else {
        ctx.rect(frame.x, frame.y, frame.width, frame.height)
      }
      ctx.closePath();

      if (hasClip)
        ctx.clip()
    }

    if (hasBG || hasBorder) {
      // Shadow:
      const resetShadow = setShadow(
        ctx,
        style.shadowColor,
        style.shadowOffsetX,
        style.shadowOffsetY,
        style.shadowBlur,
      )
      // Background color & Shadow
      if (hasBG) {
        ctx.fillStyle = style.backgroundColor;
        if (usePath) {
          ctx.fill();
        } else {
          ctx.fillRect(frame.x, frame.y, frame.width, frame.height)
        }
      }

      // Border with border radius:
      if (hasBorder) {
        ctx.lineWidth = style.borderWidth;
        ctx.strokeStyle = style.borderColor;
        if (usePath) {
          ctx.stroke();
        } else {
          ctx.strokeRect(frame.x, frame.y, frame.width, frame.height)
        }
      }
      resetShadow()
    }
  }

  if (node.props.customDrawer) {
    node.props.customDrawer(ctx, node);
  }

  // Draw child layers, sorted by their z-index.
  node.children
    .slice()
    .sort(sortByZIndexAscending)
    .forEach(child => {
      drawNode(ctx, child, root);
    });

  popOpacity()

  if (useSave)
    ctx.restore()
}


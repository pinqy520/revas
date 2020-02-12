import { Node } from "./Node";


function getLayerAndFrameFromNode(node: Node) {
  const { props: layer, layout } = node
  const frame = { x: layout!.left, y: layout!.top, width: layout!.width, height: layout!.height }
  return [layer, frame]
}

/**
 * Draw a RenderLayer instance to a <canvas> context.
 *
 * @param {CanvasRenderingContext2d} ctx
 * @param {RenderLayer} layer
 */
export function drawRenderLayer(ctx: CanvasRenderingContext2D, node: Node) {
  const [layer] = getLayerAndFrameFromNode(node)

  // Performance: avoid drawing hidden layers.
  if (typeof layer.alpha === 'number' && layer.alpha <= 0) {
    return;
  }

  // Establish drawing context for certain properties:
  // - alpha
  // - translate
  const saveContext = (layer.alpha !== null && layer.alpha < 1) ||
    (layer.translateX || layer.translateY);

  if (saveContext) {
    ctx.save();

    // Alpha:
    if (layer.alpha !== null && layer.alpha < 1) {
      ctx.globalAlpha = layer.alpha;
    }

    // Translation:
    if (layer.translateX || layer.translateY) {
      ctx.translate(layer.translateX || 0, layer.translateY || 0);
    }
  }

  // Draw default properties, such as background color.
  ctx.save();
  drawBaseRenderLayer(ctx, node);

  // Draw custom properties if needed.
  node.props.customDrawer && node.props.customDrawer(ctx, layer);
  ctx.restore();

  // Draw child layers, sorted by their z-index.
  node.children.slice().sort(sortByZIndexAscending).forEach(function (child) {
    drawRenderLayer(ctx, child);
  });

  // Pop the context state if we established a new drawing context.
  if (saveContext) {
    ctx.restore();
  }
}

export function drawBaseRenderLayer(ctx: CanvasRenderingContext2D, node: Node) {
  const [layer, frame] = getLayerAndFrameFromNode(node)

  // Border radius:
  if (layer.borderRadius) {
    ctx.beginPath();
    ctx.moveTo(frame.x + layer.borderRadius, frame.y);
    ctx.arcTo(frame.x + frame.width, frame.y, frame.x + frame.width, frame.y + frame.height, layer.borderRadius);
    ctx.arcTo(frame.x + frame.width, frame.y + frame.height, frame.x, frame.y + frame.height, layer.borderRadius);
    ctx.arcTo(frame.x, frame.y + frame.height, frame.x, frame.y, layer.borderRadius);
    ctx.arcTo(frame.x, frame.y, frame.x + frame.width, frame.y, layer.borderRadius);
    ctx.closePath();

    // Create a clipping path when drawing an image or using border radius.
    if (node.type === 'Image') {
      ctx.clip();
    }

    // Border with border radius:
    if (layer.borderColor) {
      ctx.lineWidth = layer.borderWidth || 1;
      ctx.strokeStyle = layer.borderColor;
      ctx.stroke();
    }
  }

  // Border color (no border radius):
  if (layer.borderColor && !layer.borderRadius) {
    ctx.lineWidth = layer.borderWidth || 1;
    ctx.strokeStyle = layer.borderColor;
    ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
  }

  // Shadow:
  ctx.shadowBlur = layer.shadowBlur;
  ctx.shadowColor = layer.shadowColor;
  ctx.shadowOffsetX = layer.shadowOffsetX;
  ctx.shadowOffsetY = layer.shadowOffsetY;

  // Background color:
  if (layer.backgroundColor) {
    ctx.fillStyle = layer.backgroundColor;
    if (layer.borderRadius) {
      // Fill the current path when there is a borderRadius set.
      ctx.fill();
    } else {
      ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
    }
  }
}

/**
 * @private
 */
function sortByZIndexAscending(nodeA: Node, nodeB: Node) {
  const [layerA] = getLayerAndFrameFromNode(nodeA)
  const [layerB] = getLayerAndFrameFromNode(nodeB)
  return (layerA.zIndex || 0) - (layerB.zIndex || 0);
}

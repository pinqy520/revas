import { Node } from "../core/Node"
import { getStyleAndFrameFromNode, getChars } from "../core/utils"

const DEFAULT_TEXTSTYLE = {
  fontWeight: "normal",
  fontSize: 24,
  color: "#000",
  fontStyle: "normal",
  textAlign: "start",
  textBaseline: "alphabetic",
}

export default function drawText(ctx: CanvasRenderingContext2D, node: Node) {
  const [s, frame] = getStyleAndFrameFromNode(node)
  const content: string = node.props.content
  const style = { ...DEFAULT_TEXTSTYLE, ...s }
  style.lineHeight = style.lineHeight || (style.fontSize * 1.1)
  ctx.save()
  // Apply Styles
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`
  ctx.fillStyle = style.color
  if (style.textShadow) {
    // TODO: Text Shadow
  }
  const chars = getChars(content)
  const lines: { width: number, text: string }[] = []
  let width = 0
  let temp = ''
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    if (char === '\n') {
      lines.push({ width, text: temp })
      width = 0
      temp = ''
    } else {
      const charWidth = ctx.measureText(char).width
      if (charWidth + width > frame.width) {
        lines.push({ width, text: temp })
        width = charWidth
        temp = char
      } else {
        width += charWidth
        temp += char
      }
    }
  }
  lines.push({ width, text: temp })

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    ctx.fillText(line.text, frame.x, style.lineHeight * (i + 1) + frame.y);
  }
  ctx.restore()
}

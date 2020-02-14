import { Node } from "../core/Node"
import { getChars, getStyleFromNode, getFrameFromNode } from "./utils"

const DEFAULT_TEXTSTYLE = {
  fontWeight: "normal",
  fontSize: 24,
  color: "#000",
  fontStyle: "normal",
  textBaseline: "alphabetic",
}

export default function drawText(ctx: CanvasRenderingContext2D, node: Node) {
  const _style = getStyleFromNode(node)
  const frame = getFrameFromNode(node)
  const content: string = node.props.content
  const style = { ...DEFAULT_TEXTSTYLE, ..._style }
  style.lineHeight = style.lineHeight || (style.fontSize * 1.1)
  ctx.save()
  // Apply Styles
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`
  ctx.fillStyle = style.color
  if (style.backgroundColor) {
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }
  const chars = getChars(content)
  const lines: { width: number, text: string }[] = []
  let _width = 0
  let _text = ''
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    if (char === '\n') {
      lines.push({ width: _width, text: _text })
      _width = 0
      _text = ''
    } else {
      const charWidth = ctx.measureText(char).width
      if (charWidth + _width > frame.width) {
        lines.push({ width: _width, text: _text })
        _width = charWidth
        _text = char
      } else {
        _width += charWidth
        _text += char
      }
    }
  }
  lines.push({ width: _width, text: _text })

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let x = frame.x
    switch (style.textAlign) {
      case 'center':
        x = x + (frame.width / 2) - (line.width / 2);
        break;
      case 'right':
        x = x + frame.width - line.width;
        break;
    }
    ctx.fillText(line.text, x, style.lineHeight * (i + 1) + frame.y);
  }
  ctx.restore()
}
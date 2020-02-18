import { Node } from "../core/Node"
import { getChars, getFrameFromNode, getWords } from "./utils"

const DEFAULT_TEXTSTYLE = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
  fontWeight: 'normal',
  fontSize: 14,
  color: '#000',
  fontStyle: 'normal',
  textBaseline: 'middle',
}

function getTextFromNode(node: Node) {
  const { content } = node.props
  if (typeof content === 'string') {
    return content
  } else if (Array.isArray(content)) {
    return content.join('')
  }
  return ''
}

function getTextStyleFromNode(node: Node) {
  const style = { ...DEFAULT_TEXTSTYLE, ...node.props.textStyle }
  style.lineHeight = style.lineHeight || (style.fontSize * 1.1)
  return style
}

// TODO: numberOfLines
function measureLines(ctx: CanvasRenderingContext2D, chars: readonly string[], width: number) {
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
      if (charWidth + _width > width) {
        _text && lines.push({ width: _width, text: _text })
        _width = charWidth
        _text = char
      } else {
        _width += charWidth
        _text += char
      }
    }
  }
  lines.push({ width: _width, text: _text })
  return lines
}

function splitContent(content: string, wordBreak: string) {
  switch (wordBreak) {
    case 'break-all':
      return getChars(content)
    case 'keep-all':
      return [content]
    default:
      return getWords(content)
  }
}

export function measureText(ctx: CanvasRenderingContext2D, node: Node): [any[], number] {
  const frame = getFrameFromNode(node)
  if (frame.width === 0) return [[], 0]
  const content = getTextFromNode(node)
  if (!content) return [[], 0]
  const style = getTextStyleFromNode(node)
  if (style.color === 'transparent') return [[], 0]

  // Apply Styles
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`
  ctx.fillStyle = style.color
  ctx.textBaseline = style.textBaseline
  // TODO: maybe remove when use shadowView structure
  if (style.backgroundColor) {
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }

  const lines = measureLines(ctx, splitContent(content, style.wordBreak), frame.width)
  return [lines, style.lineHeight * lines.length]
}


export function drawText(ctx: CanvasRenderingContext2D, node: Node, lines: any[]) {
  const frame = getFrameFromNode(node)
  const style = getTextStyleFromNode(node)

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
    ctx.fillText(line.text, x, style.lineHeight * (i + 0.5) + frame.y);
  }
}

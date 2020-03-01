import { Frame } from "../../core/Node"
import { getChars, getWords } from "../../core/utils"

export interface DrawTextOptions {
  textStyle: any,
  numberOfLines: number,
  frame: Frame,
  content: string
}

function measureLines(
  ctx: CanvasRenderingContext2D,
  chars: readonly string[],
  width: number,
  numberOfLines: number = 0
) {
  const lines: { width: number, text: string }[] = []
  let _width = 0
  let _text = ''

  function pushLine(charWidth = 0, char = '', force = false) {
    (force || _text) && lines.push({ width: _width, text: _text })
    _width = charWidth
    _text = char
  }
  for (let i = 0; i < chars.length; i++) {
    if (numberOfLines > 0 && lines.length > numberOfLines) {
      lines.pop()
      const lastLine = lines[lines.length - 1]
      lastLine.text = lastLine.text + '...'
      lastLine.width = ctx.measureText(lastLine.text).width
      return lines
    }
    const char = chars[i]
    if (char === '\n') {
      pushLine(0, '', true)
    } else {
      const charWidth = ctx.measureText(char).width
      if (charWidth + _width > width) {
        pushLine(charWidth, char)
      } else {
        _width += charWidth
        _text += char
      }
    }
  }
  pushLine()
  if (numberOfLines > 0 && lines.length > numberOfLines) {
    lines.pop()
    const lastLine = lines[lines.length - 1]
    lastLine.text = lastLine.text.slice(0, -3) + '...'
    lastLine.width = ctx.measureText(lastLine.text).width
    return lines
  }
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

export function applyTextStyle(ctx: CanvasRenderingContext2D, options: DrawTextOptions) {
  const { fontStyle, fontWeight, fontSize, fontFamily, textBaseline, color } = options.textStyle
  // Apply Styles
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textBaseline = textBaseline
}

export function measureText(ctx: CanvasRenderingContext2D, options: DrawTextOptions): [any[], number] {

  const lines = measureLines(
    ctx,
    splitContent(options.content, options.textStyle.wordBreak),
    options.frame.width,
    options.numberOfLines
  )
  return [lines, options.textStyle.lineHeight * lines.length]
}


export function drawText(ctx: CanvasRenderingContext2D, options: DrawTextOptions, lines: any[]) {
  const { textStyle: style, frame } = options

  // Shadow:
  if (style.textShadowColor) {
    ctx.shadowBlur = style.textShadowBlur;
    ctx.shadowColor = style.textShadowColor;
    ctx.shadowOffsetX = style.textShadowOffsetX;
    ctx.shadowOffsetY = style.textShadowOffsetY;
  }

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

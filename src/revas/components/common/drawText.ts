import { Frame } from "../../core/Node"
import { getChars, getWords, setShadow } from "../../core/utils"

export interface DrawTextOptions {
  textStyle: any,
  numberOfLines: number,
  frame: Frame,
  content: string
}

export type MeasureLine = { width: number, text: string }

export type MeasureResult = [MeasureLine[], number]

export const DEFAULT_MEASURE: MeasureResult = [[], 0]

function measureLines(
  ctx: CanvasRenderingContext2D,
  chars: readonly string[],
  boxWidth: number,
  numberOfLines: number
) {
  const lines: MeasureLine[] = []
  let width = 0
  let text = ''
  let cursor = -1
  function pushLine(charWidth = 0, char = '', force = false) {
    if (force || text) lines.push({ width, text })
    if (cursor < chars.length && numberOfLines > 0 && lines.length >= numberOfLines) {
      const lastLine = lines[lines.length - 1]
      lastLine.text = lastLine.text.slice(0, -3) + '...'
      lastLine.width = ctx.measureText(lastLine.text).width
      cursor = chars.length + 1
    } else {
      width = charWidth
      text = char.trim()
    }
  }
  while (cursor++ <= chars.length) {
    if (chars.length > cursor) {
      const char = chars[cursor]
      if (char === '\n') {
        pushLine(0, '', true)
      } else {
        const charWidth = ctx.measureText(char).width
        if (charWidth + width > boxWidth) {
          pushLine(charWidth, char)
        } else {
          width += charWidth
          text += char
        }
      }
    } else {
      pushLine()
    }
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

export function measureText(ctx: CanvasRenderingContext2D, options: DrawTextOptions): MeasureResult {

  const lines = measureLines(
    ctx,
    splitContent(options.content, options.textStyle.wordBreak),
    options.frame.width,
    options.numberOfLines
  )
  return [lines, options.textStyle.lineHeight * lines.length]
}


export function drawText(ctx: CanvasRenderingContext2D, options: DrawTextOptions, lines: MeasureLine[]) {
  const { textStyle: style, frame } = options

  // Shadow:
  const resetShadow = setShadow(
    ctx,
    style.textShadowColor,
    style.textShadowOffsetX,
    style.textShadowOffsetY,
    style.textShadowBlur,
  )

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
  resetShadow()
}

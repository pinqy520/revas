export default function () {
  const canvas = document.createElement('canvas')
  canvas.width = 500
  canvas.height = 500
  document.body.appendChild(canvas)
  return canvas

}
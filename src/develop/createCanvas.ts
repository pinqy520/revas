export default function () {
  const scale = window.devicePixelRatio
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth * scale
  canvas.height = window.innerHeight * scale
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'
  canvas.getContext('2d')!.scale(scale, scale)
  document.documentElement.style.overflow = 'hidden'
  document.body.appendChild(canvas)
  return canvas

}

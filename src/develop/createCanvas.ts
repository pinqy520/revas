export default function () {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  function onresize(e?: UIEvent) {
    const scale = window.devicePixelRatio
    canvas.width = window.innerWidth * scale
    canvas.height = window.innerHeight * scale
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    ctx.resetTransform()
    ctx.scale(scale, scale)
    e && canvas.onresize && canvas.onresize(e)
  }
  onresize()
  canvas.style.userSelect = 'none'
  document.documentElement.style.overflow = 'hidden'
  document.body.appendChild(canvas)
  window.onresize = onresize
  return canvas
}

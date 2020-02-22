export default function () {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  function onresize(e?: any) {
    if (window.innerHeight > 0 && window.innerHeight > 0
      && (window.innerHeight !== canvas.clientHeight
        || window.innerWidth !== canvas.clientWidth)) {
      const scale = window.devicePixelRatio
      canvas.width = window.innerWidth * scale
      canvas.height = window.innerHeight * scale
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.resetTransform()
      ctx.scale(scale, scale)
      e && canvas.onresize && canvas.onresize(e)
    }
  }
  onresize()
  canvas.className = 'canvas'
  document.body.appendChild(canvas)
  window.onorientationchange = window.onresize = () => requestAnimationFrame(onresize)// (e: any) => setTimeout(() => onresize(e), 500);
  return canvas
}

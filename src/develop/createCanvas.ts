export default function () {
  const canvas = document.createElement('canvas');
  const scale = window.devicePixelRatio;
  const width = Math.min(window.innerWidth, 450);
  const height = Math.min(window.innerHeight, 900);
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.setAttribute('style', `width: ${width}px; height: ${height}px;`);
  canvas.className = 'canvas';
  document.body.appendChild(canvas);
  return canvas;
}

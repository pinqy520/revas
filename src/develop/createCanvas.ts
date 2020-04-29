export default function () {
  const canvas = document.createElement('canvas');
  const scale = window.devicePixelRatio;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  canvas.className = 'canvas';
  document.body.appendChild(canvas);
  return canvas;
}

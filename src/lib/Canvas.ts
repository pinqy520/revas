export default class Canvas {
  constructor(
    private readonly _canvas: HTMLCanvasElement,
    public readonly width: number,
    public readonly height: number,
    public readonly scale: number,
  ) {
    this.width = width;
    this.height = height;
    this.scale = scale || window.devicePixelRatio;

    this._canvas.width = this.width * this.scale;
    this._canvas.height = this.height * this.scale;
    this._canvas.getContext('2d')!.scale(this.scale, this.scale);
  }

  getRawCanvas() {
    return this._canvas;
  }

  getContext() {
    return this._canvas.getContext('2d');
  }
} 
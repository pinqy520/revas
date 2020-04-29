import { Transform } from './Transform';

export class RevasCanvas {
  public readonly transform = new Transform();
  constructor(public readonly context: CanvasRenderingContext2D) {}

  apply() {
    this.transform.apply(this.context);
  }
}

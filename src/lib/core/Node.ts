export interface Layout {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

export class Node {
  public readonly children: Node[] = []
  public layout?: Layout
  public parent?: Node
  constructor(
    public readonly type: string,
    public props: any,
  ) { }
}

export class Container extends Node {
  constructor(
    public canvas: HTMLCanvasElement
  ) {
    super('root', {
      width: canvas.width,
      height: canvas.height,
    })
  }
}
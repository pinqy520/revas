export interface Layout {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

export class Node {
  public readonly children: ChildNode[] = []
  public layout?: Layout
  public parent?: Node
  constructor(
    public readonly type: string,
    public props: any,
  ) { }
}

export type ChildNode = Node | string
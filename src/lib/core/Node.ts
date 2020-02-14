import { ReactNode } from 'react'


export class Frame {
  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0
  ) { }
}

export class Node {
  public readonly children: Node[] = []
  public frame = new Frame()
  public parent?: Node
  constructor(
    public readonly type: string,
    public props: BaseProps & any,
  ) { }
}

export interface BaseProps {
  children?: ReactNode,
  style?: any
}
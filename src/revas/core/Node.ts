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

export interface RevasTouch {
  identifier: number,
  x: number,
  y: number,
}

export type RevasTouchType = 'touchstart' | 'touchmove' | 'touchend'

export interface RevasTouchEvent {
  type: RevasTouchType
  touches: { [key: number]: RevasTouch }
}

export type RevasTouchEventListener = (event: RevasTouchEvent) => any

export interface BaseProps {
  children?: ReactNode,
  style?: any,
}

export interface RawViewProps extends BaseProps {
  onTouchStart?: RevasTouchEventListener
  onTouchMove?: RevasTouchEventListener
  onTouchEnd?: RevasTouchEventListener
}